<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { X } from '@lucide/vue';
import BrandMark from './BrandMark.vue';
import WorkspaceNavigation from './WorkspaceNavigation.vue';
import AccountMenu from './AccountMenu.vue';

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close']);
const dialog = ref(null);
const visible = ref(false);
const closing = ref(false);
let previousOverflow = '';
let previousFocus;
let desktop;
function resized() { if (desktop.matches && props.open) emit('close'); }
function trapFocus(event) {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.value.querySelectorAll('a[href], button:not(:disabled)')].filter(element => element.getClientRects().length && !element.closest('[inert]'));
  const target = event.shiftKey && document.activeElement === controls[0] ? controls.at(-1)
    : !event.shiftKey && document.activeElement === controls.at(-1) ? controls[0] : null;
  if (target) { event.preventDefault(); target.focus(); }
}

watch(() => props.open, async open => {
  if (open) {
    previousOverflow = document.body.style.overflow;
    previousFocus = document.activeElement;
    closing.value = false;
    visible.value = true;
    await nextTick();
    if (!props.open || !dialog.value) return;
    dialog.value.showModal();
    document.body.style.overflow = 'hidden';
  } else {
    closing.value = true;
    visible.value = false;
  }
});

function finishClose() {
  dialog.value?.close();
  document.body.style.overflow = previousOverflow;
  if (previousFocus?.isConnected && getComputedStyle(previousFocus).display !== 'none') previousFocus.focus();
}
onMounted(() => { desktop = matchMedia('(min-width: 768px)'); desktop.addEventListener('change', resized); });
onBeforeUnmount(() => { desktop?.removeEventListener('change', resized); if (dialog.value?.open) finishClose(); });
</script>

<template>
  <dialog id="mobile-navigation" ref="dialog" class="mobile-dialog" :data-closing="closing" aria-label="Menu principal" @cancel.prevent="emit('close')" @click.self="emit('close')" @keydown="trapFocus">
    <Transition name="navigation" @after-leave="finishClose">
      <div v-if="visible" class="mobile-panel">
        <div class="mobile-panel__header"><BrandMark /><button autofocus type="button" class="icon-button" aria-label="Fechar menu" title="Fechar menu" @click="emit('close')"><X :size="20" aria-hidden="true" /></button></div>
        <WorkspaceNavigation @navigate="emit('close')" />
        <div class="mobile-panel__account"><AccountMenu :compact="false" @navigate="emit('close')" /></div>
      </div>
    </Transition>
  </dialog>
</template>
