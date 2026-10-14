import { expect, test } from '@playwright/test';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const password = 'FeedQR-browser-123';
let savedSession;
const devDb = resolve('../backend/prisma/dev.db');
const devHash = () => existsSync(devDb) ? createHash('sha256').update(readFileSync(devDb)).digest('hex') : null;
const originalDevHash = devHash();
test.afterAll(() => expect(devHash()).toBe(originalDevHash));
test.beforeAll(async ({ request }) => {
  const response = await request.post('/api/auth/cadastro', { data: {
    empresa: { nome: 'Empresa de teste', email: 'browser-company@example.com' },
    nome: 'Renata Oliveira', email: 'browser-user@example.com', senha: password,
  } });
  expect(response.status()).toBe(201);
  savedSession = await response.json();
});

async function restore(page, session = savedSession) {
  await page.addInitScript(payload => sessionStorage.setItem('feedqr.session.v1', JSON.stringify(payload)), session);
  await page.goto('/app/conta');
}
async function assertLayout(page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const problems = await page.locator('input, button, h1, .form-notice, .account-details dd').evaluateAll(elements => elements
    .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
    .filter(element => { const box = element.getBoundingClientRect(); return box.left < -1 || box.right > innerWidth + 1; })
    .map(element => element.outerHTML));
  expect(problems).toEqual([]);
}

for (const width of [360, 768, 1024, 1440]) {
  test(`layout e assets reais em ${width}px`, async ({ page }) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    const directory = resolve('artifacts', `${width}`); mkdirSync(directory, { recursive: true });
    await page.goto('/entrar');
    await expect(page.getByRole('heading', { name: 'Entre na sua conta.' })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.locator('.brand img').evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
    expect(await page.evaluate(() => document.fonts.check('400 15px "IBM Plex Sans"'))).toBe(true);
    expect(await page.evaluate(() => [...document.fonts].some(font => font.family.includes('IBM Plex Sans') && font.status === 'loaded'))).toBe(true);
    await assertLayout(page);
    await page.screenshot({ path: resolve(directory, 'login.png'), fullPage: true, animations: 'disabled' });
    await page.getByRole('link', { name: /Criar conta/ }).click();
    await expect(page.getByRole('heading', { name: 'Crie sua conta.' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Empresa', exact: true })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Sua conta', exact: true })).toBeVisible();
    await assertLayout(page);
    await page.screenshot({ path: resolve(directory, 'register.png'), fullPage: true, animations: 'disabled' });
    await restore(page);
    await expect(page.getByRole('heading', { name: 'Sua conta' })).toBeVisible();
    await expect(page.getByText('Sess\u00e3o ativa', { exact: true })).toBeVisible();
    await assertLayout(page);
    await page.screenshot({ path: resolve(directory, 'workspace.png'), fullPage: true, animations: 'disabled' });
    if (width < 768) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('.mobile-panel')).toHaveCSS('transform', 'none');
      await page.screenshot({ path: resolve(directory, 'menu.png'), fullPage: true, animations: 'disabled' });
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
    }
    if (width === 1440) {
      await page.getByRole('button', { name: /Renata Oliveira Minha conta/ }).click();
      await expect(page.getByRole('menuitem', { name: 'Sua conta' })).toBeFocused();
      await expect(page.getByRole('menu')).toBeVisible();
      await expect(page.locator('.account-popover')).toHaveCSS('transform', 'none');
      await page.screenshot({ path: resolve(directory, 'account-menu.png'), fullPage: true, animations: 'disabled' });
      await expect(page.getByRole('menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('menu')).not.toBeVisible();
      await expect(page.getByRole('button', { name: /Renata Oliveira Minha conta/ })).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}

test('alternancia de formularios por teclado mantem a composicao em telas curtas e desktop', async ({ page }) => {
  mkdirSync(resolve('artifacts', '360'), { recursive: true });
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: width === 360 ? 640 : 900 });
    await page.goto('/entrar');
    await expect(page.locator('.auth-view')).toHaveCSS('transform', 'none');
    const brand = await page.locator('.auth-brand').boundingBox();
    const heading = await page.locator('.auth-heading h1').boundingBox();
    await page.getByRole('link', { name: /Criar conta/ }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Crie sua conta.' })).toBeVisible();
    await expect(page.locator('.auth-view')).toHaveCSS('transform', 'none');
    await expect(page.locator('.auth-view')).toHaveCSS('opacity', '1');
    await expect(page.locator('.section-index')).toHaveText(['01', '02']);
    expect((await page.locator('.auth-brand').boundingBox()).y).toBe(brand.y);
    expect((await page.locator('.auth-heading h1').boundingBox()).y).toBe(heading.y);
    await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
    await expect(page.getByLabel('Nome da empresa', { exact: true })).toBeFocused();
    await assertLayout(page);
    if (width === 360) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: resolve('artifacts', '360', 'register-errors.png'), fullPage: true, animations: 'disabled' });
    }
    await page.getByRole('link', { name: 'Entrar' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Entre na sua conta.' })).toBeVisible();
    await expect(page.locator('.auth-view')).toHaveCSS('transform', 'none');
    await expect(page.locator('.auth-view')).toHaveCSS('opacity', '1');
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    expect((await page.locator('.auth-brand').boundingBox()).y).toBe(brand.y);
    await expect(page.getByRole('contentinfo')).toHaveText('FeedQR');
    await assertLayout(page);
    if (width === 360) {
      await page.screenshot({ path: resolve('artifacts', '360', 'login-short.png'), fullPage: true, animations: 'disabled' });
    }
  }
});

test('cadastro real, sessao persistida na aba e logout', async ({ page }) => {
  await page.goto('/cadastro');
  await page.getByLabel('Nome da empresa', { exact: true }).fill('Empresa cadastrada no navegador');
  await page.getByLabel('Email da empresa', { exact: true }).fill('new-company@example.com');
  await page.getByLabel('Seu nome', { exact: true }).fill('Camila Souza');
  await page.getByLabel('Seu email', { exact: true }).fill('new-user@example.com');
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('heading', { name: 'Vis\u00e3o geral' })).toBeVisible();
  await page.goto('/app/conta');
  await expect(page.locator('.account-details')).toContainText('Camila Souza');
  await page.reload();
  await expect(page.getByText('Sess\u00e3o ativa', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('feedqr.session.v1'))).toBeNull();
  await page.getByRole('button', { name: /Camila Souza Minha conta/ }).click();
  await page.getByRole('menuitem', { name: 'Sair da conta' }).click();
  await expect(page).toHaveURL(/\/entrar$/);
  expect(await page.evaluate(() => sessionStorage.getItem('feedqr.session.v1'))).toBeNull();
});

test('login real, senha visivel e validacao proxima aos campos', async ({ page }) => {
  await page.goto('/entrar');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  await page.getByLabel('Email', { exact: true }).fill('browser-user@example.com');
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Mostrar senha' }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Ocultar senha' }).click();
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto('/app/conta');
  await expect(page.locator('.account-details')).toContainText('Renata Oliveira');
});

test('falha de conexao preserva preenchimento e impede envios simultaneos', async ({ page }) => {
  await page.goto('/entrar');
  await page.getByLabel('Email', { exact: true }).fill('browser-user@example.com');
  await page.getByLabel('Senha', { exact: true }).fill(password);
  let pendingRoute;
  let calls = 0;
  await page.route('**/api/auth/login', route => { pendingRoute = route; calls++; });
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeDisabled();
  await expect.poll(() => calls).toBe(1);
  await page.locator('form').evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
  expect(calls).toBe(1);
  await pendingRoute.abort('connectionfailed');
  await expect(page.getByRole('alert')).toContainText('N\u00e3o foi poss\u00edvel conectar');
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('browser-user@example.com');
  await expect(page.getByLabel('Senha', { exact: true })).toHaveValue(password);
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeEnabled();
});

test('logout pelo menu mobile libera scroll e remove a sessao', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await restore(page);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.locator('.mobile-panel')).toHaveCSS('transform', 'none');
  await page.getByRole('dialog').getByRole('button', { name: /Renata Oliveira Minha conta/ }).click();
  await page.getByRole('menuitem', { name: 'Sair da conta' }).click();
  await expect(page.getByRole('heading', { name: 'Entre na sua conta.' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  expect(await page.evaluate(() => sessionStorage.getItem('feedqr.session.v1'))).toBeNull();
});

test('credenciais incorretas nao apagam o formulario', async ({ page }) => {
  await page.goto('/entrar');
  await page.getByLabel('Email', { exact: true }).fill('browser-user@example.com');
  await page.getByLabel('Senha', { exact: true }).fill('senha-incorreta');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Email ou senha incorretos');
  await expect(page.getByLabel('Senha', { exact: true })).toHaveValue('senha-incorreta');
});

test('JWT rejeitado pelo backend limpa sessao e informa expiracao', async ({ page }) => {
  await restore(page, { ...savedSession, token: `${savedSession.token.slice(0, -6)}invalid` });
  await expect(page).toHaveURL(/\/entrar\?motivo=expirada$/);
  await expect(page.getByRole('status')).toContainText('Sua sess\u00e3o expirou');
  expect(await page.evaluate(() => sessionStorage.getItem('feedqr.session.v1'))).toBeNull();
});

test('reconexao, protecao de rota e pagina inexistente', async ({ page }) => {
  await page.goto('/app'); await expect(page).toHaveURL(/\/entrar$/);
  await page.route('**/api/pesquisas?limite=1', route => route.abort('connectionfailed'));
  await restore(page);
  await expect(page.getByRole('heading', { name: 'N\u00e3o foi poss\u00edvel conectar.' })).toBeVisible();
  await page.unroute('**/api/pesquisas?limite=1');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByText('Sess\u00e3o ativa', { exact: true })).toBeVisible();
  await page.goto('/pagina-inexistente');
  await expect(page.getByRole('heading', { name: 'P\u00e1gina n\u00e3o encontrada.' })).toBeVisible();
});

test('movimento reduzido e navegacao por teclado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/entrar');
  await expect(page.getByRole('heading', { name: 'Entre na sua conta.' })).toBeVisible();
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Ir para o formul\u00e1rio' })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('#auth-form')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  const duration = await page.getByRole('button', { name: 'Entrar', exact: true }).evaluate(element => getComputedStyle(element).transitionDuration);
  expect(duration.split(',').every(value => Number.parseFloat(value) <= 0.001)).toBe(true);
});
