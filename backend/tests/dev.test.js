import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { once } from 'node:events';
import { test } from 'vitest';

test('nodemon inicia e reinicia arquivos JS com a versao corrigida do watcher', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'feedqr-watcher-'));
  const file = join(directory, 'fixture.js');
  writeFileSync(file, "console.log('WATCH_INITIAL');\n");
  const child = spawn(process.execPath, [resolve('node_modules/nodemon/bin/nodemon.js'),
    '--verbose', '--watch', directory, '--ext', 'js', file], { stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk.toString(); });
  child.stderr.on('data', chunk => { output += chunk.toString(); });
  async function waitFor(marker) {
    const matches = () => typeof marker === 'string' ? output.includes(marker) : marker.test(output);
    if (matches()) return;
    await new Promise((resolveOutput, reject) => {
      const timeout = setTimeout(() => { cleanup(); reject(new Error(`Nodemon nao emitiu ${marker}: ${output}`)); }, 10000);
      function inspect() {
        if (matches()) { cleanup(); resolveOutput(); }
      }
      function cleanup() {
        clearTimeout(timeout);
        child.stdout.off('data', inspect);
        child.stderr.off('data', inspect);
      }
      child.stdout.on('data', inspect);
      child.stderr.on('data', inspect);
    });
  }
  try {
    await waitFor('watching 1 file');
    await waitFor('WATCH_INITIAL');
    await waitFor('clean exit');
    writeFileSync(file, "console.log('WATCH_RESTARTED');\n");
    await waitFor('WATCH_RESTARTED');
    assert.ok(output.includes('restarting due to changes'));
    // Let the short-lived fixture exit before stopping its watcher.
    await waitFor(/WATCH_RESTARTED[\s\S]*clean exit/);
  } finally {
    const closed = once(child, 'close');
    child.kill();
    await closed;
    rmSync(directory, { recursive: true, force: true });
  }
});
