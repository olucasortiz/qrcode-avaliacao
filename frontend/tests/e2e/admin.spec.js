import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

let session;
let headers;
let first;
let second;
let draft;
test.beforeAll(async ({ request }) => {
  const result = await request.post('/api/auth/login', { data: { email: 'admin-browser@example.com', senha: 'FeedQR-browser-123' } });
  expect(result.status()).toBe(200); session = await result.json();
  headers = { Authorization: `Bearer ${session.token}` };
  const surveys = await (await request.get('/api/pesquisas?limite=100', { headers })).json();
  first = surveys.itens.find(survey => survey.slug === 'atendimento-teste');
  second = surveys.itens.find(survey => survey.slug === 'entrega-teste');
  draft = surveys.itens.find(survey => survey.slug === 'rascunho-teste-1');
});
async function enter(page, path = '/app') {
  await page.addInitScript(payload => sessionStorage.setItem('feedqr.session.v1', JSON.stringify(payload)), session);
  await page.goto(path);
}
async function layout(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const overflow = await page.locator('h1, h2, input, select, textarea, button, .question-metric, .survey-cell, .timeline-chart').evaluateAll(elements => elements
    .filter(element => element.getClientRects().length && !element.closest('dialog:not([open])'))
    .filter(element => { const box = element.getBoundingClientRect(); return box.left < -1 || box.right > innerWidth + 1; }).map(element => element.outerHTML));
  expect(overflow).toEqual([]);
}
function question(page, title) { return page.locator('.question-metric').filter({ has: page.getByRole('heading', { name: title, exact: true }) }); }
async function readyChart(page, minimum = 30) {
  await expect.poll(() => page.locator('canvas').evaluate(canvas => {
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let green = 0;
    for (let index = 0; index < pixels.length; index += 4) if (pixels[index + 3] > 100 && pixels[index + 1] > pixels[index] * 1.5 && pixels[index + 1] > pixels[index + 2] * 1.1) green++;
    return green;
  })).toBeGreaterThan(minimum);
}

for (const width of [360, 768, 1024, 1440]) {
  test(`dashboard, lista, detalhes e modal em ${width}px`, async ({ page }) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    const directory = resolve('artifacts', 'admin', String(width)); mkdirSync(directory, { recursive: true });
    await enter(page);
    await expect(page.locator('.dashboard-totals dd')).toHaveText(['35', '2']);
    await expect(question(page, 'Como foi o atendimento?').locator('.question-score strong')).toHaveText('4');
    await expect(question(page, 'Como voc\u00ea avalia o tempo de espera?').locator('.question-score strong')).toHaveText('2');
    await expect(question(page, 'Voc\u00ea recomendaria nossa loja?').locator('.question-score strong')).toHaveText('25');
    await expect(question(page, 'Como foi a entrega?').locator('.question-score strong')).toHaveText('5');
    await expect(question(page, 'Encontrou o que procurava?').locator('.question-score')).toHaveCount(0);
    await expect(page.locator('.desktop-sidebar')).toHaveCount(0);
    await expect(page.locator('.admin-topbar .brand img')).toBeVisible();
    if (width >= 768) await expect(page.locator('.desktop-navigation .nav-item--active')).toHaveText('Vis\u00e3o geral');
    await readyChart(page); await layout(page);
    await page.screenshot({ path: resolve(directory, 'dashboard.png'), fullPage: true, animations: 'disabled' });
    if (width === 360) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expect(page.locator('.mobile-panel')).toHaveCSS('transform', 'none');
      await page.screenshot({ path: resolve(directory, 'navigation.png'), animations: 'disabled' });
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }
    await page.getByRole('link', { name: 'Pesquisas', exact: true }).last().click();
    await expect(page.getByRole('heading', { name: 'Suas pesquisas' })).toBeVisible();
    await expect(page.locator('.surveys-table tbody tr')).toHaveCount(10);
    await layout(page); await page.screenshot({ path: resolve(directory, 'surveys.png'), fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: 'Nova pesquisa', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('.modal-content')).toHaveCSS('transform', 'none');
    await layout(page); await page.screenshot({ path: resolve(directory, 'create.png'), animations: 'disabled' });
    await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Nova pesquisa', exact: true })).toBeFocused();
    await page.getByRole('link', { name: first.titulo, exact: true }).click();
    await expect(page.getByRole('heading', { name: first.titulo, exact: true })).toBeVisible();
    await expect(page.locator('.question-summary > li')).toHaveCount(6);
    await layout(page); await page.screenshot({ path: resolve(directory, 'detail.png'), fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: 'Encerrar', exact: true }).click();
    await expect(page.locator('.modal-content')).toHaveCSS('transform', 'none');
    await page.screenshot({ path: resolve(directory, 'confirmation.png'), animations: 'disabled' });
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
    expect(errors).toEqual([]);
  });
}

test('filtros reais de periodo, pesquisa e ponto, incluindo historico inativo', async ({ page, request }) => {
  await enter(page);
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
  await page.getByLabel('Data inicial', { exact: true }).fill('2026-10-01');
  await page.getByLabel('Data final', { exact: true }).fill('2026-10-03');
  await page.getByLabel('Pesquisa', { exact: true }).selectOption(first.id);
  await expect(page.getByLabel('Ponto de coleta', { exact: true })).toBeEnabled();
  const points = await (await request.get(`/api/pesquisas/${first.id}/pontos`, { headers })).json();
  const inactive = points.find(point => !point.ativo);
  await page.getByLabel('Ponto de coleta', { exact: true }).selectOption(inactive.id);
  const pending = page.waitForResponse(response => response.url().includes('/api/dashboard?') && response.status() === 200);
  await page.getByRole('button', { name: 'Aplicar' }).click();
  const response = await pending; const actual = await response.json();
  expect(response.url()).toContain(`pontoColetaId=${inactive.id}`);
  await expect(page.locator('.dashboard-totals dd')).toHaveText([String(actual.totalRespostas), '1']);
  await expect(page.locator('.question-metric')).toHaveCount(6);
  await page.getByLabel('Pesquisa', { exact: true }).selectOption(second.id);
  await expect(page.getByLabel('Ponto de coleta', { exact: true })).toHaveValue('');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.locator('.dashboard-totals dd')).toHaveText(['3', '1']);
  await expect(page.locator('.question-metric')).toHaveCount(1);
  await page.getByLabel('Data inicial', { exact: true }).fill('2026-10-07');
  await page.getByLabel('Data final', { exact: true }).fill('2026-10-01');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.getByLabel('Data final', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Data final', { exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('.dashboard-totals dd')).toHaveText(['35', '2']);
});

test('paginacao e status preservam filtros na URL e no retorno dos detalhes', async ({ page }) => {
  await enter(page, '/app/pesquisas');
  await page.getByLabel('Status', { exact: true }).selectOption('RASCUNHO');
  await expect(page).toHaveURL(/status=RASCUNHO/);
  await expect(page.locator('.surveys-table tbody tr')).toHaveCount(10);
  await page.getByRole('button', { name: 'Pr\u00f3xima p\u00e1gina' }).click();
  await expect(page).toHaveURL(/pagina=2/);
  await expect(page.locator('.surveys-table tbody tr')).toHaveCount(1);
  await page.getByRole('link', { name: /Pesquisa em prepara/ }).click();
  await expect(page.getByRole('button', { name: 'Editar pesquisa' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/pagina=2/);
  await expect(page.locator('.surveys-table tbody tr')).toHaveCount(1);
  await page.getByLabel('Status', { exact: true }).selectOption('ATIVA');
  await expect(page).not.toHaveURL(/pagina=2/);
  await expect(page.locator('.surveys-table tbody tr')).toHaveCount(2);
});

test('grafico de um dia continua visivel e oferece dados acessiveis em mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enter(page);
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
  await page.getByLabel('Data inicial', { exact: true }).fill('2026-10-07');
  await page.getByLabel('Data final', { exact: true }).fill('2026-10-07');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('5');
  await readyChart(page, 8);
  await page.locator('.daily-data summary').click();
  await expect(page.locator('.daily-data tbody tr')).toHaveCount(1);
  await expect(page.locator('.daily-data tbody td')).toHaveText('5');
  await layout(page);
  mkdirSync(resolve('artifacts', 'admin', '360'), { recursive: true });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: resolve('artifacts', 'admin', '360', 'single-day.png'), fullPage: true, animations: 'disabled' });
});

test('troca rapida de pesquisa descarta pontos de coleta da requisicao anterior', async ({ page }) => {
  let pending;
  await page.route(`**/api/pesquisas/${first.id}/pontos`, route => { pending = route; });
  await enter(page);
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
  await page.getByLabel('Pesquisa', { exact: true }).selectOption(first.id);
  await expect.poll(() => !!pending).toBe(true);
  await expect(page.getByLabel('Ponto de coleta', { exact: true })).toBeDisabled();
  await page.getByLabel('Pesquisa', { exact: true }).selectOption(second.id);
  await expect(page.getByLabel('Ponto de coleta', { exact: true })).toBeEnabled();
  const completed = page.waitForResponse(response => response.url().endsWith(`/api/pesquisas/${first.id}/pontos`));
  await pending.continue();
  await (await completed).finished();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  await expect(page.getByLabel('Ponto de coleta', { exact: true }).locator('option')).toHaveCount(1);
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.locator('.dashboard-totals dd')).toHaveText(['7', '1']);
  await expect(page.locator('.question-metric')).toHaveCount(1);
});

test('criar, editar, validar publicacao, confirmar, publicar e encerrar com o backend real', async ({ page, request }) => {
  await enter(page, '/app/pesquisas');
  await page.getByRole('button', { name: 'Nova pesquisa', exact: true }).click();
  await page.getByRole('button', { name: 'Criar pesquisa', exact: true }).click();
  await expect(page.getByLabel('T\u00edtulo', { exact: true })).toBeFocused();
  await page.getByLabel('T\u00edtulo', { exact: true }).fill('Pesquisa do ciclo de vida');
  await page.getByLabel('Descri\u00e7\u00e3o (opcional)', { exact: true }).fill('Descri\u00e7\u00e3o original');
  await page.getByLabel('Slug p\u00fablico (opcional)', { exact: true }).fill('Slug invalido');
  await page.getByRole('button', { name: 'Criar pesquisa', exact: true }).click();
  await expect(page.getByLabel('Slug p\u00fablico (opcional)', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Slug p\u00fablico (opcional)', { exact: true }).fill('ciclo-de-vida');
  await page.getByRole('button', { name: 'Criar pesquisa', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pesquisa do ciclo de vida', exact: true })).toBeVisible();
  const id = page.url().split('/').at(-1);
  await page.getByRole('button', { name: 'Editar pesquisa' }).click();
  await page.getByLabel('T\u00edtulo', { exact: true }).fill('Pesquisa revisada');
  await page.getByLabel('Descri\u00e7\u00e3o (opcional)', { exact: true }).fill('');
  await page.getByLabel('Slug p\u00fablico', { exact: true }).fill('ciclo-revisado');
  await page.getByRole('button', { name: 'Salvar altera\u00e7\u00f5es', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pesquisa revisada', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Publicar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Adicione pelo menos uma pergunta');
  await expect(page.getByRole('button', { name: 'Publicar pesquisa', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  const question = await request.post(`/api/pesquisas/${id}/perguntas`, { headers, data: { texto: 'Sua avalia\u00e7\u00e3o?', tipo: 'ESTRELAS', ordem: 0 } });
  expect(question.status()).toBe(201);
  await page.reload();
  await page.getByRole('button', { name: 'Publicar', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  const unmodified = await (await request.get(`/api/pesquisas/${id}`, { headers })).json();
  expect(unmodified).toMatchObject({ status: 'RASCUNHO', descricao: null, slug: 'ciclo-revisado' });
  await page.getByRole('button', { name: 'Publicar', exact: true }).click();
  await page.getByRole('button', { name: 'Publicar pesquisa', exact: true }).click();
  await expect(page.locator('.detail-heading .status-badge')).toHaveText('Ativa');
  await expect(page.getByRole('button', { name: 'Editar pesquisa' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Excluir rascunho' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Encerrar', exact: true }).click();
  await page.getByRole('button', { name: 'Encerrar pesquisa', exact: true }).click();
  await expect(page.locator('.detail-heading .status-badge')).toHaveText('Encerrada');
  await expect(page.getByRole('button', { name: 'Encerrar', exact: true })).toHaveCount(0);
  expect((await (await request.get(`/api/pesquisas/${id}`, { headers })).json()).status).toBe('ENCERRADA');
});

test('exclusao 204 remove somente o rascunho confirmado', async ({ page, request }) => {
  const created = await (await request.post('/api/pesquisas', { headers, data: { titulo: 'Rascunho para excluir' } })).json();
  await enter(page, `/app/pesquisas/${created.id}`);
  await page.getByRole('button', { name: 'Excluir rascunho', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  expect((await request.get(`/api/pesquisas/${created.id}`, { headers })).status()).toBe(200);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Excluir rascunho', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Excluir rascunho', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/pesquisas$/);
  expect((await request.get(`/api/pesquisas/${created.id}`, { headers })).status()).toBe(404);
});

test('erro de conexao no formulario preserva dados e impede envio duplicado', async ({ page }) => {
  await enter(page, '/app/pesquisas');
  await page.getByRole('button', { name: 'Nova pesquisa', exact: true }).click();
  await page.getByLabel('T\u00edtulo', { exact: true }).fill('Meu rascunho preservado');
  let pending; let calls = 0;
  await page.route('**/api/pesquisas', route => { pending = route; calls++; });
  await page.getByRole('button', { name: 'Criar pesquisa', exact: true }).click();
  await expect.poll(() => calls).toBe(1);
  await expect(page.getByRole('button', { name: 'Criar pesquisa', exact: true })).toBeDisabled();
  await page.locator('.survey-form').evaluate(form => form.requestSubmit()); expect(calls).toBe(1);
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeVisible();
  await pending.abort('connectionfailed');
  await expect(page.getByRole('alert')).toContainText('N\u00e3o foi poss\u00edvel conectar');
  await expect(page.getByLabel('T\u00edtulo', { exact: true })).toHaveValue('Meu rascunho preservado');
});

test('dashboard vazio, falha de conexao e tentativa novamente', async ({ page }) => {
  await page.route('**/api/dashboard', route => route.abort('connectionfailed'));
  await enter(page);
  await expect(page.getByRole('alert')).toContainText('N\u00e3o foi poss\u00edvel conectar');
  await page.unroute('**/api/dashboard');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
  await page.getByLabel('Data inicial', { exact: true }).fill('2050-01-01');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('0');
  await expect(page.getByRole('heading', { name: 'Nenhuma resposta neste per\u00edodo.' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(question(page, 'Como foi o atendimento?').locator('.question-score strong')).toHaveText('\u2014');
});

test('isolamento real entre empresas e ID invalido nos detalhes', async ({ page, request }) => {
  const other = await (await request.post('/api/auth/cadastro', { data: { empresa: { nome: 'Outra empresa', email: 'isolated-admin-company@example.com' }, nome: 'Outra gestora', email: 'isolated-admin-user@example.com', senha: 'FeedQR-browser-123' } })).json();
  const foreign = await (await request.post('/api/pesquisas', { headers: { Authorization: `Bearer ${other.token}` }, data: { titulo: 'Pesquisa privada de outra empresa' } })).json();
  await enter(page, `/app/pesquisas/${foreign.id}`);
  await expect(page.getByRole('alert')).toContainText('Pesquisa nao encontrada');
  await expect(page.getByRole('button', { name: 'Editar pesquisa' })).toHaveCount(0);
  await page.goto('/app/pesquisas/id-invalido');
  await expect(page.getByRole('alert')).toContainText('Pesquisa n\u00e3o encontrada');
});

test('conflito retornado pelo backend e teclado em modal respeitando movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enter(page, `/app/pesquisas/${draft.id}`);
  await page.getByRole('button', { name: 'Editar pesquisa' }).click();
  await page.getByLabel('Slug p\u00fablico', { exact: true }).fill(first.slug);
  await page.getByRole('button', { name: 'Salvar altera\u00e7\u00f5es', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('conflita com registros existentes');
  await expect(page.getByLabel('Slug p\u00fablico', { exact: true })).toHaveValue(first.slug);
  const duration = await page.locator('.modal-content').evaluate(element => getComputedStyle(element).transitionDuration);
  expect(duration.split(',').every(value => parseFloat(value) <= .001)).toBe(true);
  await page.getByRole('button', { name: 'Salvar altera\u00e7\u00f5es', exact: true }).focus();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Fechar', exact: true })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Editar pesquisa' })).toBeFocused();
});

test('navegacao superior, estado ativo nos detalhes e perfil completo por teclado', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await enter(page);
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
  const navigation = page.locator('.desktop-navigation');
  await page.getByRole('link', { name: 'Ir para o conte\u00fado' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#workspace-main')).toBeFocused();
  const heading = await page.getByRole('heading', { name: 'Vis\u00e3o geral' }).boundingBox();
  const header = await page.locator('.admin-topbar').boundingBox();
  expect(heading.y).toBeGreaterThanOrEqual(header.y + header.height);
  await expect(navigation.getByRole('link', { name: 'Vis\u00e3o geral' })).toHaveAttribute('aria-current', 'page');
  await navigation.getByRole('link', { name: 'Pesquisas', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Suas pesquisas' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Pesquisas', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: first.titulo, exact: true }).click();
  await expect(page.getByRole('heading', { name: first.titulo, exact: true })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Pesquisas', exact: true })).toHaveAttribute('aria-current', 'page');
  const profile = page.locator('.admin-topbar').getByRole('button', { name: 'Marina Costa Minha conta' });
  await profile.focus(); await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Sua conta' })).toBeFocused();
  await page.keyboard.press('ArrowDown'); await expect(page.getByRole('menuitem', { name: 'Sair da conta' })).toBeFocused();
  await page.keyboard.press('Home'); await expect(page.getByRole('menuitem', { name: 'Sua conta' })).toBeFocused();
  await page.keyboard.press('End'); await expect(page.getByRole('menuitem', { name: 'Sair da conta' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(profile).toBeFocused();
  await profile.click(); await page.getByRole('menuitem', { name: 'Sua conta' }).click();
  await expect(page.getByRole('heading', { name: 'Sua conta' })).toBeVisible();
  await expect(page.locator('.account-details')).toContainText('Marina Costa');
  await expect(page.getByRole('menu')).not.toBeVisible();
  await layout(page);
});

test('menu compacto mobile, perfil, foco e reorganizacao ao mudar para tablet', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await enter(page);
  const trigger = page.getByRole('button', { name: 'Abrir menu', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Menu principal' });
  await expect(dialog.getByRole('button', { name: 'Fechar menu' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Marina Costa Minha conta' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog.getByRole('menuitem', { name: 'Sua conta' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Marina Costa Minha conta' })).toBeFocused();
  await dialog.getByRole('link', { name: 'Pesquisas', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Suas pesquisas' })).toBeVisible();
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.desktop-navigation')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  await layout(page);
});

test('skeletons reais de carregamento, estados vazios e alinhamentos nas quatro resolucoes', async ({ page }) => {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const directory = resolve('artifacts', 'admin', String(width)); mkdirSync(directory, { recursive: true });
    let pending;
    await page.route('**/api/dashboard', route => { pending = route; });
    await enter(page);
    await expect(page.locator('.admin-skeleton--dashboard')).toBeVisible();
    await expect(page.locator('.admin-skeleton')).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('.dashboard-totals')).toHaveCount(0);
    const skeletonTop = (await page.locator('.skeleton-overview').boundingBox()).y;
    await layout(page); await page.screenshot({ path: resolve(directory, 'loading.png'), fullPage: true, animations: 'disabled' });
    await expect.poll(() => !!pending).toBe(true); await pending.continue();
    await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
    await expect.poll(() => page.locator('.dashboard-overview').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42)).toBe(0);
    expect(Math.abs((await page.locator('.dashboard-overview').boundingBox()).y - skeletonTop)).toBeLessThanOrEqual(4);
    await page.unroute('**/api/dashboard');
    await page.getByLabel('Data inicial', { exact: true }).fill('2050-01-01');
    await page.getByRole('button', { name: 'Aplicar' }).click();
    await expect(page.locator('.dashboard-totals dd').first()).toHaveText('0');
    await expect(page.getByRole('heading', { name: 'Nenhuma resposta neste per\u00edodo.' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('Filtros aplicados');
    await page.evaluate(() => scrollTo(0, 0));
    await layout(page); await page.screenshot({ path: resolve(directory, 'empty.png'), fullPage: true, animations: 'disabled' });
  }
});

test('aplicar filtros preserva o grafico e informa carregamento e confirmacao', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await enter(page);
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
  await readyChart(page);
  await page.locator('canvas').evaluate(canvas => { canvas.dataset.preserved = 'yes'; });
  let pending;
  await page.route('**/api/dashboard?**', route => { pending = route; });
  await page.getByLabel('Data inicial', { exact: true }).fill('2026-10-07');
  await page.getByLabel('Data final', { exact: true }).fill('2026-10-07');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.getByRole('status')).toContainText('Atualizando...');
  await expect(page.locator('.dashboard-content')).toHaveAttribute('aria-busy', 'true');
  await expect.poll(() => !!pending).toBe(true);
  await pending.continue();
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('5');
  await expect(page.getByRole('status')).toContainText('Filtros aplicados');
  await expect(page.locator('canvas')).toHaveAttribute('data-preserved', 'yes');
  await readyChart(page, 8); await layout(page);
});

test('movimento reduzido tambem se aplica a entradas, skeletons e menu administrativo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 740 });
  let pending;
  await page.route('**/api/dashboard', route => { pending = route; });
  await enter(page);
  await expect(page.locator('.admin-skeleton')).toBeVisible();
  const animations = await page.locator('.skeleton-block').evaluateAll(elements => elements.map(element => getComputedStyle(element).animationDuration));
  expect(animations.every(value => parseFloat(value) <= .001)).toBe(true);
  await expect.poll(() => !!pending).toBe(true); await pending.continue();
  await expect(page.locator('.dashboard-totals dd').first()).toHaveText('35');
  const reveal = await page.locator('.dashboard-overview').evaluate(element => ({ duration: getComputedStyle(element).animationDuration, delay: getComputedStyle(element).animationDelay }));
  expect(parseFloat(reveal.duration)).toBeLessThanOrEqual(.001); expect(parseFloat(reveal.delay)).toBe(0);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.locator('.mobile-panel')).toBeVisible();
  const transition = await page.locator('.mobile-panel').evaluate(element => getComputedStyle(element).transitionDuration);
  expect(transition.split(',').every(value => parseFloat(value) <= .001)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
});
