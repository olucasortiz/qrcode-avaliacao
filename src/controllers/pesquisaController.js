import { publicarPesquisa } from '../services/pesquisaService.js';
import * as service from '../services/pesquisaService.js';
import { idSchema, pesquisaCreateSchema, pesquisaUpdateSchema, pesquisaListSchema } from '../utils/schemas.js';

export async function publicar(req, res) {
  res.json(await publicarPesquisa(idSchema.parse(req.params.id), req.auth.empresaId));
}

export async function criar(req, res) {
  res.status(201).json(await service.criarPesquisa(req.auth.empresaId, pesquisaCreateSchema.parse(req.body)));
}
export async function listar(req, res) {
  res.json(await service.listarPesquisas(req.auth.empresaId, pesquisaListSchema.parse(req.query)));
}
export async function obter(req, res) {
  res.json(await service.ownedPesquisa(idSchema.parse(req.params.id), req.auth.empresaId));
}
export async function atualizar(req, res) {
  res.json(await service.atualizarPesquisa(idSchema.parse(req.params.id), req.auth.empresaId, pesquisaUpdateSchema.parse(req.body)));
}
export async function excluir(req, res) {
  await service.excluirPesquisa(idSchema.parse(req.params.id), req.auth.empresaId);
  res.status(204).end();
}
