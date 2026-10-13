import { describe, test, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert/strict';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import {
  runSync,
  sanitizeMongoUri,
  validateTargetSafety,
  inspectDatabase,
  compareWithManifest,
} from '../scripts/sync-mongodb.js';
import { MONGO_MANIFEST } from '../src/config/mongo/schemaManifest.js';

describe('TASK 07.3: Sincronizador de Índices e Validators MongoDB', () => {
  let replSet;
  let baseUri;

  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' },
    });
    baseUri = replSet.getUri();
  }, 40000);

  afterAll(async () => {
    if (replSet) await replSet.stop();
  });

  function getTestUri(dbName) {
    const u = new URL(baseUri);
    u.pathname = `/${dbName}`;
    return u.toString();
  }

  test('1. Proteção e sanitização de URIs', () => {
    // Sanitização de senha
    const secretUri = 'mongodb://app_user:MinhaSenhaSecreta123@127.0.0.1:27017/feedqr_test';
    const clean = sanitizeMongoUri(secretUri);
    assert.ok(!clean.includes('MinhaSenhaSecreta123'), 'Senha não pode aparecer na URI sanitizada');
    assert.ok(clean.includes('***'), 'Senha deve ser substituída por ***');

    // Bloqueio de banco de dados não informado
    assert.throws(() => validateTargetSafety('mongodb://127.0.0.1:27017/'), /banco de dados explícito/);

    // Bloqueio de bancos reservados
    assert.throws(() => validateTargetSafety('mongodb://127.0.0.1:27017/admin'), /reservado/);
    assert.throws(() => validateTargetSafety('mongodb://127.0.0.1:27017/local'), /reservado/);
    assert.throws(() => validateTargetSafety('mongodb://127.0.0.1:27017/config'), /reservado/);

    // Bloqueio de host remoto sem autorização
    assert.throws(
      () => validateTargetSafety('mongodb://cluster0.mongodb.net/feedqr_prod', { allowRemote: false }),
      /bloqueada por segurança/
    );

    // Host local permitido
    const validLocal = validateTargetSafety(getTestUri('feedqr_safety_test'));
    assert.equal(validLocal.dbName, 'feedqr_safety_test');
    assert.equal(validLocal.isLocalhost, true);
  });

  test('2. Modo dry-run não modifica o banco', async () => {
    const uri = getTestUri('feedqr_dryrun_test');
    const dryRunRes = await runSync({ uri, mode: 'dry-run' });

    assert.equal(dryRunRes.ok, true);
    assert.equal(dryRunRes.report.summary.collectionsToCreate, 8);
    assert.equal(dryRunRes.report.summary.indexesToCreate, 20);

    // Conferir que o banco permaneceu vazio
    const client = new MongoClient(uri);
    await client.connect();
    const cols = await client.db('feedqr_dryrun_test').listCollections().toArray();
    await client.close();

    assert.equal(cols.length, 0, 'Modo dry-run não deve criar coleções no banco');
  });

  test('3. Modo apply provisiona coleções, índices e validators', async () => {
    const uri = getTestUri('feedqr_apply_test');
    const applyRes = await runSync({ uri, mode: 'apply' });

    assert.equal(applyRes.ok, true);
    assert.equal(applyRes.report.summary.collectionsToCreate, 8);

    // Modo verify logo após apply deve passar com sucesso
    const verifyRes = await runSync({ uri, mode: 'verify' });
    assert.equal(verifyRes.ok, true);
    assert.equal(verifyRes.report.summary.collectionsToCreate, 0);
    assert.equal(verifyRes.report.summary.indexesToCreate, 0);
  });

  test('4. Idempotência: rodar apply duas vezes não gera alterações redundantes', async () => {
    const uri = getTestUri('feedqr_idempotence_test');

    // 1º apply
    await runSync({ uri, mode: 'apply' });

    // 2º apply
    const secondApply = await runSync({ uri, mode: 'apply' });
    assert.equal(secondApply.report.summary.collectionsToCreate, 0);
    assert.equal(secondApply.report.summary.indexesToCreate, 0);
    assert.equal(secondApply.report.summary.validatorsToApply, 0);
  });

  test('5. Detecção de divergência e abort de segurança', async () => {
    const uri = getTestUri('feedqr_divergence_test');
    await runSync({ uri, mode: 'apply' });

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('feedqr_divergence_test');

    // Forçar um índice divergente: dropar o índice de email e recriar com opções diferentes
    await db.collection('Empresa').dropIndex('Empresa_email_key');
    await db.collection('Empresa').createIndex({ email: -1 }, { name: 'Empresa_email_key' }); // Ordem reversa proposital!
    await client.close();

    // Executar verify -> deve falhar acusando divergência
    await assert.rejects(
      async () => runSync({ uri, mode: 'verify' }),
      /DIVERGÊNCIA DETECTADA/
    );

    // Executar apply -> deve abortar sem sobrescrever
    await assert.rejects(
      async () => runSync({ uri, mode: 'apply' }),
      /DIVERGÊNCIA DETECTADA/
    );
  });

  test('6. Índice único parcial permite múltiplos nulls e bloqueia strings duplicadas', async () => {
    const uri = getTestUri('feedqr_partial_test');
    await runSync({ uri, mode: 'apply' });

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('feedqr_partial_test');
    const col = db.collection('Resposta');

    const pesquisaId = '30000000-0000-4000-8000-000000000001';

    // Múltiplos nulls devem ser aceitos sem erro de duplicate key
    await col.insertOne({ _id: 'r1', pesquisaId, idempotencyKey: null, createdAt: new Date(), updatedAt: new Date() });
    await col.insertOne({ _id: 'r2', pesquisaId, idempotencyKey: null, createdAt: new Date(), updatedAt: new Date() });
    await col.insertOne({ _id: 'r3', pesquisaId, createdAt: new Date(), updatedAt: new Date() }); // Chave ausente

    const countNull = await col.countDocuments({});
    assert.equal(countNull, 3, 'Devem existir 3 respostas sem chave/com chave nula');

    // Chave preenchida única
    await col.insertOne({ _id: 'r4', pesquisaId, idempotencyKey: 'chave-uuid-1', createdAt: new Date(), updatedAt: new Date() });

    // Tentativa de duplicar chave string preenchida -> deve lançar duplicate key (E11000)
    await assert.rejects(
      async () => col.insertOne({ _id: 'r5', pesquisaId, idempotencyKey: 'chave-uuid-1', createdAt: new Date(), updatedAt: new Date() }),
      /E11000/
    );

    await client.close();
  });

  test('7. JSON Schema Validators rejeitam notas inválidas e violações de exclusividade de tipo', async () => {
    const uri = getTestUri('feedqr_validator_test');
    await runSync({ uri, mode: 'apply' });

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('feedqr_validator_test');
    const rpCol = db.collection('RespostaPergunta');

    const baseDoc = {
      _id: 'rp1',
      respostaId: 'r1',
      pesquisaId: 'p1',
      perguntaId: 'q1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Caso A: ESTRELAS válida (1 a 5, outros campos nulos) -> deve ser aceita
    await rpCol.insertOne({
      ...baseDoc,
      tipo: 'ESTRELAS',
      valorEstrelas: 5,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
    });

    // Caso B: ESTRELAS com nota 99 (fora do intervalo 1..5) -> deve falhar validação (Erro 121)
    await assert.rejects(
      async () => rpCol.insertOne({
        ...baseDoc,
        _id: 'rp2',
        tipo: 'ESTRELAS',
        valorEstrelas: 99,
        valorNps: null,
        valorSimNao: null,
        valorTexto: null,
        opcaoPerguntaId: null,
      }),
      /Document failed validation|121/
    );

    // Caso C: NPS com nota 11 (fora do intervalo 0..10) -> deve falhar
    await assert.rejects(
      async () => rpCol.insertOne({
        ...baseDoc,
        _id: 'rp3',
        tipo: 'NPS',
        valorNps: 11,
        valorEstrelas: null,
        valorSimNao: null,
        valorTexto: null,
        opcaoPerguntaId: null,
      }),
      /Document failed validation|121/
    );

    // Caso D: Violação de exclusividade (tipo ESTRELAS, mas valorNps também preenchido) -> deve falhar
    await assert.rejects(
      async () => rpCol.insertOne({
        ...baseDoc,
        _id: 'rp4',
        tipo: 'ESTRELAS',
        valorEstrelas: 4,
        valorNps: 10, // Inválido! Ambos preenchidos
        valorSimNao: null,
        valorTexto: null,
        opcaoPerguntaId: null,
      }),
      /Document failed validation|121/
    );

    // Caso E: Enum inválido
    await assert.rejects(
      async () => rpCol.insertOne({
        ...baseDoc,
        _id: 'rp5',
        tipo: 'TIPO_INEXISTENTE',
        valorEstrelas: null,
        valorNps: null,
        valorSimNao: null,
        valorTexto: null,
        opcaoPerguntaId: null,
      }),
      /Document failed validation|121/
    );

    await client.close();
  });

  test('8. Prisma Client MongoDB opera perfeitamente sobre coleções e índices sincronizados', async () => {
    const uri = getTestUri('feedqr_prisma_sync_test');
    await runSync({ uri, mode: 'apply' });

    const { PrismaClient } = await import('../src/generated/mongo-client/index.js');
    const prismaMongo = new PrismaClient({ datasourceUrl: uri });

    try {
      // Criar empresa e pesquisa
      const empresa = await prismaMongo.empresa.create({
        data: {
          id: '10000000-0000-4000-8000-000000000001',
          nome: 'Empresa Prisma Sync',
          email: 'prisma_sync@test.local',
        },
      });

      const pesquisa = await prismaMongo.pesquisa.create({
        data: {
          id: '30000000-0000-4000-8000-000000000001',
          empresaId: empresa.id,
          titulo: 'Pesquisa Prisma Sync',
          slug: 'pesquisa-prisma-sync',
          status: 'ATIVA',
          perguntas: {
            create: [
              {
                id: '40000000-0000-4000-8000-000000000001',
                texto: 'Avaliação geral?',
                tipo: 'ESTRELAS',
                ordem: 0,
              },
            ],
          },
        },
        include: { perguntas: true },
      });

      assert.equal(pesquisa.empresaId, empresa.id);
      assert.equal(pesquisa.perguntas.length, 1);

      // Inserir resposta sem chave (null)
      const resp1 = await prismaMongo.resposta.create({
        data: {
          id: '70000000-0000-4000-8000-000000000001',
          pesquisaId: pesquisa.id,
          idempotencyKey: null,
        },
      });

      // Inserir segunda resposta sem chave (null) -> deve passar pelo índice parcial
      const resp2 = await prismaMongo.resposta.create({
        data: {
          id: '70000000-0000-4000-8000-000000000002',
          pesquisaId: pesquisa.id,
          idempotencyKey: null,
        },
      });

      assert.ok(resp1 && resp2);
      const total = await prismaMongo.resposta.count({ where: { pesquisaId: pesquisa.id } });
      assert.equal(total, 2);
    } finally {
      await prismaMongo.$disconnect();
    }
  });
});
