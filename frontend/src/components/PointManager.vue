<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { Check, Copy, Download, ExternalLink, Pencil, Plus, Power, QrCode, RefreshCw, Trash2 } from '@lucide/vue';
import { points } from '../services/points.js';
import { surveys } from '../services/surveys.js';
import { pointSchema } from '../lib/questionSchemas.js';
import { dateLabel } from '../lib/format.js';
import AppButton from './AppButton.vue';
import AppModal from './AppModal.vue';
import FormField from './FormField.vue';
import FormNotice from './FormNotice.vue';
import EmptyState from './EmptyState.vue';
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
  survey: { type: Object, required: true },
});

const emit = defineEmits(['busy', 'count']);

const pointsList = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');
const saving = ref(false);

const modal = ref('');
const modalOpen = ref(false);
const selectedPoint = ref(null);

const pointName = ref('');
const pointError = ref('');

const qrImageUrl = ref('');
const qrLoading = ref(false);
const qrError = ref('');
const copied = ref(false);

const isReadOnly = computed(() => props.survey.status === 'ENCERRADA');

const modalTitle = computed(() => {
  if (modal.value === 'create') return 'Novo ponto de coleta';
  if (modal.value === 'edit') return 'Editar ponto de coleta';
  if (modal.value === 'delete') return 'Excluir ponto de coleta?';
  if (modal.value === 'qr') return `QR Code — ${selectedPoint.value?.nome || 'Ponto'}`;
  return 'Ponto de coleta';
});

const pointUrl = computed(() => {
  if (!selectedPoint.value) return '';
  const base = (import.meta.env.VITE_FRONTEND_PUBLIC_URL || window.location.origin).replace(/\/+$/, '');
  return `${base}/p/${encodeURIComponent(props.survey.slug)}?origem=${encodeURIComponent(selectedPoint.value.token)}`;
});

function setBusy(val) {
  saving.value = val;
  emit('busy', val);
}

async function fetchPoints() {
  loading.value = true;
  error.value = '';
  try {
    const list = await surveys.points(props.survey.id);
    pointsList.value = list;
    emit('count', list.length);
  } catch (err) {
    error.value = err.message || 'Não foi possível carregar os pontos de coleta.';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  pointName.value = '';
  pointError.value = '';
  selectedPoint.value = null;
  modal.value = 'create';
  modalOpen.value = true;
}

function openEdit(point) {
  selectedPoint.value = point;
  pointName.value = point.nome;
  pointError.value = '';
  modal.value = 'edit';
  modalOpen.value = true;
}

function openDelete(point) {
  selectedPoint.value = point;
  modal.value = 'delete';
  modalOpen.value = true;
}

async function openQr(point) {
  selectedPoint.value = point;
  modal.value = 'qr';
  modalOpen.value = true;
  await loadQr(point);
}

async function loadQr(point) {
  if (qrImageUrl.value) {
    URL.revokeObjectURL(qrImageUrl.value);
    qrImageUrl.value = '';
  }
  qrLoading.value = true;
  qrError.value = '';
  try {
    const blob = await points.qr(point.id);
    qrImageUrl.value = URL.createObjectURL(blob);
  } catch (err) {
    qrError.value = err.message || 'Não foi possível gerar a imagem do QR Code.';
  } finally {
    qrLoading.value = false;
  }
}

function downloadQr() {
  if (!qrImageUrl.value || !selectedPoint.value) return;
  const a = document.createElement('a');
  a.href = qrImageUrl.value;
  const safeName = (selectedPoint.value.nome || 'ponto')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  a.download = `qrcode-${props.survey.slug}-${safeName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function copyUrl() {
  if (!pointUrl.value) return;
  try {
    await navigator.clipboard.writeText(pointUrl.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2200);
  } catch {
    // fallback if navigator.clipboard is unavailable
  }
}

async function handleSavePoint() {
  pointError.value = '';
  const parsed = pointSchema.safeParse({ nome: pointName.value });
  if (!parsed.success) {
    pointError.value = parsed.error.issues[0]?.message || 'Informe um nome válido.';
    await nextTick();
    document.getElementById('point-name-input')?.focus();
    return;
  }

  setBusy(true);
  try {
    if (modal.value === 'create') {
      const created = await points.create(props.survey.id, { nome: parsed.data.nome });
      pointsList.value = [...pointsList.value, created];
      emit('count', pointsList.value.length);
      modalOpen.value = false;
      success.value = `Ponto "${created.nome}" criado com sucesso.`;
    } else if (modal.value === 'edit' && selectedPoint.value) {
      const updated = await points.update(selectedPoint.value.id, { nome: parsed.data.nome });
      pointsList.value = pointsList.value.map(p => (p.id === updated.id ? updated : p));
      modalOpen.value = false;
      success.value = `Ponto "${updated.nome}" atualizado.`;
    }
  } catch (err) {
    pointError.value = err.message || 'Falha ao salvar ponto de coleta.';
  } finally {
    setBusy(false);
  }
}

async function toggleActive(point) {
  if (saving.value) return;
  setBusy(true);
  error.value = '';
  success.value = '';
  try {
    const updated = await points.update(point.id, { ativo: !point.ativo });
    pointsList.value = pointsList.value.map(p => (p.id === updated.id ? updated : p));
    success.value = updated.ativo
      ? `Ponto "${updated.nome}" ativado. QR Code disponível para coleta.`
      : `Ponto "${updated.nome}" desativado. Coleta pausada para este ponto.`;
  } catch (err) {
    error.value = err.message || 'Não foi possível alterar o status do ponto.';
  } finally {
    setBusy(false);
  }
}

async function confirmDelete() {
  if (saving.value || !selectedPoint.value) return;
  setBusy(true);
  error.value = '';
  try {
    await points.remove(selectedPoint.value.id);
    pointsList.value = pointsList.value.filter(p => p.id !== selectedPoint.value.id);
    emit('count', pointsList.value.length);
    modalOpen.value = false;
    success.value = `Ponto "${selectedPoint.value.nome}" excluído.`;
  } catch (err) {
    error.value = err.message || 'Não foi possível excluir o ponto de coleta.';
    modalOpen.value = false;
  } finally {
    setBusy(false);
  }
}

onMounted(fetchPoints);

onBeforeUnmount(() => {
  if (qrImageUrl.value) {
    URL.revokeObjectURL(qrImageUrl.value);
  }
});
</script>

<template>
  <section class="points-manager" aria-labelledby="points-heading" :aria-busy="saving || loading">
    <header class="section-heading editor-heading">
      <div>
        <h2 id="points-heading">Pontos de coleta</h2>
        <p class="muted">
          {{ pointsList.length }} {{ pointsList.length === 1 ? 'ponto registrado' : 'pontos registrados' }}
          <span aria-hidden="true">&#x00b7;</span>
          {{ isReadOnly ? 'Somente leitura' : 'QR Codes individuais' }}
        </p>
      </div>
      <div class="section-actions">
        <AppButton v-if="!isReadOnly" :disabled="loading || saving" @click="openCreate">
          <Plus :size="17" aria-hidden="true" /> Novo ponto
        </AppButton>
      </div>
    </header>

    <FormNotice v-if="error && !modalOpen">
      {{ error }}
      <button type="button" class="inline-retry" :disabled="loading || saving" @click="fetchPoints">
        Tentar novamente
      </button>
    </FormNotice>
    <FormNotice v-if="success && !modalOpen" tone="info">{{ success }}</FormNotice>

    <div v-if="loading && !pointsList.length" class="resource-state" role="status">
      <RefreshCw class="spin" :size="24" aria-hidden="true" />
      <p>Carregando pontos de coleta...</p>
    </div>

    <EmptyState
      v-else-if="!pointsList.length"
      compact
      eyebrow="LOCAIS DE ATENDIMENTO"
      title="Onde sua pesquisa será respondida?"
      description="Crie pontos de coleta como 'Balcão', 'Mesa 01' ou 'Recepção' para gerar QR Codes individuais e rastrear as avaliações de cada local."
    >
      <AppButton v-if="!isReadOnly" :disabled="saving" @click="openCreate">
        <Plus :size="17" aria-hidden="true" /> Criar ponto de coleta
      </AppButton>
    </EmptyState>

    <div v-else class="points-table-wrapper">
      <table class="points-table">
        <caption class="sr-only">Lista de pontos de coleta e QR Codes da pesquisa</caption>
        <thead>
          <tr>
            <th scope="col">Ponto</th>
            <th scope="col">Status</th>
            <th scope="col">Identificador</th>
            <th scope="col"><span class="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in pointsList" :key="point.id">
            <td class="point-name-cell">
              <strong>{{ point.nome }}</strong>
              <span>Criado em {{ dateLabel(point.createdAt) }}</span>
            </td>
            <td>
              <span class="status-badge" :class="{ 'status-badge--ativa': point.ativo }">
                <span></span> {{ point.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td>
              <code class="point-token-badge" :title="`Token: ${point.token}`">
                {{ point.token.slice(0, 8) }}…
              </code>
            </td>
            <td>
              <div class="point-actions">
                <AppButton
                  variant="secondary"
                  size="compact"
                  :disabled="!point.ativo || saving"
                  :title="point.ativo ? 'Visualizar e baixar QR Code' : 'Ative o ponto para visualizar o QR Code'"
                  @click="openQr(point)"
                >
                  <QrCode :size="16" aria-hidden="true" /> QR Code
                </AppButton>
                <button
                  v-if="!isReadOnly"
                  type="button"
                  class="icon-button"
                  title="Editar nome do ponto"
                  :aria-label="`Editar nome de ${point.nome}`"
                  :disabled="saving"
                  @click="openEdit(point)"
                >
                  <Pencil :size="16" aria-hidden="true" />
                </button>
                <button
                  v-if="!isReadOnly"
                  type="button"
                  class="icon-button"
                  :title="point.ativo ? 'Desativar ponto' : 'Ativar ponto'"
                  :aria-label="point.ativo ? `Desativar ponto ${point.nome}` : `Ativar ponto ${point.nome}`"
                  :disabled="saving"
                  @click="toggleActive(point)"
                >
                  <Power :size="16" :class="{ 'text-active': point.ativo }" aria-hidden="true" />
                </button>
                <button
                  v-if="!isReadOnly"
                  type="button"
                  class="icon-button danger-icon"
                  title="Excluir ponto"
                  :aria-label="`Excluir ponto ${point.nome}`"
                  :disabled="saving"
                  @click="openDelete(point)"
                >
                  <Trash2 :size="16" aria-hidden="true" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <AppModal :open="modalOpen" :title="modalTitle" :busy="saving" @close="modalOpen = false">
      <!-- Create or Edit Point Modal -->
      <form v-if="modal === 'create' || modal === 'edit'" class="point-form" novalidate @submit.prevent="handleSavePoint">
        <FormNotice v-if="pointError">{{ pointError }}</FormNotice>
        <fieldset class="form-stack survey-form__fields" :disabled="saving">
          <FormField
            id="point-name-input"
            v-model="pointName"
            label="Nome do ponto de coleta"
            placeholder="Ex: Balcão 1, Mesa 04, Recepção"
            maxlength="120"
            :error="pointError"
            @edit="pointError = ''"
          />
        </fieldset>
        <div class="form-actions">
          <AppButton variant="secondary" :disabled="saving" @click="modalOpen = false">Cancelar</AppButton>
          <AppButton type="submit" :loading="saving">
            <Check :size="17" aria-hidden="true" /> {{ modal === 'create' ? 'Criar ponto' : 'Salvar alterações' }}
          </AppButton>
        </div>
      </form>

      <!-- Delete Confirmation Modal -->
      <template v-else-if="modal === 'delete' && selectedPoint">
        <p class="confirmation-copy">
          O ponto de coleta <strong>{{ selectedPoint.nome }}</strong> será excluído.
          Esta ação é permitida somente se o ponto ainda não tiver respostas vinculadas.
        </p>
        <div class="form-actions">
          <AppButton variant="secondary" :disabled="saving" @click="modalOpen = false">Cancelar</AppButton>
          <AppButton class="button--danger" :loading="saving" @click="confirmDelete">
            <Trash2 :size="17" aria-hidden="true" /> Excluir ponto
          </AppButton>
        </div>
      </template>

      <!-- View and Download QR Code Modal -->
      <template v-else-if="modal === 'qr' && selectedPoint">
        <div class="qr-modal-body">
          <div v-if="qrLoading" class="resource-state" role="status">
            <RefreshCw class="spin" :size="24" aria-hidden="true" />
            <p>Gerando QR Code oficial...</p>
          </div>
          <FormNotice v-else-if="qrError">{{ qrError }}</FormNotice>
          <template v-else-if="qrImageUrl">
            <div class="qr-code-frame">
              <img :src="qrImageUrl" :alt="`QR Code para o ponto ${selectedPoint.nome}`" width="220" height="220" />
            </div>
            <div class="qr-info">
              <h3>{{ selectedPoint.nome }}</h3>
              <p>Escaneie com a câmera do celular para abrir a pesquisa pública diretamente vinculada a este ponto.</p>
            </div>
            <div class="qr-url-box">
              <code>{{ pointUrl }}</code>
              <button
                type="button"
                class="icon-button"
                :title="copied ? 'Link copiado!' : 'Copiar link do ponto'"
                :aria-label="copied ? 'Link copiado!' : 'Copiar link do ponto'"
                @click="copyUrl"
              >
                <component :is="copied ? Check : Copy" :size="16" aria-hidden="true" />
              </button>
            </div>
            <div class="qr-actions-row">
              <AppButton variant="secondary" :disabled="saving" @click="modalOpen = false">Fechar</AppButton>
              <AppButton variant="secondary" @click="copyUrl">
                <component :is="copied ? Check : Copy" :size="16" aria-hidden="true" />
                {{ copied ? 'Link copiado!' : 'Copiar link' }}
              </AppButton>
              <AppButton @click="downloadQr">
                <Download :size="17" aria-hidden="true" /> Baixar QR Code (PNG)
              </AppButton>
            </div>
          </template>
        </div>
      </template>
    </AppModal>
  </section>
</template>
