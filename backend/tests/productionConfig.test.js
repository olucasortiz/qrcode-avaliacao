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

test('public database availability failures return sanitized 503, then recover without changing validation', async () => {
  const logs = vi.spyOn(console, 'error').mockImplementation(() => {});
  const spy = vi.spyOn(prisma.pesquisa, 'findFirst');
  try {
    for (const code of ['P1001', 'P1002', 'P1008', 'P1011', 'P1017', 'P2024', 'P2028']) {
      for (const property of ['code', 'errorCode']) {
        spy.mockRejectedValueOnce(Object.assign(new Error('mongodb://secret:password@internal-host/private-data'), { [property]: code }));
        const response = await supertest(app).get('/api/public/pesquisas/startup-test').expect(503);
        assert.deepEqual(response.body, { erro: 'Servico temporariamente indisponivel.' });
        assert.equal(response.headers['retry-after'], '1');
        assert.equal(response.headers['cache-control'], 'no-store');
      }
    }
    // Also test P2010 with connection/timed out message
    spy.mockRejectedValueOnce(Object.assign(new Error('Server selection timed out after 5000 ms'), { code: 'P2010' }));
    const p2010Response = await supertest(app).get('/api/public/pesquisas/startup-test').expect(503);
    assert.deepEqual(p2010Response.body, { erro: 'Servico temporariamente indisponivel.' });

    const pesquisa = { id: 'synthetic-id', titulo: 'Sintetica', descricao: null, slug: 'startup-test', perguntas: [] };
    spy.mockResolvedValueOnce(pesquisa);
    const recovered = await supertest(app).get('/api/public/pesquisas/startup-test').expect(200);
    assert.equal(recovered.body.slug, 'startup-test');
    spy.mockResolvedValueOnce(null);
    await supertest(app).get('/api/public/pesquisas/startup-test').expect(404);
    assert.ok(!JSON.stringify(logs.mock.calls).includes('password'));
    assert.ok(!JSON.stringify(logs.mock.calls).includes('private-data'));
  } finally { spy.mockRestore(); logs.mockRestore(); }
});

test('auth login and registration return sanitized 503 during database unavailability without retrying writes', async () => {
  const logs = vi.spyOn(console, 'error').mockImplementation(() => {});
  const userSpy = vi.spyOn(prisma.usuario, 'findUnique').mockRejectedValue(
    Object.assign(new Error('Database unreachable'), { code: 'P1001' })
  );
  const txSpy = vi.spyOn(prisma, '$transaction').mockRejectedValue(
    Object.assign(new Error('Transaction API error'), { code: 'P2028' })
  );
  try {
    const loginRes = await supertest(app).post('/api/auth/login')
      .send({ email: 'synthetic-admin@example.invalid', senha: 'some-valid-length-password' })
      .expect(503);
    assert.deepEqual(loginRes.body, { erro: 'Servico temporariamente indisponivel.' });
    assert.equal(loginRes.headers['retry-after'], '1');
    assert.ok(!JSON.stringify(logs.mock.calls).includes('synthetic-admin'));

    const cadastroRes = await supertest(app).post('/api/auth/cadastro')
      .send({
        empresa: { nome: 'Nova Empresa', email: 'empresa@example.invalid' },
        nome: 'Usuario Teste',
        email: 'usuario@example.invalid',
        senha: 'some-valid-length-password'
      })
      .expect(503);
    assert.deepEqual(cadastroRes.body, { erro: 'Servico temporariamente indisponivel.' });
    assert.equal(cadastroRes.headers['retry-after'], '1');
    assert.ok(!JSON.stringify(logs.mock.calls).includes('usuario@example.invalid'));
  } finally { userSpy.mockRestore(); txSpy.mockRestore(); logs.mockRestore(); }
});

test('checkDatabaseReadiness times out quickly on unresponsive database', async () => {
  const { checkDatabaseReadiness } = await import('../src/config/prisma.js');
  const hangingClient = {
    $runCommandRaw: () => new Promise(() => {}), // Never resolves
  };
  const started = Date.now();
  const result = await checkDatabaseReadiness(hangingClient, 50);
  const elapsed = Date.now() - started;
  assert.equal(result.ready, false);
  assert.ok(elapsed < 1000, `Expected fast timeout, took ${elapsed}ms`);
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
