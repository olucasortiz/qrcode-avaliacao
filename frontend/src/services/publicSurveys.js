import { z } from 'zod';
import { ApiError, request } from '../lib/api.js';
import { publicSurveySchema } from '../lib/publicSurveySchemas.js';

export const publicSurveys = {
  async get(slug, origin) {
    const query = origin === undefined ? '' : `?${new URLSearchParams({ origem: origin })}`;
    const data = await request(`/public/pesquisas/${encodeURIComponent(slug)}${query}`, { authenticated: false });
    const result = publicSurveySchema.safeParse(data);
    if (!result.success || result.data.slug !== slug) throw new ApiError('Pesquisa indisponível.', 404);
    return result.data;
  },
  async submit(slug, payload, idempotencyKey) {
    const result = await request(`/public/pesquisas/${encodeURIComponent(slug)}/respostas`, {
      method: 'POST', body: payload, authenticated: false, idempotencyKey,
    });
    if (!z.object({ mensagem: z.string().min(1) }).safeParse(result).success) throw new ApiError('Confirmação inesperada.');
  },
};
