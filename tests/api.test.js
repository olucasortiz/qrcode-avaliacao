import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { beforeAll, beforeEach, describe, test } from 'vitest';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { ipKeyGenerator } from 'express-rate-limit';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import { authLimiter, adminLimiter, publicReadLimiter, responseLimiter, exportLimiter } from '../src/middlewares/rateLimitMiddleware.js';

const api = supertest(app);
const senha = 'FeedQR-teste-123';
let conta, outraConta, pesquisa, outraPesquisa, perguntas, outraPergunta, ponto, outroPonto;
const cadastro = suffix => ({ empresa: { nome: `Empresa ${suffix}`, email: `empresa${suffix}@test.local` },
  nome: `Usuario ${suffix}`, email: `usuario${suffix}@test.local`, senha });
const auth = (request, token = conta.token) => request.set('Authorization', `Bearer ${token}`);
const perguntaPath = id => `/api/pesquisas/${pesquisa.id}/perguntas${id ? `/${id}` : ''}`;
const bodyValido = (estrelas = 5, nps = 10, texto = 'Bom atendimento') => ({ respostas: perguntas.map((pergunta, i) => ({
  perguntaId: pergunta.id, valor: [estrelas, 1, nps, 10, false, texto, perguntas[6].opcoes[0].id][i],
})) });
const postResposta = body => api.post(`/api/public/pesquisas/${pesquisa.slug}/respostas`).send(body);
const publicar = () => auth(api.post(`/api/pesquisas/${pesquisa.id}/publicar`));
const csvRequest = (query = {}) => auth(api.get(`/api/pesquisas/${pesquisa.id}/exportar`)).query(query).buffer(true)
  .parse((res, callback) => {
    const chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => callback(null, Buffer.concat(chunks)));
    res.on('error', callback);
  });

function resetLimits() {
  for (const limiter of [authLimiter, adminLimiter, publicReadLimiter, responseLimiter]) {
    for (const ip of ['127.0.0.1', '::ffff:127.0.0.1']) limiter.resetKey(ipKeyGenerator(ip));
  }
  if (conta) exportLimiter.resetKey(conta.usuario.id);
  if (outraConta) exportLimiter.resetKey(outraConta.usuario.id);
}

beforeAll(async () => {
  conta = (await api.post('/api/auth/cadastro').send(cadastro('a')).expect(201)).body;
  outraConta = (await api.post('/api/auth/cadastro').send(cadastro('b')).expect(201)).body;
});

beforeEach(async () => {
  resetLimits();
  await prisma.respostaPergunta.deleteMany();
  await prisma.resposta.deleteMany();
  await prisma.opcaoPergunta.deleteMany();
  await prisma.pergunta.deleteMany();
  await prisma.pontoColeta.deleteMany();
  await prisma.pesquisa.deleteMany();
  pesquisa = (await auth(api.post('/api/pesquisas')).send({ titulo: 'Satisfacao', slug: 'satisfacao' }).expect(201)).body;
  outraPesquisa = (await auth(api.post('/api/pesquisas'), outraConta.token).send({ titulo: 'Outra', slug: 'outra' }).expect(201)).body;
  perguntas = [];
  for (const [ordem, tipo] of ['ESTRELAS', 'ESTRELAS', 'NPS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'].entries()) {
    perguntas.push((await auth(api.post(perguntaPath())).send({ texto: `Pergunta ${ordem}`, tipo, ordem,
      ...(tipo === 'MULTIPLA_ESCOLHA' ? { opcoes: [{ texto: 'A', ordem: 0 }, { texto: 'B', ordem: 1 }] } : {}),
    }).expect(201)).body);
  }
  outraPergunta = (await auth(api.post(`/api/pesquisas/${outraPesquisa.id}/perguntas`), outraConta.token)
    .send({ texto: 'Outra pergunta', tipo: 'MULTIPLA_ESCOLHA', ordem: 0,
      opcoes: [{ texto: 'C', ordem: 0 }, { texto: 'D', ordem: 1 }] }).expect(201)).body;
  ponto = (await auth(api.post(`/api/pesquisas/${pesquisa.id}/pontos`)).send({ nome: 'Recepcao' }).expect(201)).body;
  outroPonto = (await auth(api.post(`/api/pesquisas/${outraPesquisa.id}/pontos`), outraConta.token).send({ nome: 'Outra origem' }).expect(201)).body;
});

async function coletarTres() {
  await publicar().expect(200);
  for (const [estrelas, nps, origem] of [[5, 10, ponto.token], [1, 0, undefined], [3, 8, ponto.token]]) {
    await postResposta({ ...bodyValido(estrelas, nps), ...(origem ? { origem } : {}) }).expect(201);
  }
  const rows = await prisma.resposta.findMany({ where: { pesquisaId: pesquisa.id }, orderBy: { createdAt: 'asc' } });
  for (const [i, row] of rows.entries()) await prisma.resposta.update({ where: { id: row.id }, data: { createdAt: new Date(`2026-10-0${i + 1}T12:00:00Z`) } });
  await auth(api.post(`/api/pesquisas/${outraPesquisa.id}/publicar`), outraConta.token).expect(200);
  await prisma.resposta.create({ data: { pesquisaId: outraPesquisa.id } });
}

describe('Autenticacao', () => {
  test('cadastro cria empresa, normaliza email, usa bcrypt e omite hashes', async () => {
    const data = cadastro('c'); data.email = 'USUARIOC@test.local';
    const response = await api.post('/api/auth/cadastro').send(data).expect(201);
    assert.equal(response.body.usuario.email, data.email.toLowerCase());
    assert.deepEqual(Object.keys(response.body.usuario).sort(), ['email', 'empresaId', 'id', 'nome']);
    const user = await prisma.usuario.findUnique({ where: { id: response.body.usuario.id } });
    assert.equal(bcrypt.getRounds(user.senhaHash), 12);
    assert.equal(await bcrypt.compare(senha, user.senhaHash), true);
    const count = await prisma.empresa.count();
    await api.post('/api/auth/cadastro').send({ ...cadastro('d'), email: data.email }).expect(409);
    assert.equal(await prisma.empresa.count(), count);
    await api.post('/api/auth/cadastro').send({ ...cadastro('e'), empresaId: conta.usuario.empresaId }).expect(400);
    await api.post('/api/auth/cadastro').send({ ...cadastro('e'), senha: '\u00e9'.repeat(40) }).expect(400);
  });

  test('login valida senha e retorna token com expiracao sem hash', async () => {
    const response = await api.post('/api/auth/login').send({ email: 'USUARIOA@test.local', senha }).expect(200);
    assert.equal(response.body.usuario.id, conta.usuario.id);
    assert.ok(!JSON.stringify(response.body).includes('senhaHash'));
    assert.equal(jwt.verify(response.body.token, process.env.JWT_SECRET).sub, conta.usuario.id);
    const wrong = await api.post('/api/auth/login').send({ email: 'usuarioa@test.local', senha: 'senha-incorreta' }).expect(401);
    const missing = await api.post('/api/auth/login').send({ email: 'inexistente@test.local', senha }).expect(401);
    assert.deepEqual(wrong.body, missing.body);
    await api.post('/api/auth/login').send({ email: 'invalido', senha }).expect(400);
  });

  test('JWT invalido, expirado, sem exp, com algoritmo diferente ou usuario ausente e rejeitado', async () => {
    await api.get('/api/dashboard').expect(401);
    const sign = options => jwt.sign({}, process.env.JWT_SECRET, { subject: conta.usuario.id, ...options });
    for (const token of ['invalid', sign({ expiresIn: -1 }), sign({}), sign({ algorithm: 'HS384', expiresIn: '1h' }),
      jwt.sign({}, process.env.JWT_SECRET, { subject: randomUUID(), expiresIn: '1h' })]) await auth(api.get('/api/dashboard'), token).expect(401);
  });
});

describe('Pesquisas, perguntas e pontos', () => {
  test('CRUD de pesquisas respeita validacao, status e exclusao segura', async () => {
    await auth(api.get('/api/pesquisas')).expect(200).then(res => assert.equal(res.body.total, 1));
    await auth(api.get(`/api/pesquisas/${pesquisa.id}`)).expect(200);
    await auth(api.patch(`/api/pesquisas/${pesquisa.id}`)).send({ titulo: 'Novo titulo' }).expect(200);
    await auth(api.post('/api/pesquisas')).send({ titulo: 'Outra', empresaId: outraConta.usuario.empresaId }).expect(400);
    await auth(api.patch(`/api/pesquisas/${pesquisa.id}`)).send({ status: 'ATIVA' }).expect(400);
    await auth(api.patch(`/api/pesquisas/${pesquisa.id}`)).send({ status: 'ENCERRADA' }).expect(409);
    const disposable = (await auth(api.post('/api/pesquisas')).send({ titulo: 'Excluir' }).expect(201)).body;
    await auth(api.delete(`/api/pesquisas/${disposable.id}`)).expect(204);
    await publicar().expect(200);
    await auth(api.patch(`/api/pesquisas/${pesquisa.id}`)).send({ titulo: 'Nao alterar' }).expect(409);
    await auth(api.delete(`/api/pesquisas/${pesquisa.id}`)).expect(409);
    await auth(api.patch(`/api/pesquisas/${pesquisa.id}`)).send({ status: 'ENCERRADA' }).expect(200);
    await api.get('/api/public/pesquisas/satisfacao').expect(404);
  });

  test('CRUD de perguntas e opcoes mantem validacao e bloqueia edicao apos publicacao', async () => {
    const q = (await auth(api.post(perguntaPath())).send({ texto: 'Extra', tipo: 'TEXTO', obrigatoria: false, ordem: 9 }).expect(201)).body;
    await auth(api.get(perguntaPath(q.id))).expect(200);
    const updated = await auth(api.patch(perguntaPath(q.id))).send({ texto: 'Alterada' }).expect(200);
    assert.equal(updated.body.obrigatoria, false);
    await auth(api.get(perguntaPath())).expect(200).then(res => assert.equal(res.body.length, 8));
    await auth(api.patch(perguntaPath(q.id))).send({ tipo: 'MULTIPLA_ESCOLHA' }).expect(400);
    await auth(api.post(perguntaPath())).send({ texto: 'Invalida', tipo: 'MULTIPLA_ESCOLHA', ordem: 10, opcoes: [{ texto: 'A', ordem: 0 }] }).expect(400);
    await auth(api.patch(perguntaPath(perguntas[6].id))).send({ opcoes: [{ texto: 'Nova A', ordem: 0 }, { texto: 'Nova B', ordem: 1 }] }).expect(200);
    await auth(api.delete(perguntaPath(q.id))).expect(204);
    await publicar().expect(200);
    await auth(api.patch(perguntaPath(perguntas[0].id))).send({ texto: 'Nao alterar' }).expect(409);
    await auth(api.delete(perguntaPath(perguntas[0].id))).expect(409);
  });

  test('publicacao exige perguntas validas e status RASCUNHO', async () => {
    const empty = (await auth(api.post('/api/pesquisas')).send({ titulo: 'Vazia' }).expect(201)).body;
    await auth(api.post(`/api/pesquisas/${empty.id}/publicar`)).expect(400);
    await prisma.pergunta.create({ data: { pesquisaId: empty.id, texto: '   ', tipo: 'TEXTO', ordem: 0 } });
    await auth(api.post(`/api/pesquisas/${empty.id}/publicar`)).expect(400);
    await publicar().expect(200);
    await publicar().expect(409);
  });

  test('pontos possuem tokens unicos, CRUD e QR PNG com URL esperada', async () => {
    await auth(api.get(`/api/pesquisas/${pesquisa.id}/pontos`)).expect(200);
    await auth(api.get(`/api/pontos/${ponto.id}`)).expect(200);
    await auth(api.patch(`/api/pontos/${ponto.id}`)).send({ nome: 'Balcao' }).expect(200);
    const qr = await auth(api.get(`/api/pontos/${ponto.id}/qrcode`)).expect('Content-Type', 'image/png').expect(200);
    const expected = await QRCode.toBuffer(`http://localhost:5173/p/satisfacao?origem=${ponto.token}`, { type: 'png', width: 512, margin: 2, errorCorrectionLevel: 'M' });
    assert.deepEqual(qr.body, expected);
    const disposable = (await auth(api.post(`/api/pesquisas/${pesquisa.id}/pontos`)).send({ nome: 'Excluir' }).expect(201)).body;
    assert.notEqual(disposable.token, ponto.token);
    await auth(api.delete(`/api/pontos/${disposable.id}`)).expect(204);
    await auth(api.patch(`/api/pontos/${ponto.id}`)).send({ ativo: false }).expect(200);
    await auth(api.get(`/api/pontos/${ponto.id}/qrcode`)).expect(409);
  });
});

describe('API publica e resultados', () => {
  test('DTO publico ordenado nao expoe empresa, hashes, tokens ou timestamps internos', async () => {
    await api.get('/api/public/pesquisas/satisfacao').expect(404);
    await publicar().expect(200);
    const result = await api.get(`/api/public/pesquisas/satisfacao?origem=${ponto.token}`).expect(200);
    assert.deepEqual(Object.keys(result.body).sort(), ['descricao', 'perguntas', 'slug', 'titulo']);
    assert.deepEqual(result.body.perguntas.map(q => q.id), perguntas.map(q => q.id));
    assert.ok(!('opcoes' in result.body.perguntas[0]));
    assert.deepEqual(Object.keys(result.body.perguntas[6].opcoes[0]).sort(), ['id', 'texto']);
    for (const field of ['empresaId', 'senhaHash', 'createdAt', 'updatedAt', ponto.token]) assert.ok(!JSON.stringify(result.body).includes(field));
    await api.get(`/api/public/pesquisas/satisfacao?origem=${outroPonto.token}`).expect(400);
  });

  test('envio valido aceita cinco tipos, false booleano e origem opcional', async () => {
    await publicar().expect(200);
    await postResposta(bodyValido()).expect(201).then(res => assert.deepEqual(Object.keys(res.body), ['mensagem']));
    await postResposta({ ...bodyValido(), origem: ponto.token }).expect(201);
    const rows = await prisma.resposta.findMany({ where: { pesquisaId: pesquisa.id }, include: { perguntas: true } });
    assert.equal(rows.length, 2);
    assert.equal(rows[0].perguntas.length, 7);
    assert.equal(rows[0].perguntas.find(item => item.tipo === 'SIM_NAO').valorSimNao, false);
    assert.equal(rows.filter(row => row.pontoColetaId === ponto.id).length, 1);
    await auth(api.delete(`/api/pontos/${ponto.id}`)).expect(409);
  });

  test('envios invalidos nao gravam dados parciais', async () => {
    await publicar().expect(200);
    for (const [index, valor] of [[0, 0], [0, 6], [0, 1.5], [2, -1], [2, 11], [4, 'false'], [5, 'x'.repeat(2001)], [6, outraPergunta.opcoes[0].id]]) {
      const body = bodyValido(); body.respostas[index].valor = valor;
      await postResposta(body).expect(400);
    }
    const duplicate = bodyValido(); duplicate.respostas.push(duplicate.respostas[0]);
    await postResposta(duplicate).expect(400);
    const unknown = bodyValido(); unknown.respostas[0].perguntaId = randomUUID();
    await postResposta(unknown).expect(400);
    const missing = bodyValido(); missing.respostas.pop();
    await postResposta(missing).expect(400);
    await postResposta({ ...bodyValido(), origem: outroPonto.token }).expect(400);
    await auth(api.patch(`/api/pontos/${ponto.id}`)).send({ ativo: false }).expect(200);
    await postResposta({ ...bodyValido(), origem: ponto.token }).expect(400);
    assert.equal(await prisma.resposta.count(), 0);
    assert.equal(await prisma.respostaPergunta.count(), 0);
    await auth(api.patch(`/api/pesquisas/${pesquisa.id}`)).send({ status: 'ENCERRADA' }).expect(200);
    await postResposta(bodyValido()).expect(404);
  });

  test('dashboard separa medias e NPS por pergunta e aplica periodos UTC', async () => {
    await coletarTres();
    const result = await auth(api.get(`/api/pesquisas/${pesquisa.id}/resultados`)).expect(200);
    assert.equal(result.body.totalRespostas, 3);
    assert.equal(result.body.pesquisasAtivas, 1);
    const q = id => result.body.perguntas.find(row => row.id === id);
    assert.equal(q(perguntas[0].id).media, 3);
    assert.equal(q(perguntas[1].id).media, 1);
    assert.deepEqual(q(perguntas[0].id).distribuicao.map(row => row.quantidade), [1, 0, 1, 0, 1]);
    assert.equal(q(perguntas[2].id).nps, 0);
    assert.equal(q(perguntas[3].id).nps, 100);
    assert.ok(!('media' in q(perguntas[4].id)));
    const period = await auth(api.get('/api/dashboard')).query({ inicio: '2026-10-02', fim: '2026-10-02' }).expect(200);
    assert.equal(period.body.totalRespostas, 1);
    assert.deepEqual(period.body.respostasPorDia, [{ dia: '2026-10-02', quantidade: 1 }]);
    const filtered = await auth(api.get('/api/dashboard')).query({ pontoColetaId: ponto.id }).expect(200);
    assert.equal(filtered.body.totalRespostas, 2);
    const zero = await auth(api.get('/api/dashboard')).query({ inicio: '2030-01-01' }).expect(200);
    assert.equal(zero.body.perguntas.find(row => row.id === perguntas[0].id).media, null);
    await auth(api.get('/api/dashboard')).query({ inicio: '2026-10-03', fim: '2026-10-01' }).expect(400);
  });
});

describe('Feedbacks, CSV e isolamento', () => {
  test('feedbacks incluem textos, perguntas, notas, origem e data com paginacao', async () => {
    await coletarTres();
    const result = await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query({ pagina: 1, limite: 2 }).expect(200);
    assert.equal(result.body.total, 3);
    assert.equal(result.body.totalPaginas, 2);
    assert.equal(result.body.itens.length, 2);
    assert.equal(result.body.itens[0].data, '2026-10-03T12:00:00.000Z');
    assert.equal(result.body.itens[0].origem.nome, ponto.nome);
    assert.equal(result.body.itens[0].respostas.find(row => row.pergunta.tipo === 'TEXTO').texto, 'Bom atendimento');
    const page2 = await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query({ pagina: 2, limite: 2 }).expect(200);
    assert.equal(page2.body.itens.length, 1);
    assert.ok(page2.body.itens.every(row => !result.body.itens.some(other => other.id === row.id)));
    const filtered = await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query({ perguntaId: perguntas[0].id, nota: 5 }).expect(200);
    assert.equal(filtered.body.total, 1);
    const period = await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query({ inicio: '2026-10-02', fim: '2026-10-02' }).expect(200);
    assert.equal(period.body.total, 1);
    assert.equal(period.body.itens[0].origem, null);
    const point = await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query({ pontoColetaId: ponto.id }).expect(200);
    assert.equal(point.body.total, 2);
    for (const query of [{ pagina: 0 }, { limite: 101 }, { nota: 5 }, { perguntaId: perguntas[5].id, nota: 5 },
      { perguntaId: perguntas[0].id, nota: 0 }, { inicio: '2026-02-30' }]) await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query(query).expect(400);
  });

  test('CSV tem BOM UTF-8, escape, acentos e protecao de todas as celulas contra formulas', async () => {
    await auth(api.patch(perguntaPath(perguntas[5].id))).send({ texto: '=Pergunta;"texto"' }).expect(200);
    await auth(api.patch(`/api/pontos/${ponto.id}`)).send({ nome: '@Origem' }).expect(200);
    const changed = await auth(api.patch(perguntaPath(perguntas[6].id))).send({ opcoes: [{ texto: '-Opcao', ordem: 0 }, { texto: 'Outra', ordem: 1 }] }).expect(200);
    perguntas[6] = changed.body;
    await publicar().expect(200);
    await postResposta({ ...bodyValido(5, 10, '=HYPERLINK("teste");\nAvaliacao \u00e7'), origem: ponto.token }).expect(201);
    const response = await csvRequest().expect(200);
    assert.equal(response.headers['content-type'], 'text/csv; charset=utf-8');
    assert.ok(response.headers['content-disposition'].includes(`pesquisa-${pesquisa.id}.csv`));
    assert.deepEqual([...response.body.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    const csv = response.body.toString('utf8');
    assert.ok(csv.includes('"Resposta ID";"Data (UTC)"'));
    assert.ok(csv.includes('"\'@Origem"'));
    assert.ok(csv.includes('"\'=Pergunta;""texto"""'));
    assert.ok(csv.includes('"\'=HYPERLINK(""teste"");\nAvaliacao \u00e7"'));
    assert.ok(csv.includes('"\'-Opcao"'));
    const filtered = await csvRequest({ perguntaId: perguntas[0].id, nota: 1 }).expect(200);
    assert.equal(filtered.body.toString('utf8').split('\r\n').filter(Boolean).length, 1);
  });

  test('exportacao percorre mais de um lote sem duplicar ou truncar respostas', async () => {
    const ids = Array.from({ length: 105 }, () => randomUUID());
    await prisma.resposta.createMany({ data: ids.map(id => ({ id, pesquisaId: pesquisa.id })) });
    await prisma.respostaPergunta.createMany({ data: ids.map(respostaId => ({ respostaId, pesquisaId: pesquisa.id,
      perguntaId: perguntas[5].id, tipo: 'TEXTO', valorTexto: 'x'.repeat(2000) })) });
    const response = await csvRequest().expect(200);
    const lines = response.body.toString('utf8').split('\r\n').filter(Boolean);
    assert.equal(lines.length, 106);
    assert.equal(new Set(lines.slice(1).map(line => line.split(';')[0])).size, 105);
  });

  test('todas as rotas privadas impedem leitura e modificacao por outra empresa', async () => {
    const cases = [
      ['get', `/api/pesquisas/${pesquisa.id}`], ['patch', `/api/pesquisas/${pesquisa.id}`, { titulo: 'Ataque' }],
      ['delete', `/api/pesquisas/${pesquisa.id}`], ['post', `/api/pesquisas/${pesquisa.id}/publicar`],
      ['get', perguntaPath()], ['post', perguntaPath(), { texto: 'Ataque', tipo: 'TEXTO', ordem: 8 }],
      ['get', perguntaPath(perguntas[0].id)], ['patch', perguntaPath(perguntas[0].id), { texto: 'Ataque' }],
      ['delete', perguntaPath(perguntas[0].id)], ['get', `/api/pesquisas/${pesquisa.id}/pontos`],
      ['post', `/api/pesquisas/${pesquisa.id}/pontos`, { nome: 'Ataque' }], ['get', `/api/pontos/${ponto.id}`],
      ['patch', `/api/pontos/${ponto.id}`, { ativo: false }], ['delete', `/api/pontos/${ponto.id}`],
      ['get', `/api/pontos/${ponto.id}/qrcode`], ['get', `/api/pesquisas/${pesquisa.id}/resultados`],
      ['get', `/api/pesquisas/${pesquisa.id}/feedbacks`], ['get', `/api/pesquisas/${pesquisa.id}/exportar`],
    ];
    for (const [method, path, body] of cases) {
      let request = auth(api[method](path), outraConta.token);
      if (body) request = request.send(body);
      await request.expect(404);
    }
    await auth(api.get('/api/dashboard')).query({ pesquisaId: outraPesquisa.id }).expect(404);
    await auth(api.get('/api/dashboard')).query({ pontoColetaId: outroPonto.id }).expect(404);
    await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query({ perguntaId: outraPergunta.id }).expect(404);
    await auth(api.get(`/api/pesquisas/${pesquisa.id}/feedbacks`)).query({ pontoColetaId: outroPonto.id }).expect(404);
    const forgedClaim = jwt.sign({ empresaId: outraConta.usuario.empresaId }, process.env.JWT_SECRET, { subject: conta.usuario.id, expiresIn: '1h' });
    await auth(api.get(`/api/pesquisas/${outraPesquisa.id}`), forgedClaim).expect(404);
    const listed = await auth(api.get('/api/pesquisas'), outraConta.token).expect(200);
    assert.ok(listed.body.itens.every(row => row.empresaId === outraConta.usuario.empresaId));
    assert.equal((await prisma.pesquisa.findUnique({ where: { id: pesquisa.id } })).titulo, pesquisa.titulo);
  });
});

describe('Seguranca HTTP', () => {
  test('Helmet, CORS configurado, JSON invalido, payload limitado e erros padronizados', async () => {
    const allowed = await api.get('/api/health').set('Origin', 'http://localhost:5173').expect(200);
    assert.equal(allowed.headers['access-control-allow-origin'], 'http://localhost:5173');
    assert.equal(allowed.headers['x-content-type-options'], 'nosniff');
    assert.ok(!allowed.headers['x-powered-by']);
    await api.get('/api/health').set('Origin', 'https://malicioso.test').expect(403);
    await api.options('/api/dashboard').set('Origin', 'http://localhost:4173')
      .set('Access-Control-Request-Method', 'GET').set('Access-Control-Request-Headers', 'Authorization').expect(204);
    await api.post('/api/auth/login').set('Content-Type', 'application/json').send('{bad').expect(400);
    await api.post('/api/auth/login').set('Content-Type', 'application/json; charset=iso-8859-1').send('{}').expect(415);
    await api.post('/api/auth/login').send({ text: 'x'.repeat(70000) }).expect(413);
    const invalid = await auth(api.get('/api/dashboard')).query({ pesquisaId: 'invalid' }).expect(400);
    assert.equal(typeof invalid.body.erro, 'string'); assert.ok(Array.isArray(invalid.body.detalhes));
    await api.get('/api/not-found').expect(404);
  });

  test('autenticacao, envio publico e exportacao possuem rate limit', async () => {
    resetLimits();
    for (let i = 0; i < 10; i++) await api.post('/api/auth/login').send({}).expect(400);
    await api.post('/api/auth/login').send({}).expect(429).then(res => assert.ok(res.headers['retry-after']));
    for (let i = 0; i < 30; i++) await postResposta({}).expect(400);
    await postResposta({}).expect(429);
    for (let i = 0; i < 5; i++) await csvRequest().expect(200);
    await csvRequest().expect(429);
    assert.deepEqual(await prisma.$queryRawUnsafe('PRAGMA foreign_key_check'), []);
  });
});
