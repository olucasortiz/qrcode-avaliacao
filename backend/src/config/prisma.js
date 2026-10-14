import { env } from './env.js';
import { PrismaClient, Prisma } from '../generated/mongo-client/index.js';

let prismaInstance = null;

// Query logs can contain feedback, emails and credentials. Keep production silent.
const logs = () => process.env.NODE_ENV === 'production' ? [] :
  (process.env.PRISMA_LOG ? ['query', 'info', 'warn', 'error'] : []);

export function getPrismaClient(options = {}) {
  if (options.datasourceUrl || options.forceNew) {
    const client = new PrismaClient({
      datasourceUrl: options.datasourceUrl || env.databaseUrl,
      log: logs(),
    });
    return client;
  }
  if (!prismaInstance) {
    if (process.env.NODE_ENV === 'test' && (!process.env.TEST_DATABASE_URL || process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL)) {
      throw new Error('Testes exigem DATABASE_URL igual ao banco temporario TEST_DATABASE_URL.');
    }
    prismaInstance = new PrismaClient({
      datasourceUrl: env.databaseUrl,
      log: logs(),
    });
  }
  return prismaInstance;
}

export async function checkDatabaseReadiness(client = getPrismaClient()) {
  try {
    await client.$runCommandRaw({ ping: 1 });
    return { ready: true };
  } catch {
    return { ready: false };
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
