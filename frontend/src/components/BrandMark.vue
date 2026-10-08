<script setup>
defineProps({ compact: Boolean });
</script>

<template>
  <span class="brand" aria-label="FeedQR">
    <img src="/brand/feedqr-symbol.svg" width="36" height="36" alt="" aria-hidden="true" />
    <span v-if="!compact" class="brand__name">Feed<span>QR</span></span>
  </span>
</template>
