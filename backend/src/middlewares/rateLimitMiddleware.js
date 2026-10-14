import { rateLimit } from 'express-rate-limit';

const options = { windowMs: 15 * 60 * 1000, standardHeaders: 'draft-8', legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { erro: 'Limite de requisicoes excedido. Tente novamente mais tarde.' } };

export const publicReadLimiter = rateLimit({ ...options, limit: 120 });
export const responseLimiter = rateLimit({ ...options, limit: 30 });
export const authLimiter = rateLimit({ ...options, limit: 10 });
export const adminLimiter = rateLimit({ ...options, limit: process.env.NODE_ENV === 'test' ? 5000 : 300 });
export const exportLimiter = rateLimit({ ...options, limit: 5, keyGenerator: req => req.auth.id });
