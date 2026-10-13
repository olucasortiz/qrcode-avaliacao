# TASK 07 — Plano SQLite → MongoDB Atlas com preservação integral

**Status: planejamento; implementação, migração e deploy aguardam aprovação.**

A migração é viável mantendo Prisma **6.19.3**, oito coleções e UUIDs como strings. Não é uma simples troca de DATABASE_URL: índices opcionais, integridade, concorrência, SQL de agregação, preparação de testes e procedimentos de operação precisam de adequação.

Recomendação: preservar a estrutura normalizada, realizar ensaios em destinos descartáveis e usar uma janela de manutenção na conversão final. Não adotar gravação simultânea independente em SQLite e MongoDB: isso criaria um problema adicional de consistência entre dois bancos.

## 1. Escopo e método desta auditoria

- Inspeção em **13/10/2026**, no checkout `C:\qrcode-avaliacao`, branch `main`, commit `2bc755c05d28ff79a7f68222662bfd119f6ac9d8`.
- Consultados AGENTS.md, schema, migrations, código de API, contratos, testes, configurações e documentação das etapas anteriores, incluindo a TASK 06.
- Banco aberto com `new DatabaseSync('prisma/dev.db', { readOnly: true })`. Consultas de inventário executadas em transações de leitura encerradas com ROLLBACK; somente SELECT e PRAGMA de inspeção.
- Não foram executados migrations, db push, db pull, reset, seeds, testes que provisionam bancos, instalação de dependências ou conexão ao Atlas. Nenhuma coleção foi criada.
- Nenhuma credencial, hash de senha, token de coleta ou informação pessoal foi impressa. Foram retornados apenas metadados, contagens e resultados agregados de validação.
- Único arquivo criado nesta tarefa: este relatório. `docs/etapa-6.md` já estava não versionado no início e foi preservado.

**Verificado por execução nesta tarefa:** inventário do SQLite, integridade, checksums de migrations, tipos físicos de timestamps, formato de IDs e hash do arquivo. **Verificado por inspeção/documentação:** mapa de código e viabilidade dos recursos do conector. **Pendente:** compilar o schema proposto, exercitar Prisma 6.19.3 contra replica set/Atlas, medir desempenho e executar migração/rollback em ensaio. Resultados de testes da TASK 06 não são evidência de funcionamento em MongoDB.

## 2. Inventário do SQLite existente

Arquivo encontrado: `prisma/dev.db`, **176.128 bytes**. A busca no workspace, excluindo node_modules e Git, não encontrou outro banco SQLite ou sidecar de banco. Isso não inventaria bancos fora do workspace.

### Tabelas e quantidades

| Tabela | Registros | Destinação planejada |
| --- | ---: | --- |
| Empresa | 1 | Coleção Empresa |
| Usuario | 1 | Coleção Usuario |
| Pesquisa | 1 | Coleção Pesquisa |
| Pergunta | 5 | Coleção Pergunta |
| OpcaoPergunta | 0 | Coleção OpcaoPergunta, mesmo vazia |
| PontoColeta | 0 | Coleção PontoColeta, mesmo vazia |
| Resposta | 0 | Coleção Resposta, mesmo vazia |
| RespostaPergunta | 0 | Coleção RespostaPergunta, mesmo vazia |
| `_prisma_migrations` | 4 | Preservar integralmente no snapshot e arquivo técnico de auditoria; não é coleção de negócio MongoDB |
| `sqlite_sequence` | 0 | Metadado interno legado, preservado no snapshot; não é coleção de negócio |

**Total: 8 registros de negócio e 4 registros de histórico técnico.** São dez tabelas físicas, incluindo as duas técnicas. Não há views nem triggers. Há **29 índices**, contando PKs e o índice da tabela de migrations.

As perguntas existentes são quatro ESTRELAS e uma TEXTO. O banco atual não possui exemplos reais de NPS, SIM_NAO, MULTIPLA_ESCOLHA, coleta por ponto ou idempotência. Esses cenários exigem fixtures sintéticas completas; tabelas vazias não permitem concluir que a conversão desses dados já foi validada.

### Identificação, tipos e campos opcionais

| Modelo | Campos de negócio a preservar, além de id/createdAt/updatedAt |
| --- | --- |
| Empresa | nome, email |
| Usuario | empresaId, nome, email, senhaHash |
| Pesquisa | empresaId, titulo, descricao?, status, slug |
| Pergunta | pesquisaId, texto, tipo, obrigatoria, ordem |
| OpcaoPergunta | perguntaId, texto, ordem |
| PontoColeta | token, pesquisaId, nome, ativo |
| Resposta | pesquisaId, pontoColetaId?, idempotencyKey?, submissionHash? |
| RespostaPergunta | respostaId, pesquisaId, perguntaId, tipo, valorEstrelas?, valorNps?, valorSimNao?, valorTexto?, opcaoPerguntaId? |

- Todos os IDs de negócio e referências preenchidas examinadas têm formato UUID válido. Não é necessário regenerá-los nem criar mapa de IDs novos.
- Os **16 timestamps preenchidos** de negócio são INTEGER, compatíveis com milissegundos Unix e com conversão para Date. O conversor também deve tratar timestamps textuais legados de forma explícita em fixtures; formato desconhecido deve interromper a operação.
- Booleanos estão representados pelo SQLite como 0/1. Não foram encontrados valores fora desse domínio.
- `Pesquisa.descricao` não é nula no registro existente. Os outros campos opcionais pertencem a tabelas vazias; não há valores para caracterizar nelas.
- Não existe campo `Json` em nenhum dos oito modelos. A migração não deve trocar os campos tipados de respostas por um JSON genérico. Se um campo Json for necessário no futuro, terá contrato e validação próprios.
- O campo de senha existente não está vazio. Seu conteúdo não foi exibido; migração deve copiá-lo exatamente, sem rehash, alteração ou tentativa de recuperar senha em texto.

### Relações e integridade

Todas as dez constraints FK atuais usam **ON DELETE RESTRICT / ON UPDATE RESTRICT**:

| Filho | Referência |
| --- | --- |
| Usuario | empresaId → Empresa.id |
| Pesquisa | empresaId → Empresa.id |
| Pergunta | pesquisaId → Pesquisa.id |
| OpcaoPergunta | perguntaId → Pergunta.id |
| PontoColeta | pesquisaId → Pesquisa.id |
| Resposta | pesquisaId → Pesquisa.id |
| Resposta | (pontoColetaId, pesquisaId) → PontoColeta.(id, pesquisaId), quando há ponto |
| RespostaPergunta | (respostaId, pesquisaId) → Resposta.(id, pesquisaId) |
| RespostaPergunta | (perguntaId, pesquisaId, tipo) → Pergunta.(id, pesquisaId, tipo) |
| RespostaPergunta | (opcaoPerguntaId, perguntaId) → OpcaoPergunta.(id, perguntaId), quando há opção |

`PRAGMA integrity_check`: **ok**. `PRAGMA foreign_key_check`: **zero violações**. Consultas adicionais não encontraram divergências de pesquisa/origem/pergunta/opção/tipo, pares de idempotência incompletos ou booleanos inválidos. Checks relativos a respostas/opções/pontos são limitados pelo fato de essas tabelas estarem vazias.

Constraints CHECK atuais também impõem enums de Pesquisa/Pergunta e a exclusividade/tipo dos valores em RespostaPergunta: estrelas 1–5, NPS 0–10, booleano, texto ou referência a opção; os campos dos outros tipos ficam nulos. Preservar essas regras no MongoDB é requisito, não otimização.

### Índices atuais

Cada tabela de negócio tem PK única em id. Outros índices:

| Modelo | Únicos | Não únicos |
| --- | --- | --- |
| Empresa | email | — |
| Usuario | email | empresaId |
| Pesquisa | slug | (empresaId, status) |
| Pergunta | (pesquisaId, ordem); (id, pesquisaId, tipo) | — |
| OpcaoPergunta | (perguntaId, ordem); (id, perguntaId) | — |
| PontoColeta | token; (id, pesquisaId) | (pesquisaId, ativo) |
| Resposta | idempotencyKey, permitindo múltiplos NULL; (id, pesquisaId) | (pesquisaId, createdAt); (pontoColetaId, pesquisaId) |
| RespostaPergunta | (respostaId, perguntaId) | (respostaId, pesquisaId); (perguntaId, pesquisaId, tipo); (opcaoPerguntaId, perguntaId) |

Emails de empresa e usuário e slugs/tokens são únicos globalmente, não por empresa. Não mudar essa semântica durante a migração. Não adicionar collation case-insensitive implicitamente; preservar comparação e normalização atuais.

### Histórico aplicado

| Migration | Situação | Comparação com arquivo versionado |
| --- | --- | --- |
| `20261007220806_init` | Concluída, 1 etapa, sem rollback | SHA-256 coincide |
| `20261007221304_expandir_modelos` | Concluída, 1 etapa, sem rollback | SHA-256 coincide |
| `20261007221725_ponto_token` | Concluída, 1 etapa, sem rollback | SHA-256 coincide |
| `20261008120000_resposta_idempotencia` | Concluída, 1 etapa, sem rollback | SHA-256 coincide |

As duas migrations intermediárias recriam tabelas; a última acrescenta idempotência. Nenhuma será reaplicada ao original nesta migração. Manter arquivos SQL e histórico para caracterização e rollback SQLite.

Hash do arquivo antes/depois das leituras: **idêntico**, SHA-256 `15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4`. Esse é hash de integridade do arquivo, não hash de senha.

## 3. Modelo proposto: oito coleções, UUIDs preservados

Manter os nomes das coleções iguais aos modelos: Empresa, Usuario, Pesquisa, Pergunta, OpcaoPergunta, PontoColeta, Resposta e RespostaPergunta. Não incorporar perguntas/opções/respostas em arrays de Pesquisa nesta etapa. A estrutura normalizada preserva consultas, evita arrays que crescem indefinidamente e reduz a superfície de alterações.

Em cada modelo, a representação conceitual do ID será:

```prisma
id String @id @default(uuid()) @map("_id")
```

É uma proposta para implementação futura, não uma alteração feita no schema. **Sem `@db.ObjectId` e sem `@default(auto())`**. `_id` será a mesma string UUID atual; Prisma continuará expondo `id`. Todas as referências permanecem String, assim como token e Idempotency-Key. Isso conserva validators UUID, JWT.sub, URLs administrativas, slugs, links QR e chaves antigas. O suporte a UUID como ID sem ObjectId está na [referência de schema do Prisma v6](https://www.prisma.io/docs/orm/v6/reference/prisma-schema-reference#uuid).

| Coleção | Modelagem proposta | Índices/integridade essenciais |
| --- | --- | --- |
| Empresa | Um documento por empresa, sem usuários/pesquisas embutidos | `_id` e email únicos |
| Usuario | Um documento por usuário, empresaId string; senhaHash preservado | email global único; índice empresaId; referência existente obrigatória |
| Pesquisa | Documento com empresaId, status, slug e descrição opcional | slug global único; (empresaId, status); apenas transições atuais |
| Pergunta | Documento com pesquisaId, tipo, ordem e obrigatoriedade | (pesquisaId, ordem) único; tipo/ordem validados |
| OpcaoPergunta | Documento separado com perguntaId e ordem | (perguntaId, ordem) único; opção vinculada à pergunta correta |
| PontoColeta | Documento com pesquisaId, token imutável e ativo | token global único; (pesquisaId, ativo); não excluir ponto respondido |
| Resposta | Documento de avaliação com origem opcional e par chave/hash | índice único **parcial** para chave; índices de período/origem; relação com pesquisa |
| RespostaPergunta | Documento por pergunta respondida, mesmos campos tipados | (respostaId, perguntaId) único; índices de referências; validação de pesquisa, pergunta, tipo e opção |

Manter inicialmente os índices compostos com id presentes no SQLite e as relações compostas do schema, quando aceitos/exercitados pelo Prisma 6.19.3. Embora alguns índices sejam redundantes com `_id` único, removê-los agora não é necessário. O gate inicial validará schema, includes, filtros e ações referenciais dessas relações. Se houver limitação concreta do conector, o fallback delimitado será referenciar somente id na relação Prisma, **preservando todos os scalars** de pesquisa/tipo e validando suas igualdades explicitamente. Não confundir `@@unique` com `@@id`: o segundo não é suportado pelo conector MongoDB. Relações por referências são documentadas em [Prisma v6 — relações](https://www.prisma.io/docs/orm/v6/prisma-schema/data-model/relations).

### Tipos, opcionais e datas

- DateTime → **BSON Date UTC**, preservando os mesmos milissegundos. Não usar BSON Timestamp, datas string ou horário local. BSON Date representa milissegundos Unix; Timestamp é outro tipo, destinado a usos internos. [Tipos BSON](https://www.mongodb.com/docs/manual/reference/bson-types/#date).
- Boolean → BSON bool; converter 0/1 explicitamente, preservando false. Int de notas/ordem → inteiro BSON compatível, sem arredondamento silencioso.
- Texto e enums → strings idênticas, sem trim, recodificação de conteúdo ou renomeação durante importação.
- Opcionais históricos → null explícito, mantendo distinção de false/0/string vazia. A aplicação também deve aceitar campo ausente como equivalente contratual a null nos opcionais; filtros precisam tratar ausência quando pertinente.
- `createdAt`/`updatedAt` são informados explicitamente na importação. Defaults e `@updatedAt` não podem substituí-los. Campos internos novos devem ficar fora dos DTOs e da comparação dos campos históricos.

### Índice de idempotência: decisão obrigatória

O `idempotencyKey String? @unique` atual não pode virar um índice MongoDB único comum: esse índice aceita apenas uma entrada null/ausente. O contrato permite várias respostas sem chave. Um índice sparse também não resolve múltiplos null explícitos. [Índices únicos MongoDB](https://www.mongodb.com/docs/manual/core/index-unique/).

Proposta: índice único nomeado sobre `Resposta.idempotencyKey`, com `partialFilterExpression: { idempotencyKey: { $type: 'string' } }`. Validar que strings presentes são UUIDs válidos; null/ausência ficam fora da unicidade, preservando o contrato. Não gerar chaves artificiais para registros sem chave nem usar TTL para apagar respostas/chaves. [Índices parciais MongoDB](https://www.mongodb.com/docs/manual/core/index-partial/).

Prisma 6.19.3 não deve ser tratado como gerenciador declarativo desse índice parcial. Manter a unicidade lógica necessária à API do client, incluindo `findUnique` se validado no protótipo, e materializar o índice parcial via manifest/script controlado. A correspondência de nomes e comportamento deve ser testada. **Não executar db push automaticamente**, pois ele pode criar/reconciliar um índice comum incompatível com esta política.

## 4. Integridade, transações e concorrência

MongoDB não oferece FKs entre essas coleções. O modo de relações é `prisma`; ações Restrict podem ser emuladas, mas a emulação não cobre inserts escalares como uma FK nativa nem operações raw. Deve haver verificações próprias para escrita e auditoria de órfãos. [Prisma v6 — relation mode](https://www.prisma.io/docs/orm/v6/prisma-schema/data-model/relations/relation-mode).

**Regras a manter:** empresa sempre obtida do usuário autenticado no banco; parent pertencente à empresa; perguntas/opções somente no rascunho; publicação válida; encerramento somente de ativa; resposta somente à ativa/ponto válido; pergunta/opção do mesmo contexto; uma resposta por pergunta; exclusões protegidas; valores tipados e nenhum registro parcial.

Usar transações multidocumento no replica set, inclusive para cadastro e nested writes. O conector v6 e a necessidade de replica set estão documentados no [Prisma MongoDB v6](https://www.prisma.io/docs/orm/v6/overview/databases/mongodb). Manter `prisma` e `@prisma/client` fixados em **6.19.3** nesta tarefa; não misturar migração de banco com upgrade major do ORM.

Há **14 callbacks `$transaction`** atualmente. Mantê-los não garante, sozinho, as mesmas propriedades da serialização de escritores SQLite. Exemplo de risco: uma transação lê pesquisa ATIVA e insere resposta, enquanto outra encerra a pesquisa; só a segunda escreve Pesquisa. Também há concorrência entre edição/publicação e exclusão de ponto/envio.

Proposta de coordenação pequena: todas as mutações ligadas à mesma pesquisa efetuam uma **escrita real no documento Pesquisa dentro da mesma transação**, antes de validar/gravar filhos. Preferir contador interno `writeVersion` incrementado, sem alterar timestamps de negócio em operações que apenas coordenam, e excluído de todos os DTOs. Não basta fazer update com o mesmo valor. A implementação exata é gate de protótipo; caso o Prisma acrescente `updatedAt`, preservá-lo explicitamente no toque de coordenação. O comportamento de stale reads/write conflicts e a aquisição de lock por escrita estão descritos em [transações MongoDB](https://www.mongodb.com/docs/manual/core/transactions-production-consideration/).

Essa coordenação serializa somente alterações da mesma pesquisa, com custo de contenção a medir. Inclui editar/excluir perguntas/opções, criar/alterar/excluir pontos, publicar/encerrar/excluir pesquisa e primeiro envio de resposta. Confirmação de uma chave já persistida pode continuar retornando sucesso sem revalidar pesquisa encerrada, conforme comportamento atual.

Idempotência deve combinar:

1. Mesmo hash canônico atual, sem reescrever hashes históricos.
2. Índice único parcial global para chaves presentes.
3. Resposta e RespostaPergunta gravadas na mesma transação; sucesso somente após commit.
4. Retry limitado da **transação inteira** em write conflicts/transientes, com chave/payload estáveis e backoff. Não gerar uma nova chave ao repetir.
5. Após colisão/resultado incerto, consultar fora da transação abortada: somente confirmar registro **committed** com hash igual. Hash diferente permanece 409. Se não houver comprovação de commit, retornar falha, preservando a tentativa no frontend.

Os códigos P2002/P2034/P1008/P2028 atuais não são uma lista comprovada para todas as falhas MongoDB. Testar erros/labels reais de duplicate key, write conflict, timeout e commit incerto; não transformar falhas desconhecidas em 201 ou expor detalhes do driver. Não pressupor retry automático de transações pelo Prisma. MongoDB não aceita configuração de isolationLevel pelo Prisma como bancos SQL; os limites de maxWait/timeout precisam de ensaio com latência real. [Transações Prisma v6](https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions).

Validators de coleção, geridos separadamente do client, devem cobrir tipos, campos obrigatórios, enums, intervalos e exclusividade de valores de RespostaPergunta, incluindo campos null/ausentes. Não conseguem verificar referências em outra coleção: isso permanece responsabilidade dos services/transações e do validador de migração. Não usar `validationAction: warn` como substituto de proteção. Rollback deve rejeitar qualquer estado que viole as constraints SQLite.

## 5. Arquivos e operações afetadas

| Arquivo / referência | Operações atuais | Adequação planejada |
| --- | --- | --- |
| `prisma/schema.prisma:5` | Datasource SQLite, oito modelos/relações/índices | Provider MongoDB, `_id` string; revisão de emulação e campo interno de coordenação, se confirmado |
| `prisma/migrations/**` | Histórico SQL | **Preservar**, não converter para migrations MongoDB nem apagar; separar fluxo legado |
| `src/config/env.js:8` | Aceita somente `file:` | Validar URI MongoDB com banco explícito e política Atlas; não imprimir URI |
| `src/config/prisma.js:4` | Instância única e proteção de TEST_DATABASE_URL | Manter singleton; endurecer identificação de banco descartável de teste e encerramento |
| `src/services/authService.js:16`/`:24` | Create Empresa/Usuario em transação; findUnique email | Preservar hash e JWT; confirmar atomicidade, unicidade e erros |
| `src/middlewares/authMiddleware.js:19` | FindUnique usuário por sub | Manter UUID e empresa derivada do banco; testar token anterior à troca |
| `src/services/pesquisaService.js:8`/`:25`/`:33`/`:46`/`:57`/`:74` | Ownership, listagem/paginação, update/delete/publicação, pesquisa pública | Relações/filtros; guard de concorrência; exclusões e DTO sem campo interno |
| `src/services/perguntaService.js:6`/`:23`/`:31`/`:44` | Ownership, nested create/delete/recreate opções | Preservar ordens únicas, contexto e trava de rascunho, inclusive concorrência |
| `src/services/pontoColetaService.js:7`/`:19`/`:25`/`:32`/`:42` | Ownership, CRUD e PNG | Proteger exclusão/desativação concorrentes; token e URL PNG inalterados |
| `src/services/respostaService.js:15`/`:23`/`:43`/`:49` | FindUnique chave, transação, createMany e reconhecimento de retries | Índice parcial, validação referencial explícita, retry/commit MongoDB |
| `src/services/resultadoService.js:9`/`:30`/`:37`/`:52` | Count/findMany, cinco groupBy, SQL diário | Manter agregados ORM quando comprovados; substituir SQL por pipeline com tenant e UTC |
| `src/services/feedbackService.js:18`/`:51`/`:65` | Filtros relacionais, count/findMany, cursor CSV em lotes | Confirmar include/orderBy relacionais e null/missing; preservar filtros e ordem determinística |
| `src/middlewares/errorMiddleware.js:21`/`:25` | Mapeia erros Prisma e imprime erro bruto | Mapear erros reais mantendo HTTP; redigir logs para não expor payload/URI/valores de índices |
| `src/controllers/pesquisaController.js:10`/`:13`/`:16`/`:19` | Retorna objetos completos de Pesquisa | Garantir contrato exato se houver campo interno; select/DTO delimitado |
| `src/controllers/feedbackController.js:9` | CSV autenticado e streaming | Preferencialmente preservado; retestar interrupção/MIME/BOM/backpressure |
| `src/utils/schemas.js`, `periodo.js`, `csv.js`, `pesquisaDto.js` | Validação e serialização | Reutilizar; regras não serão afrouxadas para aceitar a migração |
| `src/server.js`, `src/services/healthService.js`, rotas/controller de health | Startup/health e encerramento | Gate de conexão/readiness e shutdown da TASK 06; não declarar Atlas pronto só pelo health atual |
| `package.json`, `package-lock.json`, `.env.example` | Scripts SQLite e dependências | Scripts explícitos de client/indexes/import/verify/rollback/test; driver MongoDB para ferramentas, versão fixada após ensaio |
| `tests/setup.js`, `vitest.config.js` | SQLite temporário/migrate deploy por suíte | Provisionar DB MongoDB descartável em replica set; manter testes legados SQLite em execução separada obrigatória |
| `tests/api.test.js:350` | PRAGMA FK; fixtures, CRUD/segurança/CSV | Validador lógico MongoDB; mesmos cenários e exigências; incluir bypass de validações |
| `tests/publicResponse.test.js`, `analytics.test.js`, `migration.test.js` | Concorrência, agregados e preservação de migrations | Adaptar backend; manter migration.test legado e acrescentar testes forward/reverse/reexecução |
| `tests/csv.test.js`, `dev.test.js` | Escape CSV e watcher | Preservar; ajustar setup para não provisionar banco desnecessariamente |
| `frontend/tests/e2e/api-server.js:7`/`:22` | Cria SQLite e aplica migrations | DB MongoDB isolado, índices/validators e seed; limpeza restrita ao DB de teste |
| `frontend/tests/e2e/seed-admin.js`, `auth.spec.js:8`, `frontend/playwright.config.js` | Fixtures e proteção do banco real | Adaptar harness; manter hash do SQLite e acrescentar proteção do destino real |
| `frontend/tests/e2e/{admin,auth,public-survey,stage3,stage5}.spec.js` | Fluxos HTTP/navegador | Preservar cenários; ajustar apenas infraestrutura/fixtures quando necessário |
| `frontend/src/**`, `frontend/.env.example`, `frontend/.env.local` | Contratos UUID/JWT/URLs | **Nenhuma alteração funcional ou visual prevista**; dados/contratos continuam iguais |
| `README.md`, documentação de etapas, `.gitignore` | Operação e arquivos ignorados | Atualizar fluxo Atlas após aprovação; ignorar dumps/manifests sensíveis; manter histórico das etapas |

Novos arquivos previstos, **não criados**: manifest de índices/validators, scripts de sincronização verificável, export/import/verify, conversão reversa e testes de paridade/integridade. Não criar camada genérica de persistência ou reescrever todos os services sem evidência de necessidade.

### SQL bruto e consultas de análise

Busca encontrou **uma consulta SQL bruta em runtime**: `src/services/resultadoService.js:52`, com JOIN, `typeof` e `strftime`. Há também `PRAGMA foreign_key_check` em `tests/api.test.js:350` e SQL dos testes de migrations. Eles não são executáveis no MongoDB.

Para a evolução diária, propor pipeline sobre Resposta:

1. `$match` de pesquisa/ponto/datas que possam restringir cedo.
2. `$lookup` para Pesquisa e `$match` de empresaId, sempre derivado de req.auth; preservar validação prévia dos filtros. Não confiar somente no pesquisaId enviado pelo cliente.
3. `$group` por `$dateToString` com `%Y-%m-%d` e timezone UTC; `$sum: 1`.
4. `$sort` por dia e transformação para `{ dia, quantidade }`, sem `_id` no HTTP.

Usar `aggregateRaw` do Prisma, incluindo formato Extended JSON correto para datas, e verificar execução dentro da transação de leitura com as outras métricas. [Raw queries MongoDB no Prisma v6](https://www.prisma.io/docs/orm/v6/prisma-client/using-raw-sql/raw-queries#aggregateraw). Se o conector não sustentar a mesma sessão nesse caminho, resolver essa limitação no protótipo; não aceitar silenciosamente totais e série temporal de snapshots diferentes.

Os cinco groupBy ORM existentes não são classificados como incompatíveis por serem agregações. Primeiro comprovar equivalência; não reimplementá-los sem necessidade. Preservar NPS, médias, zero/false, alternativas sem respostas, perguntas opcionais e filtros UTC inclusivos. CSV deve continuar com todas as respostas dos feedbacks selecionados e mais de um lote; `(createdAt DESC, id DESC)` continua necessário, pois UUID não é ordem temporal.

## 6. Migração segura, repetível e auditável

### Ferramenta proposta

Script Node 24 com leitor `node:sqlite` **somente leitura** e driver oficial MongoDB para escrita controlada no destino. O driver permitirá inserir BSON Date e valores originais sem efeitos de defaults/updatedAt do Prisma. A dependência seria adicionada somente na implementação aprovada, preferencialmente às ferramentas de operação; o runtime pode continuar somente com Prisma.

Modos separados: **preflight/dry-run** (sem escrita de dados), **import inicial**, **resume** vinculado a manifest anterior e **verify** (somente leitura). Não implementar reset, delete, replace, upsert ou modo de sobrescrita como conveniência.

### Fluxo futuro

1. **Preservar a origem:** registrar versão SQLite do código/locks/schema/migrations e manter pacote executável de rollback. Em tarefa aprovada, criar snapshot consistente em arquivo novo usando Backup API; guardar original e snapshot com acesso restrito. Exportar também `_prisma_migrations` completo e metadados internos para arquivo técnico privado. Não incluir dados em Git ou portfólio.
2. **Validar origem:** checar integridade, FKs, uniques, UUIDs, timestamps, booleanos, enums, tipos e vínculos. Identificar campos inesperados; nunca descartá-los silenciosamente. Qualquer divergência aborta e gera apenas resumo sanitizado.
3. **Validar destino:** URI obtida por secret manager, nome de DB explícito e allowlist operacional; confirmar que não é admin/local/config, banco real de outra aplicação ou DB de testes. Destino deve estar inicialmente vazio. Detectar documentos/coleções inesperados e abortar. Índices/validators previamente provisionados e conferidos em fase autorizada.
4. **Exportar snapshot lógico:** leitura em transação consistente, uma tabela por vez, todos os scalars históricos; ordenar por ID. Preferir stream interno/arquivo Extended JSON protegido e criptografado quando necessário. CSV de feedbacks **não** é exportação completa: não contém usuários, hashes, IDs de todas as entidades ou metadados suficientes.
5. **Transformar sem redefinir identidade:** id → `_id` string; preservar referências, senhaHash, slug, token, chave e submissionHash byte a byte como strings; converter timestamps para Date e 0/1 para bool. Não normalizar email/conteúdo nem preencher opcionais com valores inventados.
6. **Importar na ordem de dependências:** Empresa → Usuario → Pesquisa → Pergunta → OpcaoPergunta → PontoColeta → Resposta → RespostaPergunta. Inserir em lotes limitados; para o volume atual, uma transação pode caber, mas não pressupor isso para volumes futuros. Aplicação fica sem acesso de escrita durante import/verify.
7. **Retomar com segurança:** primeiro import exige vazio. Resume exige mesmo fingerprint da origem, versão de transformação e manifest, além de ausência de escritores externos. Documento já existente e **integralmente igual** é apenas conferido e ignorado; ausente é inserido; divergente aborta. Nenhum update automático. Duplicate key deve ser classificado e comparado sem registrar valores sensíveis.
8. **Verificar tudo:** contagens e conjuntos de IDs iguais; comparação de cada campo histórico em todos os registros, incluindo senhaHash/token/chave apenas em memória; datas iguais ao milissegundo; relações e invariantes válidas; índices/validators exatos. Contagens iguais, sozinhas, não são aceite. Comparações de digests podem usar HMAC em manifest privado, nunca imprimir hashes derivados de dados pessoais.
9. **Concluir ou parar:** somente liberar API após relatório de verificação completo. Em falha, não apagar importação parcial: preservar destino e origem, retomar pelo manifest ou usar outro DB vazio mediante autorização. Não apontar runtime ao destino parcial.

O manifest deve conter run ID opaco, commit/schema/versão do conversor, fingerprint da origem/snapshot, contagens por tabela, checkpoints e resultado dos checks. Log público/console contém operação, contagem, duração e código sanitizado; não URI, documentos, IDs pessoais, valores de índices duplicados, senhaHash ou token. Não serializar exceções completas do driver/Prisma.

### Corte final e prevenção de escritas novas no SQLite

Usar manutenção, pois são somente oito registros atuais e o requisito principal é preservar dados. A duração será estimada após ensaio; não prometer zero downtime.

1. Ensaiar previamente ferramentas, client, índices, testes e rollback em ambientes próprios.
2. Bloquear **todas** as mutações no ingress/aplicação, incluindo cadastro e endpoints administrativos, além de envio público. Pausar jobs e impedir processos/scripts paralelos que escrevam no SQLite.
3. Drenar requisições/transactions em andamento e parar os escritores. Só um gate de UI não é suficiente. Respostas rejeitadas durante manutenção não podem receber sucesso; clientes com tentativa incerta mantêm payload/chave para retry.
4. Criar snapshot final consistente e verificar origem estável. Recontar, porque os números desta TASK são apenas o inventário de hoje. Autorizar a importação final para DB vazio, exclusivo do corte, ou um resume legítimo do mesmo snapshot.
5. Importar/verificar, configurar release MongoDB, testar leitura isolada e conectividade. Confirmar que instâncias antigas SQLite não receberão tráfego nem gravarão mais.
6. Abrir tráfego para **um banco autoritativo**, registrar momento do corte e monitorar. Não reabrir o SQLite congelado como fallback automático de rede.

## 7. Testes de paridade e preservação

Não remover testes ou converter asserts de segurança em mocks para obter aprovação.

- **Harness MongoDB:** replica set local de testes ou DB Atlas de teste isolado, nome efêmero e credencial incapaz de acessar produção. Preservar proteção TEST_DATABASE_URL; acrescentar host/DB permitidos e marcador de execução. Seeds/limpeza somente nos destinos descartáveis explicitamente identificados. Preparação por manifest de índices/validators, sem migrate deploy SQL.
- **Legado SQLite:** manter `tests/migration.test.js` e a versão original como suíte/artefato separado. `npm test` futuro deve contemplar os checks legados aplicáveis e a suíte MongoDB; não ocultar o teste apenas retirando-o do comando padrão.
- **Fixtures completas:** duas empresas, usuários, pesquisas em todos os status, todos os cinco tipos, opções, pontos ativos/inativos, respostas com/sem origem, com/sem chave, textos/acentos/fórmulas, datas UTC em fronteiras, false/zero/null e timestamps legados. Criadas apenas em bancos descartáveis.
- **Comparação entre engines:** executar a versão SQLite congelada e a release MongoDB em processos/client gerados separados sobre fixtures equivalentes com IDs/datas fixos. Comparar JSON, status, filtros, paginação, DTOs e CSV byte a byte. Não comparar tokens JWT recém-gerados por igualdade de bytes; verificar claims/algoritmo/expiração e validade de token anterior com usuário e segredo preservados.
- **Migração:** igualdade de todos os campos; oito coleções vazias/parciais; fonte inválida; URI/destino errado; interromper/resumir; colisão igual/divergente; opcionais null/ausentes; nenhum segredo em logs; hash da origem estável.
- **Idempotência:** dez ou mais envios paralelos com mesma chave/payload geram exatamente uma Resposta e um conjunto de filhos; chave divergente retorna 409; várias respostas sem chave são aceitas; perda de confirmação/refresh/reinício preservam a chave e o total correto.
- **Concorrência de regras:** publicar × editar pergunta; encerrar × enviar; excluir/desativar ponto × enviar; ordem duplicada; cadastro duplicado. Resultado deve equivaler a uma ordenação válida das operações, sem órfãos ou alterações de perguntas já publicadas.
- **Bypass:** inserts escalares/raw inválidos são rejeitados pelo validador pertinente ou pelo verificador de referências antes de liberação; testar que `createMany` não é usado como caminho sem validação no runtime.
- **Dashboard/feedbacks/CSV:** métricas por pergunta e empresa, filtros de data/ponto/pergunta/nota, paginação, >100 feedbacks, UUIDs com timestamps empatados, MIME/BOM/escape de fórmulas e interrupção de download. Mensurar latência e timeout de 15 s do frontend com exportação representativa.
- **E2E/manuais:** preservar auth, painel, criação/editor, publicação, pontos/PNG, cinco tipos, draft/refresh/retry, resultados e CSV. Scanner físico verifica QR após o corte; links antigos precisam manter slug/token e URL pública.
- **Rollback:** ensaiar antes de aceitar gravações reais no MongoDB, incluindo novas respostas e alterações administrativas pós-corte. Testar retry de chave migrada e de chave criada no Atlas após retorno ao SQLite.

## 8. Rollback sem perda de dados

**Preservar código SQLite e banco original é obrigatório, mas não é suficiente após novas gravações no Atlas.** Não existe transação distribuída automática entre os bancos. O procedimento de retorno precisa estar pronto e ensaiado antes de abrir escrita no MongoDB.

### Antes de qualquer nova gravação no MongoDB

Manter manutenção ativa; confirmar por verificação que o destino contém somente o estado importado, sem mudanças de negócio. Reativar a release SQLite congelada apontando ao banco/snapshot íntegro. Reabrir tráfego só depois de checks de saúde/contrato. Dados do destino permanecem preservados para diagnóstico. Não apagar ou sobrescrever o original.

### Depois de novas respostas ou outras alterações

1. Ativar manutenção, drenar e parar **todos os escritores MongoDB**; verificar que o SQLite não recebeu gravações paralelas. Não alternar tráfego entre os dois bancos.
2. Obter snapshot/exportação **consistente do estado completo atual** das oito coleções. Também preservar evidência privada de alterações/exclusões em comparação ao baseline. Dados novos incluem possíveis empresas/usuários, pesquisas, perguntas, opções, pontos, respostas e alterações de status/conteúdo, não só Resposta.
3. Converter esse estado para **um novo arquivo SQLite**, com schema e constraints da release legada, em diretório novo. Provisionamento/DDL e escrita dessa cópia ocorrerão apenas em tarefa autorizada; o `prisma/dev.db` original continua intacto. Preservar IDs, hashes, datas, slugs, tokens e chaves; descartar somente metadados internos de coordenação conforme regra explicitamente documentada.
4. Não mesclar apenas inserts no snapshot antigo: isso ressuscitaria registros excluídos e perderia edições. Construir o estado completo no novo arquivo, com validação de CHECK/FK/uniques e comparação integral. O histórico SQL original permanece guardado; o novo arquivo deve ter estado de schema/migrations compatível e verificável com a release SQLite.
5. Executar a API SQLite congelada isolada sobre esse arquivo novo; validar login, ownership, pesquisas, retry, resultados e CSV. Conferir todos os documentos de negócio exportados e todas as respostas aceitas após o corte.
6. Somente após aceite, mudar a referência da release SQLite para o arquivo reconciliado e liberar tráfego. Manter original, exportação Atlas e cópia reconciliada protegidos. Registrar evento e ponto final de reconciliação.

Se Atlas estiver inacessível e existirem gravações não recuperáveis do backup disponível, **não há como garantir rollback sem perda** apontando ao SQLite antigo. Manter manutenção e recuperar Atlas/dados necessários; não declarar perda zero sem prova. Replicação é disponibilidade, não substitui backup e ensaio de restore. RPO zero para migração/retorno planejado depende de congelamento e exportação de todo estado confirmado; recuperação de desastre tem RPO definido pelo mecanismo de backup contratado.

## 9. Atlas, índices, deploy, backup e custos

### Preparação segura

- Runtime usa DATABASE_URL MongoDB com database explícito, preferencialmente URI SRV fornecida pelo Atlas, TLS válido e write concern adequado (`majority`) após confirmar suporte/comportamento no conector. Credenciais com caracteres especiais precisam de encoding; URI nunca vai para frontend, Git, screenshots ou logs.
- Validar DNS/SRV, allowlist de IP de saída da hospedagem e política de timeout/pool. Não usar `0.0.0.0/0` como configuração permanente. Atlas possui lista de acesso IP por projeto. [Acesso IP Atlas](https://www.mongodb.com/docs/atlas/security/ip-access-list/).
- Separar usuário runtime, administrador de índices/validators e importador. Runtime deve ter os privilégios CRUD necessários às oito coleções, sem privilégios de administração de cluster; restringir operações destrutivas por papel personalizado quando disponível. Importação não necessita permissão de sobrescrita/delete. Contas de teste não acessam dados reais.
- NODE_ENV=production, JWT_SECRET, CORS_ORIGINS e bases públicas continuam necessários. Preservar segredo JWT no corte se sessões existentes precisarem continuar válidas. Não mudar tokens de ponto nem domínio público por causa do banco.
- `src/config/env.js:8` atualmente rejeitaria URI MongoDB: adaptação é pré-requisito de inicialização. Client MongoDB precisa ser gerado separadamente; o client SQLite antigo não muda de provider somente por receber outra URI.

### Sincronização de índices e validators

Prisma Migrate não é usado no MongoDB; a documentação do conector indica db push para gerenciamento usual de índices. Neste projeto, o índice parcial exige uma política adicional. **Estratégia escolhida para o plano: manifest versionado + script administrativo verificável**, sem migrations SQL e sem db push automático.

Em execução futura autorizada, o script deve listar índices/validators, gerar diff seguro e criar somente os ausentes com especificação aprovada. Índice igual: no-op. Índice com mesmo nome e opções diferentes, documento inválido ou unique impossível: abortar. Não remover/recriar índice nem modificar validator de coleção povoada silenciosamente. Criar coleções/índices antes da importação; no runtime apenas conferir disponibilidade e versão do manifest. Mudança de schema futura exige evolução de documentos planejada, pois generate/sincronização de índice não convertem dados antigos.

Além dos índices históricos, avaliar `(pesquisaId, createdAt DESC, _id DESC)` em Resposta para paginação/CSV e `(empresaId, createdAt DESC, _id DESC)` em Pesquisa para listagem. Usar explain e carga representativa antes de adicionar outros; não criar um índice por combinação possível de filtros. Não habilitar sharding nesta migração.

### Plano e custos — consulta oficial em 13/10/2026

| Opção Atlas | Limitações relevantes | Implicação para o FeedQR |
| --- | --- | --- |
| Free/M0 | 512 MB incluindo dados/índices; recursos compartilhados; sem backup gerenciado | Possível para ensaio/portfólio de baixo tráfego, **condicionado** a backup externo consistente, restore ensaiado e aceitação dos limites. O tamanho SQLite não é estimativa direta do tamanho BSON/índices. |
| Flex | 5 GB, até 500 conexões/500 ops por segundo; sem allowDiskUse e PITR; métricas limitadas | Mais capacidade, mas exige medir consultas/transações e aceitar limitações. Não serve de promessa de recuperação de qualquer gravação recente. |
| Dedicated | Recursos e mecanismos de backup mais completos, com custo superior | Avaliar para dados/SLAs relevantes e RPO mais curto; região e backup configurados precisam de validação. |

Comparação de armazenamento/backups: [tipos de cluster Atlas](https://www.mongodb.com/docs/atlas/manage-clusters/). Limites Flex: [documentação Flex](https://www.mongodb.com/docs/atlas/reference/flex-limitations/). Snapshots Flex são diários, começam após 24 h, com retenção dos últimos oito; não há snapshot sob demanda. [Backups Flex](https://www.mongodb.com/docs/atlas/backup/cloud-backup/flex-cluster-backup/).

Preço de referência divulgado: Free US$ 0; Flex a partir de US$ 0,011/h, até US$ 30/mês; Dedicated a partir de US$ 0,08/h/US$ 56,94 por mês. Não é orçamento fechado: confirmar região, tráfego, armazenamento, backup, serviços adicionais e câmbio. Hospedagem da API/frontend é separada. [Preços oficiais](https://www.mongodb.com/pricing).

Backup deve cobrir todas as coleções e configuração dos índices/validators, com destino protegido e restore em DB novo. Em planos sem snapshot adequado, usar export/dump consistente validado; para dump multicoleção sem garantia de snapshot, pausar escritores. Não pressupor que `mongodump` simples sob gravações oferece uma visão consistente, nem que recursos de oplog/PITR estão disponíveis em qualquer plano.

### Impacto operacional

API deixa de exigir volume SQLite para o banco autoritativo; o banco original/snapshot de rollback continua protegido fora da camada efêmera de deploy. Preservar Node 24.x e client/engine adequados ao SO de destino, controlar pools por processo e manter uma instância inicial até medir concorrência. Atlas permite banco compartilhado entre APIs, mas **não** corrige os rate limits em memória/proxy encontrados na TASK 06.

Antes de produção, ainda resolver trust proxy, readiness real de banco/índices, shutdown, fallback SPA/HTTPS, logs sanitizados e teste E2E estável. Monitorar latência, conexões, armazenamento, erros de transação/duplicate key, idade/falhas de backup, 5xx/429 e custo. Ajustes de observabilidade devem respeitar recursos do plano. Nenhum SLA ou benchmark MongoDB foi comprovado nesta TASK.

## 10. Implementação dividida em tarefas pequenas

Cada tarefa abaixo depende de aprovação do plano; nenhum arquivo ou recurso nela foi implementado aqui. Complexidade é estimativa relativa: B baixa, M média, A alta. O pequeno volume atual reduz importação, mas não reduz exigências de segurança/rollback.

| Ordem | Tarefa e entrega verificável | Complexidade | Gate para avançar |
| --- | --- | --- | --- |
| 07.1 | Preservar release SQLite, definir snapshots/arquivos protegidos e fixtures de caracterização | B/M | Baseline reproduzível, sem dados sensíveis em Git; política de manutenção aprovada |
| 07.2 | Protótipo MongoDB em replica set isolado: UUID `_id`, relações compostas/Restrict, groupBy, nested writes/createMany, aggregateRaw transacional e chave opcional | M/A | Prisma 6.19.3 validado; limitações conhecidas resolvidas antes de tocar configuração real |
| 07.3 | Schema/client MongoDB e manifest de índices/validators; sincronizador dry-run/no-op/abort | M | Índice parcial efetivo, ausência de índice comum conflitante, validação de tipos/valores |
| 07.4 | Coordenação por pesquisa, verificações de referência, idempotência/retries e sanitização de erros | A | Testes concorrentes e multiempresa passam sem enfraquecer contratos |
| 07.5 | Substituir somente SQL diário; confirmar filtros/feedbacks/cursor CSV; DTOs sem metadados novos | M | Paridade JSON/CSV e UTC, tenant presente em toda agregação |
| 07.6 | Harness MongoDB e testes de paridade, mantendo testes SQLite legados e E2E | M/A | Suites completas, proteção de ambos os bancos reais e fixtures cobrindo tabelas vazias |
| 07.7 | Conversor forward, manifest/resume/verificador integral e logs sem segredos | M | Dry-run, interrupção/resume e divergência testados; origem intacta |
| 07.8 | Conversor reverso para novo SQLite e ensaio após novas respostas/edições/exclusões no MongoDB | A | Retorno preserva todo estado confirmado; original não sobrescrito |
| 07.9 | Atlas/staging: URI segura, roles, índices, backup/restore, readiness e medição de recursos | M | Operação e custo aceitos; restore e limites do plano demonstrados |
| 07.10 | Ensaio do corte completo, reconciliação final e checklist; somente depois solicitar autorização de corte/deploy | M | Todos os critérios abaixo aprovados; manutenção/rollback executáveis |

Se o protótipo 07.2 revelar incompatibilidade de relação ou transação agregada, ajustar o plano de forma delimitada antes das outras alterações. Upgrade major de Prisma, embeddings amplos, novos recursos de produto e redesign não fazem parte dessas tarefas.

## 11. Riscos e respostas

| Risco | Resposta planejada |
| --- | --- |
| Trocar IDs por ObjectId quebra JWT/URLs/validators | `_id` UUID string e referências iguais; comparar identidade integral |
| Unique opcional rejeita respostas sem chave | Índice parcial e teste de várias chaves null/ausentes; evitar db push automático |
| Perder proteção de FK/CHECK | Services explícitos, validators locais, auditor lógico e testes de bypass |
| Snapshot MongoDB permite stale read/write skew | Escrita comum de coordenação por pesquisa, retry limitado e testes de disputas |
| Datas mudam timezone/milissegundos ou defaults substituem dados | Conversão BSON Date explícita, comparação ao milissegundo, sem ORM upsert na importação |
| Fonte muda durante export/import | Congelamento real de todos os escritores, snapshot consistente e verificação de estabilidade |
| Retry de import sobrescreve registros ou gera IDs diferentes | Inserção com `_id` original; igual → no-op, divergente → abort; resume vinculado ao manifest |
| SQL convertido vaza outra empresa ou muda métricas | Tenant explícito, filtros equivalentes, fixtures de duas empresas e paridade de agregados |
| Logs de duplicate key/driver expõem email, token ou URI | Sanitização por código/operação/contagem; sem dump de exceção/documento |
| Rollback após gravações usa SQLite congelado | Exportar estado atual completo e montar novo SQLite; não reabrir original desatualizado |
| Atlas indisponível impede recuperar novas gravações | Manter manutenção; recuperar dados/backup, não prometer retorno sem perda por troca de URI |
| Free/Flex backup e recursos insuficientes | Selecionar plano por RPO/carga, backup externo/restore e limites observados |
| Migração tratada como solução de toda prontidão | Manter pendências independentes da TASK 06 como gates de produção |

## 12. Critérios objetivos de aceite

- [ ] Original SQLite e artefato legados preservados; hash antes/depois das leituras/migração igual, respeitada a janela congelada; nenhuma escrita do conversor na origem.
- [ ] Inventário final refeito: 100% dos registros/campos de negócio migrados, IDs iguais e nenhum documento extra. Neste inventário são 1/1/1/5/0/0/0/0; os números finais podem crescer antes da manutenção.
- [ ] Tabelas técnicas/metadados SQL preservados integralmente em snapshot/arquivo privado; oito coleções de negócio com modelagem declarada.
- [ ] Zero órfãos/divergências de pesquisa/tipo/opção, zero diferenças de timestamps/strings/booleanos, zero colisões inesperadas de uniques; senhas/tokens/chaves comparados sem exposição.
- [ ] Client Prisma 6.19.3 gerado/validado para MongoDB; replica set e operações transacionais comprovados no plano Atlas escolhido.
- [ ] Manifest de índices/validators confere; idempotência parcial aceita múltiplas respostas sem chave e rejeita colisões válidas; script não remove índices/documentos automaticamente.
- [ ] Contratos HTTP, DTOs, JWT, multiempresa, QR, dashboard, feedbacks e CSV preservados, sem ObjectId ou campo interno novo exposto no frontend.
- [ ] Todos os testes aplicáveis existentes continuam executados; novos testes de conversão/paridade/conflito passam; comando E2E completo verde em ambiente isolado estável, sem reduzir limites de produção.
- [ ] Dez ou mais tentativas concorrentes iguais resultam em uma avaliação e filhos corretos; tentativas divergentes e corridas de status/exclusão não violam regras.
- [ ] Import interrompido é retomável sem update/delete, destino divergente interrompe operação e nenhum dado sensível aparece nos logs.
- [ ] Rollback ensaiado depois de inserts, updates e deletes no Atlas: novo SQLite equivale ao estado atual e preserva todas as respostas confirmadas; original intacto.
- [ ] Atlas configurado com TLS, acessos restritos, roles/secrets separados, backup restaurável e custo/RPO/RTO aceitos; teste de indisponibilidade não libera split-brain.
- [ ] Corte com manutenção/drenagem/reconciliação e checklist de produção aprovado; nenhuma liberação baseada apenas no health estático atual.

**Conclusão:** adotar MongoDB Atlas é compatível com a decisão de portfólio e com a preservação dos dados, desde que índices, integridade e retorno pós-corte sejam tratados explicitamente. O plano prioriza oito coleções, UUIDs iguais e frontend preservado. A conversão real e qualquer alteração no sistema permanecem **pendentes de aprovação**.
