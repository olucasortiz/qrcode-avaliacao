ALTER TABLE "Resposta" ADD COLUMN "idempotencyKey" TEXT;
ALTER TABLE "Resposta" ADD COLUMN "submissionHash" TEXT;
CREATE UNIQUE INDEX "Resposta_idempotencyKey_key" ON "Resposta"("idempotencyKey");
