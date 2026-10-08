import { z } from 'zod';

const titulo = z.string().trim().min(1, 'Informe o t\u00edtulo.').max(200, 'Use at\u00e9 200 caracteres.');
const descricao = z.string().trim().max(2000, 'Use at\u00e9 2000 caracteres.').transform(value => value || null);
const slug = z.string().min(1, 'Informe o slug.').max(200, 'Use at\u00e9 200 caracteres.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use letras min\u00fasculas, n\u00fameros e hifens entre palavras.');
export const createSurveySchema = z.strictObject({ titulo, descricao, slug: z.union([z.literal(''), slug]).transform(value => value || undefined) });
export const editSurveySchema = z.strictObject({ titulo, descricao, slug });
const date = z.union([z.literal(''), z.iso.date('Informe uma data v\u00e1lida.')]);
export const dashboardFiltersSchema = z.strictObject({ inicio: date, fim: date,
  pesquisaId: z.union([z.literal(''), z.uuid()]), pontoColetaId: z.union([z.literal(''), z.uuid()]),
}).refine(value => !value.inicio || !value.fim || value.inicio <= value.fim,
  { path: ['fim'], message: 'A data final deve ser igual ou posterior \u00e0 inicial.' });

export const surveyStatuses = { RASCUNHO: 'Rascunho', ATIVA: 'Ativa', ENCERRADA: 'Encerrada' };
export const questionTypes = { ESTRELAS: 'Estrelas', NPS: 'NPS', SIM_NAO: 'Sim / N\u00e3o', TEXTO: 'Texto', MULTIPLA_ESCOLHA: 'M\u00faltipla escolha' };
export function publicationProblem(questions) {
  if (!questions.length) return 'Adicione pelo menos uma pergunta v\u00e1lida antes de publicar.';
  if (questions.some(question => !question.texto.trim() || question.ordem < 0 ||
    (question.tipo === 'MULTIPLA_ESCOLHA'
      ? question.opcoes.length < 2 || question.opcoes.some(option => !option.texto.trim() || option.ordem < 0)
      : question.opcoes.length > 0))) return 'Revise as perguntas e as op\u00e7\u00f5es antes de publicar.';
  return '';
}
