// Local HTTP smoke only. Always use a reserved .invalid host, never a real database.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';

const probe = createServer();
probe.listen(0, '127.0.0.1');
await once(probe, 'listening');
const port = probe.address().port;
await new Promise(resolveClose => probe.close(resolveClose));

const npmCli = process.env.npm_execpath || resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const child = spawn(process.execPath, [npmCli, 'start'], {
  cwd: resolve(import.meta.dirname, '..'),
  env: { ...process.env, NODE_ENV: 'production', PORT: String(port), TRUST_PROXY: '1',
    DATABASE_URL: 'mongodb+srv://synthetic:unused@feedqr-smoke.invalid/feedqr_smoke?serverSelectionTimeoutMS=2000&connectTimeoutMS=1000',
    JWT_SECRET: randomBytes(32).toString('hex'), FRONTEND_PUBLIC_URL: 'https://feedqr.example.invalid',
    CORS_ORIGINS: 'https://feedqr.example.invalid' },
  stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32',
});
const closed = once(child, 'close');
let output = '';
child.stdout.on('data', chunk => { output += chunk; });
child.stderr.on('data', chunk => { output += chunk; });
const fetchApi = path => fetch(`http://127.0.0.1:${port}${path}`, { signal: AbortSignal.timeout(7000) });
try {
  const deadline = Date.now() + 20000;
  while (!output.includes('FeedQR API running')) {
    if (Date.now() > deadline || child.exitCode !== null) throw new Error('npm start failed to bind the configured port.');
    await new Promise(resolveWait => setTimeout(resolveWait, 100));
  }
  const health = await fetchApi('/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.headers.get('cache-control'), 'no-store');
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(health.headers.get('x-powered-by'), null);
  const readiness = await fetchApi('/api/health/ready');
  assert.equal(readiness.status, 503);
  assert.deepEqual(await readiness.json(), { status: 'error', database: 'disconnected' });
  assert.equal((await fetchApi('/api/dashboard')).status, 401);
  const cors = await fetch(`http://127.0.0.1:${port}/api/health`, {
    headers: { Origin: 'https://untrusted.example.invalid' }, signal: AbortSignal.timeout(5000),
  });
  assert.equal(cors.status, 403);
  assert.ok(!output.includes('synthetic:unused'));
  console.log('Production npm start: PORT, liveness, safe readiness failure, authentication, CORS and headers passed (local HTTP only).');
} finally {
  if (child.exitCode === null) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else process.kill(-child.pid, 'SIGTERM');
  }
  await closed;
}
