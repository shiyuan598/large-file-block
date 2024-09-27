import { AxiosPromise } from "axios";
import { lineinfoForm } from "./types";
import { lineinfoPageVO } from "./types";
import { lineinfoQuery } from "./types";
import request from "@/utils/request";

/**
 * 修改路线信息
 *
 * @param id
 * @param data
 */
export function updateLineinfo(id: number, data: lineinfoForm) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增路线信息
 *
 * @param data
 */
export function addLineinfo(data: any) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo",
    method: "post",
    data: data,
  });
}

/**
 * 导入路线信息
 *
 * @param data
 */
export function importLineinfo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出路线信息
 *
 * @param data
 */
export function exportLineinfo(queryParams: lineinfoQuery) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 路线信息模板下载
 */
export function getLineinfoTemplate() {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 路线信息分页列表
 *
 * @param queryParams
 */
export function getLineinfoPage(
  queryParams: lineinfoQuery
): AxiosPromise<PageResult<lineinfoPageVO[]>> {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 删除路线信息
 *
 * @param ids
 */
export function deleteLineinfo(ids: string) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/" + ids,
    method: "delete",
  });
}

/**
 * 路线信息分页列表
 *
 * @param queryParams
 */
export function getLineinfoList(data:any): AxiosPromise<lineinfoPageVO> {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/list",
    method: "get",
    params: data,
  });
}
