import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { afterAll } from 'vitest';

const directory = mkdtempSync(join(tmpdir(), 'feedqr-vitest-'));
const devDatabase = resolve('prisma/dev.db');
const devHash = existsSync(devDatabase) ? createHash('sha256').update(readFileSync(devDatabase)).digest('hex') : null;
const databasePath = join(directory, 'test.db');
new DatabaseSync(databasePath).close();
process.env.NODE_ENV = 'test';
process.env.TEST_DATABASE_URL = `file:${databasePath.replaceAll('\\', '/')}`;
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.JWT_SECRET = 'feedqr-test-secret-with-more-than-32-characters';
process.env.FRONTEND_PUBLIC_URL = 'http://localhost:5173';
process.env.CORS_ORIGINS = 'http://localhost:5173,http://localhost:4173';

afterAll(async () => {
  const { default: prisma } = await import('../src/config/prisma.js');
  await prisma.$disconnect();
  rmSync(directory, { recursive: true, force: true });
  if (devHash) assert.equal(createHash('sha256').update(readFileSync(devDatabase)).digest('hex'), devHash, 'Banco de desenvolvimento foi alterado.');
});

execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {
  env: process.env, stdio: 'pipe',
});
