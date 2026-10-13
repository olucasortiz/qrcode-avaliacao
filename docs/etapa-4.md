# Etapa 4 — Pesquisa pública FeedQR

A experiência pública está em `/p/:slug?origem=:token`, independente de autenticação e do layout administrativo. A tela inicial usa o título e a descrição reais da pesquisa. O fluxo apresenta uma pergunta por vez, permite voltar sem perder respostas e só mostra agradecimento após a confirmação da API.

O visual reutiliza a marca, IBM Plex Sans e o verde `#176B53`. A composição editorial tem fundo claro, grafismos QR em SVG e transições CSS com suporte a movimento reduzido. Os controles usam radios nativos, foco visível, alvos de pelo menos 44px e mensagens associadas aos campos. O formulário e os botões ficam no fluxo da página para permitir rolagem com o teclado virtual aberto.

## Contrato e armazenamento

- `GET /api/public/pesquisas/:slug?origem=:token`: retorna `{ titulo, descricao, slug, perguntas }`. O DTO não inclui status ou ordem: a API seleciona somente pesquisas ATIVAS e já ordena perguntas e alternativas. O frontend preserva essa ordem e valida a estrutura recebida.
- `POST /api/public/pesquisas/:slug/respostas`: recebe `{ origem?, respostas: [{ perguntaId, valor }] }`. A origem é enviada no corpo; o token é validado novamente e convertido em `pontoColetaId` no servidor.
- Valores: ESTRELAS é inteiro 1–5; NPS é inteiro 0–10; SIM_NAO é booleano; TEXTO é uma string não vazia após trim de até 2.000 caracteres; MULTIPLA_ESCOLHA é o UUID de uma alternativa da pergunta.
- Perguntas opcionais vazias são omitidas. `respostas: []` é aceito somente quando nenhuma pergunta é obrigatória. Essa correção permite pular todas as opcionais; a validação de obrigatoriedade permanece no servidor.
- GET retorna 404 para pesquisa inexistente, rascunho ou encerrada. O token ausente permite coleta sem ponto; token malformado, desconhecido, de outra pesquisa ou desativado é rejeitado. A interface não expõe mensagens internas.

O envio usa o cabeçalho opcional `Idempotency-Key` com UUID aleatório por tentativa. A migration `20261008120000_resposta_idempotencia` adiciona dois campos opcionais à tabela Resposta: chave única e hash do payload. Clientes antigos continuam funcionando sem esse cabeçalho. Envios idênticos com a mesma chave, inclusive concorrentes, confirmam o registro existente; a mesma chave com pesquisa, origem ou respostas diferentes retorna 409. Respostas existentes são preservadas.

A interface bloqueia cliques e edição durante o envio. Se a confirmação se perder ou houver falha de servidor, mantém o mesmo payload/chave e permite confirmar novamente. Uma rejeição definitiva permite revisar os valores antes de uma nova tentativa. O limite de 64KB também é verificado no navegador, considerando bytes UTF-8.

## Executar e testar pelo navegador

Na raiz do projeto, com `.env` configurado:

```powershell
npm install
npm --prefix frontend install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Em outro terminal:

```powershell
npm run frontend:dev
```

Se o Prisma informar EPERM ao substituir sua DLL no Windows, pare o backend, execute `npx prisma generate` e reinicie o backend. O processo em execução pode manter o arquivo aberto.

Use a mesma URL base na configuração do backend e do frontend. Para o padrão local:

```dotenv
# .env (backend)
FRONTEND_PUBLIC_URL=http://127.0.0.1:5173
CORS_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

```dotenv
# frontend/.env.local
VITE_API_BASE_URL=/api
API_PROXY_TARGET=http://127.0.0.1:3000
VITE_FRONTEND_PUBLIC_URL=http://127.0.0.1:5173
```

`VITE_FRONTEND_PUBLIC_URL` é opcional e controla o link copiado/aberto no painel. Sem ela, o painel usa a origem atual do navegador. Configure-a igual a `FRONTEND_PUBLIC_URL` quando a URL de acesso ao painel for diferente da URL pública do QR Code. Reinicie Vite e backend após mudar suas variáveis.

Abra `http://127.0.0.1:5173`, crie uma pesquisa no painel, cadastre as perguntas, publique, crie um ponto e abra seu QR Code. Abra o link em uma janela anônima, responda e envie. Após a confirmação, atualize o dashboard e filtre pela pesquisa e pelo ponto: o total deve refletir a coleta. O envio direto por `/p/<slug>` também funciona, sem ponto de origem.

## Testar QR Code no celular

1. Conecte computador e celular à mesma rede Wi-Fi. Encontre o IPv4 da conexão ativa com `ipconfig`.
2. Substitua `<IP_DA_MAQUINA>` abaixo pelo endereço da sua conexão; os valores são configuração local, não código versionado.
3. No `.env` do backend, defina `FRONTEND_PUBLIC_URL=http://<IP_DA_MAQUINA>:5173` e inclua `http://<IP_DA_MAQUINA>:5173` em `CORS_ORIGINS`.
4. Em `frontend/.env.local`, mantenha `VITE_API_BASE_URL=/api` e `API_PROXY_TARGET=http://127.0.0.1:3000`; defina `VITE_FRONTEND_PUBLIC_URL=http://<IP_DA_MAQUINA>:5173`.
5. Reinicie o backend com `npm run dev`. Inicie o frontend com `npm --prefix frontend run dev -- --host 0.0.0.0`.
6. Caso o sistema solicite, permita o acesso do Node à rede privada. Abra `http://<IP_DA_MAQUINA>:5173` no celular para verificar conectividade.
7. Gere/baixe novamente o QR Code no painel após alterar a URL e escaneie-o com o celular. O navegador usa a API pelo proxy de mesma origem; não precisa acessar a porta 3000 diretamente.

Em produção, configure a URL pública real, HTTPS e fallback SPA para `/p/*`. Sirva `/api` pelo proxy ou configure `VITE_API_BASE_URL` e CORS para a API real. Variáveis `VITE_` são públicas e não devem conter segredos.

## Verificação e capturas

```powershell
npm test
npm run frontend:test
npm run frontend:build
npm run frontend:e2e
```

Os testes de backend e E2E usam SQLite temporário, aplicam migrations e verificam que o banco de desenvolvimento não mudou. Os E2E usam a API real para criar, publicar, gerar o PNG do QR Code, responder e verificar resultados por origem. Mocks de transporte são restritos aos testes de erro/carregamento: não existem no fluxo real.

Os testes públicos verificam 360, 390, 430, 768 e 1440 CSS pixels, incluindo todos os tipos, envio e agradecimento. Capturas renderizadas ficam em `frontend/artifacts/stage4/<largura>/`: `inicio.png`, `estrelas.png`, `nps.png`, `sim-nao.png`, `texto.png`, `alternativas.png` e `obrigado.png`. O PNG real verificado fica em `frontend/artifacts/stage4/qrcode-real.png`. Esses artefatos são ignorados pelo Git.

Não há scripts de lint ou checagem de tipos neste projeto JavaScript. A redução da altura do viewport é testada como aproximação do teclado virtual; a interação com teclado virtual e câmera deve ser verificada também em um celular físico.

Os [refinamentos da Etapa 5](etapa-5.md) acrescentam persistência em sessionStorage, isolada por pesquisa e origem, incluindo a chave e o payload de tentativas incertas. Após refresh, os valores são validados contra a pesquisa atual. Sucesso confirmado remove o rascunho. Se o armazenamento estiver indisponível, o formulário continua funcionando em memória. A idempotência não impede novas respostas intencionais em outra visita.

## Arquivos da implementação

Criados:

- `frontend/src/views/PublicSurveyView.vue`: abertura, navegação, progresso, erros e agradecimento.
- `frontend/src/components/PublicQuestionInput.vue` e `PublicSurveyMark.vue`: controles dos cinco tipos e grafismo QR.
- `frontend/src/styles/public-survey.css`: identidade visual pública e responsividade.
- `frontend/src/composables/usePublicSurvey.js`: estado, validação, navegação e envio seguro.
- `frontend/src/lib/publicSurveySchemas.js` e `frontend/src/services/publicSurveys.js`: contrato, payload e acesso público à API.
- `frontend/tests/unit/publicSurvey.test.js`, `publicSurveysService.test.js` e `frontend/tests/e2e/public-survey.spec.js`: testes da Etapa 4.
- `tests/publicResponse.test.js`: integração, concorrência, validação, origem e idempotência.
- `prisma/migrations/20261008120000_resposta_idempotencia/migration.sql`: migration aditiva.
- `docs/etapa-4.md`: documentação da entrega e teste pelo celular.

Modificados nesta etapa:

- `frontend/src/router/index.js`: rota pública e dispensa de restauração da sessão nessa rota.
- `frontend/src/lib/api.js`: cabeçalho opcional de idempotência.
- `frontend/src/components/PointManager.vue`: URL pública configurável para copiar/abrir o link; mantém o design existente.
- `frontend/.env.example` e `.env.example`: configuração consistente de URLs.
- `src/app.js`: CORS para o cabeçalho de idempotência.
- `src/controllers/publicController.js`: validação da chave e encaminhamento ao serviço.
- `src/services/respostaService.js`: reconhecimento transacional de retries.
- `src/utils/schemas.js`: permite array vazio, com validação de obrigatoriedade no serviço.
- `prisma/schema.prisma`: dois campos opcionais de idempotência em Resposta.
- `tests/migration.test.js`: preservação de registros existentes após a nova migration.
- `README.md`: atualização das etapas e link para esta documentação.

As alterações locais de etapas anteriores foram preservadas; nenhuma dependência foi adicionada.

## Resultado da verificação da entrega original da Etapa 4

- Backend: 36 testes passaram em 5 arquivos, incluindo concorrência, origem e preservação na migration.
- Frontend: 49 testes unitários passaram em 7 arquivos.
- Navegador: 52 testes E2E passaram, incluindo as etapas existentes e a coleta pública nas cinco larguras solicitadas.
- Build de produção do Vite: concluído com sucesso.
- `prisma validate` e `git diff --check`: concluídos sem erros.
- `prisma migrate deploy`: nova migration aplicada ao banco local.
- Capturas reais foram inspecionadas em desktop, tablet e mobile. Uma quebra indevida do número de alternativas longas foi corrigida e as capturas regeneradas.
- `prisma generate` emitiu os arquivos JS/tipos atualizados, mas retornou EPERM ao substituir a DLL usada pelo backend local. A execução normal e todos os testes validaram o client atualizado com o engine existente. Para concluir novamente a geração pelo comando padrão, pare o backend antes de executá-lo, conforme explicado acima.

O teclado virtual e a câmera de um aparelho físico não foram testados nesta entrega.
