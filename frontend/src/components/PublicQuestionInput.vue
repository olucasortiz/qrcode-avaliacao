<script setup>
import { ref } from 'vue';
import { Check, Star } from '@lucide/vue';
defineProps({ question: { type: Object, required: true }, modelValue: [String, Number, Boolean], error: String, disabled: Boolean });
const emit = defineEmits(['update:modelValue']);
const hover = ref(0);
const starsLabel = value => `${value} ${value === 1 ? 'estrela' : 'estrelas'}`;
</script>

<template>
  <fieldset class="public-answer" :disabled="disabled" :aria-describedby="error ? 'answer-error' : undefined">
    <legend class="sr-only">{{ question.texto }}{{ question.obrigatoria ? ' (obrigatória)' : ' (opcional)' }}</legend>
    <template v-if="question.tipo === 'ESTRELAS'">
      <div class="public-stars" @mouseleave="hover = 0">
        <label v-for="value in 5" :key="value" class="public-star" :class="{ 'is-filled': value <= (hover || modelValue || 0), 'is-selected': value === modelValue }" @mouseenter="hover = value">
          <input type="radio" :name="question.id" :value="value" :checked="modelValue === value" :aria-label="starsLabel(value)" :aria-invalid="!!error" :aria-describedby="error ? 'answer-error' : undefined" @change="emit('update:modelValue', value)" />
          <span class="public-star__tile"><Star :size="32" :stroke-width="1.4" aria-hidden="true" /><span>{{ value }}</span></span>
        </label>
      </div>
      <p class="public-selection" aria-live="polite">{{ modelValue ? `${starsLabel(modelValue)} ${modelValue === 1 ? 'selecionada' : 'selecionadas'}` : 'Toque em uma estrela para avaliar' }}</p>
    </template>
    <template v-else-if="question.tipo === 'NPS'">
      <div class="public-nps">
        <label v-for="value in 11" :key="value - 1" class="public-choice public-choice--number" :class="{ 'is-selected': modelValue === value - 1 }">
          <input type="radio" :name="question.id" :value="value - 1" :checked="modelValue === value - 1" :aria-label="`Nota ${value - 1}`" :aria-invalid="!!error" :aria-describedby="error ? 'answer-error' : 'nps-labels'" @change="emit('update:modelValue', value - 1)" />
          <span class="public-choice__tile">{{ value - 1 }}</span>
        </label>
      </div>
      <div id="nps-labels" class="public-scale-labels"><span>0 · Nada provável</span><span>10 · Muito provável</span></div>
    </template>
    <div v-else-if="question.tipo === 'SIM_NAO'" class="public-binary">
      <label v-for="option in [{ value: true, text: 'Sim' }, { value: false, text: 'Não' }]" :key="String(option.value)" class="public-choice" :class="{ 'is-selected': modelValue === option.value }">
        <input type="radio" :name="question.id" :checked="modelValue === option.value" :aria-label="option.text" :aria-invalid="!!error" :aria-describedby="error ? 'answer-error' : undefined" @change="emit('update:modelValue', option.value)" />
        <span class="public-choice__tile"><span>{{ option.text }}</span><span class="public-choice__indicator"><Check v-if="modelValue === option.value" :size="16" aria-hidden="true" /></span></span>
      </label>
    </div>
    <template v-else-if="question.tipo === 'TEXTO'">
      <label class="sr-only" :for="`text-${question.id}`">Sua resposta</label>
      <textarea :id="`text-${question.id}`" class="public-text" :value="modelValue ?? ''" maxlength="2000" rows="5" placeholder="Escreva sua resposta aqui…" :aria-invalid="!!error" :aria-describedby="error ? 'text-count answer-error' : 'text-count'" @input="emit('update:modelValue', $event.target.value)" />
      <p id="text-count" class="public-text-count">{{ (modelValue || '').length.toLocaleString('pt-BR') }} / 2.000 caracteres</p>
    </template>
    <div v-else-if="question.tipo === 'MULTIPLA_ESCOLHA'" class="public-options">
      <label v-for="(option, i) in question.opcoes" :key="option.id" class="public-choice" :class="{ 'is-selected': modelValue === option.id }">
        <input type="radio" :name="question.id" :value="option.id" :checked="modelValue === option.id" :aria-label="option.texto" :aria-invalid="!!error" :aria-describedby="error ? 'answer-error' : undefined" @change="emit('update:modelValue', option.id)" />
        <span class="public-choice__tile"><span class="public-option-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span><span class="public-option-text">{{ option.texto }}</span><span class="public-choice__indicator"><Check v-if="modelValue === option.id" :size="16" aria-hidden="true" /></span></span>
      </label>
    </div>
    <p v-if="error" id="answer-error" class="public-field-error" role="alert">{{ error }}</p>
  </fieldset>
</template>
