PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- CreateTable
CREATE TABLE "Pesquisa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "empresaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pesquisa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "Pesquisa_status_check" CHECK ("status" IN ('RASCUNHO', 'ATIVA', 'ENCERRADA'))
);

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pesquisaId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pergunta_pesquisaId_fkey" FOREIGN KEY ("pesquisaId") REFERENCES "Pesquisa" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "Pergunta_tipo_check" CHECK ("tipo" IN ('ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'))
);

-- CreateTable
CREATE TABLE "OpcaoPergunta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "perguntaId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OpcaoPergunta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- CreateTable
CREATE TABLE "PontoColeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pesquisaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PontoColeta_pesquisaId_fkey" FOREIGN KEY ("pesquisaId") REFERENCES "Pesquisa" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pesquisaId" TEXT NOT NULL,
    "pontoColetaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Resposta_pesquisaId_fkey" FOREIGN KEY ("pesquisaId") REFERENCES "Pesquisa" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "Resposta_pontoColetaId_pesquisaId_fkey" FOREIGN KEY ("pontoColetaId", "pesquisaId") REFERENCES "PontoColeta" ("id", "pesquisaId") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- CreateTable
CREATE TABLE "RespostaPergunta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "respostaId" TEXT NOT NULL,
    "pesquisaId" TEXT NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valorEstrelas" INTEGER,
    "valorNps" INTEGER,
    "valorSimNao" BOOLEAN,
    "valorTexto" TEXT,
    "opcaoPerguntaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RespostaPergunta_respostaId_pesquisaId_fkey" FOREIGN KEY ("respostaId", "pesquisaId") REFERENCES "Resposta" ("id", "pesquisaId") ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "RespostaPergunta_perguntaId_pesquisaId_tipo_fkey" FOREIGN KEY ("perguntaId", "pesquisaId", "tipo") REFERENCES "Pergunta" ("id", "pesquisaId", "tipo") ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "RespostaPergunta_opcaoPerguntaId_perguntaId_fkey" FOREIGN KEY ("opcaoPerguntaId", "perguntaId") REFERENCES "OpcaoPergunta" ("id", "perguntaId") ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT "RespostaPergunta_valor_check" CHECK (
        ("tipo" = 'ESTRELAS' AND "valorEstrelas" IS NOT NULL AND "valorEstrelas" BETWEEN 1 AND 5
            AND "valorNps" IS NULL AND "valorSimNao" IS NULL AND "valorTexto" IS NULL AND "opcaoPerguntaId" IS NULL)
        OR ("tipo" = 'NPS' AND "valorNps" IS NOT NULL AND "valorNps" BETWEEN 0 AND 10
            AND "valorEstrelas" IS NULL AND "valorSimNao" IS NULL AND "valorTexto" IS NULL AND "opcaoPerguntaId" IS NULL)
        OR ("tipo" = 'SIM_NAO' AND "valorSimNao" IS NOT NULL AND "valorSimNao" IN (0, 1)
            AND "valorEstrelas" IS NULL AND "valorNps" IS NULL AND "valorTexto" IS NULL AND "opcaoPerguntaId" IS NULL)
        OR ("tipo" = 'TEXTO' AND "valorTexto" IS NOT NULL
            AND "valorEstrelas" IS NULL AND "valorNps" IS NULL AND "valorSimNao" IS NULL AND "opcaoPerguntaId" IS NULL)
        OR ("tipo" = 'MULTIPLA_ESCOLHA' AND "opcaoPerguntaId" IS NOT NULL
            AND "valorEstrelas" IS NULL AND "valorNps" IS NULL AND "valorSimNao" IS NULL AND "valorTexto" IS NULL)
    )
);

-- RedefineTables
CREATE TABLE "new_Empresa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
-- Preserve existing companies while replacing integer IDs with UUID v4 values.
INSERT INTO "new_Empresa" ("id", "nome", "email", "createdAt", "updatedAt")
SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2)
    || '-' || substr('89ab', (random() & 3) + 1, 1) || substr(hex(randomblob(2)), 2)
    || '-' || hex(randomblob(6))), "nome", "email", "createdAt", "createdAt"
FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_empresaId_idx" ON "Usuario"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pesquisa_slug_key" ON "Pesquisa"("slug");

-- CreateIndex
CREATE INDEX "Pesquisa_empresaId_status_idx" ON "Pesquisa"("empresaId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Pergunta_pesquisaId_ordem_key" ON "Pergunta"("pesquisaId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "Pergunta_id_pesquisaId_tipo_key" ON "Pergunta"("id", "pesquisaId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "OpcaoPergunta_perguntaId_ordem_key" ON "OpcaoPergunta"("perguntaId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "OpcaoPergunta_id_perguntaId_key" ON "OpcaoPergunta"("id", "perguntaId");

-- CreateIndex
CREATE INDEX "PontoColeta_pesquisaId_ativo_idx" ON "PontoColeta"("pesquisaId", "ativo");

-- CreateIndex
CREATE UNIQUE INDEX "PontoColeta_id_pesquisaId_key" ON "PontoColeta"("id", "pesquisaId");

-- CreateIndex
CREATE INDEX "Resposta_pesquisaId_createdAt_idx" ON "Resposta"("pesquisaId", "createdAt");

-- CreateIndex
CREATE INDEX "Resposta_pontoColetaId_pesquisaId_idx" ON "Resposta"("pontoColetaId", "pesquisaId");

-- CreateIndex
CREATE UNIQUE INDEX "Resposta_id_pesquisaId_key" ON "Resposta"("id", "pesquisaId");

-- CreateIndex
CREATE INDEX "RespostaPergunta_respostaId_pesquisaId_idx" ON "RespostaPergunta"("respostaId", "pesquisaId");

-- CreateIndex
CREATE INDEX "RespostaPergunta_perguntaId_pesquisaId_tipo_idx" ON "RespostaPergunta"("perguntaId", "pesquisaId", "tipo");

-- CreateIndex
CREATE INDEX "RespostaPergunta_opcaoPerguntaId_perguntaId_idx" ON "RespostaPergunta"("opcaoPerguntaId", "perguntaId");

-- CreateIndex
CREATE UNIQUE INDEX "RespostaPergunta_respostaId_perguntaId_key" ON "RespostaPergunta"("respostaId", "perguntaId");

COMMIT;
PRAGMA foreign_keys=ON;
