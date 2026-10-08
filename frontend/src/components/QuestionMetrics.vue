<script setup>
import { Star, TrendingUp, MessageSquare, ListChecks, ToggleLeft } from '@lucide/vue';
import { count, decimal } from '../lib/format.js';
import { questionTypes } from '../lib/surveySchemas.js';
defineProps({ question: { type: Object, required: true } });
const icons = { ESTRELAS: Star, NPS: TrendingUp, TEXTO: MessageSquare, MULTIPLA_ESCOLHA: ListChecks, SIM_NAO: ToggleLeft };
</script>
<template>
  <article class="question-metric" :class="`question-metric--${question.tipo.toLowerCase()}`">
    <div class="question-metric__heading"><span class="question-type"><component :is="icons[question.tipo]" :size="15" aria-hidden="true" />{{ questionTypes[question.tipo] }}</span><h3>{{ question.texto }}</h3><p>{{ count(question.totalRespostas) }} {{ question.totalRespostas === 1 ? 'resposta' : 'respostas' }}</p></div>
    <div v-if="question.tipo === 'ESTRELAS'" class="star-metric">
      <div class="question-score"><strong>{{ decimal(question.media) }}</strong><span>M&#x00e9;dia / 5</span></div>
      <ul class="star-distribution" aria-label="Distribui&#x00e7;&#x00e3;o de estrelas"><li v-for="item in question.distribuicao" :key="item.valor"><span>{{ item.valor }} <Star :size="12" aria-hidden="true" /></span><div class="distribution-track" aria-hidden="true"><span :style="{ width: `${question.totalRespostas ? item.quantidade * 100 / question.totalRespostas : 0}%` }"></span></div><span>{{ count(item.quantidade) }}</span></li></ul>
    </div>
    <div v-else-if="question.tipo === 'NPS'" class="nps-metric">
      <div class="question-score"><strong>{{ decimal(question.nps) }}</strong><span>NPS</span></div>
      <div class="nps-distribution"><div class="nps-bar" aria-hidden="true"><span class="nps-bar__detractors" :style="{ flex: question.detratores }"></span><span class="nps-bar__neutral" :style="{ flex: question.neutros }"></span><span class="nps-bar__promoters" :style="{ flex: question.promotores }"></span></div>
        <ul><li><span class="legend-dot legend-dot--detractors" aria-hidden="true"></span>Detratores <strong>{{ count(question.detratores) }}</strong></li><li><span class="legend-dot legend-dot--neutral" aria-hidden="true"></span>Neutros <strong>{{ count(question.neutros) }}</strong></li><li><span class="legend-dot legend-dot--promoters" aria-hidden="true"></span>Promotores <strong>{{ count(question.promotores) }}</strong></li></ul>
      </div>
    </div>
    <div v-else class="question-count"><strong>{{ count(question.totalRespostas) }}</strong><span>Respostas recebidas</span></div>
  </article>
</template>
