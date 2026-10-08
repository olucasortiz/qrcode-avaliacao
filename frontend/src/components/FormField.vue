<script setup>
import { ref } from 'vue';
import { Eye, EyeOff } from '@lucide/vue';
defineOptions({ inheritAttrs: false });
const model = defineModel({ type: String, default: '' });
defineProps({ id: { type: String, required: true }, label: { type: String, required: true }, error: String,
  type: { type: String, default: 'text' }, autocomplete: String, maxlength: [String, Number], disabled: Boolean });
const emit = defineEmits(['blur', 'edit']);
const revealed = ref(false);
</script>

<template>
  <div class="form-field" :class="{ 'has-error': error }">
    <label :for="id">{{ label }}</label>
    <div class="form-field__input">
      <textarea v-if="type === 'textarea'" :id="id" v-model="model" v-bind="$attrs" rows="4" :maxlength="maxlength" :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined" :aria-describedby="error ? `${id}-error` : undefined" @blur="emit('blur')" @input="emit('edit')"></textarea>
      <input v-else :id="id" v-model="model" v-bind="$attrs" :type="type === 'password' && revealed ? 'text' : type"
        :autocomplete="autocomplete" :maxlength="maxlength" :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined" :aria-describedby="error ? `${id}-error` : undefined"
        :class="{ 'has-toggle': type === 'password' }" @blur="emit('blur')" @input="emit('edit')" />
      <button v-if="type === 'password'" type="button" class="icon-button password-toggle"
        :aria-label="revealed ? 'Ocultar senha' : 'Mostrar senha'" :title="revealed ? 'Ocultar senha' : 'Mostrar senha'"
        :aria-pressed="revealed" :disabled="disabled" @click="revealed = !revealed">
        <component :is="revealed ? EyeOff : Eye" :size="18" aria-hidden="true" />
      </button>
    </div>
    <p v-if="error" :id="`${id}-error`" class="field-error">{{ error }}</p>
  </div>
</template>
