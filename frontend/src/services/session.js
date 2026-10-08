import { reactive, readonly } from 'vue';
import { ApiError, configureAuthorization, request } from '../lib/api.js';
import { sessionSchema, tokenExpiry } from '../lib/authSchemas.js';

export const SESSION_KEY = 'feedqr.session.v1';
const state = reactive({ phase: 'anonymous', usuario: null, expiresAt: null, reason: '', error: '' });
let token = null;
let expirationTimer;
let restorePromise;

function storage() {
  try { return globalThis.sessionStorage; } catch { return null; }
}

function clear(reason = '') {
  clearTimeout(expirationTimer);
  token = null;
  Object.assign(state, { phase: 'anonymous', usuario: null, expiresAt: null, reason, error: '' });
  try { storage()?.removeItem(SESSION_KEY); } catch { /* In-memory logout still succeeds. */ }
}

function armExpiration() {
  clearTimeout(expirationTimer);
  const currentToken = token;
  expirationTimer = setTimeout(() => {
    if (token === currentToken) clear('expired');
  }, Math.min(Math.max(state.expiresAt - Date.now(), 0), 2147483647));
}

function adopt(payload, phase) {
  const parsed = sessionSchema.parse(payload);
  const expiresAt = tokenExpiry(parsed.token);
  if (!expiresAt || expiresAt <= Date.now()) { clear('expired'); return false; }
  token = parsed.token;
  Object.assign(state, { phase, usuario: parsed.usuario, expiresAt, reason: '', error: '' });
  armExpiration();
  return true;
}

async function verify() {
  if (!token) return;
  const verifyingToken = token;
  state.phase = 'checking';
  state.error = '';
  try {
    // This existing private route verifies the session; its survey data is not used here.
    await request('/pesquisas?limite=1');
    if (token === verifyingToken) state.phase = 'authenticated';
  } catch (error) {
    if (token === verifyingToken) { state.phase = 'unavailable'; state.error = error.message; }
  }
}

async function restore() {
  if (restorePromise) return restorePromise;
  restorePromise = (async () => {
    try {
      const cached = storage()?.getItem(SESSION_KEY);
      if (cached && adopt(JSON.parse(cached), 'checking')) await verify();
    } catch { clear(); }
  })();
  return restorePromise;
}

async function authenticate(path, body) {
  const result = sessionSchema.safeParse(await request(path, { method: 'POST', body, authenticated: false }));
  if (!result.success) throw new ApiError('Recebemos uma resposta inesperada. Tente novamente.');
  const payload = result.data;
  if (!adopt(payload, 'authenticated')) throw new Error('Sua sess\u00e3o expirou. Entre novamente.');
  try { storage()?.setItem(SESSION_KEY, JSON.stringify(payload)); } catch { /* Keep the active session in memory. */ }
}

configureAuthorization(() => token, rejectedToken => {
  if (rejectedToken === token) clear('expired');
});

export const session = {
  state: readonly(state), restore, retry: verify,
  login: body => authenticate('/auth/login', body),
  register: body => authenticate('/auth/cadastro', body),
  logout: () => clear(),
};
