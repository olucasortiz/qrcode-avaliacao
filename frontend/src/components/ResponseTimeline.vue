<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, Tooltip } from 'chart.js';
import { timelinePoints, shortDate, count, dateLabel } from '../lib/format.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Tooltip);
const props = defineProps({ rows: { type: Array, required: true }, filters: { type: Object, default: () => ({}) } });
const canvas = ref(null);
let chart;
let motion;
function extent(points) {
  const start = points[0]?.x;
  const end = points.at(-1)?.x;
  return { min: start === end ? start - 43200000 : start, max: start === end ? end + 43200000 : end };
}
function updateMotion() { if (chart) { chart.options.animation = { duration: motion.matches ? 0 : 220 }; chart.update('none'); } }
onMounted(async () => {
  await document.fonts.ready;
  if (!canvas.value) return;
  motion = matchMedia('(prefers-reduced-motion: reduce)');
  const style = getComputedStyle(document.documentElement);
  const points = timelinePoints(props.rows, props.filters);
  chart = new Chart(canvas.value, {
    type: 'line',
    data: { datasets: [{ label: 'Respostas', data: points, borderColor: style.getPropertyValue('--color-primary').trim(),
      backgroundColor: style.getPropertyValue('--color-primary').trim(), borderWidth: 2, pointRadius: props.rows.length < 20 ? 3 : 0,
      pointHoverRadius: 5, pointHitRadius: 14, tension: 0, fill: false }] },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: motion.matches ? 0 : 220 },
      interaction: { mode: 'nearest', intersect: false },
      font: { family: 'IBM Plex Sans', size: 12 },
      scales: {
        x: { type: 'linear', grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: 6, color: '#69706d', font: { family: 'IBM Plex Sans' },
          callback: value => shortDate(value) }, ...extent(points), afterBuildTicks: scale => {
            const points = timelinePoints(props.rows, props.filters);
            const step = Math.max(1, Math.ceil((points.length - 1) / 5));
            scale.ticks = points.filter((point, index) => index % step === 0 || index === points.length - 1).map(point => ({ value: point.x }));
          } },
        y: { beginAtZero: true, suggestedMax: 3, border: { display: false }, grid: { color: '#edf0ee' }, ticks: { precision: 0, maxTicksLimit: 5, color: '#69706d', font: { family: 'IBM Plex Sans' } } },
      },
      plugins: { tooltip: { displayColors: false, padding: 12, backgroundColor: '#252b29', titleFont: { family: 'IBM Plex Sans', weight: '500' }, bodyFont: { family: 'IBM Plex Sans' },
        callbacks: { title: entries => dateLabel(entries[0].parsed.x), label: entry => `${count(entry.parsed.y)} respostas` } } },
    },
  });
  motion.addEventListener('change', updateMotion);
});
watch(() => [props.rows, props.filters], () => {
  if (!chart) return;
  const points = timelinePoints(props.rows, props.filters);
  chart.data.datasets[0].data = points;
  chart.data.datasets[0].pointRadius = props.rows.length < 20 ? 3 : 0;
  Object.assign(chart.options.scales.x, extent(points));
  chart.update();
}, { deep: true });
onBeforeUnmount(() => { motion?.removeEventListener('change', updateMotion); chart?.destroy(); });
</script>
<template>
  <div class="timeline-chart"><canvas ref="canvas" role="img" aria-label="Evolu&#x00e7;&#x00e3;o das respostas por dia. Os valores est&#x00e3;o na tabela de dados di&#x00e1;rios."></canvas></div>
  <details class="daily-data"><summary>Dados di&#x00e1;rios</summary><div class="daily-data__scroll"><table><caption class="sr-only">Respostas por dia em UTC</caption><thead><tr><th scope="col">Data (UTC)</th><th scope="col">Respostas</th></tr></thead><tbody><tr v-for="row in rows" :key="row.dia"><th scope="row">{{ dateLabel(row.dia) }}</th><td>{{ count(row.quantidade) }}</td></tr></tbody></table></div></details>
</template>
