import { request } from '../lib/api.js';

export function query(values) {
  const params = new URLSearchParams(Object.entries(values).filter(([, value]) => value !== '' && value !== undefined && value !== null));
  return params.size ? `?${params}` : '';
}
export const surveys = {
  list: filters => request(`/pesquisas${query(filters)}`),
  get: id => request(`/pesquisas/${encodeURIComponent(id)}`),
  create: body => request('/pesquisas', { method: 'POST', body }),
  update: (id, body) => request(`/pesquisas/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  remove: id => request(`/pesquisas/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  publish: id => request(`/pesquisas/${encodeURIComponent(id)}/publicar`, { method: 'POST' }),
  questions: id => request(`/pesquisas/${encodeURIComponent(id)}/perguntas`),
  points: id => request(`/pesquisas/${encodeURIComponent(id)}/pontos`),
  dashboard: filters => request(`/dashboard${query(filters)}`),
};
export async function allSurveys() {
  const items = [];
  for (let pagina = 1; ; pagina++) {
    const result = await surveys.list({ pagina, limite: 100 });
    items.push(...result.itens);
    if (pagina >= result.totalPaginas) return items;
  }
}
