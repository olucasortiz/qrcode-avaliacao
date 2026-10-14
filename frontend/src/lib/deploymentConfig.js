export function deploymentConfig(env, hosted = false) {
  const api = env.VITE_API_BASE_URL || '/api';
  const publicUrl = env.VITE_FRONTEND_PUBLIC_URL || '';
  const isHosted = hosted || env.DEPLOYMENT_TARGET === 'cloudflare-pages';
  const publicOrigin = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !/^(localhost|127\.|\[::1\])/.test(url.hostname) &&
        !url.username && !url.password && !url.search && !url.hash;
    } catch { return false; }
  };
  if (isHosted && (!publicOrigin(api) || new URL(api).pathname !== '/api' ||
    !publicOrigin(publicUrl) || new URL(publicUrl).origin !== publicUrl)) {
    throw new Error('Cloudflare Pages exige VITE_API_BASE_URL=https://<api>/api e VITE_FRONTEND_PUBLIC_URL=https://<frontend>, sem barra final.');
  }
  let apiOrigin = "'self'";
  if (/^https?:\/\//.test(api)) apiOrigin = new URL(api).origin;
  return { api, publicUrl, headers: `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self' ${apiOrigin}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
` };
}
