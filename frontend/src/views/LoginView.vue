<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@lucide/vue';
import FormField from '../components/FormField.vue';
import FormNotice from '../components/FormNotice.vue';
import AppButton from '../components/AppButton.vue';
import { useAuthForm } from '../composables/useAuthForm.js';
import { loginSchema } from '../lib/authSchemas.js';
import { session } from '../services/session.js';

const route = useRoute();
const router = useRouter();
const expired = computed(() => route.query.motivo === 'expirada' || session.state.reason === 'expired');
const { values, errors, error, pending, slowPending, formElement, validateField, edited, submit } = useAuthForm(loginSchema,
  { email: '', senha: '' }, async data => { await session.login(data); await router.replace({ name: 'dashboard' }); });
</script>

<template>
  <section class="auth-view auth-view--login" aria-labelledby="login-heading">
    <header class="auth-heading"><h1 id="login-heading">Entre na sua conta.</h1><p>Bem-vindo de volta.</p></header>
    <form ref="formElement" novalidate :aria-busy="pending" @submit.prevent="submit">
      <FormNotice v-if="expired" tone="info">Sua sess&#x00e3;o expirou. Entre novamente.</FormNotice>
      <FormNotice v-if="error">{{ error }}</FormNotice>
      <FormNotice v-else-if="slowPending" tone="info">Conectando ao servidor... Aguarde mais um momento.</FormNotice>
      <div class="form-stack">
        <FormField id="login-email" v-model="values.email" label="Email" type="email" autocomplete="username" maxlength="254" :error="errors.email" :disabled="pending" @blur="validateField('email')" @edit="edited('email')" />
        <FormField id="login-password" v-model="values.senha" label="Senha" type="password" autocomplete="current-password" maxlength="72" :error="errors.senha" :disabled="pending" @blur="validateField('senha')" @edit="edited('senha')" />
      </div>
      <AppButton type="submit" :loading="pending" class="auth-submit">Entrar <ArrowRight :size="17" aria-hidden="true" /></AppButton>
    </form>
    <p class="auth-alternative">Ainda n&#x00e3;o tem uma conta? <RouterLink :to="{ name: 'register' }">Criar conta <ArrowRight :size="14" aria-hidden="true" /></RouterLink></p>
  </section>
</template>
