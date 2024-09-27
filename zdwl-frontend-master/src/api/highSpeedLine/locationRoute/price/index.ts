import { AxiosPromise } from "axios";
import { priceinfoForm } from "./types";
import { priceinfoPageVO } from "./types";
import { priceinfoQuery } from "./types";
import request from "@/utils/request";

/**
 * 修改单价信息
 *
 * @param id
 * @param data
 */
export function updatePrice(id: number, data: priceinfoForm) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增单价信息
 *
 * @param data
 */
export function addPrice(data: any) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price",
    method: "post",
    data: data,
  });
}

/**
 * 导出单价信息
 *
 * @param data
 */
export function exportPrice(queryParams: priceinfoQuery) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 单价信息模板下载
 */
export function getPriceTemplate() {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price/template",
    method: "get",
    responseType: "arraybuffer",
  });
}


/**
 * 单价信息统计
 */
export function priceAvg(params:any) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price/avg",
    method: "get",
    params:params
  });
}

/**
 * 单价信息分页列表
 *
 * @param queryParams
 */
export function getPricePage(
  queryParams: priceinfoQuery
): AxiosPromise<PageResult<priceinfoPageVO[]>> {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 删除单价信息
 *
 * @param ids
 */
export function deletePrice(ids: string) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price/" + ids,
    method: "delete",
  });
}

/**
 * 获取最新单价信息
 *
 * @param queryParams
 */
export function getOneNewPrice(): AxiosPromise<priceinfoPageVO> {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/price/newPriceInfo",
    method: "get",
  });
}
