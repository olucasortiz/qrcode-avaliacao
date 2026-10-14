// Emulate static Pages headers/history locally. This is not a provider/HTTPS test.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { chromium } from '@playwright/test';

const dist = resolve(import.meta.dirname, '../dist');
const headerRules = await readFile(resolve(dist, '_headers'), 'utf8');
const apiOrigin = /connect-src 'self' (https:\/\/[^;\s]+)/.exec(headerRules)?.[1];
assert.ok(apiOrigin?.endsWith('.invalid'), 'Run this smoke with an example.invalid API build, never a production endpoint.');
assert.match(await readFile(resolve(dist, '_redirects'), 'utf8'), /\/\* \/index\.html 200/);
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.woff': 'font/woff', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    for (const line of headerRules.split('\n')) {
      const header = /^\s+([^:]+):\s*(.+)$/.exec(line);
      if (header) res.setHeader(header[1], header[2].trim());
    }
    let file = resolve(dist, `.${decodeURIComponent(new URL(req.url, 'http://local').pathname)}`);
    if (!file.startsWith(dist + sep)) file = resolve(dist, 'index.html');
    try { if (!(await stat(file)).isFile()) throw new Error('fallback'); }
    catch { file = resolve(dist, 'index.html'); }
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(500).end(); }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
const directory = resolve(import.meta.dirname, '../artifacts/deployment');
await mkdir(directory, { recursive: true });
try {
  browser = await chromium.launch();
  for (const width of [360, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.route(`${apiOrigin}/**`, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      titulo: 'Pesquisa sintetica de deploy', descricao: 'Verificacao local do bundle.', slug: 'deployment-smoke',
      perguntas: [{ id: randomUUID(), texto: 'Como foi sua experiencia?', tipo: 'ESTRELAS', obrigatoria: true }],
    }) }));
    const login = await page.goto(`${base}/entrar`);
    assert.equal(login.status(), 200);
    await page.locator('input[type="email"]').waitFor();
    await page.screenshot({ path: resolve(directory, `login-${width}.png`), fullPage: true });
    await page.goto(`${base}/app/pesquisas/${randomUUID()}`);
    await page.waitForURL('**/entrar');
    await page.goto(`${base}/p/deployment-smoke`);
    await page.getByRole('button', { name: 'Começar' }).waitFor();
    await page.reload();
    await page.getByRole('button', { name: 'Começar' }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: resolve(directory, `public-${width}.png`), fullPage: true });
    await page.close();
  }
  assert.deepEqual(errors, [], 'Browser/CSP errors in the production bundle.');
  console.log('Pages bundle: assets, generated CSP, history fallback, public API origin and protected routes passed at 360/1440px (local HTTP; synthetic API).');
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise(resolveClose => server.close(resolveClose));
}
