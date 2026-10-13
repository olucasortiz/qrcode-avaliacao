import { randomUUID } from 'node:crypto';
import { beforeAll, beforeEach, expect, test } from 'vitest';
import supertest from 'supertest';
import { ipKeyGenerator } from 'express-rate-limit';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import { responseLimiter, publicReadLimiter } from '../src/middlewares/rateLimitMiddleware.js';

const api = supertest(app);
let survey;
let point;
let question;
beforeAll(async () => {
  const empresa = await prisma.empresa.create({ data: { nome: 'Teste público', email: 'public@test.local' } });
  survey = await prisma.pesquisa.create({ data: { empresaId: empresa.id, titulo: 'Pesquisa pública', slug: 'publica', status: 'ATIVA' } });
  question = await prisma.pergunta.create({ data: { pesquisaId: survey.id, texto: 'Nota?', tipo: 'NPS', ordem: 0 } });
  point = await prisma.pontoColeta.create({ data: { pesquisaId: survey.id, nome: 'Balcão' } });
});
beforeEach(async () => {
  for (const limiter of [responseLimiter, publicReadLimiter]) for (const ip of ['127.0.0.1', '::ffff:127.0.0.1']) limiter.resetKey(ipKeyGenerator(ip));
  await prisma.respostaPergunta.deleteMany();
  await prisma.resposta.deleteMany();
  await prisma.pesquisa.update({ where: { id: survey.id }, data: { status: 'ATIVA' } });
  await prisma.pontoColeta.update({ where: { id: point.id }, data: { ativo: true } });
  await prisma.pergunta.update({ where: { id: question.id }, data: { obrigatoria: true } });
});
const body = () => ({ origem: point.token, respostas: [{ perguntaId: question.id, valor: 0 }] });
const post = (payload = body(), key) => {
  const request = api.post('/api/public/pesquisas/publica/respostas');
  if (key) request.set('Idempotency-Key', key);
  return request.send(payload);
};

test('repetição após confirmação perdida cria uma resposta e preserva origem', async () => {
  const key = randomUUID();
  const first = await post(body(), key).expect(201);
  const second = await post(body(), key).expect(201);
  expect(second.body).toEqual(first.body);
  expect(await prisma.resposta.count()).toBe(1);
  const stored = await prisma.resposta.findFirst({ include: { perguntas: true } });
  expect(stored.pontoColetaId).toBe(point.id);
  expect(stored.perguntas[0].valorNps).toBe(0);
  expect(JSON.stringify(second.body)).not.toContain(key);
  // A committed response can still be acknowledged after collection closes.
  await prisma.pesquisa.update({ where: { id: survey.id }, data: { status: 'ENCERRADA' } });
  await post(body(), key).expect(201);
  await post(body(), randomUUID()).expect(404);
});
test('tentativas simultâneas com a mesma chave gravam apenas uma resposta', async () => {
  const key = randomUUID();
  const results = await Promise.all([post(body(), key), post(body(), key), post(body(), key)]);
  expect(results.map(result => result.status)).toEqual([201, 201, 201]);
  expect(await prisma.resposta.count()).toBe(1);
});
test('chave vinculada ao payload e origem rejeita reuso com dados diferentes', async () => {
  const key = randomUUID();
  await post(body(), key).expect(201);
  await post({ ...body(), respostas: [{ perguntaId: question.id, valor: 10 }] }, key).expect(409);
  await post({ respostas: body().respostas }, key).expect(409);
  await api.post('/api/public/pesquisas/outro-slug/respostas').set('Idempotency-Key', key).send(body()).expect(409);
  expect(await prisma.resposta.count()).toBe(1);
});
test('chave opcional mantém compatibilidade e entradas inválidas não gravam', async () => {
  await post(body()).expect(201);
  await post(body()).expect(201);
  expect(await prisma.resposta.count()).toBe(2);
  await post(body(), 'chave-invalida').expect(400);
  await post({ ...body(), respostas: [] }, randomUUID()).expect(400);
  await post({ ...body(), origem: randomUUID() }, randomUUID()).expect(400);
  await prisma.pontoColeta.update({ where: { id: point.id }, data: { ativo: false } });
  await post(body(), randomUUID()).expect(400);
  expect(await prisma.resposta.count()).toBe(2);
});
test('permite pular todas as opcionais mantendo obrigatório validado no servidor', async () => {
  await post({ respostas: [] }, randomUUID()).expect(400);
  await prisma.pergunta.update({ where: { id: question.id }, data: { obrigatoria: false } });
  const key = randomUUID();
  await post({ origem: point.token, respostas: [] }, key).expect(201);
  await post({ origem: point.token, respostas: [] }, key).expect(201);
  expect(await prisma.resposta.count()).toBe(1);
  expect(await prisma.respostaPergunta.count()).toBe(0);
});
test('CORS permite o cabeçalho da nova tentativa', async () => {
  const result = await api.options('/api/public/pesquisas/publica/respostas').set('Origin', 'http://localhost:5173')
    .set('Access-Control-Request-Method', 'POST').set('Access-Control-Request-Headers', 'content-type,idempotency-key').expect(204);
  expect(result.headers['access-control-allow-headers']).toContain('Idempotency-Key');
});
