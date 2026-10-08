import { obterResultados } from '../services/resultadoService.js';
import { filtroSchema, idSchema } from '../utils/schemas.js';

export async function dashboard(req, res) {
  res.json(await obterResultados(req.auth.empresaId, filtroSchema.parse(req.query)));
}

export async function resultados(req, res) {
  res.json(await obterResultados(req.auth.empresaId, filtroSchema.parse(req.query), idSchema.parse(req.params.id)));
}
