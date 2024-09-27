import { AxiosPromise } from "axios";
import { projectInfoForm } from "./types";
import { projectInfoPageVO } from "./types";
import { projectInfoQuery } from "./types";
import request from "@/utils/request";

/**
 * 修改项目信息
 *
 * @param id
 * @param data
 */
export function updateInfo(id: number, data: projectInfoForm) {
  return request({
    url: "/api/v1/highSpeedLine/project/info/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增项目信息
 *
 * @param data
 */
export function addInfo(data: any) {
  return request({
    url: "/api/v1/highSpeedLine/project/info",
    method: "post",
    data: data,
  });
}

/**
 * 导入项目信息
 *
 * @param data
 */
export function importInfo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/highSpeedLine/project/info/_import",
    method: "post",
    responseType: "arraybuffer",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出项目信息
 *
 * @param data
 */
export function exportInfo(queryParams: projectInfoQuery) {
  return request({
    url: "/api/v1/highSpeedLine/project/info/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 项目信息模板下载
 */
export function getInfoTemplate() {
  return request({
    url: "/api/v1/highSpeedLine/project/info/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 项目信息分页列表
 *
 * @param queryParams
 */
export function getInfoPage(
  queryParams: projectInfoQuery
): AxiosPromise<PageResult<projectInfoPageVO[]>> {
  return request({
    url: "/api/v1/highSpeedLine/project/info/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除项目信息
 *
 * @param ids
 */
export function deleteInfo(ids: string) {
  return request({
    url: "/api/v1/highSpeedLine/project/info/" + ids,
    method: "delete",
  });
}

/**
 * 项目信息列表
 *
 * @param queryParams
 */
export function getInfoList(data : any): AxiosPromise<projectInfoPageVO> {
  return request({
    url: "/api/v1/highSpeedLine/project/info/list",
    method: "get",
    params: data,
  });
}
