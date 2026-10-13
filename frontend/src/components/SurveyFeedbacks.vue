<script setup>
import { computed, toRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Download } from '@lucide/vue';
import { useResource } from '../composables/useResource.js';
import { useAnalyticsFilters } from '../composables/useAnalyticsFilters.js';
import { useCsvExport } from '../composables/useCsvExport.js';
import { analytics } from '../services/analytics.js';
import { surveys } from '../services/surveys.js';
import { feedbackDate, feedbackValue, filtersFromQuery } from '../lib/analytics.js';
import { questionTypes } from '../lib/surveySchemas.js';
import AnalyticsFilters from './AnalyticsFilters.vue';
import PaginationControl from './PaginationControl.vue';
import EmptyState from './EmptyState.vue';
import ResourceState from './ResourceState.vue';
import AppButton from './AppButton.vue';
import FormNotice from './FormNotice.vue';
import '../styles/analytics.css';
const props = defineProps({ survey: Object, questions: Array });
const route = useRoute();
const filters = useAnalyticsFilters(true, toRef(props, 'questions'));
const points = useResource(); const resource = useResource();
const data = computed(() => resource.data.value);
const { exporting, exportError, exportSuccess, download } = useCsvExport();
function fetchFeedbacks() {
  if (!filters.validate(filtersFromQuery(route.query))) return;
  return resource.load(() => analytics.feedbacks(props.survey.id, { ...filters.applied.value, pagina: filters.page.value, limite: filters.limit.value }));
}
watch(() => props.survey.id, () => points.load(() => surveys.points(props.survey.id)), { immediate: true });
watch(() => [props.survey.id, route.query], fetchFeedbacks, { immediate: true });
</script>
<template>
  <section class="survey-feedbacks" aria-labelledby="feedbacks-heading">
    <header class="section-heading"><div><h2 id="feedbacks-heading">Feedbacks individuais</h2><p class="muted">Cada resposta, com suas próprias palavras.</p></div><AppButton variant="secondary" :loading="exporting" :disabled="resource.loading.value || !data || !!resource.error.value || Object.keys(filters.errors.value).length > 0" @click="download(survey.id, filters.applied.value)"><Download :size="16" aria-hidden="true" /> Exportar CSV</AppButton></header>
    <AnalyticsFilters :fields="filters.fields" :errors="filters.errors.value" :points="points.data.value || []" :questions="questions" feedback :points-loading="points.loading.value" :busy="resource.loading.value" @apply="filters.apply" @clear="filters.clear" />
    <FormNotice v-if="points.error.value">{{ points.error.value }} <button class="inline-retry" type="button" @click="points.load(() => surveys.points(survey.id))">Recarregar pontos</button></FormNotice>
    <FormNotice v-if="exportError">{{ exportError }}</FormNotice><p v-if="exportSuccess" class="analysis-download-status" role="status">{{ exportSuccess }}</p>
    <ResourceState v-if="resource.error.value || !data" :loading="resource.loading.value" :error="resource.error.value" @retry="fetchFeedbacks" />
    <template v-else>
      <p v-if="resource.loading.value" class="analysis-refresh" role="status">Atualizando feedbacks…</p>
      <EmptyState v-if="!data.itens.length" compact :title="filters.hasFilters.value ? 'Nenhum feedback com estes filtros.' : data.total ? 'Nenhum feedback nesta página.' : 'Ainda não há feedbacks para ler.'" :description="filters.hasFilters.value ? 'Altere o período, a origem ou a nota. Você também pode limpar todos os filtros.' : data.total ? 'Volte à primeira página para consultar as respostas.' : survey.status === 'ENCERRADA' ? 'Esta pesquisa está encerrada e não tem respostas registradas.' : 'Quando alguém responder à pesquisa, a experiência completa ficará disponível aqui.'"><AppButton v-if="filters.hasFilters.value" variant="secondary" @click="filters.clear">Limpar filtros</AppButton><AppButton v-else-if="data.total" variant="secondary" @click="filters.changePage(1)">Ir para primeira página</AppButton></EmptyState>
      <ol v-else class="feedback-list">
        <li v-for="(feedback, i) in data.itens" :key="feedback.id" class="feedback-entry">
          <article :aria-labelledby="`feedback-heading-${feedback.id}`">
            <header class="feedback-entry-heading"><div><h3 :id="`feedback-heading-${feedback.id}`">Resposta {{ (data.pagina - 1) * data.limite + i + 1 }}</h3><time :datetime="feedback.data">{{ feedbackDate(feedback.data) }}</time></div><span class="feedback-origin">{{ feedback.origem?.nome || 'Sem origem' }}</span></header>
            <p class="feedback-survey-name">{{ survey.titulo }}</p>
            <dl class="feedback-answers"><div v-for="answer in feedback.respostas" :key="answer.pergunta.id"><dt><span class="feedback-answer-type">{{ questionTypes[answer.pergunta.tipo] }}</span>{{ answer.pergunta.texto }}</dt><dd :class="{ 'feedback-answer-text': answer.pergunta.tipo === 'TEXTO' }">{{ feedbackValue(answer) }}</dd></div></dl>
            <p v-if="!feedback.respostas.length" class="muted">Todas as perguntas opcionais foram puladas.</p>
          </article>
        </li>
      </ol>
      <div v-if="data.total" class="feedback-pagination"><PaginationControl :page="data.pagina" :pages="data.totalPaginas" :total="data.total" :busy="resource.loading.value" singular="feedback" plural="feedbacks" @change="filters.changePage" /><div class="filter-field"><label for="feedback-limit">Respostas por página</label><select id="feedback-limit" :value="filters.limit.value" :disabled="resource.loading.value" @change="filters.changeLimit($event.target.value)"><option v-for="limit in [10, 20, 50, 100]" :key="limit" :value="limit">{{ limit }}</option></select></div></div>
    </template>
  </section>
</template>
