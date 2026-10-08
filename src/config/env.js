import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const config = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().startsWith('file:').min(6),
  CORS_ORIGINS: z.string().transform(value => value.split(',').map(origin => origin.trim()))
    .pipe(z.array(z.url().refine(value => {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) && url.origin === value;
    })).min(1)),
  FRONTEND_PUBLIC_URL: z.url().refine(value => {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.search && !url.hash && !url.username && !url.password;
  }),
  JWT_SECRET: z.string().min(32).refine(value => !value.startsWith('substitua-'), 'Gere um segredo aleatorio.'),
}).parse(process.env);

export const env = {
  port: config.PORT,
  frontendPublicUrl: config.FRONTEND_PUBLIC_URL,
  jwtSecret: config.JWT_SECRET,
  corsOrigins: config.CORS_ORIGINS,
};
