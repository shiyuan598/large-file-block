import { SupplierETCForm, SupplierGasForm, SupplierInsuranceForm, SupplierParkForm, SupplierRepairForm, SupplierTrailerForm } from "./types";
import { SupplierETCPageVO, SupplierGasPageVO, SupplierInsurancePageVO, SupplierParkPageVO, SupplierRepairPageVO, SupplierTrailerPageVO } from "./types";
import { SupplierETCQuery, SupplierGasQuery, SupplierInsuranceQuery, SupplierParkQuery, SupplierRepairQuery, SupplierTrailerQuery } from "./types";

import { AxiosPromise } from "axios";
import request from "@/utils/request";

/**
 * 修改加油站
 *
 * @param id
 * @param data
 */
export function updateFuel(id: number, data: SupplierGasForm) {
  return request({
    url: "/api/v1/supplier/fuel/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改ETC供应商
 *
 * @param id
 * @param data
 */
export function updateETC(id: number, data: SupplierETCForm) {
  return request({
    url: "/api/v1/supplier/etc/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改修理厂
 *
 * @param id
 * @param data
 */
export function updateRepair(id: number, data: SupplierRepairForm) {
  return request({
    url: "/api/v1/supplier/repair/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改保险公司
 *
 * @param id
 * @param data
 */
export function updateInsurance(id: number, data: SupplierInsuranceForm) {
  return request({
    url: "/api/v1/supplier/insurance/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改租赁公司
 *
 * @param id
 * @param data
 */
export function updateLease(id: number, data: SupplierTrailerForm) {
  return request({
    url: "/api/v1/supplier/lease/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改停车场
 *
 * @param id
 * @param data
 */
export function updatePark(id: number, data: SupplierParkForm) {
  return request({
    url: "/api/v1/supplier/parking/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 新增加油站
 *
 * @param data
 */
export function addFuel(data: any) {
  return request({
    url: "/api/v1/supplier/fuel",
    method: "post",
    data: data,
  });
}

/**
 * 新增ETC供应商
 *
 * @param data
 */
export function addETC(data: any) {
  return request({
    url: "/api/v1/supplier/etc",
    method: "post",
    data: data,
  });
}

/**
 * 新增修理厂
 *
 * @param data
 */
export function addRepair(data: any) {
  return request({
    url: "/api/v1/supplier/repair",
    method: "post",
    data: data,
  });
}

/**
 * 新增保险公司
 *
 * @param data
 */
export function addInsurance(data: any) {
  return request({
    url: "/api/v1/supplier/insurance",
    method: "post",
    data: data,
  });
}

/**
 * 新增租赁公司
 *
 * @param data
 */
export function addLease(data: any) {
  return request({
    url: "/api/v1/supplier/lease",
    method: "post",
    data: data,
  });
}

/**
 * 新增停车场
 *
 * @param data
 */
export function addPark(data: any) {
  return request({
    url: "/api/v1/supplier/parking",
    method: "post",
    data: data,
  });
}

/**
 * 导入供应商
 *
 * @param data
 */
export function importSupplier(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/supplier/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 导出供应商
 *
 * @param data
 */
export function exportSupplier(queryParams: SupplierGasQuery) {
  return request({
    url: "/api/v1/supplier/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 供应商模板下载
 */
export function getTemplate(data : any) {
  return request({
    url: "/api/v1/supplier/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

/**
 * 供应商统计
 */
export function getSupplierStat() {
  return request({
    url: "/api/v1/supplier/stat",
    method: "get",
  });
}



/**
 * 加油站列表
 */
export function getFuelInfo(data: any): AxiosPromise<SupplierGasPageVO> {
  return request({
    url: "/api/v1/supplier/fuel/list",
    method: "get",
    params: data
  });
}

/**
 * 加油站分页列表
 *
 * @param queryParams
 */
export function getFuelPage(
  queryParams: SupplierGasQuery
): AxiosPromise<PageResult<SupplierGasPageVO[]>> {
  return request({
    url: "/api/v1/supplier/fuel/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * ETC供应商列表
 */
export function getETC(): AxiosPromise<SupplierETCPageVO> {
  return request({
    url: "/api/v1/supplier/etc/list",
    method: "get",
  });
}

/**
 * ETC供应商分页列表
 *
 * @param queryParams
 */
export function getETCPage(
  queryParams: SupplierETCQuery
): AxiosPromise<PageResult<SupplierETCPageVO[]>> {
  return request({
    url: "/api/v1/supplier/etc/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 修理厂列表
 */
export function getRepair(data: any): AxiosPromise<SupplierRepairPageVO> {
  return request({
    url: "/api/v1/supplier/repair/list",
    method: "get",
    params: data
  });
}

/**
 * 修理厂分页列表
 *
 * @param queryParams
 */
export function getRepairPage(
  queryParams: SupplierRepairQuery
): AxiosPromise<PageResult<SupplierRepairPageVO[]>> {
  return request({
    url: "/api/v1/supplier/repair/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 保险公司列表
 */
export function getInsurance(): AxiosPromise<SupplierRepairPageVO> {
  return request({
    url: "/api/v1/supplier/insurance/list",
    method: "get",
  });
}

/**
 * 保险公司分页列表
 *
 * @param queryParams
 */
export function getInsurancePage(
  queryParams: SupplierInsuranceQuery
): AxiosPromise<PageResult<SupplierInsurancePageVO[]>> {
  return request({
    url: "/api/v1/supplier/insurance/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 挂车租赁公司列表
 */
export function getLease(): AxiosPromise<SupplierTrailerPageVO> {
  return request({
    url: "/api/v1/supplier/lease/list",
    method: "get",
  });
}

/**
 * 挂车租赁公司分页列表
 *
 * @param queryParams
 */
export function getLeasePage(
  queryParams: SupplierTrailerQuery
): AxiosPromise<PageResult<SupplierTrailerPageVO[]>> {
  return request({
    url: "/api/v1/supplier/lease/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 固定停车场列表
 */
export function getPark(): AxiosPromise<SupplierParkPageVO> {
  return request({
    url: "/api/v1/supplier/parking/list",
    method: "get",
  });
}

/**
 * 固定停车场分页列表
 *
 * @param queryParams
 */
export function getParkPage(
  queryParams: SupplierParkQuery
): AxiosPromise<PageResult<SupplierParkPageVO[]>> {
  return request({
    url: "/api/v1/supplier/parking/page",
    method: "get",
    params: queryParams,
  });
}

/**
 * 删除加油站
 *
 * @param ids
 */
export function deleteFuel(ids: string) {
  return request({
    url: "/api/v1/supplier/fuel/" + ids,
    method: "delete",
  });
}

/**
 * 删除ETC供应商
 *
 * @param ids
 */
export function deleteETC(ids: string) {
  return request({
    url: "/api/v1/supplier/etc/" + ids,
    method: "delete",
  });
}

/**
 * 删除修理厂
 *
 * @param ids
 */
export function deleteRepair(ids: string) {
  return request({
    url: "/api/v1/supplier/repair/" + ids,
    method: "delete",
  });
}

/**
 * 删除保险公司
 *
 * @param ids
 */
export function deleteInsurance(ids: string) {
  return request({
    url: "/api/v1/supplier/insurance/" + ids,
    method: "delete",
  });
}

/**
 * 删除租赁公司
 *
 * @param ids
 */
export function deleteLease(ids: string) {
  return request({
    url: "/api/v1/supplier/lease/" + ids,
    method: "delete",
  });
}

/**
 * 删除停车场
 *
 * @param ids
 */
export function deletePark(ids: string) {
  return request({
    url: "/api/v1/supplier/parking/" + ids,
    method: "delete",
  });
}
