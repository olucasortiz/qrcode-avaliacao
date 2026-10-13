# TASK 08 — Migração Completa do FeedQR para MongoDB Atlas

## 1. Resumo Executivo

A **TASK 08** concluiu com êxito a migração técnica da aplicação **FeedQR** de SQLite para MongoDB com persistência NoSQL, garantindo a compatibilidade total dos 8 modelos relacionais com a semântica de documentos do MongoDB e preparando o ecossistema para operação com MongoDB Atlas em produção.

O sistema foi transformado preservando rigorosamente:
- Contratos HTTP de todas as rotas públicas e administrativas.
- Autenticação JWT e isolamento multiempresa.
- Chaves primárias UUID como strings (`_id`).
- Mecanismo de idempotência com índice parcial nativo.
- Coordenação de concorrência por pesquisa (`writeVersion`).
- Agrupamento diário UTC e métricas analíticas (NPS, estrelas, distribuições, CSV).
- Frontend Vue 3 sem necessidade de alterações estruturais ou regressões visuais.
- Integridade do banco SQLite original (`prisma/dev.db`) com SHA-256 inalterado.
- 100% dos testes aprovados (61 testes backend Vitest, 62 testes unitários de frontend e 64 testes Playwright E2E com MongoDB real efêmero).

---

## 2. Arquivos Criados e Modificados

| Arquivo | Status | Descrição |
| :--- | :--- | :--- |
| `prisma/schema.prisma` | Modificado | Promovido para MongoDB definitivo (`relationMode = "prisma"`, UUIDs em `_id`, sem `@unique` em idempotencyKey, `writeVersion`) |
| `prisma/schema.sqlite.prisma` | Criado | Cópia de preservação e referência do schema SQLite original para ferramentas de rollback e testes |
| `prisma/schema.mongo.prisma` | Modificado | Adicionado campo `writeVersion Int @default(1)` para coordenação de concorrência |
| `src/config/mongo/schemaManifest.js` | Modificado | Adicionada propriedade `writeVersion` no validator BSON da coleção `Pesquisa` |
| `src/config/prisma.js` | Modificado | Conectado ao client MongoDB gerado, com suporte a health check (`$runCommandRaw ping`), graceful disconnect e compatibilidade PRAGMA |
| `src/config/env.js` | Modificado | Suporte a URIs MongoDB (`mongodb://` e `mongodb+srv://`), e variável `TRUST_PROXY` |
| `src/app.js` | Modificado | Ativação condicional de `trust proxy` para reversão de IP segura atrás de proxy/load balancer |
| `src/server.js` | Modificado | Implementação de graceful shutdown (`SIGINT`/`SIGTERM`) e verificação de prontidão do banco na inicialização |
| `src/services/healthService.js` | Modificado | Adicionada função `getReadinessStatus` checando conectividade ativa com o MongoDB |
| `src/controllers/healthController.js` | Modificado | Adicionado controller `readinessCheck` respondendo 200 (OK) ou 503 (Indisponível) |
| `src/routes/healthRoutes.js` | Modificado | Exposta rota `GET /api/health/ready` para probes de prontidão Kubernetes/Atlas |
| `src/services/resultadoService.js` | Modificado | Substituído `$queryRaw` SQLite por pipeline nativo de agregação `$dateToString` UTC via `aggregateRaw` |
| `src/services/respostaService.js` | Modificado | Idempotência com `findFirst`, coordenação transacional via `writeVersion`, retry com backoff exponencial, jitter e reconciliação externa |
| `src/services/pesquisaService.js` | Modificado | Coordenação com incremento de `writeVersion` em `publicarPesquisa` e `atualizarPesquisa` |
| `src/services/perguntaService.js` | Modificado | Coordenação com `writeVersion` e validação explícita de integridade referencial antes de exclusão |
| `src/services/pontoColetaService.js` | Modificado | Coordenação com `writeVersion` em mutações de ponto de coleta |
| `src/middlewares/errorMiddleware.js` | Modificado | Tratamento de códigos MongoDB/Prisma (`11000` duplicate key, `121` validation error, `P2034` write conflict) retornando HTTP 409/400 |
| `scripts/migrate-sqlite-to-mongo.js` | Criado | Ferramenta de migração verificável (`preflight`, `dry-run`, `import`, `resume`, `verify`) com conversão exata BSON |
| `scripts/rollback-mongo-to-sqlite.js` | Criado | Ferramenta de reversão reconstrói NOVO banco SQLite a partir do MongoDB sem tocar em `dev.db` |
| `scripts/verify-atlas.js` | Criado | Script administrativo de inspeção de conectividade, TLS, Replica Set e conformidade de schema no Atlas |
| `tests/setup.js` | Modificado | Inicialização automática de MongoDB Replica Set efêmero em memória para todos os testes Vitest |
| `frontend/tests/e2e/api-server.js` | Modificado | Adaptado servidor de teste do Playwright para utilizar MongoDB Replica Set em memória |
| `tests/concurrencyMongo.test.js` | Criado | Testes de concorrência com 10 envios simultâneos, conflitos de idempotência e coordenação transacional |
| `tests/migrationSqliteToMongo.test.js` | Criado | Suíte automatizada validando todos os modos da ferramenta de migração com paridade BSON |
| `tests/rollbackMongoToSqlite.test.js` | Criado | Suíte automatizada validando o rollback com geração de novo SQLite e verificação de foreign keys |
| `package.json` | Modificado | Adicionados scripts `mongo:migrate`, `mongo:rollback`, `mongo:verify-atlas` |

---

## 3. Arquitetura Final

```
                                  +-----------------------+
                                  |   Frontend Vue 3      |
                                  |   (Vite / Tailwind)   |
                                  +-----------+-----------+
                                              |
                                     HTTP/REST / JSON
                                              |
                                  +-----------v-----------+
                                  |     Express 5 API     |
                                  |   (Middlewares, CORS, |
                                  |   RateLimit, AuthJWT) |
                                  +-----------+-----------+
                                              |
                                    Prisma Client 6.19.3
                                   (relationMode: prisma)
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
    +----------------------------------+              +----------------------------------+
    |      Ambiente de Testes / Dev    |              |     Ambiente de Produção         |
    |   MongoDB Replica Set Local      |              |      MongoDB Atlas Cluster       |
    |  (mongodb-memory-server / mongod)|              |     (Replica Set com TLS 1.3)    |
    |   - 8 Coleções                   |              |   - 8 Coleções                   |
    |   - 20 Índices (1 Parcial)       |              |   - 20 Índices (1 Parcial)       |
    |   - Strict $jsonSchema BSON      |              |   - Strict $jsonSchema BSON      |
    +----------------------------------+              +----------------------------------+
```

### Princípios Arquiteturais Consolidados
1. **Identificadores UUID String:** Todos os modelos utilizam `@id @default(uuid()) @map("_id")`. O identificador original SQLite foi integralmente preservado, sem transição para `ObjectId`.
2. **`relationMode = "prisma"`:** A integridade referencial é aplicada pela camada de software/ORM através de transações de escrita e validações defensivas nos services.
3. **Isolamento Multiempresa:** Mantido em 100% das consultas administrativas (`where: { empresaId }` ou `where: { pesquisa: { empresaId } }`).
4. **Governança de Schema:** O MongoDB não depende de migrations imperativas (`db push` proibido em produção). A infraestrutura é provisionada via manifest versionado (`scripts/sync-mongodb.js`).

---

## 4. Migração do Backend

### Adaptadores e Camadas Atualizadas
- **`src/config/prisma.js`:** Gerencia a conexão com o MongoDB com pool e timeout configuráveis, provê função de checagem de prontidão (`$runCommandRaw({ ping: 1 })`) e implementa encerramento gracioso (`disconnectPrisma`).
- **`src/config/env.js`:** Validação do formato de conexão para MongoDB com Zod: `mongodb://` e `mongodb+srv://`, suporte a `TRUST_PROXY`.
- **`src/services/healthService.js` & `src/routes/healthRoutes.js`:** Endpoint `GET /api/health/ready` para monitoramento de liveness/readiness, retornando HTTP 200 quando o MongoDB responde com sucesso e 503 em falhas de conectividade.
- **`src/server.js`:** Handlers de `SIGINT` e `SIGTERM` fecham o listener HTTP e desconectam o Prisma Client graciosamente com timeout de segurança de 10 segundos.

---

## 5. Índices e Validators

O manifest (`src/config/mongo/schemaManifest.js`) define 20 índices e validadores `$jsonSchema` estritos para as 8 coleções:

### Coleções e Índices
- **`Empresa`:** `_id_`, `Empresa_email_key` (único).
- **`Usuario`:** `_id_`, `Usuario_email_key` (único), `Usuario_empresaId_idx`.
- **`Pesquisa`:** `_id_`, `Pesquisa_slug_key` (único), `Pesquisa_empresaId_status_idx`.
- **`Pergunta`:** `_id_`, `Pergunta_pesquisaId_ordem_key` (único), `Pergunta__id_pesquisaId_tipo_key` (único).
- **`OpcaoPergunta`:** `_id_`, `OpcaoPergunta_perguntaId_ordem_key` (único), `OpcaoPergunta__id_perguntaId_key` (único).
- **`PontoColeta`:** `_id_`, `PontoColeta_token_key` (único), `PontoColeta__id_pesquisaId_key` (único), `PontoColeta_pesquisaId_ativo_idx`.
- **`Resposta`:**
  - `Resposta__id_pesquisaId_key` (único).
  - `Resposta_pesquisaId_createdAt_idx`.
  - `Resposta_pontoColetaId_pesquisaId_idx`.
  - **Índice Único Parcial:**
    ```javascript
    {
      name: 'Resposta_idempotencyKey_partial_key',
      key: { idempotencyKey: 1 },
      unique: true,
      partialFilterExpression: { idempotencyKey: { $type: 'string' } }
    }
    ```
- **`RespostaPergunta`:**
  - `RespostaPergunta_respostaId_perguntaId_key` (único).
  - `RespostaPergunta_respostaId_pesquisaId_idx`.
  - `RespostaPergunta_perguntaId_pesquisaId_tipo_idx`.
  - `RespostaPergunta_opcaoPerguntaId_perguntaId_idx`.

### Regras do `$jsonSchema`
- Aceitação flexível de tipos inteiros e pontos flutuantes (`['int', 'long', 'double']`) para campos numéricos (`ordem`, `valorEstrelas`, `valorNps`), eliminando conflitos de serialização entre a query engine do Prisma (Rust) e JavaScript.
- Restrição estrita de notas (estrelas entre 1 e 5; NPS entre 0 e 10).
- Exclusividade rigorosa em `RespostaPergunta` via cláusula `oneOf`, assegurando que apenas o campo correspondente ao `tipo` da pergunta seja preenchido com dados não nulos.

---

## 6. Estratégia de Concorrência e Idempotência

### Coordenação por Pesquisa (`writeVersion`)
Mutações que disputam o ciclo de vida de uma pesquisa participam de uma escrita deliberada no documento `Pesquisa` através de `{ writeVersion: { increment: 1 } }`. No MongoDB Replica Set, isso força a detecção de conflitos de escrita (`WriteConflict`), garantindo que:
- O encerramento de uma pesquisa não ocorra simultaneamente com o registro de novas respostas.
- A publicação de uma pesquisa bloqueie edições concorrentes de perguntas ou opções.
- A desativação de um ponto de coleta bloqueie respostas enviadas concorrentemente para aquele ponto.

### Idempotência Avançada
1. **Verificação Prévia:** Antes de abrir transação, consulta se a chave de idempotência já existe. Se existir com o mesmo `submissionHash`, retorna imediatamente confirmação de sucesso sem abrir transação desnecessária.
2. **Reconciliação Externa:** Se uma transação falha com erro transitório (`WriteConflict`, `P2034`, `P2002`), o serviço executa uma consulta fora do escopo abortado. Se a resposta já foi gravada por uma requisição concorrente idêntica, confirma o sucesso (HTTP 201).
3. **Detecção de Conflito de Payload:** Se a mesma chave de idempotência for reenviada com corpo diferente, o sistema rejeita com HTTP 409 (`Tentativa de envio conflitante.`).
4. **Retry com Backoff e Jitter:** Conflitos transitórios sofrem até 6 retentativas com recuo exponencial e variação aleatória de jitter (`min(20 * 2^attempt + random(0..25), 500) ms`).
5. **Comprovação em Teste:** Validado com 10 envios estritamente simultâneos via `Promise.all` em `tests/concurrencyMongo.test.js`.

---

## 7. Ferramenta de Migração (`scripts/migrate-sqlite-to-mongo.js`)

Implementada para transferência sem perda a partir do SQLite:
- **Origem:** Aberto em modo estritamente somente leitura (`DatabaseSync(path, { readOnly: true })`).
- **Destino:** MongoDB Replica Set com sanitização de credenciais e validação de segurança.
- **Topologia de Carga:** Ordem topológica em 8 etapas preservando integridade das referências.
- **Conversão de Tipos:**
  - `INTEGER` em milissegundos / strings ISO → `BSON Date`.
  - `0 / 1` inteiros → `BSON Boolean`.
  - Strings UUID → `_id` String.
  - Atribuição automática de `writeVersion = 1` nas pesquisas históricas.

### Modos Operacionais
- `--preflight`: Valida integridade e chaves estrangeiras do SQLite e disponibilidade do MongoDB.
- `--dry-run`: Simula a conversão completa de todos os registros sem gravar dados no MongoDB.
- `--import`: Migra todos os documentos verificando que as coleções destino estejam vazias.
- `--resume`: Insere incrementalmente apenas documentos cujos `_id` ainda não existam no destino.
- `--verify`: Compara campo a campo todos os documentos entre SQLite e MongoDB, validando contagens, UUIDs, valores, hashes de senha e datas ao milissegundo.

---

## 8. Ferramenta de Rollback (`scripts/rollback-mongo-to-sqlite.js`)

Permite reverter a aplicação para SQLite a qualquer momento:
- **Segurança Máxima:** Possui trava em código que impede sumariamente a sobrescrita do arquivo original `prisma/dev.db`.
- **Construção Limpa:** Cria um **novo** arquivo SQLite (ex.: `backups/rollback_<timestamp>.db`) aplicando o histórico completo das migrations DDL.
- **Extração Reversa:** Converte tipos BSON de volta para a convenção SQLite (`Date` → integer ms, `boolean` → `0/1`, `_id` → `id`).
- **Auditoria Automática:** Executa `PRAGMA integrity_check` e `PRAGMA foreign_key_check` antes de finalizar.
- **Validação com Dados Novos:** Testado em `tests/rollbackMongoToSqlite.test.js`, comprovando que dados criados após a migração no MongoDB são convertidos para o SQLite com 100% de integridade referencial.

---

## 9. Resultados dos Testes

### 1. Testes Backend Vitest (61 Testes em 11 Arquivos) — 100% PASS
```
 Test Files  11 passed (11)
      Tests  61 passed (61)
   Duration  32.65s
```
- `tests/api.test.js` (17 testes) — PASS (Auth, CRUD, DTOs, rate limits, isolamento)
- `tests/concurrencyMongo.test.js` (5 testes) — PASS (10 envios simultâneos, conflitos de idempotência, coordenação transacional)
- `tests/mongoSync.test.js` (8 testes) — PASS (Sync seguro, partial index, validators BSON)
- `tests/migrationSqliteToMongo.test.js` (2 testes) — PASS (Preflight, dry-run, import, resume, verify)
- `tests/rollbackMongoToSqlite.test.js` (2 testes) — PASS (Rollback completo com novas escritas e integridade)
- `tests/publicResponse.test.js` (6 testes) — PASS (Respostas públicas, idempotência e rate limit)
- `tests/analytics.test.js` (5 testes) — PASS (Métricas, agregação diária UTC, NPS, estrelas)
- `tests/syntheticBaseline.test.js` (3 testes) — PASS (Isolamento do baseline e integridade de dev.db)
- `tests/migration.test.js` (1 teste) — PASS (Preservação de pontos e tokens legados)
- `tests/dev.test.js` (1 teste) — PASS (Watcher e ambiente de desenvolvimento)
- `tests/csv.test.js` (11 testes) — PASS (Formatação, sanitização contra injeção e streaming)

### 2. Testes Frontend Unitários (62 Testes em 9 Arquivos) — 100% PASS
```
 Test Files  9 passed (9)
      Tests  62 passed (62)
   Duration  498ms
```
- Validações de formulários, esquemas Zod, manipulação de sessão, armazenamento local e métricas.

### 3. Testes Playwright E2E com MongoDB Real (64 Testes) — 100% PASS
```
  64 passed (3.0m)
```
- Testes em 4 larguras de tela (360px, 768px, 1024px, 1440px).
- Fluxo de ponta a ponta: Cadastro → Criação de Pesquisa → Configuração dos 5 tipos de perguntas → Pontos de coleta → Geração de QR Code real → Envio público de avaliações → Dashboard analítico em tempo real com agregação diária → Exportação de CSV.

---

## 10. Comparação de Dados (SQLite vs MongoDB)

| Métrica | SQLite Original | MongoDB Migrado | Status |
| :--- | :--- | :--- | :--- |
| **Modelos / Coleções** | 8 tabelas | 8 coleções | Idêntico |
| **Identificadores** | UUID String v4 | UUID String v4 (`_id`) | 100% Idêntico |
| **Hashes de Senha** | bcrypt ($2b$12$) | bcrypt ($2b$12$) | 100% Idêntico |
| **Tokens de Ponto** | UUID String v4 | UUID String v4 | 100% Idêntico |
| **Slugs de Pesquisa** | String única | String única | 100% Idêntico |
| **Precisão de Datas** | Milissegundo UTC | BSON Date UTC | 100% Idêntico |
| **Valores Booleanos** | 0 / 1 (inteiro) | true / false (booleano nativo) | Paridade garantida |
| **Idempotency Keys** | String / NULL | String / ausente (Índice parcial) | 100% Funcional |
| **Agrupamento de Dias** | strftime UTC | `$dateToString` UTC | Formato `{ dia, quantidade }` idêntico |

---

## 11. Configuração do MongoDB Atlas

### 1. Connection String
Configurar a variável de ambiente `DATABASE_URL` no ambiente de produção:
```env
DATABASE_URL="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/feedqr?retryWrites=true&w=majority"
```
Requisitos obrigatórios:
- Protocolo `mongodb+srv://` (ativa TLS/SSL automaticamente).
- Nome de banco explícito na URI (`/feedqr`).
- Opções `retryWrites=true` e `w=majority` para consistência e suporte a transações multi-documento.

### 2. Rede e Acesso (Atlas Network Access)
- Configurar IP Access List no Atlas com os IPs públicos dos servidores de aplicação, ou via VPC Peering / Private Endpoint em ambientes em nuvem corporativos.
- Não utilizar `0.0.0.0/0` sem autenticação forte com senhas complexas e rotação periódica.

### 3. Provisionamento de Índices e Validators
Antes de iniciar o tráfego da aplicação no Atlas:
```bash
# 1. Verificar conectividade com o cluster Atlas
node scripts/verify-atlas.js

# 2. Executar dry-run para inspecionar os recursos a provisionar
node scripts/sync-mongodb.js --dry-run --allow-remote

# 3. Aplicar as 8 coleções, 20 índices e validators
node scripts/sync-mongodb.js --apply --allow-remote

# 4. Validar conformidade
node scripts/sync-mongodb.js --verify --allow-remote
```

### 4. Migração dos Dados de Produção
No momento do corte (janela de manutenção):
```bash
# 1. Executar preflight
node scripts/migrate-sqlite-to-mongo.js --preflight --allow-remote

# 2. Executar migração real
node scripts/migrate-sqlite-to-mongo.js --import --allow-remote

# 3. Verificar paridade absoluta
node scripts/migrate-sqlite-to-mongo.js --verify --allow-remote
```

---

## 12. Pendências de Deploy

1. **Definição de Credenciais do Atlas de Produção:**
   Conforme restrições inegociáveis de segurança, nenhuma credencial de banco externo foi inventada ou commitada. O provisionamento das credenciais reais deve ser realizado via segredos da plataforma de deploy (ex.: Railway, Render, Fly.io, AWS Secrets Manager).
2. **DNS e Certificados HTTPS:**
   O domínio público de produção deve ter HTTPS ativo, e `FRONTEND_PUBLIC_URL` e `CORS_ORIGINS` devem apontar para a URL final de produção.
3. **Corte e Backup Final:**
   Executar o snapshot final de `prisma/dev.db` imediatamente antes de iniciar o processo de corte.

---

## 13. Riscos Restantes e Mitigações

1. **Risco:** Latência de rede para o cluster MongoDB Atlas durante transações aninhadas.
   - *Mitigação:* O cluster Atlas deve ser alocado na mesma região geográfica do servidor de aplicação (ex.: AWS `sa-east-1` / São Paulo).
2. **Risco:** Lock de arquivos binários no Windows (`query_engine-windows.dll.node`) ao rodar geração durante execução de servidores.
   - *Mitigação:* O client MongoDB é gerado isoladamente em `src/generated/mongo-client`, eliminando conflitos com processos Node.js externos.
3. **Risco:** Rejeição de documentos históricos por validação BSON.
   - *Mitigação:* O script de migração normaliza datas nulas, timestamps inteiros para BSON Date e números para BSON Number, satisfazendo integralmente o `$jsonSchema`.

---

## 14. Checklist de Produção

- [x] Schema Prisma MongoDB definitivo criado e validado (`prisma/schema.prisma`).
- [x] Schema SQLite preservado para rollback (`prisma/schema.sqlite.prisma`).
- [x] Script administrativo de índices e validators testado (`scripts/sync-mongodb.js`).
- [x] Índice único parcial para `idempotencyKey` implementado e testado.
- [x] Concorrência coordenada via `writeVersion` testada com 10 envios simultâneos.
- [x] Agregações analíticas e dashboard adaptados para MongoDB (`resultadoService.js`).
- [x] Suporte a `trust proxy` configurado no backend (`app.js`).
- [x] Readiness endpoint (`/api/health/ready`) e graceful shutdown implementados.
- [x] Ferramenta de migração SQLite → MongoDB testada e homologada (`scripts/migrate-sqlite-to-mongo.js`).
- [x] Ferramenta de rollback MongoDB → SQLite testada e homologada (`scripts/rollback-mongo-to-sqlite.js`).
- [x] Script de auditoria do cluster Atlas preparado (`scripts/verify-atlas.js`).
- [x] Suíte de testes backend 100% verde (61/61 testes).
- [x] Suíte de testes frontend unitários 100% verde (62/62 testes).
- [x] Suíte de testes E2E Playwright 100% verde (64/64 testes).
- [x] Build de produção do frontend compilado com sucesso.
- [x] Hash SHA-256 do SQLite original `prisma/dev.db` verificado e intocado.
- [ ] Inserção da connection string real do Atlas no ambiente de produção (Pendente de segredos do usuário).
- [ ] Execução da migração real na janela de corte de produção.

---

## 15. Critérios de Aceite e Classificação

| Critério de Aceite | Classificação | Evidência |
| :--- | :--- | :--- |
| **Backend adaptado para MongoDB** | **IMPLEMENTADO E TESTADO** | Prisma Client MongoDB ativo; 61 testes Vitest passando |
| **Preservação de dados e UUIDs** | **IMPLEMENTADO E TESTADO** | Modelos e DTOs utilizam strings UUID; testado em migração e rollback |
| **Índice único parcial de idempotência** | **IMPLEMENTADO E TESTADO** | Permite múltiplos nulos e impede duplicatas; validado em testes unitários e E2E |
| **Coordenação transacional (writeVersion)** | **IMPLEMENTADO E TESTADO** | Testado em 10 requisições simultâneas e conflito de publicação |
| **Dashboard e Agregações em UTC** | **IMPLEMENTADO E TESTADO** | `aggregateRaw` com `$dateToString` UTC validado em testes de API e E2E |
| **Exportação CSV protegida** | **IMPLEMENTADO E TESTADO** | Streaming em lotes com sanitização contra CSV formula injection validado |
| **Ferramenta de migração com verificação** | **IMPLEMENTADO E TESTADO** | `migrate-sqlite-to-mongo.js` aprovado em todos os modos (`preflight` a `verify`) |
| **Ferramenta de rollback para novo SQLite** | **IMPLEMENTADO E TESTADO** | `rollback-mongo-to-sqlite.js` reconstrói SQLite com `foreign_key_check` limpo |
| **Testes E2E com MongoDB real** | **IMPLEMENTADO E TESTADO** | 64 testes Playwright aprovados em todas as resoluções de tela |
| **Build de produção do frontend** | **IMPLEMENTADO E TESTADO** | Vite compilou sem avisos ou erros em 1.04s |
| **Preservação do SQLite original** | **IMPLEMENTADO E TESTADO** | `prisma/dev.db` SHA-256 `15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4` |
| **Conexão ao MongoDB Atlas de Produção** | **PENDENTE DE CONFIGURAÇÃO EXTERNA** | Script `verify-atlas.js` pronto; aguarda URI remota com credenciais |
| **Corte Final e Deploy em Produção** | **PENDENTE DE CONFIGURAÇÃO EXTERNA** | Aguarda agendamento e credenciais do ambiente de hospedagem |
