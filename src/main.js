/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import router from './router';

/*
import GAuth from "vue3-google-oauth2"

const gAuthOptions = {
    clientId: "911892646464-2hcu7egk7dkk2kl8u7glk7b8gt8ojtpu.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/documents.readonly",
    prompt: "consent",
  };
* */


import GoogleSignInPlugin from "vue3-google-signin"
const gOptions =  {
    clientId: 'CLIENT ID OBTAINED FROM GOOGLE API CONSOLE',
  };

const app = createApp(App)

registerPlugins(app)

app.use(router);
app.use(GoogleSignInPlugin,gOptions);
app.mount('#app');
