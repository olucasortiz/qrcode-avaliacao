import { z } from 'zod';

export const questionSchema = z.strictObject({
  texto: z.string().trim().min(1, 'Informe a pergunta.').max(2000, 'Use at\u00e9 2000 caracteres.'),
  tipo: z.enum(['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA']),
  obrigatoria: z.boolean(),
  ordem: z.number().int().min(0).max(10000),
  opcoes: z.array(z.strictObject({ texto: z.string().trim().min(1, 'Preencha esta op\u00e7\u00e3o.').max(500, 'Use at\u00e9 500 caracteres.'), ordem: z.number().int().min(0).max(10000) })).max(100, 'Use at\u00e9 100 op\u00e7\u00f5es.'),
}).superRefine((value, ctx) => {
  if (value.tipo === 'MULTIPLA_ESCOLHA' && value.opcoes.length < 2) ctx.addIssue({ code: 'custom', path: ['opcoes'], message: 'Adicione pelo menos duas op\u00e7\u00f5es.' });
  if (value.tipo !== 'MULTIPLA_ESCOLHA' && value.opcoes.length) ctx.addIssue({ code: 'custom', path: ['opcoes'], message: 'Este tipo n\u00e3o aceita op\u00e7\u00f5es.' });
  if (new Set(value.opcoes.map(option => option.ordem)).size !== value.opcoes.length) ctx.addIssue({ code: 'custom', path: ['opcoes'], message: 'Cada op\u00e7\u00e3o deve ter uma ordem diferente.' });
});

export const pointSchema = z.strictObject({ nome: z.string().trim().min(1, 'Informe o nome do ponto.').max(120, 'Use at\u00e9 120 caracteres.') });
export function nextQuestionOrder(questions) { return questions.length ? Math.max(...questions.map(question => question.ordem)) + 1 : 0; }
