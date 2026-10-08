<script setup>
import BrandMark from './components/BrandMark.vue';
import { LoaderCircle } from '@lucide/vue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" v-if="Component" />
      <div v-else class="app-loading" role="status" aria-label="Carregando">
        <BrandMark />
        <LoaderCircle class="spin" :size="20" aria-hidden="true" />
      </div>
    </Transition>
  </RouterView>
</template>
