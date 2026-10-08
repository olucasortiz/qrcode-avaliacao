<script setup>
import { watch } from 'vue';
import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from '@lucide/vue';
import AppButton from './AppButton.vue';
import FormField from './FormField.vue';
import FormNotice from './FormNotice.vue';
import { useAuthForm } from '../composables/useAuthForm.js';
import { questionSchema } from '../lib/questionSchemas.js';
import { questionTypes } from '../lib/surveySchemas.js';

const props = defineProps({ question: Object, order: Number, save: { type: Function, required: true } });
const emit = defineEmits(['saved', 'cancel', 'busy']);
const { values, errors, error, pending, formElement, validateField, edited, submit } = useAuthForm(questionSchema,
  { texto: props.question?.texto || '', tipo: props.question?.tipo || 'ESTRELAS', obrigatoria: props.question?.obrigatoria ?? true,
    ordem: props.question?.ordem ?? props.order, opcoes: props.question?.opcoes.map(option => ({ texto: option.texto, ordem: option.ordem })) || [] },
  async body => emit('saved', await props.save(body)));
watch(pending, value => emit('busy', value));
let choiceOptions = values.opcoes;
watch(() => values.tipo, type => {
  if (type === 'MULTIPLA_ESCOLHA') values.opcoes = choiceOptions.length ? choiceOptions : [{ texto: '', ordem: 0 }, { texto: '', ordem: 1 }];
  else { choiceOptions = values.opcoes.length ? values.opcoes : choiceOptions; values.opcoes = []; }
  errors.value = {}; error.value = '';
});
function normalizeOptions() { values.opcoes.forEach((option, index) => { option.ordem = index; }); errors.value = {}; error.value = ''; }
function moveOption(index, direction) {
  const target = index + direction;
  [values.opcoes[index], values.opcoes[target]] = [values.opcoes[target], values.opcoes[index]];
  normalizeOptions();
}
function addOption() { values.opcoes.push({ texto: '', ordem: values.opcoes.length }); normalizeOptions(); }
function removeOption(index) { values.opcoes.splice(index, 1); normalizeOptions(); }
</script>
<template>
  <form ref="formElement" class="question-form" novalidate :aria-busy="pending" @submit.prevent="submit">
    <FormNotice v-if="error">{{ error }}</FormNotice>
    <fieldset class="form-stack survey-form__fields" :disabled="pending">
      <FormField id="question-text" v-model="values.texto" type="textarea" label="Pergunta" maxlength="2000" :error="errors.texto" @blur="validateField('texto')" @edit="edited('texto')" />
      <div class="filter-field"><label for="question-type">Tipo de resposta</label><select id="question-type" v-model="values.tipo"><option v-for="(label, value) in questionTypes" :key="value" :value="value">{{ label }}</option></select></div>
      <label class="checkbox-control"><input v-model="values.obrigatoria" type="checkbox" /><span>Resposta obrigat&#x00f3;ria</span></label>
      <section v-if="values.tipo === 'MULTIPLA_ESCOLHA'" class="option-editor" aria-labelledby="options-heading">
        <header class="section-heading"><h3 id="options-heading">Op&#x00e7;&#x00f5;es de resposta</h3><span>{{ values.opcoes.length }} / 100</span></header>
        <p v-if="errors.opcoes" class="field-error" role="alert">{{ errors.opcoes }}</p>
        <ol><li v-for="(option, index) in values.opcoes" :key="index"><FormField :id="`question-option-${index}`" v-model="option.texto" :label="`Op\u00e7\u00e3o ${index + 1}`" maxlength="500" :error="errors[`opcoes.${index}.texto`]" @edit="edited(`opcoes.${index}.texto`)" /><div class="row-actions"><button type="button" class="icon-button" :aria-label="`Mover op\u00e7\u00e3o ${index + 1} para cima`" title="Mover para cima" :disabled="index === 0" @click="moveOption(index, -1)"><ArrowUp :size="16" aria-hidden="true" /></button><button type="button" class="icon-button" :aria-label="`Mover op\u00e7\u00e3o ${index + 1} para baixo`" title="Mover para baixo" :disabled="index === values.opcoes.length - 1" @click="moveOption(index, 1)"><ArrowDown :size="16" aria-hidden="true" /></button><button type="button" class="icon-button danger-icon" :aria-label="`Remover op\u00e7\u00e3o ${index + 1}`" title="Remover op&#x00e7;&#x00e3;o" @click="removeOption(index)"><Trash2 :size="16" aria-hidden="true" /></button></div></li></ol>
        <AppButton variant="secondary" :disabled="values.opcoes.length >= 100" @click="addOption"><Plus :size="16" aria-hidden="true" /> Adicionar op&#x00e7;&#x00e3;o</AppButton>
      </section>
    </fieldset>
    <div class="form-actions"><AppButton variant="secondary" :disabled="pending" @click="emit('cancel')">Cancelar</AppButton><AppButton type="submit" :loading="pending"><Check :size="17" aria-hidden="true" /> Salvar pergunta</AppButton></div>
  </form>
</template>
