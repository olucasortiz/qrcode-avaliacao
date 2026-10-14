import { expect, test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import QRCode from 'qrcode';

let session;
let headers;
const titles = ['Como foi sua experiência?', 'Você recomendaria nosso atendimento?', 'Encontrou o que procurava?', 'O que podemos melhorar?', 'Qual atendimento você utilizou?'];
const alternatives = ['Atendimento presencial, com orientação da equipe e retirada no local', 'Retirada de um pedido feito anteriormente'];
test.beforeAll(async ({ request }) => {
  const result = await request.post('/api/auth/login', { data: { email: 'admin-browser@example.com', senha: 'FeedQR-browser-123' } });
  expect(result.status()).toBe(200);
  session = await result.json();
  headers = { Authorization: `Bearer ${session.token}` };
});
async function createSurvey(request, types = ['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA']) {
  const result = await request.post('/api/pesquisas', { headers, data: { titulo: 'Sua experiência faz a diferença.', descricao: 'Queremos ouvir você. Compartilhe como foi o seu atendimento.' } });
  expect(result.status()).toBe(201);
  const survey = await result.json();
  const questions = [];
  for (const [ordem, tipo] of types.entries()) {
    const res = await request.post(`/api/pesquisas/${survey.id}/perguntas`, { headers, data: {
      texto: titles[['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'].indexOf(tipo)], tipo, ordem,
      obrigatoria: tipo !== 'TEXTO', ...(tipo === 'MULTIPLA_ESCOLHA' ? { opcoes: alternatives.map((texto, ordem) => ({ texto, ordem })) } : {}),
    } });
    expect(res.status()).toBe(201); questions.push(await res.json());
  }
  expect((await request.post(`/api/pesquisas/${survey.id}/publicar`, { headers })).status()).toBe(200);
  const res = await request.post(`/api/pesquisas/${survey.id}/pontos`, { headers, data: { nome: 'Balcão da pesquisa pública' } });
  expect(res.status()).toBe(201);
  const point = await res.json();
  return { survey, questions, point, url: `/p/${survey.slug}?origem=${point.token}` };
}
async function ready(page, title) {
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.locator('.public-panel')).toHaveCSS('opacity', '1');
}
async function begin(page, fixture) {
  await page.goto(fixture.url);
  await ready(page, fixture.survey.titulo);
  await page.getByRole('button', { name: 'Começar', exact: true }).click();
  await ready(page, fixture.questions[0].texto);
}
async function next(page, title) {
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await ready(page, title);
}
async function layout(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const overflow = await page.locator('.public-survey h1, .public-survey button, .public-survey textarea, .public-choice, .public-star').evaluateAll(elements => elements
    .filter(element => element.getClientRects().length)
    .filter(element => { const box = element.getBoundingClientRect(); return box.left < -1 || box.right > innerWidth + 1; }).map(element => element.outerHTML));
  expect(overflow).toEqual([]);
  const smallTargets = await page.locator('.public-survey button, .public-answer input').evaluateAll(elements => elements
    .filter(element => !element.disabled).filter(element => { const rect = element.getBoundingClientRect(); return rect.height < 44 || rect.width < 44; }).map(element => element.outerHTML));
  expect(smallTargets).toEqual([]);
}
async function screenshot(page, directory, name) {
  await layout(page);
  await page.screenshot({ path: resolve(directory, `${name}.png`), fullPage: true, animations: 'disabled' });
}

for (const width of [360, 390, 430, 768, 1440]) {
  test(`pesquisa real, cinco tipos e agradecimento em ${width}px`, async ({ page, request }) => {
    const fixture = await createSurvey(request);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: width < 600 ? 844 : 960 });
    const directory = resolve('artifacts/stage4', String(width)); mkdirSync(directory, { recursive: true });
    await page.goto(fixture.url); await ready(page, fixture.survey.titulo);
    await page.evaluate(() => document.fonts.ready);
    await screenshot(page, directory, 'inicio');
    await page.getByRole('button', { name: 'Começar' }).click(); await ready(page, titles[0]);
    await page.getByRole('radio', { name: '5 estrelas', exact: true }).check();
    await screenshot(page, directory, 'estrelas');
    await next(page, titles[1]);
    await page.getByRole('radio', { name: 'Nota 0', exact: true }).check();
    await screenshot(page, directory, 'nps');
    await next(page, titles[2]);
    await page.getByRole('radio', { name: 'Não', exact: true }).check();
    await screenshot(page, directory, 'sim-nao');
    await next(page, titles[3]);
    await page.getByRole('textbox', { name: 'Sua resposta' }).fill('O atendimento foi atencioso. Obrigado!');
    await screenshot(page, directory, 'texto');
    await next(page, titles[4]);
    await page.getByRole('radio', { name: alternatives[0], exact: true }).check();
    await screenshot(page, directory, 'alternativas');
    const response = page.waitForResponse(res => res.url().endsWith('/respostas') && res.request().method() === 'POST');
    await page.getByRole('button', { name: 'Enviar respostas', exact: true }).click();
    expect((await response).status()).toBe(201);
    await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
    await expect(page.locator('.public-panel')).toHaveCSS('opacity', '1');
    await screenshot(page, directory, 'obrigado');
    const stored = await request.get(`/api/pesquisas/${fixture.survey.id}/resultados?pontoColetaId=${fixture.point.id}`, { headers });
    expect((await stored.json()).totalRespostas).toBe(1);
    expect(errors).toEqual([]);
  });
}

test('QR Code real leva à pesquisa, registra origem e atualiza dashboard', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  const png = await request.get(`/api/pontos/${fixture.point.id}/qrcode`, { headers });
  expect(png.status()).toBe(200);
  const expected = await QRCode.toBuffer(`http://127.0.0.1:4177${fixture.url}`, { type: 'png', width: 512, margin: 2, errorCorrectionLevel: 'M' });
  expect(await png.body()).toEqual(expected);
  mkdirSync('artifacts/stage4', { recursive: true }); writeFileSync('artifacts/stage4/qrcode-real.png', await png.body());
  await page.addInitScript(payload => sessionStorage.setItem('feedqr.session.v1', JSON.stringify(payload)), session);
  const privateRequests = []; page.on('request', req => { if (/\/api\/(pesquisas|dashboard)/.test(req.url())) privateRequests.push(req.url()); });
  await begin(page, fixture);
  expect(privateRequests).toEqual([]);
  await page.getByRole('radio', { name: '4 estrelas', exact: true }).check();
  const sent = page.waitForRequest(req => req.url().endsWith('/respostas'));
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  expect((await sent).postDataJSON().origem).toBe(fixture.point.token);
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
  const total = await (await request.get(`/api/dashboard?pesquisaId=${fixture.survey.id}&pontoColetaId=${fixture.point.id}`, { headers })).json();
  expect(total.totalRespostas).toBe(1);
  await page.goto('/app');
  await page.getByLabel('Pesquisa', { exact: true }).selectOption(fixture.survey.id);
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect(page.locator('.total-highlight dd')).toHaveText('1');
});

test('obrigatoriedade, navegação, preservação de respostas e limite do texto', async ({ page, request }) => {
  const fixture = await createSurvey(request);
  await begin(page, fixture);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('alert')).toContainText('Responda esta pergunta');
  await expect(page.getByRole('radio', { name: '1 estrela', exact: true })).toBeFocused();
  await page.getByRole('radio', { name: '4 estrelas', exact: true }).check(); await next(page, titles[1]);
  await page.getByRole('radio', { name: 'Nota 0', exact: true }).check();
  await page.getByRole('button', { name: 'Voltar' }).click(); await ready(page, titles[0]);
  await expect(page.getByRole('radio', { name: '4 estrelas', exact: true })).toBeChecked();
  await next(page, titles[1]); await expect(page.getByRole('radio', { name: 'Nota 0', exact: true })).toBeChecked();
  await next(page, titles[2]); await page.getByRole('radio', { name: 'Não', exact: true }).check();
  await next(page, titles[3]);
  const text = page.getByRole('textbox', { name: 'Sua resposta' });
  await text.fill('x'.repeat(2100)); expect(await text.inputValue()).toHaveLength(2000);
  await expect(page.getByText('2.000 / 2.000 caracteres')).toBeVisible();
  await text.fill(''); await next(page, titles[4]);
  await page.getByRole('radio', { name: alternatives[1] }).check();
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
});

test('cliques repetidos enviam uma requisição e confirmação perdida tem retry idempotente', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  await begin(page, fixture);
  await page.getByRole('radio', { name: '5 estrelas', exact: true }).check();
  const calls = [];
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/public/pesquisas/*/respostas', async route => {
    calls.push({ key: route.request().headers()['idempotency-key'], body: route.request().postDataJSON() });
    if (calls.length === 1) {
      const response = await route.fetch(); expect(response.status()).toBe(201);
      await gate;
      await route.abort('connectionfailed');
    } else await route.continue();
  });
  await page.getByRole('button', { name: 'Enviar respostas' }).evaluate(button => { button.click(); button.click(); button.click(); });
  await expect(page.getByRole('button', { name: 'Enviando respostas…' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Voltar' })).toBeDisabled();
  expect(calls).toHaveLength(1);
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toHaveCount(0);
  release();
  await expect(page.getByRole('alert')).toContainText('Suas respostas estão preservadas');
  await expect(page.getByRole('radio', { name: '5 estrelas' })).toBeChecked();
  await page.getByRole('button', { name: 'Confirmar envio novamente' }).click();
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
  expect(calls).toHaveLength(2); expect(calls[1]).toEqual(calls[0]);
  const total = await (await request.get(`/api/pesquisas/${fixture.survey.id}/resultados`, { headers })).json();
  expect(total.totalRespostas).toBe(1);
});

test('falha de conexão ao abrir preserva estado de erro e permite tentar novamente', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  await page.route('**/api/public/pesquisas/*', route => route.abort('connectionfailed'));
  await page.goto(fixture.url);
  await expect(page.getByRole('heading', { name: 'Não conseguimos abrir a pesquisa.' })).toBeVisible();
  await page.unroute('**/api/public/pesquisas/*');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await ready(page, fixture.survey.titulo);
});

test('carregamento público aparece enquanto a API está pendente', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  let release; const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/api/public/pesquisas/*', async route => { await gate; await route.continue(); });
  await page.goto(fixture.url);
  await expect(page.getByRole('status')).toContainText('Preparando sua pesquisa');
  release(); await ready(page, fixture.survey.titulo);
});

test('startup lento e falha transitória recuperam sem classificar pesquisa como inválida', async ({ page, request }) => {
  test.setTimeout(45000);
  const fixture = await createSurvey(request, ['ESTRELAS']);
  let calls = 0;
  await page.route('**/api/public/pesquisas/*', async route => {
    calls++;
    if (calls === 1) return route.fulfill({ status: 503, json: { erro: 'Servico temporariamente indisponivel.' } });
    await new Promise(resolve => setTimeout(resolve, 17000));
    await route.continue();
  });
  await page.goto(fixture.url);
  await expect(page.getByRole('status')).toContainText('A conexão está demorando', { timeout: 12000 });
  const directory = resolve('artifacts/task19-3'); mkdirSync(directory, { recursive: true });
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await screenshot(page, directory, `loading-${width}`);
  }
  await expect(page.getByRole('heading', { name: fixture.survey.titulo, exact: true })).toBeVisible({ timeout: 25000 });
  await ready(page, fixture.survey.titulo);
  expect(calls).toBe(2);
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toHaveCount(0);
});

test('pesquisa inexistente, rascunho, encerrada e token inválido/desativado', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  await page.goto('/p/pesquisa-inexistente');
  await expect(page.getByRole('heading', { name: 'Esta pesquisa está indisponível.' })).toBeVisible();
  const draft = await (await request.post('/api/pesquisas', { headers, data: { titulo: 'Ainda não publicada' } })).json();
  await page.goto(`/p/${draft.slug}`);
  await expect(page.getByRole('heading', { name: 'Esta pesquisa está indisponível.' })).toBeVisible();
  for (const query of ['origem', 'origem=', 'origem=invalido', 'origem=aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'origem=a&origem=b']) {
    await page.goto(`/p/${fixture.survey.slug}?${query}`);
    await expect(page.getByRole('heading', { name: 'Este QR Code não está disponível.' })).toBeVisible();
  }
  expect((await request.patch(`/api/pontos/${fixture.point.id}`, { headers, data: { ativo: false } })).status()).toBe(200);
  await page.goto(fixture.url);
  await expect(page.getByRole('heading', { name: 'Este QR Code não está disponível.' })).toBeVisible();
  expect((await request.patch(`/api/pesquisas/${fixture.survey.id}`, { headers, data: { status: 'ENCERRADA' } })).status()).toBe(200);
  await page.goto(`/p/${fixture.survey.slug}`);
  await expect(page.getByRole('heading', { name: 'Esta pesquisa está indisponível.' })).toBeVisible();
});

test('teclado, foco e movimento reduzido funcionam sem cadastro ou origem', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['NPS', 'SIM_NAO']);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/p/${fixture.survey.slug}`);
  await page.getByRole('button', { name: 'Começar' }).click(); await ready(page, titles[1]);
  await expect(page.getByRole('heading', { name: titles[1] })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('radio', { name: 'Nota 0', exact: true })).toBeFocused();
  await page.keyboard.press('Space'); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Nota 1', exact: true })).toBeChecked();
  await next(page, titles[2]); await expect(page.getByRole('heading', { name: titles[2] })).toBeFocused();
  await page.keyboard.press('Tab'); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Não', exact: true })).toBeChecked();
  const sent = page.waitForRequest(req => req.url().endsWith('/respostas'));
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  expect((await sent).postDataJSON()).not.toHaveProperty('origem');
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
});

test('pesquisa com opcionais pode ser enviada vazia; altura reduzida mantém texto e controles utilizáveis', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['TEXTO']);
  await page.setViewportSize({ width: 390, height: 420 });
  await begin(page, fixture);
  await page.getByRole('textbox', { name: 'Sua resposta' }).focus();
  await layout(page);
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
});

test('pesquisa sem perguntas válidas é indisponível e mensagens internas não vazam', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  await page.route('**/api/public/pesquisas/*', route => route.fulfill({ json: { titulo: 'Inválida', slug: fixture.survey.slug, perguntas: [] } }));
  await page.goto(fixture.url);
  await expect(page.getByRole('heading', { name: 'Não conseguimos abrir a pesquisa.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  await page.unroute('**/api/public/pesquisas/*');
  await page.route('**/api/public/pesquisas/*', route => route.fulfill({ status: 500, json: { erro: 'DB_SECRET stacktrace informação interna' } }));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Não conseguimos abrir a pesquisa.' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('DB_SECRET');
});

test('ponto desativado durante preenchimento rejeita envio sem apagar respostas', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  await begin(page, fixture);
  await page.getByRole('radio', { name: '3 estrelas', exact: true }).check();
  expect((await request.patch(`/api/pontos/${fixture.point.id}`, { headers, data: { ativo: false } })).status()).toBe(200);
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  await expect(page.getByRole('alert')).toContainText('ponto de coleta pode ter sido desativado');
  await expect(page.getByRole('radio', { name: '3 estrelas', exact: true })).toBeChecked();
  await expect(page.getByRole('button', { name: 'Voltar' })).toBeEnabled();
  expect((await request.patch(`/api/pontos/${fixture.point.id}`, { headers, data: { ativo: true } })).status()).toBe(200);
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
});

test('refresh restaura respostas e posição; progresso alcançado e rodapé mobile', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['NPS', 'SIM_NAO']);
  await page.setViewportSize({ width: 390, height: 420 });
  await begin(page, fixture);
  await expect(page.locator('progress')).toHaveAttribute('value', '1');
  await expect(page.locator('.public-footer')).toBeHidden();
  await page.getByRole('radio', { name: 'Nota 0', exact: true }).check(); await next(page, titles[2]);
  await page.getByRole('radio', { name: 'Não', exact: true }).check();
  await page.reload(); await ready(page, titles[2]);
  await expect(page.getByRole('radio', { name: 'Não', exact: true })).toBeChecked();
  await expect(page.getByText('100% das perguntas alcançadas')).toBeVisible();
  await page.getByRole('button', { name: 'Voltar' }).click(); await ready(page, titles[1]);
  await expect(page.getByRole('radio', { name: 'Nota 0', exact: true })).toBeChecked();
  await expect(page.getByText('50% das perguntas alcançadas')).toBeVisible();
  await page.goto(`/p/${fixture.survey.slug}`); await ready(page, fixture.survey.titulo);
  await page.getByRole('button', { name: 'Começar' }).click(); await ready(page, titles[1]);
  await expect(page.getByRole('radio', { name: 'Nota 0', exact: true })).not.toBeChecked();
});

test('refresh após resultado incerto restaura chave e confirma uma única resposta', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  await begin(page, fixture); await expect(page.getByText('100% das perguntas alcançadas')).toBeVisible();
  await page.getByRole('radio', { name: '5 estrelas' }).check();
  let initialKey;
  await page.route('**/public/pesquisas/*/respostas', async route => {
    initialKey = route.request().headers()['idempotency-key'];
    const response = await route.fetch(); expect(response.status()).toBe(201); await route.abort('connectionfailed');
  });
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  await expect(page.getByRole('alert')).toContainText('Suas respostas estão preservadas');
  await page.unroute('**/public/pesquisas/*/respostas');
  await page.reload(); await ready(page, titles[0]);
  await expect(page.getByRole('radio', { name: '5 estrelas' })).toBeDisabled();
  const sent = page.waitForRequest(req => req.url().endsWith('/respostas'));
  await page.getByRole('button', { name: 'Confirmar envio novamente' }).click();
  expect((await sent).headers()['idempotency-key']).toBe(initialKey);
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(sessionStorage).filter(key => key.startsWith('feedqr.public.v1:')))).toEqual([]);
  const data = await (await request.get(`/api/pesquisas/${fixture.survey.id}/resultados`, { headers })).json();
  expect(data.totalRespostas).toBe(1);
});

test('armazenamento bloqueado mantém formulário e confirmação com movimento reduzido', async ({ page, request }) => {
  const fixture = await createSurvey(request, ['ESTRELAS']);
  await page.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Denied'); } }); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await begin(page, fixture); await page.getByRole('radio', { name: '4 estrelas' }).check();
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  await expect(page.getByRole('heading', { name: 'Obrigado pela sua resposta!' })).toBeVisible();
  await expect(page.locator('.public-mark--success')).toHaveCSS('animation-name', 'none');
});
