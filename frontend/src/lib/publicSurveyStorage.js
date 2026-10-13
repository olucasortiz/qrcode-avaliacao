import { z } from 'zod';
import { answerError, isUnanswered, responsePayload } from './publicSurveySchemas.js';

export const draftKey = (slug, origin) => `feedqr.public.v1:${JSON.stringify([slug, origin ?? null])}`;
const draftSchema = z.object({ version: z.literal(1), phase: z.enum(['intro', 'questions']), index: z.number().int().min(0),
  answers: z.record(z.string(), z.union([z.string().max(2000), z.number(), z.boolean()])),
  attempt: z.object({ key: z.uuid(), payload: z.object({ origem: z.string().optional(), respostas: z.array(z.object({ perguntaId: z.uuid(), valor: z.union([z.string().max(2000), z.number(), z.boolean()]) })) }) }).nullable(),
});
function samePayload(a, b) {
  if ((a.origem ?? null) !== (b.origem ?? null) || a.respostas.length !== b.respostas.length) return false;
  const ordered = items => [...items].sort((x, y) => x.perguntaId.localeCompare(y.perguntaId));
  return JSON.stringify(ordered(a.respostas)) === JSON.stringify(ordered(b.respostas));
}
export function restoreDraft(raw, survey, origin) {
  const parsed = draftSchema.safeParse(raw);
  if (!parsed.success) return null;
  const value = parsed.data;
  const answers = Object.fromEntries(survey.perguntas.filter(q => !isUnanswered(value.answers[q.id]) && !answerError(q, value.answers[q.id]))
    .map(q => [q.id, value.answers[q.id]]));
  const payload = responsePayload(survey, answers, origin);
  const validAttempt = value.attempt && samePayload(value.attempt.payload, payload)
    && survey.perguntas.every(q => !answerError(q, answers[q.id]));
  // A key is never restored with a changed payload; invalid drafts cannot bypass current validation.
  return { answers, index: validAttempt ? survey.perguntas.length - 1 : Math.min(value.index, survey.perguntas.length - 1),
    phase: validAttempt ? 'questions' : value.phase, attempt: validAttempt ? value.attempt : null };
}
export function publicDraftStorage(provider = () => globalThis.sessionStorage) {
  return {
    read(key) { try { const value = provider()?.getItem(key); return value ? JSON.parse(value) : null; } catch { return null; } },
    write(key, data) { try { provider()?.setItem(key, JSON.stringify(data)); } catch { /* The in-memory form stays usable. */ } },
    clear(key) { try { provider()?.removeItem(key); } catch { /* Storage may be denied. */ } },
  };
}
