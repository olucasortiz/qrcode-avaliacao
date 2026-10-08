<script setup>
import { CircleAlert, Info } from '@lucide/vue';
defineProps({ tone: { type: String, default: 'error' } });
</script>

<template>
  <div class="form-notice" :class="`form-notice--${tone}`" :role="tone === 'error' ? 'alert' : 'status'">
    <component :is="tone === 'error' ? CircleAlert : Info" :size="18" aria-hidden="true" />
    <p><slot /></p>
  </div>
</template>
