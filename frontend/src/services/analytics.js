import { request } from '../lib/api.js';
import { query } from './surveys.js';
import { safeCsvName } from '../lib/analytics.js';
export const analytics = {
  results: (id, filters) => request(`/pesquisas/${encodeURIComponent(id)}/resultados${query(filters)}`),
  feedbacks: (id, filters) => request(`/pesquisas/${encodeURIComponent(id)}/feedbacks${query(filters)}`),
  async export(id, filters) {
    const data = await request(`/pesquisas/${encodeURIComponent(id)}/exportar${query(filters)}`, { responseType: 'csv' });
    return { blob: data.blob, filename: safeCsvName(data.disposition, id) };
  },
};
