<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, ArrowRight, Check, LoaderCircle, RefreshCw } from '@lucide/vue';
import BrandMark from '../components/BrandMark.vue';
import AppButton from '../components/AppButton.vue';
import PublicQuestionInput from '../components/PublicQuestionInput.vue';
import PublicSurveyMark from '../components/PublicSurveyMark.vue';
import { usePublicSurvey } from '../composables/usePublicSurvey.js';
import '../styles/public-survey.css';

const route = useRoute();
const { phase, survey, index, answers, question, last, fieldError, loadError, slowLoading, sendError, sending, uncertain, locked,
  load, start, setAnswer, back, next, submit, dispose, progress } = usePublicSurvey();
const heading = ref(null);
const form = ref(null);
const direction = ref('forward');
const count = computed(() => survey.value?.perguntas.length || 0);
const panelKey = computed(() => `${phase.value}-${index.value}`);
const actionLabel = computed(() => sending.value ? 'Enviando respostas…' : uncertain.value ? 'Confirmar envio novamente' : last.value ? 'Enviar respostas' : 'Continuar');
async function focusHeading() {
  await nextTick();
  const target = heading.value;
  if (!target) return;
  target.focus({ preventScroll: true });
  const bounds = target.getBoundingClientRect();
  if (bounds.top < 0 || bounds.top > window.innerHeight - 80) target.scrollIntoView({ block: 'start', behavior: 'instant' });
}
async function advance() {
  direction.value = 'forward';
  if (uncertain.value) await submit();
  else await next();
  if (fieldError.value) {
    await nextTick();
    form.value?.querySelector('input:checked, input, textarea')?.focus();
  }
}
function goBack() { direction.value = 'back'; back(); }
function reload() { return load(route.params.slug, route.query.origem); }
watch(() => [route.params.slug, route.query.origem], reload, { immediate: true });
watch(panelKey, async () => {
  if (survey.value) document.title = `${survey.value.titulo} | FeedQR`;
  await focusHeading();
});
onBeforeUnmount(dispose);
</script>

<template>
  <div class="public-survey" :class="{ 'public-survey--answering': phase === 'questions' }">
    <a class="skip-link" href="#public-main">Ir para a pesquisa</a>
    <header class="public-header">
      <BrandMark />
      <span class="public-header__note">Um espaço para a sua opinião.</span>
    </header>
    <main id="public-main" class="public-main" tabindex="-1">
      <div v-if="phase === 'loading'" class="public-loading" role="status">
        <LoaderCircle class="spin" :size="24" aria-hidden="true" />
        <p>{{ slowLoading ? 'A conexão está demorando. Continuamos tentando abrir sua pesquisa…' : 'Preparando sua pesquisa…' }}</p>
      </div>
      <template v-else>
        <div v-if="phase === 'questions'" class="public-progress">
          <div class="public-progress__labels"><span>Pergunta {{ index + 1 }} de {{ count }}</span><span>{{ progress }}% das perguntas alcançadas</span></div>
          <progress :value="index + 1" :max="count" :aria-label="`Progresso: pergunta ${index + 1} de ${count}`"></progress>
        </div>
        <Transition :name="direction === 'back' ? 'question-back' : 'question'" mode="out-in" @after-enter="focusHeading">
          <section v-if="phase === 'intro'" :key="panelKey" class="public-panel public-intro" aria-labelledby="public-heading">
            <PublicSurveyMark />
            <div class="public-eyebrow"><span></span> SUA EXPERIÊNCIA IMPORTA</div>
            <h1 id="public-heading" ref="heading" tabindex="-1">{{ survey.titulo }}</h1>
            <p v-if="survey.descricao" class="public-description">{{ survey.descricao }}</p>
            <p class="public-invitation">Conte como foi. Cada resposta ajuda a enxergar o que pode melhorar.</p>
            <div class="public-intro-actions">
              <AppButton @click="direction = 'forward'; start()">Começar <ArrowRight :size="19" aria-hidden="true" /></AppButton>
              <span>{{ count }} {{ count === 1 ? 'pergunta' : 'perguntas' }} <span aria-hidden="true">·</span> Sem cadastro</span>
            </div>
          </section>
          <section v-else-if="phase === 'questions'" :key="panelKey" class="public-panel public-question" aria-labelledby="public-heading">
            <form ref="form" novalidate :aria-busy="sending" @submit.prevent="advance">
              <div class="public-eyebrow"><span class="public-question-number">{{ String(index + 1).padStart(2, '0') }}</span> {{ question.obrigatoria ? 'RESPOSTA OBRIGATÓRIA' : 'RESPOSTA OPCIONAL' }}</div>
              <h1 id="public-heading" ref="heading" tabindex="-1">{{ question.texto }}</h1>
              <p class="public-question-hint">{{ question.tipo === 'TEXTO' ? 'Fique à vontade para compartilhar com suas palavras.' : question.tipo === 'ESTRELAS' ? 'Escolha de 1 a 5 estrelas.' : question.tipo === 'NPS' ? 'Escolha uma nota de 0 a 10.' : 'Escolha uma alternativa.' }}</p>
              <PublicQuestionInput :question="question" :model-value="answers[question.id]" :error="fieldError" :disabled="locked" @update:model-value="setAnswer" />
              <div v-if="sendError" class="public-send-error" role="alert">
                <strong>{{ sendError.title }}</strong><p>{{ sendError.message }}</p>
              </div>
              <div class="public-question-actions">
                <button type="button" class="public-back" :disabled="locked" @click="goBack"><ArrowLeft :size="18" aria-hidden="true" /> Voltar</button>
                <AppButton type="submit" :loading="sending" :disabled="sending || (sendError && !sendError.retry)" :aria-label="actionLabel">{{ actionLabel }} <ArrowRight v-if="!last" :size="18" aria-hidden="true" /><Check v-else :size="18" aria-hidden="true" /></AppButton>
              </div>
              <p v-if="!question.obrigatoria && !locked" class="public-optional-hint">Você pode continuar sem responder esta pergunta.</p>
              <span v-if="sending" class="sr-only" role="status">Enviando suas respostas. Aguarde a confirmação.</span>
            </form>
          </section>
          <section v-else-if="phase === 'success'" :key="panelKey" class="public-panel public-success" aria-labelledby="public-heading">
            <PublicSurveyMark success />
            <div class="public-eyebrow"><span></span> RESPOSTA REGISTRADA</div>
            <h1 id="public-heading" ref="heading" tabindex="-1">Obrigado pela<br />sua resposta!</h1>
            <p class="public-description">Sua opinião foi registrada.<br />Obrigado por dedicar um momento para compartilhar sua experiência.</p>
            <p class="public-close-note"><Check :size="17" aria-hidden="true" /> Tudo certo. Você já pode fechar esta página.</p>
          </section>
          <section v-else-if="phase === 'error'" :key="panelKey" class="public-panel public-unavailable" aria-labelledby="public-heading">
            <PublicSurveyMark />
            <div class="public-eyebrow">{{ loadError.retry ? 'CONEXÃO INTERROMPIDA' : 'PESQUISA INDISPONÍVEL' }}</div>
            <h1 id="public-heading" ref="heading" tabindex="-1">{{ loadError.title }}</h1>
            <p class="public-description">{{ loadError.message }}</p>
            <AppButton v-if="loadError.retry" @click="reload"><RefreshCw :size="18" aria-hidden="true" /> Tentar novamente</AppButton>
          </section>
        </Transition>
      </template>
    </main>
    <footer class="public-footer"><span>Ouvir é o primeiro passo.</span><span>Pesquisas com <strong>FeedQR</strong></span></footer>
  </div>
</template>
