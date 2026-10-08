import { request, ApiError } from '../lib/api.js';

const path = pesquisaId => `/pesquisas/${encodeURIComponent(pesquisaId)}/perguntas`;
export const questions = {
  create: (pesquisaId, body) => request(path(pesquisaId), { method: 'POST', body }),
  update: (pesquisaId, id, body) => request(`${path(pesquisaId)}/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  remove: (pesquisaId, id) => request(`${path(pesquisaId)}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

// A ordem e unica no SQLite; a API atual nao oferece uma troca atomica.
export async function swapQuestionOrder(pesquisaId, items, first, second) {
  const occupied = new Set(items.map(item => item.ordem));
  let temporary = 0;
  while (occupied.has(temporary)) temporary++;
  if (temporary > 10000) throw new ApiError('N\u00e3o h\u00e1 posi\u00e7\u00e3o livre para reorganizar as perguntas.');
  let stage = 0;
  try {
    await questions.update(pesquisaId, first.id, { ordem: temporary }); stage = 1;
    await questions.update(pesquisaId, second.id, { ordem: first.ordem }); stage = 2;
    await questions.update(pesquisaId, first.id, { ordem: second.ordem });
  } catch (error) {
    if (!stage) throw error;
    try {
      if (stage === 2) await questions.update(pesquisaId, second.id, { ordem: second.ordem });
      await questions.update(pesquisaId, first.id, { ordem: first.ordem });
    } catch {
      throw new ApiError('A ordem pode ter sido salva parcialmente. Confira a lista atualizada antes de continuar.');
    }
    throw error;
  }
}
