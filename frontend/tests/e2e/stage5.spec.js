import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import QRCode from 'qrcode';
let session, headers, survey, questions, points, filteredPoint;
test.beforeAll(async ({ request }) => {
  const response = await request.post('/api/auth/login', { data: { email: 'admin-browser@example.com', senha: 'FeedQR-browser-123' } });
  expect(response.status()).toBe(200); session = await response.json(); headers = { Authorization: `Bearer ${session.token}` };
  const list = await (await request.get('/api/pesquisas?limite=100', { headers })).json();
  survey = list.itens.find(item => item.slug === 'atendimento-teste');
  questions = await (await request.get(`/api/pesquisas/${survey.id}/perguntas`, { headers })).json();
  points = await (await request.get(`/api/pesquisas/${survey.id}/pontos`, { headers })).json();
  const matching = await (await request.get(`/api/pesquisas/${survey.id}/feedbacks?inicio=2026-10-02&fim=2026-10-05&perguntaId=${questions[0].id}&nota=5`, { headers })).json();
  filteredPoint = matching.itens[0].origem.id;
});
async function enter(page, query = 'aba=resultados', id = survey.id) {
  await page.addInitScript(payload => sessionStorage.setItem('feedqr.session.v1', JSON.stringify(payload)), session);
  await page.goto(`/app/pesquisas/${id}?${query}`);
  await expect(page.getByRole('heading', { name: id === survey.id ? survey.titulo : /./ }).first()).toBeVisible();
}
async function layout(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const issues = await page.locator('.survey-analysis h2, .survey-analysis button, .survey-analysis input, .survey-analysis select, .feedback-entry, .analysis-filters, .detail-tab, .analysis-distribution, .feedback-pagination').evaluateAll(elements => elements
    .filter(el => el.getClientRects().length).filter(el => { const rect = el.getBoundingClientRect(); return rect.left < -1 || rect.right > innerWidth + 1; }).map(el => el.outerHTML));
  expect(issues).toEqual([]);
}
for (const width of [360, 390, 768, 1440]) {
  test(`resultados, distribuições e feedbacks reais em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const directory = resolve('artifacts/stage5', String(width)); mkdirSync(directory, { recursive: true });
    await enter(page);
    await expect(page.locator('.analysis-total strong')).toHaveText('28');
    await expect(page.locator('.analysis-questions .question-metric')).toHaveCount(6);
    await expect(page.locator('.question-metric--sim_nao .analysis-distribution')).toContainText('Não');
    await expect(page.locator('.question-metric--multipla_escolha .analysis-distribution')).toContainText('50%');
    await page.evaluate(() => document.fonts.ready); await layout(page);
    await page.screenshot({ path: resolve(directory, 'resultados.png'), fullPage: true, animations: 'disabled' });
    await page.locator('.question-metric--nps').screenshot({ path: resolve(directory, 'nps.png'), animations: 'disabled' });
    await page.locator('.question-metric--estrelas').first().screenshot({ path: resolve(directory, 'estrelas.png'), animations: 'disabled' });
    await page.getByRole('tab', { name: 'Feedbacks', exact: true }).click();
    await expect(page.locator('.feedback-entry')).toHaveCount(20);
    await expect(page.locator('.feedback-answers')).toContainText(['Atendimento muito atencioso.']);
    await layout(page);
    await page.screenshot({ path: resolve(directory, 'feedbacks.png'), fullPage: true, animations: 'disabled' });
    await page.locator('.feedback-entry').filter({ hasText: 'Atendimento muito atencioso.' }).first().screenshot({ path: resolve(directory, 'feedback-individual.png'), animations: 'disabled' });
    await page.getByLabel('Pergunta', { exact: true }).selectOption(questions[0].id);
    await page.getByLabel('Nota', { exact: true }).selectOption('5');
    await page.getByLabel('Data inicial', { exact: true }).fill('2026-10-02');
    await page.getByLabel('Data final', { exact: true }).fill('2026-10-05');
    await page.getByRole('form', { name: 'Filtros da pesquisa' }).getByLabel('Ponto de coleta', { exact: true }).selectOption(filteredPoint);
    await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
    await expect(page).toHaveURL(/nota=5/); await expect(page.locator('.feedback-entry')).toHaveCount(4);
    await layout(page);
    await page.screenshot({ path: resolve(directory, 'filtros.png'), fullPage: true, animations: 'disabled' });
    expect(errors).toEqual([]);
  });
}
test('paginação real, filtros na URL, refresh e limpeza contextual', async ({ page }) => {
  await enter(page, 'aba=feedbacks');
  await expect(page.locator('.feedback-entry')).toHaveCount(20);
  await page.getByLabel('Respostas por página').selectOption('10');
  await expect(page.locator('.feedback-entry')).toHaveCount(10);
  const first = await page.locator('.feedback-entry-heading h3').allTextContents();
  await page.getByRole('button', { name: 'Próxima página' }).click();
  await expect(page).toHaveURL(/pagina=2/); await expect(page.locator('.feedback-entry-heading h3').first()).toHaveText('Resposta 11');
  expect(await page.locator('.feedback-entry-heading h3').allTextContents()).not.toEqual(first);
  await page.reload(); await expect(page.locator('.pagination')).toContainText('Página 2 de 3');
  await page.getByLabel('Data inicial', { exact: true }).fill('2050-01-01'); await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nenhum feedback com estes filtros.' })).toBeVisible();
  await page.locator('.empty-state').getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('.feedback-entry')).toHaveCount(20);
});
test('CSV usa filtros aplicados, inclui todo feedback, UTF-8 e download seguro', async ({ page, request }) => {
  const query = `aba=feedbacks&inicio=2026-10-02&fim=2026-10-05&pontoColetaId=${filteredPoint}&perguntaId=${questions[0].id}&nota=5&limite=10`;
  await enter(page, query);
  await expect(page.locator('.feedback-entry')).toHaveCount(4);
  // Unsaved filter edits must not change the export of the currently displayed data.
  await page.getByLabel('Data inicial', { exact: true }).fill('2050-01-01');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar CSV' }).click();
  const download = await downloadEvent; expect(download.suggestedFilename()).toBe(`pesquisa-${survey.id}.csv`);
  const bytes = readFileSync(await download.path()); expect([...bytes.subarray(0, 3)]).toEqual([239, 187, 191]);
  const csv = bytes.toString('utf8'); expect(csv).toContain('Atendimento muito atencioso.');
  const filtered = await (await request.get(`/api/pesquisas/${survey.id}/feedbacks?${query.replace('aba=feedbacks&', '')}`, { headers })).json();
  filtered.itens.forEach(item => expect(csv).toContain(item.id));
  expect(csv.match(/"ESTRELAS"/g)).toHaveLength(filtered.total * 2);
  await expect(page.getByRole('status').filter({ hasText: 'CSV preparado' })).toBeVisible();
});
test('estados vazios, falhas de resultados/feedbacks/download e recuperação', async ({ page, request }) => {
  const draft = await (await request.post('/api/pesquisas', { headers, data: { titulo: 'Pesquisa sem respostas — teste' } })).json();
  await enter(page, 'aba=resultados', draft.id);
  await expect(page.getByRole('heading', { name: 'Sua pesquisa ainda não recebeu respostas.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver perguntas' })).toBeVisible();
  expect((await request.post(`/api/pesquisas/${draft.id}/perguntas`, { headers, data: { texto: 'Comentário', tipo: 'TEXTO', ordem: 0, obrigatoria: false } })).status()).toBe(201);
  expect((await request.post(`/api/pesquisas/${draft.id}/publicar`, { headers })).status()).toBe(200);
  expect((await request.patch(`/api/pesquisas/${draft.id}`, { headers, data: { status: 'ENCERRADA' } })).status()).toBe(200);
  await enter(page, 'aba=resultados', draft.id);
  await expect(page.getByText('Esta pesquisa foi encerrada sem respostas registradas.', { exact: false })).toBeVisible();
  await page.getByRole('tab', { name: 'Feedbacks', exact: true }).click();
  await expect(page.getByText('Esta pesquisa está encerrada e não tem respostas registradas.')).toBeVisible();
  await page.route('**/pesquisas/*/resultados*', route => route.abort('connectionfailed'));
  await enter(page);
  await expect(page.getByRole('heading', { name: 'Não foi possível carregar.' })).toBeVisible();
  await page.unroute('**/pesquisas/*/resultados*'); await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('.analysis-total strong')).toHaveText('28');
  await page.route('**/pesquisas/*/exportar*', route => route.fulfill({ status: 429, json: { erro: 'Limite' } }));
  await page.getByRole('button', { name: 'Exportar CSV' }).click();
  await expect(page.getByRole('alert')).toContainText('Muitas tentativas');
  await page.route('**/pesquisas/*/feedbacks*', route => route.abort('connectionfailed'));
  await page.getByRole('tab', { name: 'Feedbacks', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Não foi possível carregar.' })).toBeVisible();
  await page.unroute('**/pesquisas/*/feedbacks*'); await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('.feedback-entry')).toHaveCount(20);
});
test('fluxo completo real: QR, resposta sem origem, análise, feedback e CSV protegido', async ({ page, request }) => {
  const surveyRes = await request.post('/api/pesquisas', { headers, data: { titulo: 'Experiência completa — Etapa 5', descricao: 'Pesquisa de teste de integração.' } });
  expect(surveyRes.status()).toBe(201); const created = await surveyRes.json();
  const qs = [];
  for (const [ordem, tipo] of ['ESTRELAS', 'NPS', 'SIM_NAO', 'MULTIPLA_ESCOLHA', 'TEXTO'].entries()) {
    const result = await request.post(`/api/pesquisas/${created.id}/perguntas`, { headers, data: { tipo, ordem, texto: `Pergunta ${tipo}`, ...(tipo === 'MULTIPLA_ESCOLHA' ? { opcoes: [{ texto: 'Presencial', ordem: 0 }, { texto: 'Retirada', ordem: 1 }] } : {}) } });
    expect(result.status()).toBe(201); qs.push(await result.json());
  }
  expect((await request.post(`/api/pesquisas/${created.id}/publicar`, { headers })).status()).toBe(200);
  const point = await (await request.post(`/api/pesquisas/${created.id}/pontos`, { headers, data: { nome: 'Balcão completo' } })).json();
  const url = `http://127.0.0.1:4177/p/${created.slug}?origem=${point.token}`;
  const png = await request.get(`/api/pontos/${point.id}/qrcode`, { headers });
  expect(await png.body()).toEqual(await QRCode.toBuffer(url, { type: 'png', width: 512, margin: 2, errorCorrectionLevel: 'M' }));
  await page.goto(url); await page.getByRole('button', { name: 'Começar' }).click();
  await page.getByRole('radio', { name: '5 estrelas' }).check(); await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('radio', { name: 'Nota 10', exact: true }).check(); await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('radio', { name: 'Não', exact: true }).check(); await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('radio', { name: 'Presencial', exact: true }).check(); await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('textbox', { name: 'Sua resposta' }).fill('=HYPERLINK("teste");\nOpinião completa com acentos ç');
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
  await expect(page.locator('.public-panel')).toHaveCSS('opacity', '1');
  mkdirSync('artifacts/stage5', { recursive: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/stage5/agradecimento-mobile.png', fullPage: true, animations: 'disabled' });
  const body = { respostas: qs.map((q, i) => ({ perguntaId: q.id, valor: [1, 0, true, qs[3].opcoes[1].id, 'Resposta sem ponto de coleta'][i] })) };
  expect((await request.post(`/api/public/pesquisas/${created.slug}/respostas`, { data: body })).status()).toBe(201);
  await enter(page, 'aba=resultados', created.id); await expect(page.locator('.analysis-total strong')).toHaveText('2');
  await page.getByRole('tab', { name: 'Feedbacks', exact: true }).click();
  await expect(page.getByText('Sem origem', { exact: true })).toBeVisible();
  await expect(page.getByText('Opinião completa com acentos ç', { exact: false })).toBeVisible();
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Exportar CSV' }).click();
  const bytes = readFileSync(await (await event).path()); expect(bytes.toString('utf8')).toContain("\"'=HYPERLINK");
});
test('isolamento real por empresa e teclado nas abas', async ({ page, request, browser }) => {
  await enter(page); await page.getByRole('tab', { name: 'Resultados', exact: true }).focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Feedbacks', exact: true })).toBeFocused();
  const auth = await request.post('/api/auth/cadastro', { data: { empresa: { nome: 'Outra empresa Stage5', email: 'stage5-other-company@example.com' }, nome: 'Outro usuário', email: 'stage5-other-user@example.com', senha: 'FeedQR-stage5-123' } });
  expect(auth.status()).toBe(201); const other = await auth.json(); const otherHeaders = { Authorization: `Bearer ${other.token}` };
  for (const suffix of ['resultados', 'feedbacks', 'exportar']) expect((await request.get(`/api/pesquisas/${survey.id}/${suffix}`, { headers: otherHeaders })).status()).toBe(404);
  const context = await browser.newContext();
  await context.addInitScript(payload => sessionStorage.setItem('feedqr.session.v1', JSON.stringify(payload)), other);
  const otherPage = await context.newPage();
  await otherPage.goto(`http://127.0.0.1:4177/app/pesquisas/${survey.id}?aba=feedbacks`);
  await expect(otherPage.getByRole('heading', { name: 'Não foi possível carregar.' })).toBeVisible();
  await expect(otherPage.locator('.feedback-entry')).toHaveCount(0);
  await context.close();
});
