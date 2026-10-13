import { randomUUID } from 'node:crypto';
import { expect, it, vi } from 'vitest';
import { usePublicSurvey } from '../../src/composables/usePublicSurvey.js';
import { draftKey, publicDraftStorage, restoreDraft } from '../../src/lib/publicSurveyStorage.js';
import { ApiError } from '../../src/lib/api.js';
const q1 = { id: randomUUID(), texto: 'Nota?', tipo: 'NPS', obrigatoria: true };
const q2 = { id: randomUUID(), texto: 'Sim?', tipo: 'SIM_NAO', obrigatoria: true };
const survey = { titulo: 'Pesquisa', slug: 'teste', perguntas: [q1, q2] };
function fixture() {
  const values = new Map();
  const storage = publicDraftStorage(() => ({ getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }));
  const service = { get: vi.fn().mockResolvedValue(survey), submit: vi.fn().mockResolvedValue(undefined) };
  return { storage, service, values };
}
it('restaura posição e valores zero/false após refresh e isola origem/pesquisa', async () => {
  const { storage, service, values } = fixture();
  const origin = randomUUID();
  const first = usePublicSurvey(service, storage);
  await first.load('teste', origin); first.start(); first.setAnswer(0); await first.next(); first.setAnswer(false); first.dispose();
  const second = usePublicSurvey(service, storage); await second.load('teste', origin);
  expect(second.index.value).toBe(1); expect(second.phase.value).toBe('questions');
  expect(second.answers).toEqual({ [q1.id]: 0, [q2.id]: false });
  expect(second.progress.value).toBe(100); second.back(); expect(second.progress.value).toBe(50);
  const other = usePublicSurvey(service, storage); await other.load('teste', randomUUID()); expect(other.answers).toEqual({});
  expect(draftKey('outra', origin)).not.toBe(draftKey('teste', origin));
  expect([...values.values()].join('')).not.toMatch(/JWT|Authorization|usuario|empresaId/);
  second.dispose(); other.dispose();
});
it('persiste tentativa antes da rede e restaura a mesma chave e payload após confirmação perdida', async () => {
  const { storage, service, values } = fixture();
  service.submit.mockRejectedValueOnce(new ApiError('Rede'));
  const first = usePublicSurvey(service, storage); await first.load('teste'); first.start(); first.setAnswer(0); await first.next(); first.setAnswer(false); await first.submit();
  const attempt = service.submit.mock.calls[0]; first.dispose();
  const second = usePublicSurvey(service, storage); await second.load('teste');
  expect(second.uncertain.value).toBe(true); second.setAnswer(true); expect(second.answers[q2.id]).toBe(false);
  await second.submit(); expect(service.submit.mock.calls[1]).toEqual(attempt);
  expect(second.phase.value).toBe('success'); expect(values.has(draftKey('teste'))).toBe(false); second.dispose();
});
it('rejeição definitiva permite corrigir após refresh e usa nova chave', async () => {
  const { storage, service } = fixture(); service.submit.mockRejectedValueOnce(new ApiError('Validação', 400));
  const first = usePublicSurvey(service, storage); await first.load('teste'); first.start(); first.setAnswer(0); await first.next(); first.setAnswer(false); await first.submit(); first.dispose();
  const second = usePublicSurvey(service, storage); await second.load('teste'); expect(second.uncertain.value).toBe(false);
  second.setAnswer(true); await second.submit();
  expect(service.submit.mock.calls[0][2]).not.toBe(service.submit.mock.calls[1][2]);
  expect(service.submit.mock.calls[1][1].respostas[1].valor).toBe(true); second.dispose();
});
it('valida dados contra perguntas atuais e não reutiliza chave com payload alterado', () => {
  const raw = { version: 1, phase: 'questions', index: 99, answers: { [q1.id]: 12, [q2.id]: false, [randomUUID()]: 'excluída' },
    attempt: { key: randomUUID(), payload: { respostas: [{ perguntaId: q1.id, valor: 12 }, { perguntaId: q2.id, valor: false }] } } };
  const restored = restoreDraft(raw, survey);
  expect(restored.answers).toEqual({ [q2.id]: false }); expect(restored.attempt).toBeNull(); expect(restored.index).toBe(1);
  expect(restoreDraft({ version: 3 }, survey)).toBeNull();
});
it('armazenamento indisponível ou JSON corrompido não quebra o formulário', async () => {
  const broken = publicDraftStorage(() => { throw new Error('Denied'); });
  expect(broken.read('key')).toBeNull(); expect(() => broken.write('key', {})).not.toThrow(); expect(() => broken.clear('key')).not.toThrow();
  expect(publicDraftStorage(() => ({ getItem: () => '{' })).read('key')).toBeNull();
  const service = { get: vi.fn().mockResolvedValue({ ...survey, perguntas: [q1] }), submit: vi.fn().mockResolvedValue(undefined) };
  const state = usePublicSurvey(service, broken); await state.load('teste'); state.start(); expect(state.progress.value).toBe(100);
  state.setAnswer(0); await state.submit(); expect(state.phase.value).toBe('success'); state.dispose();
});

it('limite de tentativas após confirmação perdida mantém o payload e a chave originais', async () => {
  const { storage, service } = fixture();
  service.submit.mockRejectedValueOnce(new ApiError('Rede')).mockRejectedValueOnce(new ApiError('Limite', 429));
  const first = usePublicSurvey(service, storage); await first.load('teste'); first.start(); first.setAnswer(0); await first.next(); first.setAnswer(false); await first.submit();
  await first.submit(); expect(first.uncertain.value).toBe(true); first.dispose();
  const restored = usePublicSurvey(service, storage); await restored.load('teste'); await restored.submit();
  expect(service.submit.mock.calls[2]).toEqual(service.submit.mock.calls[0]); restored.dispose();
});

it('conflito definitivo descarta a chave, permitindo correções sem reutilização', async () => {
  const { storage, service } = fixture(); service.submit.mockRejectedValueOnce(new ApiError('Conflito', 409));
  const state = usePublicSurvey(service, storage); await state.load('teste'); state.start(); state.setAnswer(0); await state.next(); state.setAnswer(false); await state.submit();
  expect(state.uncertain.value).toBe(false); state.setAnswer(true); await state.submit();
  expect(service.submit.mock.calls[0][2]).not.toBe(service.submit.mock.calls[1][2]); state.dispose();
});
