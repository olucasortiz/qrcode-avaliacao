import QRCode from 'qrcode';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { ownedPesquisa } from './pesquisaService.js';

export async function ownedPonto(id, empresaId, client = prisma) {
  const ponto = await client.pontoColeta.findFirst({ where: { id, pesquisa: { empresaId } }, include: { pesquisa: { select: { slug: true } } } });
  if (!ponto) throw new AppError(404, 'Ponto de coleta nao encontrado.');
  return ponto;
}

export async function listarPontos(pesquisaId, empresaId) {
  await ownedPesquisa(pesquisaId, empresaId);
  return prisma.pontoColeta.findMany({ where: { pesquisaId }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] });
}

export async function criarPonto(pesquisaId, empresaId, data) {
  return prisma.$transaction(async tx => {
    await ownedPesquisa(pesquisaId, empresaId, tx);
    return tx.pontoColeta.create({ data: { pesquisaId, nome: data.nome } });
  });
}

export async function atualizarPonto(id, empresaId, data) {
  return prisma.$transaction(async tx => {
    await ownedPonto(id, empresaId, tx);
    return tx.pontoColeta.update({ where: { id }, data });
  });
}

export async function excluirPonto(id, empresaId) {
  return prisma.$transaction(async tx => {
    await ownedPonto(id, empresaId, tx);
    if (await tx.resposta.count({ where: { pontoColetaId: id } })) {
      throw new AppError(409, 'Ponto possui respostas. Desative-o para preservar o historico.');
    }
    await tx.pontoColeta.delete({ where: { id } });
  });
}

export async function gerarQrCode(id, empresaId) {
  const ponto = await ownedPonto(id, empresaId);
  if (!ponto.ativo) throw new AppError(409, 'Ponto de coleta inativo.');
  const base = env.frontendPublicUrl.replace(/\/+$/, '');
  const url = new URL(`${base}/p/${encodeURIComponent(ponto.pesquisa.slug)}`);
  url.searchParams.set('origem', ponto.token);
  return QRCode.toBuffer(url.toString(), { type: 'png', width: 512, margin: 2, errorCorrectionLevel: 'M' });
}
