import { AxiosPromise } from "axios";
import { LeaseForm } from "./types";
import { LeasePageVO } from "./types";
import { LeaseQuery } from "./types";
import request from "@/utils/request";

/**
 * 修改租赁管理
 *
 * @param id
 * @param data
 */
export function updateLease(id: number, data: LeaseForm) {
  return request({
    url: "/api/v1/lease/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增租赁管理
 *
 * @param data
 */
export function addLease(data: any) {
  return request({
    url: "/api/v1/lease",
    method: "post",
    data: data,
  });
}

/**
 * 导入租赁管理
 *
 * @param data
 */
export function importLease(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/lease/_import",
    method: "post",
    responseType: "arraybuffer",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出租赁管理
 * 
 * @param data
 */
export function exportLease(queryParams: LeaseQuery) {
  return request({
    url: "/api/v1/lease/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 租赁管理模板下载
 */
export function getLeaseTemplate() {
  return request({
    url: "/api/v1/lease/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 租赁管理统计
 */
export function getLeaseStat(queryParams : any) {
  return request({
    url: "/api/v1/lease/stat",
    method: "get",
    params: queryParams
  });
}

/**
 * 租赁管理分页列表
 *
 * @param queryParams
 */
export function getLeasePage(
  queryParams: LeaseQuery
): AxiosPromise<PageResult<LeasePageVO[]>> {
  return request({
    url: "/api/v1/lease/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除租赁管理
 *
 * @param ids
 */
export function deleteLease(ids: string) {
  return request({
    url: "/api/v1/lease/" + ids,
    method: "delete",
  });
}
