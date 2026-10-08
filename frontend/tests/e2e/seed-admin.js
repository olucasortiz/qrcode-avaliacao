import { cadastrar } from '../../../src/services/authService.js';
import prisma from '../../../src/config/prisma.js';

export async function seedAdmin() {
  if (process.env.NODE_ENV !== 'test' || process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL) throw new Error('Fixtures exigem o banco isolado de testes.');
  const { usuario } = await cadastrar({ empresa: { nome: 'Empresa de teste do dashboard', email: 'admin-company@example.com' },
    nome: 'Marina Costa', email: 'admin-browser@example.com', senha: 'FeedQR-browser-123' });
  const first = await prisma.pesquisa.create({ data: { empresaId: usuario.empresaId, titulo: 'Atendimento na loja',
    descricao: 'Experi\u00eancia de atendimento e satisfa\u00e7\u00e3o dos clientes.', slug: 'atendimento-teste', status: 'ATIVA',
    perguntas: { create: [
      { texto: 'Como foi o atendimento?', tipo: 'ESTRELAS', obrigatoria: true, ordem: 0 },
      { texto: 'Como voc\u00ea avalia o tempo de espera?', tipo: 'ESTRELAS', obrigatoria: true, ordem: 1 },
      { texto: 'Voc\u00ea recomendaria nossa loja?', tipo: 'NPS', obrigatoria: true, ordem: 2 },
      { texto: 'O que podemos melhorar?', tipo: 'TEXTO', obrigatoria: false, ordem: 3 },
      { texto: 'Encontrou o que procurava?', tipo: 'SIM_NAO', obrigatoria: true, ordem: 4 },
      { texto: 'Qual setor voc\u00ea visitou?', tipo: 'MULTIPLA_ESCOLHA', obrigatoria: true, ordem: 5, opcoes: { create: [{ texto: 'Loja', ordem: 0 }, { texto: 'Retirada', ordem: 1 }] } },
    ] }, pontosColeta: { create: [{ nome: 'Balc\u00e3o' }, { nome: 'Recep\u00e7\u00e3o', ativo: false }] },
  }, include: { perguntas: { orderBy: { ordem: 'asc' }, include: { opcoes: { orderBy: { ordem: 'asc' } } } }, pontosColeta: { orderBy: { createdAt: 'asc' } } } });
  const second = await prisma.pesquisa.create({ data: { empresaId: usuario.empresaId, titulo: 'Experi\u00eancia na entrega', slug: 'entrega-teste', status: 'ATIVA',
    perguntas: { create: { texto: 'Como foi a entrega?', tipo: 'ESTRELAS', obrigatoria: true, ordem: 0 } },
  }, include: { perguntas: true } });
  let index = 0;
  for (const [day, amount] of [2, 4, 3, 6, 4, 5, 4].entries()) {
    const createdAt = new Date(`2026-10-${String(day + 1).padStart(2, '0')}T12:00:00Z`);
    for (let i = 0; i < amount; i++, index++) {
      const values = [
        { valorEstrelas: [5, 4, 4, 3][index % 4] }, { valorEstrelas: [2, 2, 3, 1][index % 4] },
        { valorNps: [10, 9, 8, 4][index % 4] }, ...(index % 2 ? [] : [{ valorTexto: 'Atendimento muito atencioso.' }]),
      ];
      const answers = first.perguntas.filter(question => question.tipo !== 'TEXTO' || index % 2 === 0).map(question => {
        const value = question.tipo === 'ESTRELAS' ? values[question.ordem] : question.tipo === 'NPS' ? values[2]
          : question.tipo === 'TEXTO' ? values[3] : question.tipo === 'SIM_NAO' ? { valorSimNao: index % 3 !== 0 }
            : { opcaoPerguntaId: question.opcoes[index % 2].id };
        return { pesquisaId: first.id, perguntaId: question.id, tipo: question.tipo, ...value, createdAt };
      });
      const response = await prisma.resposta.create({ data: { pesquisaId: first.id, pontoColetaId: first.pontosColeta[index % 2].id, createdAt } });
      await prisma.respostaPergunta.createMany({ data: answers.map(answer => ({ ...answer, respostaId: response.id })) });
    }
    const response = await prisma.resposta.create({ data: { pesquisaId: second.id, createdAt } });
    await prisma.respostaPergunta.create({ data: { respostaId: response.id, pesquisaId: second.id, perguntaId: second.perguntas[0].id, tipo: 'ESTRELAS', valorEstrelas: 5, createdAt } });
  }
  for (let index = 0; index < 11; index++) await prisma.pesquisa.create({ data: { empresaId: usuario.empresaId,
    titulo: `Pesquisa em prepara\u00e7\u00e3o ${index + 1}`, slug: `rascunho-teste-${index + 1}`, createdAt: new Date(`2026-09-${String(index + 1).padStart(2, '0')}T12:00:00Z`) } });
}
