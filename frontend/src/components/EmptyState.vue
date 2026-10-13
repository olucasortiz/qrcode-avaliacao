<script setup>
defineProps({
  eyebrow: String,
  title: { type: String, required: true },
  description: String,
  compact: Boolean,
});
</script>

<template>
  <div class="empty-state" :class="{ 'empty-state--compact': compact }">
    <div class="empty-state__mark" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5H6v5M21 5h5v5M26 21v5h-5M11 26H6v-5" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="10" y="10" width="4" height="4" rx="0.5" fill="var(--color-primary)" />
        <rect x="18" y="10" width="4" height="4" rx="0.5" fill="var(--color-primary)" />
        <rect x="10" y="18" width="4" height="4" rx="0.5" fill="var(--color-primary)" />
        <rect x="18" y="18" width="4" height="4" rx="0.5" fill="var(--color-primary)" />
      </svg>
    </div>
    <div class="empty-state__copy">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <p v-if="description" class="empty-state__description">{{ description }}</p>
      <div v-if="$slots.default" class="empty-state__actions">
        <slot />
      </div>
    </div>
  </div>
</template>
