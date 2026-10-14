export class ApiError extends Error {
  constructor(message, status = 0, details = [], kind = 'http') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.kind = kind;
  }
}

let getToken = () => null;
let onUnauthorized = () => {};
export function configureAuthorization(tokenProvider, unauthorizedHandler) {
  getToken = tokenProvider;
  onUnauthorized = unauthorizedHandler;
}

const messages = {
  400: 'Confira os dados informados.',
  401: 'Email ou senha incorretos.',
  403: 'Acesso indispon\u00edvel para esta origem.',
  404: 'N\u00e3o encontramos este recurso.',
  409: 'J\u00e1 existe um cadastro com esses dados.',
  429: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
  502: 'O servi\u00e7o est\u00e1 temporariamente inacess\u00edvel. Tente novamente em instantes.',
  503: 'Servi\u00e7o temporariamente indispon\u00edvel. Tente novamente em instantes.',
  504: 'A resposta do servi\u00e7o demorou mais que o esperado. Tente novamente.',
};

export async function request(path, { method = 'GET', body, authenticated = true, responseType = 'json', idempotencyKey,
  signal, timeoutMs = 15000 } = {}) {
  const token = authenticated ? getToken() : null;
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) cancel();
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
    const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
    const response = await fetch(`${base}${path}`, {
      method, signal: controller.signal, credentials: 'omit',
      headers: { Accept: responseType === 'png' ? 'image/png' : responseType === 'csv' ? 'text/csv' : 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (response.ok && responseType === 'png') {
      if (!response.headers.get('Content-Type')?.toLowerCase().startsWith('image/png')) throw new ApiError('Recebemos um QR Code em formato inesperado. Tente novamente.');
      const blob = await response.blob();
      if (!blob.size) throw new ApiError('O QR Code est\u00e1 vazio. Tente novamente.');
      return blob;
    }
    if (response.ok && responseType === 'csv') {
      if (!response.headers.get('Content-Type')?.toLowerCase().startsWith('text/csv')) throw new ApiError('O arquivo recebido não é um CSV válido. Tente novamente.');
      const blob = await response.blob();
      if (!blob.size) throw new ApiError('O arquivo recebido está vazio. Tente novamente.');
      return { blob, disposition: response.headers.get('Content-Disposition') || '' };
    }
    const payload = await response.json().catch(() => null);
    // The body can time out after headers arrive. Do not turn that into a format error.
    if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
    if (!response.ok) {
      if (response.status === 401 && authenticated) onUnauthorized(token);
      const businessMessage = ((authenticated && [400, 404, 409].includes(response.status)) || response.status === 503) && typeof payload?.erro === 'string'
        ? payload.erro : null;
      throw new ApiError(businessMessage || messages[response.status] || 'O servi\u00e7o est\u00e1 indispon\u00edvel. Tente novamente.',
        response.status, Array.isArray(payload?.detalhes) ? payload.detalhes : [],
        typeof payload?.erro === 'string' ? 'http' : 'http-unverified');
    }
    if (response.status === 204) return null;
    if (!payload) throw new ApiError('Recebemos uma resposta inesperada. Tente novamente.');
    return payload;
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
    if (error instanceof ApiError) throw error;
    throw new ApiError(timedOut
      ? 'A conex\u00e3o demorou mais que o esperado. Tente novamente.'
      : 'N\u00e3o foi poss\u00edvel conectar. Confira sua conex\u00e3o e tente novamente.', 0, [], timedOut ? 'timeout' : 'network');
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
