import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4177', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: [
    { command: 'node tests/e2e/api-server.js', url: 'http://127.0.0.1:4178/api/health', reuseExistingServer: false, timeout: 30000 },
    { command: 'npm run dev -- --port 4177 --strictPort', url: 'http://127.0.0.1:4177', reuseExistingServer: false,
      env: { API_PROXY_TARGET: 'http://127.0.0.1:4178' }, timeout: 30000 },
  ],
});
