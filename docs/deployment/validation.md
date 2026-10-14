# TASK 17 — evidências e arquivos

Data: 14/10/2026. Sistema local Windows, Node 24.21.0, npm 11.19.0. Referência operacional, configurações de provedores, checklist e rollback: [production.md](production.md).

## Resultado

Preparação local concluída. **Liberação pública condicionada** à revisão/publicação da branch MongoDB, setup manual dos provedores/Atlas, verificação de permissões e testes HTTPS reais. Nada foi implantado. Não foi criado usuário Atlas nem recurso de hospedagem nesta tarefa.

## Verificações realizadas

| Verificação | Resultado |
| --- | --- |
| Branch pública | git fetch origin main; main `2bc755c` usa SQLite; local `1373dd5` em feat/mongodb-migration usa MongoDB |
| Instalação API | npm --prefix backend ci --include=dev: sucesso pelo lock movido para backend |
| Instalação SPA | npm --prefix frontend ci: sucesso |
| Prisma validate | Sucesso com DATABASE_URL sintética local, sem conectar a banco; primeira tentativa sem DATABASE_URL foi corretamente rejeitada pela CLI |
| Prisma generate / backend build | Sucesso, Prisma Client 6.19.3, oito modelos; schema gerado, canônico e alternativo equivalentes após ignorar whitespace |
| Backend completo | **67 testes passaram em 12 arquivos**, após correções; replica sets MongoDB locais descartáveis |
| Regressão de configuração/manifest | **14 testes passaram** em productionConfig + mongoSync após endurecer flags TLS (case/duplicação), sem bypass de certificate checks |
| Frontend unitário | **71 testes passaram em 10 arquivos**, incluindo nove novos checks de deployment/CSP |
| E2E Chromium | **64 testes passaram**, API Express real + MongoDB replica set temporário + SPA Vite; auth, admin, tenants, QR, respostas, idempotência, gráficos, CSV, estados e teclado |
| Frontend production build | Sucesso com API/origem públicas sintéticas `.invalid`, sem warnings de build; dist contém _headers, _redirects e bundle com API HTTPS |
| Produção API — smoke local | npm start real em NODE_ENV=production, porta escolhida no ambiente, bind 0.0.0.0, liveness 200, readiness 503 sanitizada para host `.invalid`, admin 401, CORS 403 e headers corretos |
| API — cópia isolada | Pasta temporária sem .env, dados locais ou client pré-gerado; npm ci --include=dev → npm run build → npm prune --omit=dev → npm run production:smoke passaram. Não depende do node_modules na raiz do checkout. Última alteração do módulo Prisma também verificada nessa cópia. |
| SPA — smoke do bundle | Serviço estático HTTP local emula _headers e fallback, usa dist real e API sintética interceptada no browser; assets/CSP sem erros, refresh público, guard admin e ausência de overflow em 360/1440px passaram |
| Inspeção visual | Screenshots da suíte inspecionadas: dashboard 360/1440px, pergunta pública 360px, início público 1440px. Layouts existentes preservados; nenhum defeito concreto observado nessas imagens. E2E verifica também 768/1024px e outras larguras móveis. |
| Segurança dos arquivos | 189 arquivos de texto inspecionados na varredura final de candidatos/segredos locais: zero achados; URIs aparentes eram placeholders percent-encoded ou ***. Nenhum .env real no histórico Git buscado. Sem chave privada/banco local versionados. Varredura heurística, sem exibir valores secretos. |
| npm audit | API completa, API omit=dev e SPA: **zero vulnerabilidades reportadas** na data da execução |
| Diff | git diff --check: sem erros de whitespace |

As primeiras falhas dos novos testes (URL inválida sendo lançada fora da sanitização e assert do formato draft-8 de RateLimit) foram corrigidas; as verificações finais passaram. Testes legados deixaram de exigir a presença de um banco SQLite particular em clones limpos; se o arquivo local existir, seu hash inicial continua protegido.

## Limitações da validação

- Não houve teste no runtime Linux do Render, DNS/HTTPS público, CDN Pages real, Atlas remoto, TLS real de banco, custom role de produção, allowlist Render→Atlas, carga sustentada ou backup/restore real. Pendências explicitamente listadas no runbook.
- Smoke API usa um host reservado `.invalid` e testa o caminho de banco indisponível. Conexão bem-sucedida/readiness 200 e transações são cobertas pelos testes MongoDB locais, não por esse smoke production.
- Smoke SPA emula comportamento Pages localmente com dados sintéticos; não certifica processamento de _headers/_redirects pelo provedor. Esses artefatos devem ser conferidos no host real.
- Lint e typecheck não foram executados: não há scripts/configuração existentes para essas verificações; o projeto é JavaScript.
- A suíte backend emite MaxListenersExceededWarning durante requisições concorrentes de Supertest. Não foi observada falha de teste; isso não comprova vazamento no servidor público. Monitorar comportamento sob carga real.
- npm 11.19.0 avisou sobre install scripts sem allowScripts explícito. Build/client/native bcrypt e partida isolada passaram neste Windows. Confirmar instalação/engine/bcrypt no Linux do provedor antes do aceite.
- npm prune remove driver operacional MongoDB e testes, mas retém a CLI Prisma como peer opcional do client. Nenhuma operação de schema é invocada no start.
- Rate limits permanecem locais ao processo, resetam com restarts e podem somar entre instâncias/releases; plano Render Free tem cold starts. O fluxo pode atingir timeout de 15 s; aceitação de disponibilidade e proteção de borda permanece manual.
- Frontend mantém Bearer em sessionStorage, acessível a scripts da origem; CSP reduz superfície, mas não é garantia contra todo XSS. Token de uma aba encerrada/logout pode continuar válido por até 1 h se copiado.

## Arquivos alterados/criados pela tarefa

| Grupo | Arquivos / efeito |
| --- | --- |
| Versionamento/runtime | `.gitignore`, `.node-version`, `backend/.node-version`, `frontend/.node-version`; exceção para runbook e exclusão do client gerado |
| Pacotes/build | novo `package.json` raiz com encaminhamentos, `package-lock.json` raiz mínimo, `backend/package.json`, `frontend/package.json`, `frontend/package-lock.json`; lock API movido/criado em `backend/package-lock.json` sem upgrade de dependências |
| Test runner | `vitest.config.js` movido da raiz para `backend/vitest.config.js` |
| Hospedagem/env | `render.yaml`, `backend/.env.example`, `backend/.env.production.example`, `frontend/.env.production.example` |
| API/config/segurança | `backend/src/config/env.js`, `backend/src/config/prisma.js`, `backend/src/app.js`, `backend/src/server.js`, `backend/src/controllers/healthController.js`, `backend/src/services/healthService.js`, `backend/src/middlewares/errorMiddleware.js` |
| Inspeção de schema | `backend/scripts/sync-mongodb.js`, `backend/scripts/verify-atlas.js` |
| Testes API | `backend/tests/productionConfig.test.js`, `backend/tests/mongoSync.test.js`, `backend/tests/api.test.js`, `backend/tests/syntheticBaseline.test.js`, `backend/tests/migrationSqliteToMongo.test.js`, `backend/tests/rollbackMongoToSqlite.test.js` |
| SPA config | `frontend/vite.config.js`, `frontend/src/lib/deploymentConfig.js`, `frontend/public/_redirects` |
| Testes SPA | `frontend/tests/unit/deploymentConfig.test.js`, `frontend/tests/e2e/api-server.js`, `frontend/tests/e2e/seed-admin.js`, `frontend/tests/e2e/auth.spec.js` |
| Smokes reproduzíveis | `backend/scripts/check-production-start.js`, `frontend/scripts/check-pages-build.js` |
| Runbook | `docs/deployment/production.md`, `docs/deployment/validation.md` |
| Client gerado | 26 arquivos em `backend/src/generated/mongo-client/` removidos **apenas do índice Git** e ignorados, incluindo DLL Windows e .tmp; arquivos locais preservados/regenerados. Essas remoções estão staged; os outros ajustes permanecem para revisão. |

Não houve alteração de modelos de dados, migrations históricas, layout/componentes visuais ou conteúdo dos arquivos `.env` reais. Alterações concorrentes no README foram preservadas e não pertencem à tarefa. A exclusão local prévia de `docs` no .gitignore foi adaptada para permitir somente os novos documentos de deployment.

## Repetir os checks

```sh
npm --prefix backend ci --include=dev
npm --prefix frontend ci
npm run prisma:generate
# Para validate, fornecer uma URI sintética ou do ambiente de desenvolvimento, nunca senha em histórico shell.
npm run prisma:validate
npm test
npm run frontend:test
npm run frontend:e2e
npm --prefix backend run production:smoke
```

Para build/smoke da SPA em PowerShell, URLs sintéticas e sem conexão a produção:

```powershell
$env:DEPLOYMENT_TARGET='cloudflare-pages'
$env:VITE_API_BASE_URL='https://feedqr-api.example.invalid/api'
$env:VITE_FRONTEND_PUBLIC_URL='https://feedqr.example.invalid'
npm run frontend:build
npm --prefix frontend run production:smoke
```

Instalar Chromium com `npm --prefix frontend exec playwright install chromium` caso ausente. O smoke SPA aceita somente API `.invalid`; não usá-lo com bundle apontado a produção. Variáveis temporárias acima são somente para o shell local, não para o deploy.
