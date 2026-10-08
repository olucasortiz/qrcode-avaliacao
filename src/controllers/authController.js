import * as service from '../services/authService.js';
import { cadastroSchema, loginSchema } from '../utils/schemas.js';

export async function cadastrar(req, res) {
  res.set('Cache-Control', 'no-store').status(201).json(await service.cadastrar(cadastroSchema.parse(req.body)));
}

export async function login(req, res) {
  res.set('Cache-Control', 'no-store').json(await service.login(loginSchema.parse(req.body)));
}
