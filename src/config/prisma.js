import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

if (process.env.NODE_ENV === 'test' && (!process.env.TEST_DATABASE_URL || process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL)) {
  throw new Error('Testes exigem DATABASE_URL igual ao banco temporario TEST_DATABASE_URL.');
}

const prisma = new PrismaClient();

export default prisma;
