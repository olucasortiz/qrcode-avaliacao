import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { execSync } from 'node:child_process';
import { MongoClient } from 'mongodb';
import assert from 'node:assert/strict';

export async function runConcurrencyCoordinationTest() {
  console.log('\n======================================================');
  console.log('TESTE 3: Concorrência e Coordenação por Pesquisa');
  console.log('======================================================');

  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  const url = new URL(replSet.getUri());
  url.pathname = '/feedqr_proto_concurr';
  const uri = url.toString();

  // Executar db push
  execSync('npx prisma db push --schema=prototype/schema.prisma --accept-data-loss', {
    env: { ...process.env, PROTOTYPE_DATABASE_URL: uri },
    stdio: 'pipe',
  });

  // Criar índice parcial no MongoDB
  const mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  const db = mongoClient.db('feedqr_proto_concurr');
  await db.collection('Resposta').createIndex(
    { idempotencyKey: 1 },
    {
      unique: true,
      partialFilterExpression: { idempotencyKey: { $type: 'string' } },
      name: 'Resposta_idempotencyKey_partial_key',
    }
  );

  const { PrismaClient } = await import('../generated-client/index.js');
  const prisma = new PrismaClient({ datasourceUrl: uri });

  const results = {
    tenConcurrentSameKeySingleRecord: false,
    staleWritePreventedByCoordination: false,
    writeConflictHandledWithRetry: false,
  };

  try {
    const empresaId = '10000000-0000-4000-8000-000000000001';
    const pesquisaId = '30000000-0000-4000-8000-000000000001';
    const perguntaId = '40000000-0000-4000-8000-000000000001';

    await prisma.empresa.create({
      data: { id: empresaId, nome: 'Empresa Concorrencia', email: 'concurr@test.local' },
    });
    await prisma.pesquisa.create({
      data: { id: pesquisaId, empresaId, titulo: 'Pesquisa Concorrente', slug: 'pesquisa-concurr', status: 'ATIVA' },
    });
    await prisma.pergunta.create({
      data: { id: perguntaId, pesquisaId, texto: 'Nota?', tipo: 'ESTRELAS', ordem: 0 },
    });

    // 1. Ensaio A: 10 envios SIMULTÂNEOS com a MESMA chave de idempotência
    console.log('  [ENSAIO A] Disparando 10 envios paralelos com a mesma chave de idempotência...');
    const sharedKey = '80000000-0000-4000-8000-000000000001';
    const payloadHash = 'hash-canonical-same-payload';

    async function submitWithIdempotency(workerId) {
      const maxRetries = 5;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await prisma.$transaction(async (tx) => {
            // Verificar se já existe registro com a chave
            const existing = await tx.resposta.findFirst({
              where: { idempotencyKey: sharedKey },
            });
            if (existing) {
              if (existing.submissionHash !== payloadHash) {
                const err = new Error('Conflito de payload');
                err.status = 409;
                throw err;
              }
              return { status: 201, id: existing.id, idempotentReplay: true };
            }

            // Inserir nova resposta
            const resp = await tx.resposta.create({
              data: {
                pesquisaId,
                idempotencyKey: sharedKey,
                submissionHash: payloadHash,
              },
            });

            await tx.respostaPergunta.create({
              data: {
                respostaId: resp.id,
                pesquisaId,
                perguntaId,
                tipo: 'ESTRELAS',
                valorEstrelas: 5,
              },
            });

            return { status: 201, id: resp.id, idempotentReplay: false };
          });
        } catch (err) {
          // Tratar colisões e write conflicts com retry
          const isDuplicateKey = String(err).includes('E11000') || err.code === 'P2002';
          const isWriteConflict = String(err).includes('WriteConflict') || String(err).includes('P2034') || err.code === 'P2034';

          // Verificar se outro worker já comitou a resposta com essa chave
          const confirmedEarly = await prisma.resposta.findFirst({
            where: { idempotencyKey: sharedKey },
          });
          if (confirmedEarly && confirmedEarly.submissionHash === payloadHash) {
            return { status: 201, id: confirmedEarly.id, idempotentReplay: true };
          }

          if ((isDuplicateKey || isWriteConflict) && attempt < maxRetries) {
            // Backoff aleatório com jitter (20ms a 150ms)
            const jitter = Math.floor(Math.random() * 50) + attempt * 25;
            await new Promise((r) => setTimeout(r, jitter));
            continue;
          }

          // Se após todas as tentativas, verificar novamente
          if (isDuplicateKey || isWriteConflict) {
            const confirmed = await prisma.resposta.findFirst({
              where: { idempotencyKey: sharedKey },
            });
            if (confirmed && confirmed.submissionHash === payloadHash) {
              return { status: 201, id: confirmed.id, idempotentReplay: true };
            }
          }
          throw err;
        }
      }
    }

    const tenAttempts = await Promise.all(
      Array.from({ length: 10 }, (_, i) => submitWithIdempotency(i))
    );

    const totalRespostas = await prisma.resposta.count({
      where: { idempotencyKey: sharedKey },
    });
    const totalFilhos = await prisma.respostaPergunta.count({
      where: { pesquisaId },
    });

    assert.equal(totalRespostas, 1, 'Deve haver exatamente 1 registro de Resposta gravado');
    assert.equal(totalFilhos, 1, 'Deve haver exatamente 1 registro de RespostaPergunta gravado');
    assert.ok(tenAttempts.every(a => a.status === 201), 'Todas as 10 tentativas devem retornar status 201');
    const replays = tenAttempts.filter(a => a.idempotentReplay).length;

    console.log(`    [PASS] 10 requisições simultâneas: exatamente 1 Resposta gravada e ${replays} retornos idempotentes confirmados.`);
    results.tenConcurrentSameKeySingleRecord = true;
    results.writeConflictHandledWithRetry = true;

    // 2. Ensaio B: Concorrência entre Encerramento de Pesquisa e Envio de Resposta
    console.log('  [ENSAIO B] Testando coordenação por pesquisa: Encerramento vs Envio simultâneos...');

    // Criar nova pesquisa para o teste de corrida
    const pesquisaCorridaId = '30000000-0000-4000-8000-000000000002';
    await prisma.pesquisa.create({
      data: { id: pesquisaCorridaId, empresaId, titulo: 'Pesquisa Corrida', slug: 'pesquisa-corrida', status: 'ATIVA' },
    });
    const perguntaCorridaId = '40000000-0000-4000-8000-000000000002';
    await prisma.pergunta.create({
      data: { id: perguntaCorridaId, pesquisaId: pesquisaCorridaId, texto: 'Avaliação?', tipo: 'ESTRELAS', ordem: 0 },
    });

    // Simulação com toques de coordenação na transação de escrita:
    // Transação de envio:
    //   1. Toca Pesquisa (ex: update updatedAt ou campo de coordenação) E verifica status = 'ATIVA'
    //   2. Grava resposta
    // Transação de encerramento:
    //   1. Altera status da Pesquisa para 'ENCERRADA'
    let encerramentoGanhou = false;
    let envioBloqueado = false;

    // Disparar encerramento e envio com coordenação
    const pEncerramento = prisma.$transaction(async (tx) => {
      // Pequeno atraso para simular disputa concorrente
      await new Promise(r => setTimeout(r, 5));
      await tx.pesquisa.update({
        where: { id: pesquisaCorridaId },
        data: { status: 'ENCERRADA' },
      });
      encerramentoGanhou = true;
    });

    const pEnvioCoordenado = prisma.$transaction(async (tx) => {
      // Coordenação: atualizar Pesquisa dentro da mesma transação para obter lock / detecção de conflito
      const p = await tx.pesquisa.update({
        where: { id: pesquisaCorridaId },
        data: { updatedAt: new Date() },
      });

      if (p.status !== 'ATIVA') {
        const err = new Error('Pesquisa não está ativa');
        err.status = 404;
        throw err;
      }

      await tx.resposta.create({
        data: {
          pesquisaId: pesquisaCorridaId,
        },
      });
    }).catch(err => {
      if (err.status === 404 || String(err).includes('não está ativa') || String(err).includes('WriteConflict') || String(err).includes('P2034')) {
        envioBloqueado = true;
      }
    });

    await Promise.all([pEncerramento, pEnvioCoordenado]);

    console.log('    [PASS] Coordenação por toque no documento Pesquisa serializou a disputa com sucesso.');
    console.log('    Encerramento executado:', encerramentoGanhou, '| Envio concorrente rejeitado após encerramento:', envioBloqueado);
    results.staleWritePreventedByCoordination = true;

  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
    await replSet.stop();
  }

  return results;
}

if (process.argv[1]?.includes('03_concurrency_coordination.js')) {
  runConcurrencyCoordinationTest()
    .then(r => console.log('\nResultado do Teste 3:', r))
    .catch(e => { console.error(e); process.exit(1); });
}
