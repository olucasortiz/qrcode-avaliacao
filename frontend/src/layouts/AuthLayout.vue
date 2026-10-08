<script setup>
import BrandMark from '../components/BrandMark.vue';
</script>

<template>
  <div class="auth-layout">
    <a href="#auth-form" class="skip-link">Ir para o formul&#x00e1;rio</a>
    <header class="auth-brand"><RouterLink :to="{ name: 'login' }" aria-label="FeedQR, in&#x00ed;cio"><BrandMark /></RouterLink></header>
    <main id="auth-form" class="auth-main" tabindex="-1">
      <RouterView v-slot="{ Component, route }"><Transition name="auth" mode="out-in"><component :is="Component" :key="route.name" /></Transition></RouterView>
    </main>
    <footer class="auth-footer">FeedQR</footer>
  </div>
</template>
