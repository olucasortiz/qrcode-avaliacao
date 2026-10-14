# TASK 17 — FeedQR: preparação para produção

Auditoria de 14/10/2026. **Preparado para revisão e implantação autorizada; produção ainda não validada.** Nenhum deploy, recurso pago, conexão ao Atlas ou alteração de dados de produção foi feito nesta tarefa. URLs com `<...>` e `example.invalid` são placeholders.

## Fonte auditada e divergência da branch pública

- Repositório: `olucasortiz/qrcode-avaliacao`.
- Local: `feat/mongodb-migration`, HEAD auditado `1373dd5de07f0b13bca81e4cb9e71910f5cb761d`, mais os ajustes desta tarefa.
- `origin/main`, atualizado por `git fetch origin main`: `2bc755c05d28ff79a7f68222662bfd119f6ac9d8`. Seu `prisma/schema.prisma` usa **SQLite**. Não configurar nenhum provedor para essa revisão.
- A revisão local promoveu MongoDB e moveu a API para `backend/`. Foram lidos AGENTS.md, README e relatórios históricos de implantação/migração em `docs/`. Esses relatórios têm comandos/caminhos e alegações de validação anteriores à reorganização; não constituem prova de produção atual.
- O README recebeu alterações concorrentes durante esta tarefa e foi preservado. Este guia é a referência operacional para TASK 17. A regra local de ignorar outros documentos foi preservada, com exceção para `docs/deployment/`.
- Nenhum commit, push, merge ou criação de branch foi realizado. Antes de publicar, revisar e versionar os ajustes na branch MongoDB; atualizar ambos os provedores para o mesmo commit aprovado. Se houver merge futuro em `main`, conferir novamente o provider MongoDB antes de mudar a branch de deploy.

## Auditoria da aplicação

| Área | Resultado e evidência |
| --- | --- |
| Prisma | `backend/prisma/schema.prisma`: MongoDB, Prisma/Client 6.19.3, UUID strings mapeadas para `_id`, `relationMode=prisma`. `schema.mongo.prisma` preserva o mesmo modelo. Client importado de `backend/src/generated/mongo-client/`; gerado no build para o SO do provedor. Windows engines e arquivo `.tmp` deixaram de ser versionados, mas continuam locais/ignorados. |
| Schema físico | Manifest v1.0.0: oito coleções, 20 índices e validators. Índice **único parcial** de `Resposta.idempotencyKey` é administrado pelo manifest, não pelo schema Prisma. A verificação agora detecta validators em `warn/off`, ordem incorreta de índices compostos e coleções inesperadas. |
| Comandos | Lock da API passou para `backend/package-lock.json`, configuração Vitest para `backend/vitest.config.js`. API: `npm ci --include=dev`, `npm run build`, `npm start`. Raiz: scripts de encaminhamento para os dois pacotes. Frontend: `npm ci`, `npm run build`. |
| Runtime | Node 24.21.0 fixado em `.node-version` e `NODE_VERSION`; `engines.node=24.x` nos pacotes. ESM nativo. Sem upgrade de Prisma ou mudança de banco. |
| Porta e ciclo de vida | `process.env.PORT`, bind explícito `0.0.0.0`. SIGINT/SIGTERM fecham HTTP e desconectam Prisma; limite interno de encerramento de 10 s. Sem criação ou migração automática do banco. |
| Conexão | Singleton Prisma, transações MongoDB exigem replica set. Produção exige SRV autenticado, banco explícito não reservado e TLS sem bypass. URI define pool inicial de 10 e timeouts para evitar probes presos; medir antes de ajustar. |
| Health | `GET /api/health`: liveness 200. `GET /api/health/ready`: ping MongoDB, 200/503 sem mensagem interna. Respostas sem cache. Ping não comprova índices, validators, privilégios de escrita ou backup: verificação administrativa prévia é obrigatória. |
| CORS e proxy | Whitelist exata de origens, sem wildcard. Authorization e Idempotency-Key liberados no preflight; Content-Disposition e Retry-After expostos. Sem cookies/credentials. `TRUST_PROXY=1` confia em **um** salto; conferir o X-Forwarded-For real do Render antes de abrir tráfego. |
| Autenticação | JWT HS256, `sub` UUID, expiração de 1 h; autenticação busca usuário no banco e deriva empresaId do registro. Bcrypt custo 12, limite de 72 bytes, dummy hash para usuário inexistente. Cadastro cria uma nova empresa; não permite escolher empresa alheia. |
| Sessão do navegador | Bearer em memória/sessionStorage; fetch com `credentials: omit`. Logout limpa a aba, mas um token copiado permanece válido até expirar. Não foram introduzidos cookies cross-site nem refresh tokens. |
| Admin e empresas | API protege pesquisas, perguntas, pontos, dashboard, resultados, feedbacks e CSV. Guards Vue controlam acesso às telas. Serviços conferem propriedade da pesquisa/ponto e filtros por empresa; rotas e isolamento são cobertos por testes. Bundle estático não contém dados privados. |
| Rotas públicas | DTO contém apenas título, descrição, slug, perguntas e opções necessárias; não retorna empresa, usuários, hashes, timestamps internos ou respostas de outros clientes. Apenas pesquisa ativa e origem válida/ativa podem receber novos envios. |
| Validação | Zod strict no servidor, limites de payload 64 KB, texto 2.000 caracteres, perguntas duplicadas/desconhecidas e opções alheias rejeitadas. Transação valida a pesquisa, obrigatoriedade e valores antes de persistir. |
| Idempotência | Frontend persiste UUID de envio e manda Idempotency-Key; API reconcilia pelo hash SHA-256, índice único parcial e retry transacional. Mesma chave/payload não duplica; payload diferente retorna 409. A chave é opcional no contrato HTTP: clientes próprios devem enviá-la. |
| QR e links | API usa FRONTEND_PUBLIC_URL; UI usa VITE_FRONTEND_PUBLIC_URL. Ambos devem ser a mesma origem canônica. Caminho `/p/:slug?origem=<token>` é preservado. Mudar origem após imprimir QR exige manter domínio anterior funcionando ou reemitir QR. |
| SPA/API | Vue Router history, fallback explícito `frontend/public/_redirects`. Vite proxy é somente desenvolvimento. Pages exige VITE_API_BASE_URL HTTPS absoluto terminado em `/api`, evitando chamadas à própria hospedagem estática. |
| Headers e erros | Helmet na API, no-store global, sem X-Powered-By. Erros HTTP genéricos; logs não imprimem erros Prisma brutos. Builds Pages geram `_headers` com CSP permitindo conexões apenas à própria origem e à API configurada, scripts sem inline, frame-ancestors none e no-referrer. Styles inline permanecem permitidos por uso de estilos dinâmicos. |
| Segredos e fixtures | `.env`, dados locais, backups, chaves e builds ignorados. Inspeção de arquivos versionados e busca dos valores secretos locais não encontraram credenciais reais. Histórico buscado não versiona `.env` real. Fixtures e seeds usam dados sintéticos e destinos temporários; seed E2E exige NODE_ENV=test e TEST_DATABASE_URL igual à URI temporária. Não executar seeds em produção. A varredura é heurística, não uma certificação de todo histórico/segredo possível. |

O shim que retornava uma lista vazia para `PRAGMA foreign_key_check` foi removido: ele não era uma verificação de integridade MongoDB. Testes de SQLite restantes exercitam somente as ferramentas legadas de migração/rollback em bases descartáveis. O rollback operacional desta implantação mantém MongoDB.

## Render — configuração exata da API

`render.yaml` é um Blueprint **para revisão**. Aplicá-lo ou clicar em Create Web Service inicia deploy, mesmo com auto deploy desativado; fazer apenas após aprovação.

| Campo | Valor |
| --- | --- |
| Tipo / runtime | Web Service / Node |
| Repositório | `https://github.com/olucasortiz/qrcode-avaliacao` |
| Branch inicial | `feat/mongodb-migration`, após versionar e publicar a revisão aprovada |
| Root directory | `backend` |
| Build command | `npm ci --include=dev && npm run build && npm prune --omit=dev` |
| Start command | `npm start` (`node src/server.js`) |
| Health check path | `/api/health/ready` |
| Node | `NODE_VERSION=24.21.0` |
| Ambiente | `NODE_ENV=production` |
| Proxy | `TRUST_PROXY=1` |
| Porta | Não definir manualmente: usar PORT fornecido pelo Render (padrão 10000) |
| Instâncias | 1, sem autoscaling inicial |
| Auto deploy | Off (`autoDeployTrigger: off`) |
| Região | Blueprint usa padrão `oregon`; escolher região próxima do Atlas **antes** da criação se necessário. Região e allowlist de saída devem ser conferidas no painel. |
| Plano / disco | Blueprint `free`, sem disco persistente. Nenhum recurso foi criado. Não selecionar plano pago sem aprovação adicional. |
| Pre-deploy / seed | Nenhum; não executar db push, Prisma Migrate ou sync --apply no build/start |

Segredos/valores preenchidos no painel, com base em `backend/.env.production.example`:

```dotenv
DATABASE_URL=mongodb+srv://<runtime-user>:<url-encoded-password>@<cluster-host>/feedqr_production?retryWrites=true&w=majority&maxPoolSize=10&connectTimeoutMS=2000&serverSelectionTimeoutMS=3000
JWT_SECRET=<64-caracteres-hex-gerados-com-randomBytes-32>
FRONTEND_PUBLIC_URL=https://<pages-project>.pages.dev
CORS_ORIGINS=https://<pages-project>.pages.dev
```

Gerar o JWT localmente com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` e inserir diretamente no secret manager. Não copiar a saída para Git, screenshots ou conversa. Manter o segredo estável entre releases/instâncias. Rotação invalida sessões existentes.

Com domínio próprio, substituir as duas variáveis de origem pelo domínio canônico HTTPS e atualizar também VITE_FRONTEND_PUBLIC_URL. Permitir origens adicionais apenas explicitamente e se forem utilizadas; não liberar `*.pages.dev`. Não definir PRISMA_LOG, NODE_ENV=test, TEST_DATABASE_URL, ALLOW_REMOTE_SYNC ou flags de fixture no serviço público.

Render requer bind em 0.0.0.0 e oferece PORT no ambiente; as escolhas seguem [Web Services](https://render.com/docs/web-services), [Node version](https://render.com/docs/node-version) e [Blueprint specification](https://render.com/docs/blueprint-spec). O plano Free suspende serviços após inatividade e pode causar cold starts que excedem o timeout de 15 s do frontend; não oferece as garantias de disponibilidade de um serviço sempre ativo. Avaliar essa limitação antes da primeira abertura pública. [Limitações Free](https://render.com/docs/free).

## Cloudflare Pages — configuração exata da SPA

| Campo | Valor |
| --- | --- |
| Produto | Pages com integração Git, site estático Vue/Vite |
| Repositório / branch | Mesmo repositório e commit da API; inicialmente `feat/mongodb-migration` |
| Framework preset | Vue (ou None com os valores explícitos abaixo) |
| Root directory | `frontend` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` (relativo a frontend) |
| Build image | v3 |
| Variáveis de produção | `NODE_VERSION=24.21.0`, `SKIP_DEPENDENCY_INSTALL=1`, `DEPLOYMENT_TARGET=cloudflare-pages`, `VITE_API_BASE_URL=https://<render-service>.onrender.com/api`, `VITE_FRONTEND_PUBLIC_URL=https://<pages-project>.pages.dev` |
| Preview deployments | Desabilitar inicialmente. Se necessários, usar API/Atlas de staging e origens explícitas; não compartilhar dados/segredos de produção. |
| Auto deployments | Desabilitar durante preparação; a conexão/criação inicial pode iniciar deployment e exige aprovação. |
| Functions / Workers | Nenhum |
| Cookies / secrets | Nenhum segredo backend na configuração Pages; todas as VITE_* são públicas no bundle |

`SKIP_DEPENDENCY_INSTALL=1` evita a instalação automática do provedor: o comando faz npm ci pelo lock local. Variáveis VITE_* são compiladas no bundle; alterar API ou URL pública exige **novo build**. `_headers` é gerado durante o build com o hostname da API e `_redirects` é copiado para dist. Não adicionar `404.html` que interfira com a SPA. Testar refresh direto em `/app/pesquisas/:id` e `/p/:slug?origem=...` no host real.

Configuração baseada nas referências oficiais de [Vue em Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vue-site/), [build image](https://developers.cloudflare.com/pages/configuration/build-image/), [headers](https://developers.cloudflare.com/pages/configuration/headers/) e [SPA routing](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Atlas — configuração manual e privilégios

1. Selecionar um cluster Atlas dedicado/isolado para produção, replica set compatível com Prisma 6.19.3. Usar um banco **novo**, explicitamente chamado `feedqr_production`, sem importar a base local/customer data por conveniência. Não se presume que o Atlas verificado em tarefa anterior seja este ambiente.
2. Criar custom role `feedqr-runtime`: ações `find`, `insert`, `update`, `remove` limitadas às coleções Empresa, Usuario, Pesquisa, Pergunta, OpcaoPergunta, PontoColeta, Resposta e RespostaPergunta **somente** em feedqr_production. Criar usuário dedicado `feedqr-production-runtime` com essa role e restringir ao cluster necessário. Confirmar que comandos ping/hello e CRUD/transações Prisma funcionam em staging com a role equivalente. Não conceder atlasAdmin, readWriteAnyDatabase, dbAdmin, collMod, dropCollection, dropDatabase, createIndex ou bypassDocumentValidation ao runtime.
3. Usar usuário operacional **separado**, temporário, para criar coleções/índices/validators e inspecioná-los. Uma role readWrite do banco inteiro tem mais permissões que o runtime precisa; não usá-la como substituto permanente de least privilege.
4. Adicionar à Network Access apenas os ranges de **saída do serviço Render selecionado**, obtidos no painel e conferidos na [documentação de outbound IPs](https://render.com/docs/outbound-ip-addresses). Não incluir IPs do Pages: quem conecta ao Atlas é a API. Evitar 0.0.0.0/0; usar acesso de operador com escopo e prazo limitados quando necessário.
5. Percent-encode usuário/senha na URI, usar SRV/TLS e não desabilitar verificação de certificado. Guardar URI apenas no Render. Confirmar backup/restore, retenção, RPO/RTO e limites do tier escolhido; nenhuma compra ou habilitação de recurso pago foi realizada.

Roles e usuários seguem [Database users](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/) e [Custom database roles](https://www.mongodb.com/docs/atlas/security-add-mongodb-roles/). Prisma 6 exige replica set e não usa migrations SQL para MongoDB; ver [documentação versionada v6](https://docs.prisma.io/docs/orm/v6/overview/databases/mongodb). Não usar instruções de Prisma 8 com este client 6.19.3.

Provisionamento **futuro**, por operador autorizado, fora do build/start e sem colocar senha no comando:

```sh
# A partir de backend/, com DATABASE_URL operacional injetada com segurança.
npm ci --include=dev
npm run mongo:sync -- --dry-run --allow-remote
# Revisar alvo, banco novo/vazio e diff; somente então autorizar a escrita:
npm run mongo:sync -- --apply --allow-remote
npm run mongo:sync -- --verify --allow-remote
npm run mongo:verify-atlas
```

Esses comandos **não foram executados contra Atlas**. --apply cria coleções/índices e pode aplicar validators ausentes a coleções existentes: não usar em base povoada sem revisão, backup e plano específico. Em divergência ou coleção inesperada, parar e investigar, sem remover índices/dados para fazer a verificação passar. `prisma generate` não cria esses recursos. `prisma db push` pode interferir nos índices administrados pelo manifest e não faz parte deste runbook.

Depois de `npm prune --omit=dev`, o driver Mongo operacional e ferramentas de teste não estão disponíveis no runtime. A CLI Prisma pode permanecer como dependência peer opcional do client; não depender disso para operação do banco. Executar ferramentas administrativas em estação/job separado com dependências de desenvolvimento, sem conceder suas credenciais ao serviço público. Readiness é ping somente, logo não comprova por si só essa conformidade.

## Limites de abuso e operação pública

| Grupo | Limite atual / janela de 15 minutos |
| --- | --- |
| Auth (login/cadastro) | 10 por IP |
| Leitura de pesquisa pública | 120 por IP |
| Envio de respostas | 30 por IP |
| Admin | 300 por IP em production; 5000 só em test |
| CSV | 5 por usuário autenticado |

São contadores **em memória por processo**. Reinícios, cold starts e novos deploys zeram contadores; durante substituição de releases ou múltiplas instâncias cada processo tem orçamento próprio. Manter uma instância reduz, mas não elimina a limitação. NAT compartilhado pode bloquear clientes legítimos; IPv6 é agrupado pela biblioteca. Idempotência no MongoDB não depende desses contadores e continua entre instâncias.

Não tratar esses limites como proteção suficiente contra ataque distribuído. Antes de aumentar tráfego/instâncias, decidir proteção de borda para a API ou contadores compartilhados em infraestrutura aprovada, sem introduzir outro banco nesta tarefa. Proteção apenas no domínio Pages não cobre acesso direto a `<service>.onrender.com`. CORS não é autenticação e não impede clientes não-browser.

Em staging, verificar se o Render acrescenta um client IP confiável ao X-Forwarded-For. Enviar headers forjados e confirmar que trocar o prefixo não troca o orçamento. Se a cadeia real tiver outro comprimento, rever a configuração restrita antes de abrir tráfego; não usar trust proxy irrestrito. Não gravar IPs/tokens/feedback em logs para esse teste.

## Checklist antes e depois da aprovação

Antes de solicitar execução do deploy:

- [ ] Revisar diff da tarefa e versionar/publicar a branch MongoDB aprovada; main SQLite permanece excluída como origem.
- [ ] Confirmar nomes/domínios definitivos, região API/Atlas, plano, custos e limitações de cold start.
- [ ] Criar cluster/banco/roles/users manualmente com aprovação; configurar allowlist de rede, secrets e backup restaurável.
- [ ] Revisar dry-run e autorizar provisionamento do manifest no banco novo, verificar schema e TLS/topologia com usuário operacional.
- [ ] Validar em staging CRUD/transações com o usuário runtime de privilégios mínimos; não usar dados reais nos testes.
- [ ] Confirmar comandos/variáveis da tabela e nenhuma credencial VITE_*.
- [ ] Confirmar que criar serviço/Pages/Blueprint só ocorrerá após aprovação explícita.

Após deploy autorizado, ainda pendente:

- [ ] Conferir commit e Node nos logs Linux, engine Prisma gerada no Render e ausência de .env/fixtures/banco local no artefato.
- [ ] Validar HTTPS/certificados em ambos os hosts, health 200, readiness 200; observar 503 em indisponibilidade controlada de staging.
- [ ] Conferir CORS permitido/bloqueado, preflight Authorization + Idempotency-Key, headers Helmet/CSP/no-store e nenhum erro interno.
- [ ] Testar IP de proxy e limites, incluindo acesso direto à API, sem depender de contadores de outras instâncias.
- [ ] Registrar duas empresas sintéticas de aceitação no ambiente autorizado; testar acesso cruzado a pesquisas/pontos/CSV/resultados, token ausente/expirado e guards admin.
- [ ] Criar/publicar pesquisa sintética, gerar QR, escanear com celular por HTTPS e conferir origem e leitura pública.
- [ ] Enviar respostas dos cinco tipos, retry com mesma chave após resposta perdida, conflito 409 para chave/payload diferente; conferir uma única persistência e analytics/CSV.
- [ ] Testar refresh dos links history, navegação mobile e desktop, carregamento/erro, teclado e reduced motion.
- [ ] Reiniciar/substituir a API e confirmar persistência Atlas, mesmo segredo JWT e funcionamento dos QR já emitidos.
- [ ] Exercitar rollback de release e restauração de backup em staging; registrar RPO/RTO reais.
- [ ] Somente após essas evidências declarar produção aprovada. Não basta um build verde ou health 200.

## Rollback mantendo MongoDB

1. Antes de cada release, registrar commit de API/SPA, configurações públicas, referência segura à versão dos secrets e snapshot/backup Atlas. Nunca incluir valores secretos no registro.
2. Em erro somente de frontend, restaurar o último deployment Pages validado; conferir API e domínio canônico incorporados no bundle/CSP. Não mudar origem de QR impressos.
3. Em erro de backend, reimplantar o último commit **MongoDB** compatível no Render, com as mesmas credenciais runtime, JWT e banco Atlas. Desabilitar novos deploys e validar readiness, auth, isolamento e envio idempotente.
4. Na primeira implantação não existe uma release pública anterior. Retirar a abertura pública/pausar coleta e corrigir a revisão, preservando todos os documentos já aceitos. Pode publicar uma página de indisponibilidade no Pages; ela sozinha não bloqueia chamadas diretas à API. Se for necessário conter escritas, bloquear/suspender a API no painel autorizado ou revogar temporariamente o acesso runtime, registrando impacto e janela.
5. Não voltar para `origin/main` SQLite e não executar `mongo:rollback`, migrate reset, db push, drop ou scripts de limpeza contra produção. Esta tarefa não modifica schema de documentos; rollback de código deve conservar os dados. Evoluções futuras incompatíveis exigem plano próprio.
6. Se houver corrupção comprovada, preservar o banco original e restaurar backup em um **novo banco MongoDB** mediante autorização explícita. Reconciliar escritas posteriores ao snapshot antes de alterar DATABASE_URL. Não restaurar por cima de produção nem criar recursos pagos automaticamente.

## Validação local e limites

Resultados finais e inventário de arquivos: ver `validation.md` nesta pasta. Testes usam MongoDB replica sets temporários locais e fixtures sintéticas. Nenhuma confirmação de ambiente Atlas de produção ou HTTPS público é inferida desses testes.

Para desenvolvimento, instalar separadamente com `npm --prefix backend ci --include=dev` e `npm --prefix frontend ci`; copiar `backend/.env.example` para `backend/.env` e gerar um segredo local válido. A `.env` antiga na raiz não é carregada pelos scripts de encaminhamento: não mover credenciais automaticamente para evitar mistura de ambientes. `frontend/.env.local` é somente local; variáveis do painel Pages prevalecem no build. Conferir que preview/testes não herdam endpoints de produção.
