# TASK 07.3 — Schema MongoDB, Índices e Validators

## 1. Resumo Executivo

A **TASK 07.3** consolidou os resultados técnicos validados no protótipo da TASK 07.2, estabelecendo os artefatos definitivos para a migração do FeedQR para MongoDB com segurança e paridade operacional.

Principais entregas:
- **Schema Prisma MongoDB definitivo** (`prisma/schema.mongo.prisma`), preservando os 8 modelos de negócio, UUIDs como strings em `_id`, enums e relações com `relationMode = "prisma"`, mantendo Prisma 6.19.3.
- **Geração isolada do Prisma Client** em `src/generated/mongo-client`, sem interferir no client SQLite oficial nem no schema original `prisma/schema.prisma`.
- **Manifest versionado de índices e validators** (`src/config/mongo/schemaManifest.js`), incorporando o índice único parcial em `Resposta.idempotencyKey` e esquemas `$jsonSchema` BSON estritos para todas as 8 coleções.
- **Sincronizador seguro** (`scripts/sync-mongodb.js`) com suporte a `--dry-run`, `--apply` e `--verify`, bloqueios de segurança para hosts não autorizados e aborto automático em caso de divergência.
- **Suíte de testes automatizados** (`tests/mongoSync.test.js`) e validação de regressão com 100% dos testes aprovados (52 testes em 8 arquivos).
- **Preservação comprovada do SQLite**: `prisma/dev.db` com hash SHA-256 rigorosamente inalterado.

---

## 2. Arquivos Criados e Modificados

| Arquivo | Status | Descrição |
| :--- | :--- | :--- |
| `prisma/schema.mongo.prisma` | Criado | Schema Prisma definitivo do MongoDB (`provider = "mongodb"`), isolado do SQLite |
| `src/config/mongo/schemaManifest.js` | Criado | Manifest versionado (`v1.0.0`) com as 8 coleções, 20 índices e validators BSON `$jsonSchema` |
| `scripts/sync-mongodb.js` | Criado | Script administrativo de sincronização idempotente e segura (`dry-run`, `apply`, `verify`) |
| `tests/mongoSync.test.js` | Criado | Suíte com 8 testes de conformidade, segurança, índice parcial e integridade BSON |
| `package.json` | Modificado | Adicionados scripts `mongo:generate` e `mongo:sync`; drivers adicionados em `devDependencies` |
| `package-lock.json` | Modificado | Registro de dependências de desenvolvimento do driver MongoDB e memória de teste |
| `.gitignore` | Modificado | Ignorados os diretórios de geração isolada: `src/generated/` e `prototype/generated-client/` |
| `docs/etapa-7-3.md` | Criado | Documento de entrega e relatório técnico da tarefa |

---

## 3. Schema MongoDB Final Proposto

O arquivo `prisma/schema.mongo.prisma` reflete fielmente o modelo relacional do FeedQR adaptado para a semântica de documentos do MongoDB:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/mongo-client"
}

datasource db {
  provider     = "mongodb"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

enum TipoPergunta {
  ESTRELAS
  NPS
  SIM_NAO
  TEXTO
  MULTIPLA_ESCOLHA
}

enum StatusPesquisa {
  RASCUNHO
  ATIVA
  ENCERRADA
}

model Empresa {
  id        String   @id @default(uuid()) @map("_id")
  nome      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  usuarios  Usuario[]
  pesquisas Pesquisa[]
}

model Usuario {
  id        String   @id @default(uuid()) @map("_id")
  empresaId String
  nome      String
  email     String   @unique
  senhaHash String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  empresa Empresa @relation(fields: [empresaId], references: [id], onDelete: Restrict, onUpdate: Restrict)

  @@index([empresaId])
}

model Pesquisa {
  id        String         @id @default(uuid()) @map("_id")
  empresaId String
  titulo    String
  descricao String?
  status    StatusPesquisa @default(RASCUNHO)
  slug      String         @unique
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  empresa      Empresa       @relation(fields: [empresaId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  perguntas    Pergunta[]
  pontosColeta PontoColeta[]
  respostas    Resposta[]

  @@index([empresaId, status])
}

model Pergunta {
  id          String       @id @default(uuid()) @map("_id")
  pesquisaId  String
  texto       String
  tipo        TipoPergunta
  obrigatoria Boolean      @default(true)
  ordem       Int
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  pesquisa  Pesquisa           @relation(fields: [pesquisaId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  opcoes    OpcaoPergunta[]
  respostas RespostaPergunta[]

  @@unique([pesquisaId, ordem])
  @@unique([id, pesquisaId, tipo])
}

model OpcaoPergunta {
  id         String   @id @default(uuid()) @map("_id")
  perguntaId String
  texto      String
  ordem      Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  pergunta  Pergunta           @relation(fields: [perguntaId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  respostas RespostaPergunta[]

  @@unique([perguntaId, ordem])
  @@unique([id, perguntaId])
}

model PontoColeta {
  id         String   @id @default(uuid()) @map("_id")
  token      String   @unique @default(uuid())
  pesquisaId String
  nome       String
  ativo      Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  pesquisa  Pesquisa   @relation(fields: [pesquisaId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  respostas Resposta[]

  @@unique([id, pesquisaId])
  @@index([pesquisaId, ativo])
}

model Resposta {
  id             String   @id @default(uuid()) @map("_id")
  pesquisaId     String
  pontoColetaId  String?
  idempotencyKey String?  // Sem @unique declarativo: gerenciado via índice parcial do MongoDB
  submissionHash String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  pesquisa    Pesquisa           @relation(fields: [pesquisaId], references: [id], onDelete: Restrict, onUpdate: Restrict)
  pontoColeta PontoColeta?       @relation(fields: [pontoColetaId, pesquisaId], references: [id, pesquisaId], onDelete: Restrict, onUpdate: Restrict)
  perguntas   RespostaPergunta[]

  @@unique([id, pesquisaId])
  @@index([pesquisaId, createdAt])
  @@index([pontoColetaId, pesquisaId])
}

model RespostaPergunta {
  id              String       @id @default(uuid()) @map("_id")
  respostaId      String
  pesquisaId      String
  perguntaId      String
  tipo            TipoPergunta
  valorEstrelas   Int?
  valorNps        Int?
  valorSimNao     Boolean?
  valorTexto      String?
  opcaoPerguntaId String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  resposta      Resposta       @relation(fields: [respostaId, pesquisaId], references: [id, pesquisaId], onDelete: Restrict, onUpdate: Restrict)
  pergunta      Pergunta       @relation(fields: [perguntaId, pesquisaId, tipo], references: [id, pesquisaId, tipo], onDelete: Restrict, onUpdate: Restrict)
  opcaoPergunta OpcaoPergunta? @relation(fields: [opcaoPerguntaId, perguntaId], references: [id, perguntaId], onDelete: Restrict, onUpdate: Restrict)

  @@unique([respostaId, perguntaId])
  @@index([respostaId, pesquisaId])
  @@index([perguntaId, pesquisaId, tipo])
  @@index([opcaoPerguntaId, perguntaId])
}
```

### Decisões Técnicas Fundamentais
1. **`Resposta.idempotencyKey` sem `@unique` declarativo:**
   No MongoDB, índices únicos padrão indexam campos com valor `null` ou ausentes como uma chave `null`, rejeitando qualquer segundo documento que contenha `null` (código de erro `11000 E11000 duplicate key error collection`). Como a vasta maioria das respostas públicas não utiliza idempotency key (campo opcional), o `@unique` declarativo do Prisma inviabilizaria respostas anônimas concorrentes. A unicidade é garantida via índice parcial nativo do MongoDB.
2. **`relationMode = "prisma"`:**
   O MongoDB não possui chaves estrangeiras nativas a nível de engine. O Prisma Client gerencia restrições referenciais e validações em cascata na aplicação.
3. **Isolamento de geração:**
   O `output` do generator aponta especificamente para `../src/generated/mongo-client`, garantindo que `@prisma/client` continue consumindo o schema SQLite até a fase de migração da aplicação.

---

## 4. Manifest de Índices e Validators

O arquivo `src/config/mongo/schemaManifest.js` define o estado desejado da infraestrutura MongoDB (`SCHEMA_VERSION = '1.0.0'`).

### Índices Registrados (20 Índices)
Além do índice primário obrigatório `_id_` em cada uma das 8 coleções:
1. `Empresa`:
   - `Empresa_email_key`: `{ email: 1 }` (único)
2. `Usuario`:
   - `Usuario_email_key`: `{ email: 1 }` (único)
   - `Usuario_empresaId_idx`: `{ empresaId: 1 }`
3. `Pesquisa`:
   - `Pesquisa_slug_key`: `{ slug: 1 }` (único)
   - `Pesquisa_empresaId_status_idx`: `{ empresaId: 1, status: 1 }`
4. `Pergunta`:
   - `Pergunta_pesquisaId_ordem_key`: `{ pesquisaId: 1, ordem: 1 }` (único)
   - `Pergunta__id_pesquisaId_tipo_key`: `{ _id: 1, pesquisaId: 1, tipo: 1 }` (único)
5. `OpcaoPergunta`:
   - `OpcaoPergunta_perguntaId_ordem_key`: `{ perguntaId: 1, ordem: 1 }` (único)
   - `OpcaoPergunta__id_perguntaId_key`: `{ _id: 1, perguntaId: 1 }` (único)
6. `PontoColeta`:
   - `PontoColeta_token_key`: `{ token: 1 }` (único)
   - `PontoColeta__id_pesquisaId_key`: `{ _id: 1, pesquisaId: 1 }` (único)
   - `PontoColeta_pesquisaId_ativo_idx`: `{ pesquisaId: 1, ativo: 1 }`
7. `Resposta`:
   - `Resposta__id_pesquisaId_key`: `{ _id: 1, pesquisaId: 1 }` (único)
   - `Resposta_pesquisaId_createdAt_idx`: `{ pesquisaId: 1, createdAt: 1 }`
   - `Resposta_pontoColetaId_pesquisaId_idx`: `{ pontoColetaId: 1, pesquisaId: 1 }`
   - **Índice Único Parcial:**
     `name: 'Resposta_idempotencyKey_partial_key'`
     `key: { idempotencyKey: 1 }`
     `unique: true`
     `partialFilterExpression: { idempotencyKey: { $type: "string" } }`
8. `RespostaPergunta`:
   - `RespostaPergunta_respostaId_perguntaId_key`: `{ respostaId: 1, perguntaId: 1 }` (único)
   - `RespostaPergunta_respostaId_pesquisaId_idx`: `{ respostaId: 1, pesquisaId: 1 }`
   - `RespostaPergunta_perguntaId_pesquisaId_tipo_idx`: `{ perguntaId: 1, pesquisaId: 1, tipo: 1 }`
   - `RespostaPergunta_opcaoPerguntaId_perguntaId_idx`: `{ opcaoPerguntaId: 1, perguntaId: 1 }`

### Validators MongoDB ($jsonSchema)
Todas as 8 coleções possuem validação estrita (`validationLevel: 'strict'`, `validationAction: 'error'`).

#### Compatibilidade Numérica BSON (Descoberta Técnica Essencial)
Durante os testes de integração do Prisma Client com MongoDB, identificou-se que a query engine do Prisma (implementada em Rust) emite números inteiros como BSON `long` (tipo 18 - 64 bits), enquanto o JavaScript nativo gera BSON `double` (IEEE 754) e chamadas explícitas podem gerar BSON `int` (tipo 16 - 32 bits).
Para evitar falhas espúrias de validação (código 121), os campos numéricos foram definidos aceitando a união de tipos:
- Campos inteiros obrigatórios (`ordem`): `bsonType: ['int', 'long', 'double']`
- Campos inteiros anuláveis (`valorEstrelas`, `valorNps`): `bsonType: ['int', 'long', 'double', 'null']`

#### Regras de Negócio Validadas no Engine
- **Enums restritos:**
  - `Pesquisa.status`: `['RASCUNHO', 'ATIVA', 'ENCERRADA']`
  - `Pergunta.tipo` e `RespostaPergunta.tipo`: `['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA']`
- **Limites de valores:**
  - `valorEstrelas`: `minimum: 1, maximum: 5`
  - `valorNps`: `minimum: 0, maximum: 10`
  - `ordem`: `minimum: 0`
- **Exclusividade e consistência por tipo via `oneOf` em `RespostaPergunta`:**
  - `ESTRELAS`: exige `valorEstrelas` (1..5) e obriga `valorNps`, `valorSimNao`, `valorTexto`, `opcaoPerguntaId` a serem `null`.
  - `NPS`: exige `valorNps` (0..10) e obriga os demais a serem `null`.
  - `SIM_NAO`: exige `valorSimNao` (booleano) e obriga os demais a serem `null`.
  - `TEXTO`: exige `valorTexto` (string) e obriga os demais a serem `null`.
  - `MULTIPLA_ESCOLHA`: exige `opcaoPerguntaId` (string) e obriga os demais a serem `null`.

#### Limitações Intrínsecas dos Validators de Coleção
Os validators do MongoDB são executados no escopo do documento individual da respectiva coleção. Portanto, as seguintes restrições **não podem** ser validadas por validators MongoDB nativos e permanecem sob responsabilidade do Prisma e da camada de aplicação:
1. **Chaves estrangeiras entre coleções distintas** (ex: garantir que `pesquisaId` em `Pergunta` referencia uma `Pesquisa` existente).
2. **Consistência cruzada de tipo** (ex: garantir que a pergunta referenciada por `perguntaId` possui o mesmo `tipo` declarado em `RespostaPergunta`).
3. **Consistência cruzada de opções** (ex: garantir que a opção referenciada por `opcaoPerguntaId` pertence à pergunta referenciada por `perguntaId`).

---

## 5. Funcionamento do Sincronizador Seguro

O script `scripts/sync-mongodb.js` atua como ferramenta administrativa de governança do schema no MongoDB.

### Controles de Segurança Implementados
1. **Sanitização de credenciais:**
   A função `sanitizeMongoUri` mascara senhas e nomes de usuário em todas as mensagens de log, relatórios e saídas de erro (`mongodb://***:***@cluster.mongodb.net/...`).
2. **Proteção contra escrita acidental em bancos remotos:**
   Por padrão, conexões a hosts diferentes de `localhost`, `127.0.0.1` ou `::1` são sumariamente bloqueadas. O sincronizador só permite execução contra banco remoto se a flag explícita `--allow-remote` for informada ou a variável de ambiente `ALLOW_REMOTE_SYNC=true` estiver ativa.
3. **Proteção de bancos reservados:**
   Tentativas de sincronização apontando para bancos reservados do MongoDB (`admin`, `local`, `config`) ou sem banco definido são abortadas imediatamente.
4. **Proteção contra destruição:**
   O sincronizador **nunca remove** coleções, documentos ou índices existentes.
5. **Aborto imediato em caso de divergência:**
   Se uma coleção ou índice já existir com configurações divergentes (ex.: `unique` diferente ou chave distinta), o processo é imediatamente interrompido com erro explicativo, evitando recriação cega ou corrupção de índices.
6. **Não execução automática de `prisma db push`:**
   O sincronizador opera diretamente via driver oficial `mongodb`, garantindo que partial indexes e validators BSON sejam aplicados de forma reprodutível e determinística.

### Modos de Operação

```bash
# Modo 1: Apenas inspeciona e exibe diferenças sem alterar o banco
node scripts/sync-mongodb.js --dry-run

# Modo 2: Cria somente coleções, índices e validators ausentes (idempotente)
node scripts/sync-mongodb.js --apply

# Modo 3: Verifica se o banco real está 100% aderente ao manifest (código 0 se ok, 1 se divergente)
node scripts/sync-mongodb.js --verify
```

---

## 6. Resultados dos Testes Obrigatórios

### 1. Testes do Sincronizador e MongoDB (`tests/mongoSync.test.js`)
Executados sobre MongoDB replica set efêmero (`mongodb-memory-server`):

| Teste | Cenário Validado | Resultado |
| :--- | :--- | :--- |
| **Test 1** | Proteção de segurança contra host remoto sem flag e bloqueio de bancos reservados | **PASS** |
| **Test 2** | Modo `dry-run` relata coleções e índices faltantes sem aplicar nenhuma mutação no banco | **PASS** |
| **Test 3** | Modo `apply` cria as 8 coleções, 20 índices e validators com sucesso | **PASS** |
| **Test 4** | Idempotência do `apply`: reexecução consecutiva não gera alterações nem erros | **PASS** |
| **Test 5** | Modo `verify` confirma conformidade perfeita e aborta se houver divergência | **PASS** |
| **Test 6** | Índice parcial de `idempotencyKey`: permite múltiplos `null`/ausentes e rejeita duplicatas de string | **PASS** |
| **Test 7** | Validators MongoDB: rejeitam notas inválidas (<1 ou >5 em estrelas, <0 ou >10 em NPS), enums desconhecidos e violações de exclusividade de tipo | **PASS** |
| **Test 8** | Integração com Prisma Client MongoDB: geração do client, escrita relacional aninhada (`empresa -> pesquisa -> pergunta`), persistência de resposta com `idempotencyKey` única e duplicidade rejeitada | **PASS** |

### 2. Testes de Regressão SQLite da Aplicação
A execução de `npm test` confirmou que toda a suíte de testes original do FeedQR segue 100% verde:
```
Test Files  8 passed (8)
     Tests  52 passed (52)
  Duration  18.41s
```
Arquivos validados:
- `tests/api.test.js` (17 testes) — PASS
- `tests/mongoSync.test.js` (8 testes) — PASS
- `tests/publicResponse.test.js` (6 testes) — PASS
- `tests/dev.test.js` (1 teste) — PASS
- `tests/analytics.test.js` (5 testes) — PASS
- `tests/syntheticBaseline.test.js` (3 testes) — PASS
- `tests/migration.test.js` (1 teste) — PASS
- `tests/csv.test.js` (11 testes) — PASS

---

## 7. Confirmação de Preservação do SQLite

Conforme exigido pelas restrições da tarefa:
1. **Banco SQLite:** `prisma/dev.db` permaneceu intocado.
   - Hash SHA-256 verificado: `15207B88446F8BE4A86E9DEFAB2995BD444980CE52153A64BF538AAEF57500C4`
   - Status: Rigorosamente idêntico ao snapshot de referência da TASK 07.1.
2. **Schema SQLite:** `prisma/schema.prisma` não foi alterado.
3. **Snapshots de backup:** O diretório `backups/` permanece íntegro e intocado.
4. **Aplicação Principal:** Nenhuma rota, service, controller ou componente do frontend foi modificado.

---

## 8. Limitações e Riscos Remanescentes

1. **Dependência de Replica Set no MongoDB:**
   Tanto em desenvolvimento local quanto em produção (Atlas), transações inter-documentos do Prisma e operações com change streams exigem MongoDB configurado como Replica Set (não operam em single standalone sem replica set).
2. **Bloqueio de Arquivos Binários no Windows:**
   Durante a regeneração do Prisma Client no Windows, se existirem processos Node.js ativos com o client carregado na memória, a engine nativa `query_engine-windows.dll.node` pode gerar `EPERM` por lock do sistema operacional. Para regenerar, processos anteriores devem ser devidamente encerrados.
3. **Migração de Dados (TASK 07.4):**
   Os dados históricos do SQLite possuem timestamps e referências de UUID string que devem ser convertidos respeitando os formatos BSON (`Date` para timestamps e `string` para UUIDs) para que passem com 100% de sucesso pelos validators BSON recém-implantados.

---

## 9. Recomendação para Avançar à TASK 07.4

Com o schema Prisma definitivo pronto, o Prisma Client MongoDB gerado e testado em isolamento, o manifest de índices e validators validado, e o sincronizador seguro aprovado em todos os testes de idempotência e segurança:

> **Recomendação:** A infraestrutura de schema e integridade do MongoDB está aprovada e pronta para a **TASK 07.4 — Migração de dados SQLite para MongoDB, verificação de paridade e integridade**.
