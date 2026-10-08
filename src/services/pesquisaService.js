import prisma from '../config/prisma.js';
import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/AppError.js';
import { slugSchema } from '../utils/schemas.js';

export const perguntasInclude = { orderBy: { ordem: 'asc' }, include: { opcoes: { orderBy: { ordem: 'asc' } } } };

export async function ownedPesquisa(id, empresaId, client = prisma) {
  const pesquisa = await client.pesquisa.findFirst({ where: { id, empresaId } });
  if (!pesquisa) throw new AppError(404, 'Pesquisa nao encontrada.');
  return pesquisa;
}

export function requireDraft(pesquisa) {
  if (pesquisa.status !== 'RASCUNHO') throw new AppError(409, 'Somente pesquisas RASCUNHO podem ser editadas.');
}

export async function criarPesquisa(empresaId, data) {
  return prisma.pesquisa.create({ data: { ...data, empresaId, slug: data.slug || randomUUID() } });
}

export async function listarPesquisas(empresaId, filtros) {
  const { pagina, limite, status } = filtros;
  const where = { empresaId, ...(status ? { status } : {}) };
  return prisma.$transaction(async tx => {
    const total = await tx.pesquisa.count({ where });
    const itens = await tx.pesquisa.findMany({ where, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (pagina - 1) * limite, take: limite });
    return { itens, pagina, limite, total, totalPaginas: Math.ceil(total / limite) };
  });
}

export async function atualizarPesquisa(id, empresaId, data) {
  return prisma.$transaction(async tx => {
    const pesquisa = await ownedPesquisa(id, empresaId, tx);
    if (data.status === 'ENCERRADA') {
      if (pesquisa.status !== 'ATIVA') throw new AppError(409, 'Somente pesquisas ATIVA podem ser encerradas.');
      if (Object.keys(data).length !== 1) throw new AppError(400, 'Envie somente status para encerrar.');
    } else {
      requireDraft(pesquisa);
    }
    return tx.pesquisa.update({ where: { id }, data });
  });
}

export async function excluirPesquisa(id, empresaId) {
  return prisma.$transaction(async tx => {
    requireDraft(await ownedPesquisa(id, empresaId, tx));
    if (await tx.resposta.count({ where: { pesquisaId: id } })) throw new AppError(409, 'Pesquisa possui respostas.');
    await tx.opcaoPergunta.deleteMany({ where: { pergunta: { pesquisaId: id } } });
    await tx.pergunta.deleteMany({ where: { pesquisaId: id } });
    await tx.pontoColeta.deleteMany({ where: { pesquisaId: id } });
    await tx.pesquisa.delete({ where: { id } });
  });
}

export async function publicarPesquisa(id, empresaId) {
  return prisma.$transaction(async tx => {
    const pesquisa = await tx.pesquisa.findFirst({ where: { id, empresaId }, include: { perguntas: perguntasInclude } });
    if (!pesquisa) throw new AppError(404, 'Pesquisa nao encontrada.');
    if (pesquisa.status !== 'RASCUNHO') throw new AppError(409, 'Somente pesquisas RASCUNHO podem ser publicadas.');
    const validas = slugSchema.safeParse(pesquisa.slug).success && pesquisa.slug.trim().length > 0 &&
      pesquisa.perguntas.length > 0 && pesquisa.perguntas.every(pergunta =>
      pergunta.texto.trim().length > 0 && pergunta.ordem >= 0 &&
      (pergunta.tipo === 'MULTIPLA_ESCOLHA'
        ? pergunta.opcoes.length >= 2 && pergunta.opcoes.every(opcao => opcao.texto.trim().length > 0 && opcao.ordem >= 0)
        : pergunta.opcoes.length === 0));
    if (!validas) throw new AppError(400, 'Pesquisa deve ter perguntas validas; multipla escolha exige pelo menos duas opcoes.');
    const updated = await tx.pesquisa.updateMany({ where: { id, empresaId, status: 'RASCUNHO' }, data: { status: 'ATIVA' } });
    if (!updated.count) throw new AppError(409, 'Pesquisa ja publicada.');
    return { id, slug: pesquisa.slug, status: 'ATIVA' };
  });
}

export async function activePesquisa(slug, origem, client = prisma) {
  const pesquisa = await client.pesquisa.findFirst({ where: { slug, status: 'ATIVA' }, include: { perguntas: perguntasInclude } });
  if (!pesquisa) throw new AppError(404, 'Pesquisa nao encontrada.');
  let pontoColetaId = null;
  if (origem !== undefined) {
    const ponto = await client.pontoColeta.findFirst({ where: { token: origem, pesquisaId: pesquisa.id, ativo: true }, select: { id: true } });
    if (!ponto) throw new AppError(400, 'Origem invalida.');
    pontoColetaId = ponto.id;
  }
  return { pesquisa, pontoColetaId };
}
