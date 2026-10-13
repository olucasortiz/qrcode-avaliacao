import { MongoMemoryReplSet } from 'mongodb-memory-server';

console.log('Iniciando teste de inicialização do MongoMemoryReplSet...');
try {
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  const uri = replSet.getUri();
  console.log('SUCESSO: MongoMemoryReplSet ativo em:', uri);
  await replSet.stop();
  console.log('MongoMemoryReplSet encerrado com sucesso.');
} catch (err) {
  console.error('ERRO ao iniciar MongoMemoryReplSet:', err);
  process.exit(1);
}
