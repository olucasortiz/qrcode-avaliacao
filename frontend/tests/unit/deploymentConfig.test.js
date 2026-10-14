import { describe, expect, test } from 'vitest';
import { deploymentConfig } from '../../src/lib/deploymentConfig.js';

const env = { DEPLOYMENT_TARGET: 'cloudflare-pages', VITE_API_BASE_URL: 'https://feedqr-api.example.com/api',
  VITE_FRONTEND_PUBLIC_URL: 'https://feedqr.example.com' };

describe('Pages build configuration', () => {
  test('allows local builds with a Vite proxy', () => {
    expect(deploymentConfig({}).api).toBe('/api');
  });
  test('restricts CSP connections to the configured API and excludes inline scripts', () => {
    const { headers } = deploymentConfig(env);
    expect(headers).toContain("connect-src 'self' https://feedqr-api.example.com;");
    expect(headers).toContain("script-src 'self';");
    expect(headers).toContain('Referrer-Policy: no-referrer');
  });
  test.each([
    { VITE_API_BASE_URL: '/api' }, { VITE_API_BASE_URL: 'http://api.example.com/api' },
    { VITE_API_BASE_URL: 'https://api.example.com' }, { VITE_API_BASE_URL: 'https://user:password@api.example.com/api' },
    { VITE_FRONTEND_PUBLIC_URL: 'http://localhost:5173' }, { VITE_FRONTEND_PUBLIC_URL: 'https://feedqr.example.com/' },
  ])('rejects invalid hosted configuration: %j', overrides => {
    expect(() => deploymentConfig({ ...env, ...overrides })).toThrow(/Cloudflare Pages/);
  });
  test('Cloudflare environment also enforces configuration without DEPLOYMENT_TARGET', () => {
    expect(() => deploymentConfig({}, true)).toThrow(/Cloudflare Pages/);
  });
});
