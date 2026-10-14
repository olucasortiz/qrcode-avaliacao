import http from 'node:http';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { deploymentConfig } from './src/lib/deploymentConfig.js';

const proxyAgent = new http.Agent({ keepAlive: true, maxSockets: 100 });

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const deployment = command === 'build' ? deploymentConfig({ ...env, ...process.env }, process.env.CF_PAGES === '1') : null;
  return {
    plugins: [vue(), ...(deployment ? [{
      name: 'feedqr-pages-headers',
      generateBundle() { this.emitFile({ type: 'asset', fileName: '_headers', source: deployment.headers }); },
    }] : [])],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'http://127.0.0.1:3000',
          changeOrigin: true,
          agent: proxyAgent,
          configure(proxy) {
            // The browser uses a same-origin API; the development proxy is server-to-server.
            proxy.on('proxyReq', request => request.removeHeader('origin'));
          },
        },
      },
    },
    test: { include: ['tests/unit/**/*.test.js'], environment: 'node', restoreMocks: true },
  };
});
