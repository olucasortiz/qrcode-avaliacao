import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

console.log('--- Teste 1: db push no schema experimental MongoDB ---');
const replSet = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: 'wiredTiger' },
});

const url = new URL(replSet.getUri());
url.pathname = '/feedqr_proto';
const uri = url.toString();
console.log('URI do replica set descartável:', uri);

process.env.PROTOTYPE_DATABASE_URL = uri;

try {
  console.log('Executando prisma db push --schema=prototype/schema.prisma ...');
  const output = execSync('npx prisma db push --schema=prototype/schema.prisma --accept-data-loss', {
    env: { ...process.env, PROTOTYPE_DATABASE_URL: uri },
    encoding: 'utf8',
    stdio: 'pipe',
  });
  console.log('Resultado do db push:');
  console.log(output);
  console.log('db push executado com SUCESSO!');
} catch (err) {
  console.error('ERRO no db push:');
  if (err.stdout) console.log('STDOUT:', err.stdout.toString());
  if (err.stderr) console.error('STDERR:', err.stderr.toString());
} finally {
  await replSet.stop();
  console.log('ReplSet finalizado.');
}
