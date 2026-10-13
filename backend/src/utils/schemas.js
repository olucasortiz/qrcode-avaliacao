import { z } from 'zod';

export const idSchema = z.uuid();
export const slugSchema = z.string().min(1).max(200);
export const origemSchema = z.string().min(16).max(128).regex(/^[a-zA-Z0-9-]+$/);
export const publicQuerySchema = z.strictObject({ origem: origemSchema.optional() });
export const pontoCreateSchema = z.strictObject({ nome: z.string().trim().min(1).max(120) });
export const pontoUpdateSchema = z.strictObject({
  nome: z.string().trim().min(1).max(120).optional(),
  ativo: z.boolean().optional(),
}).refine(value => Object.keys(value).length > 0, 'Informe nome ou ativo.');

export const envioSchema = z.strictObject({
  origem: origemSchema.optional(),
  respostas: z.array(z.strictObject({
    perguntaId: idSchema,
    valor: z.union([z.number(), z.boolean(), z.string().max(2000)]),
  })),
});

export const valorSchemas = {
  ESTRELAS: z.number().int().min(1).max(5),
  NPS: z.number().int().min(0).max(10),
  SIM_NAO: z.boolean(),
  TEXTO: z.string().trim().min(1).max(2000),
  MULTIPLA_ESCOLHA: idSchema,
};

const periodoFields = {
  inicio: z.iso.date().optional(),
  fim: z.iso.date().optional(),
};
const periodoValido = value => !value.inicio || !value.fim || value.inicio <= value.fim;

export const filtroSchema = z.strictObject({
  ...periodoFields,
  pesquisaId: idSchema.optional(),
  pontoColetaId: idSchema.optional(),
}).refine(periodoValido, 'Periodo invalido.');

const paginationFields = {
  pagina: z.coerce.number().int().min(1).max(100000).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(20),
};
const feedbackFields = {
  ...periodoFields,
  pontoColetaId: idSchema.optional(),
  perguntaId: idSchema.optional(),
  nota: z.coerce.number().int().min(0).max(10).optional(),
};
const notaComPergunta = value => value.nota === undefined || value.perguntaId !== undefined;
export const feedbackSchema = z.strictObject({ ...feedbackFields, ...paginationFields })
  .refine(periodoValido, 'Periodo invalido.').refine(notaComPergunta, 'Informe perguntaId ao filtrar por nota.');
export const exportSchema = z.strictObject(feedbackFields)
  .refine(periodoValido, 'Periodo invalido.').refine(notaComPergunta, 'Informe perguntaId ao filtrar por nota.');

const emailSchema = z.email().max(254).transform(value => value.toLowerCase());
const senhaSchema = z.string().min(8).max(72)
  .refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'Senha deve ter no maximo 72 bytes.');
export const cadastroSchema = z.strictObject({
  empresa: z.strictObject({ nome: z.string().trim().min(1).max(120), email: emailSchema }),
  nome: z.string().trim().min(1).max(120), email: emailSchema, senha: senhaSchema,
});
export const loginSchema = z.strictObject({ email: emailSchema, senha: senhaSchema });

const pesquisaFields = {
  titulo: z.string().trim().min(1).max(200),
  descricao: z.string().trim().max(2000).nullable().optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
};
export const pesquisaCreateSchema = z.strictObject(pesquisaFields);
export const pesquisaUpdateSchema = z.strictObject({
  ...Object.fromEntries(Object.entries(pesquisaFields).map(([key, schema]) => [key, schema.optional()])),
  status: z.literal('ENCERRADA').optional(),
}).refine(value => Object.keys(value).length > 0, 'Informe ao menos um campo.');
export const pesquisaListSchema = z.strictObject({ ...paginationFields, status: z.enum(['RASCUNHO', 'ATIVA', 'ENCERRADA']).optional() });

const perguntaFields = {
  texto: z.string().trim().min(1).max(2000),
  tipo: z.enum(['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA']),
  obrigatoria: z.boolean(),
  ordem: z.number().int().min(0).max(10000),
  opcoes: z.array(z.strictObject({ texto: z.string().trim().min(1).max(500), ordem: z.number().int().min(0).max(10000) })).max(100),
};
export const perguntaCreateSchema = z.strictObject({ ...perguntaFields,
  obrigatoria: perguntaFields.obrigatoria.default(true), opcoes: perguntaFields.opcoes.default([]),
}).refine(value =>
  value.tipo === 'MULTIPLA_ESCOLHA' ? value.opcoes.length >= 2 : value.opcoes.length === 0,
  'Somente MULTIPLA_ESCOLHA aceita opcoes e exige pelo menos duas.')
  .refine(value => new Set(value.opcoes.map(opcao => opcao.ordem)).size === value.opcoes.length, 'Ordens das opcoes devem ser unicas.');
export const perguntaUpdateSchema = z.strictObject(
  Object.fromEntries(Object.entries(perguntaFields).map(([key, schema]) => [key, schema.optional()])),
).refine(value => Object.keys(value).length > 0, 'Informe ao menos um campo.');
