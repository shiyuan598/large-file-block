import request from "@/utils/request";
import { dispatchAccrual } from "./types"
export function getDispatchAccrual(params: dispatchAccrual) {
    return request({
      url: '/api/v1/dispatchAccrual/bill/page',
      method: "get",
      params
    });
  }


// 总金额
export function billStat(params:any) {
  return request({
    url: "/api/v1/dispatchAccrual/bill/stat",
    method: "get",
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}