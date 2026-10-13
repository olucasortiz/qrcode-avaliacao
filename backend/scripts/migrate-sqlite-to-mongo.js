import { DatabaseSync } from 'node:sqlite';
import { MongoClient } from 'mongodb';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { validateTargetSafety, sanitizeMongoUri } from './sync-mongodb.js';

export const MODELS_ORDER = [
  'Empresa',
  'Usuario',
  'Pesquisa',
  'Pergunta',
  'OpcaoPergunta',
  'PontoColeta',
  'Resposta',
  'RespostaPergunta',
];

export function toBsonDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'number') return new Date(val);
  if (typeof val === 'string') {
    const num = Number(val);
    if (!isNaN(num) && num > 100000000000) return new Date(num);
    return new Date(val);
  }
  return new Date(val);
}

export function toBsonBool(val) {
  if (val === null || val === undefined) return null;
  return val === 1 || val === true || val === '1';
}

export function convertRowToBson(modelName, row) {
  const doc = { _id: row.id };

  switch (modelName) {
    case 'Empresa':
      doc.nome = row.nome;
      doc.email = row.email;
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    case 'Usuario':
      doc.empresaId = row.empresaId;
      doc.nome = row.nome;
      doc.email = row.email;
      doc.senhaHash = row.senhaHash;
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    case 'Pesquisa':
      doc.empresaId = row.empresaId;
      doc.titulo = row.titulo;
      doc.descricao = row.descricao ?? null;
      doc.status = row.status;
      doc.slug = row.slug;
      doc.writeVersion = row.writeVersion ? Number(row.writeVersion) : 1;
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    case 'Pergunta':
      doc.pesquisaId = row.pesquisaId;
      doc.texto = row.texto;
      doc.tipo = row.tipo;
      doc.obrigatoria = toBsonBool(row.obrigatoria);
      doc.ordem = Number(row.ordem);
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    case 'OpcaoPergunta':
      doc.perguntaId = row.perguntaId;
      doc.texto = row.texto;
      doc.ordem = Number(row.ordem);
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    case 'PontoColeta':
      doc.token = row.token;
      doc.pesquisaId = row.pesquisaId;
      doc.nome = row.nome;
      doc.ativo = toBsonBool(row.ativo);
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    case 'Resposta':
      doc.pesquisaId = row.pesquisaId;
      doc.pontoColetaId = row.pontoColetaId ?? null;
      doc.idempotencyKey = row.idempotencyKey ?? null;
      doc.submissionHash = row.submissionHash ?? null;
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    case 'RespostaPergunta':
      doc.respostaId = row.respostaId;
      doc.pesquisaId = row.pesquisaId;
      doc.perguntaId = row.perguntaId;
      doc.tipo = row.tipo;
      doc.valorEstrelas = row.valorEstrelas !== null && row.valorEstrelas !== undefined ? Number(row.valorEstrelas) : null;
      doc.valorNps = row.valorNps !== null && row.valorNps !== undefined ? Number(row.valorNps) : null;
      doc.valorSimNao = row.valorSimNao !== null && row.valorSimNao !== undefined ? toBsonBool(row.valorSimNao) : null;
      doc.valorTexto = row.valorTexto ?? null;
      doc.opcaoPerguntaId = row.opcaoPerguntaId ?? null;
      doc.createdAt = toBsonDate(row.createdAt);
      doc.updatedAt = toBsonDate(row.updatedAt);
      break;

    default:
      throw new Error(`Modelo desconhecido para conversão: ${modelName}`);
  }

  return doc;
}

export async function runMigration({
  sqlitePath,
  mongoUri,
  mode = 'dry-run',
  allowRemote = false,
  manifestOutputPath = null,
}) {
  const sanitizedUri = sanitizeMongoUri(mongoUri);
  const targetSafety = validateTargetSafety(mongoUri, { allowRemote });

  if (!existsSync(sqlitePath)) {
    throw new Error(`Arquivo SQLite de origem não encontrado: ${sqlitePath}`);
  }

  const sqliteHash = createHash('sha256').update(readFileSync(sqlitePath)).digest('hex');
  const sqlite = new DatabaseSync(sqlitePath, { readOnly: true });

  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db(targetSafety.dbName);

  const report = {
    mode,
    startedAt: new Date().toISOString(),
    source: {
      path: sqlitePath,
      sha256: sqliteHash,
    },
    target: {
      uri: sanitizedUri,
      db: targetSafety.dbName,
    },
    counts: {},
    errors: [],
  };

  try {
    // 1. Preflight
    const integrity = sqlite.prepare('PRAGMA integrity_check').all();
    if (integrity[0]?.integrity_check !== 'ok') {
      throw new Error(`Integridade do SQLite comprometida: ${JSON.stringify(integrity)}`);
    }

    const fkCheck = sqlite.prepare('PRAGMA foreign_key_check').all();
    if (fkCheck.length > 0) {
      throw new Error(`Violações de foreign keys detectadas no SQLite: ${JSON.stringify(fkCheck)}`);
    }

    for (const model of MODELS_ORDER) {
      const sqliteCount = Number(sqlite.prepare(`SELECT COUNT(*) as count FROM "${model}"`).get().count);
      const mongoCount = await db.collection(model).countDocuments();
      report.counts[model] = { sqlite: sqliteCount, mongoInitial: mongoCount, migrated: 0 };
    }

    if (mode === 'preflight') {
      report.status = 'Preflight aprovado com sucesso.';
      return report;
    }

    if (mode === 'dry-run') {
      // Simulação sem escrita
      for (const model of MODELS_ORDER) {
        const rows = sqlite.prepare(`SELECT * FROM "${model}"`).all();
        let validDocs = 0;
        for (const row of rows) {
          const doc = convertRowToBson(model, row);
          if (doc._id) validDocs++;
        }
        report.counts[model].simulated = validDocs;
      }
      report.status = 'Dry-run concluído sem alterações no banco.';
      return report;
    }

    if (mode === 'import' || mode === 'resume') {
      for (const model of MODELS_ORDER) {
        const rows = sqlite.prepare(`SELECT * FROM "${model}"`).all();
        if (rows.length === 0) continue;

        const collection = db.collection(model);
        const docs = rows.map(r => convertRowToBson(model, r));

        if (mode === 'import') {
          // No modo import, verifica se a coleção está vazia para evitar duplicidades
          const existingCount = await collection.countDocuments();
          if (existingCount > 0) {
            throw new Error(
              `Coleção "${model}" já contém ${existingCount} documentos. ` +
              `Utilize o modo "resume" para importação incremental.`
            );
          }
          if (docs.length > 0) {
            await collection.insertMany(docs, { ordered: true });
            report.counts[model].migrated = docs.length;
          }
        } else if (mode === 'resume') {
          // No modo resume, insere apenas documentos que não existem
          let inserted = 0;
          for (const doc of docs) {
            const exists = await collection.findOne({ _id: doc._id }, { projection: { _id: 1 } });
            if (!exists) {
              await collection.insertOne(doc);
              inserted++;
            }
          }
          report.counts[model].migrated = inserted;
        }
      }
      report.status = `Migração finalizada em modo ${mode}.`;
    }

    if (mode === 'verify' || mode === 'import' || mode === 'resume') {
      // Verificação rigorosa registro a registro
      for (const model of MODELS_ORDER) {
        const rows = sqlite.prepare(`SELECT * FROM "${model}"`).all();
        const collection = db.collection(model);
        const finalMongoCount = await collection.countDocuments();

        if (rows.length !== finalMongoCount) {
          report.errors.push(
            `Divergência de contagem em ${model}: SQLite=${rows.length}, Mongo=${finalMongoCount}`
          );
        }

        for (const row of rows) {
          const mongoDoc = await collection.findOne({ _id: row.id });
          if (!mongoDoc) {
            report.errors.push(`Documento faltante no Mongo: ${model} ID=${row.id}`);
            continue;
          }

          const expectedDoc = convertRowToBson(model, row);
          for (const [key, expectedVal] of Object.entries(expectedDoc)) {
            const actualVal = mongoDoc[key];
            if (expectedVal instanceof Date) {
              const actualTime = actualVal instanceof Date ? actualVal.getTime() : new Date(actualVal).getTime();
              if (expectedVal.getTime() !== actualTime) {
                report.errors.push(
                  `Divergência de timestamp em ${model}.${key} ID=${row.id}: esperado ${expectedVal.toISOString()}, obtido ${actualVal}`
                );
              }
            } else if (expectedVal !== actualVal) {
              report.errors.push(
                `Divergência de valor em ${model}.${key} ID=${row.id}: esperado ${expectedVal}, obtido ${actualVal}`
              );
            }
          }
        }
      }

      if (report.errors.length > 0) {
        throw new Error(
          `Falha na verificação de paridade:\n${report.errors.slice(0, 10).join('\n')}` +
          (report.errors.length > 10 ? `\n... e mais ${report.errors.length - 10} erros.` : '')
        );
      }

      report.verification = 'Paridade de 100% comprovada entre SQLite e MongoDB.';
      report.status = report.status || report.verification;
    }

    report.finishedAt = new Date().toISOString();

    if (manifestOutputPath) {
      writeFileSync(manifestOutputPath, JSON.stringify(report, null, 2), 'utf8');
    }

    return report;
  } finally {
    sqlite.close();
    await mongoClient.close();
  }
}

// Execução CLI direta
if (process.argv[1]?.includes('migrate-sqlite-to-mongo.js')) {
  const args = process.argv.slice(2);
  const mode = args.find(a => ['--preflight', '--dry-run', '--import', '--resume', '--verify'].includes(a))?.replace('--', '') || 'dry-run';
  const allowRemote = args.includes('--allow-remote');
  const sqlitePath = process.env.SQLITE_SOURCE_PATH || resolve('prisma/dev.db');
  const mongoUri = process.env.MONGODB_TARGET_URI || process.env.DATABASE_URL;

  if (!mongoUri) {
    console.error('ERRO: MONGODB_TARGET_URI ou DATABASE_URL não definida.');
    process.exit(1);
  }

  console.log(`--- Migrador SQLite -> MongoDB (FeedQR) ---`);
  console.log(`Modo: ${mode.toUpperCase()}`);
  console.log(`Origem SQLite: ${sqlitePath}`);
  console.log(`Destino MongoDB: ${sanitizeMongoUri(mongoUri)}`);

  runMigration({ sqlitePath, mongoUri, mode, allowRemote })
    .then(res => {
      console.log('Sucesso:', res.status);
      console.log('Resumo contagens:', JSON.stringify(res.counts, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('ERRO NA MIGRACAO:', err.message);
      process.exit(1);
    });
}
