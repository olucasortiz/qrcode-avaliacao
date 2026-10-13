import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { describe, test } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { runSync } from '../scripts/sync-mongodb.js';
import { runMigration } from '../scripts/migrate-sqlite-to-mongo.js';
import { populateSyntheticBaseline, getSyntheticCounts } from './fixtures/syntheticBaseline.js';

const DEV_DB_PATH = resolve('prisma/dev.db');
const EXPECTED_HASH = '15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4';

describe('FASE 6: Ferramenta de Migração SQLite -> MongoDB', () => {
  test('migra base sintética completa com paridade absoluta de contagens e tipos BSON', async () => {
    // 1. Criar banco SQLite em memória com fixture sintética completa
    const tempSqlitePath = resolve('tests/fixtures/temp_migration_test.db');
    const sqlite = new DatabaseSync(tempSqlitePath);
    try {
      const migrations = [
        'prisma/migrations/20261007220806_init/migration.sql',
        'prisma/migrations/20261007221304_expandir_modelos/migration.sql',
        'prisma/migrations/20261007221725_ponto_token/migration.sql',
        'prisma/migrations/20261008120000_resposta_idempotencia/migration.sql',
      ];
      for (const mig of migrations) {
        sqlite.exec(readFileSync(resolve(mig), 'utf8'));
      }
      populateSyntheticBaseline(sqlite);
    } finally {
      sqlite.close();
    }

    // 2. Iniciar Replica Set MongoDB efêmero
    const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const mongoUri = replSet.getUri('migration_verify_test');

    try {
      // 3. Provisionar coleções, índices e validators
      await runSync({ uri: mongoUri, mode: 'apply' });

      // 4. Testar Preflight
      const preflight = await runMigration({
        sqlitePath: tempSqlitePath,
        mongoUri,
        mode: 'preflight',
      });
      assert.equal(preflight.status, 'Preflight aprovado com sucesso.');

      // 5. Testar Dry-run
      const dryRun = await runMigration({
        sqlitePath: tempSqlitePath,
        mongoUri,
        mode: 'dry-run',
      });
      assert.equal(dryRun.status, 'Dry-run concluído sem alterações no banco.');
      const expectedCounts = getSyntheticCounts();
      for (const [model, count] of Object.entries(expectedCounts)) {
        assert.equal(dryRun.counts[model].sqlite, count);
        assert.equal(dryRun.counts[model].simulated, count);
      }

      // 6. Testar Import
      const importRes = await runMigration({
        sqlitePath: tempSqlitePath,
        mongoUri,
        mode: 'import',
      });
      assert.match(importRes.status, /Migração finalizada em modo import/);
      assert.equal(importRes.verification, 'Paridade de 100% comprovada entre SQLite e MongoDB.');

      // 7. Testar Verify independente
      const verifyRes = await runMigration({
        sqlitePath: tempSqlitePath,
        mongoUri,
        mode: 'verify',
      });
      assert.equal(verifyRes.verification, 'Paridade de 100% comprovada entre SQLite e MongoDB.');

      // 8. Testar Resume idempotente (não deve duplicar)
      const resumeRes = await runMigration({
        sqlitePath: tempSqlitePath,
        mongoUri,
        mode: 'resume',
      });
      for (const model of Object.keys(expectedCounts)) {
        assert.equal(resumeRes.counts[model].migrated, 0, 'Resume não deveria reinserir documentos existentes');
      }

      // 9. Verificar hash de dev.db original
      const currentDevHash = createHash('sha256').update(readFileSync(DEV_DB_PATH)).digest('hex');
      assert.equal(currentDevHash, EXPECTED_HASH, 'prisma/dev.db foi alterado indevidamente durante os testes!');
    } finally {
      await replSet.stop();
      if (existsSync(tempSqlitePath)) {
        const { rmSync } = await import('node:fs');
        rmSync(tempSqlitePath, { force: true });
      }
    }
  });

  test('bloqueia execução contra host remoto sem autorização explícita', async () => {
    await assert.rejects(
      async () => runMigration({
        sqlitePath: DEV_DB_PATH,
        mongoUri: 'mongodb://cluster.mongodb.net/feedqr',
        mode: 'preflight',
        allowRemote: false,
      }),
      /Conexão a host não local .* bloqueada por segurança/
    );
  });
});
