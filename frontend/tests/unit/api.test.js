import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureAuthorization, request } from '../../src/lib/api.js';

afterEach(() => { configureAuthorization(() => null, () => {}); vi.unstubAllGlobals(); });
describe('Cliente HTTP', () => {
  it('aceita exclusao 204 sem tentar interpretar JSON como sucesso vazio', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(request('/pesquisas/id', { method: 'DELETE' })).resolves.toBeNull();
  });
  it('mantem mensagens de regras de negocio e nao retorna mensagens internas de erros 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"erro":"Somente pesquisas RASCUNHO podem ser editadas."}', { status: 409 })));
    await expect(request('/pesquisas/id')).rejects.toThrow('Somente pesquisas RASCUNHO');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"erro":"stack privada"}', { status: 500 })));
    await expect(request('/pesquisas/id')).rejects.not.toThrow('stack privada');
  });
  it('envia JSON e JWT somente em chamadas autenticadas', async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 })));
    vi.stubGlobal('fetch', fetcher);
    configureAuthorization(() => 'jwt', () => {});
    await request('/pesquisas?limite=1');
    expect(fetcher.mock.calls[0][1].headers.Authorization).toBe('Bearer jwt');
    await request('/auth/login', { method: 'POST', body: { email: 'email@example.com', senha: 'senha' }, authenticated: false });
    expect(fetcher.mock.calls[1][1].headers).not.toHaveProperty('Authorization');
    expect(fetcher.mock.calls[1][1].credentials).toBe('omit');
  });
  it('401 no login nao encerra outra sessao; 401 privado encerra a sessao correspondente', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(new Response('{"erro":"invalido"}', { status: 401 }))));
    const expired = vi.fn();
    configureAuthorization(() => 'jwt', expired);
    await expect(request('/auth/login', { authenticated: false })).rejects.toMatchObject({ status: 401 });
    expect(expired).not.toHaveBeenCalled();
    await expect(request('/pesquisas')).rejects.toMatchObject({ status: 401 });
    expect(expired).toHaveBeenCalledWith('jwt');
  });
  it('mantem detalhes de validacao e trata desconexao sem expor stack', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ detalhes: [{ campo: 'email', mensagem: 'Email invalido' }] }), { status: 400 })));
    await expect(request('/auth/login', { authenticated: false })).rejects.toMatchObject({ status: 400, details: [{ campo: 'email', mensagem: 'Email invalido' }] });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    await expect(request('/auth/login', { authenticated: false })).rejects.toThrow('N\u00e3o foi poss\u00edvel conectar');
  });
  it('trata respostas inesperadas e limite de tentativas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('HTML', { status: 502 })));
    await expect(request('/auth/login', { authenticated: false })).rejects.toMatchObject({ status: 502 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 429 })));
    await expect(request('/auth/login', { authenticated: false })).rejects.toThrow('Muitas tentativas');
  });
  it('trata 503 com mensagem sanitizada da API ou mensagem padrao de indisponibilidade', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ erro: 'Servico temporariamente indisponivel.' }), { status: 503 })));
    await expect(request('/auth/login', { authenticated: false })).rejects.toThrow('Servico temporariamente indisponivel.');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
    await expect(request('/auth/login', { authenticated: false })).rejects.toThrow('Serviço temporariamente indisponível.');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 504 })));
    await expect(request('/auth/login', { authenticated: false })).rejects.toThrow('A resposta do serviço demorou mais que o esperado.');
  });
});
