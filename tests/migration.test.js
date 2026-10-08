import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'vitest';

test('migration preserva pontos existentes e suas respostas', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(readFileSync('prisma/migrations/20261007220806_init/migration.sql', 'utf8'));
    db.exec(readFileSync('prisma/migrations/20261007221304_expandir_modelos/migration.sql', 'utf8'));
    db.exec(`
      INSERT INTO Empresa (id, nome, email, updatedAt) VALUES ('empresa', 'Teste', 'teste@test.local', CURRENT_TIMESTAMP);
      INSERT INTO Pesquisa (id, empresaId, titulo, slug, updatedAt) VALUES ('pesquisa', 'empresa', 'Teste', 'teste', CURRENT_TIMESTAMP);
      INSERT INTO PontoColeta (id, pesquisaId, nome, updatedAt) VALUES ('ponto', 'pesquisa', 'Balcao', CURRENT_TIMESTAMP);
      INSERT INTO Resposta (id, pesquisaId, pontoColetaId, updatedAt) VALUES ('resposta', 'pesquisa', 'ponto', CURRENT_TIMESTAMP);
    `);
    db.exec(readFileSync('prisma/migrations/20261007221725_ponto_token/migration.sql', 'utf8'));
    const ponto = db.prepare('SELECT * FROM PontoColeta').get();
    assert.equal(ponto.id, 'ponto');
    assert.match(ponto.token, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.equal(db.prepare('SELECT pontoColetaId FROM Resposta').get().pontoColetaId, ponto.id);
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  } finally { db.close(); }
});
