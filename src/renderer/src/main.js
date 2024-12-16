/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module defines the entry point of the vue.js frontend
 */
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

app.mount('#app');
