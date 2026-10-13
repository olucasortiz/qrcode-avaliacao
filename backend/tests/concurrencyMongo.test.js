import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, test, beforeAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';

const api = supertest(app);
const senha = 'FeedQR-concurrency-123';
let conta, pesquisa, perguntas, ponto;

const auth = (req) => req.set('Authorization', `Bearer ${conta.token}`);

beforeAll(async () => {
  conta = (await api.post('/api/auth/cadastro').send({
    empresa: { nome: 'Empresa Concorrencia', email: 'conc_empresa@test.local' },
    nome: 'Admin Concorrencia',
    email: 'conc_admin@test.local',
    senha,
  }).expect(201)).body;
});

beforeEach(async () => {
  await prisma.respostaPergunta.deleteMany();
  await prisma.resposta.deleteMany();
  await prisma.opcaoPergunta.deleteMany();
  await prisma.pergunta.deleteMany();
  await prisma.pontoColeta.deleteMany();
  await prisma.pesquisa.deleteMany();

  // Criar pesquisa
  pesquisa = (await auth(api.post('/api/pesquisas')).send({
    titulo: 'Pesquisa Concorrencia',
    slug: 'pesquisa-concorrencia',
  }).expect(201)).body;

  // Criar perguntas dos 5 tipos
  perguntas = [];
  const tipos = ['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'];
  for (const [i, tipo] of tipos.entries()) {
    const p = (await auth(api.post(`/api/pesquisas/${pesquisa.id}/perguntas`)).send({
      texto: `Pergunta ${tipo}`,
      tipo,
      ordem: i,
      obrigatoria: true,
      ...(tipo === 'MULTIPLA_ESCOLHA' ? { opcoes: [{ texto: 'Opcao A', ordem: 0 }, { texto: 'Opcao B', ordem: 1 }] } : {}),
    }).expect(201)).body;
    perguntas.push(p);
  }

  // Criar ponto de coleta
  ponto = (await auth(api.post(`/api/pesquisas/${pesquisa.id}/pontos`)).send({
    nome: 'Totem Principal',
  }).expect(201)).body;

  // Publicar pesquisa
  await auth(api.post(`/api/pesquisas/${pesquisa.id}/publicar`)).expect(200);
});

describe('FASE 3: Concorrência, Idempotência e Coordenação Transacional no MongoDB', () => {
  test('1. 10 envios simultâneos com a mesma idempotencyKey gravam apenas 1 resposta e retornam 200 para todos', async () => {
    const idempotencyKey = randomUUID();
    const payload = {
      origem: ponto.token,
      respostas: [
        { perguntaId: perguntas[0].id, valor: 5 },
        { perguntaId: perguntas[1].id, valor: 10 },
        { perguntaId: perguntas[2].id, valor: true },
        { perguntaId: perguntas[3].id, valor: 'Excelente' },
        { perguntaId: perguntas[4].id, valor: perguntas[4].opcoes[0].id },
      ],
    };

    // Disparar 10 envios estritamente simultâneos
    const promises = Array.from({ length: 10 }, () =>
      api.post(`/api/public/pesquisas/${pesquisa.slug}/respostas`)
        .set('Idempotency-Key', idempotencyKey)
        .send(payload)
    );

    const responses = await Promise.all(promises);

    for (const res of responses) {
      assert.equal(res.status, 201, `Esperado 201, recebido ${res.status}: ${JSON.stringify(res.body)}`);
      assert.equal(res.body.mensagem, 'Resposta registrada.');
    }

    // Conferir que exatamente 1 registro foi criado no MongoDB
    const count = await prisma.resposta.count({ where: { idempotencyKey } });
    assert.equal(count, 1, 'Deveria existir exatamente 1 resposta gravada no banco.');

    const rpCount = await prisma.respostaPergunta.count({
      where: { resposta: { idempotencyKey } },
    });
    assert.equal(rpCount, 5, 'Deveriam existir 5 respostas de pergunta gravadas.');
  });

  test('2. 10 envios simultâneos com a mesma chave mas payloads conflitantes resultam em 1 sucesso e 9 conflitos (409)', async () => {
    const idempotencyKey = randomUUID();

    // 10 payloads diferentes para a mesma chave de idempotência
    const promises = Array.from({ length: 10 }, (_, i) =>
      api.post(`/api/public/pesquisas/${pesquisa.slug}/respostas`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          origem: ponto.token,
          respostas: [
            { perguntaId: perguntas[0].id, valor: (i % 5) + 1 }, // notas diferentes
            { perguntaId: perguntas[1].id, valor: i },
            { perguntaId: perguntas[2].id, valor: i % 2 === 0 },
            { perguntaId: perguntas[3].id, valor: `Texto ${i}` },
            { perguntaId: perguntas[4].id, valor: perguntas[4].opcoes[i % 2].id },
          ],
        })
    );

    const responses = await Promise.all(promises);

    const successes = responses.filter(r => r.status === 201);
    const conflicts = responses.filter(r => r.status === 409);

    assert.equal(successes.length, 1, `Esperado exatamente 1 sucesso, obtido ${successes.length}`);
    assert.equal(conflicts.length, 9, `Esperado exatamente 9 conflitos (409), obtido ${conflicts.length}`);

    // Exatamente 1 gravado
    const count = await prisma.resposta.count({ where: { idempotencyKey } });
    assert.equal(count, 1);
  });

  test('3. Coordenação transacional: Encerramento de pesquisa bloqueia envios que tentam registrar após o encerramento', async () => {
    // Encerrar pesquisa
    await auth(api.patch(`/api/pesquisas/${pesquisa.id}`)).send({ status: 'ENCERRADA' }).expect(200);

    // Tentar enviar resposta para pesquisa encerrada
    const res = await api.post(`/api/public/pesquisas/${pesquisa.slug}/respostas`).send({
      respostas: [
        { perguntaId: perguntas[0].id, valor: 5 },
        { perguntaId: perguntas[1].id, valor: 10 },
        { perguntaId: perguntas[2].id, valor: true },
        { perguntaId: perguntas[3].id, valor: 'Tarde demais' },
        { perguntaId: perguntas[4].id, valor: perguntas[4].opcoes[0].id },
      ],
    });

    assert.equal(res.status, 404, 'Pesquisa encerrada não deve aceitar envios');
  });

  test('4. Coordenação transacional: Ponto de coleta desativado rejeita envios com aquela origem', async () => {
    // Desativar ponto de coleta
    await auth(api.patch(`/api/pontos/${ponto.id}`)).send({ ativo: false }).expect(200);

    const res = await api.post(`/api/public/pesquisas/${pesquisa.slug}/respostas`).send({
      origem: ponto.token,
      respostas: [
        { perguntaId: perguntas[0].id, valor: 4 },
        { perguntaId: perguntas[1].id, valor: 8 },
        { perguntaId: perguntas[2].id, valor: false },
        { perguntaId: perguntas[3].id, valor: 'Ponto inativo' },
        { perguntaId: perguntas[4].id, valor: perguntas[4].opcoes[1].id },
      ],
    });

    assert.equal(res.status, 400);
    assert.match(res.body.erro, /origem/i);
  });

  test('5. Integridade referencial explícita: rejeita exclusão de pesquisa que possua respostas', async () => {
    // Enviar resposta
    await api.post(`/api/public/pesquisas/${pesquisa.slug}/respostas`).send({
      respostas: [
        { perguntaId: perguntas[0].id, valor: 5 },
        { perguntaId: perguntas[1].id, valor: 10 },
        { perguntaId: perguntas[2].id, valor: true },
        { perguntaId: perguntas[3].id, valor: 'Com resposta' },
        { perguntaId: perguntas[4].id, valor: perguntas[4].opcoes[0].id },
      ],
    }).expect(201);

    // Tentativa de excluir pesquisa com respostas -> 409
    await auth(api.delete(`/api/pesquisas/${pesquisa.id}`)).expect(409);
  });
});
