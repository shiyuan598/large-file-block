import { CaptchaResult, LoginData, LoginResult } from "./types";

import { AxiosPromise } from "axios";
import request from "@/utils/request";
import Qs from 'qs'
/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  // formData.append("verifyCodeKey", data.verifyCodeKey || "");
  // formData.append("verifyCode", data.verifyCode || "");
  return request({
    url: "/api/v1/auth/login",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/api/v1/auth/logout",
    method: "delete",
  });
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: "/api/v1/auth/captcha",
    method: "get",
  });
}

export function refreshTokenApi(data: any) {
  return request({
    url: "/api/v1/auth/refreshToken",
    method: "post",
    data: Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}