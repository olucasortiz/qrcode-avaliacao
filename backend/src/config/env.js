import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

function isHttpOrigin(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && url.origin === value;
  } catch { return false; }
}

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().refine(
    value => {
      try {
        const url = new URL(value);
        return ['mongodb:', 'mongodb+srv:'].includes(url.protocol) && /^\/[^/]+$/.test(url.pathname) &&
          !['admin', 'local', 'config'].includes(url.pathname.slice(1).toLowerCase());
      } catch { return false; }
    },
    'DATABASE_URL deve ser uma connection string MongoDB (mongodb:// ou mongodb+srv://).'
  ),
  TRUST_PROXY: z.enum(['false', 'true', '0', '1']).default('false').transform(value => ['true', '1'].includes(value)),
  CORS_ORIGINS: z.string().transform(value => value.split(',').map(origin => origin.trim()))
    .pipe(z.array(z.url().refine(isHttpOrigin)).min(1)),
  FRONTEND_PUBLIC_URL: z.url().refine(isHttpOrigin),
  JWT_SECRET: z.string().min(32).refine(value => !/^(substitua-|gere_|insira_|change.?me)/i.test(value), 'Gere um segredo aleatorio.'),
}).superRefine((config, ctx) => {
  if (config.NODE_ENV !== 'production') return;
  const issue = (field, message) => ctx.addIssue({ code: 'custom', path: [field], message });
  if (!/^[a-f0-9]{64}$/i.test(config.JWT_SECRET) || new Set(config.JWT_SECRET).size < 8) {
    issue('JWT_SECRET', 'Gere 32 bytes aleatorios em hexadecimal.');
  }
  if ([...config.CORS_ORIGINS, config.FRONTEND_PUBLIC_URL].some(value => {
    if (!isHttpOrigin(value)) return true;
    const url = new URL(value);
    return url.protocol !== 'https:' || /^(localhost|127\.|\[::1\])/.test(url.hostname);
  })) issue('CORS_ORIGINS', 'Producao exige URLs publicas HTTPS.');
  if (!config.CORS_ORIGINS.includes(config.FRONTEND_PUBLIC_URL)) issue('CORS_ORIGINS', 'Inclua FRONTEND_PUBLIC_URL.');
  let url;
  try { url = new URL(config.DATABASE_URL); } catch { issue('DATABASE_URL', 'URI invalida.'); return; }
  const unsafeTls = [...url.searchParams].some(([key, value]) => {
    const name = key.toLowerCase();
    return (['tls', 'ssl'].includes(name) && value.toLowerCase() !== 'true') ||
      (['tlsallowinvalidcertificates', 'tlsallowinvalidhostnames', 'tlsinsecure'].includes(name) && value.toLowerCase() !== 'false');
  });
  if (url.protocol !== 'mongodb+srv:' || !url.username || !url.password || unsafeTls) {
    issue('DATABASE_URL', 'Producao exige MongoDB SRV autenticado com TLS verificado.');
  }
});

export function parseEnvironment(source) {
  const result = configSchema.safeParse(source);
  // Never echo input values, URIs or secrets in startup errors.
  if (!result.success) throw new Error(`Configuracao invalida: ${[...new Set(result.error.issues.map(issue => issue.path[0] || 'ambiente'))].join(', ')}.`);
  const config = result.data;
  return {
    nodeEnv: config.NODE_ENV,
    port: config.PORT,
    databaseUrl: config.DATABASE_URL,
    trustProxy: config.TRUST_PROXY,
    frontendPublicUrl: config.FRONTEND_PUBLIC_URL,
    jwtSecret: config.JWT_SECRET,
    corsOrigins: config.CORS_ORIGINS,
  };
}

export const env = parseEnvironment(process.env);
