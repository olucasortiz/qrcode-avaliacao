import { once } from 'node:events';
import * as service from '../services/feedbackService.js';
import { idSchema, feedbackSchema, exportSchema } from '../utils/schemas.js';

export async function listar(req, res) {
  res.json(await service.listarFeedbacks(idSchema.parse(req.params.id), req.auth.empresaId, feedbackSchema.parse(req.query)));
}

export async function exportar(req, res) {
  const id = idSchema.parse(req.params.id);
  const where = await service.prepararFeedbacks(id, req.auth.empresaId, exportSchema.parse(req.query));
  const disconnected = new AbortController();
  res.once('close', () => disconnected.abort());
  res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="pesquisa-${id}.csv"` });
  res.write(`\uFEFF${service.csvHeader}`);
  try {
    for await (const row of service.exportarFeedbacks(where)) {
      if (res.destroyed) break;
      if (!res.write(row)) await once(res, 'drain', { signal: disconnected.signal });
    }
  } catch (error) {
    if (!res.destroyed) throw error;
  }
  if (!res.destroyed) res.end();
}
