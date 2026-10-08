<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { X } from '@lucide/vue';
const props = defineProps({ open: Boolean, title: String, busy: Boolean });
const emit = defineEmits(['close']);
const dialog = ref(null);
const visible = ref(false);
const closing = ref(false);
let previousOverflow = '';
let previousFocus;
function close() { if (!props.busy) emit('close'); }
function trapFocus(event) {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.value.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')]
    .filter(element => element.getClientRects().length);
  if (!controls.length) { event.preventDefault(); return; }
  const target = event.shiftKey && document.activeElement === controls[0] ? controls.at(-1)
    : !event.shiftKey && document.activeElement === controls.at(-1) ? controls[0] : null;
  if (target) { event.preventDefault(); target.focus(); }
}
function finishClose() {
  dialog.value?.close();
  document.body.style.overflow = previousOverflow;
  if (previousFocus?.isConnected) previousFocus.focus();
  else document.getElementById('workspace-main')?.focus();
}
watch(() => props.open, async open => {
  if (open) {
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    closing.value = false;
    visible.value = true;
    await nextTick();
    dialog.value.showModal();
    document.body.style.overflow = 'hidden';
  } else { closing.value = true; visible.value = false; }
});
onBeforeUnmount(() => { if (dialog.value?.open) finishClose(); });
</script>
<template>
  <dialog ref="dialog" class="app-modal" :data-closing="closing" :aria-label="title" @cancel.prevent="close" @click.self="close" @keydown="trapFocus">
    <Transition name="modal" @after-leave="finishClose">
      <section v-if="visible" class="modal-content">
        <header class="modal-header"><h2>{{ title }}</h2><button autofocus class="icon-button" type="button" aria-label="Fechar" title="Fechar" :disabled="busy" @click="close"><X :size="20" aria-hidden="true" /></button></header>
        <slot />
      </section>
    </Transition>
  </dialog>
</template>
