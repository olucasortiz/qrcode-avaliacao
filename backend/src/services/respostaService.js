import { createHash } from 'node:crypto';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { valorSchemas } from '../utils/schemas.js';
import { activePesquisa } from './pesquisaService.js';

const campos = {
  ESTRELAS: 'valorEstrelas',
  NPS: 'valorNps',
  SIM_NAO: 'valorSimNao',
  TEXTO: 'valorTexto',
  MULTIPLA_ESCOLHA: 'opcaoPerguntaId',
};

export async function enviarResposta(slug, data, idempotencyKey) {
  const submissionHash = idempotencyKey ? createHash('sha256').update(JSON.stringify({
    slug,
    origem: data.origem ?? null,
    respostas: [...data.respostas].sort((a, b) => a.perguntaId.localeCompare(b.perguntaId)),
  })).digest('hex') : null;

  // 1. Verificação prévia fora de transação para replay idêntico
  if (idempotencyKey) {
    const existing = await prisma.resposta.findFirst({
      where: { idempotencyKey },
      select: { submissionHash: true },
    });
    if (existing) {
      if (existing.submissionHash === submissionHash) {
        return { mensagem: 'Resposta registrada.' };
      }
      throw new AppError(409, 'Tentativa de envio conflitante.');
    }
  }

  const executeTransaction = async () => {
    return prisma.$transaction(async tx => {
      // Re-verificar dentro da transação caso outra execução concorrente tenha acabado de persistir
      if (idempotencyKey) {
        const inside = await tx.resposta.findFirst({
          where: { idempotencyKey },
          select: { submissionHash: true },
        });
        if (inside) {
          if (inside.submissionHash === submissionHash) return { replay: true };
          throw new AppError(409, 'Tentativa de envio conflitante.');
        }
      }

      // Validação da pesquisa ativa
      const { pesquisa, pontoColetaId } = await activePesquisa(slug, data.origem, tx);

      // Coordenação por pesquisa: escrita efetiva em Pesquisa (incremento de writeVersion)
      await tx.pesquisa.update({
        where: { id: pesquisa.id },
        data: { writeVersion: { increment: 1 } },
      });

      // Validação de integridade referencial das perguntas
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
        return {
          perguntaId: pergunta.id,
          pesquisaId: pesquisa.id,
          tipo: pergunta.tipo,
          [campos[pergunta.tipo]]: result.data,
        };
      });

      if (pesquisa.perguntas.some(pergunta => pergunta.obrigatoria && !recebidas.has(pergunta.id))) {
        throw new AppError(400, 'Responda todas as perguntas obrigatorias.');
      }

      const resposta = await tx.resposta.create({
        data: {
          pesquisaId: pesquisa.id,
          pontoColetaId,
          ...(idempotencyKey ? { idempotencyKey, submissionHash } : {}),
        },
      });

      if (respostas.length) {
        await tx.respostaPergunta.createMany({
          data: respostas.map(item => ({ ...item, respostaId: resposta.id })),
        });
      }

      return { replay: false };
    });
  };

  // Retry com backoff exponencial e jitter para conflitos transitórios
  const maxRetries = 6;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await executeTransaction();
      return { mensagem: 'Resposta registrada.' };
    } catch (error) {
      // Reconciliação fora da transação abortada caso a chave de idempotência já tenha sido commitada
      if (idempotencyKey) {
        const reconciled = await prisma.resposta.findFirst({
          where: { idempotencyKey },
          select: { submissionHash: true },
        });
        if (reconciled) {
          if (reconciled.submissionHash === submissionHash) {
            return { mensagem: 'Resposta registrada.' };
          }
          throw new AppError(409, 'Tentativa de envio conflitante.');
        }
      }

      if (error instanceof AppError) throw error;

      const isTransient =
        ['P2002', 'P2034', 'P2028', 'P1008'].includes(error.code) ||
        error.code === 112 ||
        error.code === 251 ||
        error.message?.includes('WriteConflict') ||
        error.message?.includes('Transaction') ||
        error.message?.includes('deadlock');

      attempt++;
      if (isTransient && attempt < maxRetries) {
        const backoffMs = Math.min(20 * Math.pow(2, attempt) + Math.floor(Math.random() * 25), 500);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }

      if (error.code === 'P2002' || error.code === 11000) {
        throw new AppError(409, 'Operacao conflita com registros existentes.');
      }

      throw error;
    }
  }

  throw new AppError(500, 'Nao foi possivel registrar a resposta apos multiplas tentativas.');
}
