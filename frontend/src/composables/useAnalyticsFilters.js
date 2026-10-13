import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { analyticsFiltersSchema, apiFilters, filtersFromQuery } from '../lib/analytics.js';

export function useAnalyticsFilters(feedback, questions) {
  const route = useRoute();
  const router = useRouter();
  const fields = reactive(filtersFromQuery(route.query));
  const errors = ref({});
  const applied = computed(() => apiFilters(filtersFromQuery(route.query), feedback));
  const hasFilters = computed(() => Object.keys(applied.value).length > 0);
  const page = computed(() => /^\d+$/.test(String(route.query.pagina || '1')) && Number(route.query.pagina || 1) >= 1 && Number(route.query.pagina || 1) <= 100000 ? Number(route.query.pagina || 1) : 1);
  const limit = computed(() => ['10', '20', '50', '100'].includes(String(route.query.limite)) ? Number(route.query.limite) : 20);
  watch(() => route.query, query => { Object.assign(fields, filtersFromQuery(query)); errors.value = {}; });
  function validate(value = fields) {
    const parsed = analyticsFiltersSchema.safeParse(feedback ? value : { ...value, perguntaId: '', nota: '' });
    errors.value = parsed.success ? {} : Object.fromEntries(parsed.error.issues.map(issue => [issue.path[0], issue.message]));
    if (parsed.success && feedback && value.nota !== '') {
      const question = questions.value.find(q => q.id === value.perguntaId);
      if (!question || !['ESTRELAS', 'NPS'].includes(question.tipo)) errors.value.perguntaId = 'Selecione uma pergunta de estrelas ou NPS.';
      else if (question.tipo === 'ESTRELAS' && (Number(value.nota) < 1 || Number(value.nota) > 5)) errors.value.nota = 'Escolha uma nota de 1 a 5.';
    }
    return Object.keys(errors.value).length === 0;
  }
  async function apply() {
    if (!validate()) return;
    await router.replace({ query: { ...route.query, ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value === '' ? undefined : String(value)])), pagina: undefined } });
  }
  function clear() { return router.replace({ query: { aba: route.query.aba } }); }
  function changePage(value) { return router.replace({ query: { ...route.query, pagina: value === 1 ? undefined : String(value) } }); }
  function changeLimit(value) { return router.replace({ query: { ...route.query, limite: String(value), pagina: undefined } }); }
  return { fields, errors, applied, hasFilters, page, limit, validate, apply, clear, changePage, changeLimit };
}
