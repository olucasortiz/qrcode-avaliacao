<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { ChevronDown, LogOut, UserRound } from '@lucide/vue';
import { useRouter } from 'vue-router';
import { session } from '../services/session.js';

const router = useRouter();
defineProps({ compact: { type: Boolean, default: true } });
const emit = defineEmits(['navigate']);
const menuId = useId();
const open = ref(false);
const container = ref(null);
const trigger = ref(null);
const accountLink = ref(null);
const initial = computed(() => session.state.usuario?.nome.trim().charAt(0).toUpperCase() || 'F');

async function toggle() {
  open.value = !open.value;
  if (open.value) { await nextTick(); accountLink.value?.$el.focus(); }
}
function navigate() { open.value = false; emit('navigate'); }
function moveFocus(event) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  const items = [...container.value.querySelectorAll('[role="menuitem"]')];
  const index = items.indexOf(document.activeElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
    : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  event.preventDefault(); items[next]?.focus();
}
function close(event) {
  if (event.type === 'pointerdown' && container.value?.contains(event.target)) return;
  if (event.type === 'keydown' && event.key !== 'Escape') return;
  const wasOpen = open.value;
  open.value = false;
  if (wasOpen && event.type === 'keydown') trigger.value?.focus();
}
function focusLeft(event) {
  if (!container.value?.contains(event.relatedTarget)) open.value = false;
}
async function logout() {
  open.value = false;
  session.logout();
  await router.replace({ name: 'login' });
}
onMounted(() => { document.addEventListener('pointerdown', close); document.addEventListener('keydown', close); });
onBeforeUnmount(() => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); });
</script>

<template>
  <div ref="container" class="account-menu" :class="{ 'account-menu--compact': compact }" @focusout="focusLeft">
    <Transition name="popover" @before-leave="element => { element.inert = true; }">
      <div v-if="open" :id="menuId" class="account-popover" role="menu" aria-label="Conta" @keydown="moveFocus" @keydown.escape.prevent.stop="close">
        <div class="account-popover__identity">
          <strong>{{ session.state.usuario?.nome }}</strong>
          <span>{{ session.state.usuario?.email }}</span>
        </div>
        <RouterLink ref="accountLink" :to="{ name: 'workspace' }" class="account-popover__action" role="menuitem" @click="navigate"><UserRound :size="17" aria-hidden="true" /> Sua conta</RouterLink>
        <button class="account-popover__action" role="menuitem" type="button" @click="logout">
          <LogOut :size="17" aria-hidden="true" /> Sair da conta
        </button>
      </div>
    </Transition>
    <button ref="trigger" class="account-trigger" type="button" aria-haspopup="menu" :aria-controls="menuId" :aria-expanded="open" :aria-label="`${session.state.usuario?.nome || ''} Minha conta`" title="Minha conta"
      @click="toggle" @keydown.arrow-down.prevent="!open && toggle()">
      <span class="avatar" aria-hidden="true">{{ initial }}</span>
      <span class="account-trigger__identity"><strong>{{ session.state.usuario?.nome }}</strong><span>Minha conta</span></span>
      <ChevronDown class="account-trigger__chevron" :size="14" aria-hidden="true" />
    </button>
  </div>
</template>
