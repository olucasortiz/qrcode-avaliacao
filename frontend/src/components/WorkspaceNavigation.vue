<script setup>
import { ChartNoAxesCombined, ClipboardList } from '@lucide/vue';
const emit = defineEmits(['navigate']);
</script>

<template>
  <nav class="workspace-nav" aria-label="Navega&#x00e7;&#x00e3;o principal">
    <RouterLink :to="{ name: 'dashboard' }" class="nav-item" exact-active-class="nav-item--active" @click="emit('navigate')">
      <ChartNoAxesCombined :size="18" aria-hidden="true" /> <span>Vis&#x00e3;o geral</span>
    </RouterLink>
    <RouterLink :to="{ name: 'surveys' }" class="nav-item" :class="{ 'nav-item--active': $route.name === 'surveys' || $route.name === 'survey-detail' }" :aria-current="$route.name === 'surveys' || $route.name === 'survey-detail' ? 'page' : undefined" @click="emit('navigate')">
      <ClipboardList :size="18" aria-hidden="true" /> <span>Pesquisas</span>
    </RouterLink>
  </nav>
</template>
