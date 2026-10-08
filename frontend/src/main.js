import { createApp } from 'vue';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/admin.css';
import App from './App.vue';
import router from './router/index.js';

createApp(App).use(router).mount('#app');
