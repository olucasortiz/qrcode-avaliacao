import { DatabaseSync } from 'node:sqlite';
import { MongoClient } from 'mongodb';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { validateTargetSafety, sanitizeMongoUri } from './sync-mongodb.js';
import { MODELS_ORDER } from './migrate-sqlite-to-mongo.js';

export const SQLITE_MIGRATIONS = [
  'prisma/migrations/20261007220806_init/migration.sql',
  'prisma/migrations/20261007221304_expandir_modelos/migration.sql',
  'prisma/migrations/20261007221725_ponto_token/migration.sql',
  'prisma/migrations/20261008120000_resposta_idempotencia/migration.sql',
];

export function toSqliteTimestamp(val) {
  if (!val) return null;
  if (val instanceof Date) return val.getTime();
  if (typeof val === 'number') return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.getTime();
}

export function toSqliteBool(val) {
  if (val === null || val === undefined) return null;
  return val === true || val === 1 || val === '1' ? 1 : 0;
}

export function convertBsonToSqliteRow(modelName, doc) {
  const row = { id: doc._id };

  switch (modelName) {
    case 'Empresa':
      row.nome = doc.nome;
      row.email = doc.email;
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    case 'Usuario':
      row.empresaId = doc.empresaId;
      row.nome = doc.nome;
      row.email = doc.email;
      row.senhaHash = doc.senhaHash;
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    case 'Pesquisa':
      row.empresaId = doc.empresaId;
      row.titulo = doc.titulo;
      row.descricao = doc.descricao ?? null;
      row.status = doc.status;
      row.slug = doc.slug;
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    case 'Pergunta':
      row.pesquisaId = doc.pesquisaId;
      row.texto = doc.texto;
      row.tipo = doc.tipo;
      row.obrigatoria = toSqliteBool(doc.obrigatoria);
      row.ordem = Number(doc.ordem);
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    case 'OpcaoPergunta':
      row.perguntaId = doc.perguntaId;
      row.texto = doc.texto;
      row.ordem = Number(doc.ordem);
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    case 'PontoColeta':
      row.token = doc.token;
      row.pesquisaId = doc.pesquisaId;
      row.nome = doc.nome;
      row.ativo = toSqliteBool(doc.ativo);
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    case 'Resposta':
      row.pesquisaId = doc.pesquisaId;
      row.pontoColetaId = doc.pontoColetaId ?? null;
      row.idempotencyKey = doc.idempotencyKey ?? null;
      row.submissionHash = doc.submissionHash ?? null;
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    case 'RespostaPergunta':
      row.respostaId = doc.respostaId;
      row.pesquisaId = doc.pesquisaId;
      row.perguntaId = doc.perguntaId;
      row.tipo = doc.tipo;
      row.valorEstrelas = doc.valorEstrelas !== null && doc.valorEstrelas !== undefined ? Number(doc.valorEstrelas) : null;
      row.valorNps = doc.valorNps !== null && doc.valorNps !== undefined ? Number(doc.valorNps) : null;
      row.valorSimNao = doc.valorSimNao !== null && doc.valorSimNao !== undefined ? toSqliteBool(doc.valorSimNao) : null;
      row.valorTexto = doc.valorTexto ?? null;
      row.opcaoPerguntaId = doc.opcaoPerguntaId ?? null;
      row.createdAt = toSqliteTimestamp(doc.createdAt);
      row.updatedAt = toSqliteTimestamp(doc.updatedAt);
      break;

    default:
      throw new Error(`Modelo desconhecido para rollback: ${modelName}`);
  }

  return row;
}

export async function runRollback({
  mongoUri,
  outputSqlitePath,
  allowRemote = false,
  overwriteOutput = false,
}) {
  const sanitizedUri = sanitizeMongoUri(mongoUri);
  const targetSafety = validateTargetSafety(mongoUri, { allowRemote });

  const resolvedOutput = resolve(outputSqlitePath);
  const originalDevDb = resolve('prisma/dev.db');

  // SEGURANÇA MÁXIMA: Nunca sobrescrever prisma/dev.db
  if (resolvedOutput.toLowerCase() === originalDevDb.toLowerCase()) {
    throw new Error(
      'PROTEÇÃO ATIVA: O script de rollback NUNCA pode sobrescrever o banco original "prisma/dev.db". ' +
      'Especifique um novo caminho de arquivo para o rollback (ex.: "backups/rollback_novo.db").'
    );
  }

  if (existsSync(resolvedOutput)) {
    if (!overwriteOutput) {
      throw new Error(`Arquivo de destino já existe: ${resolvedOutput}. Ative overwriteOutput para recriá-lo.`);
    }
    rmSync(resolvedOutput, { force: true });
  }

  mkdirSync(dirname(resolvedOutput), { recursive: true });

  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db(targetSafety.dbName);

  // Criar novo arquivo SQLite
  const sqlite = new DatabaseSync(resolvedOutput);

  const report = {
    startedAt: new Date().toISOString(),
    source: {
      uri: sanitizedUri,
      db: targetSafety.dbName,
    },
    target: {
      path: resolvedOutput,
    },
    counts: {},
    errors: [],
  };

  try {
    // 1. Aplicar migrations DDL no novo SQLite
    for (const migRelPath of SQLITE_MIGRATIONS) {
      const fullPath = resolve(migRelPath);
      if (!existsSync(fullPath)) {
        throw new Error(`Arquivo de migration não encontrado: ${fullPath}`);
      }
      sqlite.exec(readFileSync(fullPath, 'utf8'));
    }

    // 2. Extrair dados do MongoDB e inserir no novo SQLite por ordem topológica
    for (const model of MODELS_ORDER) {
      const collection = db.collection(model);
      const docs = await collection.find({}).toArray();
      report.counts[model] = { mongo: docs.length, sqliteInserted: 0 };

      if (docs.length === 0) continue;

      sqlite.exec('BEGIN TRANSACTION;');
      try {
        for (const doc of docs) {
          const row = convertBsonToSqliteRow(model, doc);
          const columns = Object.keys(row);
          const placeholders = columns.map(() => '?').join(', ');
          const quotedColumns = columns.map(c => `"${c}"`).join(', ');

          const stmt = sqlite.prepare(
            `INSERT INTO "${model}" (${quotedColumns}) VALUES (${placeholders})`
          );
          stmt.run(...columns.map(c => row[c]));
        }
        sqlite.exec('COMMIT;');
        report.counts[model].sqliteInserted = docs.length;
      } catch (insertErr) {
        sqlite.exec('ROLLBACK;');
        throw new Error(`Erro ao inserir dados no modelo ${model} durante rollback: ${insertErr.message}`);
      }
    }

    // 3. Validação de integridade do novo banco SQLite
    const integrity = sqlite.prepare('PRAGMA integrity_check').all();
    if (integrity[0]?.integrity_check !== 'ok') {
      report.errors.push(`Integridade comprometida: ${JSON.stringify(integrity)}`);
    }

    const fkCheck = sqlite.prepare('PRAGMA foreign_key_check').all();
    if (fkCheck.length > 0) {
      report.errors.push(`Violações de chaves estrangeiras: ${JSON.stringify(fkCheck)}`);
    }

    if (report.errors.length > 0) {
      throw new Error(`Falha na validação do rollback SQLite:\n${report.errors.join('\n')}`);
    }

    report.status = 'Rollback concluído com sucesso. Novo banco SQLite íntegro e validado.';
    report.finishedAt = new Date().toISOString();
    return report;
  } finally {
    sqlite.close();
    await mongoClient.close();
  }
}

// Execução CLI direta
if (process.argv[1]?.includes('rollback-mongo-to-sqlite.js')) {
  const args = process.argv.slice(2);
  const allowRemote = args.includes('--allow-remote');
  const overwriteOutput = args.includes('--overwrite');
  const mongoUri = process.env.MONGODB_TARGET_URI || process.env.DATABASE_URL;
  const outputPath = process.env.SQLITE_ROLLBACK_PATH || resolve(`backups/rollback_${Date.now()}.db`);

  if (!mongoUri) {
    console.error('ERRO: MONGODB_TARGET_URI ou DATABASE_URL não definida.');
    process.exit(1);
  }

  console.log(`--- Rollback MongoDB -> Novo SQLite (FeedQR) ---`);
  console.log(`Origem MongoDB: ${sanitizeMongoUri(mongoUri)}`);
  console.log(`Destino SQLite: ${outputPath}`);

  runRollback({ mongoUri, outputSqlitePath: outputPath, allowRemote, overwriteOutput })
    .then(res => {
      console.log('Sucesso:', res.status);
      console.log('Contagens:', JSON.stringify(res.counts, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('ERRO NO ROLLBACK:', err.message);
      process.exit(1);
    });
}
