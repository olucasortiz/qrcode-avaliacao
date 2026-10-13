import { expect, test } from '@playwright/test';

let session;
let headers;

test.beforeAll(async ({ request }) => {
  const result = await request.post('/api/auth/login', {
    data: { email: 'admin-browser@example.com', senha: 'FeedQR-browser-123' },
  });
  expect(result.status()).toBe(200);
  session = await result.json();
  headers = { Authorization: `Bearer ${session.token}` };
});

async function enter(page, path = '/app') {
  await page.addInitScript(payload => sessionStorage.setItem('feedqr.session.v1', JSON.stringify(payload)), session);
  await page.goto(path);
}

test('estados vazios no dashboard e listagem com identidade QR do FeedQR', async ({ page, request }) => {
  await enter(page, '/app/pesquisas');
  await page.getByLabel('Status', { exact: true }).selectOption('ENCERRADA');
  const rows = await page.locator('.surveys-table tbody tr').count();
  if (rows === 0) {
    await expect(page.locator('.empty-state__mark svg')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Nenhuma pesquisa com este status.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ver todas as pesquisas' })).toBeVisible();
  }

  // Verificar empty state da dashboard com filtro futuro
  await enter(page, '/app');
  await page.getByLabel('Data inicial', { exact: true }).fill('2055-01-01');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.getByRole('heading', { name: 'Nenhuma resposta neste período.' })).toBeVisible();
  await expect(page.locator('.empty-state__mark svg')).toBeVisible();
  await expect(page.locator('.empty-state').getByRole('button', { name: 'Limpar filtros' })).toBeVisible();
});

test('editor de perguntas: criacao dos 5 tipos, opcoes, ordenacao, previa e exclusao', async ({ page, request }) => {
  const res = await request.post('/api/pesquisas', {
    headers,
    data: { titulo: 'Pesquisa Teste Etapa 3' },
  });
  expect(res.status()).toBe(201);
  const survey = await res.json();

  await enter(page, `/app/pesquisas/${survey.id}`);
  await expect(page.getByRole('heading', { name: 'Pesquisa Teste Etapa 3' })).toBeVisible();
  await expect(page.getByRole('tab', { name: /Perguntas/ })).toHaveAttribute('aria-selected', 'true');

  // Estado vazio de perguntas com QR emblem
  await expect(page.getByRole('heading', { name: 'O que você quer descobrir?' })).toBeVisible();
  await expect(page.locator('#panel-perguntas .empty-state__mark svg')).toBeVisible();

  // 1. Criar pergunta tipo ESTRELAS
  await page.getByRole('button', { name: 'Criar primeira pergunta' }).click();
  await expect(page.getByRole('heading', { name: 'Nova pergunta' })).toBeVisible();
  await page.getByLabel('Pergunta', { exact: true }).fill('Avaliação em estrelas');
  await page.getByLabel('Tipo de resposta', { exact: true }).selectOption('ESTRELAS');
  await page.getByRole('button', { name: 'Salvar pergunta' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.question-editor__list > li')).toHaveCount(1);
  await expect(page.locator('.question-editor__list')).toContainText('Avaliação em estrelas');
  await expect(page.locator('.question-editor__list')).toContainText('Estrelas');

  // 2. Criar pergunta tipo NPS
  await page.getByRole('button', { name: 'Adicionar pergunta' }).click();
  await page.getByLabel('Pergunta', { exact: true }).fill('Qual a probabilidade de recomendar?');
  await page.getByLabel('Tipo de resposta', { exact: true }).selectOption('NPS');
  await page.getByRole('button', { name: 'Salvar pergunta' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.question-editor__list > li')).toHaveCount(2);

  // 3. Criar pergunta tipo SIM_NAO
  await page.getByRole('button', { name: 'Adicionar pergunta' }).click();
  await page.getByLabel('Pergunta', { exact: true }).fill('Foi bem atendido?');
  await page.getByLabel('Tipo de resposta', { exact: true }).selectOption('SIM_NAO');
  await page.getByRole('button', { name: 'Salvar pergunta' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.question-editor__list > li')).toHaveCount(3);

  // 4. Criar pergunta tipo TEXTO (opcional)
  await page.getByRole('button', { name: 'Adicionar pergunta' }).click();
  await page.getByLabel('Pergunta', { exact: true }).fill('Deixe seu comentário');
  await page.getByLabel('Tipo de resposta', { exact: true }).selectOption('TEXTO');
  await page.getByLabel('Resposta obrigatória').uncheck();
  await page.getByRole('button', { name: 'Salvar pergunta' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.question-editor__list > li')).toHaveCount(4);
  await expect(page.locator('.question-editor__list')).toContainText('Opcional');

  // 5. Criar pergunta tipo MULTIPLA_ESCOLHA com opções customizadas
  await page.getByRole('button', { name: 'Adicionar pergunta' }).click();
  await page.getByLabel('Pergunta', { exact: true }).fill('Qual produto comprou?');
  await page.getByLabel('Tipo de resposta', { exact: true }).selectOption('MULTIPLA_ESCOLHA');
  await expect(page.getByRole('heading', { name: 'Opções de resposta' })).toBeVisible();

  // Preencher as duas opções iniciais
  await page.getByLabel('Opção 1', { exact: true }).fill('Café Expresso');
  await page.getByLabel('Opção 2', { exact: true }).fill('Capuccino');

  // Adicionar uma 3ª opção
  await page.getByRole('button', { name: 'Adicionar opção' }).click();
  await page.getByLabel('Opção 3', { exact: true }).fill('Bolo de Laranja');

  // Mover a Opção 3 para cima
  await page.getByRole('button', { name: 'Mover opção 3 para cima' }).click();
  await expect(page.getByLabel('Opção 2', { exact: true })).toHaveValue('Bolo de Laranja');

  await page.getByRole('button', { name: 'Salvar pergunta' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.question-editor__list > li')).toHaveCount(5);

  // 6. Testar prévia da pesquisa interativa
  await page.getByRole('button', { name: 'Prévia' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Prévia da pesquisa' })).toBeVisible();
  await expect(page.locator('.survey-preview')).toContainText('Prévia local');

  await page.screenshot({ path: 'artifacts/stage3/desktop-question-preview.png' });

  // Pergunta 1 (Estrelas): selecionar estrela e avançar
  await page.locator('.star-controls label').nth(3).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Pergunta 2 (NPS): selecionar nota e avançar
  await page.locator('.nps-controls label').nth(9).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Pergunta 3 (Sim/Não): selecionar Sim e avançar
  await page.locator('.choice-controls label').first().click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Pergunta 4 (Texto - opcional): pular
  await page.getByRole('button', { name: 'Pular' }).click();

  // Pergunta 5 (Múltipla escolha): aguardar visibilidade, selecionar opção e concluir
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Qual produto comprou?' })).toBeVisible();
  await page.getByRole('dialog').getByText('Café Expresso').click();
  await page.getByRole('button', { name: 'Concluir prévia' }).click();

  await expect(page.getByRole('heading', { name: 'Prévia concluída.' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();

  // Capturar tela do editor de perguntas
  await page.screenshot({ path: 'artifacts/stage3/desktop-question-editor.png', fullPage: true });

  // 7. Ordenação de perguntas (mover primeira para baixo)
  await page.getByRole('button', { name: 'Mover pergunta 1 para baixo' }).click();
  await expect(page.locator('.question-editor')).toContainText('Ordem atualizada.');
  await expect(page.locator('.question-editor__list > li').first()).toContainText('Qual a probabilidade de recomendar?');

  // 8. Excluir uma pergunta
  await page.getByRole('button', { name: 'Excluir pergunta 5' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Excluir pergunta', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.question-editor__list > li')).toHaveCount(4);
});

test('pontos de coleta: criacao, edicao, ativacao, desativacao, visualizacao e download do QR Code real', async ({ page, request }) => {
  const res = await request.post('/api/pesquisas', {
    headers,
    data: { titulo: 'Pesquisa Pontos de Coleta' },
  });
  expect(res.status()).toBe(201);
  const survey = await res.json();

  await enter(page, `/app/pesquisas/${survey.id}?aba=pontos`);
  await expect(page.getByRole('tab', { name: /Pontos de coleta/ })).toHaveAttribute('aria-selected', 'true');

  // Empty state de pontos
  await expect(page.getByRole('heading', { name: 'Onde sua pesquisa será respondida?' })).toBeVisible();
  await expect(page.locator('#panel-pontos .empty-state__mark svg')).toBeVisible();

  // 1. Criar novo ponto de coleta
  await page.getByRole('button', { name: 'Criar ponto de coleta' }).click();
  await expect(page.getByRole('heading', { name: 'Novo ponto de coleta' })).toBeVisible();
  await page.getByLabel('Nome do ponto de coleta', { exact: true }).fill('Balcão Principal');
  await page.getByRole('button', { name: 'Criar ponto', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.points-table tbody tr')).toHaveCount(1);
  await expect(page.locator('.points-table')).toContainText('Balcão Principal');
  await expect(page.locator('.points-table .status-badge--ativa')).toHaveText('Ativo');

  // 2. Editar nome do ponto
  await page.getByRole('button', { name: 'Editar nome de Balcão Principal' }).click();
  await expect(page.getByRole('heading', { name: 'Editar ponto de coleta' })).toBeVisible();
  await page.getByLabel('Nome do ponto de coleta', { exact: true }).fill('Balcão de Entrada');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.points-table')).toContainText('Balcão de Entrada');

  // Capturar tabela de pontos
  await page.screenshot({ path: 'artifacts/stage3/desktop-points-manager.png', fullPage: true });

  // 3. Visualizar e baixar QR Code real
  await page.getByRole('button', { name: 'QR Code' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'QR Code — Balcão de Entrada' })).toBeVisible();
  await expect(page.locator('.qr-code-frame img')).toBeVisible();
  await expect(page.locator('.qr-url-box code')).toContainText(`/p/${survey.slug}?origem=`);

  // Capturar modal do QR Code real
  await page.screenshot({ path: 'artifacts/stage3/desktop-qr-modal.png' });

  // Testar gatilho de download
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Baixar QR Code (PNG)' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain(`qrcode-${survey.slug}-balcao-de-entrada.png`);

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();

  // 4. Desativar ponto de coleta
  await page.getByRole('button', { name: 'Desativar ponto Balcão de Entrada' }).click();
  await expect(page.locator('.points-table tbody tr')).toContainText('Inativo');
  await expect(page.getByRole('button', { name: 'QR Code' })).toBeDisabled();

  // 5. Reativar ponto de coleta
  await page.getByRole('button', { name: 'Ativar ponto Balcão de Entrada' }).click();
  await expect(page.locator('.points-table tbody tr')).toContainText('Ativo');
  await expect(page.getByRole('button', { name: 'QR Code' })).toBeEnabled();

  // 6. Excluir ponto de coleta
  await page.getByRole('button', { name: 'Excluir ponto Balcão de Entrada' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Excluir ponto' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'Onde sua pesquisa será respondida?' })).toBeVisible();
});

test('publicacao de pesquisa respeita validacoes da API e bloqueia edicao em modo ativa', async ({ page, request }) => {
  const res = await request.post('/api/pesquisas', {
    headers,
    data: { titulo: 'Pesquisa Publicacao Teste' },
  });
  expect(res.status()).toBe(201);
  const survey = await res.json();

  await enter(page, `/app/pesquisas/${survey.id}`);
  // Tentar publicar sem perguntas -> deve acusar problema
  await page.getByRole('button', { name: 'Publicar' }).click();
  await expect(page.getByRole('alert')).toContainText('Adicione pelo menos uma pergunta');
  await expect(page.getByRole('button', { name: 'Publicar pesquisa' })).toBeDisabled();
  await page.getByRole('button', { name: 'Cancelar' }).click();

  // Adicionar pergunta válida
  await page.getByRole('button', { name: 'Criar primeira pergunta' }).click();
  await page.getByLabel('Pergunta', { exact: true }).fill('Qual a sua nota?');
  await page.getByLabel('Tipo de resposta', { exact: true }).selectOption('ESTRELAS');
  await page.getByRole('button', { name: 'Salvar pergunta' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();

  // Agora publicar
  await page.getByRole('button', { name: 'Publicar' }).click();
  await expect(page.getByRole('button', { name: 'Publicar pesquisa' })).toBeEnabled();
  await page.getByRole('button', { name: 'Publicar pesquisa' }).click();
  await expect(page.locator('.detail-heading .status-badge')).toHaveText('Ativa');

  // Modo Ativa: perguntas ficam em modo leitura
  await expect(page.locator('.question-editor')).toContainText('Somente leitura');
  await expect(page.getByRole('button', { name: 'Adicionar pergunta' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Editar pesquisa' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Excluir rascunho' })).toHaveCount(0);

  // Botão Prévia continua disponível para visualização
  await expect(page.getByRole('button', { name: 'Prévia' })).toBeVisible();
});

test('responsividade e usabilidade mobile (360px): estados vazios, editor, previa e pontos', async ({ page, request }) => {
  await page.setViewportSize({ width: 360, height: 780 });

  // 1. Dashboard vazio com filtros futuros no mobile
  await enter(page, '/app');
  await expect(page.getByRole('button', { name: 'Aplicar' })).toBeEnabled();
  await page.getByLabel('Data inicial', { exact: true }).fill('2055-01-01');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.getByRole('heading', { name: 'Nenhuma resposta neste período.' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/stage3/mobile-dashboard-empty.png', fullPage: true });

  // 2. Criar pesquisa para testar editor no mobile
  const res = await request.post('/api/pesquisas', {
    headers,
    data: { titulo: 'Pesquisa Mobile UX' },
  });
  const survey = await res.json();

  // Adicionar perguntas e ponto para testar na tela pequena
  const q1 = await request.post(`/api/pesquisas/${survey.id}/perguntas`, {
    headers,
    data: {
      ordem: 1,
      texto: 'Como foi sua experiência geral?',
      tipo: 'ESTRELAS',
      obrigatoria: true,
      opcoes: [],
    },
  });
  expect(q1.status()).toBe(201);
  const q2 = await request.post(`/api/pesquisas/${survey.id}/perguntas`, {
    headers,
    data: {
      ordem: 2,
      texto: 'Qual produto você comprou?',
      tipo: 'MULTIPLA_ESCOLHA',
      obrigatoria: true,
      opcoes: [{ ordem: 1, texto: 'Café Espresso' }, { ordem: 2, texto: 'Cappuccino' }],
    },
  });
  expect(q2.status()).toBe(201);
  const pt = await request.post(`/api/pesquisas/${survey.id}/pontos`, {
    headers,
    data: { nome: 'Mesa 04' },
  });
  expect(pt.status()).toBe(201);

  await enter(page, `/app/pesquisas/${survey.id}`);
  await expect(page.locator('.question-editor__list > li')).toHaveCount(2);
  await page.screenshot({ path: 'artifacts/stage3/mobile-question-editor.png', fullPage: true });

  // Testar prévia no mobile
  await page.getByRole('button', { name: 'Prévia' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Como foi sua experiência geral?' })).toBeVisible();
  await expect(page.locator('.modal-content')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'artifacts/stage3/mobile-question-preview.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();

  // Testar aba de pontos no mobile
  await page.getByRole('tab', { name: /Pontos de coleta/ }).click();
  await expect(page.locator('.points-table')).toBeVisible();
  await page.screenshot({ path: 'artifacts/stage3/mobile-points-manager.png', fullPage: true });

  // Abrir QR modal no mobile
  await page.getByRole('button', { name: 'QR Code' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.qr-code-frame img')).toBeVisible();
  await expect(page.locator('.modal-content')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'artifacts/stage3/mobile-qr-modal.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

