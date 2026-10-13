import { runSchemaCrudTest } from './tests/01_schema_crud.js';
import { runIdempotencyIndexTest } from './tests/02_idempotency_indexes.js';
import { runConcurrencyCoordinationTest } from './tests/03_concurrency_coordination.js';
import { runAggregationsAndTransactionsTest } from './tests/04_aggregations_and_transactions.js';
import { runIntegrityAndValidatorsTest } from './tests/05_integrity_and_validators.js';

console.log('######################################################################');
console.log('FEEDQR: EXECUÇÃO COMPLETA DO PROTÓTIPO ISOLADO MONGODB + PRISMA 6.19.3');
console.log('######################################################################');

const startTime = Date.now();
const report = {};

try {
  report.test1_schemaCrud = await runSchemaCrudTest();
  report.test2_idempotencyIndexes = await runIdempotencyIndexTest();
  report.test3_concurrencyCoordination = await runConcurrencyCoordinationTest();
  report.test4_aggregationsTransactions = await runAggregationsAndTransactionsTest();
  report.test5_integrityValidators = await runIntegrityAndValidatorsTest();

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n======================================================');
  console.log(`RELATÓRIO CONSOLIDADO DO PROTÓTIPO (${durationSec}s)`);
  console.log('======================================================');
  console.log(JSON.stringify(report, null, 2));
  console.log('\nTodos os ensaios do protótipo foram concluídos com SUCESSO.');
} catch (err) {
  console.error('\nFALHA na execução do protótipo:', err);
  process.exit(1);
}
