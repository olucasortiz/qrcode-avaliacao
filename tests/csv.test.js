import { expect, test } from 'vitest';
import { csvCell, csvRow } from '../src/utils/csv.js';

test.each(['=1+1', '+SUM(A1)', '-1+1', '@SUM(A1)', '  =1+1', '\t=1+1', '\r=1+1', '\n=1+1', '\uFEFF=1+1', '\uFF1D1+1'])
  ('CSV neutraliza formula %j', value => {
    expect(csvCell(value).startsWith('"\'')).toBe(true);
  });

test('CSV escapa delimitadores, aspas e linhas sem perder texto UTF-8', () => {
  expect(csvRow(['Ol\u00e1; "Teste"\nLinha', false, null])).toBe('"Ol\u00e1; ""Teste""\nLinha";"false";""\r\n');
});
