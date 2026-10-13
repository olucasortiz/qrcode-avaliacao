import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { runSync } from '../scripts/sync-mongodb.js';

const devDatabase = resolve('prisma/dev.db');
const devHash = existsSync(devDatabase) ? createHash('sha256').update(readFileSync(devDatabase)).digest('hex') : null;

// Inicializa MongoDB Replica Set efêmero isolado para os testes
const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
const uri = replSet.getUri('feedqr_vitest');

process.env.NODE_ENV = 'test';
process.env.TEST_DATABASE_URL = uri;
process.env.DATABASE_URL = uri;
process.env.JWT_SECRET = 'feedqr-test-secret-with-more-than-32-characters';
process.env.FRONTEND_PUBLIC_URL = 'http://localhost:5173';
process.env.CORS_ORIGINS = 'http://localhost:5173,http://localhost:4173';

// Sincroniza schema, índices e validators MongoDB no replica set descartável
await runSync({ uri, mode: 'apply' });

afterAll(async () => {
  const { disconnectPrisma } = await import('../src/config/prisma.js');
  await disconnectPrisma();
  await replSet.stop();
  if (devHash) {
    assert.equal(
      createHash('sha256').update(readFileSync(devDatabase)).digest('hex'),
      devHash,
      'Banco de desenvolvimento original SQLite foi alterado indevidamente.'
    );
  }
});
