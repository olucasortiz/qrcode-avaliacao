import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

export const BASELINE_COMMIT = '2bc755c05d28ff79a7f68222662bfd119f6ac9d8';
export const EXPECTED_DEV_DB_SHA256 = '15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4';
export const EXPECTED_DEV_DB_SIZE = 176128;

const SOURCE_PATH = resolve('prisma/dev.db');
const BACKUPS_DIR = resolve('backups');
const SNAPSHOT_PATH = join(BACKUPS_DIR, 'dev_baseline_20261013.db');
const METADATA_PATH = join(BACKUPS_DIR, 'technical_metadata.json');

export function hashFile(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

export function createSnapshot() {
  if (!existsSync(SOURCE_PATH)) {
    throw new Error(`Arquivo de origem não encontrado: ${SOURCE_PATH}`);
  }

  // 1. Validar hash e tamanho antes de qualquer operação
  const sourceStats = statSync(SOURCE_PATH);
  const sourceHashBefore = hashFile(SOURCE_PATH);

  assert.equal(sourceStats.size, EXPECTED_DEV_DB_SIZE, `Tamanho inesperado do banco de origem: ${sourceStats.size}`);
  assert.equal(sourceHashBefore, EXPECTED_DEV_DB_SHA256, `Hash SHA-256 inesperado do banco de origem: ${sourceHashBefore}`);

  if (!existsSync(BACKUPS_DIR)) {
    mkdirSync(BACKUPS_DIR, { recursive: true });
  }

  // 2. Abrir exclusivamente em modo somente leitura (readOnly: true)
  const sourceDb = new DatabaseSync(SOURCE_PATH, { readOnly: true });

  let serializedBuffer;
  try {
    // Utilizar a SQLite Serialization API (sqlite3_serialize), método seguro e consistente
    serializedBuffer = sourceDb.serialize();
  } finally {
    sourceDb.close();
  }

  // 3. Gravar snapshot em arquivo privado
  writeFileSync(SNAPSHOT_PATH, serializedBuffer);

  const snapshotStats = statSync(SNAPSHOT_PATH);
  const snapshotHash = hashFile(SNAPSHOT_PATH);

  assert.equal(snapshotStats.size, sourceStats.size, 'Tamanho do snapshot diverge da origem');
  assert.equal(snapshotHash, sourceHashBefore, 'Hash SHA-256 do snapshot diverge da origem');

  // 4. Verificar se a origem permaneceu intacta
  const sourceHashAfter = hashFile(SOURCE_PATH);
  assert.equal(sourceHashAfter, sourceHashBefore, 'Banco original foi modificado durante o snapshot!');

  return {
    sourceHash: sourceHashBefore,
    snapshotHash,
    snapshotPath: SNAPSHOT_PATH,
    size: snapshotStats.size,
  };
}

export function validateDatabase(dbPath) {
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    // A. PRAGMA integrity_check
    const integrityResult = db.prepare('PRAGMA integrity_check').all();
    assert.equal(integrityResult.length, 1, 'PRAGMA integrity_check não retornou exatamente 1 linha');
    assert.equal(integrityResult[0].integrity_check, 'ok', 'PRAGMA integrity_check falhou');

    // B. PRAGMA foreign_key_check
    const fkResult = db.prepare('PRAGMA foreign_key_check').all();
    assert.deepEqual(fkResult, [], 'PRAGMA foreign_key_check encontrou violações');

    // C. Contagem de registros por tabela
    const expectedCounts = {
      Empresa: 1,
      Usuario: 1,
      Pesquisa: 1,
      Pergunta: 5,
      OpcaoPergunta: 0,
      PontoColeta: 0,
      Resposta: 0,
      RespostaPergunta: 0,
      _prisma_migrations: 4,
      sqlite_sequence: 0,
    };

    const actualCounts = {};
    for (const tableName of Object.keys(expectedCounts)) {
      const row = db.prepare(`SELECT COUNT(*) as count FROM "${tableName}"`).get();
      actualCounts[tableName] = Number(row.count);
      assert.equal(
        actualCounts[tableName],
        expectedCounts[tableName],
        `Contagem divergente na tabela ${tableName}: esperado ${expectedCounts[tableName]}, obtido ${actualCounts[tableName]}`
      );
    }

    // D. Histórico das quatro migrations
    const migrations = db.prepare(
      'SELECT id, checksum, finished_at, migration_name, applied_steps_count FROM _prisma_migrations ORDER BY finished_at ASC'
    ).all();

    const expectedMigrations = [
      { name: '20261007220806_init', checksum: '05bd4339295a2f18adee8af54e0996b05f5f0e9b900aaa752b0ed0bd0e9757e2' },
      { name: '20261007221304_expandir_modelos', checksum: '7091f6bc53bb099544778c1cf862a6a68ae6f55c875f9d1627585f59f1248183' },
      { name: '20261007221725_ponto_token', checksum: 'b8828aee29db70eefd8743b6eedb90206eacbec50da5eb007ed386458fc05ae4' },
      { name: '20261008120000_resposta_idempotencia', checksum: '7185d515502b20c36077ff55a05e369175c7e221126101bbc24586b36ed47d9b' },
    ];

    assert.equal(migrations.length, 4, 'Quantidade de migrations no histórico diverge de 4');
    for (let i = 0; i < 4; i++) {
      assert.equal(migrations[i].migration_name, expectedMigrations[i].name, `Nome da migration ${i} diverge`);
      assert.equal(migrations[i].checksum, expectedMigrations[i].checksum, `Checksum da migration ${i} diverge`);
      assert.equal(migrations[i].applied_steps_count, 1, `Passos aplicados da migration ${i} diverge de 1`);
      assert.ok(migrations[i].finished_at > 0, `Data de conclusão da migration ${i} inválida`);
    }

    // E. Metadados do SQLite (tabelas, índices)
    const tables = db.prepare("SELECT name, type FROM sqlite_master WHERE type='table' ORDER BY name").all();
    const indexes = db.prepare("SELECT name, tbl_name FROM sqlite_master WHERE type='index' ORDER BY name").all();
    const views = db.prepare("SELECT name FROM sqlite_master WHERE type='view'").all();
    const triggers = db.prepare("SELECT name FROM sqlite_master WHERE type='trigger'").all();

    assert.equal(views.length, 0, 'Não deve haver views no SQLite');
    assert.equal(triggers.length, 0, 'Não deve haver triggers no SQLite');

    return {
      integrityCheck: 'ok',
      foreignKeyCheck: 'ok (0 violations)',
      tableCounts: actualCounts,
      migrationsCount: migrations.length,
      tablesCount: tables.length,
      indexesCount: indexes.length,
      migrationsList: migrations.map(m => ({
        id: m.id,
        name: m.migration_name,
        checksum: m.checksum,
        finishedAt: m.finished_at,
        appliedStepsCount: m.applied_steps_count,
      })),
      schemaObjects: {
        tables: tables.map(t => t.name),
        indexesCount: indexes.length,
      },
    };
  } finally {
    db.close();
  }
}

export function compareOriginalAndSnapshot() {
  const origDb = new DatabaseSync(SOURCE_PATH, { readOnly: true });
  const snapDb = new DatabaseSync(SNAPSHOT_PATH, { readOnly: true });

  try {
    const businessTables = [
      'Empresa',
      'Usuario',
      'Pesquisa',
      'Pergunta',
      'OpcaoPergunta',
      'PontoColeta',
      'Resposta',
      'RespostaPergunta',
    ];

    const comparisonReport = {};

    for (const table of businessTables) {
      const origRows = origDb.prepare(`SELECT * FROM "${table}" ORDER BY id ASC`).all();
      const snapRows = snapDb.prepare(`SELECT * FROM "${table}" ORDER BY id ASC`).all();

      assert.equal(origRows.length, snapRows.length, `Quantidade de linhas diverge em ${table}`);

      for (let i = 0; i < origRows.length; i++) {
        const origRow = origRows[i];
        const snapRow = snapRows[i];

        const origKeys = Object.keys(origRow).sort();
        const snapKeys = Object.keys(snapRow).sort();

        assert.deepEqual(origKeys, snapKeys, `Colunas divergem em ${table} linha ${i}`);

        for (const col of origKeys) {
          assert.equal(
            origRow[col],
            snapRow[col],
            `Valor da coluna ${col} na tabela ${table} diverge entre origem e snapshot`
          );
        }
      }

      comparisonReport[table] = {
        rowCount: origRows.length,
        status: 'identical',
      };
    }

    return comparisonReport;
  } finally {
    origDb.close();
    snapDb.close();
  }
}

export function exportTechnicalMetadata(validationData) {
  const metadata = {
    baselineCommit: BASELINE_COMMIT,
    exportedAt: new Date().toISOString(),
    sourceFile: 'prisma/dev.db',
    sourceSha256: EXPECTED_DEV_DB_SHA256,
    sourceSizeBytes: EXPECTED_DEV_DB_SIZE,
    snapshotFile: 'backups/dev_baseline_20261013.db',
    snapshotSha256: hashFile(SNAPSHOT_PATH),
    snapshotSizeBytes: statSync(SNAPSHOT_PATH).size,
    validation: {
      integrityCheck: validationData.integrityCheck,
      foreignKeyCheck: validationData.foreignKeyCheck,
      tableCounts: validationData.tableCounts,
      migrations: validationData.migrationsList,
      schemaObjects: validationData.schemaObjects,
    },
  };

  writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2), 'utf8');
  return METADATA_PATH;
}

// Execução direta
if (process.argv[1] && resolve(process.argv[1]) === resolve('scripts/preserve-sqlite-baseline.js')) {
  console.log('--- FeedQR TASK 07.1: Preservação do SQLite e Baseline ---');
  console.log(`Commit de referência: ${BASELINE_COMMIT}`);

  const snapshotResult = createSnapshot();
  console.log('Snapshot criado com sucesso em:', snapshotResult.snapshotPath);
  console.log('SHA-256 do snapshot verificado:', snapshotResult.snapshotHash);

  const validationResult = validateDatabase(SNAPSHOT_PATH);
  console.log('Validação do snapshot concluída:');
  console.log(' - PRAGMA integrity_check:', validationResult.integrityCheck);
  console.log(' - PRAGMA foreign_key_check:', validationResult.foreignKeyCheck);
  console.log(' - Contagens por tabela:', JSON.stringify(validationResult.tableCounts));
  console.log(' - Migrations verificadas:', validationResult.migrationsCount);

  const comparison = compareOriginalAndSnapshot();
  console.log('Comparação entre origem e snapshot:', JSON.stringify(comparison));

  const metaPath = exportTechnicalMetadata(validationResult);
  console.log('Metadados técnicos exportados em:', metaPath);

  // Verificação final do banco original
  const finalSourceHash = hashFile(SOURCE_PATH);
  assert.equal(finalSourceHash, EXPECTED_DEV_DB_SHA256, 'Banco original foi alterado!');
  console.log('Banco de origem permanece 100% intacto:', finalSourceHash);
  console.log('Operação concluída com sucesso.');
}
