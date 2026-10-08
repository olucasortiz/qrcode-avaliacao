import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { valorSchemas } from '../utils/schemas.js';
import { activePesquisa } from './pesquisaService.js';

const campos = { ESTRELAS: 'valorEstrelas', NPS: 'valorNps', SIM_NAO: 'valorSimNao', TEXTO: 'valorTexto', MULTIPLA_ESCOLHA: 'opcaoPerguntaId' };

export async function enviarResposta(slug, data) {
  await prisma.$transaction(async tx => {
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
    const resposta = await tx.resposta.create({ data: { pesquisaId: pesquisa.id, pontoColetaId } });
    await tx.respostaPergunta.createMany({ data: respostas.map(item => ({ ...item, respostaId: resposta.id })) });
  });
  return { mensagem: 'Resposta registrada.' };
}
