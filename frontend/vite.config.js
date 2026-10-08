import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [vue()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'http://127.0.0.1:3000',
          changeOrigin: true,
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
