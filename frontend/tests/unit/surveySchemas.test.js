import { describe, expect, it } from 'vitest';
import { createSurveySchema, editSurveySchema, dashboardFiltersSchema, publicationProblem } from '../../src/lib/surveySchemas.js';
import { timelinePoints } from '../../src/lib/format.js';
import { query } from '../../src/services/surveys.js';

describe('Contratos de pesquisas', () => {
  const input = { titulo: '  Atendimento  ', descricao: '', slug: '' };
  it('normaliza campos opcionais sem inventar slug', () => {
    expect(createSurveySchema.parse(input)).toEqual({ titulo: 'Atendimento', descricao: null, slug: undefined });
  });
  it('nao permite titulo vazio e limita descricao e slug', () => {
    for (const data of [{ ...input, titulo: ' ' }, { ...input, descricao: 'x'.repeat(2001) }, { ...input, slug: 'Com espaco' }, { ...input, slug: 'a'.repeat(201) }])
      expect(createSurveySchema.safeParse(data).success).toBe(false);
  });
  it('preserva slug obrigatorio na edicao e aceita o UUID gerado pelo backend', () => {
    expect(editSurveySchema.safeParse(input).success).toBe(false);
    expect(editSurveySchema.safeParse({ ...input, slug: '4b2ae36c-741e-4ac1-9e4c-6cde01f164df' }).success).toBe(true);
  });
  it('valida periodo e IDs mantendo datas opcionais', () => {
    const base = { inicio: '', fim: '', pesquisaId: '', pontoColetaId: '' };
    expect(dashboardFiltersSchema.safeParse(base).success).toBe(true);
    for (const input of [{ ...base, inicio: '2026-10-07', fim: '2026-10-01' }, { ...base, inicio: '2026-02-30' }, { ...base, pesquisaId: 'outro' }])
      expect(dashboardFiltersSchema.safeParse(input).success).toBe(false);
  });
  it('exige perguntas validas e ao menos duas opcoes para multipla escolha', () => {
    const question = { texto: 'Pergunta', ordem: 0, tipo: 'ESTRELAS', opcoes: [] };
    expect(publicationProblem([])).not.toBe('');
    expect(publicationProblem([question])).toBe('');
    expect(publicationProblem([{ ...question, tipo: 'MULTIPLA_ESCOLHA', opcoes: [{ texto: 'A', ordem: 0 }] }])).not.toBe('');
    expect(publicationProblem([{ ...question, tipo: 'MULTIPLA_ESCOLHA', opcoes: [{ texto: 'A', ordem: 0 }, { texto: 'B', ordem: 1 }] }])).toBe('');
  });
  it('serializa filtros sem enviar campos vazios', () => {
    expect(query({ inicio: '', status: '', pagina: 1, limite: 10 })).toBe('?pagina=1&limite=10');
  });
});
describe('Evolucao diaria', () => {
  it('preserva dias reais em UTC e insere zeros nas lacunas', () => {
    const points = timelinePoints([{ dia: '2026-10-01', quantidade: 2 }, { dia: '2026-10-04', quantidade: 5 }]);
    expect(points.map(point => point.y)).toEqual([2, 0, 0, 5]);
    expect(points.map(point => new Date(point.x).toISOString().slice(0, 10))).toEqual(['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']);
  });
  it('nao inventa respostas e representa limites e intervalos longos com poucos pontos', () => {
    expect(timelinePoints([])).toEqual([]);
    const points = timelinePoints([{ dia: '2026-10-07', quantidade: 1 }], { inicio: '2000-01-01', fim: '2050-01-01' });
    expect(points).toHaveLength(7);
    expect(points.filter(point => point.y)).toEqual([{ x: Date.parse('2026-10-07T00:00:00Z'), y: 1 }]);
  });
});
