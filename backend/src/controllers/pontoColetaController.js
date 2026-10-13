import * as service from '../services/pontoColetaService.js';
import { idSchema, pontoCreateSchema, pontoUpdateSchema } from '../utils/schemas.js';

export async function listar(req, res) {
  res.json(await service.listarPontos(idSchema.parse(req.params.pesquisaId), req.auth.empresaId));
}

export async function criar(req, res) {
  res.status(201).json(await service.criarPonto(idSchema.parse(req.params.pesquisaId), req.auth.empresaId, pontoCreateSchema.parse(req.body)));
}

export async function obter(req, res) {
  const { pesquisa, ...ponto } = await service.ownedPonto(idSchema.parse(req.params.id), req.auth.empresaId);
  res.json(ponto);
}

export async function atualizar(req, res) {
  res.json(await service.atualizarPonto(idSchema.parse(req.params.id), req.auth.empresaId, pontoUpdateSchema.parse(req.body)));
}

export async function excluir(req, res) {
  await service.excluirPonto(idSchema.parse(req.params.id), req.auth.empresaId);
  res.status(204).end();
}

export async function qrcode(req, res) {
  const png = await service.gerarQrCode(idSchema.parse(req.params.id), req.auth.empresaId);
  res.type('png').send(png);
}
