<script setup>
import { ArrowLeft } from '@lucide/vue';
import BrandMark from '../components/BrandMark.vue';
import { session } from '../services/session.js';
</script>

<template>
  <main class="not-found">
    <BrandMark /><span class="not-found__code">404</span><h1>P&#x00e1;gina n&#x00e3;o encontrada.</h1>
    <RouterLink :to="{ name: session.state.phase === 'anonymous' ? 'login' : 'workspace' }" class="button button--secondary"><ArrowLeft :size="17" aria-hidden="true" /> Voltar ao in&#x00ed;cio</RouterLink>
  </main>
</template>
