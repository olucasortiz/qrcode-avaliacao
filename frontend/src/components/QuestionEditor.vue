<script setup>
import { computed, nextTick, ref } from 'vue';
import { ArrowDown, ArrowUp, Eye, Pencil, Plus, Trash2 } from '@lucide/vue';
import { questions, swapQuestionOrder } from '../services/questions.js';
import { surveys } from '../services/surveys.js';
import { nextQuestionOrder } from '../lib/questionSchemas.js';
import { questionTypes } from '../lib/surveySchemas.js';
import AppButton from './AppButton.vue';
import AppModal from './AppModal.vue';
import EmptyState from './EmptyState.vue';
import FormNotice from './FormNotice.vue';
import QuestionForm from './QuestionForm.vue';
import QuestionPreview from './QuestionPreview.vue';

const props = defineProps({ survey: { type: Object, required: true }, items: { type: Array, required: true } });
const emit = defineEmits(['change', 'busy']);
const draft = computed(() => props.survey.status === 'RASCUNHO');
const modal = ref('');
const open = ref(false);
const selected = ref(null);
const busy = ref(false);
const error = ref('');
const success = ref('');
const refreshRequired = ref(false);
const nextOrder = computed(() => nextQuestionOrder(props.items));
function setBusy(value) { busy.value = value; emit('busy', value); }
function show(type, item = null) { error.value = ''; selected.value = item; modal.value = type; open.value = true; }
async function save(body) { return selected.value ? questions.update(props.survey.id, selected.value.id, body) : questions.create(props.survey.id, body); }
function saved(item) {
  setBusy(false);
  const items = props.items.filter(question => question.id !== item.id).concat(item).sort((a, b) => a.ordem - b.ordem);
  emit('change', items); open.value = false; success.value = 'Pergunta salva.';
}
async function refresh() {
  try { emit('change', await surveys.questions(props.survey.id)); refreshRequired.value = false; return true; }
  catch (failure) { refreshRequired.value = true; error.value = `N\u00e3o foi poss\u00edvel atualizar a ordem. ${failure.message}`; return false; }
}
async function reorder(index, direction) {
  if (busy.value) return;
  setBusy(true); error.value = ''; success.value = '';
  const id = props.items[index].id;
  try { await swapQuestionOrder(props.survey.id, props.items, props.items[index], props.items[index + direction]); success.value = 'Ordem atualizada.'; }
  catch (failure) { error.value = failure.message; }
  finally { await refresh(); setBusy(false); await nextTick(); document.getElementById(`edit-question-${id}`)?.focus(); }
}
async function remove() {
  if (busy.value) return;
  setBusy(true); error.value = '';
  try { await questions.remove(props.survey.id, selected.value.id); emit('change', props.items.filter(item => item.id !== selected.value.id)); open.value = false; success.value = 'Pergunta exclu\u00edda.'; }
  catch (failure) { error.value = failure.message; }
  finally { setBusy(false); }
}
async function retryOrder() { if (busy.value) return; setBusy(true); await refresh(); setBusy(false); }
</script>
<template>
  <section class="question-editor" aria-labelledby="editor-heading" :aria-busy="busy">
    <header class="section-heading editor-heading"><div><h2 id="editor-heading">Perguntas</h2><p class="muted">{{ items.length }} {{ items.length === 1 ? 'pergunta' : 'perguntas' }} <span aria-hidden="true">&#x00b7;</span> {{ draft ? 'Em prepara\u00e7\u00e3o' : 'Somente leitura' }}</p></div><div class="section-actions"><AppButton v-if="items.length" variant="secondary" :disabled="busy || refreshRequired" @click="show('preview')"><Eye :size="17" aria-hidden="true" /> Pr&#x00e9;via</AppButton><AppButton v-if="draft" :disabled="busy || refreshRequired || nextOrder > 10000" @click="show('edit')"><Plus :size="17" aria-hidden="true" /> Adicionar pergunta</AppButton></div></header>
    <FormNotice v-if="error && !open">{{ error }} <button v-if="refreshRequired" type="button" class="inline-retry" :disabled="busy" @click="retryOrder">Atualizar lista</button></FormNotice>
    <FormNotice v-if="success && !open" tone="info">{{ success }}</FormNotice>
    <p v-if="!draft" class="section-context">{{ survey.status === 'ATIVA' ? 'A pesquisa j\u00e1 est\u00e1 publicada. As perguntas foram preservadas para manter a consist\u00eancia das respostas.' : 'Pesquisa encerrada. As perguntas e o hist\u00f3rico est\u00e3o preservados.' }}</p>
    <EmptyState v-if="!items.length" compact eyebrow="DESENHE SUA ESCUTA" title="O que voc&#x00ea; quer descobrir?" description="Adicione a primeira pergunta para preparar sua pesquisa."><AppButton v-if="draft" variant="secondary" :disabled="busy" @click="show('edit')"><Plus :size="17" aria-hidden="true" /> Criar primeira pergunta</AppButton></EmptyState>
    <ol v-else class="question-summary question-editor__list"><li v-for="(question, index) in items" :key="question.id"><span class="question-number">{{ String(index + 1).padStart(2, '0') }}</span><div class="question-editor__copy"><h3>{{ question.texto }}</h3><p>{{ questionTypes[question.tipo] }} <span aria-hidden="true">&#x00b7;</span> {{ question.obrigatoria ? 'Obrigat\u00f3ria' : 'Opcional' }}</p><ul v-if="question.opcoes.length"><li v-for="option in question.opcoes" :key="option.id">{{ option.texto }}</li></ul></div><div v-if="draft" class="row-actions"><button class="icon-button" type="button" :disabled="busy || refreshRequired || index === 0" :aria-label="`Mover pergunta ${index + 1} para cima`" title="Mover para cima" @click="reorder(index, -1)"><ArrowUp :size="17" aria-hidden="true" /></button><button class="icon-button" type="button" :disabled="busy || refreshRequired || index === items.length - 1" :aria-label="`Mover pergunta ${index + 1} para baixo`" title="Mover para baixo" @click="reorder(index, 1)"><ArrowDown :size="17" aria-hidden="true" /></button><button :id="`edit-question-${question.id}`" class="icon-button" type="button" :disabled="busy || refreshRequired" :aria-label="`Editar pergunta ${index + 1}`" title="Editar pergunta" @click="show('edit', question)"><Pencil :size="17" aria-hidden="true" /></button><button class="icon-button danger-icon" type="button" :disabled="busy || refreshRequired" :aria-label="`Excluir pergunta ${index + 1}`" title="Excluir pergunta" @click="show('delete', question)"><Trash2 :size="17" aria-hidden="true" /></button></div></li></ol>
    <AppModal :open="open" :title="modal === 'preview' ? 'Pr\u00e9via da pesquisa' : modal === 'delete' ? 'Excluir pergunta?' : selected ? 'Editar pergunta' : 'Nova pergunta'" :busy="busy" @close="open = false; setBusy(false);">
      <QuestionForm v-if="modal === 'edit'" :question="selected" :order="nextOrder" :save="save" @saved="saved" @busy="setBusy" @cancel="open = false" />
      <QuestionPreview v-else-if="modal === 'preview'" :questions="items" />
      <template v-else><p class="confirmation-copy">A pergunta <strong>{{ selected?.texto }}</strong> e suas op&#x00e7;&#x00f5;es ser&#x00e3;o exclu&#x00ed;das do rascunho. Esta a&#x00e7;&#x00e3;o n&#x00e3;o pode ser desfeita.</p><FormNotice v-if="error">{{ error }}</FormNotice><div class="form-actions"><AppButton variant="secondary" :disabled="busy" @click="open = false">Cancelar</AppButton><AppButton class="button--danger" :loading="busy" @click="remove"><Trash2 :size="17" aria-hidden="true" /> Excluir pergunta</AppButton></div></template>
    </AppModal>
  </section>
</template>
