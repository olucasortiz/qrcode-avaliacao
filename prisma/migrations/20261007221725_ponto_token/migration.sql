-- RedefineTables
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "new_PontoColeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "pesquisaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PontoColeta_pesquisaId_fkey" FOREIGN KEY ("pesquisaId") REFERENCES "Pesquisa" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
-- Existing points receive unique public tokens without changing their IDs or responses.
INSERT INTO "new_PontoColeta" ("ativo", "createdAt", "id", "nome", "pesquisaId", "updatedAt", "token")
SELECT "ativo", "createdAt", "id", "nome", "pesquisaId", "updatedAt",
    lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2)
    || '-' || substr('89ab', (random() & 3) + 1, 1) || substr(hex(randomblob(2)), 2)
    || '-' || hex(randomblob(6)))
FROM "PontoColeta";
DROP TABLE "PontoColeta";
ALTER TABLE "new_PontoColeta" RENAME TO "PontoColeta";
CREATE UNIQUE INDEX "PontoColeta_token_key" ON "PontoColeta"("token");
CREATE INDEX "PontoColeta_pesquisaId_ativo_idx" ON "PontoColeta"("pesquisaId", "ativo");
CREATE UNIQUE INDEX "PontoColeta_id_pesquisaId_key" ON "PontoColeta"("id", "pesquisaId");
COMMIT;
PRAGMA foreign_keys=ON;
