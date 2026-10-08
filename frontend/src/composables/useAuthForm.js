import { nextTick, reactive, ref } from 'vue';
import { fieldErrors } from '../lib/authSchemas.js';

export function useAuthForm(schema, initial, submitAction) {
  const values = reactive(initial);
  const errors = ref({});
  const error = ref('');
  const pending = ref(false);
  const formElement = ref(null);

  function validateField(path) {
    const all = fieldErrors(schema.safeParse(values));
    const updated = { ...errors.value };
    if (all[path]) updated[path] = all[path]; else delete updated[path];
    errors.value = updated;
  }

  function edited(path) {
    error.value = '';
    if (errors.value[path]) validateField(path);
  }

  async function focusError() {
    await nextTick();
    formElement.value?.querySelector('[aria-invalid="true"]')?.focus();
  }

  async function submit() {
    if (pending.value) return;
    error.value = '';
    const result = schema.safeParse(values);
    errors.value = fieldErrors(result);
    if (!result.success) { await focusError(); return; }
    pending.value = true;
    try { await submitAction(result.data); }
    catch (failure) {
      error.value = failure.message || 'N\u00e3o foi poss\u00edvel continuar. Tente novamente.';
      for (const detail of failure.details || []) {
        if (typeof detail.campo === 'string' && typeof detail.mensagem === 'string') errors.value[detail.campo] = detail.mensagem;
      }
      await focusError();
    } finally { pending.value = false; }
  }

  return { values, errors, error, pending, formElement, validateField, edited, submit };
}
