import * as service from '../services/perguntaService.js';
import { idSchema, perguntaCreateSchema, perguntaUpdateSchema } from '../utils/schemas.js';

export async function listar(req, res) {
  res.json(await service.listarPerguntas(idSchema.parse(req.params.pesquisaId), req.auth.empresaId));
}
export async function obter(req, res) {
  res.json(await service.obterPergunta(idSchema.parse(req.params.id), idSchema.parse(req.params.pesquisaId), req.auth.empresaId));
}
export async function criar(req, res) {
  res.status(201).json(await service.criarPergunta(idSchema.parse(req.params.pesquisaId), req.auth.empresaId, perguntaCreateSchema.parse(req.body)));
}
export async function atualizar(req, res) {
  res.json(await service.atualizarPergunta(idSchema.parse(req.params.id), idSchema.parse(req.params.pesquisaId), req.auth.empresaId, perguntaUpdateSchema.parse(req.body)));
}
export async function excluir(req, res) {
  await service.excluirPergunta(idSchema.parse(req.params.id), idSchema.parse(req.params.pesquisaId), req.auth.empresaId);
  res.status(204).end();
}
