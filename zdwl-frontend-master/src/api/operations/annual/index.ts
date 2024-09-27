import { AnnualInspectionExaminedForm } from "./types";
import { AnnualInspectionExaminedPageVO } from "./types";
import { AnnualInspectionExaminedQuery } from "./types";
import { AxiosPromise } from "axios";
import request from "@/utils/request";

/**
 * 修改年检信息车
 *
 * @param id
 * @param data
 */
export function updateExamined(id: number, data: AnnualInspectionExaminedForm) {
  return request({
    url: "/api/v1/examined/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增年检信息
 *
 * @param data
 */
export function addExamined(data: any) {
  return request({
    url: "/api/v1/examined",
    method: "post",
    data: data,
  });
}

/**
 * 导入年检信息
 *
 * @param data
 */
export function importExamined(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/examined/_import",
    method: "post",
    responseType: "arraybuffer",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出年检信息
 *
 * @param data
 */
export function exportExamined(queryParams: AnnualInspectionExaminedQuery) {
  return request({
    url: "/api/v1/examined/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 年检信息模板下载
 */
export function getExaminedTemplate() {
  return request({
    url: "/api/v1/examined/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 年检信息统计
 */
export function getExaminedStat(queryParams : any) {
  return request({
    url: "/api/v1/examined/stat",
    method: "get",
    params: queryParams
  });
}

/**
 * 年检信息分页列表
 *
 * @param queryParams
 */
export function getExaminedPage(
  queryParams: AnnualInspectionExaminedQuery
): AxiosPromise<PageResult<AnnualInspectionExaminedPageVO[]>> {
  return request({
    url: "/api/v1/examined/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除年检信息
 *
 * @param ids
 */
export function deleteExamined(ids: string) {
  return request({
    url: "/api/v1/examined/" + ids,
    method: "delete",
  });
}
