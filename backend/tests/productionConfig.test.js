import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { test, vi } from 'vitest';
import supertest from 'supertest';
import { parseEnvironment } from '../src/config/env.js';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import { errorHandler } from '../src/middlewares/errorMiddleware.js';

const production = () => ({
  NODE_ENV: 'production', PORT: '10000', TRUST_PROXY: '1',
  DATABASE_URL: 'mongodb+srv://runtime:synthetic-password@cluster.example.invalid/feedqr_production',
  JWT_SECRET: randomBytes(32).toString('hex'),
  FRONTEND_PUBLIC_URL: 'https://feedqr.example.com', CORS_ORIGINS: 'https://feedqr.example.com',
});

test('production accepts explicit HTTPS origins, a generated secret and authenticated MongoDB SRV', () => {
  const config = parseEnvironment(production());
  assert.equal(config.port, 10000);
  assert.equal(config.trustProxy, true);
  assert.equal(config.nodeEnv, 'production');
});

test('production rejects unsafe configuration without echoing secrets', () => {
  for (const overrides of [
    { NODE_ENV: 'prod' }, { PORT: '0' }, { TRUST_PROXY: 'trust-all' },
    { JWT_SECRET: 'feedqr-test-secret-with-more-than-32-characters' }, { JWT_SECRET: 'a'.repeat(64) },
    { FRONTEND_PUBLIC_URL: 'http://localhost:5173' },
    { CORS_ORIGINS: '*' }, { CORS_ORIGINS: 'https://other.example.com' },
    { DATABASE_URL: 'file:./dev.db' }, { DATABASE_URL: 'mongodb+srv://user:password@cluster.invalid/admin' },
    { DATABASE_URL: 'mongodb+srv://user:password@cluster.invalid/feedqr?tls=false' },
    { DATABASE_URL: 'mongodb+srv://user:password@cluster.invalid/feedqr?tlsInsecure=true' },
    { DATABASE_URL: 'mongodb+srv://user:password@cluster.invalid/feedqr?TLS=false' },
    { DATABASE_URL: 'mongodb+srv://user:password@cluster.invalid/feedqr?tls=true&tls=false' },
    { DATABASE_URL: 'mongodb+srv://user:password@cluster.invalid/feedqr?TLSINSECURE=TRUE' },
  ]) {
    const input = { ...production(), ...overrides };
    assert.throws(() => parseEnvironment(input), error => {
      assert.ok(!error.message.includes(input.JWT_SECRET));
      assert.ok(!error.message.includes(input.DATABASE_URL));
      return /Configuracao invalida/.test(error.message);
    });
  }
});

test('readiness returns 200 when connected and a sanitized 503 on database failure', async () => {
  const api = supertest(app);
  const healthy = await api.get('/api/health/ready').expect(200);
  assert.deepEqual(healthy.body, { status: 'ok', database: 'connected' });
  assert.equal(healthy.headers['cache-control'], 'no-store');
  const spy = vi.spyOn(prisma, '$runCommandRaw').mockRejectedValue(new Error('mongodb://secret:password@internal-host/private-data'));
  try {
    const unhealthy = await api.get('/api/health/ready').expect(503);
    assert.deepEqual(unhealthy.body, { status: 'error', database: 'disconnected' });
    await api.get('/api/health').expect(200);
  } finally { spy.mockRestore(); }
});

test('unexpected errors omit raw messages from both responses and logs', () => {
  const logs = vi.spyOn(console, 'error').mockImplementation(() => {});
  const res = { headersSent: false, status: vi.fn().mockReturnThis(), json: vi.fn() };
  try {
    errorHandler(new Error('mongodb://secret:password@internal-host/customer-feedback'), {}, res, () => {});
    assert.deepEqual(res.json.mock.calls[0][0], { erro: 'Erro interno.' });
    assert.ok(!JSON.stringify(logs.mock.calls).includes('customer-feedback'));
    assert.ok(!JSON.stringify(logs.mock.calls).includes('password'));
  } finally { logs.mockRestore(); }
});

test('one trusted reverse proxy uses the nearest client IP, ignoring spoofed earlier hops', async () => {
  const previous = app.get('trust proxy');
  app.set('trust proxy', 1);
  try {
    const first = await supertest(app).get('/api/public/pesquisas/missing')
      .set('X-Forwarded-For', '198.51.100.1, 203.0.113.9').expect(404);
    const second = await supertest(app).get('/api/public/pesquisas/missing')
      .set('X-Forwarded-For', '198.51.100.2, 203.0.113.9').expect(404);
    assert.match(first.headers.ratelimit, /r=119/);
    assert.match(second.headers.ratelimit, /r=118/);
  } finally { app.set('trust proxy', previous); }
});
