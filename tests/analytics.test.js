import { randomUUID } from 'node:crypto';
import { beforeAll, expect, test } from 'vitest';
import supertest from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import { obterResultados } from '../src/services/resultadoService.js';
import { listarFeedbacks, prepararFeedbacks, exportarFeedbacks, csvHeader } from '../src/services/feedbackService.js';
import jwt from 'jsonwebtoken';
let company, other, survey, point, questions, token;
const dates = ['2026-10-01T12:00:00Z', '2026-10-02T12:00:00Z', '2026-10-02T13:00:00Z', '2026-10-03T12:00:00Z'];
beforeAll(async () => {
  company = await prisma.empresa.create({ data: { nome: 'Análise', email: 'analysis@test.local' } });
  other = await prisma.empresa.create({ data: { nome: 'Outra', email: 'other-analysis@test.local' } });
  const user = await prisma.usuario.create({ data: { empresaId: company.id, nome: 'Teste', email: 'analysis-user@test.local', senhaHash: 'not-used' } });
  token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '1h' });
  survey = await prisma.pesquisa.create({ data: { empresaId: company.id, titulo: 'Pesquisa', slug: randomUUID(), status: 'ATIVA' } });
  point = await prisma.pontoColeta.create({ data: { pesquisaId: survey.id, nome: 'Balcão' } });
  questions = [];
  for (const [ordem, tipo] of ['ESTRELAS', 'NPS', 'SIM_NAO', 'MULTIPLA_ESCOLHA', 'TEXTO'].entries()) questions.push(await prisma.pergunta.create({ data: { pesquisaId: survey.id, texto: tipo, ordem, tipo,
    ...(tipo === 'MULTIPLA_ESCOLHA' ? { opcoes: { create: [{ texto: 'A', ordem: 0 }, { texto: 'B', ordem: 1 }, { texto: 'C', ordem: 2 }] } } : {}) }, include: { opcoes: { orderBy: { ordem: 'asc' } } } }));
  for (const [i, createdAt] of dates.entries()) {
    const response = await prisma.resposta.create({ data: { pesquisaId: survey.id, pontoColetaId: i === 3 ? null : point.id, createdAt: new Date(createdAt) } });
    const values = [{ valorEstrelas: [1, 3, 5, 5][i] }, { valorNps: [0, 7, 9, 10][i] }, { valorSimNao: i % 2 === 0 }, { opcaoPerguntaId: questions[3].opcoes[i % 2].id }, { valorTexto: i === 1 ? '=HYPERLINK("teste");\nOpinião ç' : 'Resposta completa' }];
    await prisma.respostaPergunta.createMany({ data: questions.map((q, n) => ({ respostaId: response.id, pesquisaId: survey.id, perguntaId: q.id, tipo: q.tipo, ...values[n] })) });
  }
});
test('agregados dos cinco tipos têm cálculos reais e alternativas sem respostas', async () => {
  const results = await obterResultados(company.id, {}, survey.id);
  expect(results.totalRespostas).toBe(4);
  expect(results.perguntas[0].media).toBe(3.5); expect(results.perguntas[0].distribuicao.map(row => row.quantidade)).toEqual([1, 0, 1, 0, 2]);
  expect(results.perguntas[1]).toMatchObject({ nps: 25, detratores: 1, neutros: 1, promotores: 2 });
  expect(results.perguntas[2].distribuicao).toEqual([{ valor: true, quantidade: 2 }, { valor: false, quantidade: 2 }]);
  expect(results.perguntas[3].distribuicao.map(row => [row.texto, row.quantidade])).toEqual([['A', 2], ['B', 2], ['C', 0]]);
  expect(results.perguntas[4].totalRespostas).toBe(4);
  expect(results.respostasPorDia.map(row => row.quantidade)).toEqual([1, 2, 1]);
});
test('período e origem são aplicados em todos os agregados e vazios são explícitos', async () => {
  const results = await obterResultados(company.id, { inicio: '2026-10-02', fim: '2026-10-02', pontoColetaId: point.id }, survey.id);
  expect(results.totalRespostas).toBe(2); expect(results.perguntas[0].media).toBe(4);
  expect(results.perguntas[1].nps).toBe(50); expect(results.perguntas[2].distribuicao.map(row => row.quantidade)).toEqual([1, 1]);
  const empty = await obterResultados(company.id, { inicio: '2050-01-01' }, survey.id);
  expect(empty.totalRespostas).toBe(0); expect(empty.perguntas[0].media).toBeNull(); expect(empty.perguntas[1].nps).toBeNull();
  expect(empty.perguntas[3].distribuicao.map(row => row.quantidade)).toEqual([0, 0, 0]);
});
test('feedbacks com filtros combinados, paginação real e origem ausente', async () => {
  const filter = { inicio: '2026-10-02', fim: '2026-10-02', pontoColetaId: point.id, perguntaId: questions[1].id, nota: 7, pagina: 1, limite: 1 };
  const result = await listarFeedbacks(survey.id, company.id, filter);
  expect(result.total).toBe(1); expect(result.itens[0].respostas).toHaveLength(5);
  expect(result.itens[0].respostas.find(row => row.pergunta.tipo === 'SIM_NAO').simNao).toBe(false);
  const first = await listarFeedbacks(survey.id, company.id, { pagina: 1, limite: 2 });
  const second = await listarFeedbacks(survey.id, company.id, { pagina: 2, limite: 2 });
  expect(first.totalPaginas).toBe(2); expect(first.itens[0].origem).toBeNull();
  expect(second.itens.every(item => !first.itens.some(other => item.id === other.id))).toBe(true);
});
test('CSV usa os mesmos filtros dos feedbacks e protege fórmulas mantendo UTF-8', async () => {
  const filter = { inicio: '2026-10-02', fim: '2026-10-02', pontoColetaId: point.id, perguntaId: questions[1].id, nota: 7 };
  const where = await prepararFeedbacks(survey.id, company.id, filter);
  let csv = `\uFEFF${csvHeader}`;
  for await (const row of exportarFeedbacks(where)) csv += row;
  const feedbacks = await listarFeedbacks(survey.id, company.id, { ...filter, pagina: 1, limite: 20 });
  expect(csv).toContain(feedbacks.itens[0].id); expect(csv).toContain("\"'=HYPERLINK"); expect(csv).toContain('Opinião ç');
  const all = await listarFeedbacks(survey.id, company.id, { pagina: 1, limite: 20 });
  for (const item of all.itens.filter(item => item.id !== feedbacks.itens[0].id)) expect(csv).not.toContain(item.id);
  const response = await supertest(app).get(`/api/pesquisas/${survey.id}/exportar`).query(filter).set('Authorization', `Bearer ${token}`).buffer(true).parse((res, done) => {
    const chunks = []; res.on('data', chunk => chunks.push(chunk)); res.on('end', () => done(null, Buffer.concat(chunks)));
  }).expect(200);
  expect([...response.body.subarray(0, 3)]).toEqual([239, 187, 191]); expect(response.body.toString('utf8')).toBe(csv);
});
test('resultados, feedbacks e exportação impedem acesso entre empresas', async () => {
  await expect(obterResultados(other.id, {}, survey.id)).rejects.toMatchObject({ status: 404 });
  await expect(listarFeedbacks(survey.id, other.id, { pagina: 1, limite: 20 })).rejects.toMatchObject({ status: 404 });
  await expect(prepararFeedbacks(survey.id, other.id, {})).rejects.toMatchObject({ status: 404 });
});
