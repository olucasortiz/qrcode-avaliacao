import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { execSync } from 'node:child_process';
import assert from 'node:assert/strict';

export async function runAggregationsAndTransactionsTest() {
  console.log('\n======================================================');
  console.log('TESTE 4: Agregações (groupBy, aggregateRaw e Transações)');
  console.log('======================================================');

  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  const url = new URL(replSet.getUri());
  url.pathname = '/feedqr_proto_aggr';
  const uri = url.toString();

  // Executar db push
  execSync('npx prisma db push --schema=prototype/schema.prisma --accept-data-loss', {
    env: { ...process.env, PROTOTYPE_DATABASE_URL: uri },
    stdio: 'pipe',
  });

  const { PrismaClient } = await import('../generated-client/index.js');
  const prisma = new PrismaClient({ datasourceUrl: uri });

  const results = {
    groupBySupported: false,
    aggregateRawDailySupported: false,
    utcTimezoneRespected: false,
    aggregateRawInTransactionSupported: false,
    transactionalLimitationDetails: null,
  };

  try {
    const empresaId = '10000000-0000-4000-8000-000000000001';
    const pesquisaId = '30000000-0000-4000-8000-000000000001';
    const perguntaEstrelasId = '40000000-0000-4000-8000-000000000001';
    const perguntaNpsId = '40000000-0000-4000-8000-000000000002';

    await prisma.empresa.create({
      data: { id: empresaId, nome: 'Empresa Agregacoes', email: 'aggr@test.local' },
    });
    await prisma.pesquisa.create({
      data: { id: pesquisaId, empresaId, titulo: 'Pesquisa Agregacoes', slug: 'pesquisa-aggr', status: 'ATIVA' },
    });
    await prisma.pergunta.createMany({
      data: [
        { id: perguntaEstrelasId, pesquisaId, texto: 'Estrelas?', tipo: 'ESTRELAS', ordem: 0 },
        { id: perguntaNpsId, pesquisaId, texto: 'NPS?', tipo: 'NPS', ordem: 1 },
      ],
    });

    // Inserir respostas distribuídas em 3 dias UTC
    // Dia 1: 2026-10-01T12:00:00Z (2 respostas)
    // Dia 2: 2026-10-02T12:00:00Z (3 respostas)
    // Dia 3: 2026-10-03T12:00:00Z (1 resposta)
    const datas = [
      '2026-10-01T10:00:00.000Z',
      '2026-10-01T18:00:00.000Z',
      '2026-10-02T08:00:00.000Z',
      '2026-10-02T12:00:00.000Z',
      '2026-10-02T22:00:00.000Z',
      '2026-10-03T15:00:00.000Z',
    ];

    const notasEstrelas = [5, 4, 5, 3, 2, 5];
    const notasNps = [10, 8, 9, 6, 7, 10];

    for (let i = 0; i < datas.length; i++) {
      const respId = `70000000-0000-4000-8000-00000000000${i + 1}`;
      const d = new Date(datas[i]);

      await prisma.resposta.create({
        data: {
          id: respId,
          pesquisaId,
          createdAt: d,
          perguntas: {
            create: [
              {
                id: `90000000-0000-4000-8000-0000000000${i * 2 + 1}`,
                perguntaId: perguntaEstrelasId,
                tipo: 'ESTRELAS',
                valorEstrelas: notasEstrelas[i],
                createdAt: d,
              },
              {
                id: `90000000-0000-4000-8000-0000000000${i * 2 + 2}`,
                perguntaId: perguntaNpsId,
                tipo: 'NPS',
                valorNps: notasNps[i],
                createdAt: d,
              },
            ],
          },
        },
      });
    }

    // 1. Validar groupBy do Prisma ORM
    console.log('  [1] Testando groupBy do Prisma no modelo RespostaPergunta...');
    const grouped = await prisma.respostaPergunta.groupBy({
      by: ['valorEstrelas'],
      where: {
        perguntaId: perguntaEstrelasId,
        valorEstrelas: { not: null },
      },
      _count: { _all: true },
      _avg: { valorEstrelas: true },
    });

    assert.ok(grouped.length > 0, 'groupBy deve retornar grupos');
    console.log('    [PASS] groupBy retornou', grouped.length, 'grupos com médias e contagens agregadas.');
    results.groupBySupported = true;

    // 2. Validar aggregateRaw para série diária com UTC
    console.log('  [2] Testando aggregateRaw para evolução diária em UTC...');
    const dailyPipeline = [
      { $match: { pesquisaId } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'UTC',
            },
          },
          quantidade: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const rawDaily = await prisma.resposta.aggregateRaw({
      pipeline: dailyPipeline,
    });

    console.log('    Resultado aggregateRaw diário:', JSON.stringify(rawDaily));
    assert.equal(rawDaily.length, 3, 'Deve haver 3 dias distintos agrupados');
    assert.deepEqual(rawDaily, [
      { _id: '2026-10-01', quantidade: 2 },
      { _id: '2026-10-02', quantidade: 3 },
      { _id: '2026-10-03', quantidade: 1 },
    ], 'Quantidades por dia devem coincidir exatamente com os dados inseridos');

    results.aggregateRawDailySupported = true;
    results.utcTimezoneRespected = true;
    console.log('    [PASS] aggregateRaw calculou a série diária em UTC com 100% de precisão.');

    // 3. Testar aggregateRaw dentro de $transaction
    console.log('  [3] Testando aggregateRaw DENTRO de transação interativa ($transaction)...');
    try {
      const txResult = await prisma.$transaction(async (tx) => {
        // Verificar se tx.resposta.aggregateRaw existe e é suportado
        if (typeof tx.resposta.aggregateRaw !== 'function') {
          throw new Error('tx.resposta.aggregateRaw NÃO é uma função na sessão transacional');
        }

        const txDaily = await tx.resposta.aggregateRaw({
          pipeline: dailyPipeline,
        });

        // Leitura adicional dentro da mesma transação
        const count = await tx.resposta.count({ where: { pesquisaId } });

        return { txDaily, count };
      });

      console.log('    [PASS] aggregateRaw FUNCIONOU dentro de $transaction!', txResult.count, 'respostas.');
      results.aggregateRawInTransactionSupported = true;
    } catch (err) {
      console.warn('    [LIMITAÇÃO DETECTADA] aggregateRaw falhou dentro de $transaction:', err.message);
      results.aggregateRawInTransactionSupported = false;
      results.transactionalLimitationDetails = err.message;
    }

  } finally {
    await prisma.$disconnect();
    await replSet.stop();
  }

  return results;
}

if (process.argv[1]?.includes('04_aggregations_and_transactions.js')) {
  runAggregationsAndTransactionsTest()
    .then(r => console.log('\nResultado do Teste 4:', r))
    .catch(e => { console.error(e); process.exit(1); });
}
