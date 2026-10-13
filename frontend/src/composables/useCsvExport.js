import { onBeforeUnmount, ref } from 'vue';
import { analytics } from '../services/analytics.js';
export function useCsvExport() {
  const exporting = ref(false);
  const exportError = ref('');
  const exportSuccess = ref('');
  let mounted = true;
  onBeforeUnmount(() => { mounted = false; });
  async function download(id, filters) {
    if (exporting.value) return;
    exporting.value = true; exportError.value = ''; exportSuccess.value = '';
    try {
      const { blob, filename } = await analytics.export(id, { ...filters });
      if (!mounted) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = filename;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      exportSuccess.value = 'CSV preparado. Confira os downloads do navegador.';
    } catch (error) { if (mounted) exportError.value = error.message; }
    finally { if (mounted) exporting.value = false; }
  }
  return { exporting, exportError, exportSuccess, download };
}
