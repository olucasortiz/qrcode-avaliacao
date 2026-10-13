/**
 * Fixtures sintéticas de caracterização para a migração do FeedQR.
 * 
 * ATENÇÃO:
 * - Estes dados são 100% sintéticos e isolados.
 * - NUNCA inserir estes dados em prisma/dev.db.
 * - Projetados para teste em bancos descartáveis (in-memory SQLite, MongoDB temporário).
 * - Cobrem todos os 5 tipos de pergunta, opções, pontos de coleta ativos e inativos,
 *   respostas com e sem ponto, idempotência presente e múltiplos nulos, e multi-empresa.
 */

export const SYNTHETIC_BASELINE_DATA = {
  Empresa: [
    {
      id: '10000000-0000-4000-8000-000000000001',
      nome: 'Empresa Alfa Sintética',
      email: 'alfa@synthetic.test.local',
      createdAt: 1790850000000, // 2026-10-01T10:20:00.000Z
      updatedAt: 1790850000000,
    },
    {
      id: '10000000-0000-4000-8000-000000000002',
      nome: 'Empresa Beta Sintética',
      email: 'beta@synthetic.test.local',
      createdAt: 1790850000000,
      updatedAt: 1790850000000,
    },
  ],

  Usuario: [
    {
      id: '20000000-0000-4000-8000-000000000001',
      empresaId: '10000000-0000-4000-8000-000000000001',
      nome: 'Administrador Alfa',
      email: 'admin.alfa@synthetic.test.local',
      senhaHash: '$2b$10$syntheticHashAlfaMockedValue12345678901234567890123456789',
      createdAt: 1790850000000,
      updatedAt: 1790850000000,
    },
    {
      id: '20000000-0000-4000-8000-000000000002',
      empresaId: '10000000-0000-4000-8000-000000000002',
      nome: 'Administrador Beta',
      email: 'admin.beta@synthetic.test.local',
      senhaHash: '$2b$10$syntheticHashBetaMockedValue12345678901234567890123456789',
      createdAt: 1790850000000,
      updatedAt: 1790850000000,
    },
  ],

  Pesquisa: [
    {
      id: '30000000-0000-4000-8000-000000000001',
      empresaId: '10000000-0000-4000-8000-000000000001',
      titulo: 'Avaliação de Atendimento Alfa',
      descricao: 'Pesquisa ativa cobrindo todos os tipos de pergunta.',
      status: 'ATIVA',
      slug: 'alfa-atendimento',
      createdAt: 1790851000000,
      updatedAt: 1790852000000,
    },
    {
      id: '30000000-0000-4000-8000-000000000002',
      empresaId: '10000000-0000-4000-8000-000000000001',
      titulo: 'Pesquisa Rascunho Alfa',
      descricao: null, // Testar valor nulo em campo opcional
      status: 'RASCUNHO',
      slug: 'alfa-rascunho',
      createdAt: 1790851000000,
      updatedAt: 1790851000000,
    },
    {
      id: '30000000-0000-4000-8000-000000000003',
      empresaId: '10000000-0000-4000-8000-000000000001',
      titulo: 'Pesquisa Encerrada Alfa',
      descricao: 'Pesquisa encerrada com histórico anterior.',
      status: 'ENCERRADA',
      slug: 'alfa-encerrada',
      createdAt: 1790700000000,
      updatedAt: 1790800000000,
    },
    {
      id: '30000000-0000-4000-8000-000000000004',
      empresaId: '10000000-0000-4000-8000-000000000002',
      titulo: 'Pesquisa Beta Isolada',
      descricao: 'Pesquisa ativa para validação de isolamento multi-tenant.',
      status: 'ATIVA',
      slug: 'beta-experiencia',
      createdAt: 1790851000000,
      updatedAt: 1790852000000,
    },
  ],

  Pergunta: [
    // Perguntas da Pesquisa Alfa ATIVA
    {
      id: '40000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      texto: 'Como você avalia o atendimento geral?',
      tipo: 'ESTRELAS',
      obrigatoria: 1,
      ordem: 0,
      createdAt: 1790851100000,
      updatedAt: 1790851100000,
    },
    {
      id: '40000000-0000-4000-8000-000000000002',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      texto: 'Como você avalia a limpeza do ambiente? (opcional)',
      tipo: 'ESTRELAS',
      obrigatoria: 0,
      ordem: 1,
      createdAt: 1790851100000,
      updatedAt: 1790851100000,
    },
    {
      id: '40000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      texto: 'Em uma escala de 0 a 10, o quanto recomendaria nossa loja?',
      tipo: 'NPS',
      obrigatoria: 1,
      ordem: 2,
      createdAt: 1790851100000,
      updatedAt: 1790851100000,
    },
    {
      id: '40000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      texto: 'Você encontrou todos os itens que procurava?',
      tipo: 'SIM_NAO',
      obrigatoria: 1,
      ordem: 3,
      createdAt: 1790851100000,
      updatedAt: 1790851100000,
    },
    {
      id: '40000000-0000-4000-8000-000000000005',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      texto: 'Deixe um comentário ou sugestão (opcional)',
      tipo: 'TEXTO',
      obrigatoria: 0,
      ordem: 4,
      createdAt: 1790851100000,
      updatedAt: 1790851100000,
    },
    {
      id: '40000000-0000-4000-8000-000000000006',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      texto: 'Qual setor você visitou hoje?',
      tipo: 'MULTIPLA_ESCOLHA',
      obrigatoria: 1,
      ordem: 5,
      createdAt: 1790851100000,
      updatedAt: 1790851100000,
    },
    // Pergunta da Pesquisa Beta ATIVA
    {
      id: '40000000-0000-4000-8000-000000000007',
      pesquisaId: '30000000-0000-4000-8000-000000000004',
      texto: 'Como avalia o serviço prestado pela Beta?',
      tipo: 'NPS',
      obrigatoria: 1,
      ordem: 0,
      createdAt: 1790851100000,
      updatedAt: 1790851100000,
    },
  ],

  OpcaoPergunta: [
    {
      id: '50000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000006',
      texto: 'Vendas e Demonstração',
      ordem: 0,
      createdAt: 1790851200000,
      updatedAt: 1790851200000,
    },
    {
      id: '50000000-0000-4000-8000-000000000002',
      perguntaId: '40000000-0000-4000-8000-000000000006',
      texto: 'Suporte Técnico e Trocas',
      ordem: 1,
      createdAt: 1790851200000,
      updatedAt: 1790851200000,
    },
    {
      id: '50000000-0000-4000-8000-000000000003',
      perguntaId: '40000000-0000-4000-8000-000000000006',
      texto: 'Retirada de Mercadorias',
      ordem: 2,
      createdAt: 1790851200000,
      updatedAt: 1790851200000,
    },
  ],

  PontoColeta: [
    {
      id: '60000000-0000-4000-8000-000000000001',
      token: '61000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      nome: 'Totem Principal - Entrada',
      ativo: 1,
      createdAt: 1790851300000,
      updatedAt: 1790851300000,
    },
    {
      id: '60000000-0000-4000-8000-000000000002',
      token: '61000000-0000-4000-8000-000000000002',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      nome: 'Balcão Secundário Desativado',
      ativo: 0, // Ponto inativo (histórico preservado)
      createdAt: 1790851300000,
      updatedAt: 1790851300000,
    },
    {
      id: '60000000-0000-4000-8000-000000000003',
      token: '61000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000004',
      nome: 'Recepção Beta',
      ativo: 1,
      createdAt: 1790851300000,
      updatedAt: 1790851300000,
    },
  ],

  Resposta: [
    // R1: Alfa, Ponto Ativo, COM Idempotência, Dia 1 (2026-10-01)
    {
      id: '70000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      pontoColetaId: '60000000-0000-4000-8000-000000000001',
      idempotencyKey: '80000000-0000-4000-8000-000000000001',
      submissionHash: '9000000000000000000000000000000000000000000000000000000000000001',
      createdAt: 1790856000000, // 2026-10-01T12:00:00.000Z
      updatedAt: 1790856000000,
    },
    // R2: Alfa, Ponto Ativo, SEM Idempotência (null), Dia 1 (2026-10-01)
    {
      id: '70000000-0000-4000-8000-000000000002',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      pontoColetaId: '60000000-0000-4000-8000-000000000001',
      idempotencyKey: null,
      submissionHash: null,
      createdAt: 1790863200000, // 2026-10-01T14:00:00.000Z
      updatedAt: 1790863200000,
    },
    // R3: Alfa, SEM Ponto (null), COM Idempotência, Dia 2 (2026-10-02)
    {
      id: '70000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      pontoColetaId: null,
      idempotencyKey: '80000000-0000-4000-8000-000000000002',
      submissionHash: '9000000000000000000000000000000000000000000000000000000000000002',
      createdAt: 1790942400000, // 2026-10-02T12:00:00.000Z
      updatedAt: 1790942400000,
    },
    // R4: Alfa, SEM Ponto (null), SEM Idempotência (null - 2º null), Dia 2 (2026-10-02)
    {
      id: '70000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      pontoColetaId: null,
      idempotencyKey: null,
      submissionHash: null,
      createdAt: 1790949600000, // 2026-10-02T14:00:00.000Z
      updatedAt: 1790949600000,
    },
    // R5: Alfa, Ponto Inativo (histórico), COM Idempotência, Dia 3 (2026-10-03)
    {
      id: '70000000-0000-4000-8000-000000000005',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      pontoColetaId: '60000000-0000-4000-8000-000000000002',
      idempotencyKey: '80000000-0000-4000-8000-000000000003',
      submissionHash: '9000000000000000000000000000000000000000000000000000000000000003',
      createdAt: 1791028800000, // 2026-10-03T12:00:00.000Z
      updatedAt: 1791028800000,
    },
    // R6: Beta, Ponto Ativo Beta, COM Idempotência, Dia 2 (2026-10-02)
    {
      id: '70000000-0000-4000-8000-000000000006',
      pesquisaId: '30000000-0000-4000-8000-000000000004',
      pontoColetaId: '60000000-0000-4000-8000-000000000003',
      idempotencyKey: '80000000-0000-4000-8000-000000000004',
      submissionHash: '9000000000000000000000000000000000000000000000000000000000000004',
      createdAt: 1790946000000, // 2026-10-02T13:00:00.000Z
      updatedAt: 1790946000000,
    },
  ],

  RespostaPergunta: [
    // --- Respostas de R1 (todas as 6 perguntas respondidas) ---
    {
      id: '90000000-0000-4000-8000-000000000001',
      respostaId: '70000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000001', // ESTRELAS
      tipo: 'ESTRELAS',
      valorEstrelas: 5,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790856000000,
      updatedAt: 1790856000000,
    },
    {
      id: '90000000-0000-4000-8000-000000000002',
      respostaId: '70000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000002', // ESTRELAS opcional
      tipo: 'ESTRELAS',
      valorEstrelas: 4,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790856000000,
      updatedAt: 1790856000000,
    },
    {
      id: '90000000-0000-4000-8000-000000000003',
      respostaId: '70000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000003', // NPS (promotor)
      tipo: 'NPS',
      valorEstrelas: null,
      valorNps: 10,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790856000000,
      updatedAt: 1790856000000,
    },
    {
      id: '90000000-0000-4000-8000-000000000004',
      respostaId: '70000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000004', // SIM_NAO (true)
      tipo: 'SIM_NAO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: 1,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790856000000,
      updatedAt: 1790856000000,
    },
    {
      id: '90000000-0000-4000-8000-000000000005',
      respostaId: '70000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000005', // TEXTO com acentos
      tipo: 'TEXTO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: 'Atendimento impecável e cortês! Café quentinho.',
      opcaoPerguntaId: null,
      createdAt: 1790856000000,
      updatedAt: 1790856000000,
    },
    {
      id: '90000000-0000-4000-8000-000000000006',
      respostaId: '70000000-0000-4000-8000-000000000001',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000006', // MULTIPLA_ESCOLHA
      tipo: 'MULTIPLA_ESCOLHA',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: '50000000-0000-4000-8000-000000000001', // Vendas
      createdAt: 1790856000000,
      updatedAt: 1790856000000,
    },

    // --- Respostas de R2 (pulou opcionais P2 e P5) ---
    {
      id: '90000000-0000-4000-8000-000000000007',
      respostaId: '70000000-0000-4000-8000-000000000002',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000001', // ESTRELAS nota mínima
      tipo: 'ESTRELAS',
      valorEstrelas: 1,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790863200000,
      updatedAt: 1790863200000,
    },
    {
      id: '90000000-0000-4000-8000-000000000008',
      respostaId: '70000000-0000-4000-8000-000000000002',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000003', // NPS nota 0 (detrator extremo)
      tipo: 'NPS',
      valorEstrelas: null,
      valorNps: 0,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790863200000,
      updatedAt: 1790863200000,
    },
    {
      id: '90000000-0000-4000-8000-000000000009',
      respostaId: '70000000-0000-4000-8000-000000000002',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000004', // SIM_NAO (false)
      tipo: 'SIM_NAO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: 0,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790863200000,
      updatedAt: 1790863200000,
    },
    {
      id: '90000000-0000-4000-8000-000000000010',
      respostaId: '70000000-0000-4000-8000-000000000002',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000006', // MULTIPLA_ESCOLHA
      tipo: 'MULTIPLA_ESCOLHA',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: '50000000-0000-4000-8000-000000000002', // Suporte e Pós-Venda
      createdAt: 1790863200000,
      updatedAt: 1790863200000,
    },

    // --- Respostas de R3 (fórmula de escape e texto especial) ---
    {
      id: '90000000-0000-4000-8000-000000000011',
      respostaId: '70000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000001',
      tipo: 'ESTRELAS',
      valorEstrelas: 3,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790942400000,
      updatedAt: 1790942400000,
    },
    {
      id: '90000000-0000-4000-8000-000000000012',
      respostaId: '70000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000002',
      tipo: 'ESTRELAS',
      valorEstrelas: 2,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790942400000,
      updatedAt: 1790942400000,
    },
    {
      id: '90000000-0000-4000-8000-000000000013',
      respostaId: '70000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000003',
      tipo: 'NPS',
      valorEstrelas: null,
      valorNps: 7, // Neutro
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790942400000,
      updatedAt: 1790942400000,
    },
    {
      id: '90000000-0000-4000-8000-000000000014',
      respostaId: '70000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000004',
      tipo: 'SIM_NAO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: 1,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790942400000,
      updatedAt: 1790942400000,
    },
    {
      id: '90000000-0000-4000-8000-000000000015',
      respostaId: '70000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000005',
      tipo: 'TEXTO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: '=HYPERLINK("http://phishing.example.com"); Teste de escape e acentuação: Atenção & Coração.',
      opcaoPerguntaId: null,
      createdAt: 1790942400000,
      updatedAt: 1790942400000,
    },
    {
      id: '90000000-0000-4000-8000-000000000016',
      respostaId: '70000000-0000-4000-8000-000000000003',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000006',
      tipo: 'MULTIPLA_ESCOLHA',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: '50000000-0000-4000-8000-000000000003', // Retirada de Mercadorias
      createdAt: 1790942400000,
      updatedAt: 1790942400000,
    },

    // --- Respostas de R4 ---
    {
      id: '90000000-0000-4000-8000-000000000017',
      respostaId: '70000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000001',
      tipo: 'ESTRELAS',
      valorEstrelas: 4,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790949600000,
      updatedAt: 1790949600000,
    },
    {
      id: '90000000-0000-4000-8000-000000000018',
      respostaId: '70000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000002',
      tipo: 'ESTRELAS',
      valorEstrelas: 3,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790949600000,
      updatedAt: 1790949600000,
    },
    {
      id: '90000000-0000-4000-8000-000000000019',
      respostaId: '70000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000003',
      tipo: 'NPS',
      valorEstrelas: null,
      valorNps: 8, // Neutro
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790949600000,
      updatedAt: 1790949600000,
    },
    {
      id: '90000000-0000-4000-8000-000000000020',
      respostaId: '70000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000004',
      tipo: 'SIM_NAO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: 1,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790949600000,
      updatedAt: 1790949600000,
    },
    {
      id: '90000000-0000-4000-8000-000000000021',
      respostaId: '70000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000005',
      tipo: 'TEXTO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: 'Tudo dentro do esperado.',
      opcaoPerguntaId: null,
      createdAt: 1790949600000,
      updatedAt: 1790949600000,
    },
    {
      id: '90000000-0000-4000-8000-000000000022',
      respostaId: '70000000-0000-4000-8000-000000000004',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000006',
      tipo: 'MULTIPLA_ESCOLHA',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: '50000000-0000-4000-8000-000000000001', // Vendas
      createdAt: 1790949600000,
      updatedAt: 1790949600000,
    },

    // --- Respostas de R5 (Ponto Inativo histórico) ---
    {
      id: '90000000-0000-4000-8000-000000000023',
      respostaId: '70000000-0000-4000-8000-000000000005',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000001',
      tipo: 'ESTRELAS',
      valorEstrelas: 2,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1791028800000,
      updatedAt: 1791028800000,
    },
    {
      id: '90000000-0000-4000-8000-000000000024',
      respostaId: '70000000-0000-4000-8000-000000000005',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000003',
      tipo: 'NPS',
      valorEstrelas: null,
      valorNps: 4, // Detrator
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1791028800000,
      updatedAt: 1791028800000,
    },
    {
      id: '90000000-0000-4000-8000-000000000025',
      respostaId: '70000000-0000-4000-8000-000000000005',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000004',
      tipo: 'SIM_NAO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: 0,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1791028800000,
      updatedAt: 1791028800000,
    },
    {
      id: '90000000-0000-4000-8000-000000000026',
      respostaId: '70000000-0000-4000-8000-000000000005',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000005',
      tipo: 'TEXTO',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: 'Demora excessiva no atendimento do balcão.',
      opcaoPerguntaId: null,
      createdAt: 1791028800000,
      updatedAt: 1791028800000,
    },
    {
      id: '90000000-0000-4000-8000-000000000027',
      respostaId: '70000000-0000-4000-8000-000000000005',
      pesquisaId: '30000000-0000-4000-8000-000000000001',
      perguntaId: '40000000-0000-4000-8000-000000000006',
      tipo: 'MULTIPLA_ESCOLHA',
      valorEstrelas: null,
      valorNps: null,
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: '50000000-0000-4000-8000-000000000002', // Suporte
      createdAt: 1791028800000,
      updatedAt: 1791028800000,
    },

    // --- Resposta de R6 (Beta) ---
    {
      id: '90000000-0000-4000-8000-000000000028',
      respostaId: '70000000-0000-4000-8000-000000000006',
      pesquisaId: '30000000-0000-4000-8000-000000000004',
      perguntaId: '40000000-0000-4000-8000-000000000007',
      tipo: 'NPS',
      valorEstrelas: null,
      valorNps: 9, // Promotor Beta
      valorSimNao: null,
      valorTexto: null,
      opcaoPerguntaId: null,
      createdAt: 1790946000000,
      updatedAt: 1790946000000,
    },
  ],
};

/**
 * Insere a baseline sintética em uma instância descartável do SQLite.
 * Ordem estrita respeita constraints de FK e CHECK.
 */
export function populateSyntheticBaseline(db) {
  db.exec('PRAGMA foreign_keys = ON;');

  // Inserção ordenada por dependências
  const insertOrder = [
    'Empresa',
    'Usuario',
    'Pesquisa',
    'Pergunta',
    'OpcaoPergunta',
    'PontoColeta',
    'Resposta',
    'RespostaPergunta',
  ];

  for (const table of insertOrder) {
    const rows = SYNTHETIC_BASELINE_DATA[table];
    if (!rows || rows.length === 0) continue;

    for (const row of rows) {
      const keys = Object.keys(row);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map(() => '?').join(', ');
      const values = keys.map(k => row[k]);

      const stmt = db.prepare(`INSERT INTO "${table}" (${cols}) VALUES (${placeholders})`);
      stmt.run(...values);
    }
  }
}

/**
 * Retorna contagens esperadas da baseline sintética.
 */
export function getSyntheticCounts() {
  const counts = {};
  for (const [table, rows] of Object.entries(SYNTHETIC_BASELINE_DATA)) {
    counts[table] = rows.length;
  }
  return counts;
}
