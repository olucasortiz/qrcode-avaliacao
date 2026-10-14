import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { describe, test } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { runSync } from '../scripts/sync-mongodb.js';
import { runMigration } from '../scripts/migrate-sqlite-to-mongo.js';
import { runRollback } from '../scripts/rollback-mongo-to-sqlite.js';
import { populateSyntheticBaseline, getSyntheticCounts } from './fixtures/syntheticBaseline.js';

const DEV_DB_PATH = resolve('prisma/dev.db');
const devHash = () => existsSync(DEV_DB_PATH) ? createHash('sha256').update(readFileSync(DEV_DB_PATH)).digest('hex') : null;
const originalDevHash = devHash();

describe('FASE 7: Ferramenta de Rollback MongoDB -> SQLite', () => {
  test('reconstrói novo SQLite íntegro após migração e novas escritas no MongoDB', async () => {
    // 1. Criar banco SQLite temporário de origem com fixtures
    const tempSqlitePath = resolve('tests/fixtures/temp_source_rollback.db');
    const rollbackSqlitePath = resolve('tests/fixtures/temp_output_rollback.db');
    const sqlite = new DatabaseSync(tempSqlitePath);

    try {
      const migrations = [
        'prisma/migrations/20261007220806_init/migration.sql',
        'prisma/migrations/20261007221304_expandir_modelos/migration.sql',
        'prisma/migrations/20261007221725_ponto_token/migration.sql',
        'prisma/migrations/20261008120000_resposta_idempotencia/migration.sql',
      ];
      for (const mig of migrations) sqlite.exec(readFileSync(resolve(mig), 'utf8'));
      populateSyntheticBaseline(sqlite);
    } finally {
      sqlite.close();
    }

    const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const mongoUri = replSet.getUri('rollback_test_db');

    try {
      // 2. Provisionar e migrar para MongoDB
      await runSync({ uri: mongoUri, mode: 'apply' });
      await runMigration({
        sqlitePath: tempSqlitePath,
        mongoUri,
        mode: 'import',
      });

      // 3. Simular novas gravações legítimas no MongoDB pós-migração
      const { PrismaClient } = await import('../src/generated/mongo-client/index.js');
      const prismaMongo = new PrismaClient({ datasourceUrl: mongoUri });

      const newEmpresaId = '90000000-0000-4000-8000-000000000001';
      await prismaMongo.empresa.create({
        data: {
          id: newEmpresaId,
          nome: 'Empresa Criada no Mongo',
          email: 'nova_empresa_mongo@test.local',
        },
      });

      const newPesquisaId = '90000000-0000-4000-8000-000000000002';
      await prismaMongo.pesquisa.create({
        data: {
          id: newPesquisaId,
          empresaId: newEmpresaId,
          titulo: 'Pesquisa Criada no Mongo',
          slug: 'pesquisa-criada-no-mongo',
          status: 'ATIVA',
        },
      });

      const newRespostaId = '90000000-0000-4000-8000-000000000003';
      const idempotencyKey = randomUUID();
      await prismaMongo.resposta.create({
        data: {
          id: newRespostaId,
          pesquisaId: newPesquisaId,
          idempotencyKey,
          submissionHash: 'hash_pos_migracao',
        },
      });

      await prismaMongo.$disconnect();

      // 4. Executar rollback para novo arquivo SQLite
      const rollbackRes = await runRollback({
        mongoUri,
        outputSqlitePath: rollbackSqlitePath,
        overwriteOutput: true,
      });

      assert.match(rollbackRes.status, /Rollback concluído com sucesso/);

      // 5. Validar o novo banco SQLite gerado
      const rolledBackDb = new DatabaseSync(rollbackSqlitePath, { readOnly: true });
      try {
        const integrity = rolledBackDb.prepare('PRAGMA integrity_check').all();
        assert.equal(integrity[0].integrity_check, 'ok');

        const fkCheck = rolledBackDb.prepare('PRAGMA foreign_key_check').all();
        assert.deepEqual(fkCheck, [], 'Violações de foreign key no banco de rollback!');

        // Conferir que dados novos inseridos no Mongo existem no SQLite
        const empresaNova = rolledBackDb.prepare(`SELECT * FROM "Empresa" WHERE id = ?`).get(newEmpresaId);
        assert.ok(empresaNova);
        assert.equal(empresaNova.nome, 'Empresa Criada no Mongo');

        const respostaNova = rolledBackDb.prepare(`SELECT * FROM "Resposta" WHERE id = ?`).get(newRespostaId);
        assert.ok(respostaNova);
        assert.equal(respostaNova.idempotencyKey, idempotencyKey);
        assert.equal(respostaNova.submissionHash, 'hash_pos_migracao');

        // Conferir contagem total de Empresas: base sintética (2) + 1 nova = 3
        const totalEmpresas = rolledBackDb.prepare(`SELECT COUNT(*) as count FROM "Empresa"`).get();
        assert.equal(Number(totalEmpresas.count), 3);
      } finally {
        rolledBackDb.close();
      }

      // 6. Assegurar que o dev.db original NUNCA foi tocado
      assert.equal(devHash(), originalDevHash);
    } finally {
      await replSet.stop();
      if (existsSync(tempSqlitePath)) rmSync(tempSqlitePath, { force: true });
      if (existsSync(rollbackSqlitePath)) rmSync(rollbackSqlitePath, { force: true });
    }
  });

  test('bloqueia estritamente tentativa de sobrescrever o prisma/dev.db original', async () => {
    await assert.rejects(
      async () => runRollback({
        mongoUri: 'mongodb://127.0.0.1:27017/teste',
        outputSqlitePath: DEV_DB_PATH,
      }),
      /PROTEÇÃO ATIVA: O script de rollback NUNCA pode sobrescrever o banco original "prisma\/dev\.db"/
    );
  });
});
