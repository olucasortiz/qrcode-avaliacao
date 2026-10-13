<script setup>
defineProps({ success: Boolean });
</script>

<template>
  <div class="public-mark" :class="{ 'public-mark--success': success }" aria-hidden="true">
    <svg viewBox="0 0 160 160" fill="none">
      <path d="M12 57V12h45M103 12h45v45M148 103v45h-45M57 148H12v-45" stroke="currentColor" stroke-width="2" />
      <path d="M31 31h28v28H31zM101 31h28v28h-28zM31 101h28v28H31z" stroke="currentColor" stroke-width="6" />
      <path v-if="!success" d="M43 43h4v4h-4zM113 43h4v4h-4zM43 113h4v4h-4zM78 31h7v15h-7zM78 59h7v27h-7zM31 78h28v7H31zM101 78h28v7h-28zM78 101h7v28h-7zM101 101h7v7h-7zM115 101h14v7h-14zM101 115h7v14h-7zM122 122h7v7h-7z" fill="currentColor" />
      <path v-else class="public-mark__check" d="m78 105 17 17 34-39" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>
