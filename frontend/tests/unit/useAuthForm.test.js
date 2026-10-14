import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useAuthForm } from '../../src/composables/useAuthForm.js';

const testSchema = z.object({
  email: z.string().email('Email invalido'),
  senha: z.string().min(6, 'Senha curta'),
});

describe('useAuthForm composable', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicializa com valores padrao e estados booleanos inativos', () => {
    const { values, errors, error, pending, slowPending } = useAuthForm(testSchema, { email: '', senha: '' }, vi.fn());
    expect(values.email).toBe('');
    expect(values.senha).toBe('');
    expect(errors.value).toEqual({});
    expect(error.value).toBe('');
    expect(pending.value).toBe(false);
    expect(slowPending.value).toBe(false);
  });

  it('valida campos individuais no blur e limpa ao editar', () => {
    const form = useAuthForm(testSchema, { email: 'invalido', senha: '' }, vi.fn());
    form.validateField('email');
    expect(form.errors.value.email).toBe('Email invalido');

    form.values.email = 'valido@example.com';
    form.edited('email');
    expect(form.errors.value.email).toBeUndefined();
  });

  it('impede submissao se o schema falhar e nao chama a action', async () => {
    const action = vi.fn();
    const form = useAuthForm(testSchema, { email: 'ruim', senha: '' }, action);
    await form.submit();
    expect(action).not.toHaveBeenCalled();
    expect(form.errors.value.email).toBe('Email invalido');
    expect(form.errors.value.senha).toBe('Senha curta');
    expect(form.pending.value).toBe(false);
  });

  it('ativa slowPending apos 6 segundos se a requisicao demorar (cold start)', async () => {
    let finish;
    const action = vi.fn(() => new Promise(resolve => { finish = resolve; }));
    const form = useAuthForm(testSchema, { email: 'user@example.com', senha: 'password123' }, action);

    const pendingPromise = form.submit();
    expect(form.pending.value).toBe(true);
    expect(form.slowPending.value).toBe(false);

    // Avanca 5.9s - ainda nao deve estar lento
    await vi.advanceTimersByTimeAsync(5900);
    expect(form.slowPending.value).toBe(false);

    // Passou de 6s - deve indicar lentidao/inicializacao
    await vi.advanceTimersByTimeAsync(200);
    expect(form.slowPending.value).toBe(true);
    expect(form.pending.value).toBe(true);

    finish();
    await pendingPromise;
    expect(form.pending.value).toBe(false);
    expect(form.slowPending.value).toBe(false);
  });

  it('trata erro da API, limpa timers e mapeia detalhes de campos', async () => {
    const failure = new Error('Falha de conexao');
    failure.details = [{ campo: 'email', mensagem: 'Email ja cadastrado' }];
    const action = vi.fn().mockRejectedValue(failure);
    const form = useAuthForm(testSchema, { email: 'user@example.com', senha: 'password123' }, action);

    await form.submit();
    expect(form.pending.value).toBe(false);
    expect(form.slowPending.value).toBe(false);
    expect(form.error.value).toBe('Falha de conexao');
    expect(form.errors.value.email).toBe('Email ja cadastrado');
  });

  it('bloqueia submissoes simultaneas enquanto a anterior estiver pendente', async () => {
    let finish;
    const action = vi.fn(() => new Promise(resolve => { finish = resolve; }));
    const form = useAuthForm(testSchema, { email: 'user@example.com', senha: 'password123' }, action);

    const first = form.submit();
    const second = form.submit();
    const third = form.submit();

    expect(action).toHaveBeenCalledTimes(1);
    finish();
    await Promise.all([first, second, third]);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('dispose limpa timer de slowPending', () => {
    const form = useAuthForm(testSchema, { email: '', senha: '' }, vi.fn());
    expect(() => form.dispose()).not.toThrow();
  });
});
