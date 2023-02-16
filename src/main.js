import { createApp } from "vue";
import { createPinia } from "pinia";
import './utils/axios'

import App from "./App.vue";
import router from "./router";

import "bootstrap";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
