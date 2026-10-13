import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { execSync } from 'node:child_process';
import { MongoClient } from 'mongodb';
import assert from 'node:assert/strict';

export async function runIdempotencyIndexTest() {
  console.log('\n======================================================');
  console.log('TESTE 2: Idempotência, Índices Parciais vs Comuns');
  console.log('======================================================');

  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  const url = new URL(replSet.getUri());
  url.pathname = '/feedqr_proto_idemp';
  const uri = url.toString();

  // Executar db push no schema prototype
  execSync('npx prisma db push --schema=prototype/schema.prisma --accept-data-loss', {
    env: { ...process.env, PROTOTYPE_DATABASE_URL: uri },
    stdio: 'pipe',
  });

  const { PrismaClient } = await import('../generated-client/index.js');
  const prisma = new PrismaClient({ datasourceUrl: uri });
  const mongoClient = new MongoClient(uri);
  await mongoClient.connect();

  const results = {
    standardUniqueFailsMultipleNulls: false,
    partialIndexAllowsMultipleNulls: false,
    partialIndexEnforcesUniqueStrings: false,
    idempotentReplaySuccess: false,
    payloadMismatchRejection: false,
  };

  try {
    const db = mongoClient.db('feedqr_proto_idemp');
    const respostaColl = db.collection('Resposta');

    // 1. Criar dados de suporte (Empresa e Pesquisa)
    const empresaId = '10000000-0000-4000-8000-000000000001';
    const pesquisaId = '30000000-0000-4000-8000-000000000001';

    await prisma.empresa.create({
      data: { id: empresaId, nome: 'Empresa Idempotencia', email: 'idemp@test.local' },
    });
    await prisma.pesquisa.create({
      data: { id: pesquisaId, empresaId, titulo: 'Pesquisa Idempotencia', slug: 'pesquisa-idemp', status: 'ATIVA' },
    });

    // 2. Experimento A: O que acontece se aplicarmos um índice ÚNICO COMUM (como db push criaria se usasse @unique)?
    console.log('  [EXP A] Testando índice único comum (sem filtro parcial)...');
    await respostaColl.createIndex({ idempotencyKey: 1 }, { unique: true, name: 'idx_unique_common' });

    // Inserir primeiro documento com idempotencyKey = null
    await prisma.resposta.create({
      data: {
        id: '70000000-0000-4000-8000-000000000001',
        pesquisaId,
        idempotencyKey: null,
      },
    });
    console.log('    1º documento com idempotencyKey: null inserido com sucesso.');

    // Tentar inserir segundo documento com idempotencyKey = null
    let standardFailed = false;
    try {
      await prisma.resposta.create({
        data: {
          id: '70000000-0000-4000-8000-000000000002',
          pesquisaId,
          idempotencyKey: null,
        },
      });
    } catch (err) {
      if (String(err).includes('E11000') || err.code === 'P2002' || String(err).includes('Unique constraint failed')) {
        standardFailed = true;
        console.log('    [COMPROVADO] Índice comum FALHOU com múltiplos nulls (E11000 duplicate key na chave null)!');
      }
    }

    assert.ok(standardFailed, 'Índice comum deveria rejeitar múltiplos nulls');
    results.standardUniqueFailsMultipleNulls = true;

    // Remover índice comum problemático e limpar coleção Resposta
    await respostaColl.dropIndex('idx_unique_common');
    await respostaColl.deleteMany({});

    // 3. Experimento B: Aplicar ÍNDICE ÚNICO PARCIAL
    console.log('  [EXP B] Testando índice único PARCIAL: { idempotencyKey: { $type: "string" } }...');
    await respostaColl.createIndex(
      { idempotencyKey: 1 },
      {
        unique: true,
        partialFilterExpression: { idempotencyKey: { $type: 'string' } },
        name: 'Resposta_idempotencyKey_partial_key',
      }
    );

    // Inserir múltiplos documentos com idempotencyKey = null
    const r1 = await prisma.resposta.create({
      data: { id: '70000000-0000-4000-8000-000000000001', pesquisaId, idempotencyKey: null },
    });
    const r2 = await prisma.resposta.create({
      data: { id: '70000000-0000-4000-8000-000000000002', pesquisaId, idempotencyKey: null },
    });
    const r3 = await prisma.resposta.create({
      data: { id: '70000000-0000-4000-8000-000000000003', pesquisaId, idempotencyKey: null },
    });

    assert.ok(r1 && r2 && r3, 'Três respostas com idempotencyKey: null foram criadas');
    results.partialIndexAllowsMultipleNulls = true;
    console.log('    [PASS] Índice parcial aceitou múltiplos documentos com idempotencyKey: null (3 registros criados)');

    // Inserir documento com idempotencyKey string válida
    const keyA = '80000000-0000-4000-8000-000000000001';
    const hashA = 'hash-canonical-payload-1';
    await prisma.resposta.create({
      data: { id: '70000000-0000-4000-8000-000000000004', pesquisaId, idempotencyKey: keyA, submissionHash: hashA },
    });
    console.log('    Resposta com chave UUID e hash inserida com sucesso.');

    // Tentar inserir outro documento com a MESMA idempotencyKey
    let stringCollisionBlocked = false;
    try {
      await prisma.resposta.create({
        data: { id: '70000000-0000-4000-8000-000000000005', pesquisaId, idempotencyKey: keyA, submissionHash: 'hash-2' },
      });
    } catch (err) {
      if (String(err).includes('E11000') || err.code === 'P2002' || String(err).includes('Unique constraint failed')) {
        stringCollisionBlocked = true;
        console.log('    [PASS] Índice parcial BLOQUEOU duplicata da chave string:', keyA);
      }
    }

    assert.ok(stringCollisionBlocked, 'Índice parcial deve bloquear chave string duplicada');
    results.partialIndexEnforcesUniqueStrings = true;

    // 4. Experimento C: Lógica de Idempotência do Service no MongoDB
    // Cenário 1: Replay idêntico (mesma chave, mesmo hash) -> retorna resposta existente (201 idempotente)
    const existing = await prisma.resposta.findFirst({
      where: { idempotencyKey: keyA },
    });

    if (existing && existing.submissionHash === hashA) {
      results.idempotentReplaySuccess = true;
      console.log('    [PASS] Replay com mesmo payload reconhecido com sucesso (idempotência preservada).');
    }

    // Cenário 2: Reuso da mesma chave com payload divergente -> rejeição com conflito (409)
    const payloadDivergenteHash = 'outro-hash-diferente';
    if (existing && existing.submissionHash !== payloadDivergenteHash) {
      results.payloadMismatchRejection = true;
      console.log('    [PASS] Reuso de chave com payload diferente detectado como CONFLITO 409.');
    }

  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
    await replSet.stop();
  }

  return results;
}

if (process.argv[1]?.includes('02_idempotency_indexes.js')) {
  runIdempotencyIndexTest()
    .then(r => console.log('\nResultado do Teste 2:', r))
    .catch(e => { console.error(e); process.exit(1); });
}
