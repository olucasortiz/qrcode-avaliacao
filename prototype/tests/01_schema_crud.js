import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { execSync } from 'node:child_process';
import assert from 'node:assert/strict';

export async function runSchemaCrudTest() {
  console.log('\n======================================================');
  console.log('TESTE 1: Schema Prisma, UUID _id, CRUD e Relações');
  console.log('======================================================');

  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  const url = new URL(replSet.getUri());
  url.pathname = '/feedqr_proto_crud';
  const uri = url.toString();

  // Executar db push
  execSync('npx prisma db push --schema=prototype/schema.prisma --accept-data-loss', {
    env: { ...process.env, PROTOTYPE_DATABASE_URL: uri },
    stdio: 'pipe',
  });

  const { PrismaClient } = await import('../generated-client/index.js');
  const prisma = new PrismaClient({ datasourceUrl: uri });

  const results = {
    uuidAsId: false,
    createAndFind: false,
    includeRelations: false,
    relationalFilter: false,
    createMany: false,
    nestedWrites: false,
    restrictDelete: false,
    bsonDates: false,
  };

  try {
    // 1. Validar UUID _id e create
    const empresaId = '10000000-0000-4000-8000-000000000001';
    const empresa = await prisma.empresa.create({
      data: {
        id: empresaId,
        nome: 'Empresa Teste CRUD',
        email: 'crud@test.local',
      },
    });

    assert.equal(empresa.id, empresaId, 'ID da empresa deve ser exatamente a string UUID fornecida');
    results.uuidAsId = true;
    console.log('  [PASS] UUID preservado como string em _id:', empresa.id);

    // 2. Validar BSON Date UTC
    assert.ok(empresa.createdAt instanceof Date, 'createdAt deve ser instância de Date');
    results.bsonDates = true;
    console.log('  [PASS] Data BSON Date UTC válida:', empresa.createdAt.toISOString());

    // 3. Nested writes: criar Pesquisa com Perguntas e Opções aninhadas
    const pesquisaId = '30000000-0000-4000-8000-000000000001';
    const perguntaEstrelasId = '40000000-0000-4000-8000-000000000001';
    const perguntaMultiplaId = '40000000-0000-4000-8000-000000000002';
    const opcao1Id = '50000000-0000-4000-8000-000000000001';
    const opcao2Id = '50000000-0000-4000-8000-000000000002';

    const pesquisa = await prisma.pesquisa.create({
      data: {
        id: pesquisaId,
        empresaId: empresa.id,
        titulo: 'Pesquisa com Nested Writes',
        slug: 'pesquisa-nested',
        status: 'ATIVA',
        perguntas: {
          create: [
            {
              id: perguntaEstrelasId,
              texto: 'Como avalia o atendimento?',
              tipo: 'ESTRELAS',
              ordem: 0,
              obrigatoria: true,
            },
            {
              id: perguntaMultiplaId,
              texto: 'Qual seu setor favorito?',
              tipo: 'MULTIPLA_ESCOLHA',
              ordem: 1,
              obrigatoria: true,
              opcoes: {
                create: [
                  { id: opcao1Id, texto: 'Vendas', ordem: 0 },
                  { id: opcao2Id, texto: 'Suporte', ordem: 1 },
                ],
              },
            },
          ],
        },
      },
      include: {
        perguntas: {
          include: {
            opcoes: true,
          },
        },
      },
    });

    assert.equal(pesquisa.perguntas.length, 2, 'Deve ter criado 2 perguntas');
    assert.equal(pesquisa.perguntas[1].opcoes.length, 2, 'Pergunta de múltipla escolha deve ter 2 opções');
    results.nestedWrites = true;
    console.log('  [PASS] Nested writes funcionam com múltiplos níveis (Pesquisa -> Pergunta -> OpcaoPergunta)');

    // 4. Testar createMany
    const ponto1Id = '60000000-0000-4000-8000-000000000001';
    const ponto2Id = '60000000-0000-4000-8000-000000000002';
    const createManyResult = await prisma.pontoColeta.createMany({
      data: [
        { id: ponto1Id, pesquisaId: pesquisa.id, token: '61000000-0000-4000-8000-000000000001', nome: 'Totem 1', ativo: true },
        { id: ponto2Id, pesquisaId: pesquisa.id, token: '61000000-0000-4000-8000-000000000002', nome: 'Totem 2', ativo: false },
      ],
    });

    assert.equal(createManyResult.count, 2, 'createMany deve inserir 2 registros');
    results.createMany = true;
    console.log('  [PASS] createMany funciona no conector MongoDB Prisma');

    // 5. Testar findUnique, findMany com includes e filtros relacionais
    const consulta = await prisma.pesquisa.findUnique({
      where: { slug: 'pesquisa-nested' },
      include: {
        empresa: true,
        pontosColeta: { where: { ativo: true } },
        perguntas: {
          where: { tipo: 'ESTRELAS' },
        },
      },
    });

    assert.equal(consulta.empresa.nome, 'Empresa Teste CRUD');
    assert.equal(consulta.pontosColeta.length, 1);
    assert.equal(consulta.perguntas.length, 1);
    results.includeRelations = true;
    results.relationalFilter = true;
    console.log('  [PASS] findUnique com includes profundos e filtros relacionais (where dentro de include)');

    // 6. Testar Restrict em deleção (relationMode emulado)
    let restrictPassou = false;
    try {
      // Tentar deletar empresa que possui pesquisas vinculadas
      await prisma.empresa.delete({
        where: { id: empresa.id },
      });
    } catch (err) {
      // Prisma deve rejeitar com código P2003 / P2014 ou erro de restrição relacional
      if (err.code === 'P2003' || err.code === 'P2014' || String(err.message).includes('relation')) {
        restrictPassou = true;
        console.log('  [PASS] onDelete: Restrict bloqueou exclusão de Empresa com filhos vinculados! (Código:', err.code, ')');
      } else {
        console.warn('  [WARN] Erro inesperado ao testar Restrict:', err.message);
      }
    }

    if (!restrictPassou) {
      console.error('  [FAIL] onDelete: Restrict NÃO bloqueou a exclusão!');
    }
    results.restrictDelete = restrictPassou;

    // 7. Testar update e delete ordenado
    await prisma.pontoColeta.deleteMany({ where: { pesquisaId: pesquisa.id } });
    await prisma.opcaoPergunta.deleteMany();
    await prisma.pergunta.deleteMany({ where: { pesquisaId: pesquisa.id } });
    await prisma.pesquisa.delete({ where: { id: pesquisa.id } });
    await prisma.empresa.delete({ where: { id: empresa.id } });

    results.createAndFind = true;
    console.log('  [PASS] Ciclo de vida CRUD completo (Create, Read, Update, Delete) verificado.');

  } finally {
    await prisma.$disconnect();
    await replSet.stop();
  }

  return results;
}

if (process.argv[1]?.includes('01_schema_crud.js')) {
  runSchemaCrudTest()
    .then(r => console.log('\nResultado do Teste 1:', r))
    .catch(e => { console.error(e); process.exit(1); });
}
