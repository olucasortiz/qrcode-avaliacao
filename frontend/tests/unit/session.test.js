import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const usuario = { id: 'e9e4e13b-3334-4dc0-b8aa-289d9f23e132', empresaId: 'db1fca49-4e8c-4f1d-946b-bdfcb7d01988', nome: 'Renata', email: 'renata@example.com' };
const payload = (exp = Math.floor(Date.now() / 1000) + 3600) => ({ token: `header.${btoa(JSON.stringify({ exp }))}.signature`, usuario });
let items;
beforeEach(() => {
  vi.resetModules(); vi.useFakeTimers(); items = new Map();
  vi.stubGlobal('sessionStorage', { getItem: key => items.get(key) || null, setItem: (key, value) => items.set(key, value), removeItem: key => items.delete(key) });
});
afterEach(async () => {
  const { session } = await import('../../src/services/session.js');
  session.logout(); vi.useRealTimers(); vi.unstubAllGlobals();
});
it('login persiste somente sessao da aba e logout a remove', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload()), { status: 200 })));
  const { session, SESSION_KEY } = await import('../../src/services/session.js');
  await session.login({ email: usuario.email, senha: 'senha-123' });
  expect(session.state.phase).toBe('authenticated'); expect(items.has(SESSION_KEY)).toBe(true);
  session.logout(); expect(session.state.phase).toBe('anonymous'); expect(items.size).toBe(0);
});
it('expira a sessao sem depender de outra chamada HTTP', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload(Math.floor(Date.now() / 1000) + 1)), { status: 200 })));
  const { session } = await import('../../src/services/session.js');
  await session.login({ email: usuario.email, senha: 'senha-123' });
  await vi.advanceTimersByTimeAsync(1001);
  expect(session.state.phase).toBe('anonymous'); expect(session.state.reason).toBe('expired');
});
it('verifica sessao restaurada em rota privada existente, sem usar /me', async () => {
  const { session, SESSION_KEY } = await import('../../src/services/session.js');
  items.set(SESSION_KEY, JSON.stringify(payload()));
  const fetcher = vi.fn().mockResolvedValue(new Response('{"itens":[]}', { status: 200 }));
  vi.stubGlobal('fetch', fetcher);
  await session.restore();
  expect(fetcher).toHaveBeenCalledWith('/api/pesquisas?limite=1', expect.any(Object));
  expect(session.state.phase).toBe('authenticated');
});
it('remove credenciais rejeitadas pelo servidor', async () => {
  const { session, SESSION_KEY } = await import('../../src/services/session.js');
  items.set(SESSION_KEY, JSON.stringify(payload()));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
  await session.restore();
  expect(session.state.phase).toBe('anonymous'); expect(items.size).toBe(0);
});
it('preserva sessao em falha de conexao e permite verificar novamente', async () => {
  const { session, SESSION_KEY } = await import('../../src/services/session.js');
  items.set(SESSION_KEY, JSON.stringify(payload()));
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
  await session.restore();
  expect(session.state.phase).toBe('unavailable'); expect(items.has(SESSION_KEY)).toBe(true);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"itens":[]}', { status: 200 })));
  await session.retry(); expect(session.state.phase).toBe('authenticated');
});
it('ignora cache malformado e nao envia seu conteudo ao servidor', async () => {
  const { session, SESSION_KEY } = await import('../../src/services/session.js');
  items.set(SESSION_KEY, '{bad');
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  await session.restore(); expect(session.state.phase).toBe('anonymous'); expect(fetcher).not.toHaveBeenCalled();
});
it('auth login e register usam timeout de 45s para acomodar cold start e nunca repetem POST', async () => {
  const { session, AUTH_TIMEOUT_MS } = await import('../../src/services/session.js');
  expect(AUTH_TIMEOUT_MS).toBe(45000);
  const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status: 503 }));
  vi.stubGlobal('fetch', fetcher);
  await expect(session.login({ email: 'user@example.com', senha: '123' })).rejects.toThrow();
  expect(fetcher).toHaveBeenCalledTimes(1);
  await expect(session.register({ empresa: { nome: 'E', email: 'e@e.com' }, nome: 'N', email: 'e@e.com', senha: '123' })).rejects.toThrow();
  expect(fetcher).toHaveBeenCalledTimes(2);
});
