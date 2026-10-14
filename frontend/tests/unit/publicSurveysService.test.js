import { randomUUID } from 'node:crypto';
import { afterEach, expect, it, vi } from 'vitest';
import { publicSurveys, publicLoadPolicy } from '../../src/services/publicSurveys.js';
import { configureAuthorization } from '../../src/lib/api.js';
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); configureAuthorization(() => null, () => {}); });
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
    await expect(publicSurveys.get('teste')).rejects.toMatchObject({ status: 0, kind: 'unexpected' });
  }
});
it('não confirma envio com resposta inválida ou sem conexão', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));
  await expect(publicSurveys.submit('teste', { respostas: [] }, randomUUID())).rejects.toThrow();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('rede')));
  await expect(publicSurveys.submit('teste', { respostas: [] }, randomUUID())).rejects.toMatchObject({ status: 0 });
});

const survey = () => ({ titulo: 'Pesquisa', slug: 'teste', perguntas: [{ id: randomUUID(), tipo: 'NPS', texto: 'Nota?', obrigatoria: true }] });

it('aguarda startup lento além dos antigos 15 segundos', async () => {
  vi.useFakeTimers();
  const fetcher = vi.fn(() => new Promise(resolve => setTimeout(() => resolve(Response.json(survey())), 25000)));
  vi.stubGlobal('fetch', fetcher);
  const pending = publicSurveys.get('teste');
  await vi.advanceTimersByTimeAsync(15001);
  expect(fetcher.mock.calls[0][1].signal.aborted).toBe(false);
  await vi.advanceTimersByTimeAsync(10000);
  await expect(pending).resolves.toMatchObject({ slug: 'teste' });
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(vi.getTimerCount()).toBe(0);
});

it.each(['network', 408, 500, 502, 503, 504])('recupera GET transitório (%s) com backoff', async failure => {
  vi.useFakeTimers();
  const fetcher = vi.fn();
  if (failure === 'network') fetcher.mockRejectedValueOnce(new TypeError('offline'));
  else fetcher.mockResolvedValueOnce(new Response('proxy', { status: failure }));
  fetcher.mockImplementation(() => Promise.resolve(Response.json(survey())));
  vi.stubGlobal('fetch', fetcher);
  const pending = publicSurveys.get('teste');
  await vi.advanceTimersByTimeAsync(999);
  expect(fetcher).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1);
  await expect(pending).resolves.toMatchObject({ slug: 'teste' });
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});

it('limita timeouts a três tentativas e recupera se a próxima funcionar', async () => {
  vi.useFakeTimers();
  const hanging = (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError')), { once: true }));
  const fetcher = vi.fn(hanging);
  vi.stubGlobal('fetch', fetcher);
  const checked = expect(publicSurveys.get('teste')).rejects.toMatchObject({ kind: 'timeout' });
  await vi.runAllTimersAsync(); await checked;
  expect(fetcher).toHaveBeenCalledTimes(publicLoadPolicy.attempts);
  expect(vi.getTimerCount()).toBe(0);
  fetcher.mockReset().mockImplementationOnce(hanging).mockImplementation(() => Promise.resolve(Response.json(survey())));
  const recovered = publicSurveys.get('teste');
  await vi.runAllTimersAsync();
  await expect(recovered).resolves.toMatchObject({ slug: 'teste' });
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it.each([400, 401, 403, 404, 429])('não repete rejeição definitiva ou limite (%s)', async status => {
  const fetcher = vi.fn(() => Promise.resolve(Response.json({ erro: 'Rejeitada' }, { status })));
  vi.stubGlobal('fetch', fetcher);
  await expect(publicSurveys.get('teste')).rejects.toMatchObject({ status });
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it.each(['request', 'backoff', 'before'])('cancelamento durante %s encerra requests e timers', async stage => {
  vi.useFakeTimers();
  const controller = new AbortController();
  const fetcher = vi.fn(stage === 'request'
    ? (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true }))
    : () => Promise.reject(new TypeError('offline')));
  vi.stubGlobal('fetch', fetcher);
  if (stage === 'before') controller.abort();
  const checked = expect(publicSurveys.get('teste', undefined, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
  await vi.advanceTimersByTimeAsync(0);
  controller.abort();
  await checked;
  await vi.runAllTimersAsync();
  expect(fetcher).toHaveBeenCalledTimes(stage === 'before' ? 0 : 1);
  expect(vi.getTimerCount()).toBe(0);
});

it('nunca repete POST automaticamente mesmo com falha transitória', async () => {
  const fetcher = vi.fn(() => Promise.resolve(Response.json({}, { status: 503 })));
  vi.stubGlobal('fetch', fetcher);
  await expect(publicSurveys.submit('teste', { respostas: [] }, randomUUID())).rejects.toMatchObject({ status: 503 });
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it('404 HTML de proxy não prova que a pesquisa não existe', async () => {
  const fetcher = vi.fn(() => Promise.resolve(new Response('<html>proxy</html>', { status: 404 })));
  vi.stubGlobal('fetch', fetcher);
  await expect(publicSurveys.get('teste')).rejects.toMatchObject({ status: 0, kind: 'unexpected' });
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it('timeout do corpo depois dos headers também recupera', async () => {
  vi.useFakeTimers();
  const fetcher = vi.fn().mockImplementationOnce((_url, { signal }) => Promise.resolve({ ok: true, status: 200,
    json: () => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError')), { once: true })),
  })).mockImplementation(() => Promise.resolve(Response.json(survey())));
  vi.stubGlobal('fetch', fetcher);
  const pending = publicSurveys.get('teste');
  await vi.runAllTimersAsync();
  await expect(pending).resolves.toMatchObject({ slug: 'teste' });
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});
