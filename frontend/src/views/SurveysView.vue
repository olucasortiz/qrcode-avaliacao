<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowUpRight, Plus } from '@lucide/vue';
import { useResource } from '../composables/useResource.js';
import { surveys } from '../services/surveys.js';
import { surveyStatuses } from '../lib/surveySchemas.js';
import { dateLabel } from '../lib/format.js';
import AppButton from '../components/AppButton.vue';
import AppModal from '../components/AppModal.vue';
import SurveyForm from '../components/SurveyForm.vue';
import ResourceState from '../components/ResourceState.vue';
import EmptyState from '../components/EmptyState.vue';
import PaginationControl from '../components/PaginationControl.vue';
import StatusBadge from '../components/StatusBadge.vue';

const route = useRoute();
const router = useRouter();
const { data, loading, error, load } = useResource();
const createOpen = ref(false);
const saving = ref(false);
const status = computed(() => Object.hasOwn(surveyStatuses, route.query.status) ? route.query.status : '');
const page = computed(() => /^\d+$/.test(route.query.pagina || '') && Number(route.query.pagina) >= 1 && Number(route.query.pagina) <= 100000 ? Number(route.query.pagina) : 1);
async function fetchList() {
  if (await load(() => surveys.list({ pagina: page.value, limite: 10, status: status.value }))) {
    if (data.value.totalPaginas && data.value.pagina > data.value.totalPaginas) changePage(data.value.totalPaginas, true);
  }
}
function changePage(pagina, replace = false) {
  router[replace ? 'replace' : 'push']({ name: 'surveys', query: { ...(status.value ? { status: status.value } : {}), ...(pagina > 1 ? { pagina } : {}) } });
}
function changeStatus(event) { router.push({ name: 'surveys', query: event.target.value ? { status: event.target.value } : {} }); }
async function created(survey) { createOpen.value = false; await router.push({ name: 'survey-detail', params: { id: survey.id } }); }
watch(() => [page.value, status.value], fetchList, { immediate: true });
</script>
<template>
  <section class="admin-view surveys-view" aria-labelledby="surveys-heading">
    <header class="view-heading"><div><p class="eyebrow">PESQUISAS</p><h1 id="surveys-heading">Suas pesquisas</h1></div><AppButton @click="createOpen = true"><Plus :size="18" aria-hidden="true" /> Nova pesquisa</AppButton></header>
    <div class="list-toolbar"><div class="filter-field"><label for="survey-status">Status</label><select id="survey-status" :value="status" @change="changeStatus"><option value="">Todos os status</option><option v-for="(label, value) in surveyStatuses" :key="value" :value="value">{{ label }}</option></select></div><span v-if="loading" role="status" class="muted">Carregando...</span></div>
    <ResourceState v-if="error || !data" kind="list" :loading="loading" :error="error" @retry="fetchList" />
    <template v-else>
      <div class="survey-list" :class="{ 'is-updating': loading }" :aria-busy="loading">
        <table v-if="data.itens.length" class="surveys-table"><caption class="sr-only">Pesquisas da sua empresa</caption><thead><tr><th scope="col">Pesquisa</th><th scope="col">Status</th><th scope="col">Criada em</th></tr></thead><tbody><tr v-for="survey in data.itens" :key="survey.id"><td class="survey-cell"><RouterLink :to="{ name: 'survey-detail', params: { id: survey.id } }"><span>{{ survey.titulo }}</span><ArrowUpRight :size="16" aria-hidden="true" /></RouterLink><p v-if="survey.descricao">{{ survey.descricao }}</p></td><td><StatusBadge :status="survey.status" /></td><td class="survey-date"><span class="mobile-date-label">Criada em </span>{{ dateLabel(survey.createdAt) }}</td></tr></tbody></table>
        <EmptyState
          v-else
          :eyebrow="status ? 'FILTRO ATIVO' : 'PRIMEIRO PASSO'"
          :title="status ? 'Nenhuma pesquisa com este status.' : 'Toda boa escuta tem um começo.'"
          :description="status ? 'Nenhuma pesquisa encontrada para este status. Alterne o filtro para ver outras pesquisas ou crie um novo rascunho.' : 'Crie sua primeira pesquisa e gere QR Codes para começar a coletar a opinião dos seus clientes em minutos.'"
        >
          <template v-if="status">
            <AppButton variant="secondary" @click="router.push({ name: 'surveys' })">
              Ver todas as pesquisas <ArrowUpRight :size="17" aria-hidden="true" />
            </AppButton>
            <AppButton @click="createOpen = true">
              <Plus :size="17" aria-hidden="true" /> Nova pesquisa
            </AppButton>
          </template>
          <AppButton v-else @click="createOpen = true">
            <Plus :size="17" aria-hidden="true" /> Criar primeira pesquisa
          </AppButton>
        </EmptyState>
        <PaginationControl :page="data.pagina" :pages="data.totalPaginas" :total="data.total" :busy="loading" @change="changePage" />
      </div>
    </template>
    <AppModal :open="createOpen" title="Nova pesquisa" :busy="saving" @close="createOpen = false"><SurveyForm :save="surveys.create" @saved="created" @cancel="createOpen = false" @busy="saving = $event" /></AppModal>
  </section>
</template>
