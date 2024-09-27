import { AccidentForm } from "./types";
import { AccidentPageVO } from "./types";
import { AccidentQuery } from "./types";
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/**
 * 修改事故管理
 *
 * @param id
 * @param data
 */
export function updateAccident(id: number, data: AccidentForm) {
  return request({
    url: "/api/v1/accident/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增事故管理
 *
 * @param data
 */
export function addAccident(data: any) {
  return request({
    url: "/api/v1/accident",
    method: "post",
    data: data,
  });
}

/**
 * 导入事故管理
 *
 * @param data
 */
export function importAccident(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/accident/_import",
    method: "post",
    responseType: "arraybuffer",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出事故管理
 * 
 * @param data
 */
export function exportAccident(queryParams: AccidentQuery) {
  return request({
    url: "/api/v1/accident/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 事故管理模板下载
 */
export function getAccidentTemplate() {
  return request({
    url: "/api/v1/accident/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 事故管理统计
 */
export function getAccidentStat(queryParams : any) {
  return request({
    url: "/api/v1/accident/stat",
    method: "get",
    params: queryParams
  });
}

/**
 * 事故管理分页列表
 *
 * @param queryParams
 */
export function getAccidentPage(
  queryParams: AccidentQuery
): AxiosPromise<PageResult<AccidentPageVO[]>> {
  return request({
    url: "/api/v1/accident/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除事故管理
 *
 * @param ids
 */
export function deleteAccident(ids: string) {
  return request({
    url: "/api/v1/accident/" + ids,
    method: "delete",
  });
}
