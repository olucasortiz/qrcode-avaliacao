import { describe, expect, it } from 'vitest';
import { questionSchema, pointSchema, nextQuestionOrder } from '../../src/lib/questionSchemas.js';

describe('Contratos de Perguntas e Pontos de Coleta', () => {
  it('valida os cinco tipos de perguntas suportados', () => {
    const tipos = ['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO'];
    for (const tipo of tipos) {
      const result = questionSchema.safeParse({
        texto: 'Qual a sua opinião?',
        tipo,
        obrigatoria: true,
        ordem: 0,
        opcoes: [],
      });
      expect(result.success).toBe(true);
    }
  });

  it('exige pelo menos 2 opções para MULTIPLA_ESCOLHA', () => {
    const base = {
      texto: 'Escolha uma opção',
      tipo: 'MULTIPLA_ESCOLHA',
      obrigatoria: true,
      ordem: 0,
    };

    expect(questionSchema.safeParse({ ...base, opcoes: [] }).success).toBe(false);
    expect(questionSchema.safeParse({ ...base, opcoes: [{ texto: 'Opção 1', ordem: 0 }] }).success).toBe(false);

    const valid = questionSchema.safeParse({
      ...base,
      opcoes: [
        { texto: 'Opção 1', ordem: 0 },
        { texto: 'Opção 2', ordem: 1 },
      ],
    });
    expect(valid.success).toBe(true);
  });

  it('impede opções em tipos que não sejam MULTIPLA_ESCOLHA', () => {
    const invalid = questionSchema.safeParse({
      texto: 'De 0 a 10?',
      tipo: 'NPS',
      obrigatoria: true,
      ordem: 0,
      opcoes: [{ texto: 'Invalido', ordem: 0 }],
    });
    expect(invalid.success).toBe(false);
  });

  it('rejeita opções com ordens duplicadas', () => {
    const invalid = questionSchema.safeParse({
      texto: 'Escolha uma opção',
      tipo: 'MULTIPLA_ESCOLHA',
      obrigatoria: true,
      ordem: 0,
      opcoes: [
        { texto: 'A', ordem: 0 },
        { texto: 'B', ordem: 0 },
      ],
    });
    expect(invalid.success).toBe(false);
  });

  it('calcula a próxima ordem sequencial de perguntas', () => {
    expect(nextQuestionOrder([])).toBe(0);
    expect(nextQuestionOrder([{ ordem: 0 }])).toBe(1);
    expect(nextQuestionOrder([{ ordem: 0 }, { ordem: 4 }])).toBe(5);
  });

  it('valida ponto de coleta com limite de 120 caracteres e sem nome vazio', () => {
    expect(pointSchema.safeParse({ nome: '' }).success).toBe(false);
    expect(pointSchema.safeParse({ nome: '   ' }).success).toBe(false);
    expect(pointSchema.safeParse({ nome: 'Balcão 1' }).success).toBe(true);
    expect(pointSchema.safeParse({ nome: 'a'.repeat(121) }).success).toBe(false);
  });
});
