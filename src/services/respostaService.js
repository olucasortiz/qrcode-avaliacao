import prisma from '../config/prisma.js';
import { createHash } from 'node:crypto';
import { AppError } from '../utils/AppError.js';
import { valorSchemas } from '../utils/schemas.js';
import { activePesquisa } from './pesquisaService.js';

const campos = { ESTRELAS: 'valorEstrelas', NPS: 'valorNps', SIM_NAO: 'valorSimNao', TEXTO: 'valorTexto', MULTIPLA_ESCOLHA: 'opcaoPerguntaId' };

export async function enviarResposta(slug, data, idempotencyKey) {
  // Bind retries to the exact survey, origin and answers, without storing the origin token.
  const submissionHash = idempotencyKey ? createHash('sha256').update(JSON.stringify({
    slug, origem: data.origem ?? null,
    respostas: [...data.respostas].sort((a, b) => a.perguntaId.localeCompare(b.perguntaId)),
  })).digest('hex') : null;
  const checkRetry = async client => {
    if (!idempotencyKey) return false;
    const previous = await client.resposta.findUnique({ where: { idempotencyKey }, select: { submissionHash: true } });
    if (!previous) return false;
    if (previous.submissionHash !== submissionHash) throw new AppError(409, 'Tentativa de envio conflitante.');
    return true;
  };
  try {
    await prisma.$transaction(async tx => {
      if (await checkRetry(tx)) return;
      const { pesquisa, pontoColetaId } = await activePesquisa(slug, data.origem, tx);
      const perguntas = new Map(pesquisa.perguntas.map(pergunta => [pergunta.id, pergunta]));
      const recebidas = new Set();
      const respostas = data.respostas.map(item => {
        if (recebidas.has(item.perguntaId)) throw new AppError(400, 'Pergunta duplicada.');
        recebidas.add(item.perguntaId);
        const pergunta = perguntas.get(item.perguntaId);
        if (!pergunta) throw new AppError(400, 'Pergunta desconhecida.');
        const result = valorSchemas[pergunta.tipo].safeParse(item.valor);
        if (!result.success) throw new AppError(400, `Valor invalido para a pergunta ${pergunta.id}.`);
        if (pergunta.tipo === 'MULTIPLA_ESCOLHA' && !pergunta.opcoes.some(opcao => opcao.id === result.data)) {
          throw new AppError(400, 'Opcao invalida para a pergunta.');
        }
        return { perguntaId: pergunta.id, pesquisaId: pesquisa.id, tipo: pergunta.tipo, [campos[pergunta.tipo]]: result.data };
      });
      if (pesquisa.perguntas.some(pergunta => pergunta.obrigatoria && !recebidas.has(pergunta.id))) {
        throw new AppError(400, 'Responda todas as perguntas obrigatorias.');
      }
      const resposta = await tx.resposta.create({ data: { pesquisaId: pesquisa.id, pontoColetaId,
        ...(idempotencyKey ? { idempotencyKey, submissionHash } : {}) } });
      if (respostas.length) await tx.respostaPergunta.createMany({ data: respostas.map(item => ({ ...item, respostaId: resposta.id })) });
    });
  } catch (error) {
    // Concurrent attempts can race on the unique key; only acknowledge an identical committed payload.
    if (!['P2002', 'P2034', 'P1008', 'P2028'].includes(error.code) || !await checkRetry(prisma)) throw error;
  }
  return { mensagem: 'Resposta registrada.' };
}
