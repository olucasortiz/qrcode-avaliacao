<script setup>
import { computed, toRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Download, ArrowRight } from '@lucide/vue';
import { useResource } from '../composables/useResource.js';
import { useAnalyticsFilters } from '../composables/useAnalyticsFilters.js';
import { useCsvExport } from '../composables/useCsvExport.js';
import { analytics } from '../services/analytics.js';
import { surveys } from '../services/surveys.js';
import { filtersFromQuery } from '../lib/analytics.js';
import { count } from '../lib/format.js';
import AnalyticsFilters from './AnalyticsFilters.vue';
import QuestionMetrics from './QuestionMetrics.vue';
import ResponseTimeline from './ResponseTimeline.vue';
import EmptyState from './EmptyState.vue';
import ResourceState from './ResourceState.vue';
import AppButton from './AppButton.vue';
import FormNotice from './FormNotice.vue';
import '../styles/analytics.css';
const props = defineProps({ survey: Object, questions: Array });
const route = useRoute(); const router = useRouter();
const filters = useAnalyticsFilters(false, toRef(props, 'questions'));
const points = useResource();
const results = useResource();
const { exporting, exportError, exportSuccess, download } = useCsvExport();
const result = computed(() => results.data.value);
const emptyDescription = computed(() => filters.hasFilters.value ? 'Experimente outro período ou ponto de coleta para encontrar respostas.'
  : props.survey.status === 'RASCUNHO' ? 'Publique a pesquisa e compartilhe o QR Code de um ponto de coleta para começar.'
    : props.survey.status === 'ENCERRADA' ? 'Esta pesquisa foi encerrada sem respostas registradas. As perguntas continuam disponíveis para consulta.'
      : 'Compartilhe o QR Code de um ponto de coleta. As respostas aparecerão aqui após o envio.');
const emptyDestination = computed(() => props.survey.status === 'ATIVA' ? 'pontos' : 'perguntas');
function fetchResults() {
  if (!filters.validate(filtersFromQuery(route.query))) return;
  return results.load(() => analytics.results(props.survey.id, filters.applied.value));
}
function openFeedbacks(perguntaId) { router.replace({ query: { ...route.query, aba: 'feedbacks', perguntaId, nota: undefined, pagina: undefined } }); }
watch(() => props.survey.id, () => points.load(() => surveys.points(props.survey.id)), { immediate: true });
watch(() => [props.survey.id, route.query.inicio, route.query.fim, route.query.pontoColetaId], fetchResults, { immediate: true });
</script>
<template>
  <section class="survey-analysis" aria-labelledby="results-heading">
    <header class="section-heading"><div><h2 id="results-heading">Resultados da pesquisa</h2><p class="muted">Uma leitura das experiências compartilhadas.</p></div><div class="section-actions"><AppButton variant="secondary" :loading="exporting" :disabled="results.loading.value || !result || !!results.error.value || Object.keys(filters.errors.value).length > 0" @click="download(survey.id, filters.applied.value)"><Download :size="16" aria-hidden="true" /> Exportar CSV</AppButton><AppButton variant="secondary" @click="openFeedbacks()">Feedbacks <ArrowRight :size="16" aria-hidden="true" /></AppButton></div></header>
    <AnalyticsFilters :fields="filters.fields" :errors="filters.errors.value" :points="points.data.value || []" :points-loading="points.loading.value" :busy="results.loading.value" @apply="filters.apply" @clear="filters.clear" />
    <FormNotice v-if="points.error.value">{{ points.error.value }} <button class="inline-retry" type="button" @click="points.load(() => surveys.points(survey.id))">Recarregar pontos</button></FormNotice>
    <FormNotice v-if="exportError">{{ exportError }}</FormNotice><p v-if="exportSuccess" class="analysis-download-status" role="status">{{ exportSuccess }}</p>
    <ResourceState v-if="results.error.value || !result" :loading="results.loading.value" :error="results.error.value" @retry="fetchResults" />
    <template v-else>
      <p v-if="results.loading.value" class="analysis-refresh" role="status">Atualizando resultados…</p>
      <EmptyState v-if="!result.totalRespostas" compact :title="filters.hasFilters.value ? 'Nenhuma resposta com estes filtros.' : 'Sua pesquisa ainda não recebeu respostas.'" :description="emptyDescription"><AppButton v-if="filters.hasFilters.value" variant="secondary" @click="filters.clear">Limpar filtros</AppButton><AppButton v-else variant="secondary" @click="router.replace({ query: { aba: emptyDestination } })">{{ emptyDestination === 'perguntas' ? 'Ver perguntas' : 'Ver pontos de coleta' }}</AppButton></EmptyState>
      <template v-else>
        <div class="analysis-total"><span>Total de respostas</span><strong>{{ count(result.totalRespostas) }}</strong><span>{{ filters.hasFilters.value ? 'No período e origem selecionados' : 'Em toda a pesquisa' }}</span></div>
        <section class="analytics-section"><header class="section-heading"><h2>Respostas ao longo do tempo</h2><span>Por dia · UTC</span></header><ResponseTimeline :rows="result.respostasPorDia" :filters="filters.applied.value" /></section>
        <section class="analytics-section"><header class="section-heading"><h2>Resultados por pergunta</h2><span>{{ count(result.perguntas.length) }} perguntas</span></header><div class="analysis-questions"><QuestionMetrics v-for="question in result.perguntas" :key="question.id" :question="question" detailed @feedbacks="openFeedbacks" /></div></section>
      </template>
    </template>
  </section>
</template>
