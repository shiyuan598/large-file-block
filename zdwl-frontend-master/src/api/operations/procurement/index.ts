import { PurchaseETCForm, PurchaseFuelForm, PurchaseUreaForm } from "./types";
import { PurchaseETCPageVO, PurchaseFuelPageVO, PurchaseUreaPageVO } from "./types";
import { PurchaseETCQuery, PurchaseFuelQuery, PurchaseUreaQuery } from "./types";

import { AxiosPromise } from "axios";
import request from "@/utils/request";

/**
 * 修改尿素采购
 *
 * @param id
 * @param data
 */
export function updateUrea(id: number, data: PurchaseUreaForm) {
  return request({
    url: "/api/v1/purchase/urea/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改ETC采购
 *
 * @param id
 * @param data
 */
export function updateETC(id: number, data: PurchaseETCForm) {
  return request({
    url: "/api/v1/purchase/etc/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改柴油采购
 *
 * @param id
 * @param data
 */
export function updateFuel(id: number, data: PurchaseFuelForm) {
  return request({
    url: "/api/v1/purchase/fuel/" + id,
    method: "put",
    data: data,
  });
}


/**
 * 新增维修轮胎
 *
 * @param data
 */
export function addUrea(data: any) {
  return request({
    url: "/api/v1/purchase/urea",
    method: "post",
    data: data,
  });
}

/**
 * 新增维修其他
 *
 * @param data
 */
export function addETC(data: any) {
  return request({
    url: "/api/v1/purchase/etc",
    method: "post",
    data: data,
  });
}

/**
 * 新增维修黄油
 *
 * @param data
 */
export function addFuel(data: any) {
  return request({
    url: "/api/v1/purchase/fuel",
    method: "post",
    data: data,
  });
}

/**
 * 导入维修轮胎
 *
 * @param data
 */
export function importUrea(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/purchase/urea/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
/**
 * 导入维修其他
 *
 * @param data
 */
export function importETC(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/purchase/etc/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
/**
 * 导入维修黄油
 *
 * @param data
 */
export function importFuel(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/purchase/fuel/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出维修轮胎
 *
 * @param data
 */
export function exportUrea(queryParams: PurchaseUreaQuery) {
  return request({
    url: "/api/v1/purchase/urea/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 导出维修其他
 *
 * @param data
 */
export function exportETC(queryParams: PurchaseETCQuery) {
  return request({
    url: "/api/v1/purchase/etc/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 导出维修黄油
 *
 * @param data
 */
export function exportFuel(queryParams: PurchaseFuelQuery) {
  return request({
    url: "/api/v1/purchase/fuel/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 维修轮胎模板下载
 */
export function getUreaTemplate() {
  return request({
    url: "/api/v1/purchase/urea/template",
    method: "get",
    responseType: "arraybuffer",
  });
}
/**
 * 维修其他模板下载
 */
export function getETCTemplate() {
  return request({
    url: "/api/v1/purchase/etc/template",
    method: "get",
    responseType: "arraybuffer",
  });
}
/**
 * 维修黄油模板下载
 */
export function getFuelTemplate() {
  return request({
    url: "/api/v1/purchase/fuel/template",
    method: "get",
    responseType: "arraybuffer",
  });
}
/**
 * 维修轮胎统计
 */
export function getUreaStat(queryParams : any) {
  return request({
    url: "/api/v1/purchase/urea/stat",
    method: "get",
    params: queryParams
  });
}
/**
 * 维修其他统计
 */
export function getETCStat(queryParams : any) {
  return request({
    url: "/api/v1/purchase/etc/stat",
    method: "get",
    params: queryParams
  });
}
/**
 * 维修黄油统计
 */
export function getFuelStat(queryParams : any) {
  return request({
    url: "/api/v1/purchase/fuel/stat",
    method: "get",
    params: queryParams
  });
}

/**
 * 维修轮胎分页列表
 *
 * @param queryParams
 */
export function getUreaPage(
  queryParams: PurchaseUreaQuery
): AxiosPromise<PageResult<PurchaseUreaPageVO[]>> {
  return request({
    url: "/api/v1/purchase/urea/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 维修其他分页列表
 *
 * @param queryParams
 */
export function getETCPage(
  queryParams: PurchaseETCQuery
): AxiosPromise<PageResult<PurchaseETCPageVO[]>> {
  return request({
    url: "/api/v1/purchase/etc/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 维修黄油分页列表
 *
 * @param queryParams
 */
export function getFuelPage(
  queryParams: PurchaseFuelQuery
): AxiosPromise<PageResult<PurchaseFuelPageVO[]>> {
  return request({
    url: "/api/v1/purchase/fuel/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 删除维修轮胎
 *
 * @param ids
 */
export function deleteUrea(ids: string) {
  return request({
    url: "/api/v1/purchase/urea/" + ids,
    method: "delete",
  });
}

/**
 * 删除维修其他
 *
 * @param ids
 */
export function deleteETC(ids: string) {
  return request({
    url: "/api/v1/purchase/etc/" + ids,
    method: "delete",
  });
}

/**
 * 删除维修黄油
 *
 * @param ids
 */
export function deleteFuel(ids: string) {
  return request({
    url: "/api/v1/purchase/fuel/" + ids,
    method: "delete",
  });
}
