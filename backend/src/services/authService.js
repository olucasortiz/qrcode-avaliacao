import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const dummyHash = bcrypt.hash('feedqr-invalid-user-password', 12);
const usuarioSelect = { id: true, nome: true, email: true, empresaId: true };

function session(usuario) {
  return { token: jwt.sign({}, env.jwtSecret, { algorithm: 'HS256', subject: usuario.id, expiresIn: '1h' }), usuario };
}

export async function cadastrar(data) {
  const senhaHash = await bcrypt.hash(data.senha, 12);
  const usuario = await prisma.$transaction(async tx => {
    const empresa = await tx.empresa.create({ data: data.empresa });
    return tx.usuario.create({ data: { empresaId: empresa.id, nome: data.nome, email: data.email, senhaHash }, select: usuarioSelect });
  });
  return session(usuario);
}

export async function login(data) {
  const usuario = await prisma.usuario.findUnique({ where: { email: data.email }, select: { ...usuarioSelect, senhaHash: true } });
  const hashValido = usuario && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(usuario.senhaHash);
  const valid = await bcrypt.compare(data.senha, hashValido ? usuario.senhaHash : await dummyHash);
  if (!hashValido || !valid) throw new AppError(401, 'Email ou senha invalidos.');
  const { senhaHash, ...publicUsuario } = usuario;
  return session(publicUsuario);
}
