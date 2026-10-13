import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { execSync } from 'node:child_process';
import { MongoClient } from 'mongodb';
import assert from 'node:assert/strict';

export async function runIntegrityAndValidatorsTest() {
  console.log('\n======================================================');
  console.log('TESTE 5: Integridade, Órfãos e JSON Schema Validators');
  console.log('======================================================');

  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  const url = new URL(replSet.getUri());
  url.pathname = '/feedqr_proto_integ';
  const uri = url.toString();

  // Executar db push
  execSync('npx prisma db push --schema=prototype/schema.prisma --accept-data-loss', {
    env: { ...process.env, PROTOTYPE_DATABASE_URL: uri },
    stdio: 'pipe',
  });

  const { PrismaClient } = await import('../generated-client/index.js');
  const prisma = new PrismaClient({ datasourceUrl: uri });
  const mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  const db = mongoClient.db('feedqr_proto_integ');

  const results = {
    prismaClientBlocksInvalidEnum: false,
    rawScalarCanCreateOrphanWithoutFK: false,
    crossSurveyReferenceRequiresAppValidation: false,
    mongoJsonSchemaValidatorEnforced: false,
    invalidStarScoreRejectedByValidator: false,
  };

  try {
    const empresaId = '10000000-0000-4000-8000-000000000001';
    const pesquisa1Id = '30000000-0000-4000-8000-000000000001';
    const pesquisa2Id = '30000000-0000-4000-8000-000000000002';
    const perguntaP1Id = '40000000-0000-4000-8000-000000000001';

    await prisma.empresa.create({
      data: { id: empresaId, nome: 'Empresa Integridade', email: 'integ@test.local' },
    });
    await prisma.pesquisa.createMany({
      data: [
        { id: pesquisa1Id, empresaId, titulo: 'Pesquisa 1', slug: 'pesquisa-1', status: 'ATIVA' },
        { id: pesquisa2Id, empresaId, titulo: 'Pesquisa 2', slug: 'pesquisa-2', status: 'ATIVA' },
      ],
    });
    await prisma.pergunta.create({
      data: { id: perguntaP1Id, pesquisaId: pesquisa1Id, texto: 'Avaliação?', tipo: 'ESTRELAS', ordem: 0 },
    });

    // 1. Prisma Client bloqueia enum inválido em tempo de execução
    console.log('  [1] Testando validação de Enum pelo Prisma Client...');
    let enumBloqueado = false;
    try {
      // @ts-ignore
      await prisma.pergunta.create({
        data: {
          pesquisaId: pesquisa1Id,
          texto: 'Tipo invalido',
          tipo: 'TIPO_INEXISTENTE',
          ordem: 1,
        },
      });
    } catch (err) {
      if (String(err).includes('Invalid value for argument `tipo`') || String(err).includes('Expected TipoPergunta')) {
        enumBloqueado = true;
        console.log('    [PASS] Prisma Client bloqueou enum inválido antes do envio ao banco.');
      }
    }
    assert.ok(enumBloqueado, 'Prisma Client deve bloquear enum inválido');
    results.prismaClientBlocksInvalidEnum = true;

    // 2. Limitação do MongoDB: Inserção de scalar com FK inexistente (órfão)
    console.log('  [2] Testando comportamento de chave estrangeira inexistente em insert escalar...');
    const respostaId = '70000000-0000-4000-8000-000000000001';
    await prisma.resposta.create({
      data: {
        id: respostaId,
        pesquisaId: pesquisa1Id,
      },
    });

    // Inserir RespostaPergunta apontando para uma pergunta que NÃO pertence a pesquisa2Id
    // mas informando pesquisaId: pesquisa2Id e perguntaId: perguntaP1Id
    // No SQLite, a FK composta (perguntaId, pesquisaId, tipo) bloqueava isso imediatamente.
    // No MongoDB, sem validação do service, o driver aceitaria.
    let orphanInserted = false;
    try {
      await prisma.respostaPergunta.create({
        data: {
          id: '90000000-0000-4000-8000-000000000001',
          respostaId,
          pesquisaId: pesquisa2Id, // DIVERGENTE! Resposta pertence a pesquisa 1, mas aqui colocamos 2
          perguntaId: perguntaP1Id,
          tipo: 'ESTRELAS',
          valorEstrelas: 5,
        },
      });
      orphanInserted = true;
      console.log('    [OBSERVAÇÃO CONFIRMADA] MongoDB aceitou insert escalar com IDs cruzados sem rejeição nativa.');
    } catch (err) {
      console.log('    Prisma rejeitou:', err.message);
    }
    results.rawScalarCanCreateOrphanWithoutFK = orphanInserted;
    results.crossSurveyReferenceRequiresAppValidation = true;
    console.log('    -> CONCLUSÃO: A integridade referencial entre documentos exige verificação nos Services e transações!');

    // 3. Aplicar JSON Schema Validator na coleção RespostaPergunta
    console.log('  [3] Aplicando JSON Schema Validator nativo do MongoDB em RespostaPergunta...');
    await db.command({
      collMod: 'RespostaPergunta',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['respostaId', 'pesquisaId', 'perguntaId', 'tipo'],
          properties: {
            tipo: {
              enum: ['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'],
            },
            valorEstrelas: {
              bsonType: ['int', 'null'],
              minimum: 1,
              maximum: 5,
            },
            valorNps: {
              bsonType: ['int', 'null'],
              minimum: 0,
              maximum: 10,
            },
            valorSimNao: {
              bsonType: ['bool', 'null'],
            },
            valorTexto: {
              bsonType: ['string', 'null'],
            },
            opcaoPerguntaId: {
              bsonType: ['string', 'null'],
            },
          },
        },
      },
      validationLevel: 'strict',
      validationAction: 'error',
    });
    results.mongoJsonSchemaValidatorEnforced = true;
    console.log('    [PASS] Validator $jsonSchema aplicado com sucesso na coleção RespostaPergunta.');

    // 4. Testar rejeição de valor fora do intervalo permitido (valorEstrelas = 99)
    console.log('  [4] Testando inserção de valor inválido (valorEstrelas: 99) com validator ativo...');
    let validatorRejeitou = false;
    try {
      await prisma.respostaPergunta.create({
        data: {
          id: '90000000-0000-4000-8000-000000000002',
          respostaId,
          pesquisaId: pesquisa1Id,
          perguntaId: perguntaP1Id,
          tipo: 'ESTRELAS',
          valorEstrelas: 99, // Inválido! Estrelas só aceita 1 a 5
        },
      });
    } catch (err) {
      if (String(err).includes('Document failed validation') || String(err).includes('121')) {
        validatorRejeitou = true;
        console.log('    [PASS] MongoDB BLOQUEOU valorEstrelas: 99 com "Document failed validation" (Erro 121)!');
      } else {
        console.warn('    Outro erro recebido:', err.message);
      }
    }

    assert.ok(validatorRejeitou, 'Validator do MongoDB deve rejeitar nota de estrelas fora de 1..5');
    results.invalidStarScoreRejectedByValidator = true;

  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
    await replSet.stop();
  }

  return results;
}

if (process.argv[1]?.includes('05_integrity_and_validators.js')) {
  runIntegrityAndValidatorsTest()
    .then(r => console.log('\nResultado do Teste 5:', r))
    .catch(e => { console.error(e); process.exit(1); });
}
