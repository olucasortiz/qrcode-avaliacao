<script setup>
import { useRouter } from 'vue-router';
import { ArrowRight } from '@lucide/vue';
import FormField from '../components/FormField.vue';
import FormNotice from '../components/FormNotice.vue';
import AppButton from '../components/AppButton.vue';
import { useAuthForm } from '../composables/useAuthForm.js';
import { registerSchema } from '../lib/authSchemas.js';
import { session } from '../services/session.js';

const router = useRouter();
const { values, errors, error, pending, slowPending, formElement, validateField, edited, submit } = useAuthForm(registerSchema,
  { empresa: { nome: '', email: '' }, nome: '', email: '', senha: '' },
  async data => { await session.register(data); await router.replace({ name: 'dashboard' }); });
</script>

<template>
  <section class="auth-view auth-view--register" aria-labelledby="register-heading">
    <header class="auth-heading"><h1 id="register-heading">Crie sua conta.</h1></header>
    <form ref="formElement" novalidate :aria-busy="pending" @submit.prevent="submit">
      <FormNotice v-if="error">{{ error }}</FormNotice>
      <FormNotice v-else-if="slowPending" tone="info">Conectando ao servidor... Aguarde mais um momento.</FormNotice>
      <fieldset class="form-section" :disabled="pending">
        <legend><span class="section-index" aria-hidden="true">01</span> Empresa</legend>
        <div class="form-stack">
          <FormField id="company-name" v-model="values.empresa.nome" label="Nome da empresa" autocomplete="organization" maxlength="120" :error="errors['empresa.nome']" @blur="validateField('empresa.nome')" @edit="edited('empresa.nome')" />
          <FormField id="company-email" v-model="values.empresa.email" label="Email da empresa" type="email" autocomplete="section-company email" maxlength="254" :error="errors['empresa.email']" @blur="validateField('empresa.email')" @edit="edited('empresa.email')" />
        </div>
      </fieldset>
      <fieldset class="form-section" :disabled="pending">
        <legend><span class="section-index" aria-hidden="true">02</span> Sua conta</legend>
        <div class="form-stack">
          <FormField id="user-name" v-model="values.nome" label="Seu nome" autocomplete="name" maxlength="120" :error="errors.nome" @blur="validateField('nome')" @edit="edited('nome')" />
          <FormField id="user-email" v-model="values.email" label="Seu email" type="email" autocomplete="section-user username" maxlength="254" :error="errors.email" @blur="validateField('email')" @edit="edited('email')" />
          <FormField id="register-password" v-model="values.senha" label="Senha" type="password" autocomplete="new-password" maxlength="72" :error="errors.senha" @blur="validateField('senha')" @edit="edited('senha')" />
        </div>
      </fieldset>
      <AppButton type="submit" :loading="pending" class="auth-submit">Criar conta <ArrowRight :size="17" aria-hidden="true" /></AppButton>
    </form>
    <p class="auth-alternative">J&#x00e1; tem uma conta? <RouterLink :to="{ name: 'login' }">Entrar <ArrowRight :size="14" aria-hidden="true" /></RouterLink></p>
  </section>
</template>
