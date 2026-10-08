import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { idSchema } from '../utils/schemas.js';

export async function authenticate(req, res, next) {
  const match = /^Bearer ([^\s]+)$/i.exec(req.get('authorization') || '');
  if (!match) throw new AppError(401, 'Autenticacao necessaria.');
  let payload;
  try {
    payload = jwt.verify(match[1], env.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new AppError(401, 'Token invalido ou expirado.');
  }
  if (!payload || typeof payload !== 'object' || !idSchema.safeParse(payload.sub).success || !Number.isInteger(payload.exp)) {
    throw new AppError(401, 'Token invalido.');
  }
  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.sub }, select: { id: true, empresaId: true },
  });
  if (!usuario) throw new AppError(401, 'Token invalido.');
  req.auth = usuario;
  res.set('Cache-Control', 'no-store');
  next();
}
