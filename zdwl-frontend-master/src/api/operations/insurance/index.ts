import { AxiosPromise } from "axios";
import { InsuranceForm } from "./types";
import { InsurancePageVO } from "./types";
import { InsuranceQuery } from "./types";
import request from "@/utils/request";

/**
 * 修改保险记录
 *
 * @param id
 * @param data
 */
export function updateInsurance(id: number, data: InsuranceForm) {
  return request({
    url: "/api/v1/insurance/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增保险记录
 *
 * @param data
 */
export function addInsurance(data: any) {
  return request({
    url: "/api/v1/insurance",
    method: "post",
    data: data,
  });
}

/**
 * 导入保险记录
 *
 * @param data
 */
export function importInsurance(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/insurance/_import",
    method: "post",
    responseType: "arraybuffer",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出保险记录
 * 
 * @param data
 */
export function exportInsurance(queryParams: InsuranceQuery) {
  return request({
    url: "/api/v1/insurance/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 保险记录模板下载
 */
export function getInsuranceTemplate() {
  return request({
    url: "/api/v1/insurance/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 保险记录统计
 */
export function getInsuranceStat(queryParams : any) {
  return request({
    url: "/api/v1/insurance/stat",
    method: "get",
    params: queryParams
  });
}

/**
 * 保险记录分页列表
 *
 * @param queryParams
 */
export function getInsurancePage(
  queryParams: InsuranceQuery
): AxiosPromise<PageResult<InsurancePageVO[]>> {
  return request({
    url: "/api/v1/insurance/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除保险记录
 *
 * @param ids
 */
export function deleteInsurance(ids: string) {
  return request({
    url: "/api/v1/insurance/" + ids,
    method: "delete",
  });
}
