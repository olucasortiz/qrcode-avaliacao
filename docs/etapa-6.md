# TASK 06 — Auditoria de prontidão para produção do FeedQR

**Parecer: NÃO APTO PARA PRODUÇÃO nas condições atualmente demonstradas.**

O fluxo funcional está amplamente validado, mas ainda faltam garantias operacionais de persistência e recuperação. Há também um defeito confirmado de rate limiting para implantação atrás de proxy reverso. Não foram implementadas correções nem realizado deploy.

## Escopo e evidências

- Data: 13/10/2026, America/Sao_Paulo.
- Repositório: `olucasortiz/qrcode-avaliacao`, checkout local `C:\qrcode-avaliacao`.
- Branch encontrada: `main`; commit auditado: `2bc755c05d28ff79a7f68222662bfd119f6ac9d8`.
- A árvore estava limpa no início. A única alteração versionável desta tarefa é este relatório.
- Consultados: `AGENTS.md`, `README.md`, `docs/etapa-4.md`, `docs/etapa-5.md`, configurações, rotas, controllers, services, middlewares, frontend, schema, quatro migrations e testes.
- Ambiente de execução: Windows, Node **v24.21.0**, npm **11.19.0**; dependências já instaladas e compatíveis com os locks, conforme `npm ls --depth=0` nos dois projetos.
- Migrations e fixtures desta auditoria foram executadas exclusivamente em SQLite temporários. O banco existente recebeu apenas leitura explícita com `DatabaseSync(..., { readOnly: true })` e cálculo de hash.
- Nenhum segredo foi incluído neste relatório. A inspeção do `.env` local retornou somente metadados de configuração, sem imprimir JWT_SECRET.

Categorias utilizadas:

| Categoria | Significado |
| --- | --- |
| **Execução** | Verificado nesta auditoria, com comandos ou ensaios atuais. |
| **Inspeção** | Verificado no código atual; não equivale a teste na hospedagem. |
| **Documentado, não revalidado** | Relato de uma entrega anterior, sem comprovação atual daquela condição. |
| **Pendente de teste real** | Depende do ambiente de hospedagem, carga, operação ou aparelho físico. |

Bloqueador impede a aprovação do lançamento no cenário indicado. Importante exige adequação ou mitigação operacional explícita. Melhoria futura não impede o lançamento de uma instância com a arquitetura mínima descrita aqui.

## 1. Verificações executadas agora

| Verificação | Resultado atual | Limite da evidência |
| --- | --- | --- |
| `npm test` | **41/41 passaram**, 6 arquivos, 29,39 s | Bancos temporários; inclui JWT, isolamento, HTTP, CSV, idempotência, migrations e watcher. |
| `npm run frontend:test` | **62/62 passaram**, 9 arquivos | Testes unitários em ambiente Node. |
| `npm run frontend:build` | **Passou**, Vite 8.3.3, saída em `frontend/dist` | Compilação; não comprova o servidor estático da hospedagem. |
| `node node_modules/prisma/build/index.js validate` | **Passou** | Validação de schema, sem aplicar migrations ao banco existente. |
| `npm audit --json`, raiz | **0 vulnerabilidades conhecidas**, todas as severidades | Resultado do registro npm nesta data, incluindo desenvolvimento. |
| `npm audit --json`, `frontend/` | **0 vulnerabilidades conhecidas**, todas as severidades | Não é prova de ausência de falhas de aplicação ou de vulnerabilidades ainda desconhecidas. |
| `npm run frontend:e2e` | **62 passaram / 2 falharam**, 64 casos, 2,9 min, exit 1 | Chromium com API temporária e servidor Vite de desenvolvimento. **A execução completa não passou.** |
| Reexecução somente dos dois casos falhos | **2/2 passaram**, 11,6 s, exit 0 | Não substitui nem torna verde a execução completa original. |
| Ensaio adicional com `NODE_ENV=production` | **Passou** nos cenários positivos e reproduziu os achados B3 e I2 | API HTTP local com SQLite temporário e URLs HTTPS sintéticas; sem tráfego à hospedagem. |
| Backup e restauração de dados temporários | **Passou** | Backup API de `node:sqlite`, arquivo restaurado novo, integridade e relações válidas; não exercita o backup da futura hospedagem. |
| Banco local existente, somente leitura | `quick_check=ok`, **0 violações de FK**, quatro migrations concluídas | Estado local; não comprova estado de banco de produção. |
| Hash antes/depois de `prisma/dev.db` | **Idêntico**, 176.128 bytes | SHA-256 `15207B88446F8BE4A86E9DEFAB2995BD444980CE52153A64BF538AAEF57500C4`. |
| `git diff --check` | **Passou** antes da redação; rechecado na entrega | Higiene do diff, não funcionalidade. |

Reexecução direcionada realizada:

```powershell
npm --prefix frontend run test:e2e -- --grep 'refresh após resultado incerto|isolamento real por empresa e teclado'
```

Diagnóstico das falhas da execução completa:

1. `frontend/tests/e2e/public-survey.spec.js:286`: falhou ao abrir a tela inicial, em `begin()` na linha 288, antes de executar o cenário de envio incerto. O trace registra **`Failed to load resource: net::ERR_NO_BUFFER_SPACE`** no browser. Não registra uma chamada pública à API nesse caso. A repetição isolada passou. Há evidência de falha de recurso/transporte local, não de regressão confirmada de idempotência.
2. `frontend/tests/e2e/stage5.spec.js:154`: cadastro esperava 201 e recebeu **429**. O servidor é compartilhado pela suíte completa; o limiter de autenticação mantém 10 requisições por 15 minutos mesmo em teste. A repetição isolada com servidor novo passou. É um problema de isolamento/orçamento de requisições da suíte.

Traces da primeira execução foram preservados antes da reexecução em `%TEMP%\feedqr-audit-e2e-first-failure\` (`trace.zip`, `stage5-trace.zip` e respectivos contextos). Scripts dos ensaios adicionais: `%TEMP%\feedqr-production-audit.cjs` e `%TEMP%\feedqr-backup-audit.cjs`. São evidências locais temporárias, não arquivos versionados nem artefatos publicados.

Foram inspecionadas visualmente duas capturas **geradas nesta execução**: `frontend/artifacts/stage4/360/inicio.png` e `frontend/artifacts/stage5/1440/resultados.png`. Não apareceu defeito concreto de composição nessas capturas. Os E2E exercitaram larguras de 360, 390, 430, 768, 1024 e 1440 conforme os respectivos cenários. Isso não comprova câmera ou teclado virtual de um celular físico.

Não há scripts de lint ou checagem de tipos nos manifests. Não foram inventados ou adicionados checks. Não foi feita instalação limpa, geração de client na imagem Linux, teste de carga, deploy, teste de TLS público, nem teste de falha de disco real. O EPERM de `prisma generate` citado na Etapa 4 é **documentado, não revalidado**; não é classificado como falha atual.

## 2. Itens confirmados como prontos

### Infraestrutura e inicialização

- **Inspeção + execução:** `npm start` aponta para `node src/server.js` (`package.json:9`); o ensaio executou esse mesmo entrypoint em produção. Backend JavaScript ES Modules sem etapa própria de compilação. Não se deve usar nodemon para produção.
- **Inspeção:** Node 24+ é o requisito declarado (`README.md:3`). Para a primeira implantação, padronizar **Node 24.x**, mesma família auditada. Vite/plugin Vue nos locks exigem `^20.19.0 || >=22.12.0`; Vitest exige `^22.12.0 || ^24.0.0 || >=26.0.0`. A versão do runtime de backend pode ter mínimos menores, mas o ciclo inteiro do projeto foi validado em 24.x.
- **Inspeção:** `PORT` é inteiro entre 1 e 65535, padrão 3000 (`src/config/env.js:7`). `app.listen(env.port)` omite host (`src/server.js:4`), permitindo bind nas interfaces do serviço; não está limitado a localhost. O endpoint é `/api/health`.
- **Inspeção:** frontend e API são serviços distintos. `src/app.js:27` monta somente `/api`; não serve `frontend/dist` nem fornece fallback SPA.
- **Inspeção:** há dois lockfiles; instalação reprodutível deve usar `npm ci` em cada projeto. A CLI Prisma 6.19.3 é dependência **de desenvolvimento** (`package.json:48`); ela precisa estar disponível na etapa de geração/migration.

### Segurança e contratos

- **Execução + inspeção:** senhas usam bcrypt custo 12, limite de 72 bytes; cadastro de empresa/usuário é transacional. JWT HS256 expira em uma hora (`src/services/authService.js:7`, `:11`, `:15`). Middleware fixa algoritmo, valida UUID/exp e consulta usuário no banco (`src/middlewares/authMiddleware.js:12`, `:16`, `:19`). Empresa vem do banco, não de claim enviada pelo cliente.
- **Execução + inspeção:** todos os grupos privados passam por autenticação (`src/routes/adminRoutes.js:11`). Pesquisas, perguntas, pontos, PNG, dashboard, resultados, feedbacks e CSV têm checagem de pertencimento. Suíte atual cobre leitura/modificação entre empresas (`tests/api.test.js:296`); ensaio em produção confirmou **20 combinações de recurso/filtro estrangeiro com 404** e listagem própria vazia.
- **Inspeção:** escopo por empresa em `src/services/pesquisaService.js:8`, `perguntaService.js:6`, `pontoColetaService.js:7`, `resultadoService.js:14`/`:23`/`:57` e `feedbackService.js:18`/`:35`. SQL agregado usa `Prisma.sql` parametrizado.
- **Execução + inspeção:** CORS por allowlist exata, preflight com Authorization e Idempotency-Key, sem wildcard ou cookies (`src/app.js:15`). Sem Origin é permitido, o que não substitui JWT nem permite leitura privada sem autenticação. Ensaio de produção confirmou origem permitida e 403 para origem não listada.
- **Execução:** Helmet entrega CSP, HSTS e outros cabeçalhos na **API**, e `X-Powered-By` está ausente (`src/app.js:12`/`:14`). Isso não configura HTTPS ou cabeçalhos do servidor estático.
- **Execução + inspeção:** validação Zod estrita, IDs, status, datas, tipos/valores, limites de texto; parser de 64 KB; erros 400/401/403/404/409/413/415/429 e 500 genérico. Vue interpola textos; a busca nos fontes não encontrou `v-html`, `innerHTML` ou `eval`.
- **Execução + inspeção:** idempotência usa chave UUID única no banco e SHA-256 de slug/origem/respostas, com transação e tratamento de concorrência (`src/services/respostaService.js:11`, `:23`, `:43`, `:49`; `prisma/schema.prisma:120`). Reuso divergente retorna 409; frontend congela a tentativa incerta e preserva payload/chave após refresh. **Não é limitação de uma resposta por pessoa**: chave é opcional na API e uma nova chave permite outra resposta intencional.
- **Execução + inspeção:** CSV exige JWT, pertencimento e limite por usuário, usa lotes de 100, backpressure, BOM, escape de aspas e proteção de fórmulas (`src/controllers/feedbackController.js:9`, `src/services/feedbackService.js:65`, `src/utils/csv.js:1`). Frontend baixa o blob autenticado e valida MIME/conteúdo.
- **Inspeção:** `.env`, bancos e chaves são ignorados (`.gitignore:2` a `:10`); `git ls-files` não encontrou esses artefatos no checkout atual. Isso não é uma auditoria completa de segredos no histórico remoto, CI ou imagem futura.

### Frontend, QR e banco

- **Execução:** build concluído; busca nos JS gerados não encontrou `localhost` ou `127.0.0.1`. Não há URL local fixa no código de execução do frontend/backend; o loopback em `frontend/vite.config.js:15` é fallback do proxy de desenvolvimento. Exemplos e fixtures locais não são configuração de produção.
- **Execução + inspeção:** QR PNG usa `FRONTEND_PUBLIC_URL`, slug codificado e token em `origem` (`src/services/pontoColetaService.js:45`). Ensaio em produção comparou bytes com o PNG esperado de `https://feedqr.example.com/p/audit-survey?origem=<token>` e passou. Preservação de slug/token está comprovada com configuração sintética; domínio, certificado e leitura de câmera reais estão pendentes.
- **Inspeção + execução E2E:** link do painel usa `VITE_FRONTEND_PUBLIC_URL` ou `window.location.origin` (`frontend/src/components/PointManager.vue:49`), cópia usa Clipboard e download usa blob PNG. PNG e link são calculados em lados distintos e precisam de bases iguais.
- **Execução + inspeção:** sessão em `sessionStorage`, expiração, restauração validada pela API, limpeza por 401 e logout local (`frontend/src/services/session.js:40`, `:54`, `:73`). Rota pública dispensa restauração administrativa (`frontend/src/router/index.js:26`). Encerrar a aba encerra a persistência da sessão; armazenamento bloqueado limita a persistência, mas não o uso em memória.
- **Execução:** quatro migrations foram aplicadas em bancos descartáveis pelas suítes e pelo ensaio; preservação de pontos/respostas na migration e FK foram testadas. Banco local já possui as quatro migrations concluídas. Nenhuma migration foi aplicada nele nesta tarefa.
- **Execução:** reiniciar o entrypoint em produção usando **o mesmo arquivo temporário** manteve uma resposta, e retry com a mesma chave após reinício continuou com total 1. Backup/restauração desse arquivo em um caminho novo preservou resposta, quatro migrations, slug, token e chave, com `integrity_check=ok` e zero violações de FK.

## 3. Problemas reais, evidências e severidade

| ID / severidade | Arquivo e linha | Evidência / impacto | Adequação mínima proposta |
| --- | --- | --- | --- |
| **B1 — Bloqueador operacional de persistência** | `.env.example:3`; `prisma/schema.prisma:5`; `README.md:17`/`:38` | **Inspeção:** configuração de referência é `file:./dev.db`, dentro de `prisma/`. Não existe no checkout configuração de volume/deploy que assegure sobrevivência a substituição do serviço. Reinício com o mesmo arquivo passou, mas nova implantação em filesystem efêmero perde acesso aos dados. **Não se afirma que uma hospedagem já perdeu dados; ela não foi definida/verificada.** | Definir volume durável local à API, caminho absoluto, permissões e uma instância. Comprovar reinício e substituição de release conservando dados. Não aceitar o banco na camada gravável da imagem. |
| **B2 — Bloqueador operacional de recuperação** | `README.md:30`/`:38`; `docs/etapa-4.md:20`; `docs/etapa-5.md:48` | **Inspeção:** documentos explicam execução/testes, mas não definem backup consistente, retenção, cópia externa, restauração ou responsável. Busca por backup/restauração nos documentos/fontes não encontrou procedimento. Ensaio temporário provou uma técnica; não há rotina operacional comprovada para dados reais. | Configurar snapshot SQLite consistente, destino separado, retenção/RPO/RTO e alarmes; ensaiar recuperação em banco novo antes do lançamento. |
| **B3 — Bloqueador para publicação atrás de proxy reverso** | `src/app.js:11`; `src/middlewares/rateLimitMiddleware.js:6`; `README.md:106` | **Inspeção + execução:** não há `app.set('trust proxy', ...)` nem variável que o configure. Com dez `X-Forwarded-For` distintos, todos compartilham limite do socket; 10ª chamada retornou 400 e 11ª 429; log contém `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`. Atrás de um proxy, os limites deixam de representar cada cliente e podem bloquear login/coleta de todos os usuários daquele proxy. | Após conhecer a topologia, confiar somente nos proxies/sub-redes corretos ou hops comprovados; garantir sobrescrita de headers no último proxy e bloquear acesso direto à API. Testar dois IPs reais e spoofing. Não usar `trust proxy=true` indiscriminadamente. |
| **I1 — Importante** | `src/server.js:4` | **Inspeção:** não guarda servidor, não trata SIGTERM/SIGINT, não drena conexões nem desconecta Prisma. Ensaio reiniciou o processo, mas não testou drenagem de uma resposta/CSV em andamento. Shutdown padrão interrompe requisições. | Encerramento gracioso pequeno e delimitado, com timeout, retirada de tráfego, `server.close()` e `$disconnect()`; ajustar grace period do supervisor. |
| **I2 — Importante** | `src/services/healthService.js:1`; `src/config/prisma.js:8` | **Execução:** com caminho de banco cujo diretório não existe, API iniciou, health retornou **200**, e consulta privada retornou **500**. Health atual é liveness, não readiness de dados/migrations. | Usar verificação de readiness que consulte o banco e confirme schema, ou gate operacional externo equivalente antes de liberar tráfego. Manter liveness separado para evitar loops de reinício por falha de banco. |
| **I3 — Importante; bloqueia adoção de múltiplas instâncias sem adequação** | `src/middlewares/rateLimitMiddleware.js:3` a `:10`; `prisma/schema.prisma:6` | **Inspeção:** stores de rate limit são os padrões em memória. Contadores reiniciam com o processo e não são compartilhados. Com arquivos locais por instância, dados e chaves de idempotência também se separam; compartilhar SQLite por filesystem de rede traz risco de locking/consistência. | Manter **uma API/um arquivo** no lançamento. Se houver escala horizontal, definir banco adequado e limiter compartilhado antes de ativá-la. Não habilitar autoscaling/cluster/rolling overlap nesta arquitetura mínima. |
| **I4 — Importante: guardas de configuração incompletas** | `src/config/env.js:6`/`:14`/`:18`; `src/middlewares/rateLimitMiddleware.js:9`; `frontend/src/components/PointManager.vue:51` | **Inspeção:** NODE_ENV não é validado; HTTP/local é aceito como URL pública; JWT_SECRET tem validação de comprimento/prefixo, não entropia; base pública do frontend não é validada nem comparada com a API. Configuração errada pode gerar QR inacessível, mixed content ou limite administrativo de teste (5000) em um serviço publicado com NODE_ENV=test. | Manifest de produção explícito, segredo aleatório em secret manager e validação de valores antes de publicar. Adotar guardas pequenas em tarefa posterior; não promover `.env.example`/`.env` local como produção. |
| **I5 — Importante: confiabilidade do comando E2E completo** | `frontend/playwright.config.js:12`; `src/middlewares/rateLimitMiddleware.js:8`; `frontend/tests/e2e/stage5.spec.js:154`; `frontend/tests/e2e/public-survey.spec.js:288` | **Execução:** comando completo teve 2 falhas, por 429 acumulado e `ERR_NO_BUFFER_SPACE`; casos isolados passaram. Não existe evidência de uma execução completa verde atual. Não foi reduzida proteção da API para aprovar testes. | Isolar processos/limites entre suítes e diagnosticar consumo de recursos do browser/Vite; manter testes específicos de rate limit. Até então registrar falhas e execuções isoladas sem mascarar o resultado agregado. |
| **F1 — Melhoria futura** | `package.json:6`; `frontend/package.json:5`; `README.md:3` | **Inspeção:** não há `engines`, `.nvmrc`/`.node-version` ou CI versionada. Node correto foi comprovado localmente, mas não é fixado pela automação. | Fixar família/versão na hospedagem e depois nos manifests/CI. |
| **F2 — Melhoria futura de sessão** | `src/services/authService.js:11`; `frontend/src/services/session.js:81`; `README.md:131` | **Inspeção:** logout apaga sessão local, mas JWT copiado continua válido até expiração. Não há revogação, refresh ou recuperação de senha. Token em sessionStorage é acessível a scripts da própria origem. Nenhum bypass de JWT/XSS foi confirmado. | Conforme necessidade de operação, prever revogação/recuperação e reforçar CSP do frontend. Rotação de JWT_SECRET invalida todas as sessões; deve ser planejada. |
| **F3 — Melhoria futura; importante se houver CSVs grandes** | `frontend/src/lib/api.js:29`/`:47` | **Inspeção:** timeout de 15 s inclui leitura do blob inteiro; browser mantém exportação completa em memória. Backend trabalha em lotes, mas isso não remove o limite do cliente. Não houve falha com os volumes atuais. | Medir volume real e ajustar timeout/limites de exportação quando necessário. Não há teste de carga atual para dimensionar capacidade. |
| **F4 — Melhoria futura de observabilidade** | `src/server.js:5`; `src/middlewares/errorMiddleware.js:25` | **Inspeção:** logs básicos de startup/erro, sem correlação de requisições ou monitoramento operacional no repositório. Erros internos são ocultos na resposta, mas logs precisam de controle de acesso. | Configurar coleta, retenção, alertas de 5xx/429, disco, backups e latência na hospedagem; evitar registrar tokens/payloads pessoais. |

B1 e B2 são ausências comprovadas no material operacional do repositório e condições obrigatórias ainda não demonstradas na hospedagem. B3 é comportamento reproduzido no código atual, condicionado à arquitetura com proxy. Não se trata ausência de Dockerfile, provedor específico ou TLS implementado no Node como vulnerabilidade automática: esses itens podem ser atendidos pela plataforma.

## 4. Variáveis e configurações dependentes da hospedagem

Arquitetura mínima proposta, **ainda não escolhida/implantada**: frontend estático em domínio HTTPS, proxy `/api` preservando esse prefixo para **uma** API Node 24.x, SQLite em volume persistente local/block storage, backup externo. VPS ou serviço gerenciado com processo duradouro e volume são compatíveis sob essas condições. Backend serverless/efêmero sem disco durável não atende à arquitetura atual. Um banco gerenciado PostgreSQL/libSQL não é substituição direta de DATABASE_URL: schema/provider/driver e migrations exigiriam trabalho separado.

| Variável | Consumo atual | Configuração de produção / validação necessária |
| --- | --- | --- |
| `DATABASE_URL` | Runtime/Prisma; exige prefixo `file:` | Preferir `file:/data/feedqr.db` em Linux, com `/data` realmente montado e gravável pelo usuário da API. Montar o **diretório**, inclusive journals/WAL/SHM se utilizados. O `.env` local resolve para `C:\qrcode-avaliacao\prisma\dev.db`; isso não é caminho de produção. |
| `JWT_SECRET` | Runtime da API | Aleatório, pelo menos 32 caracteres, separado por ambiente, injetado por secret manager; estável entre reinícios. Não publicar em VITE_, Git, imagem ou logs. Comprimento local passou, entropia/segredo de produção não foram avaliados. |
| `CORS_ORIGINS` | Runtime da API | Origens HTTPS exatas do frontend, separadas por vírgula, sem paths, wildcard ou barra final. Incluir somente origens necessárias. CORS não é proteção contra clientes não-browser. |
| `FRONTEND_PUBLIC_URL` | Runtime, geração PNG | URL HTTPS pública canônica, sem query/fragmento/credenciais. Exemplo sintético: `https://feedqr.example.com`. O código aceita path, mas router/assets atuais assumem publicação na raiz; usar raiz na arquitetura mínima. |
| `VITE_API_BASE_URL` | **Build** do frontend | `/api` para proxy de mesma origem; alternativamente `https://api.example.com/api`, com CORS real. Não remover `/api`. Mudança exige novo build. |
| `VITE_FRONTEND_PUBLIC_URL` | **Build**, link do painel | Igual a FRONTEND_PUBLIC_URL. Omissão só é correta se `window.location.origin` for o domínio público canônico. Bases divergentes fazem link copiado e PNG apontarem a lugares distintos. |
| `API_PROXY_TARGET` | Servidor Vite de desenvolvimento | Não provisiona proxy no site estático publicado. Usar destino interno no proxy da hospedagem; não colocar endereço interno como VITE_API_BASE_URL. |
| `NODE_ENV` | Runtime e dependências | API obrigatoriamente `production`; não `test`. No build, Vite usa modo production por padrão; `VITE_*` são incorporadas ao bundle. |
| `PORT` | Runtime API | Porta fornecida pelo serviço, padrão 3000; publicar externamente somente via ingress/proxy HTTPS. Sem requisito de expor 3000 à internet. |

O `.env` **local** está em development, com URL pública não HTTPS. Isso é adequado ao desenvolvimento e não evidencia configuração insegura de uma produção existente; confirma que ele não deve ser promovido sem configuração própria.

Condições ainda **pendentes de teste real**:

- DNS, certificado, redirecionamento HTTP→HTTPS, headers da resposta HTML, firewall e cadeia de proxies.
- SPA: `/p/<slug>?origem=<token>`, `/entrar`, `/app` e `/app/pesquisas/<id>` devem servir index.html em acesso direto/refresh. Query precisa sobreviver. Arquivos estáticos ausentes e `/api/*` não devem cair no fallback HTML.
- Proxy: preservar `/api` (a API espera esse prefixo), Authorization, Idempotency-Key, query, status HTTP, MIME, BOM e streaming do CSV; sem cache de dados privados/públicos dinâmicos. O proxy Vite remove Origin em desenvolvimento (`frontend/vite.config.js:20`), portanto E2E local não comprova o CORS da implantação em domínios distintos.
- Cache de index.html com revalidação, assets com hash; manter assets necessários a abas abertas durante troca de release.
- Cabeçalhos do frontend: Helmet protege só a API. CSP do site precisa permitir o próprio bundle, fontes locais, `connect-src` da API e `img-src blob:` para PNG; não copiar cegamente a CSP da API para o HTML.
- Imagem Linux: gerar Prisma client e instalar bcrypt no SO/arquitetura de destino. Não copiar node_modules/engine Windows. Usuário sem privilégios com escrita somente nos diretórios necessários.
- Persistência do volume entre releases, permissões, espaço livre, política de instâncias e limite de carga SQLite. Não foi assumido WAL, pois o repositório não o configura explicitamente.

O Vite embute variáveis VITE_ no build; não podem ser corrigidas somente alterando o ambiente do servidor estático. Isso está descrito na [documentação de ambiente do Vite](https://vite.dev/guide/env-and-mode). `vite preview` serve para inspeção local, não é o servidor de produção recomendado, conforme [deploy estático do Vite](https://vite.dev/guide/static-deploy.html).

## 5. Banco, migrations, backup e recuperação

### Persistência e migrations

O Prisma 6 deste checkout usa datasource SQLite no schema. URLs relativas são resolvidas a partir de `prisma/`, como documentado em `README.md:17` e confirmado pela configuração local. `file:./dev.db` não é um banco externo. Usar caminho absoluto elimina dependência da localização do schema/release, mas **não torna o armazenamento persistente por si só**.

`prisma migrate deploy` é o comando adequado para aplicar migrations existentes. Ele não substitui `prisma generate`, não valida sozinho a política de backup e não deve ser confundido com migrate dev/reset/db push. A [documentação de migrations do Prisma](https://www.prisma.io/docs/orm/migrations/applying-a-migration) distingue aplicação em produção de desenvolvimento.

Há migrations históricas que recriam tabelas: `20261007221304_expandir_modelos/migration.sql:108` a `:123` converte IDs de Empresa e recria a tabela; `20261007221725_ponto_token/migration.sql:1` recria PontoColeta preservando IDs e respostas. A última é aditiva. Os testes atuais validam casos determinados, não toda base legada possível. Antes de aplicar migrations pendentes em dados existentes, verificar histórico/checksums, ensaiar em **snapshot novo** e ter recuperação disponível. Não editar migrations já aplicadas.

Migrations devem executar uma vez, em tarefa de release com acesso ao **mesmo volume** do runtime e escritores parados quando a alteração exigir. Um job isolado sem volume pode migrar um banco vazio diferente. Em atualização, confirmar existência do banco esperado e ponto de montagem antes de executar; não aceitar criação silenciosa de um banco novo por caminho errado. No primeiro provisionamento, criação é uma decisão explícita do operador.

Manter uma instância/processo de API no lançamento. Arquivos locais distintos fragmentam dados e idempotência. Vários processos no mesmo arquivo local dependem de locking/carga e não foram dimensionados. Filesystem de rede não é solução automática para SQLite; a [documentação SQLite sobre rede](https://www.sqlite.org/useovernet.html) explica os riscos de sincronização e locks.

### Estratégia mínima de backup

1. Definir responsável, frequência, retenção, RPO (perda máxima aceitável) e RTO (tempo de recuperação); incluir backup antes de migration/release relevante.
2. Criar snapshot consistente por **SQLite Online Backup API**, `.backup` de cliente SQLite ou ferramenta equivalente validada. Não copiar apenas o `.db` enquanto a API grava; journals/WAL podem conter dados necessários. A [Backup API do SQLite](https://www.sqlite.org/backup.html) foi usada indiretamente no ensaio temporário via `node:sqlite.backup`.
3. Gravar cada snapshot em **arquivo novo**, verificar `PRAGMA integrity_check` e `PRAGMA foreign_key_check`, guardar metadados de commit/schema/data/hash e transferir para destino fora do volume/host da API, com acesso restrito e criptografia.
4. Monitorar idade e falhas do backup, espaço livre e restauração periódica. Snapshot no mesmo disco não resolve perda do volume. Nenhuma periodicidade arbitrária foi declarada suficiente sem o RPO do produto.

O ensaio desta auditoria fez backup de um SQLite criado para testes e restaurou em arquivo novo: uma resposta, quatro migrations e relações/chave mantidas. Não foi feito backup nem restore no banco existente. Recuperação sob gravações simultâneas, falha de host e transporte externo continuam pendentes.

### Procedimento de recuperação proposto, não executado em produção

1. Colocar tráfego de escrita em manutenção e parar escritores. Preservar o banco/volume afetado para diagnóstico; não apagar ou sobrescrever.
2. Selecionar snapshot pela integridade, schema e RPO; restaurá-lo em **novo diretório/volume/arquivo**, com permissões corretas. Não reutilizar journals de outro banco.
3. Validar integrity_check, foreign_key_check, `_prisma_migrations` e correspondência com a versão da API. Conferir contagens e vínculos de empresa/pesquisa/resposta, slug, token de origem e idempotência.
4. Inicializar uma API isolada apontando ao arquivo restaurado; verificar autenticação, pesquisa pública, retry, resultados e CSV. Migration adicional, se necessária, exige novo snapshot e planejamento.
5. Somente após aprovação operacional, mudar a referência ao banco restaurado e reabrir tráfego. Manter o original preservado e registrar perda de dados entre snapshot e incidente. Reversão de código não desfaz automaticamente migration ou restaura dados.

## 6. Passos manuais e comandos condicionais de implantação

**Os comandos abaixo são uma proposta para implantação futura, não foram executados contra produção.** Não executar deploy antes de resolver B1–B3 no cenário escolhido e validar o checklist. A hospedagem ainda não foi definida.

Passos manuais mínimos:

1. Escolher serviço com volume durável e uma API, domínio e topologia de proxy. Reservar backup externo e política de recuperação.
2. Resolver trust proxy de forma delimitada; prover readiness e drenagem. Esses ajustes precisam de uma tarefa de correção posterior, sem redesenho/refatoração ampla.
3. Configurar variáveis no ambiente correto, conferir igualdade das bases públicas, segredo aleatório e NODE_ENV. Definir fallback SPA, proxy, HTTPS, headers, cache e firewall.
4. Construir release/imagem nova sem `.env`, bancos, chaves, node_modules locais ou traces. Não há Dockerfile/.dockerignore versionados; se for criar uma imagem, excluir esses arquivos explicitamente em tarefa posterior. Não há obrigação de usar containers em um serviço que forneça build/runtime equivalentes.
5. Ensaiar instalação limpa/build/runtime no SO de destino; resolver execução completa E2E e realizar teste de persistência/recuperação em staging. Não reutilizar dados reais para fazer testes passarem.
6. Para migration de banco existente: backup consistente, ensaio em cópia, parada/gate apropriado e execução única no volume correto. Confirmar resultado antes de iniciar atendimento.

### Build de release em Linux, em diretório/imagem novo

Pressupõe Node 24.x e env de build definidos pela plataforma; domínios abaixo são exemplos reservados e devem ser substituídos.

```bash
node --version
npm ci --include=dev
npm run prisma:generate
npm --prefix frontend ci --include=dev
VITE_API_BASE_URL=/api VITE_FRONTEND_PUBLIC_URL=https://feedqr.example.com npm run frontend:build
```

Publicar **somente** `frontend/dist` no servidor estático. API recebe `src/`, `prisma/` e dependências/client gerados adequados ao destino. Backend não possui `npm run build` próprio. Não executar `npm ci` em uma release ativa ou copiar banco local para imagem.

### Etapa de release da API, somente com volume/secrets corretos

Pressupõe NODE_ENV=production, DATABASE_URL absoluto, backup verificado, controle de escritores e CLI instalada pelo build anterior:

```bash
npx --no-install prisma migrate status
npx --no-install prisma migrate deploy
npx --no-install prisma migrate status
```

Estes comandos de migration **não** devem ser executados durante o build sem o volume de destino. `migrate status` exige interpretar saída: migrations pendentes podem gerar exit não zero antes de deploy; não suprimir falhas de migration. Se o runtime remover devDependencies, usar executor de migration separado contendo **Prisma 6.19.3** e acesso ao volume, ou concluir migration antes de remover a CLI. `npx --no-install` evita baixar uma versão inesperada.

Inicialização por supervisor/serviço:

```bash
npm start
```

Em container que use Node diretamente como processo principal, o equivalente é:

```bash
exec node src/server.js
```

A plataforma deve publicar o PORT, manter apenas uma API escritora, montar o diretório durável e respeitar o grace period. Os handlers de shutdown ainda precisam da adequação I1; mudar o comando não os implementa.

Se frontend e API estiverem em origens distintas, trocar **no build** a API por `https://api.example.com/api`, manter base pública correta e configurar CORS da API. Se o provedor só oferecer runtime efêmero/serverless, esta sequência **não é suficiente**: escolher infraestrutura com persistência ou planejar mudança de banco separadamente.

## 7. Checklist pós-deploy — todos pendentes no ambiente real

- [ ] Release corresponde ao commit aprovado, Node 24.x e Prisma/client 6.19.3 corretos; nenhum segredo/banco/traces no pacote público ou imagem.
- [ ] NODE_ENV=production; segredo injetado; caminho absoluto aponta ao volume esperado, com permissões e espaço livre; uma instância de API.
- [ ] Migrations concluídas no banco correto; verificação de integridade/FKs; readiness comprova acesso aos dados e liveness está distinguido.
- [ ] HTTPS válido, HTTP redirecionado e API direta protegida; HTML/API com headers apropriados e nenhuma falha de CSP/mixed content.
- [ ] Abrir diretamente e atualizar `/entrar`, `/app`, `/app/pesquisas/<id>` e `/p/<slug>?origem=<token>`; query preservada e `/api` retorna JSON/PNG/CSV, nunca fallback HTML.
- [ ] Cadastro/login/sessão na mesma aba; refresh, logout, expiração e JWT inválido; outra empresa não acessa recursos, PNG, filtros, CSV ou dashboard alheios.
- [ ] Preflight real aceita Authorization/Idempotency-Key na origem autorizada; origem não listada rejeitada.
- [ ] Dois clientes com IPs reais separados têm contadores distintos; X-Forwarded-For forjado não burla limite; 429 e Retry-After coerentes. Considerar usuários que compartilham NAT no dimensionamento.
- [ ] Criar pesquisa controlada com cinco tipos, publicar e gerar ponto; link copiado e PNG representam **a mesma URL HTTPS**, slug e token.
- [ ] Ler PNG baixado com câmera física, em rede móvel; verificar clipboard, download, formulário, teclado e envio no aparelho.
- [ ] Enviar resposta válida com origem e sem origem; obrigatórias/opcionais, ponto desativado e pesquisa encerrada respeitam regras. Nenhum teste altera respostas de usuários reais.
- [ ] Perder confirmação/recarregar/repetir mesma chave gera uma resposta; nova chave representa novo envio conforme regra do produto.
- [ ] Resultados, feedbacks, paginação/filtros e CSV correspondem aos dados controlados; acentos, BOM e fórmulas protegidas, inclusive abertura no software de planilha utilizado.
- [ ] Reiniciar API e substituir release mantendo volume: empresas, pesquisas, respostas, slugs, tokens e chaves persistem; nenhuma criação silenciosa de banco vazio.
- [ ] Testar parada com requisição/CSV em andamento e prazo de drenagem; confirmar recuperação de tentativa incerta.
- [ ] Backup externo executa, valida e alerta; restaurar em **ambiente e arquivo novos**, comprovar fluxo e registrar RPO/RTO. Preservar banco de origem.
- [ ] Monitoramento de 5xx, 429, latência, disco e idade de backup ativo; medir carga esperada e CSV de tamanho representativo.

## 8. Plano mínimo de adequação e decisão

1. **Primeiro, infraestrutura:** garantir uma API com caminho absoluto em volume persistente, backup externo consistente e ensaio de recuperação. Essas decisões resolvem B1/B2; documentação sozinha não comprova a operação.
2. **Depois, ajustes pequenos de operação:** trust proxy restrito à topologia real (B3), shutdown gracioso, readiness e validação de configuração de produção. Nenhuma nova funcionalidade de produto ou redesign é necessária para isso.
3. **Empacotamento e validação:** build limpo no SO alvo, estático com fallback/proxy/HTTPS, corrigir isolamento/recursos da suíte E2E e executar uma rodada completa estável.
4. **Staging e aceite operacional:** demonstrar troca de release, backup/restore e fluxo real com HTTPS/QR no celular. Somente então reavaliar autorização para deploy e o parecer.

O código funcional, a autenticação, o isolamento, a exportação e a idempotência têm evidência atual favorável. **Não existe comprovação suficiente para declarar o FeedQR pronto para publicação segura e durável**, e há bloqueador reproduzido para a arquitetura usual com proxy. Por isso o parecer permanece **NÃO APTO PARA PRODUÇÃO**, até resolver os bloqueadores aplicáveis e concluir as verificações reais. As correções acima são propostas; nenhuma foi implementada automaticamente.
