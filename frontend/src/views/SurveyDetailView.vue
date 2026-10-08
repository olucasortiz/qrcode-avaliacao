<script setup>
import { computed, ref, watch } from 'vue';
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

const route = useRoute();
const router = useRouter();
const { data, loading, error, load } = useResource();
const modal = ref('');
const modalOpen = ref(false);
const saving = ref(false);
const actionError = ref('');
const success = ref('');
const problem = computed(() => data.value ? publicationProblem(data.value.questions) : '');
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
      <section class="analytics-section"><header class="section-heading"><h2>Perguntas</h2><span>{{ count(data.questions.length) }} {{ data.questions.length === 1 ? 'pergunta' : 'perguntas' }}</span></header>
        <ResourceState v-if="!data.questions.length" title="Esta pesquisa ainda n&#x00e3;o tem perguntas." />
        <ol v-else class="question-summary"><li v-for="(question, index) in data.questions" :key="question.id"><span class="question-number">{{ String(index + 1).padStart(2, '0') }}</span><div><h3>{{ question.texto }}</h3><p>{{ questionTypes[question.tipo] }} <span aria-hidden="true">&#x00b7;</span> {{ question.obrigatoria ? 'Obrigat\u00f3ria' : 'Opcional' }}</p><ul v-if="question.opcoes.length"><li v-for="option in question.opcoes" :key="option.id">{{ option.texto }}</li></ul></div></li></ol>
      </section>
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
