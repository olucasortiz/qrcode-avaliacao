import { z } from 'zod';

const text = z.string().trim().min(1);
const fields = { id: z.uuid(), texto: text.max(2000), obrigatoria: z.boolean() };
const option = z.object({ id: z.uuid(), texto: text.max(500) });
export const publicSurveySchema = z.object({
  titulo: text.max(200), descricao: z.string().max(2000).nullable().optional(),
  slug: z.string().min(1).max(200),
  perguntas: z.array(z.discriminatedUnion('tipo', [
    ...['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO'].map(tipo => z.object({ ...fields, tipo: z.literal(tipo) })),
    z.object({ ...fields, tipo: z.literal('MULTIPLA_ESCOLHA'), opcoes: z.array(option).min(2)
      .refine(items => new Set(items.map(item => item.id)).size === items.length) }),
  ])).min(1).refine(items => new Set(items.map(item => item.id)).size === items.length),
});

export const originSchema = z.string().min(16).max(128).regex(/^[a-zA-Z0-9-]+$/).optional();
const values = {
  ESTRELAS: z.number().int().min(1).max(5),
  NPS: z.number().int().min(0).max(10),
  SIM_NAO: z.boolean(),
  TEXTO: z.string().trim().min(1).max(2000),
  MULTIPLA_ESCOLHA: z.uuid(),
};
export function isUnanswered(value) {
  return value === undefined || value === null || (typeof value === 'string' && !value.trim());
}
export function answerError(question, value) {
  if (isUnanswered(value)) return question.obrigatoria ? 'Responda esta pergunta para continuar.' : '';
  if (!values[question.tipo]?.safeParse(value).success) {
    return question.tipo === 'TEXTO' ? 'Escreva uma resposta de até 2.000 caracteres.' : 'Selecione uma resposta válida.';
  }
  if (question.tipo === 'MULTIPLA_ESCOLHA' && !question.opcoes.some(option => option.id === value)) return 'Selecione uma das alternativas.';
  return '';
}
export function responsePayload(survey, answers, origin) {
  const respostas = survey.perguntas.filter(question => !isUnanswered(answers[question.id]))
    .map(question => ({ perguntaId: question.id,
      valor: question.tipo === 'TEXTO' ? answers[question.id].trim() : answers[question.id] }));
  return { ...(origin !== undefined ? { origem: origin } : {}), respostas };
}

export function publicError(error, sending = false) {
  if (sending && error.status === 409) return { title: 'Esta tentativa precisa ser revisada.',
    message: 'Suas respostas foram preservadas. Confira os dados e tente enviar novamente.', retry: true };
  if (error.status === 404) return { title: 'Esta pesquisa está indisponível.',
    message: 'Ela pode ter sido encerrada ou o link não está mais disponível.', retry: false };
  if (error.status === 400 && !sending) return { title: 'Este QR Code não está disponível.',
    message: 'O ponto de coleta pode estar desativado ou o link é inválido. Confira o QR Code com o estabelecimento.', retry: false };
  if (error.status === 429) return { title: 'Vamos dar uma pequena pausa.',
    message: 'Houve muitas tentativas. Aguarde alguns minutos e tente novamente.', retry: true };
  if (sending && error.status === 400) return { title: 'Não foi possível enviar.',
    message: 'Confira suas respostas. Se o problema continuar, o ponto de coleta pode ter sido desativado.', retry: true };
  if (sending && error.status === 413) return { title: 'Sua resposta ficou muito longa.',
    message: 'Reduza o tamanho dos textos e tente novamente.', retry: true };
  return { title: sending ? 'Ainda não conseguimos confirmar o envio.' : 'Não conseguimos abrir a pesquisa.',
    message: sending ? 'Suas respostas estão preservadas. Confira sua conexão e tente confirmar o envio novamente.'
      : 'O serviço está temporariamente indisponível ou a conexão foi interrompida. Tente novamente em instantes.', retry: true };
}
