<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowUpRight, Check, Plus, RefreshCw, RotateCcw } from '@lucide/vue';
import { useResource } from '../composables/useResource.js';
import { allSurveys, surveys } from '../services/surveys.js';
import { dashboardFiltersSchema } from '../lib/surveySchemas.js';
import { fieldErrors } from '../lib/authSchemas.js';
import { count, dateLabel } from '../lib/format.js';
import AppButton from '../components/AppButton.vue';
import FormNotice from '../components/FormNotice.vue';
import ResourceState from '../components/ResourceState.vue';
import ResponseTimeline from '../components/ResponseTimeline.vue';
import QuestionMetrics from '../components/QuestionMetrics.vue';
import EmptyState from '../components/EmptyState.vue';
import AppModal from '../components/AppModal.vue';
import SurveyForm from '../components/SurveyForm.vue';

const router = useRouter();
const createOpen = ref(false);
const creating = ref(false);
const filters = reactive({ inicio: '', fim: '', pesquisaId: '', pontoColetaId: '' });
const applied = ref({ ...filters });
const errors = ref({});
const filtersApplied = ref(false);
const { data, loading, error, load } = useResource();
const choices = useResource();
const points = useResource();
const noSurveys = computed(() => choices.data.value?.length === 0 && !choices.error.value);
const hasFilters = computed(() => Object.values(applied.value).some(Boolean));
const collectionSurvey = computed(() => choices.data.value?.find(survey => survey.id === applied.value.pesquisaId)
  || choices.data.value?.find(survey => survey.status === 'ATIVA') || choices.data.value?.[0]);
async function created(survey) { createOpen.value = false; await router.push({ name: 'survey-detail', params: { id: survey.id } }); }
const groups = computed(() => {
  const grouped = new Map();
  for (const question of data.value?.perguntas || []) {
    if (!grouped.has(question.pesquisaId)) grouped.set(question.pesquisaId, { id: question.pesquisaId,
      title: choices.data.value?.find(survey => survey.id === question.pesquisaId)?.titulo || 'Pesquisa', questions: [] });
    grouped.get(question.pesquisaId).questions.push(question);
  }
  return [...grouped.values()];
});
const period = computed(() => {
  const { inicio, fim } = applied.value;
  if (inicio && fim) return `${dateLabel(inicio)} a ${dateLabel(fim)}`;
  if (inicio) return `A partir de ${dateLabel(inicio)}`;
  if (fim) return `At\u00e9 ${dateLabel(fim)}`;
  return 'Todo o per\u00edodo';
});
async function apply() {
  const result = dashboardFiltersSchema.safeParse(filters);
  errors.value = fieldErrors(result);
  if (!result.success) { await nextTick(); document.querySelector('.dashboard-filters [aria-invalid="true"]')?.focus(); return; }
  const snapshot = { ...result.data };
  const refresh = !!data.value;
  filtersApplied.value = false;
  if (await load(() => surveys.dashboard(snapshot))) { applied.value = snapshot; filtersApplied.value = refresh; }
}
function reset() { Object.assign(filters, { inicio: '', fim: '', pesquisaId: '', pontoColetaId: '' }); apply(); }
function loadChoices() { return choices.load(allSurveys); }
watch(() => filters.pesquisaId, id => {
  filters.pontoColetaId = '';
  points.data.value = null;
  // Invalidates any previous in-flight point request as well.
  points.load(() => id ? surveys.points(id) : Promise.resolve([]));
});
onMounted(() => { loadChoices(); apply(); });
</script>
<template>
  <section class="admin-view dashboard-view" aria-labelledby="dashboard-heading">
    <header class="view-heading"><div><p class="eyebrow">DASHBOARD</p><h1 id="dashboard-heading">Vis&#x00e3;o geral</h1></div><RouterLink :to="{ name: 'surveys' }" class="text-link">Pesquisas <ArrowUpRight :size="17" aria-hidden="true" /></RouterLink></header>
    <form class="dashboard-filters" novalidate @submit.prevent="apply">
      <div class="filter-field"><label for="filter-start">Data inicial</label><input id="filter-start" v-model="filters.inicio" type="date" :aria-invalid="errors.inicio ? 'true' : undefined" :aria-describedby="errors.inicio ? 'filter-start-error' : undefined" /><p v-if="errors.inicio" id="filter-start-error" class="field-error">{{ errors.inicio }}</p></div>
      <div class="filter-field"><label for="filter-end">Data final</label><input id="filter-end" v-model="filters.fim" type="date" :aria-invalid="errors.fim ? 'true' : undefined" :aria-describedby="errors.fim ? 'filter-end-error' : undefined" /><p v-if="errors.fim" id="filter-end-error" class="field-error">{{ errors.fim }}</p></div>
      <div class="filter-field"><label for="filter-survey">Pesquisa</label><select id="filter-survey" v-model="filters.pesquisaId" :disabled="choices.loading.value"><option value="">Todas as pesquisas</option><option v-for="survey in choices.data.value || []" :key="survey.id" :value="survey.id">{{ survey.titulo }}</option></select></div>
      <div class="filter-field"><label for="filter-point">Ponto de coleta</label><select id="filter-point" v-model="filters.pontoColetaId" :disabled="!filters.pesquisaId || points.loading.value || !!points.error.value"><option value="">Todos os pontos</option><option v-for="point in points.data.value || []" :key="point.id" :value="point.id">{{ point.nome }}{{ point.ativo ? '' : ' (inativo)' }}</option></select></div>
      <div class="filter-actions"><AppButton type="submit" variant="secondary" :loading="loading"><Check :size="16" aria-hidden="true" /> Aplicar</AppButton><button class="icon-button" type="button" title="Limpar filtros" aria-label="Limpar filtros" :disabled="loading" @click="reset"><RotateCcw :size="17" aria-hidden="true" /></button></div>
    </form>
    <FormNotice v-if="choices.error.value">{{ choices.error.value }} <button class="inline-retry" type="button" @click="loadChoices">Tentar novamente</button></FormNotice>
    <FormNotice v-if="points.error.value">{{ points.error.value }} <button class="inline-retry" type="button" @click="points.load(() => surveys.points(filters.pesquisaId))">Tentar novamente</button></FormNotice>
    <ResourceState v-if="!data" kind="dashboard" :loading="loading" :error="error" @retry="apply" />
    <template v-else>
      <FormNotice v-if="error">{{ error }} <button class="inline-retry" type="button" @click="apply">Tentar novamente</button></FormNotice>
      <div class="dashboard-content" :class="{ 'is-updating': loading }" :aria-busy="loading">
        <div class="period-caption"><span>{{ period }} <span class="utc-label">UTC</span></span><Transition name="filter-feedback" mode="out-in"><span v-if="loading" key="loading" role="status"><RefreshCw class="spin" :size="13" aria-hidden="true" /> Atualizando...</span><span v-else-if="filtersApplied" key="applied" class="filter-confirmation" role="status"><Check :size="14" aria-hidden="true" /> Filtros aplicados</span></Transition></div>
        <div class="dashboard-overview">
          <dl class="dashboard-totals"><div class="total-highlight"><dt>Total de respostas</dt><dd><Transition name="metric" mode="out-in"><span :key="data.totalRespostas">{{ count(data.totalRespostas) }}</span></Transition></dd></div><div class="active-highlight"><dt>Pesquisas ativas</dt><dd><Transition name="metric" mode="out-in"><span :key="data.pesquisasAtivas">{{ count(data.pesquisasAtivas) }}</span></Transition></dd></div></dl>
          <section class="analytics-section timeline-section" aria-labelledby="timeline-heading"><header class="section-heading"><h2 id="timeline-heading">Respostas ao longo do tempo</h2><span>Por dia &#x00b7; UTC</span></header>
          <ResponseTimeline v-if="data.respostasPorDia.length" :rows="data.respostasPorDia" :filters="applied" />
          <EmptyState v-else compact :eyebrow="noSurveys ? 'COMECE A OUVIR' : hasFilters ? 'NESTE RECORTE' : 'AGUARDANDO A PRIMEIRA RESPOSTA'" :title="noSurveys ? 'Sua primeira pesquisa, seu primeiro insight.' : hasFilters ? 'Nenhuma resposta neste per\u00edodo.' : 'Os resultados come\u00e7am com a coleta.'" :description="noSurveys ? 'Crie uma pesquisa para come\u00e7ar a ouvir seus clientes. As respostas e os resultados aparecer\u00e3o aqui.' : hasFilters ? 'N\u00e3o h\u00e1 respostas para os filtros selecionados. Experimente ampliar o per\u00edodo ou consultar todas as pesquisas.' : 'Suas pesquisas ainda n\u00e3o receberam respostas. Os resultados aparecer\u00e3o aqui ap\u00f3s a coleta.'">
            <AppButton v-if="noSurveys" @click="createOpen = true"><Plus :size="17" aria-hidden="true" /> Criar primeira pesquisa</AppButton>
            <AppButton v-else-if="hasFilters" variant="secondary" :disabled="loading" @click="reset"><RotateCcw :size="17" aria-hidden="true" /> Limpar filtros</AppButton>
            <RouterLink v-else-if="collectionSurvey" class="button button--secondary" :to="{ name: 'survey-detail', params: { id: collectionSurvey.id }, query: { aba: collectionSurvey.status === 'ATIVA' ? 'pontos' : undefined } }">{{ collectionSurvey.status === 'ATIVA' ? 'Gerenciar coleta' : 'Preparar pesquisa' }} <ArrowUpRight :size="17" aria-hidden="true" /></RouterLink>
          </EmptyState>
          </section>
        </div>
        <section v-if="groups.length || data.totalRespostas > 0" class="analytics-section results-section" aria-labelledby="questions-heading"><header class="section-heading"><h2 id="questions-heading">Resultados por pergunta</h2><span>{{ count(data.perguntas.length) }} {{ data.perguntas.length === 1 ? 'pergunta' : 'perguntas' }}</span></header>
          <EmptyState v-if="!groups.length" compact title="Ainda n&#x00e3;o h&#x00e1; perguntas neste recorte." description="Consulte outras pesquisas para acompanhar os resultados por pergunta." />
          <div class="metrics-groups"><div v-for="group in groups" :key="group.id" class="metrics-group" :class="{ 'metrics-group--single': group.questions.length === 1, 'metrics-group--multiple': group.questions.length > 1 }"><RouterLink class="metrics-group__title text-link" :to="{ name: 'survey-detail', params: { id: group.id } }">{{ group.title }} <ArrowUpRight :size="14" aria-hidden="true" /></RouterLink><div class="metrics-grid"><QuestionMetrics v-for="question in group.questions" :key="question.id" :question="question" /></div></div></div>
        </section>
      </div>
    </template>
    <AppModal :open="createOpen" title="Primeira pesquisa" :busy="creating" @close="createOpen = false"><SurveyForm :save="surveys.create" @saved="created" @cancel="createOpen = false" @busy="creating = $event" /></AppModal>
  </section>
</template>
