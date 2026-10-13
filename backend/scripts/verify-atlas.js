import { MongoClient } from 'mongodb';
import { sanitizeMongoUri, validateTargetSafety, inspectDatabase, compareWithManifest } from './sync-mongodb.js';
import { SCHEMA_VERSION } from '../src/config/mongo/schemaManifest.js';

export async function verifyAtlasConnection({ uri, allowRemote = true }) {
  const sanitizedUri = sanitizeMongoUri(uri);
  const { dbName } = validateTargetSafety(uri, { allowRemote });

  const isSrv = uri.startsWith('mongodb+srv://');
  const isTls = isSrv || uri.includes('tls=true') || uri.includes('ssl=true');

  console.log(`\n=== Verificação de Conexão com MongoDB Atlas / Cluster Remoto ===`);
  console.log(`URI Sanitizada: ${sanitizedUri}`);
  console.log(`Banco Alvo: ${dbName}`);
  console.log(`Protocolo SRV: ${isSrv ? 'Sim' : 'Não'}`);
  console.log(`TLS Ativo: ${isTls ? 'Sim' : 'Não'}`);

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  const report = {
    target: sanitizedUri,
    database: dbName,
    isSrv,
    isTls,
    connected: false,
    replicaSet: null,
    topology: null,
    schemaCompliance: null,
  };

  try {
    await client.connect();
    report.connected = true;

    const db = client.db(dbName);
    const hello = await db.command({ hello: 1 });

    report.replicaSet = hello.setName || null;
    report.isWritablePrimary = !!hello.isWritablePrimary;
    report.topology = hello.msg === 'isdbgrid' ? 'sharded' : (hello.setName ? 'replicaSet' : 'standalone');

    console.log(`Conexão estabelecida com sucesso!`);
    console.log(`Topologia: ${report.topology}`);
    console.log(`Replica Set: ${report.replicaSet || 'Nenhum (standalone)'}`);
    console.log(`Primary Gravável: ${report.isWritablePrimary ? 'Sim' : 'Não'}`);

    if (!report.replicaSet) {
      console.warn(`AVISO: O cluster não é um Replica Set. Transações Prisma exigem Replica Set.`);
    }

    // Verificar conformidade de índices e validators
    const currentState = await inspectDatabase(db);
    const diff = compareWithManifest(currentState);

    const isCompliant =
      diff.collectionsMissing.length === 0 &&
      diff.validatorsMissing.length === 0 &&
      diff.validatorsDivergent.length === 0 &&
      diff.indexesMissing.length === 0 &&
      diff.indexesDivergent.length === 0;

    report.schemaCompliance = {
      isCompliant,
      collectionsMissing: diff.collectionsMissing,
      indexesMissing: diff.indexesMissing.map(i => `${i.collection}.${i.index.name}`),
      indexesDivergent: diff.indexesDivergent.map(i => `${i.collection}.${i.index.name}`),
      validatorsDivergent: diff.validatorsDivergent.map(v => v.collection),
    };

    console.log(`Conformidade com Schema Manifest v${SCHEMA_VERSION}: ${isCompliant ? '100% OK' : 'PENDENTE DE SINCRONIZAÇÃO'}`);
    if (!isCompliant) {
      console.log('Execute `npm run mongo:sync -- --apply --allow-remote` para aplicar as definições ausentes.');
    }

    return report;
  } catch (err) {
    report.error = err.message;
    console.error(`FALHA NA CONEXÃO COM O CLUSTER: ${err.message}`);
    return report;
  } finally {
    await client.close();
  }
}

// Execução CLI direta
if (process.argv[1]?.includes('verify-atlas.js')) {
  const uri = process.env.MONGODB_ATLAS_URI || process.env.DATABASE_URL;

  if (!uri) {
    console.error('ERRO: Defina a variável de ambiente MONGODB_ATLAS_URI ou DATABASE_URL.');
    console.error('Exemplo:');
    console.error('  $env:MONGODB_ATLAS_URI="mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/feedqr?retryWrites=true&w=majority"');
    console.error('  node scripts/verify-atlas.js');
    process.exit(1);
  }

  verifyAtlasConnection({ uri, allowRemote: true })
    .then(res => {
      process.exit(res.connected && res.schemaCompliance?.isCompliant ? 0 : (res.connected ? 2 : 1));
    })
    .catch(() => process.exit(1));
}
