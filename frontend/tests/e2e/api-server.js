import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
process.chdir(root);
const directory = mkdtempSync(join(tmpdir(), 'feedqr-browser-'));
const path = join(directory, 'browser.db');
const devDb = join(root, 'prisma/dev.db');
const hash = () => existsSync(devDb) ? createHash('sha256').update(readFileSync(devDb)).digest('hex') : null;
const originalHash = hash();
new DatabaseSync(path).close();
Object.assign(process.env, { NODE_ENV: 'test', PORT: '4178',
  DATABASE_URL: `file:${path.replaceAll('\\', '/')}`, TEST_DATABASE_URL: `file:${path.replaceAll('\\', '/')}`,
  JWT_SECRET: 'feedqr-browser-test-secret-with-more-than-32-characters',
  FRONTEND_PUBLIC_URL: 'http://127.0.0.1:4177', CORS_ORIGINS: 'http://127.0.0.1:4177',
});
execFileSync(process.execPath, [join(root, 'node_modules/prisma/build/index.js'), 'migrate', 'deploy'], { env: process.env, stdio: 'pipe' });
const { default: app } = await import('../../../src/app.js');
const { default: prisma } = await import('../../../src/config/prisma.js');
const { seedAdmin } = await import('./seed-admin.js');
await seedAdmin();
const server = app.listen(4178, '127.0.0.1');
let stopping = false;
async function stop() {
  if (stopping) return; stopping = true;
  await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
  rmSync(directory, { recursive: true, force: true });
  if (hash() !== originalHash) { console.error('O banco de desenvolvimento foi alterado.'); process.exit(1); }
  process.exit(0);
}
process.once('SIGINT', stop); process.once('SIGTERM', stop);
