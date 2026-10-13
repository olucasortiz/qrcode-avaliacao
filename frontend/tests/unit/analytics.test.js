import { randomUUID } from 'node:crypto';
import { afterEach, expect, it, vi } from 'vitest';
import { analyticsFiltersSchema, apiFilters, feedbackValue, percent, safeCsvName } from '../../src/lib/analytics.js';
import { analytics } from '../../src/services/analytics.js';
import { configureAuthorization } from '../../src/lib/api.js';
afterEach(() => { vi.unstubAllGlobals(); configureAuthorization(() => null, () => {}); });
const id = randomUUID();
it('percentuais respeitam denominador e estado vazio', () => { expect(percent(2, 4)).toBe(50); expect(percent(0, 0)).toBe(0); expect(percent(1, 3)).toBeCloseTo(33.333); });
it('filtros combinados validam datas, pergunta e nota sem perder zero', () => {
  const filters = { inicio: '2026-10-01', fim: '2026-10-08', pontoColetaId: id, perguntaId: id, nota: '0' };
  expect(analyticsFiltersSchema.parse(filters).nota).toBe(0);
  expect(apiFilters(filters, true)).toEqual(filters);
  expect(apiFilters(filters)).toEqual({ inicio: filters.inicio, fim: filters.fim, pontoColetaId: id });
  expect(analyticsFiltersSchema.safeParse({ ...filters, fim: '2026-09-01' }).success).toBe(false);
  expect(analyticsFiltersSchema.safeParse({ ...filters, perguntaId: '' }).success).toBe(false);
  expect(analyticsFiltersSchema.safeParse({ ...filters, inicio: ['2026-10-01'] }).success).toBe(false);
});
it('valores individuais preservam false, NPS zero e texto completo', () => {
  expect(feedbackValue({ pergunta: { tipo: 'SIM_NAO' }, simNao: false })).toBe('Não');
  expect(feedbackValue({ pergunta: { tipo: 'NPS' }, nota: 0 })).toBe('0 / 10');
  const texto = '<script>não executar</script>\n' + 'x'.repeat(1800);
  expect(feedbackValue({ pergunta: { tipo: 'TEXTO' }, texto })).toBe(texto);
  expect(feedbackValue({ pergunta: { tipo: 'MULTIPLA_ESCOLHA' }, opcao: { texto: 'Opção' } })).toBe('Opção');
});
it('nome de CSV não permite caminhos ou nomes de arquivo inesperados', () => {
  expect(safeCsvName(`attachment; filename="pesquisa-${id}.csv"`, id)).toBe(`pesquisa-${id}.csv`);
  expect(safeCsvName('attachment; filename="../../arquivo.exe"', id)).toBe(`pesquisa-${id}.csv`);
});
it('CSV autenticado mantém bytes BOM e filtros, sem reconstrução no frontend', async () => {
  const content = new Uint8Array([239, 187, 191, 65, 59, 66, 13, 10]);
  const fetcher = vi.fn().mockResolvedValue(new Response(content, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="pesquisa-${id}.csv"` } }));
  vi.stubGlobal('fetch', fetcher); configureAuthorization(() => 'jwt', () => {});
  const data = await analytics.export(id, { inicio: '2026-10-01', perguntaId: id, nota: 0 });
  expect(new Uint8Array(await data.blob.arrayBuffer())).toEqual(content);
  expect(fetcher.mock.calls[0][0]).toContain('nota=0'); expect(fetcher.mock.calls[0][1].headers.Authorization).toBe('Bearer jwt');
  expect(fetcher.mock.calls[0][1].headers.Accept).toBe('text/csv');
});
it('download inválido, incompleto ou rejeitado não retorna arquivo', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ erro: 'HTML' })));
  await expect(analytics.export(id, {})).rejects.toThrow('CSV válido');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { headers: { 'Content-Type': 'text/csv' } })));
  await expect(analytics.export(id, {})).rejects.toThrow('vazio');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ erro: 'limite' }, { status: 429 })));
  await expect(analytics.export(id, {})).rejects.toMatchObject({ status: 429 });
});
