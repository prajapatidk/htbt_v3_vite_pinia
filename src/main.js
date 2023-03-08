import { createApp } from "vue";
import { createPinia } from "pinia";
import './utils/axios'
import { SetupCalendar } from 'v-calendar';

import App from "./App.vue";
import router from "./router";

import "bootstrap";

import "./assets/main.css";
import 'v-calendar/dist/style.css';

const app = createApp(App);
app.use(SetupCalendar, {})
app.use(createPinia());
app.use(router);

app.mount("#app");
