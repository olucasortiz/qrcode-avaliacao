/**
 * Manifest versionado de coleções, índices e validators do MongoDB para o FeedQR.
 * 
 * Versão do Schema: 1.0.0 (TASK 07.3)
 * Compatível com: Prisma 6.19.3, MongoDB 7.x / 8.x
 */

export const SCHEMA_VERSION = '1.0.0';

export const MONGO_MANIFEST = {
  version: SCHEMA_VERSION,
  collections: {
    Empresa: {
      indexes: [
        {
          name: 'Empresa_email_key',
          key: { email: 1 },
          unique: true,
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'nome', 'email', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            nome: { bsonType: 'string', minLength: 1 },
            email: { bsonType: 'string', pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
        },
      },
    },

    Usuario: {
      indexes: [
        {
          name: 'Usuario_email_key',
          key: { email: 1 },
          unique: true,
        },
        {
          name: 'Usuario_empresaId_idx',
          key: { empresaId: 1 },
          unique: false,
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'empresaId', 'nome', 'email', 'senhaHash', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            empresaId: { bsonType: 'string' },
            nome: { bsonType: 'string', minLength: 1 },
            email: { bsonType: 'string', pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' },
            senhaHash: { bsonType: 'string', minLength: 1 },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
        },
      },
    },

    Pesquisa: {
      indexes: [
        {
          name: 'Pesquisa_slug_key',
          key: { slug: 1 },
          unique: true,
        },
        {
          name: 'Pesquisa_empresaId_status_idx',
          key: { empresaId: 1, status: 1 },
          unique: false,
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'empresaId', 'titulo', 'status', 'slug', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            empresaId: { bsonType: 'string' },
            titulo: { bsonType: 'string', minLength: 1 },
            descricao: { bsonType: ['string', 'null'] },
            status: { enum: ['RASCUNHO', 'ATIVA', 'ENCERRADA'] },
            slug: { bsonType: 'string', minLength: 1 },
            writeVersion: { bsonType: ['int', 'long', 'double'], minimum: 1 },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
        },
      },
    },

    Pergunta: {
      indexes: [
        {
          name: 'Pergunta_pesquisaId_ordem_key',
          key: { pesquisaId: 1, ordem: 1 },
          unique: true,
        },
        {
          name: 'Pergunta__id_pesquisaId_tipo_key',
          key: { _id: 1, pesquisaId: 1, tipo: 1 },
          unique: true,
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'pesquisaId', 'texto', 'tipo', 'obrigatoria', 'ordem', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            pesquisaId: { bsonType: 'string' },
            texto: { bsonType: 'string', minLength: 1 },
            tipo: { enum: ['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'] },
            obrigatoria: { bsonType: 'bool' },
            ordem: { bsonType: ['int', 'long', 'double'], minimum: 0 },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
        },
      },
    },

    OpcaoPergunta: {
      indexes: [
        {
          name: 'OpcaoPergunta_perguntaId_ordem_key',
          key: { perguntaId: 1, ordem: 1 },
          unique: true,
        },
        {
          name: 'OpcaoPergunta__id_perguntaId_key',
          key: { _id: 1, perguntaId: 1 },
          unique: true,
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'perguntaId', 'texto', 'ordem', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            perguntaId: { bsonType: 'string' },
            texto: { bsonType: 'string', minLength: 1 },
            ordem: { bsonType: ['int', 'long', 'double'], minimum: 0 },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
        },
      },
    },

    PontoColeta: {
      indexes: [
        {
          name: 'PontoColeta_token_key',
          key: { token: 1 },
          unique: true,
        },
        {
          name: 'PontoColeta__id_pesquisaId_key',
          key: { _id: 1, pesquisaId: 1 },
          unique: true,
        },
        {
          name: 'PontoColeta_pesquisaId_ativo_idx',
          key: { pesquisaId: 1, ativo: 1 },
          unique: false,
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'token', 'pesquisaId', 'nome', 'ativo', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            token: { bsonType: 'string' },
            pesquisaId: { bsonType: 'string' },
            nome: { bsonType: 'string', minLength: 1 },
            ativo: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
        },
      },
    },

    Resposta: {
      indexes: [
        {
          name: 'Resposta__id_pesquisaId_key',
          key: { _id: 1, pesquisaId: 1 },
          unique: true,
        },
        {
          name: 'Resposta_pesquisaId_createdAt_idx',
          key: { pesquisaId: 1, createdAt: 1 },
          unique: false,
        },
        {
          name: 'Resposta_pontoColetaId_pesquisaId_idx',
          key: { pontoColetaId: 1, pesquisaId: 1 },
          unique: false,
        },
        {
          name: 'Resposta_idempotencyKey_partial_key',
          key: { idempotencyKey: 1 },
          unique: true,
          partialFilterExpression: { idempotencyKey: { $type: 'string' } },
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'pesquisaId', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            pesquisaId: { bsonType: 'string' },
            pontoColetaId: { bsonType: ['string', 'null'] },
            idempotencyKey: { bsonType: ['string', 'null'] },
            submissionHash: { bsonType: ['string', 'null'] },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
        },
      },
    },

    RespostaPergunta: {
      indexes: [
        {
          name: 'RespostaPergunta_respostaId_perguntaId_key',
          key: { respostaId: 1, perguntaId: 1 },
          unique: true,
        },
        {
          name: 'RespostaPergunta_respostaId_pesquisaId_idx',
          key: { respostaId: 1, pesquisaId: 1 },
          unique: false,
        },
        {
          name: 'RespostaPergunta_perguntaId_pesquisaId_tipo_idx',
          key: { perguntaId: 1, pesquisaId: 1, tipo: 1 },
          unique: false,
        },
        {
          name: 'RespostaPergunta_opcaoPerguntaId_perguntaId_idx',
          key: { opcaoPerguntaId: 1, perguntaId: 1 },
          unique: false,
        },
      ],
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['_id', 'respostaId', 'pesquisaId', 'perguntaId', 'tipo', 'createdAt', 'updatedAt'],
          properties: {
            _id: { bsonType: 'string' },
            respostaId: { bsonType: 'string' },
            pesquisaId: { bsonType: 'string' },
            perguntaId: { bsonType: 'string' },
            tipo: { enum: ['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'] },
            valorEstrelas: { bsonType: ['int', 'long', 'double', 'null'] },
            valorNps: { bsonType: ['int', 'long', 'double', 'null'] },
            valorSimNao: { bsonType: ['bool', 'null'] },
            valorTexto: { bsonType: ['string', 'null'] },
            opcaoPerguntaId: { bsonType: ['string', 'null'] },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
          additionalProperties: true,
          oneOf: [
            {
              properties: {
                tipo: { enum: ['ESTRELAS'] },
                valorEstrelas: { bsonType: ['int', 'long', 'double'], minimum: 1, maximum: 5 },
                valorNps: { bsonType: 'null' },
                valorSimNao: { bsonType: 'null' },
                valorTexto: { bsonType: 'null' },
                opcaoPerguntaId: { bsonType: 'null' },
              },
              required: ['valorEstrelas'],
            },
            {
              properties: {
                tipo: { enum: ['NPS'] },
                valorNps: { bsonType: ['int', 'long', 'double'], minimum: 0, maximum: 10 },
                valorEstrelas: { bsonType: 'null' },
                valorSimNao: { bsonType: 'null' },
                valorTexto: { bsonType: 'null' },
                opcaoPerguntaId: { bsonType: 'null' },
              },
              required: ['valorNps'],
            },
            {
              properties: {
                tipo: { enum: ['SIM_NAO'] },
                valorSimNao: { bsonType: 'bool' },
                valorEstrelas: { bsonType: 'null' },
                valorNps: { bsonType: 'null' },
                valorTexto: { bsonType: 'null' },
                opcaoPerguntaId: { bsonType: 'null' },
              },
              required: ['valorSimNao'],
            },
            {
              properties: {
                tipo: { enum: ['TEXTO'] },
                valorTexto: { bsonType: 'string' },
                valorEstrelas: { bsonType: 'null' },
                valorNps: { bsonType: 'null' },
                valorSimNao: { bsonType: 'null' },
                opcaoPerguntaId: { bsonType: 'null' },
              },
              required: ['valorTexto'],
            },
            {
              properties: {
                tipo: { enum: ['MULTIPLA_ESCOLHA'] },
                opcaoPerguntaId: { bsonType: 'string' },
                valorEstrelas: { bsonType: 'null' },
                valorNps: { bsonType: 'null' },
                valorSimNao: { bsonType: 'null' },
                valorTexto: { bsonType: 'null' },
              },
              required: ['opcaoPerguntaId'],
            },
          ],
        },
      },
    },
  },
};
