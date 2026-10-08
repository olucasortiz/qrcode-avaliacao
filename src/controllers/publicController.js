import { activePesquisa } from '../services/pesquisaService.js';
import { enviarResposta } from '../services/respostaService.js';
import { pesquisaDto } from '../utils/pesquisaDto.js';
import { envioSchema, publicQuerySchema, slugSchema } from '../utils/schemas.js';
import { AppError } from '../utils/AppError.js';

export async function obterPesquisa(req, res) {
  const { origem } = publicQuerySchema.parse(req.query);
  const { pesquisa } = await activePesquisa(slugSchema.parse(req.params.slug), origem);
  res.set('Cache-Control', 'no-store').json(pesquisaDto(pesquisa));
}

export async function responder(req, res) {
  const data = envioSchema.parse(req.body);
  const query = publicQuerySchema.parse(req.query);
  if (data.origem && query.origem && data.origem !== query.origem) throw new AppError(400, 'Origens conflitantes.');
  data.origem = data.origem || query.origem;
  res.status(201).json(await enviarResposta(slugSchema.parse(req.params.slug), data));
}
