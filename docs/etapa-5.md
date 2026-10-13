# Etapa 5 — Resultados, feedbacks e CSV

A análise está integrada às abas da própria pesquisa em `/app/pesquisas/:id`: **Resultados** (`?aba=resultados`) e **Feedbacks** (`?aba=feedbacks`). Perguntas, pontos de coleta, publicação e encerramento mantêm seus fluxos. A navegação das abas aceita setas, Home e End, com foco visível.

## Funcionalidades

Resultados mostram identificação e status da pesquisa, total de respostas, evolução diária em UTC, filtros de datas e ponto de coleta, além dos agregados por pergunta:

- ESTRELAS: média, distribuição de 1 a 5 e total válido.
- NPS: indicador de −100 a 100, detratores (0–6), passivos (7–8) e promotores (9–10), com contagens e percentuais. A API mantém o campo existente `neutros`; a interface detalhada o apresenta como passivos.
- SIM_NAO: contagens e percentuais de Sim e Não, preservando o valor booleano false.
- MULTIPLA_ESCOLHA: alternativas na ordem cadastrada, com contagens e percentuais, incluindo alternativas com zero respostas.
- TEXTO: total e acesso às respostas completas, sem análise artificial.

Os percentuais usam o total de respostas válidas da própria pergunta, não o total da pesquisa. Perguntas opcionais podem ter totais menores. Os gráficos e tabelas reutilizam QuestionMetrics e ResponseTimeline; o dashboard existente mantém sua apresentação. Dados diários têm uma tabela acessível. Estados sem respostas, perguntas sem respostas, filtros vazios, carregamento, falhas e tentativa novamente recebem mensagens próprias.

Feedbacks apresentam pesquisa, data/hora no fuso local do navegador, origem (ou “Sem origem”) e todos os valores respondidos, com texto completo e quebras de linha. A paginação é da API, com 10, 20, 50 ou 100 respostas por página. Filtros de período, ponto, pergunta e nota podem ser combinados. Nota só é aceita para ESTRELAS ou NPS; nota zero é preservada. Datas do período são inclusivas em UTC.

Filtros aplicados ficam na URL e sobrevivem a refresh. Trocar filtros reinicia a paginação. Editar um campo sem clicar em Aplicar não altera a consulta nem o CSV dos dados exibidos.

## CSV

O download usa o CSV binário original do backend e JWT. Mantém BOM UTF-8, separador `;`, escape de aspas/quebras de linha e proteção contra fórmulas. O frontend não recria ou converte o conteúdo. Valida o tipo `text/csv`, rejeita arquivos vazios e usa nome seguro `pesquisa-<UUID>.csv`.

A exportação inclui todos os feedbacks correspondentes aos filtros aplicados, não apenas a página atual. Nos Resultados, aplica datas e ponto; nos Feedbacks, aplica também pergunta e nota. Quando filtrado por pergunta/nota, o backend seleciona feedbacks que satisfazem o critério e exporta todas as perguntas respondidas desses feedbacks. Erros de API, conexão e limite de download são apresentados sem gerar um arquivo inválido.

## Contratos e segurança

Endpoints autenticados existentes:

- `GET /api/pesquisas/:id`, `/api/pesquisas/:id/perguntas` e `/api/pesquisas/:id/pontos`.
- `GET /api/pesquisas/:id/resultados?inicio&fim&pontoColetaId`.
- `GET /api/pesquisas/:id/feedbacks?inicio&fim&pontoColetaId&perguntaId&nota&pagina&limite`.
- `GET /api/pesquisas/:id/exportar?inicio&fim&pontoColetaId&perguntaId&nota`.

A única extensão do backend acrescenta `distribuicao` aos resultados SIM_NAO (`{ valor: boolean, quantidade }`) e MULTIPLA_ESCOLHA (`{ id, texto, quantidade }`). Os campos atuais permanecem. As consultas agregadas usam os mesmos filtros e restrições de empresa já existentes. Não foram necessárias migrations, resets ou alterações no banco de desenvolvimento.

JWT, CORS, rate limits, Zod, regras de publicação, isolamento entre empresas e idempotência pública foram mantidos. Apenas os bancos temporários dos testes recebem fixtures.

## Refinamentos públicos

O progresso representa perguntas alcançadas: `(posição + 1) / quantidade`, chegando a 100% na última pergunta, inclusive quando só existe uma. O rodapé decorativo fica oculto durante o preenchimento mobile. O símbolo QR com check recebe uma confirmação curta em CSS; animações não essenciais são desativadas em movimento reduzido. Sucesso depende da confirmação da API.

O rascunho usa `sessionStorage` no namespace `feedqr.public.v1:`, isolado por slug e token de origem. Salva respostas, posição e etapa. Após refresh, busca novamente a pesquisa pública, valida os valores contra suas perguntas atuais e descarta IDs/valores inválidos. Não armazena JWT ou informações administrativas nesse namespace.

Antes da chamada de envio, salva também o payload exato e a Idempotency-Key. Se a confirmação se perder, o refresh restaura a tentativa e mantém a edição bloqueada até sua confirmação: a chave só é reutilizada com o mesmo payload validado. Rejeições definitivas descartam a tentativa, preservam o preenchimento e permitem correções com uma nova chave. Após sucesso confirmado, remove o rascunho da pesquisa/origem. Armazenamento negado, cheio ou corrompido não impede o uso do formulário em memória.

## Testar manualmente

1. Inicie backend e frontend conforme [Etapa 4](etapa-4.md). Entre no painel.
2. Crie uma pesquisa, cadastre os cinco tipos, publique e crie um ponto de coleta. Abra o QR/link em outra aba, responda parcialmente e atualize a página: os valores e a posição devem reaparecer.
3. Envie e confira o agradecimento. O rascunho deve ser removido apenas após a confirmação.
4. Abra a pesquisa no painel e selecione Resultados. Confira total, distribuição, evolução e filtros de período/origem.
5. Entre em Feedbacks, combine período, origem e nota de uma pergunta de estrelas/NPS. Confira paginação e refresh da URL.
6. Exporte CSV e abra no Excel. Confira acentos, dados e correspondência com os filtros. O download não se limita à página atual.
7. Abra `/p/<slug>` sem origem e envie outra resposta. O feedback correspondente deve mostrar “Sem origem”.

## Arquivos principais

- `src/services/resultadoService.js`: extensão dos agregados.
- `frontend/src/views/SurveyDetailView.vue`: abas integradas.
- `frontend/src/components/SurveyResults.vue`, `SurveyFeedbacks.vue`, `AnalyticsFilters.vue`: análise e consulta.
- `frontend/src/components/QuestionMetrics.vue` e `PaginationControl.vue`: extensões compatíveis dos componentes compartilhados.
- `frontend/src/styles/analytics.css`: composição editorial, filtros, distribuições e responsividade.
- `frontend/src/lib/analytics.js`, `services/analytics.js`, `composables/useAnalyticsFilters.js` e `useCsvExport.js`: filtros, formatação, integração e download.
- `frontend/src/lib/api.js`: leitura binária de CSV autenticado.
- `frontend/src/lib/publicSurveyStorage.js`, `composables/usePublicSurvey.js`, `views/PublicSurveyView.vue` e `styles/public-survey.css`: persistência, progresso e confirmação pública.
- `tests/analytics.test.js`, `frontend/tests/unit/analytics.test.js`, `publicSurveyStorage.test.js`, `frontend/tests/e2e/stage5.spec.js` e `public-survey.spec.js`: testes desta entrega.
- `docs/etapa-4.md`, `docs/etapa-5.md` e `README.md`: documentação atualizada.

## Capturas e limites

Capturas renderizadas ficam em `frontend/artifacts/stage5/<largura>/`, para 360, 390, 768 e 1440px: `resultados.png`, `estrelas.png`, `nps.png`, `feedbacks.png`, `feedback-individual.png` e `filtros.png`. `frontend/artifacts/stage5/agradecimento-mobile.png` registra a confirmação pública refinada. Artefatos são ignorados pelo Git.

Não há scripts de lint ou checagem de tipos neste projeto JavaScript. O teclado virtual é aproximado por viewport reduzido nos testes; câmera e teclado de um celular físico não foram testados. Se sessionStorage estiver indisponível, o formulário continua em memória, mas não consegue preservar o rascunho após refresh. Dados de uma aba encerrada não são compartilhados com outra sessão.

## Verificação da entrega

- `npm test`: **41 testes de backend passaram**, em 6 arquivos.
- `npm run frontend:test`: **62 testes unitários passaram**, em 9 arquivos.
- `npm --prefix frontend run test:e2e -- public-survey.spec.js stage5.spec.js`: **27 testes passaram**, incluindo persistência, confirmação incerta, cinco tipos, QR real, origem, resultados, feedbacks e CSV.
- `npm --prefix frontend run test:e2e -- stage5.spec.js admin.spec.js stage3.spec.js`: **33 testes passaram**, incluindo 24 regressões do dashboard, editor e pontos. No total, foram verificados **51 casos E2E distintos**.
- `npm run frontend:build`: build de produção concluído com sucesso.
- `npx prisma validate`: schema válido; nenhuma migration nova nesta etapa.
- `git diff --check`: sem erros. Alterações locais anteriores preservadas.
- Capturas reais de desktop e mobile foram inspecionadas, incluindo gráficos, filtros, feedback individual e agradecimento. Os E2E verificaram ausência de rolagem horizontal nas larguras solicitadas.

Os bancos temporários foram utilizados nos testes; as verificações de integridade do banco de desenvolvimento passaram. Não foi necessário resetar, apagar ou recriar dados existentes.
