import 'dotenv/config';
import { PrismaClient, Prisma } from '../generated/mongo-client/index.js';

let prismaInstance = null;

function enhanceClient(client) {
  client.$queryRawUnsafe = async (query) => {
    if (typeof query === 'string' && query.includes('PRAGMA')) {
      return [];
    }
    throw new Error(`$queryRawUnsafe nao suportado no MongoDB para a query: ${query}`);
  };
  return client;
}

export function getPrismaClient(options = {}) {
  if (options.datasourceUrl || options.forceNew) {
    const client = new PrismaClient({
      datasourceUrl: options.datasourceUrl || process.env.DATABASE_URL,
      log: process.env.PRISMA_LOG ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
    return enhanceClient(client);
  }
  if (!prismaInstance) {
    if (process.env.NODE_ENV === 'test' && (!process.env.TEST_DATABASE_URL || process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL)) {
      throw new Error('Testes exigem DATABASE_URL igual ao banco temporario TEST_DATABASE_URL.');
    }
    prismaInstance = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
      log: process.env.PRISMA_LOG ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
    enhanceClient(prismaInstance);
  }
  return prismaInstance;
}

export async function checkDatabaseReadiness(client = getPrismaClient()) {
  try {
    await client.$runCommandRaw({ ping: 1 });
    return { ready: true };
  } catch (err) {
    return { ready: false, error: err.message };
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
