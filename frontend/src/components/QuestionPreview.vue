<script setup>
import { computed, nextTick, ref } from 'vue';
import { ArrowLeft, ArrowRight, Check, Star } from '@lucide/vue';
import AppButton from './AppButton.vue';
const props = defineProps({ questions: { type: Array, required: true } });
const index = ref(0);
const answers = ref({});
const error = ref('');
const heading = ref(null);
const question = computed(() => props.questions[index.value]);
const value = computed({ get: () => answers.value[question.value.id], set: answer => { answers.value[question.value.id] = answer; error.value = ''; } });
async function navigate(direction, skip = false) {
  if (direction > 0 && !skip && question.value.obrigatoria && (value.value === undefined || (question.value.tipo === 'TEXTO' && !value.value?.trim()))) { error.value = 'Responda esta pergunta para continuar.'; return; }
  error.value = '';
  index.value += direction;
  await nextTick(); heading.value?.focus();
}
</script>
<template>
  <div class="survey-preview">
    <p class="preview-disclaimer">Pr&#x00e9;via local <span aria-hidden="true">&#x00b7;</span> Nenhuma resposta ser&#x00e1; enviada.</p>
    <template v-if="question">
      <div class="preview-progress"><span>{{ index + 1 }} / {{ questions.length }}</span><progress :value="index + 1" :max="questions.length" aria-label="Progresso da pr&#x00e9;via"></progress></div>
      <Transition name="content" mode="out-in"><section :key="question.id" class="preview-question">
        <p class="eyebrow">{{ question.obrigatoria ? 'OBRIGAT\u00d3RIA' : 'OPCIONAL' }}</p><h3 ref="heading" tabindex="-1">{{ question.texto }}</h3>
        <fieldset class="preview-controls" :aria-label="question.texto" :aria-describedby="error ? 'preview-error' : undefined"><legend class="sr-only">{{ question.texto }}</legend>
          <div v-if="question.tipo === 'ESTRELAS'" class="star-controls"><label v-for="rating in 5" :key="rating" :title="`${rating} ${rating === 1 ? 'estrela' : 'estrelas'}`"><input v-model="value" type="radio" name="preview-stars" :value="rating" :aria-label="`${rating} ${rating === 1 ? 'estrela' : 'estrelas'}`" /><Star :size="30" aria-hidden="true" :class="{ selected: value >= rating }" /></label></div>
          <template v-else-if="question.tipo === 'NPS'"><div class="nps-controls"><label v-for="rating in 11" :key="rating"><input v-model="value" type="radio" name="preview-nps" :value="rating - 1" :aria-label="`Nota ${rating - 1}`" /><span>{{ rating - 1 }}</span></label></div><div class="scale-captions"><span>Nada prov&#x00e1;vel</span><span>Muito prov&#x00e1;vel</span></div></template>
          <div v-else-if="question.tipo === 'SIM_NAO'" class="choice-controls"><label v-for="choice in [{ label: 'Sim', value: true }, { label: 'N\u00e3o', value: false }]" :key="choice.label"><input v-model="value" type="radio" name="preview-boolean" :value="choice.value" /><span>{{ choice.label }}</span><Check :size="18" aria-hidden="true" /></label></div>
          <div v-else-if="question.tipo === 'TEXTO'" class="form-field"><label for="preview-text">Sua resposta</label><textarea id="preview-text" v-model="value" rows="4" maxlength="2000"></textarea><p class="muted">{{ value?.length || 0 }} / 2000</p></div>
          <div v-else class="choice-controls"><label v-for="option in question.opcoes" :key="option.id || option.ordem"><input v-model="value" type="radio" :value="option.id || option.ordem" name="preview-option" /><span>{{ option.texto }}</span><Check :size="18" aria-hidden="true" /></label></div>
        </fieldset>
        <p v-if="error" id="preview-error" role="alert" class="field-error">{{ error }}</p>
      </section></Transition>
      <div class="preview-actions"><button type="button" class="icon-button" title="Pergunta anterior" aria-label="Pergunta anterior" :disabled="index === 0" @click="navigate(-1)"><ArrowLeft :size="20" aria-hidden="true" /></button><AppButton v-if="!question.obrigatoria" variant="secondary" @click="navigate(1, true)">Pular</AppButton><AppButton @click="navigate(1)">{{ index === questions.length - 1 ? 'Concluir pr\u00e9via' : 'Continuar' }} <ArrowRight :size="17" aria-hidden="true" /></AppButton></div>
    </template>
    <section v-else class="preview-complete"><Check :size="30" aria-hidden="true" /><h3 ref="heading" tabindex="-1">Pr&#x00e9;via conclu&#x00ed;da.</h3><p>As sele&#x00e7;&#x00f5;es ficaram apenas nesta pr&#x00e9;via.</p><AppButton variant="secondary" @click="navigate(-1)"><ArrowLeft :size="17" aria-hidden="true" /> Revisar respostas</AppButton></section>
  </div>
</template>
