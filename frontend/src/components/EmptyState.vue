<script setup>
defineProps({ eyebrow: String, title: { type: String, required: true }, description: String, compact: Boolean });
</script>
<template>
  <div class="empty-state" :class="{ 'empty-state--compact': compact }">
    <div class="empty-state__mark" aria-hidden="true"><i v-for="corner in 4" :key="corner"></i><span></span><span></span><span></span></div>
    <div class="empty-state__copy"><p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p><h2>{{ title }}</h2><p v-if="description" class="empty-state__description">{{ description }}</p><div v-if="$slots.default" class="empty-state__actions"><slot /></div></div>
  </div>
</template>
