import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export function notFound(req, res, next) {
  next(new AppError(404, 'Rota nao encontrada.'));
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof ZodError) {
    return res.status(400).json({ erro: 'Dados invalidos.', detalhes: error.issues.map(issue => ({
      campo: issue.path.join('.'), mensagem: issue.message,
    })) });
  }
  if (error instanceof AppError) return res.status(error.status).json({ erro: error.message });
  if (error.type === 'entity.too.large') return res.status(413).json({ erro: 'Payload excede o limite de 64 KB.' });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON invalido.' });
  if (['charset.unsupported', 'encoding.unsupported'].includes(error.type)) {
    return res.status(415).json({ erro: 'Codificacao de payload nao suportada.' });
  }
  if (['P2002', 'P2003', 'P2014', 'P2034'].includes(error.code) || error.code === 11000) {
    return res.status(409).json({ erro: 'Operacao conflita com registros existentes.' });
  }
  if (error.code === 121) {
    return res.status(400).json({ erro: 'Documento falhou na validacao de schema do banco de dados.' });
  }
  if (error.code === 'P2025') return res.status(404).json({ erro: 'Registro nao encontrado.' });
  console.error(error);
  return res.status(500).json({ erro: 'Erro interno.' });
}
