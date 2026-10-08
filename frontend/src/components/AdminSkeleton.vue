<script setup>
defineProps({ kind: { type: String, default: 'detail' } });
</script>
<template>
  <div class="admin-skeleton" :class="`admin-skeleton--${kind}`" role="status" aria-busy="true">
    <span class="sr-only">Carregando...</span>
    <span v-if="kind === 'dashboard'" class="skeleton-block skeleton-caption" aria-hidden="true"></span>
    <div v-if="kind === 'dashboard'" class="skeleton-overview" aria-hidden="true"><div class="skeleton-totals"><span class="skeleton-block skeleton-total"></span><span class="skeleton-block skeleton-active"></span></div><div class="skeleton-chart"><span class="skeleton-block skeleton-heading"></span><span class="skeleton-block skeleton-plot"></span></div></div>
    <div v-else-if="kind === 'list'" class="skeleton-list" aria-hidden="true"><div v-for="row in 5" :key="row"><span class="skeleton-block skeleton-title"></span><span class="skeleton-block skeleton-status"></span><span class="skeleton-block skeleton-date"></span></div></div>
    <div v-else class="skeleton-detail" aria-hidden="true"><span class="skeleton-block skeleton-heading"></span><span class="skeleton-block skeleton-description"></span><span v-for="row in 3" :key="row" class="skeleton-block skeleton-row"></span></div>
  </div>
</template>
