import { MongoClient } from 'mongodb';
import { MONGO_MANIFEST, SCHEMA_VERSION } from '../src/config/mongo/schemaManifest.js';

export function sanitizeMongoUri(uri) {
  try {
    const parsed = new URL(uri);
    if (parsed.password) parsed.password = '***';
    if (parsed.username) parsed.username = '***';
    return parsed.toString();
  } catch {
    return uri.replace(/:([^:@]+)@/, ':***@');
  }
}

export function validateTargetSafety(uri, options = {}) {
  let parsed;
  try {
    parsed = new URL(uri);
  } catch (err) {
    throw new Error(`URI do MongoDB inválida: ${err.message}`);
  }

  const dbName = parsed.pathname.replace(/^\//, '');
  if (!dbName) {
    throw new Error('A URI do MongoDB deve especificar um banco de dados explícito.');
  }

  const reservedDbs = ['admin', 'local', 'config'];
  if (reservedDbs.includes(dbName.toLowerCase())) {
    throw new Error(`Banco de dados reservado não permitido para sincronização: "${dbName}"`);
  }

  const isLocalhost =
    parsed.hostname === 'localhost' ||
    parsed.hostname === '127.0.0.1' ||
    parsed.hostname === '::1';

  // Se não for localhost e não houver flag explícita de autorização remota, bloquear
  if (!isLocalhost && !options.allowRemote && process.env.ALLOW_REMOTE_SYNC !== 'true') {
    throw new Error(
      `Conexão a host não local (${parsed.hostname}) bloqueada por segurança. ` +
      `Para autorizar explicitamente, utilize a flag --allow-remote ou defina ALLOW_REMOTE_SYNC=true.`
    );
  }

  return { dbName, isLocalhost };
}

function normalizeKey(keyObj) {
  // Compound index field order is significant in MongoDB.
  return JSON.stringify(keyObj);
}

function normalizeOptions(options = {}) {
  const norm = {};
  if (options.unique) norm.unique = true;
  if (options.partialFilterExpression) {
    norm.partialFilterExpression = options.partialFilterExpression;
  }
  return JSON.stringify(norm);
}

export async function inspectDatabase(db) {
  const collections = await db.listCollections({}, { nameOnly: false }).toArray();
  const current = {};

  for (const col of collections) {
    const indexes = await db.collection(col.name).indexes();
    current[col.name] = {
      options: col.options || {},
      validator: col.options?.validator || null,
      indexes,
    };
  }

  return current;
}

export function compareWithManifest(currentState, manifest = MONGO_MANIFEST) {
  const diff = {
    collectionsMissing: [],
    collectionsPresent: [],
    validatorsMissing: [],
    validatorsPresent: [],
    validatorsDivergent: [],
    indexesMissing: [],
    indexesPresent: [],
    indexesDivergent: [],
    unexpectedCollections: [],
  };

  const manifestCollNames = Object.keys(manifest.collections);

  // 1. Identificar coleções inesperadas
  for (const colName of Object.keys(currentState)) {
    if (!manifestCollNames.includes(colName) && !colName.startsWith('system.')) {
      diff.unexpectedCollections.push(colName);
    }
  }

  // 2. Analisar cada coleção declarada no manifest
  for (const [colName, colSpec] of Object.entries(manifest.collections)) {
    const existingCol = currentState[colName];

    if (!existingCol) {
      diff.collectionsMissing.push(colName);
      // Todos os índices e validator estão pendentes
      if (colSpec.validator) {
        diff.validatorsMissing.push({ collection: colName, validator: colSpec.validator });
      }
      for (const idx of colSpec.indexes) {
        diff.indexesMissing.push({ collection: colName, index: idx });
      }
      continue;
    }

    diff.collectionsPresent.push(colName);

    // Comparar validator
    if (colSpec.validator) {
      if (!existingCol.validator) {
        diff.validatorsMissing.push({ collection: colName, validator: colSpec.validator });
      } else {
        const expectedValStr = JSON.stringify(colSpec.validator);
        const actualValStr = JSON.stringify(existingCol.validator);
        if (expectedValStr === actualValStr &&
          (existingCol.options?.validationLevel || 'strict') === 'strict' &&
          (existingCol.options?.validationAction || 'error') === 'error') {
          diff.validatorsPresent.push(colName);
        } else {
          diff.validatorsDivergent.push({
            collection: colName,
            expected: colSpec.validator,
            actual: existingCol.validator,
          });
        }
      }
    }

    // Comparar índices
    const existingIndexes = existingCol.indexes;

    for (const expectedIdx of colSpec.indexes) {
      const expectedKeyStr = normalizeKey(expectedIdx.key);
      const expectedOptStr = normalizeOptions(expectedIdx);

      // Buscar por nome ou por chave
      const matchByName = existingIndexes.find(i => i.name === expectedIdx.name);
      const matchByKey = existingIndexes.find(i => normalizeKey(i.key) === expectedKeyStr);

      if (!matchByName && !matchByKey) {
        diff.indexesMissing.push({ collection: colName, index: expectedIdx });
      } else {
        const found = matchByName || matchByKey;
        const actualKeyStr = normalizeKey(found.key);
        const actualOptStr = normalizeOptions(found);

        if (actualKeyStr === expectedKeyStr && actualOptStr === expectedOptStr) {
          diff.indexesPresent.push({ collection: colName, name: expectedIdx.name });
        } else {
          diff.indexesDivergent.push({
            collection: colName,
            name: expectedIdx.name,
            expected: { key: expectedIdx.key, options: expectedOptStr },
            actual: { name: found.name, key: found.key, options: actualOptStr },
          });
        }
      }
    }
  }

  return diff;
}

export async function runSync({ uri, mode = 'dry-run', allowRemote = false, manifest = MONGO_MANIFEST }) {
  const safeUri = sanitizeMongoUri(uri);
  const { dbName } = validateTargetSafety(uri, { allowRemote });

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const currentState = await inspectDatabase(db);
    const diff = compareWithManifest(currentState, manifest);

    const report = {
      manifestVersion: manifest.version,
      database: dbName,
      targetUri: safeUri,
      mode,
      summary: {
        collectionsToCreate: diff.collectionsMissing.length,
        collectionsExisting: diff.collectionsPresent.length,
        validatorsToApply: diff.validatorsMissing.length,
        validatorsDivergent: diff.validatorsDivergent.length,
        indexesToCreate: diff.indexesMissing.length,
        indexesExisting: diff.indexesPresent.length,
        indexesDivergent: diff.indexesDivergent.length,
        unexpectedCollections: diff.unexpectedCollections.length,
      },
      diff,
    };

    // Verificação de divergências críticas
    if (diff.indexesDivergent.length > 0 || diff.validatorsDivergent.length > 0) {
      const divergentMsg =
        `DIVERGÊNCIA DETECTADA: O banco possui índices ou validators conflitantes com o manifest. ` +
        `Operação interrompida para evitar alterações destrutivas silenciosas.`;
      if (mode === 'apply' || mode === 'verify') {
        const err = new Error(divergentMsg);
        err.report = report;
        throw err;
      }
    }

    if (mode === 'verify') {
      const isMissing =
        diff.collectionsMissing.length > 0 ||
        diff.validatorsMissing.length > 0 ||
        diff.indexesMissing.length > 0;

      if (isMissing || diff.unexpectedCollections.length > 0) {
        const err = new Error(`VERIFY FALHOU: O banco não possui todos os recursos declarados no manifest.`);
        err.report = report;
        throw err;
      }
      return { ok: true, message: 'Banco 100% em conformidade com o manifest.', report };
    }

    if (mode === 'dry-run') {
      return { ok: true, message: 'Dry-run concluído sem alterações no banco.', report };
    }

    if (mode === 'apply') {
      if (diff.unexpectedCollections.length) throw new Error('Colecoes inesperadas: revise o banco alvo antes de aplicar o manifest.');
      // 1. Criar coleções ausentes
      for (const colName of diff.collectionsMissing) {
        const colSpec = manifest.collections[colName];
        const createOptions = {};
        if (colSpec.validator) {
          createOptions.validator = colSpec.validator;
          createOptions.validationLevel = 'strict';
          createOptions.validationAction = 'error';
        }
        await db.createCollection(colName, createOptions);
      }

      // 2. Aplicar validators em coleções que já existiam sem validator
      for (const { collection: colName, validator } of diff.validatorsMissing) {
        // Se a coleção já foi criada no passo anterior, ela já recebeu o validator
        if (!diff.collectionsMissing.includes(colName)) {
          await db.command({
            collMod: colName,
            validator,
            validationLevel: 'strict',
            validationAction: 'error',
          });
        }
      }

      // 3. Criar índices ausentes
      for (const { collection: colName, index } of diff.indexesMissing) {
        const { key, ...options } = index;
        await db.collection(colName).createIndex(key, options);
      }

      // Revalidar estado final
      const stateAfter = await inspectDatabase(db);
      const diffAfter = compareWithManifest(stateAfter, manifest);

      if (
        diffAfter.collectionsMissing.length > 0 ||
        diffAfter.validatorsMissing.length > 0 ||
        diffAfter.indexesMissing.length > 0
      ) {
        throw new Error('Falha pós-apply: ainda restam recursos ausentes após a sincronização.');
      }

      return {
        ok: true,
        message: 'Sincronização aplicada com sucesso. Todos os índices e validators ativos.',
        report,
      };
    }

    throw new Error(`Modo desconhecido: "${mode}". Modos aceitos: "dry-run", "apply", "verify".`);
  } finally {
    await client.close();
  }
}

// Execução direta via CLI
if (process.argv[1]?.includes('sync-mongodb.js')) {
  const args = process.argv.slice(2);
  const mode = args.find(a => ['--dry-run', '--apply', '--verify'].includes(a))?.replace('--', '') || 'dry-run';
  const allowRemote = args.includes('--allow-remote');
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!uri) {
    console.error('ERRO: MONGODB_URI ou DATABASE_URL não definida.');
    process.exit(1);
  }

  console.log(`--- Sincronizador de Índices e Validators MongoDB (FeedQR v${SCHEMA_VERSION}) ---`);
  console.log(`Modo: ${mode.toUpperCase()}`);

  runSync({ uri, mode, allowRemote })
    .then(res => {
      console.log(res.message);
      console.log('Resumo:', JSON.stringify(res.report.summary, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('\nERRO NO SINCRONIZADOR. Revise o alvo, as permissoes e o manifest; detalhes internos omitidos.');
      if (err.report) console.log('Resumo do erro:', JSON.stringify(err.report.summary, null, 2));
      process.exit(1);
    });
}
