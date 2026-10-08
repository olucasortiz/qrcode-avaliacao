import { request } from '../lib/api.js';

export const points = {
  create: (pesquisaId, body) => request(`/pesquisas/${encodeURIComponent(pesquisaId)}/pontos`, { method: 'POST', body }),
  update: (id, body) => request(`/pontos/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  remove: id => request(`/pontos/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  qr: id => request(`/pontos/${encodeURIComponent(id)}/qrcode`, { responseType: 'png' }),
};
