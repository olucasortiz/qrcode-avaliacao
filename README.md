# FeedQR Backend

Node.js 24+, Express, JavaScript ES Modules, Prisma e SQLite.

## Instalacao e configuracao

```bash
npm install
```

Crie `.env` a partir de `.env.example` e configure:

| Variavel | Uso |
| --- | --- |
| `PORT` | Porta HTTP; padrao 3000 |
| `NODE_ENV` | `development` localmente; `production` na implantacao |
| `DATABASE_URL` | SQLite, por exemplo `file:./dev.db` (relativo a `prisma/`) |
| `FRONTEND_PUBLIC_URL` | URL base usada pelo QR Code, sem query ou fragmento |
| `CORS_ORIGINS` | Origens permitidas, separadas por virgula, sem barra final ou `*` |
| `JWT_SECRET` | Segredo aleatorio de pelo menos 32 caracteres |

Gere o segredo localmente e coloque o resultado somente no `.env`:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

`.env`, bancos locais e arquivos de chaves sao ignorados pelo Git. Nao versione segredos. Ao executar em producao, defina `NODE_ENV=production`.

## Banco e execucao

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

`migrate dev` aplica migrations e gera o client; `generate` apenas regenera o client. Para aplicar migrations existentes em producao, use `npx prisma migrate deploy` e inicie com `npm start`.

API local: `http://localhost:3000/api`. O script `dev` observa somente arquivos JS de `src/`.

## Testes

```bash
npm test
npm run test:watch
npm audit
```

Vitest e Supertest criam um SQLite temporario por arquivo de teste, aplicam as migrations e removem o banco ao terminar. `DATABASE_URL` e sobrescrita antes de importar o Prisma; a suite verifica que `prisma/dev.db` nao foi alterado. `TEST_DATABASE_URL` e interna da suite e nao deve ser configurada no `.env`.

Os overrides de `deepmerge-ts` e `chokidar` eliminam avisos de seguranca das dependencias de desenvolvimento. A suite verifica migrations e reinicio do nodemon com caminhos literais.

## Autenticacao

`POST /api/auth/cadastro` cria uma empresa e seu primeiro usuario:

```json
{
  "empresa": { "nome": "Minha empresa", "email": "empresa@example.com" },
  "nome": "Responsavel",
  "email": "usuario@example.com",
  "senha": "senha-com-8-ou-mais-caracteres"
}
```

`POST /api/auth/login`: `{ "email": "usuario@example.com", "senha": "..." }`.
Ambas retornam `token` e dados seguros do usuario. Senhas usam bcrypt com custo 12 e limite de 72 bytes UTF-8. O JWT HS256 expira em uma hora.

Envie `Authorization: Bearer <token>` nas rotas privadas. A empresa vem do usuario consultado no banco, nunca do corpo da requisicao ou de uma claim de empresa.

## Endpoints

| Metodo | Rota | Acesso |
| --- | --- | --- |
| GET | `/api/health` | Publico |
| POST | `/api/auth/cadastro`, `/api/auth/login` | Publico |
| GET, POST | `/api/pesquisas` | JWT |
| GET, PATCH, DELETE | `/api/pesquisas/:id` | JWT |
| GET, POST | `/api/pesquisas/:pesquisaId/perguntas` | JWT |
| GET, PATCH, DELETE | `/api/pesquisas/:pesquisaId/perguntas/:id` | JWT |
| POST | `/api/pesquisas/:id/publicar` | JWT |
| GET, POST | `/api/pesquisas/:pesquisaId/pontos` | JWT |
| GET, PATCH, DELETE | `/api/pontos/:id` | JWT |
| GET | `/api/pontos/:id/qrcode` | JWT; PNG |
| GET | `/api/dashboard`, `/api/pesquisas/:id/resultados` | JWT |
| GET | `/api/pesquisas/:id/feedbacks` | JWT |
| GET | `/api/pesquisas/:id/exportar` | JWT; CSV |
| GET | `/api/public/pesquisas/:slug` | Publico |
| POST | `/api/public/pesquisas/:slug/respostas` | Publico |

Pesquisa: `{ "titulo": "Satisfacao", "descricao": "Opcional", "slug": "satisfacao" }`; sem slug, um UUID publico e gerado. Pergunta: `{ "texto": "Como foi?", "tipo": "ESTRELAS", "ordem": 0, "obrigatoria": true }`. Para `MULTIPLA_ESCOLHA`, envie `opcoes: [{ "texto": "A", "ordem": 0 }, { "texto": "B", "ordem": 1 }]`.

Pesquisas e perguntas podem ser editadas ou excluidas somente em RASCUNHO. Publicacao exige perguntas validas. Encerre uma pesquisa ATIVA com `PATCH /api/pesquisas/:id` e `{ "status": "ENCERRADA" }`. Pontos com respostas devem ser desativados com `{ "ativo": false }`, preservando o historico.

As rotas publicas aceitam `origem` opcional como query; no envio, tambem no corpo. Respostas usam `{ "respostas": [{ "perguntaId": "UUID", "valor": 5 }] }`. O valor depende do tipo: estrelas 1-5, NPS 0-10, booleano, texto de ate 2000 caracteres ou UUID da opcao. Payloads sao limitados a 64 KB.

## Filtros e exportacao

Dashboard/resultados: `inicio`, `fim` (`YYYY-MM-DD`, dias inclusivos em UTC), `pesquisaId`, `pontoColetaId`.

Feedbacks: `inicio`, `fim`, `pontoColetaId`, `perguntaId`, `nota`, `pagina` (padrao 1) e `limite` (padrao 20, maximo 100). `nota` exige uma pergunta ESTRELAS ou NPS da pesquisa. A listagem retorna `{ itens, pagina, limite, total, totalPaginas }`, com avaliacoes mais recentes primeiro. O filtro seleciona avaliacoes e mantem todas as respostas de cada avaliacao.

CSV aceita os mesmos filtros, exceto paginacao. A exportacao usa lotes de 100 avaliacoes, UTF-8 com BOM, separador `;` e uma linha por pergunta respondida. Campos sao delimitados por aspas, aspas internas sao duplicadas e formulas recebem um apostrofo inicial.

Limites por 15 minutos: autenticacao 10/IP, leitura publica 120/IP, envio 30/IP, rotas privadas 300/IP e exportacao 5/usuario. O servidor nao confia em `X-Forwarded-For`; configure um proxy confiavel explicitamente ao implantar atras de um proxy.

Erros usam `{ "erro": "mensagem" }`, com `detalhes` na validacao Zod. Codigos: 400 entrada invalida, 401 autenticacao, 403 CORS, 404 registro ausente ou de outra empresa, 409 conflito, 413 payload, 415 codificacao e 429 rate limit.

## Frontend: etapas 1 a 5

Vue 3, Vite e Vue Router em `frontend/`. Inclui autenticacao, dashboard com filtros e grafico diario, resultados individuais por pergunta, gerenciamento de pesquisas, editor dos cinco tipos de pergunta, pontos de coleta e QR Codes. Rascunhos podem ser editados e excluidos; publicacao e encerramento exigem confirmacao. A rota publica `/p/:slug?origem=:token` permite responder sem cadastro, uma pergunta por vez, com validacao, envio e agradecimento.

Consulte [Etapa 4 — pesquisa publica](docs/etapa-4.md) para contratos, idempotencia, configuracao das URLs, testes pelo navegador/celular e local das capturas.

A [Etapa 5 — resultados, feedbacks e CSV](docs/etapa-5.md) integra as abas de analise por pesquisa, filtros na URL, paginação real e download autenticado de CSV. Também acrescenta persistência pública após refresh, preservando tentativas incertas de envio com idempotência.

```bash
npm --prefix frontend install
npm run dev
```

Em outro terminal:

```bash
npm run frontend:dev
```

Abra `http://127.0.0.1:5173`. O Vite encaminha `/api` ao backend local, sem alterar seu CORS. Consulte `frontend/.env.example` para `VITE_API_BASE_URL` e `API_PROXY_TARGET`; nunca coloque segredos em variaveis `VITE_`. Em producao, sirva o build com fallback de rotas SPA e encaminhe `/api` ao backend, ou configure a URL da API e uma origem CORS permitida.

Tokens visuais: `frontend/src/styles/tokens.css`. Rotas: `/entrar`, `/cadastro`, `/app` (dashboard), `/app/pesquisas`, `/app/pesquisas/:id` e `/app/conta`. Componentes e layouts sao separados dos services e do cliente HTTP. A sessao usa `sessionStorage`, expira em uma hora e e verificada em `/api/pesquisas?limite=1` ao restaurar; logout e local, pois a API nao oferece revogacao.

Verificacao: `npm run frontend:build`, `npm run frontend:test`. Para testes reais no navegador, instale Chromium com `npm --prefix frontend exec -- playwright install chromium` e execute `npm run frontend:e2e`. O navegador usa backend e SQLite temporarios nas portas 4177/4178, sem cadastrar usuarios no banco de desenvolvimento. Capturas nas quatro resolucoes ficam em `frontend/artifacts/`, ignoradas pelo Git.
