import { useUserStoreHook } from "@/store/modules/user";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { refreshTokenApi } from "@/api/auth";
import { useStorage } from "@vueuse/core";
const userStore = useUserStoreHook();

let isRefreshing = false

//重试队列
let requests = []
export function server(service: any) {
    // 请求拦截器
    service.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {

            if (userStore.token) {
                config.headers.Authorization = userStore.token;
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );
    // 响应拦截器
    service.interceptors.response.use(
        (response: AxiosResponse) => {
            const { code, msg } = response.data;
            if (code === "00000" || code === "A0704") {
                return response.data;
            }
            // 响应数据为二进制流处理(Excel导出)
            if (response.data instanceof ArrayBuffer) {
                return response;
            }

            ElMessage.error(msg || "系统出错");
            return Promise.reject(new Error(msg || "Error"));
        },
        async (error: any) => {
            const { response, config } = error;
            if (error.response.data) {
                const { code, msg } = error.response.data;
                if (code === "A0230") {
                    if (!isRefreshing) {
                        isRefreshing = true
                        const refreshTokenValue = useStorage("refreshTokenValue");
                        const { data } = await refreshTokenApi({ refreshToken: refreshTokenValue.value }).finally(()=>{
                            isRefreshing = false
                        });
                        // useStorage("accessToken", data.tokenType + " " + data.accessToken);
                        // useStorage("refreshTokenValue", data.refreshToken);
                        userStore.token = data.tokenType + " " + data.accessToken;
                        userStore.refreshTokenValue = data.refreshToken;
                        response.headers.Authorization = data.tokenType + " " + data.accessToken;
                        requests.forEach((cb) => cb(data.tokenType + " " + data.accessToken))
                        requests = []
                        return service(response.config)
                    }else{
                        return new Promise(resolve =>{
                            requests.push(token=>{
                                response.headers.Authorization = token;
                                resolve(service(response.config))
                            })
                            
                        })
                    }

                } else
                    // token 过期,重新登录
                    if (code === "A0231") {
                        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
                            confirmButtonText: "确定",
                            type: "warning",
                        }).then(() => {
                            localStorage.clear();
                            window.location.href = "/zdwl";
                        });
                    } else {
                        ElMessage.error(msg || "系统出错");
                    }
            }
            return Promise.reject(error.message);
        }
    );

}