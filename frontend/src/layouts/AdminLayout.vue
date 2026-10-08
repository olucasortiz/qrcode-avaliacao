<script setup>
import { ref } from 'vue';
import { Menu } from '@lucide/vue';
import BrandMark from '../components/BrandMark.vue';
import AccountMenu from '../components/AccountMenu.vue';
import WorkspaceNavigation from '../components/WorkspaceNavigation.vue';
import MobileNavigation from '../components/MobileNavigation.vue';

const menuOpen = ref(false);
</script>

<template>
  <div class="admin-layout">
    <a class="skip-link" href="#workspace-main">Ir para o conte&#x00fa;do</a>
    <header class="admin-topbar">
      <div class="admin-topbar__inner">
        <RouterLink :to="{ name: 'dashboard' }" class="admin-brand" aria-label="FeedQR, vis&#x00e3;o geral"><BrandMark /></RouterLink>
        <WorkspaceNavigation class="desktop-navigation" />
        <div class="admin-topbar__actions"><AccountMenu /><button class="icon-button mobile-menu-trigger" type="button" aria-label="Abrir menu" title="Abrir menu" :aria-expanded="menuOpen" aria-controls="mobile-navigation" @click="menuOpen = true"><Menu :size="21" aria-hidden="true" /></button></div>
      </div>
    </header>
    <div class="workspace-body">
      <main id="workspace-main" class="workspace-main" tabindex="-1"><RouterView v-slot="{ Component, route }"><Transition name="content" mode="out-in"><component :is="Component" :key="route.path" /></Transition></RouterView></main>
    </div>
    <MobileNavigation :open="menuOpen" @close="menuOpen = false" />
  </div>
</template>
