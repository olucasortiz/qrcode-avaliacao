<script setup>
import { surveyStatuses } from '../lib/surveySchemas.js';
defineProps({ status: { type: String, required: true } });
</script>
<template><span class="status-badge" :class="`status-badge--${status.toLowerCase()}`"><span aria-hidden="true"></span>{{ surveyStatuses[status] }}</span></template>
