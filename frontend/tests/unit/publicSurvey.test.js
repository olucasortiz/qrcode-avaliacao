import { describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import { ApiError } from '../../src/lib/api.js';
import { usePublicSurvey } from '../../src/composables/usePublicSurvey.js';
import { answerError, originSchema, publicSurveySchema, responsePayload } from '../../src/lib/publicSurveySchemas.js';

const questions = ['ESTRELAS', 'NPS', 'SIM_NAO', 'TEXTO', 'MULTIPLA_ESCOLHA'].map((tipo, i) => ({
  id: randomUUID(), texto: `Pergunta ${i + 1}`, tipo, obrigatoria: tipo !== 'TEXTO',
  ...(tipo === 'MULTIPLA_ESCOLHA' ? { opcoes: [{ id: randomUUID(), texto: 'A' }, { id: randomUUID(), texto: 'B' }] } : {}),
}));
const survey = { titulo: 'Sua experiência', descricao: null, slug: 'experiencia', perguntas: questions };
const values = [5, 0, false, '  Uma opinião.  ', questions[4].opcoes[1].id];
async function setup(data = survey) {
  const service = { get: vi.fn().mockResolvedValue(data), submit: vi.fn().mockResolvedValue(undefined) };
  const state = usePublicSurvey(service);
  await state.load(data.slug, undefined);
  state.start();
  return { service, state };
}
async function complete(state) {
  for (let i = 0; i < values.length - 1; i++) { state.setAnswer(values[i]); await state.next(); }
  state.setAnswer(values.at(-1));
}

describe('Contrato da pesquisa pública', () => {
  it('aceita os cinco tipos e mantém a ordem recebida', () => {
    expect(publicSurveySchema.parse(survey).perguntas.map(item => item.tipo)).toEqual(questions.map(item => item.tipo));
    expect(publicSurveySchema.parse(survey).perguntas.at(-1).opcoes).toEqual(questions.at(-1).opcoes);
  });
  it('rejeita pesquisa vazia, perguntas desconhecidas, alternativas inválidas e IDs duplicados', () => {
    for (const perguntas of [[], [{ ...questions[0], tipo: 'NOVO' }], [{ ...questions[4], opcoes: [] }], [questions[0], questions[0]]]) {
      expect(publicSurveySchema.safeParse({ ...survey, perguntas }).success).toBe(false);
    }
  });
  it('valida obrigatoriedade, limites, false e zero sem coerção incompatível', () => {
    questions.forEach((q, i) => expect(answerError(q, values[i])).toBe(''));
    expect(answerError(questions[0], undefined)).toContain('Responda');
    for (const value of [0, 6, 1.5, '5']) expect(answerError(questions[0], value)).not.toBe('');
    for (const value of [-1, 11, 0.5]) expect(answerError(questions[1], value)).not.toBe('');
    expect(answerError(questions[2], 'false')).not.toBe('');
    expect(answerError(questions[3], ' '.repeat(2000))).toBe('');
    expect(answerError({ ...questions[3], obrigatoria: true }, ' ')).not.toBe('');
    expect(answerError(questions[3], 'x'.repeat(2000))).toBe('');
    expect(answerError(questions[3], 'x'.repeat(2001))).not.toBe('');
    expect(answerError(questions[4], randomUUID())).not.toBe('');
  });
  it('monta o payload real, inclui origem, remove opcionais vazias e mantém zero/false', () => {
    const answers = Object.fromEntries(questions.map((q, i) => [q.id, values[i]]));
    const origem = randomUUID();
    expect(responsePayload(survey, answers, origem)).toEqual({ origem, respostas: questions.map((q, i) => ({ perguntaId: q.id, valor: typeof values[i] === 'string' ? values[i].trim() : values[i] })) });
    answers[questions[3].id] = '  ';
    expect(responsePayload(survey, answers).respostas).toHaveLength(4);
    expect(responsePayload(survey, answers)).not.toHaveProperty('origem');
    expect(originSchema.safeParse(['origem', 'outra']).success).toBe(false);
    expect(originSchema.safeParse('').success).toBe(false);
    expect(originSchema.safeParse(null).success).toBe(false);
  });
});

describe('Fluxo público', () => {
  it('carrega sem autenticação, navega e preserva respostas ao voltar', async () => {
    const { state, service } = await setup();
    expect(service.get).toHaveBeenCalledWith('experiencia', undefined);
    await state.next();
    expect(state.index.value).toBe(0);
    expect(state.fieldError.value).toContain('Responda');
    state.setAnswer(5); await state.next();
    state.setAnswer(0); state.back();
    expect(state.answers[questions[0].id]).toBe(5);
    await state.next();
    expect(state.answers[questions[1].id]).toBe(0);
  });
  it('pula opcionais e só mostra agradecimento após confirmação', async () => {
    const { state, service } = await setup();
    state.setAnswer(5); await state.next();
    state.setAnswer(0); await state.next();
    state.setAnswer(false); await state.next();
    await state.next();
    expect(state.index.value).toBe(4);
    let confirm;
    service.submit.mockImplementation(() => new Promise(resolve => { confirm = resolve; }));
    state.setAnswer(values[4]);
    const pending = state.next();
    expect(state.phase.value).toBe('questions');
    expect(state.sending.value).toBe(true);
    expect(service.submit.mock.calls[0][1].respostas).toHaveLength(4);
    confirm(); await pending;
    expect(state.phase.value).toBe('success');
  });
  it('impede cliques simultâneos e repete o mesmo payload/chave após resultado incerto', async () => {
    const { state, service } = await setup();
    await complete(state);
    let reject;
    service.submit.mockImplementationOnce(() => new Promise((resolve, fail) => { reject = fail; }));
    const pending = state.next();
    await state.next(); await state.submit(); state.back(); state.setAnswer(values[4] === questions[4].opcoes[0].id ? values[4] : questions[4].opcoes[0].id);
    expect(service.submit).toHaveBeenCalledTimes(1);
    reject(new ApiError('Sem conexão')); await pending;
    expect(state.phase.value).toBe('questions');
    expect(state.uncertain.value).toBe(true);
    state.back();
    expect(state.index.value).toBe(4);
    await state.submit();
    expect(service.submit.mock.calls[1]).toEqual(service.submit.mock.calls[0]);
    expect(state.phase.value).toBe('success');
  });
  it('preserva respostas e permite revisar após rejeição definitiva de validação', async () => {
    const { state, service } = await setup();
    await complete(state);
    service.submit.mockRejectedValueOnce(new ApiError('Erro interno não exibido', 400));
    await state.next();
    expect(state.uncertain.value).toBe(false);
    expect(state.sendError.value.message).not.toContain('interno');
    state.back();
    expect(state.answers[questions[2].id]).toBe(false);
    await state.next(); await state.next();
    expect(service.submit.mock.calls[0][2]).not.toBe(service.submit.mock.calls[1][2]);
  });
  it.each([404, 400, 0, 429])('trata indisponibilidade/conexão (%s) sem expor erros internos', async status => {
    const service = { get: vi.fn().mockRejectedValue(new ApiError('stack sensível', status)) };
    const state = usePublicSurvey(service);
    await state.load('experiencia', randomUUID());
    expect(state.phase.value).toBe('error');
    expect(state.loadError.value.message).not.toContain('stack');
  });
  it('não consulta a API com token malformado', async () => {
    const { state, service } = await setup();
    service.get.mockClear();
    await state.load('experiencia', ['duas', 'origens']);
    expect(service.get).not.toHaveBeenCalled();
    expect(state.phase.value).toBe('error');
  });
  it('descarta carregamento antigo se a rota mudar', async () => {
    let resolve;
    const service = { get: vi.fn().mockImplementationOnce(() => new Promise(done => { resolve = done; })).mockResolvedValue(survey) };
    const state = usePublicSurvey(service);
    const old = state.load('antiga');
    await state.load('experiencia');
    resolve({ ...survey, titulo: 'Antiga' }); await old;
    expect(state.survey.value.titulo).toBe(survey.titulo);
  });
  it('envia pesquisa com todas as perguntas opcionais puladas', async () => {
    const data = { ...survey, perguntas: [{ ...questions[3], obrigatoria: false }] };
    const { state, service } = await setup(data);
    await state.next();
    expect(service.submit.mock.calls[0][1]).toEqual({ respostas: [] });
    expect(state.phase.value).toBe('success');
  });
});
