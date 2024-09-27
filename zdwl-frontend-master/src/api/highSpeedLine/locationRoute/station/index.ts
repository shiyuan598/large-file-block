import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { stationForm } from "./types";
import { stationPageVO } from "./types";
import { stationQuery } from "./types";

/**
 * 修改站点信息
 *
 * @param id
 * @param data
 */
export function updateStation(id: number, data: stationForm) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增站点信息
 *
 * @param data
 */
export function addStation(data: any) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station",
    method: "post",
    data: data,
  });
}

/**
 * 导入站点信息
 *
 * @param data
 */
export function importStation(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出站点信息
 *
 * @param data
 */
export function exportStation(queryParams: stationQuery) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 站点信息模板下载
 */
export function getStationTemplate() {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 站点信息分页列表
 *
 * @param queryParams
 */
export function getStationPage(
  queryParams: stationQuery
): AxiosPromise<PageResult<stationPageVO[]>> {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 站点信息分页列表
 *
 * @param queryParams
 */
export function getStationList(data:any): AxiosPromise<stationPageVO> {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/list",
    method: "get",
    params: data,
  });
}

/**
 * 删除站点信息
 *
 * @param ids
 */
export function deleteStation(ids: string) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/" + ids,
    method: "delete",
  });
}
