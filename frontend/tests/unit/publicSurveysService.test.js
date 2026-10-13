import { randomUUID } from 'node:crypto';
import { afterEach, expect, it, vi } from 'vitest';
import { publicSurveys } from '../../src/services/publicSurveys.js';
import { configureAuthorization } from '../../src/lib/api.js';
afterEach(() => { vi.unstubAllGlobals(); configureAuthorization(() => null, () => {}); });
it('envia origem no GET e POST públicos com chave de idempotência e sem JWT', async () => {
  const origem = randomUUID();
  const key = randomUUID();
  const data = { titulo: 'Pesquisa', descricao: null, slug: 'teste', perguntas: [{ id: randomUUID(), tipo: 'NPS', texto: 'Sua nota?', obrigatoria: true }] };
  const fetcher = vi.fn().mockResolvedValueOnce(Response.json(data)).mockResolvedValueOnce(Response.json({ mensagem: 'Resposta registrada.' }, { status: 201 }));
  vi.stubGlobal('fetch', fetcher);
  configureAuthorization(() => 'token-administrativo', () => {});
  await publicSurveys.get('teste', origem);
  const payload = { origem, respostas: [{ perguntaId: data.perguntas[0].id, valor: 0 }] };
  await publicSurveys.submit('teste', payload, key);
  expect(fetcher.mock.calls[0][0]).toBe(`/api/public/pesquisas/teste?origem=${origem}`);
  expect(fetcher.mock.calls[1][1].headers['Idempotency-Key']).toBe(key);
  expect(JSON.parse(fetcher.mock.calls[1][1].body)).toEqual(payload);
  fetcher.mock.calls.forEach(call => expect(call[1].headers).not.toHaveProperty('Authorization'));
});
it('rejeita DTO inválido, vazio ou de outra pesquisa', async () => {
  for (const data of [{ titulo: 'Pesquisa', slug: 'teste', perguntas: [] }, { titulo: 'Pesquisa', slug: 'outra', perguntas: [{ id: randomUUID(), texto: 'Nota?', tipo: 'NPS', obrigatoria: true }] }]) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(data)));
    await expect(publicSurveys.get('teste')).rejects.toMatchObject({ status: 404 });
  }
});
it('não confirma envio com resposta inválida ou sem conexão', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));
  await expect(publicSurveys.submit('teste', { respostas: [] }, randomUUID())).rejects.toThrow();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('rede')));
  await expect(publicSurveys.get('teste')).rejects.toMatchObject({ status: 0 });
});
