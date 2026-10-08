<script setup>
import { watch } from 'vue';
import { Check, Plus } from '@lucide/vue';
import AppButton from './AppButton.vue';
import FormField from './FormField.vue';
import FormNotice from './FormNotice.vue';
import { useAuthForm } from '../composables/useAuthForm.js';
import { createSurveySchema, editSurveySchema } from '../lib/surveySchemas.js';
const props = defineProps({ survey: Object, save: { type: Function, required: true } });
const emit = defineEmits(['saved', 'cancel', 'busy']);
const { values, errors, error, pending, formElement, validateField, edited, submit } = useAuthForm(
  props.survey ? editSurveySchema : createSurveySchema,
  { titulo: props.survey?.titulo || '', descricao: props.survey?.descricao || '', slug: props.survey?.slug || '' },
  async data => emit('saved', await props.save(data)));
watch(pending, value => emit('busy', value));
</script>
<template>
  <form ref="formElement" class="survey-form" novalidate :aria-busy="pending" @submit.prevent="submit">
    <FormNotice v-if="error">{{ error }}</FormNotice>
    <fieldset :disabled="pending" class="form-stack survey-form__fields">
      <FormField id="survey-title" v-model="values.titulo" label="T&#x00ed;tulo" maxlength="200" :error="errors.titulo" @blur="validateField('titulo')" @edit="edited('titulo')" />
      <FormField id="survey-description" v-model="values.descricao" type="textarea" label="Descri&#x00e7;&#x00e3;o (opcional)" maxlength="2000" :error="errors.descricao" @blur="validateField('descricao')" @edit="edited('descricao')" />
      <FormField id="survey-slug" v-model="values.slug" :label="survey ? 'Slug p\u00fablico' : 'Slug p\u00fablico (opcional)'" maxlength="200" :error="errors.slug" autocapitalize="none" spellcheck="false" @blur="validateField('slug')" @edit="edited('slug')" />
    </fieldset>
    <div class="form-actions"><AppButton variant="secondary" :disabled="pending" @click="emit('cancel')">Cancelar</AppButton><AppButton type="submit" :loading="pending"><component :is="survey ? Check : Plus" :size="17" aria-hidden="true" />{{ survey ? 'Salvar altera\u00e7\u00f5es' : 'Criar pesquisa' }}</AppButton></div>
  </form>
</template>
