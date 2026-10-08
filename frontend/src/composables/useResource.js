import { onBeforeUnmount, ref, shallowRef } from 'vue';

export function useResource() {
  const data = shallowRef(null);
  const loading = ref(false);
  const error = ref('');
  let revision = 0;
  onBeforeUnmount(() => revision++);
  async function load(action) {
    const current = ++revision;
    loading.value = true;
    error.value = '';
    try {
      const result = await action();
      if (current === revision) data.value = result;
      return current === revision;
    } catch (failure) {
      if (current === revision) error.value = failure.message;
      return false;
    } finally { if (current === revision) loading.value = false; }
  }
  return { data, loading, error, load };
}
