import { env } from './env.js';
import { PrismaClient, Prisma } from '../generated/mongo-client/index.js';

let prismaInstance = null;

// Query logs can contain feedback, emails and credentials. Keep production silent.
const logs = () => process.env.NODE_ENV === 'production' ? [] :
  (process.env.PRISMA_LOG ? ['query', 'info', 'warn', 'error'] : []);

function applyDefaultTimeouts(urlString) {
  try {
    const url = new URL(urlString);
    if (['mongodb:', 'mongodb+srv:'].includes(url.protocol)) {
      if (!url.searchParams.has('serverSelectionTimeoutMS')) url.searchParams.set('serverSelectionTimeoutMS', '5000');
      if (!url.searchParams.has('connectTimeoutMS')) url.searchParams.set('connectTimeoutMS', '5000');
      return url.toString();
    }
  } catch { /* if invalid URL, let Prisma handle it */ }
  return urlString;
}

export function getPrismaClient(options = {}) {
  if (options.datasourceUrl || options.forceNew) {
    const rawUrl = options.datasourceUrl || env.databaseUrl;
    const datasourceUrl = process.env.NODE_ENV === 'production' ? applyDefaultTimeouts(rawUrl) : rawUrl;
    const client = new PrismaClient({
      datasourceUrl,
      log: logs(),
    });
    return client;
  }
  if (!prismaInstance) {
    if (process.env.NODE_ENV === 'test' && (!process.env.TEST_DATABASE_URL || process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL)) {
      throw new Error('Testes exigem DATABASE_URL igual ao banco temporario TEST_DATABASE_URL.');
    }
    const datasourceUrl = process.env.NODE_ENV === 'production' ? applyDefaultTimeouts(env.databaseUrl) : env.databaseUrl;
    prismaInstance = new PrismaClient({
      datasourceUrl,
      log: logs(),
    });
  }
  return prismaInstance;
}

export async function checkDatabaseReadiness(client = getPrismaClient(), timeoutMs = 3000) {
  let timer;
  try {
    const pingPromise = client.$runCommandRaw({ ping: 1 });
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Readiness ping timeout')), timeoutMs);
    });
    await Promise.race([pingPromise, timeoutPromise]);
    return { ready: true };
  } catch {
    return { ready: false };
  } finally {
    clearTimeout(timer);
  }
}

export async function disconnectPrisma() {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

const prisma = getPrismaClient();

export { Prisma, PrismaClient };
export default prisma;
