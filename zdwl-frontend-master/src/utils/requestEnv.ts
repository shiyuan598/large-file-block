import axios from "axios";
import {server} from "./service"

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_ENV_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

server(service)
// 导出 axios 实例
export default service;
