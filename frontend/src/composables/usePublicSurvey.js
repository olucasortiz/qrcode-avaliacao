import { computed, reactive, ref, watch } from 'vue';
import { ApiError } from '../lib/api.js';
import { answerError, originSchema, publicError, responsePayload } from '../lib/publicSurveySchemas.js';
import { publicSurveys } from '../services/publicSurveys.js';
import { draftKey, publicDraftStorage, restoreDraft } from '../lib/publicSurveyStorage.js';

function submissionKey() {
  // getRandomValues also works on HTTP when testing a QR Code on the local network.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function usePublicSurvey(service = publicSurveys, storage = publicDraftStorage()) {
  const phase = ref('loading');
  const survey = ref(null);
  const index = ref(0);
  const answers = reactive({});
  const fieldError = ref('');
  const loadError = ref(null);
  const slowLoading = ref(false);
  const sendError = ref(null);
  const sending = ref(false);
  const uncertain = ref(false);
  const question = computed(() => survey.value?.perguntas[index.value]);
  const last = computed(() => index.value === survey.value?.perguntas.length - 1);
  const locked = computed(() => sending.value || uncertain.value);
  const progress = computed(() => survey.value ? Math.round((index.value + 1) / survey.value.perguntas.length * 100) : 0);
  let generation = 0;
  let slug;
  let origin;
  let attempt;
  let storageKey;
  let loadController;
  let slowTimer;
  function persist() {
    if (!storageKey || !survey.value || !['intro', 'questions'].includes(phase.value)) return;
    storage.write(storageKey, { version: 1, phase: phase.value, index: index.value, answers: { ...answers }, attempt: attempt ?? null });
  }
  const stopPersistence = watch([answers, index, phase], persist, { deep: true, flush: 'sync' });

  async function load(nextSlug, nextOrigin) {
    const current = ++generation;
    loadController?.abort();
    clearTimeout(slowTimer);
    const controller = new AbortController();
    loadController = controller;
    slowLoading.value = false;
    slowTimer = setTimeout(() => { if (current === generation) slowLoading.value = true; }, 8000);
    phase.value = 'loading';
    loadError.value = null;
    sendError.value = null;
    survey.value = null;
    index.value = 0;
    fieldError.value = '';
    Object.keys(answers).forEach(key => delete answers[key]);
    attempt = null;
    uncertain.value = false;
    sending.value = false;
    slug = nextSlug;
    origin = nextOrigin;
    storageKey = draftKey(slug, origin);
    try {
      if (typeof slug !== 'string' || !slug || slug.length > 200 || !originSchema.safeParse(origin).success) throw new ApiError('Link inválido.', 400);
      const loaded = await service.get(slug, origin, { signal: controller.signal });
      if (current !== generation) return;
      survey.value = loaded;
      const restored = restoreDraft(storage.read(storageKey), loaded, origin);
      if (restored) {
        Object.assign(answers, restored.answers);
        index.value = restored.index;
        attempt = restored.attempt;
        uncertain.value = !!attempt;
        if (uncertain.value) sendError.value = publicError({ status: 0 }, true);
        phase.value = restored.phase;
      } else phase.value = 'intro';
    } catch (error) {
      if (current !== generation || controller.signal.aborted) return;
      loadError.value = publicError(error);
      phase.value = 'error';
    } finally {
      if (current === generation) { clearTimeout(slowTimer); slowLoading.value = false; }
    }
  }
  function start() { if (phase.value === 'intro') phase.value = 'questions'; }
  function setAnswer(value) {
    if (locked.value || phase.value !== 'questions') return;
    answers[question.value.id] = value;
    fieldError.value = '';
    sendError.value = null;
  }
  function back() {
    if (locked.value || phase.value !== 'questions') return;
    if (index.value > 0) index.value--;
    else phase.value = 'intro';
    fieldError.value = '';
    sendError.value = null;
  }
  async function next() {
    if (locked.value || phase.value !== 'questions') return false;
    fieldError.value = answerError(question.value, answers[question.value.id]);
    if (fieldError.value) return false;
    if (!last.value) { index.value++; sendError.value = null; return true; }
    return submit();
  }
  async function submit() {
    if (sending.value || phase.value !== 'questions') return false;
    if (!attempt) {
      const invalid = survey.value.perguntas.findIndex(item => answerError(item, answers[item.id]));
      if (invalid !== -1) { index.value = invalid; fieldError.value = answerError(question.value, answers[question.value.id]); return false; }
      const payload = responsePayload(survey.value, answers, origin);
      if (new TextEncoder().encode(JSON.stringify(payload)).length > 65536) {
        sendError.value = publicError({ status: 413 }, true);
        return false;
      }
      attempt = { key: submissionKey(), payload };
      persist();
    }
    const current = generation;
    const currentSlug = slug;
    const wasUncertain = uncertain.value;
    sending.value = true;
    sendError.value = null;
    try {
      await service.submit(currentSlug, attempt.payload, attempt.key);
      if (current !== generation) return false;
      phase.value = 'success';
      uncertain.value = false;
      attempt = null;
      storage.clear(storageKey);
      return true;
    } catch (error) {
      if (current !== generation) return false;
      sendError.value = publicError(error, true);
      // A rate limit or middleware rejection cannot disprove an earlier committed send.
      uncertain.value = !error.status || error.status >= 500 || (wasUncertain && [401, 403, 413, 415, 429].includes(error.status));
      // An unknown outcome must retry the same frozen payload and key.
      if (!uncertain.value) attempt = null;
      persist();
      return false;
    } finally {
      if (current === generation) sending.value = false;
    }
  }
  function dispose() { generation++; loadController?.abort(); clearTimeout(slowTimer); stopPersistence(); }
  return { phase, survey, index, answers, question, last, fieldError, loadError, slowLoading, sendError, sending, uncertain, locked, progress,
    load, start, setAnswer, back, next, submit, dispose };
}
