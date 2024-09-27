import { AxiosPromise } from "axios";
import request from "@/utils/request";

export function delayPage(params: any) {
    return request({
      url: "/api/v1/delay/page",
      method: "get",
      params
    });
  }