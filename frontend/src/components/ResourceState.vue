<script setup>
import { RefreshCw, WifiOff, Inbox } from '@lucide/vue';
import AppButton from './AppButton.vue';
import AdminSkeleton from './AdminSkeleton.vue';
defineProps({ loading: Boolean, error: String, kind: { type: String, default: 'detail' }, title: { type: String, default: 'Ainda n\u00e3o h\u00e1 dados.' }, description: String });
defineEmits(['retry']);
</script>
<template>
  <AdminSkeleton v-if="loading" :kind="kind" />
  <div v-else class="resource-state" :class="{ 'resource-state--error': error }">
    <WifiOff v-if="error" :size="26" aria-hidden="true" />
    <Inbox v-else :size="26" aria-hidden="true" />
    <template v-if="error"><h2>N&#x00e3;o foi poss&#x00ed;vel carregar.</h2><p role="alert">{{ error }}</p><AppButton variant="secondary" @click="$emit('retry')"><RefreshCw :size="16" aria-hidden="true" /> Tentar novamente</AppButton></template>
    <template v-else><h2>{{ title }}</h2><p v-if="description">{{ description }}</p><slot /></template>
  </div>
</template>
