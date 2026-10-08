import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { perguntaCreateSchema } from '../utils/schemas.js';
import { ownedPesquisa, perguntasInclude, requireDraft } from './pesquisaService.js';

async function ownedPergunta(id, pesquisaId, empresaId, client = prisma) {
  await ownedPesquisa(pesquisaId, empresaId, client);
  const pergunta = await client.pergunta.findFirst({ where: { id, pesquisaId }, include: perguntasInclude.include });
  if (!pergunta) throw new AppError(404, 'Pergunta nao encontrada.');
  return pergunta;
}

export async function listarPerguntas(pesquisaId, empresaId) {
  await ownedPesquisa(pesquisaId, empresaId);
  return prisma.pergunta.findMany({ where: { pesquisaId }, ...perguntasInclude });
}

export async function obterPergunta(id, pesquisaId, empresaId) {
  return ownedPergunta(id, pesquisaId, empresaId);
}

export async function criarPergunta(pesquisaId, empresaId, data) {
  return prisma.$transaction(async tx => {
    requireDraft(await ownedPesquisa(pesquisaId, empresaId, tx));
    const { opcoes, ...fields } = data;
    return tx.pergunta.create({ data: { ...fields, pesquisaId, opcoes: { create: opcoes } }, include: perguntasInclude.include });
  });
}

export async function atualizarPergunta(id, pesquisaId, empresaId, data) {
  return prisma.$transaction(async tx => {
    requireDraft(await ownedPesquisa(pesquisaId, empresaId, tx));
    const existing = await ownedPergunta(id, pesquisaId, empresaId, tx);
    const candidate = perguntaCreateSchema.parse({ texto: existing.texto, tipo: existing.tipo, obrigatoria: existing.obrigatoria,
      ordem: existing.ordem, opcoes: existing.opcoes.map(opcao => ({ texto: opcao.texto, ordem: opcao.ordem })), ...data });
    const { opcoes, ...fields } = candidate;
    return tx.pergunta.update({ where: { id }, data: { ...fields,
      ...(data.opcoes !== undefined ? { opcoes: { deleteMany: {}, create: opcoes } } : {}),
    }, include: perguntasInclude.include });
  });
}

export async function excluirPergunta(id, pesquisaId, empresaId) {
  return prisma.$transaction(async tx => {
    requireDraft(await ownedPesquisa(pesquisaId, empresaId, tx));
    await ownedPergunta(id, pesquisaId, empresaId, tx);
    await tx.opcaoPergunta.deleteMany({ where: { perguntaId: id } });
    await tx.pergunta.delete({ where: { id } });
  });
}
