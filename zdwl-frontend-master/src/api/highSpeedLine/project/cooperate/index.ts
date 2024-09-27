import { AxiosPromise } from "axios";
import { projectCooperateForm } from "./types";
import { projectCooperatePageVO } from "./types";
import { projectCooperateQuery } from "./types";
import request from "@/utils/request";

/**
 * 修改合作客户车
 *
 * @param id
 * @param data
 */
export function updateCooperate(id: number, data: projectCooperateForm) {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增合作客户
 *
 * @param data
 */
export function addCooperate(data: any) {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate",
    method: "post",
    data: data,
  });
}

/**
 * 导入合作客户
 *
 * @param data
 */
export function importCooperate(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/_import",
    method: "post",
    responseType: "arraybuffer",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出合作客户
 *
 * @param data
 */
export function exportCooperate(queryParams: projectCooperateQuery) {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 合作客户模板下载
 */
export function getCooperateTemplate() {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 合作客户分页列表
 *
 * @param queryParams
 */
export function getCooperatePage(
  queryParams: projectCooperateQuery
): AxiosPromise<PageResult<projectCooperatePageVO[]>> {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除合作客户
 *
 * @param ids
 */
export function deleteCooperate(ids: string) {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/" + ids,
    method: "delete",
  });
}

/**
 * 合作客户列表
 *
 * @param queryParams
 */
export function getCooperateList(data : any): AxiosPromise<projectCooperatePageVO> {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/list",
    method: "get",
    params: data,
  });
}
