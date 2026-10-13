<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { ArrowLeft, Pencil, Radio, Square, Trash2 } from '@lucide/vue';
import { useResource } from '../composables/useResource.js';
import { surveys } from '../services/surveys.js';
import { publicationProblem, questionTypes } from '../lib/surveySchemas.js';
import { count, dateLabel } from '../lib/format.js';
import AppButton from '../components/AppButton.vue';
import AppModal from '../components/AppModal.vue';
import SurveyForm from '../components/SurveyForm.vue';
import FormNotice from '../components/FormNotice.vue';
import ResourceState from '../components/ResourceState.vue';
import StatusBadge from '../components/StatusBadge.vue';

import QuestionEditor from '../components/QuestionEditor.vue';
import PointManager from '../components/PointManager.vue';
import SurveyResults from '../components/SurveyResults.vue';
import SurveyFeedbacks from '../components/SurveyFeedbacks.vue';

const route = useRoute();
const router = useRouter();
const { data, loading, error, load } = useResource();
const modal = ref('');
const modalOpen = ref(false);
const saving = ref(false);
const actionError = ref('');
const success = ref('');
const pointsCount = ref(null);
const tabs = ['perguntas', 'pontos', 'resultados', 'feedbacks'];
const activeTab = computed(() => tabs.includes(route.query.aba) ? route.query.aba : 'perguntas');
async function navigateTabs(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const position = tabs.indexOf(activeTab.value);
  const tab = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(position + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
  await selectTab(tab);
  await nextTick();
  document.getElementById(`tab-${tab}`)?.focus();
}

function selectTab(tab) {
  return router.replace({
    name: 'survey-detail',
    params: { id: route.params.id },
    query: { ...route.query, aba: tab === 'perguntas' ? undefined : tab },
  });
}

function onQuestionsChanged(updatedQuestions) {
  if (data.value) {
    data.value = { ...data.value, questions: updatedQuestions };
  }
}

const problem = computed(() => (data.value ? publicationProblem(data.value.questions) : ''));
const modalTitle = computed(() => ({ edit: 'Editar pesquisa', publish: 'Publicar pesquisa?', close: 'Encerrar pesquisa?', delete: 'Excluir rascunho?' })[modal.value] || 'Pesquisa');
async function fetchDetail() {
  modalOpen.value = false; success.value = '';
  await load(async () => {
    if (!z.uuid().safeParse(route.params.id).success) throw new Error('Pesquisa n\u00e3o encontrada.');
    const survey = await surveys.get(route.params.id);
    const questions = await surveys.questions(survey.id);
    return { survey, questions };
  });
}
function open(type) { actionError.value = ''; modal.value = type; modalOpen.value = true; }
function edited(survey) { data.value = { ...data.value, survey }; modalOpen.value = false; success.value = 'Altera\u00e7\u00f5es salvas.'; }
async function confirm() {
  if (saving.value) return;
  saving.value = true; actionError.value = '';
  const id = data.value.survey.id;
  try {
    if (modal.value === 'publish') {
      if (problem.value) { actionError.value = problem.value; return; }
      const result = await surveys.publish(id);
      data.value = { ...data.value, survey: { ...data.value.survey, ...result } };
      success.value = 'Pesquisa publicada.';
    } else if (modal.value === 'close') {
      const survey = await surveys.update(id, { status: 'ENCERRADA' });
      data.value = { ...data.value, survey }; success.value = 'Pesquisa encerrada.';
    } else if (modal.value === 'delete') {
      await surveys.remove(id); modalOpen.value = false;
      await router.replace({ name: 'surveys' }); return;
    }
    modalOpen.value = false;
  } catch (failure) { actionError.value = failure.message; }
  finally { saving.value = false; }
}
watch(() => route.params.id, fetchDetail, { immediate: true });
</script>
<template>
  <section class="admin-view survey-detail" aria-labelledby="detail-heading">
    <RouterLink :to="{ name: 'surveys' }" class="back-link"><ArrowLeft :size="16" aria-hidden="true" /> Pesquisas</RouterLink>
    <ResourceState v-if="error || !data" :loading="loading" :error="error" @retry="fetchDetail" />
    <template v-else>
      <header class="view-heading detail-heading"><div><StatusBadge :status="data.survey.status" /><h1 id="detail-heading">{{ data.survey.titulo }}</h1></div>
        <div class="detail-actions" v-if="data.survey.status === 'RASCUNHO'"><button class="icon-button" type="button" title="Editar pesquisa" aria-label="Editar pesquisa" @click="open('edit')"><Pencil :size="18" aria-hidden="true" /></button><button class="icon-button danger-icon" type="button" title="Excluir rascunho" aria-label="Excluir rascunho" @click="open('delete')"><Trash2 :size="18" aria-hidden="true" /></button><AppButton @click="open('publish')"><Radio :size="17" aria-hidden="true" /> Publicar</AppButton></div>
        <AppButton v-else-if="data.survey.status === 'ATIVA'" variant="secondary" @click="open('close')"><Square :size="15" aria-hidden="true" /> Encerrar</AppButton>
      </header>
      <FormNotice v-if="success" tone="info">{{ success }}</FormNotice>
      <p v-if="data.survey.descricao" class="survey-description">{{ data.survey.descricao }}</p>
      <dl class="survey-metadata"><div><dt>Slug p&#x00fa;blico</dt><dd>{{ data.survey.slug }}</dd></div><div><dt>Criada em</dt><dd>{{ dateLabel(data.survey.createdAt) }}</dd></div><div><dt>Atualizada em</dt><dd>{{ dateLabel(data.survey.updatedAt) }}</dd></div></dl>

      <nav class="detail-tabs" aria-label="Se&#x00e7;&#x00f5;es da pesquisa" role="tablist" @keydown="navigateTabs">
        <button
          id="tab-perguntas"
          type="button"
          class="detail-tab"
          :class="{ 'detail-tab--active': activeTab === 'perguntas' }"
          :aria-selected="activeTab === 'perguntas'"
          aria-controls="panel-perguntas"
          role="tab"
          :tabindex="activeTab === 'perguntas' ? 0 : -1"
          @click="selectTab('perguntas')"
        >
          Perguntas
          <span class="tab-badge">{{ data.questions.length }}</span>
        </button>
        <button
          id="tab-pontos"
          type="button"
          class="detail-tab"
          :class="{ 'detail-tab--active': activeTab === 'pontos' }"
          :aria-selected="activeTab === 'pontos'"
          aria-controls="panel-pontos"
          role="tab"
          :tabindex="activeTab === 'pontos' ? 0 : -1"
          @click="selectTab('pontos')"
        >
          Pontos de coleta
          <span v-if="pointsCount !== null" class="tab-badge">{{ pointsCount }}</span>
        </button>
        <button v-for="tab in ['resultados', 'feedbacks']" :id="`tab-${tab}`" :key="tab" type="button" class="detail-tab" :class="{ 'detail-tab--active': activeTab === tab }" :aria-selected="activeTab === tab" :aria-controls="`panel-${tab}`" :tabindex="activeTab === tab ? 0 : -1" role="tab" @click="selectTab(tab)">{{ tab === 'resultados' ? 'Resultados' : 'Feedbacks' }}</button>
      </nav>

      <div
        id="panel-perguntas"
        v-show="activeTab === 'perguntas'"
        role="tabpanel"
        aria-labelledby="tab-perguntas"
      >
        <QuestionEditor
          :survey="data.survey"
          :items="data.questions"
          @change="onQuestionsChanged"
        />
      </div>
      <div v-if="activeTab === 'resultados'" id="panel-resultados" role="tabpanel" aria-labelledby="tab-resultados"><SurveyResults :key="data.survey.id" :survey="data.survey" :questions="data.questions" /></div>
      <div v-if="activeTab === 'feedbacks'" id="panel-feedbacks" role="tabpanel" aria-labelledby="tab-feedbacks"><SurveyFeedbacks :key="data.survey.id" :survey="data.survey" :questions="data.questions" /></div>

      <div
        id="panel-pontos"
        v-show="activeTab === 'pontos'"
        role="tabpanel"
        aria-labelledby="tab-pontos"
      >
        <PointManager
          :survey="data.survey"
          @count="pointsCount = $event"
        />
      </div>
    </template>
    <AppModal :open="modalOpen" :title="modalTitle" :busy="saving" @close="modalOpen = false">
      <SurveyForm v-if="modal === 'edit' && data" :survey="data.survey" :save="body => surveys.update(data.survey.id, body)" @saved="edited" @cancel="modalOpen = false" @busy="saving = $event" />
      <template v-else-if="data">
        <p class="confirmation-copy" v-if="modal === 'publish'">A pesquisa <strong>{{ data.survey.titulo }}</strong> ficar&#x00e1; dispon&#x00ed;vel para receber respostas. Ap&#x00f3;s publicar, ela n&#x00e3;o poder&#x00e1; ser editada.</p>
        <p class="confirmation-copy" v-else-if="modal === 'close'">A pesquisa <strong>{{ data.survey.titulo }}</strong> deixar&#x00e1; de receber respostas. O hist&#x00f3;rico ser&#x00e1; preservado. N&#x00e3;o ser&#x00e1; poss&#x00ed;vel reativ&#x00e1;-la.</p>
        <p class="confirmation-copy" v-else>O rascunho <strong>{{ data.survey.titulo }}</strong> e suas perguntas ser&#x00e3;o exclu&#x00ed;dos. Esta a&#x00e7;&#x00e3;o n&#x00e3;o pode ser desfeita.</p>
        <FormNotice v-if="modal === 'publish' && problem">{{ problem }}</FormNotice>
        <FormNotice v-if="actionError">{{ actionError }}</FormNotice>
        <div class="form-actions"><AppButton variant="secondary" :disabled="saving" @click="modalOpen = false">Cancelar</AppButton><AppButton :loading="saving" :disabled="modal === 'publish' && !!problem" :class="{ 'button--danger': modal === 'delete' }" @click="confirm"><component :is="modal === 'publish' ? Radio : modal === 'close' ? Square : Trash2" :size="17" aria-hidden="true" />{{ modal === 'publish' ? 'Publicar pesquisa' : modal === 'close' ? 'Encerrar pesquisa' : 'Excluir rascunho' }}</AppButton></div>
      </template>
    </AppModal>
  </section>
</template>
