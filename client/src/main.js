import "./assets/main.css";

import { createApp, inject } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import naive from "naive-ui";
import { createDiscreteApi } from "naive-ui";
const { message, notification, dialog } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
]);

import axios from "axios";
// 设置服务端公共地址
axios.defaults.baseURL = "http://localhost:8080";

const app = createApp(App);

// 全局使用axios
app.provide("axios", axios);
// 在需要使用的地方用inject注入
// import { inject } from "vue";
// const axios = inject("axios");
app.provide("server_url", axios.defaults.baseURL)

// 全局使用ui中的一些组件
app.provide("message", message);
app.provide("dialog", dialog);
app.provide("notification", notification);

app.use(naive);
app.use(createPinia());

// 设置拦截件携带token
// 用到了pinia,一定要放在pinia后面
import { AdminStore } from "./stores/AdminStore";
const adminStore = AdminStore();
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token;
  return config;
});

app.use(router);
app.mount("#app");
