<script setup>
import { LoaderCircle } from '@lucide/vue';
defineProps({ loading: Boolean, variant: { type: String, default: 'primary' }, type: { type: String, default: 'button' } });
</script>

<template>
  <button :type="type" class="button" :class="[`button--${variant}`, { 'is-loading': loading }]" :disabled="loading" :aria-busy="loading || undefined">
    <span class="button__content"><slot /></span>
    <LoaderCircle v-if="loading" class="button__spinner spin" :size="19" aria-hidden="true" />
  </button>
</template>
