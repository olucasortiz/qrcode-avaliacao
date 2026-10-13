import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { describe, test } from 'vitest';
import {
  SYNTHETIC_BASELINE_DATA,
  populateSyntheticBaseline,
  getSyntheticCounts,
} from './fixtures/syntheticBaseline.js';

const DEV_DB_PATH = resolve('prisma/dev.db');
const EXPECTED_DEV_DB_HASH = '15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4';

function getDevDbHash() {
  if (!existsSync(DEV_DB_PATH)) return null;
  return createHash('sha256').update(readFileSync(DEV_DB_PATH)).digest('hex');
}

describe('TASK 07.1: Fixtures sintéticas de caracterização e isolamento do baseline', () => {
  test('o banco original prisma/dev.db não é modificado', () => {
    const hash = getDevDbHash();
    assert.equal(hash, EXPECTED_DEV_DB_HASH, 'prisma/dev.db foi modificado ou está ausente!');
  });

  test('as migrations aplicam com sucesso em banco descartável e aceitam as fixtures sintéticas', () => {
    const db = new DatabaseSync(':memory:');
    try {
      // 1. Aplicar histórico das 4 migrations na ordem exata
      const migrations = [
        'prisma/migrations/20261007220806_init/migration.sql',
        'prisma/migrations/20261007221304_expandir_modelos/migration.sql',
        'prisma/migrations/20261007221725_ponto_token/migration.sql',
        'prisma/migrations/20261008120000_resposta_idempotencia/migration.sql',
      ];

      for (const migPath of migrations) {
        db.exec(readFileSync(resolve(migPath), 'utf8'));
      }

      // 2. Popular a base sintética com foreign keys ativas
      populateSyntheticBaseline(db);

      // 3. Validar integridade e foreign keys
      const integrity = db.prepare('PRAGMA integrity_check').all();
      assert.equal(integrity.length, 1);
      assert.equal(integrity[0].integrity_check, 'ok');

      const fkCheck = db.prepare('PRAGMA foreign_key_check').all();
      assert.deepEqual(fkCheck, [], 'Violação de foreign keys detectada nas fixtures sintéticas');

      // 4. Validar contagens de cada modelo
      const expectedCounts = getSyntheticCounts();
      for (const [table, expectedCount] of Object.entries(expectedCounts)) {
        const row = db.prepare(`SELECT COUNT(*) as count FROM "${table}"`).get();
        assert.equal(
          Number(row.count),
          expectedCount,
          `Contagem inesperada na tabela ${table}: esperado ${expectedCount}, obtido ${row.count}`
        );
      }

      // 5. Validar cobertura dos 5 tipos de pergunta
      const tiposEncontrados = db
        .prepare('SELECT DISTINCT tipo FROM Pergunta ORDER BY tipo')
        .all()
        .map(r => r.tipo);

      assert.deepEqual(
        tiposEncontrados,
        ['ESTRELAS', 'MULTIPLA_ESCOLHA', 'NPS', 'SIM_NAO', 'TEXTO'],
        'Os 5 tipos de pergunta devem estar presentes nas fixtures sintéticas'
      );

      // 6. Validar cenários de idempotência:
      // a) Respostas com idempotencyKey não nulas são únicas
      const chavesPreenchidas = db
        .prepare('SELECT idempotencyKey FROM Resposta WHERE idempotencyKey IS NOT NULL')
        .all();
      assert.ok(chavesPreenchidas.length >= 4, 'Deve haver ao menos 4 respostas com chave de idempotência');
      const chavesSet = new Set(chavesPreenchidas.map(r => r.idempotencyKey));
      assert.equal(chavesSet.size, chavesPreenchidas.length, 'Chaves de idempotência preenchidas devem ser distintas');

      // b) Múltiplas respostas com idempotencyKey = NULL são aceitas sem violação do índice único
      const respostasSemChave = db
        .prepare('SELECT id FROM Resposta WHERE idempotencyKey IS NULL')
        .all();
      assert.equal(respostasSemChave.length, 2, 'Deve haver exatamente 2 respostas com idempotencyKey NULL');

      // 7. Validar pontos de coleta: ativos e inativos
      const pontosAtivos = db.prepare('SELECT COUNT(*) as count FROM PontoColeta WHERE ativo = 1').get();
      const pontosInativos = db.prepare('SELECT COUNT(*) as count FROM PontoColeta WHERE ativo = 0').get();
      assert.ok(Number(pontosAtivos.count) >= 2, 'Deve haver pontos de coleta ativos');
      assert.ok(Number(pontosInativos.count) >= 1, 'Deve haver ponto de coleta inativo preservado no histórico');

      // 8. Validar respostas com ponto e sem ponto (origem direta)
      const respComPonto = db.prepare('SELECT COUNT(*) as count FROM Resposta WHERE pontoColetaId IS NOT NULL').get();
      const respSemPonto = db.prepare('SELECT COUNT(*) as count FROM Resposta WHERE pontoColetaId IS NULL').get();
      assert.ok(Number(respComPonto.count) >= 4, 'Deve haver respostas originadas de pontos de coleta');
      assert.ok(Number(respSemPonto.count) >= 2, 'Deve haver respostas diretas (sem ponto de coleta)');

      // 9. Validar distribuição temporal (datas distintas para agregação diária)
      const diasDistintos = db
        .prepare("SELECT DISTINCT date(createdAt / 1000, 'unixepoch') as dia FROM Resposta ORDER BY dia")
        .all()
        .map(r => r.dia);
      assert.deepEqual(
        diasDistintos,
        ['2026-10-01', '2026-10-02', '2026-10-03'],
        'Respostas devem cobrir múltiplos dias para caracterização de série temporal'
      );

      // 10. Validar isolamento multi-tenant (Empresas Alfa e Beta)
      const empresas = db.prepare('SELECT id, nome FROM Empresa ORDER BY nome').all();
      assert.equal(empresas.length, 2);
      const pesquisasAlfa = db.prepare('SELECT COUNT(*) as count FROM Pesquisa WHERE empresaId = ?').get(empresas[0].id);
      const pesquisasBeta = db.prepare('SELECT COUNT(*) as count FROM Pesquisa WHERE empresaId = ?').get(empresas[1].id);
      assert.equal(Number(pesquisasAlfa.count), 3);
      assert.equal(Number(pesquisasBeta.count), 1);
    } finally {
      db.close();
    }
  });

  test('prisma/dev.db permanece intacto após execução do teste', () => {
    const hash = getDevDbHash();
    assert.equal(hash, EXPECTED_DEV_DB_HASH, 'prisma/dev.db foi modificado durante o teste!');
  });
});
