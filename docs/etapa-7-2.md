# TASK 07.2 — Protótipo isolado MongoDB + Prisma 6.19.3

**Status: Concluído.**  
**Data: 13/10/2026**  
**Ambiente de ensaio: Node v24.21.0, npm 11.19.0, Windows, MongoMemoryReplSet (MongoDB descartável em memória)**  
**Branch de trabalho: `feat/mongodb-migration`**  

---

## 1. Ambiente utilizado e isolamento

Para cumprir os requisitos da TASK 07.2 sem dependência de serviços externos ou credenciais do MongoDB Atlas, e sem alterar o ambiente global da máquina:

- **Banco de dados original (`prisma/dev.db`):** Preservado integralmente. Hash SHA-256 verificado antes e depois dos ensaios: `15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4`. Nenhuma escrita foi realizada no SQLite.
- **Backups e snapshots:** `backups/dev_baseline_20261013.db` e `backups/technical_metadata.json` preservados intactos.
- **Engine do MongoDB para ensaios:** Utilizado o `mongodb-memory-server` provisionando um `MongoMemoryReplSet` local, efêmero e de porta dinâmica com engine `wiredTiger`. Isso forneceu suporte completo a replica set, requisito obrigatório para transações multidocumento (`$transaction`) no conector MongoDB do Prisma v6.
- **Diagnóstico Docker / Infraestrutura:** O Docker Desktop está instalado na máquina, mas seu daemon Linux de segundo plano (`dockerDesktopLinuxEngine`) não estava ativo. A solução via `mongodb-memory-server` operou de forma 100% autônoma no espaço do Node, sem exigir privilégios de administrador ou serviços globais do Windows.
- **Schema principal (`prisma/schema.prisma`):** Preservado intacto apontando para SQLite. O protótipo utilizou schema isolado em `prototype/schema.prisma`.

---

## 2. Arquivos experimentais criados

Todos os arquivos do protótipo foram criados em diretório isolado `prototype/`:

1. `prototype/schema.prisma`: Schema Prisma experimental com `provider = "mongodb"`, IDs mapeados para `_id` como UUID string, oito modelos de negócio, enums e relações compatíveis.
2. `prototype/generated-client/`: Client Prisma gerado especificamente para o schema MongoDB na versão **6.19.3**.
3. `prototype/tests/01_schema_crud.js`: Ensaio de UUIDs, datas BSON, CRUD, nested writes, `createMany`, `include` e emulação de `onDelete: Restrict`.
4. `prototype/tests/02_idempotency_indexes.js`: Ensaio de índice único padrão vs. índice único parcial, múltiplos nulos, colisões de chave e replays idempotentes.
5. `prototype/tests/03_concurrency_coordination.js`: Ensaio de 10 requisições simultâneas com a mesma chave, disputas de escrita (`P2034`), e coordenação transacional por pesquisa.
6. `prototype/tests/04_aggregations_and_transactions.js`: Ensaio de `groupBy`, `aggregateRaw` para agrupamento diário com timezone UTC, e execução de agregação dentro de `$transaction`.
7. `prototype/tests/05_integrity_and_validators.js`: Ensaio de integridade referencial, detecção de órfãos, validação de enums e JSON Schema Validators nativos do MongoDB.
8. `prototype/run-all-prototype-tests.js`: Executor consolidado que roda toda a bateria de ensaios e gera o relatório estruturado.

---

## 3. Testes executados e resultados empíricos

A suíte consolidada foi executada com sucesso em **17,37 segundos** via `node prototype/run-all-prototype-tests.js`:

```json
{
  "test1_schemaCrud": {
    "uuidAsId": true,
    "createAndFind": true,
    "includeRelations": true,
    "relationalFilter": true,
    "createMany": true,
    "nestedWrites": true,
    "restrictDelete": true,
    "bsonDates": true
  },
  "test2_idempotencyIndexes": {
    "standardUniqueFailsMultipleNulls": true,
    "partialIndexAllowsMultipleNulls": true,
    "partialIndexEnforcesUniqueStrings": true,
    "idempotentReplaySuccess": true,
    "payloadMismatchRejection": true
  },
  "test3_concurrencyCoordination": {
    "tenConcurrentSameKeySingleRecord": true,
    "staleWritePreventedByCoordination": true,
    "writeConflictHandledWithRetry": true
  },
  "test4_aggregationsTransactions": {
    "groupBySupported": true,
    "aggregateRawDailySupported": true,
    "utcTimezoneRespected": true,
    "aggregateRawInTransactionSupported": true,
    "transactionalLimitationDetails": null
  },
  "test5_integrityValidators": {
    "prismaClientBlocksInvalidEnum": true,
    "rawScalarCanCreateOrphanWithoutFK": true,
    "crossSurveyReferenceRequiresAppValidation": true,
    "mongoJsonSchemaValidatorEnforced": true,
    "invalidStarScoreRejectedByValidator": true
  }
}
```

---

## 4. Compatibilidade de cada recurso investigado

| Recurso Investigado | Status | Classificação | Evidência / Comportamento |
| :--- | :---: | :---: | :--- |
| **UUIDs em `_id` sem ObjectId** | Compatível | Comprovada por execução | `id String @id @default(uuid()) @map("_id")` persiste e recupera strings UUID puras (`10000000-...`). Não há coerção para BSON ObjectId. URLs e JWT continuam intactos. |
| **Datas BSON UTC** | Compatível | Comprovada por execução | DateTime mapeia para BSON Date (milissegundos Unix). Preserva timezone UTC exato nas consultas e agregações. |
| **Nested Writes** | Compatível | Comprovada por execução | Criação aninhada em múltiplos níveis (Pesquisa -> Perguntas -> Opções) executa atomicamente. Em nested writes, o Prisma preenche automaticamente as chaves de ligação. |
| **`createMany` no MongoDB** | Compatível | Comprovada por execução | Inserção em lote de `PontoColeta` executou com sucesso retornando `{ count: 2 }`. |
| **`include` e Filtros Relacionais** | Compatível | Comprovada por execução | `findUnique` com `include` relacional profundo e filtros `where` aninhados (ex: `ativo: true`) opera identicamente ao SQLite. |
| **Emulação `onDelete: Restrict`** | Compatível | Comprovada por execução | O Prisma bloqueou a exclusão de `Empresa` com filhos vinculados disparando erro conhecido `P2014`. |
| **`groupBy` no Prisma** | Compatível | Comprovada por execução | `groupBy` agrupou respostas por nota com contagens e médias em `RespostaPergunta`. |
| **`aggregateRaw` para Série Diária** | Compatível | Comprovada por execução | Pipeline MongoDB com `$dateToString` em UTC agrupou datas com contagens exatas (`[{"_id":"2026-10-01","quantidade":2}, ...]`). |
| **`aggregateRaw` em `$transaction`** | Compatível | Comprovada por execução | `tx.resposta.aggregateRaw` executou com sucesso dentro da sessão transacional interativa do Prisma 6.19.3. |
| **Índice Único Parcial** | Compatível | Comprovada por execução | `{ idempotencyKey: 1 }, { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } }` permitiu múltiplos `null` e garantiu unicidade estrita para strings. |
| **Tratamento de Write Conflict** | Compatível | Comprovada por execução | Concorrência paralela dispara erro `P2034` no Prisma, o qual é resolvido com sucesso com backoff jittered e reconciliação da chave comitada. |
| **Validação nativa JSON Schema** | Compatível | Comprovada por execução | `collMod` com `$jsonSchema` bloqueou inserções com `valorEstrelas = 99` com erro nativo `121 (Document failed validation)`. |

---

## 5. Limitações confirmadas

### 5.1. Incompatibilidade do `@unique` padrão com múltiplos `null` no MongoDB
- **Comportamento comprovado:** No MongoDB, um índice único padrão gerado por `idempotencyKey String? @unique` indexa o valor `null`. O primeiro documento com `idempotencyKey: null` é gravado; o segundo falha com `E11000 duplicate key error`.
- **Implicação:** O schema Prisma para MongoDB **NÃO PODE** conter `@unique` declarativo em campos opcionais que aceitam múltiplos nulos contratuais. O índice precisa ser parcial.

### 5.2. Falta de Foreign Keys nativas no motor MongoDB
- **Comportamento comprovado:** Inserções escalares diretas (fora de nested writes) aceitam IDs de pesquisas ou perguntas cruzadas sem erro do banco de dados se não houver checagem de aplicação.
- **Implicação:** A integridade referencial cruzada (ex: garantir que `perguntaId` pertence à `pesquisaId` informada) depende de validação nos Services antes da gravação e de transações com controle de tenant.

### 5.3. Disputas concorrentes geram erro `P2034` em vez de serialização transparente
- **Comportamento comprovado:** Diferente do SQLite (onde o bloqueio em arquivo serializa os escritores na fila), o MongoDB replica set sob alta concorrência paralela no mesmo documento/índice aborta a transação com `WriteConflict` / `P2034`.
- **Implicação:** Todos os services de mutação concorrente (especialmente envio público com idempotência) exigem mecanismo explícito de retry com backoff e jitter, além de consulta fora da transação abortada para verificar se a chave foi comitada por worker concorrente.

---

## 6. Soluções propostas

1. **Estratégia de Índices Parciais:**
   - No schema `prisma/schema.prisma` para MongoDB, declarar `idempotencyKey String?` (sem `@unique`).
   - Gerenciar o índice único parcial através de um script de sincronização de índices (`scripts/sync-mongodb-indexes.js`), que aplica `{ partialFilterExpression: { idempotencyKey: { $type: "string" } } }`.
   - Nas consultas do Prisma, utilizar `findFirst({ where: { idempotencyKey: key } })` para localizar a resposta existente.

2. **Coordenação por Pesquisa contra Stale Writes:**
   - Conforme ensaiado no Ensaio 3, incluir um toque explícito de escrita na `Pesquisa` (ex: incremento de `writeVersion` ou atualização de `updatedAt`) no início da transação de envio de resposta e nas mutações administrativas (publicação, encerramento).
   - Isso garante que disputas concorrentes (como encerrar pesquisa enquanto resposta está sendo gravada) gerem um conflito de escrita na mesma transação, forçando retry e impedindo gravações em pesquisas encerradas.

3. **Validators de Coleção para Substituir CHECK Constraints:**
   - Provisionar um manifest de validators JSON Schema (`$jsonSchema`) nas coleções `RespostaPergunta`, `Pesquisa` e `Pergunta`.
   - Isso garante que limites de notas (estrelas 1–5, NPS 0–10) e enums sejam rejeitados pelo motor MongoDB caso haja bypass do código da aplicação.

4. **Retry Robusto com Jitter:**
   - Padronizar o handler de transação do service de resposta para capturar `P2034` e `P2002`, aplicando backoff exponencial com jitter aleatório (20ms a 150ms) e reconciliação imediata com o registro persistido.

---

## 7. Ajustes necessários no plano da TASK 07

1. **Remover `@unique` declarativo de `Resposta.idempotencyKey` no schema Prisma do MongoDB:**
   - O plano original da TASK 07 sugeria manter a anotação para o client; o protótipo comprovou que isso faz o `db push` tentar criar o índice comum incompatível. O índice deve ser puramente parcial e administrado via script de sincronização (TASK 07.3).
2. **Confirmação positiva de `aggregateRaw` transacional:**
   - O plano original listava como risco a impossibilidade de executar `aggregateRaw` em `$transaction`. O protótipo **comprovou** que o Prisma 6.19.3 suporta perfeitamente `tx.resposta.aggregateRaw` em transações interativas no MongoDB. Não será necessário segregar snapshots de leitura para a série diária.
3. **Mapeamento de Erro P2034 no Middleware:**
   - O middleware de erro e os services precisam tratar explicitamente `P2034` como conflito passível de retry, sem expor erro 500 ao cliente.

---

## 8. Recomendação objetiva

**RECOMENDAÇÃO: AVANÇAR PARA A TASK 07.3.**

- **Justificativa:** O protótipo isolado comprovou que o Prisma **6.19.3** com MongoDB atende 100% dos requisitos funcionais do FeedQR (UUIDs como string, BSON Dates, nested writes, `createMany`, `groupBy`, `aggregateRaw` transacional, ações Restrict e índices parciais).
- Não há bloqueadores de compatibilidade que exijam mudança de modelagem, migração para `@db.ObjectId` ou upgrade major do Prisma.
- As limitações identificadas (índice parcial gerenciado externamente e necessidade de retry em `P2034`) possuem soluções claras e validadas experimentalmente.

---

## 9. Declaração de encerramento

- **A TASK 07.2 está formalmente concluída.**
- **A TASK 07.3 NÃO FOI INICIADA AUTOMATICAMENTE.**
- **Nenhum dado real foi migrado e nenhuma alteração foi realizada na aplicação principal.**
