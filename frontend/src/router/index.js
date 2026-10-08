import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { session } from '../services/session.js';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: () => import('../layouts/AuthLayout.vue'), children: [
      { path: '', redirect: '/entrar' },
      { path: 'entrar', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true, title: 'Entrar' } },
      { path: 'cadastro', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true, title: 'Criar conta' } },
    ] },
    { path: '/app', component: () => import('../layouts/AdminLayout.vue'), meta: { requiresAuth: true }, children: [
      { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Vis\u00e3o geral' } },
      { path: 'pesquisas', name: 'surveys', component: () => import('../views/SurveysView.vue'), meta: { title: 'Pesquisas' } },
      { path: 'pesquisas/:id', name: 'survey-detail', component: () => import('../views/SurveyDetailView.vue'), meta: { title: 'Pesquisa' } },
      { path: 'conta', name: 'workspace', component: () => import('../views/WorkspaceView.vue'), meta: { title: 'Sua conta' } },
    ] },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: 'P\u00e1gina n\u00e3o encontrada' } },
  ],
});

router.beforeEach(async to => {
  await session.restore();
  const hasSession = session.state.phase !== 'anonymous';
  if (to.meta.requiresAuth && !hasSession) return { name: 'login', query: session.state.reason === 'expired' ? { motivo: 'expirada' } : {} };
  if (to.meta.guestOnly && hasSession) return { name: 'dashboard' };
});
router.afterEach(to => { document.title = `${to.meta.title || 'FeedQR'} | FeedQR`; });

watch(() => session.state.phase, phase => {
  if (phase === 'anonymous' && session.state.reason === 'expired' && router.currentRoute.value.meta.requiresAuth) {
    router.replace({ name: 'login', query: { motivo: 'expirada' } });
  }
});

export default router;
