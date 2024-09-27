import "@/permission";
// 本地SVG图标
import "virtual:svg-icons-register";
// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import 'video.js/dist/video-js.css'

//引入echarts
import * as echarts from 'echarts';

import App from "./App.vue";
import { createApp } from "vue";
// 国际化
import i18n from "@/lang/index";
import router from "@/router";
import { setupDirective } from "@/directive";
import { setupStore } from "@/store";

const app = createApp(App);
// app.config.globalProperties.$echarts = echarts;
app.config.globalProperties.$echarts = echarts;
// 全局注册 自定义指令(directive)
setupDirective(app);
// 全局注册 状态管理(store)
setupStore(app);
app.use(router).use(i18n).mount("#app");
