import { z } from 'zod';
import { ApiError, request } from '../lib/api.js';
import { publicSurveySchema } from '../lib/publicSurveySchemas.js';

// Only this safe public read retries. POST and authenticated calls retain one attempt.
export const publicLoadPolicy = Object.freeze({ timeoutMs: 30000, attempts: 3, delays: [1000, 2000] });

function backoff(ms, signal) {
  return new Promise((resolve, reject) => {
    const cancel = () => { clearTimeout(timer); signal?.removeEventListener('abort', cancel); reject(new DOMException('Cancelled', 'AbortError')); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', cancel); resolve(); }, ms);
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) cancel();
  });
}

export const publicSurveys = {
  async get(slug, origin, { signal } = {}) {
    const query = origin === undefined ? '' : `?${new URLSearchParams({ origem: origin })}`;
    let data;
    for (let attempt = 0; attempt < publicLoadPolicy.attempts; attempt++) {
      try {
        data = await request(`/public/pesquisas/${encodeURIComponent(slug)}${query}`, {
          authenticated: false, signal, timeoutMs: publicLoadPolicy.timeoutMs,
        });
        break;
      } catch (error) {
        // A proxy HTML error is not evidence that a survey or its origin is invalid.
        if ([400, 404].includes(error.status) && error.kind === 'http-unverified') {
          throw new ApiError('Resposta da pesquisa em formato inesperado.', 0, [], 'unexpected');
        }
        const transient = ['network', 'timeout'].includes(error.kind) || [408, 500, 502, 503, 504].includes(error.status);
        if (signal?.aborted || !transient || attempt === publicLoadPolicy.attempts - 1) throw error;
        await backoff(publicLoadPolicy.delays[attempt], signal);
      }
    }
    const result = publicSurveySchema.safeParse(data);
    if (!result.success || result.data.slug !== slug) throw new ApiError('Resposta da pesquisa em formato inesperado.', 0, [], 'unexpected');
    return result.data;
  },
  async submit(slug, payload, idempotencyKey) {
    const result = await request(`/public/pesquisas/${encodeURIComponent(slug)}/respostas`, {
      method: 'POST', body: payload, authenticated: false, idempotencyKey,
    });
    if (!z.object({ mensagem: z.string().min(1) }).safeParse(result).success) throw new ApiError('Confirmação inesperada.');
  },
};
