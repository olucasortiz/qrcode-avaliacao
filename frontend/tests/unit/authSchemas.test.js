import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema, sessionSchema, tokenExpiry } from '../../src/lib/authSchemas.js';

describe('Contratos de autenticacao', () => {
  it('separa empresa e usuario e normaliza nomes e emails', () => {
    const result = registerSchema.parse({ empresa: { nome: ' Empresa ', email: 'EMPRESA@example.com' },
      nome: ' Renata ', email: 'RENATA@example.com', senha: 'senha-segura-123' });
    expect(result.empresa).toEqual({ nome: 'Empresa', email: 'empresa@example.com' });
    expect(result.nome).toBe('Renata');
    expect(result.email).toBe('renata@example.com');
  });
  it('rejeita empresaId enviado pelo cliente e senhas acima de 72 bytes', () => {
    const data = { empresa: { nome: 'Empresa', email: 'empresa@example.com' }, nome: 'Renata', email: 'renata@example.com', senha: 'senha-segura-123' };
    expect(registerSchema.safeParse({ ...data, empresaId: 'outra-empresa' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: data.email, senha: '\u00e9'.repeat(40) }).success).toBe(false);
    expect(loginSchema.safeParse({ email: data.email, senha: '\u00e9'.repeat(36) }).success).toBe(true);
  });
  it('aceita somente emails validos e senhas com no minimo oito caracteres', () => {
    expect(loginSchema.safeParse({ email: 'email-invalido', senha: '1234567' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'usuario@example.com', senha: '12345678' }).success).toBe(true);
  });
  it('nao mantem campos privados inesperados na sessao', () => {
    const response = sessionSchema.parse({ token: 'token', usuario: {
      id: 'e9e4e13b-3334-4dc0-b8aa-289d9f23e132', empresaId: 'db1fca49-4e8c-4f1d-946b-bdfcb7d01988',
      nome: 'Renata', email: 'renata@example.com', senhaHash: 'privado',
    } });
    expect(response.usuario).not.toHaveProperty('senhaHash');
  });
  it('le a expiracao para UX, sem interpretar outros claims como autorizacao', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    expect(tokenExpiry(`header.${btoa(JSON.stringify({ exp, empresaId: 'ignorada' }))}.signature`)).toBe(exp * 1000);
    expect(tokenExpiry('token-invalido')).toBeNull();
    expect(tokenExpiry(`header.${btoa(JSON.stringify({ exp: 'invalido' }))}.signature`)).toBeNull();
  });
});
