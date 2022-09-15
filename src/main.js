import 'vuetify/styles'; //
import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import router from '@/routes';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';

const app = createApp(App);

const vuetify = createVuetify();

app.use(router);
app.use(vuetify);

// app.use(globalDirectives);
// app.use(globalComponents);
const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);
// app.use(validate);
app.mount('#app');
