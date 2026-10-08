const integers = new Intl.NumberFormat('pt-BR');
const decimals = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const dates = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const count = value => integers.format(value);
export const decimal = value => value === null || value === undefined ? '\u2014' : decimals.format(value);
export const dateLabel = value => dates.format(new Date(value));
export const shortDate = value => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(new Date(value));

// Preserve actual day spacing without allocating every day of a long date range.
export function timelinePoints(rows, filters = {}) {
  const day = 86400000;
  const points = rows.map(row => ({ x: Date.parse(`${row.dia}T00:00:00Z`), y: row.quantidade }));
  if (!points.length) return [];
  if (filters.inicio) {
    const start = Date.parse(`${filters.inicio}T00:00:00Z`);
    if (start < points[0].x) points.unshift({ x: start, y: 0 });
  }
  if (filters.fim) {
    const end = Date.parse(`${filters.fim}T00:00:00Z`);
    if (end > points.at(-1).x) points.push({ x: end, y: 0 });
  }
  const result = [];
  for (const point of points) {
    const previous = result.at(-1);
    if (previous && point.x - previous.x > day) {
      result.push({ x: previous.x + day, y: 0 });
      if (point.x - previous.x > day * 2) result.push({ x: point.x - day, y: 0 });
    }
    result.push(point);
  }
  return result;
}
