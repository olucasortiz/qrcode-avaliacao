import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { ownedPesquisa } from './pesquisaService.js';
import { ownedPonto } from './pontoColetaService.js';
import { periodoWhere } from '../utils/periodo.js';

export async function obterResultados(empresaId, filtros, pesquisaIdRota) {
  return prisma.$transaction(async tx => {
    let pesquisaId = pesquisaIdRota || filtros.pesquisaId;
    if (pesquisaIdRota && filtros.pesquisaId && filtros.pesquisaId !== pesquisaIdRota) {
      throw new AppError(400, 'Filtro de pesquisa incompativel com a rota.');
    }
    if (pesquisaId) await ownedPesquisa(pesquisaId, empresaId, tx);
    if (filtros.pontoColetaId) {
      const ponto = await ownedPonto(filtros.pontoColetaId, empresaId, tx);
      if (pesquisaId && ponto.pesquisaId !== pesquisaId) throw new AppError(400, 'Ponto nao pertence a pesquisa.');
      pesquisaId = ponto.pesquisaId;
    }
    const periodo = periodoWhere(filtros);
    const inicio = periodo.createdAt?.gte;
    const fim = periodo.createdAt?.lt;
    const pesquisaWhere = { empresaId, ...(pesquisaId ? { id: pesquisaId } : {}) };
    const respostaWhere = {
      pesquisa: pesquisaWhere,
      ...(filtros.pontoColetaId ? { pontoColetaId: filtros.pontoColetaId } : {}),
      ...periodo,
    };
    const answerWhere = { resposta: respostaWhere };
    const totalRespostas = await tx.resposta.count({ where: respostaWhere });
    const pesquisasAtivas = await tx.pesquisa.count({ where: { ...pesquisaWhere, status: 'ATIVA' } });
    const perguntas = await tx.pergunta.findMany({
      where: { pesquisa: pesquisaWhere }, orderBy: [{ pesquisaId: 'asc' }, { ordem: 'asc' }],
      select: { id: true, pesquisaId: true, texto: true, tipo: true,
        opcoes: { orderBy: { ordem: 'asc' }, select: { id: true, texto: true } } },
    });
    const counts = await tx.respostaPergunta.groupBy({ by: ['perguntaId'], where: answerWhere, _count: { _all: true } });
    const estrelas = await tx.respostaPergunta.groupBy({
      by: ['perguntaId', 'valorEstrelas'], where: { ...answerWhere, tipo: 'ESTRELAS' }, _count: { _all: true },
    });
    const nps = await tx.respostaPergunta.groupBy({
      by: ['perguntaId', 'valorNps'], where: { ...answerWhere, tipo: 'NPS' }, _count: { _all: true },
    });
    const escolhas = await tx.respostaPergunta.groupBy({
      by: ['perguntaId', 'opcaoPerguntaId'], where: { ...answerWhere, tipo: 'MULTIPLA_ESCOLHA' }, _count: { _all: true },
    });
    const simNao = await tx.respostaPergunta.groupBy({
      by: ['perguntaId', 'valorSimNao'], where: { ...answerWhere, tipo: 'SIM_NAO' }, _count: { _all: true },
    });

    // Agrupamento diário UTC via pipeline de agregação nativo MongoDB
    const matchFilter = {};
    if (pesquisaId) {
      matchFilter.pesquisaId = pesquisaId;
    } else {
      const empresaPesquisas = await tx.pesquisa.findMany({ where: { empresaId }, select: { id: true } });
      matchFilter.pesquisaId = { $in: empresaPesquisas.map(p => p.id) };
    }
    if (filtros.pontoColetaId) {
      matchFilter.pontoColetaId = filtros.pontoColetaId;
    }
    if (inicio || fim) {
      matchFilter.createdAt = {};
      if (inicio) matchFilter.createdAt.$gte = { $date: inicio.toISOString() };
      if (fim) matchFilter.createdAt.$lt = { $date: fim.toISOString() };
    }

    const dias = await tx.resposta.aggregateRaw({
      pipeline: [
        { $match: matchFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
                timezone: 'UTC',
              },
            },
            quantidade: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            dia: '$_id',
            quantidade: 1,
          },
        },
      ],
    });

    const totais = new Map(counts.map(row => [row.perguntaId, row._count._all]));
    return {
      filtros: { inicio: filtros.inicio || null, fim: filtros.fim || null, pesquisaId: pesquisaId || null,
        pontoColetaId: filtros.pontoColetaId || null, timezone: 'UTC' },
      totalRespostas,
      pesquisasAtivas,
      perguntas: perguntas.map(pergunta => {
        const total = totais.get(pergunta.id) || 0;
        const { opcoes, ...publicFields } = pergunta;
        const metricas = { ...publicFields, totalRespostas: total };
        if (pergunta.tipo === 'ESTRELAS') {
          const rows = estrelas.filter(row => row.perguntaId === pergunta.id);
          metricas.distribuicao = Array.from({ length: 5 }, (_, i) => ({ valor: i + 1,
            quantidade: rows.find(row => row.valorEstrelas === i + 1)?._count._all || 0 }));
          metricas.media = total ? rows.reduce((sum, row) => sum + row.valorEstrelas * row._count._all, 0) / total : null;
        }
        if (pergunta.tipo === 'NPS') {
          const rows = nps.filter(row => row.perguntaId === pergunta.id);
          metricas.promotores = rows.filter(row => row.valorNps >= 9).reduce((sum, row) => sum + row._count._all, 0);
          metricas.detratores = rows.filter(row => row.valorNps <= 6).reduce((sum, row) => sum + row._count._all, 0);
          metricas.neutros = total - metricas.promotores - metricas.detratores;
          metricas.nps = total ? (metricas.promotores - metricas.detratores) * 100 / total : null;
        }
        if (pergunta.tipo === 'SIM_NAO') {
          metricas.distribuicao = [true, false].map(valor => ({ valor,
            quantidade: simNao.find(row => row.perguntaId === pergunta.id && row.valorSimNao === valor)?._count._all || 0 }));
        }
        if (pergunta.tipo === 'MULTIPLA_ESCOLHA') {
          metricas.distribuicao = opcoes.map(opcao => ({ ...opcao,
            quantidade: escolhas.find(row => row.perguntaId === pergunta.id && row.opcaoPerguntaId === opcao.id)?._count._all || 0 }));
        }
        return metricas;
      }),
      respostasPorDia: Array.isArray(dias) ? dias.map(row => ({ dia: row.dia, quantidade: Number(row.quantidade) })) : [],
    };
  });
}
