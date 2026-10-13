<script setup>
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { count } from '../lib/format.js';
defineProps({ page: Number, pages: Number, total: Number, busy: Boolean, singular: { type: String, default: 'pesquisa' }, plural: { type: String, default: 'pesquisas' } });
defineEmits(['change']);
</script>
<template>
  <nav class="pagination" aria-label="Pagina&#x00e7;&#x00e3;o">
    <span>{{ count(total) }} {{ total === 1 ? singular : plural }}</span>
    <div><span aria-live="polite">P&#x00e1;gina {{ page }} de {{ Math.max(1, pages) }}</span>
      <button class="icon-button" type="button" title="P&#x00e1;gina anterior" aria-label="P&#x00e1;gina anterior" :disabled="busy || page <= 1" @click="$emit('change', page - 1)"><ChevronLeft :size="19" aria-hidden="true" /></button>
      <button class="icon-button" type="button" title="Pr&#x00f3;xima p&#x00e1;gina" aria-label="Pr&#x00f3;xima p&#x00e1;gina" :disabled="busy || page >= pages" @click="$emit('change', page + 1)"><ChevronRight :size="19" aria-hidden="true" /></button>
    </div>
  </nav>
</template>
