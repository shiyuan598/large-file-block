import { AxiosPromise } from "axios";
import { ParkingForm } from "./types";
import { ParkingPageVO } from "./types";
import { ParkingQuery } from "./types";
import request from "@/utils/request";

/**
 * 修改固定停车
 *
 * @param id
 * @param data
 */
export function updateParking(id: number, data: ParkingForm) {
  return request({
    url: "/api/v1/parking/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增固定停车
 *
 * @param data
 */
export function addParking(data: any) {
  return request({
    url: "/api/v1/parking",
    method: "post",
    data: data,
  });
}

/**
 * 导入固定停车
 *
 * @param data
 */
export function importParking(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/parking/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出固定停车
 * 
 * @param data
 */
export function exportParking(queryParams: ParkingQuery) {
  return request({
    url: "/api/v1/parking/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 固定停车模板下载
 */
export function getParkingTemplate() {
  return request({
    url: "/api/v1/parking/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 固定停车统计
 */
export function getParkingStat(queryParams: any) {
  return request({
    url: "/api/v1/parking/stat",
    method: "get",
    params: queryParams
  });
}

/**
 * 固定停车分页列表
 *
 * @param queryParams
 */
export function getParkingPage(
  queryParams: ParkingQuery
): AxiosPromise<PageResult<ParkingPageVO[]>> {
  return request({
    url: "/api/v1/parking/page",
    method: "get",
    params: queryParams,
  });
}


/**
 * 删除固定停车
 *
 * @param ids
 */
export function deleteParking(ids: string) {
  return request({
    url: "/api/v1/parking/" + ids,
    method: "delete",
  });
}
