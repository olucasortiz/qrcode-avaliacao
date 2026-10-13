import app from './app.js';
import { env } from './config/env.js';
import { disconnectPrisma, checkDatabaseReadiness } from './config/prisma.js';

const server = app.listen(env.port, async () => {
  console.log(`FeedQR API running on port ${env.port}`);
  const dbStatus = await checkDatabaseReadiness();
  if (dbStatus.ready) {
    console.log('MongoDB connection verified and ready.');
  } else {
    console.warn(`Aviso: MongoDB nao alcancavel na inicializacao (${dbStatus.error}).`);
  }
});

let isShuttingDown = false;
async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\nRecebido ${signal}. Encerrando aplicacao graciosamente...`);

  server.close(async () => {
    console.log('Servidor HTTP encerrado.');
    try {
      await disconnectPrisma();
      console.log('Conexao com Prisma/MongoDB encerrada.');
      process.exit(0);
    } catch (err) {
      console.error('Erro ao desconectar Prisma:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Tempo limite de encerramento excedido. Forcando saida.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export { server };
