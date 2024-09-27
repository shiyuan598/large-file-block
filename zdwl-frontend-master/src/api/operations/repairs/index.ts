import { RepairButterForm, RepairOtherForm, RepairTireForm, RepairUpkeepForm } from "./types";
import { RepairButterPageVO, RepairOtherPageVO, RepairTirePageVO, RepairUpkeepPageVO } from "./types";
import { RepairButterQuery, RepairOtherQuery, RepairTireQuery, RepairUpkeepQuery } from "./types";

import { AxiosPromise } from "axios";
import request from "@/utils/request";

/**
 * 修改维修保养车
 *
 * @param id
 * @param data
 */
export function updateUpkeep(id: number, data: RepairUpkeepForm) {
  return request({
    url: "/api/v1/repair/upkeep/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改维修轮胎车
 *
 * @param id
 * @param data
 */
export function updateTire(id: number, data: RepairTireForm) {
  return request({
    url: "/api/v1/repair/tire/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改维修其他车
 *
 * @param id
 * @param data
 */
export function updateOther(id: number, data: RepairOtherForm) {
  return request({
    url: "/api/v1/repair/other/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改维修黄油车
 *
 * @param id
 * @param data
 */
export function updateButter(id: number, data: RepairButterForm) {
  return request({
    url: "/api/v1/repair/butter/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增维修保养
 *
 * @param data
 */
export function addUpkeep(data: any) {
  return request({
    url: "/api/v1/repair/upkeep",
    method: "post",
    data: data,
  });
}

/**
 * 新增维修轮胎
 *
 * @param data
 */
export function addTire(data: any) {
  return request({
    url: "/api/v1/repair/tire",
    method: "post",
    data: data,
  });
}

/**
 * 新增维修其他
 *
 * @param data
 */
export function addOther(data: any) {
  return request({
    url: "/api/v1/repair/other",
    method: "post",
    data: data,
  });
}

/**
 * 新增维修黄油
 *
 * @param data
 */
export function addButter(data: any) {
  return request({
    url: "/api/v1/repair/butter",
    method: "post",
    data: data,
  });
}

/**
 * 导入维修保养
 *
 * @param data
 */
export function importUpkeep(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/repair/upkeep/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
/**
 * 导入维修轮胎
 *
 * @param data
 */
export function importTire(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/repair/tire/_import",
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
export function importOther(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/repair/other/_import",
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
export function importButter(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/repair/butter/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出维修保养
 *
 * @param data
 */
export function exportUpkeep(queryParams: RepairUpkeepQuery) {
  return request({
    url: "/api/v1/repair/upkeep/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 导出维修轮胎
 *
 * @param data
 */
export function exportTire(queryParams: RepairTireQuery) {
  return request({
    url: "/api/v1/repair/tire/_export",
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
export function exportOther(queryParams: RepairOtherQuery) {
  return request({
    url: "/api/v1/repair/other/_export",
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
export function exportButter(queryParams: RepairButterQuery) {
  return request({
    url: "/api/v1/repair/butter/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 维修保养模板下载
 */
export function getUpkeepTemplate() {
  return request({
    url: "/api/v1/repair/upkeep/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 维修轮胎模板下载
 */
export function getTireTemplate() {
  return request({
    url: "/api/v1/repair/tire/template",
    method: "get",
    responseType: "arraybuffer",
  });
}
/**
 * 维修其他模板下载
 */
export function getOtherTemplate() {
  return request({
    url: "/api/v1/repair/other/template",
    method: "get",
    responseType: "arraybuffer",
  });
}
/**
 * 维修黄油模板下载
 */
export function getButterTemplate() {
  return request({
    url: "/api/v1/repair/butter/template",
    method: "get",
    responseType: "arraybuffer",
  });
}
/**
 * 维修保养统计
 */
export function getUpkeepStat(queryParams: any) {
  return request({
    url: "/api/v1/repair/upkeep/stat",
    method: "get",
    params: queryParams
  });
}
/**
 * 维修轮胎统计
 */
export function getTireStat(queryParams: any) {
  return request({
    url: "/api/v1/repair/tire/stat",
    method: "get",
    params: queryParams
  });
}
/**
 * 维修其他统计
 */
export function getOtherStat(queryParams: any) {
  return request({
    url: "/api/v1/repair/other/stat",
    method: "get",
    params: queryParams
  });
}
/**
 * 维修黄油统计
 */
export function getButterStat(queryParams: any) {
  return request({
    url: "/api/v1/repair/butter/stat",
    method: "get",
    params: queryParams
  });
}

/**
 * 维修保养分页列表
 *
 * @param queryParams
 */
export function getUpkeepPage(
  queryParams: RepairUpkeepQuery
): AxiosPromise<PageResult<RepairUpkeepPageVO[]>> {
  return request({
    url: "/api/v1/repair/upkeep/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 维修轮胎分页列表
 *
 * @param queryParams
 */
export function getTirePage(
  queryParams: RepairTireQuery
): AxiosPromise<PageResult<RepairTirePageVO[]>> {
  return request({
    url: "/api/v1/repair/tire/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 维修其他分页列表
 *
 * @param queryParams
 */
export function getOtherPage(
  queryParams: RepairOtherQuery
): AxiosPromise<PageResult<RepairOtherPageVO[]>> {
  return request({
    url: "/api/v1/repair/other/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 维修黄油分页列表
 *
 * @param queryParams
 */
export function getButterPage(
  queryParams: RepairButterQuery
): AxiosPromise<PageResult<RepairButterPageVO[]>> {
  return request({
    url: "/api/v1/repair/butter/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除维修保养
 *
 * @param ids
 */
export function deleteUpkeep(ids: string) {
  return request({
    url: "/api/v1/repair/upkeep/" + ids,
    method: "delete",
  });
}

/**
 * 删除维修轮胎
 *
 * @param ids
 */
export function deleteTire(ids: string) {
  return request({
    url: "/api/v1/repair/tire/" + ids,
    method: "delete",
  });
}

/**
 * 删除维修其他
 *
 * @param ids
 */
export function deleteOther(ids: string) {
  return request({
    url: "/api/v1/repair/other/" + ids,
    method: "delete",
  });
}

/**
 * 删除维修黄油
 *
 * @param ids
 */
export function deleteButter(ids: string) {
  return request({
    url: "/api/v1/repair/butter/" + ids,
    method: "delete",
  });
}


/**
 * 所有车辆列表
 *
 * @param data
 */
export function vehicleAllList(data: any) {
  return request({
    url: "/api/v1/vehicle/allList",
    method: "get",
    params: data,
  });
}
