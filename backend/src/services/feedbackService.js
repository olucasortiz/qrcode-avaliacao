import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { csvRow } from '../utils/csv.js';
import { periodoWhere } from '../utils/periodo.js';
import { ownedPesquisa } from './pesquisaService.js';
import { ownedPonto } from './pontoColetaService.js';

const feedbackSelect = {
  id: true, createdAt: true,
  pontoColeta: { select: { id: true, nome: true } },
  perguntas: { orderBy: { pergunta: { ordem: 'asc' } }, select: {
    valorEstrelas: true, valorNps: true, valorSimNao: true, valorTexto: true,
    pergunta: { select: { id: true, texto: true, tipo: true } },
    opcaoPergunta: { select: { id: true, texto: true } },
  } },
};

export async function prepararFeedbacks(pesquisaId, empresaId, filtros, client = prisma) {
  await ownedPesquisa(pesquisaId, empresaId, client);
  if (filtros.pontoColetaId) {
    const ponto = await ownedPonto(filtros.pontoColetaId, empresaId, client);
    if (ponto.pesquisaId !== pesquisaId) throw new AppError(400, 'Ponto nao pertence a pesquisa.');
  }
  let perguntaWhere;
  if (filtros.perguntaId) {
    const pergunta = await client.pergunta.findFirst({ where: { id: filtros.perguntaId, pesquisaId }, select: { tipo: true } });
    if (!pergunta) throw new AppError(404, 'Pergunta nao encontrada.');
    perguntaWhere = { perguntaId: filtros.perguntaId };
    if (filtros.nota !== undefined) {
      if (!['ESTRELAS', 'NPS'].includes(pergunta.tipo)) throw new AppError(400, 'Filtro de nota exige pergunta ESTRELAS ou NPS.');
      if (pergunta.tipo === 'ESTRELAS' && (filtros.nota < 1 || filtros.nota > 5)) throw new AppError(400, 'Nota de estrelas deve ser de 1 a 5.');
      perguntaWhere[pergunta.tipo === 'ESTRELAS' ? 'valorEstrelas' : 'valorNps'] = filtros.nota;
    }
  }
  return { pesquisaId, pesquisa: { empresaId }, ...periodoWhere(filtros),
    ...(filtros.pontoColetaId ? { pontoColetaId: filtros.pontoColetaId } : {}),
    ...(perguntaWhere ? { perguntas: { some: perguntaWhere } } : {}),
  };
}

function feedbackDto(resposta) {
  return { id: resposta.id, data: resposta.createdAt, origem: resposta.pontoColeta,
    respostas: resposta.perguntas.map(item => ({ pergunta: item.pergunta,
      nota: item.valorEstrelas ?? item.valorNps, texto: item.valorTexto,
      simNao: item.valorSimNao, opcao: item.opcaoPergunta,
    })),
  };
}

export async function listarFeedbacks(pesquisaId, empresaId, filtros) {
  return prisma.$transaction(async tx => {
    const where = await prepararFeedbacks(pesquisaId, empresaId, filtros, tx);
    const total = await tx.resposta.count({ where });
    const rows = await tx.resposta.findMany({ where, select: feedbackSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (filtros.pagina - 1) * filtros.limite, take: filtros.limite,
    });
    return { itens: rows.map(feedbackDto), pagina: filtros.pagina, limite: filtros.limite,
      total, totalPaginas: Math.ceil(total / filtros.limite),
    };
  });
}

export const csvHeader = csvRow(['Resposta ID', 'Data (UTC)', 'Origem', 'Pergunta', 'Tipo', 'Nota', 'Resposta textual', 'Sim/Nao', 'Opcao']);

export async function* exportarFeedbacks(where) {
  let cursor;
  while (true) {
    const rows = await prisma.resposta.findMany({ where, select: feedbackSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 100,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    for (const resposta of rows) {
      for (const item of resposta.perguntas.length ? resposta.perguntas : [null]) {
        yield csvRow([resposta.id, resposta.createdAt.toISOString(), resposta.pontoColeta?.nome || 'Sem origem',
          item?.pergunta.texto, item?.pergunta.tipo, item?.valorEstrelas ?? item?.valorNps, item?.valorTexto,
          item?.valorSimNao === null || item?.valorSimNao === undefined ? '' : item.valorSimNao ? 'Sim' : 'Nao', item?.opcaoPergunta?.texto]);
      }
    }
    if (rows.length < 100) break;
    cursor = rows.at(-1).id;
  }
}
