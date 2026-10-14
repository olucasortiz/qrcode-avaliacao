import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { runSync } from '../../../backend/scripts/sync-mongodb.js';

// Resolve the test database dependency from the package that owns it.
const requireBackend = createRequire(new URL('../../../backend/package.json', import.meta.url));
const { MongoMemoryReplSet } = requireBackend('mongodb-memory-server');

const root = fileURLToPath(new URL('../../../backend/', import.meta.url));
process.chdir(root);

const devDb = join(root, 'prisma/dev.db');
const hash = () => existsSync(devDb) ? createHash('sha256').update(readFileSync(devDb)).digest('hex') : null;
const originalHash = hash();

// Iniciar Mongo Memory Replica Set para o servidor de teste E2E
const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
const uri = replSet.getUri('feedqr_browser_test');

Object.assign(process.env, {
  NODE_ENV: 'test',
  PORT: '4178',
  DATABASE_URL: uri,
  TEST_DATABASE_URL: uri,
  JWT_SECRET: 'feedqr-browser-test-secret-with-more-than-32-characters',
  FRONTEND_PUBLIC_URL: 'http://127.0.0.1:4177',
  CORS_ORIGINS: 'http://127.0.0.1:4177',
});

// Sincronizar coleções, índices e validators
await runSync({ uri, mode: 'apply' });

const { default: app } = await import('../../../backend/src/app.js');
const { disconnectPrisma } = await import('../../../backend/src/config/prisma.js');
const { seedAdmin } = await import('./seed-admin.js');

await seedAdmin();

const server = app.listen(4178, '127.0.0.1', () => {
  console.log('E2E Backend API listening on http://127.0.0.1:4178');
});

let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await new Promise(resolve => server.close(resolve));
  await disconnectPrisma();
  await replSet.stop();
  if (hash() !== originalHash) {
    console.error('O banco de desenvolvimento original SQLite foi alterado.');
    process.exit(1);
  }
  process.exit(0);
}

process.once('SIGINT', stop);
process.once('SIGTERM', stop);
