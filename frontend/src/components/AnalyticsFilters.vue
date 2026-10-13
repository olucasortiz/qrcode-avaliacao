<script setup>
import { computed } from 'vue';
import { Check, RotateCcw } from '@lucide/vue';
import AppButton from './AppButton.vue';
const props = defineProps({ fields: Object, errors: Object, points: Array, questions: { type: Array, default: () => [] }, feedback: Boolean, busy: Boolean, pointsLoading: Boolean });
defineEmits(['apply', 'clear']);
const rated = computed(() => props.questions.find(q => q.id === props.fields.perguntaId));
const canRate = computed(() => ['ESTRELAS', 'NPS'].includes(rated.value?.tipo));
const scores = computed(() => rated.value?.tipo === 'ESTRELAS' ? [1, 2, 3, 4, 5] : Array.from({ length: 11 }, (_, i) => i));
</script>
<template>
  <form class="analysis-filters" aria-label="Filtros da pesquisa" novalidate @submit.prevent="$emit('apply')">
    <div class="filter-field"><label for="analysis-start">Data inicial</label><input id="analysis-start" v-model="fields.inicio" type="date" :aria-invalid="!!errors.inicio" :aria-describedby="errors.inicio ? 'analysis-start-error' : undefined" /><p v-if="errors.inicio" id="analysis-start-error" class="field-error">{{ errors.inicio }}</p></div>
    <div class="filter-field"><label for="analysis-end">Data final</label><input id="analysis-end" v-model="fields.fim" type="date" :aria-invalid="!!errors.fim" :aria-describedby="errors.fim ? 'analysis-end-error' : undefined" /><p v-if="errors.fim" id="analysis-end-error" class="field-error">{{ errors.fim }}</p></div>
    <div class="filter-field analysis-filter-point"><label for="analysis-point">Ponto de coleta</label><select id="analysis-point" v-model="fields.pontoColetaId" :disabled="pointsLoading" :aria-invalid="!!errors.pontoColetaId" :aria-describedby="errors.pontoColetaId ? 'analysis-point-error' : undefined"><option value="">Todos os pontos</option><option v-for="point in points" :key="point.id" :value="point.id">{{ point.nome }}{{ point.ativo ? '' : ' (inativo)' }}</option></select><p v-if="errors.pontoColetaId" id="analysis-point-error" class="field-error">{{ errors.pontoColetaId }}</p></div>
    <template v-if="feedback">
      <div class="filter-field analysis-filter-question"><label for="analysis-question">Pergunta</label><select id="analysis-question" v-model="fields.perguntaId" :aria-invalid="!!errors.perguntaId" :aria-describedby="errors.perguntaId ? 'analysis-question-error' : undefined" @change="fields.nota = ''"><option value="">Todas as perguntas</option><option v-for="question in questions" :key="question.id" :value="question.id">{{ question.texto }}</option></select><p v-if="errors.perguntaId" id="analysis-question-error" class="field-error">{{ errors.perguntaId }}</p></div>
      <div class="filter-field"><label for="analysis-score">Nota</label><select id="analysis-score" v-model="fields.nota" :disabled="!canRate" :aria-invalid="!!errors.nota" :aria-describedby="errors.nota ? 'analysis-score-error' : 'analysis-score-hint'"><option value="">Todas as notas</option><option v-for="score in scores" :key="score" :value="String(score)">{{ score }}</option></select><p v-if="errors.nota" id="analysis-score-error" class="field-error">{{ errors.nota }}</p><p v-else-if="!canRate" id="analysis-score-hint" class="analysis-filter-hint">Selecione estrelas ou NPS.</p></div>
    </template>
    <div class="filter-actions"><AppButton type="submit" variant="secondary" :loading="busy"><Check :size="16" aria-hidden="true" /> Aplicar</AppButton><button type="button" class="icon-button" aria-label="Limpar filtros" :disabled="busy" @click="$emit('clear')"><RotateCcw :size="17" aria-hidden="true" /></button></div>
    <p class="analysis-timezone">Datas do período em UTC. Horários das respostas no seu fuso local.</p>
  </form>
</template>
