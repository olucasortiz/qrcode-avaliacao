import { z } from 'zod';

const email = z.email('Informe um email v\u00e1lido.').max(254, 'Use at\u00e9 254 caracteres.')
  .transform(value => value.toLowerCase());
const name = z.string().trim().min(1, 'Informe o nome.').max(120, 'Use at\u00e9 120 caracteres.');
const password = z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.').max(72, 'A senha \u00e9 muito longa.')
  .refine(value => new TextEncoder().encode(value).length <= 72, 'A senha deve ter no m\u00e1ximo 72 bytes UTF-8.');

export const loginSchema = z.strictObject({ email, senha: password });
export const registerSchema = z.strictObject({ empresa: z.strictObject({ nome: name, email }), nome: name, email, senha: password });
export const sessionSchema = z.object({
  token: z.string().min(1),
  usuario: z.object({ id: z.uuid(), empresaId: z.uuid(), nome: z.string().min(1), email: z.email() }),
});

export function fieldErrors(result) {
  if (result.success) return {};
  return Object.fromEntries(result.error.issues.map(issue => [issue.path.join('.'), issue.message]));
}

export function tokenExpiry(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const normalized = parts[1].replaceAll('-', '+').replaceAll('_', '/');
    const payload = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')));
    return Number.isSafeInteger(payload.exp) && payload.exp > 0 ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}
