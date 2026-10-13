export function csvCell(value) {
  let text = String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
  // Quoting alone does not stop spreadsheet formulas, including after leading whitespace.
  if (/^\s*[=+@\-\uFF1D\uFF0B\uFF0D\uFF20]/u.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function csvRow(values) {
  return `${values.map(csvCell).join(';')}\r\n`;
}
