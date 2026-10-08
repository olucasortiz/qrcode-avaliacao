<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Check, LoaderCircle, RefreshCw, WifiOff, ArrowRight } from '@lucide/vue';
import AppButton from '../components/AppButton.vue';
import { session } from '../services/session.js';

const router = useRouter();
const expires = computed(() => session.state.expiresAt ? new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(session.state.expiresAt) : '');
async function logout() { session.logout(); await router.replace({ name: 'login' }); }
</script>

<template>
  <section class="workspace-view" aria-labelledby="workspace-heading">
    <header class="workspace-heading"><p class="eyebrow">WORKSPACE</p><h1 id="workspace-heading">Sua conta</h1></header>
    <div v-if="session.state.phase === 'checking'" class="connection-state" role="status"><LoaderCircle class="spin" :size="25" aria-hidden="true" /><p>Verificando sua sess&#x00e3;o...</p></div>
    <div v-else-if="session.state.phase === 'unavailable'" class="connection-state">
      <WifiOff :size="28" aria-hidden="true" /><h2>N&#x00e3;o foi poss&#x00ed;vel conectar.</h2><p role="alert">{{ session.state.error }}</p>
      <div class="connection-state__actions"><AppButton @click="session.retry"><RefreshCw :size="17" aria-hidden="true" /> Tentar novamente</AppButton><AppButton variant="secondary" @click="logout">Voltar para o login <ArrowRight :size="17" aria-hidden="true" /></AppButton></div>
    </div>
    <template v-else-if="session.state.phase === 'authenticated'">
      <div class="account-section-heading"><h2>Identifica&#x00e7;&#x00e3;o</h2><span class="session-status"><Check :size="14" aria-hidden="true" /> Sess&#x00e3;o ativa</span></div>
      <dl class="account-details">
        <div><dt>Nome</dt><dd>{{ session.state.usuario.nome }}</dd></div>
        <div><dt>Email</dt><dd>{{ session.state.usuario.email }}</dd></div>
        <div><dt>Sess&#x00e3;o v&#x00e1;lida at&#x00e9;</dt><dd>{{ expires }}</dd></div>
      </dl>
    </template>
  </section>
</template>
