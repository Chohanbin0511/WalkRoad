import 'vuetify/styles'; //
import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import router from '@/routes';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import HighchartsVue from 'highcharts-vue';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highcharts from 'highcharts';

Highcharts3D(Highcharts);

const app = createApp(App);

const vuetify = createVuetify();
app.use(router);
app.use(vuetify);
app.use(HighchartsVue);

// app.use(globalDirectives);
// app.use(globalComponents);
const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);
// app.use(validate);
app.mount('#app');

app.config.globalProperties.nativeAppKey = 'a1e9b72740cc7ec674067f26394a2142';
app.config.globalProperties.restApiKey = '36e5387cc0f77924d56d106a8075e5d7';
app.config.globalProperties.javaScriptKey = 'c18fab152a25676a077cf400eb2523e8';
app.config.globalProperties.adminKey = '0b22be07a2d4549ff70279c40fe5de40';
app.config.globalProperties.redirectUri = 'http://127.0.0.1:5173/login';

console.log('MODE: ', import.meta.env.MODE);
console.log('BASE_URL: ', import.meta.env.BASE_URL);
console.log('PROD: ', import.meta.env.PROD);
console.log('DEV: ', import.meta.env.DEV);
console.log('DEV: ', import.meta.env.DEV);
console.log('VITE_APP_API_URL: ', import.meta.env.VITE_APP_API_URL);
