import { z } from 'zod';
export const percent = (amount, total) => total ? amount * 100 / total : 0;
const date = z.union([z.literal(''), z.iso.date('Informe uma data válida.')]);
const uuid = z.union([z.literal(''), z.uuid('Selecione uma opção válida.')]);
export const analyticsFiltersSchema = z.object({ inicio: date, fim: date, pontoColetaId: uuid,
  perguntaId: uuid, nota: z.union([z.literal(''), z.coerce.number().int().min(0).max(10)]),
}).refine(value => !value.inicio || !value.fim || value.inicio <= value.fim, { path: ['fim'], message: 'A data final deve ser igual ou posterior à inicial.' })
  .refine(value => value.nota === '' || !!value.perguntaId, { path: ['perguntaId'], message: 'Selecione a pergunta para filtrar por nota.' });
export function filtersFromQuery(query) {
  return Object.fromEntries(['inicio', 'fim', 'pontoColetaId', 'perguntaId', 'nota'].map(key => [key, query[key] ?? '']));
}
export function apiFilters(value, feedback = false) {
  return Object.fromEntries((feedback ? ['inicio', 'fim', 'pontoColetaId', 'perguntaId', 'nota'] : ['inicio', 'fim', 'pontoColetaId'])
    .filter(key => value[key] !== '' && value[key] !== undefined).map(key => [key, value[key]]));
}
export function safeCsvName(disposition, id) {
  const name = /filename="?([^";]+)"?/i.exec(disposition)?.[1]?.trim();
  return /^pesquisa-[a-f\d-]{36}\.csv$/i.test(name || '') ? name : `pesquisa-${z.uuid().parse(id)}.csv`;
}
export function feedbackValue(answer) {
  switch (answer.pergunta.tipo) {
    case 'ESTRELAS': return `${answer.nota} ${answer.nota === 1 ? 'estrela' : 'estrelas'}`;
    case 'NPS': return `${answer.nota} / 10`;
    case 'SIM_NAO': return answer.simNao === true ? 'Sim' : answer.simNao === false ? 'Não' : 'Sem resposta';
    case 'MULTIPLA_ESCOLHA': return answer.opcao?.texto || 'Sem resposta';
    case 'TEXTO': return answer.texto || 'Sem resposta';
    default: return 'Sem resposta';
  }
}
export const feedbackDate = value => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(new Date(value));
