import { Depreciation, DispatchOrder, EditForm, NewDispatch, Platform } from "./types"

import { AxiosPromise } from "axios";
import request from "@/utils/request";
import Qs from 'qs'
export function getStat() {
  return request({
    url: "/api/v1/vehicle/depreciation/stat",
    method: "get",
  });
}
export function getDepreciationPage(queryParams: Depreciation) {
  return request({
    url: "/api/v1/vehicle/depreciation/page",
    method: "get",
    params:queryParams
  });
}
export function exportDepreciation() {
  return request({
    url: "/api/v1/vehicle/depreciation/_export",
    method: "get",
    responseType: "arraybuffer",
  });
}

// 客户名称
export function cooperateList() {
  return request({
    url: "/api/v1/highSpeedLine/project/cooperate/list",
    method: "get",
  });
} 
// 线路信息
export function lineInfoList(params:any) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/lineInfo/list",
    method: "get",
    params
  });
}
// 地点管理
export function locationStation(params:any) {
  return request({
    url: "/api/v1/highSpeedLine/locationStation/lineInfo/list",
    method: "get",
    params
  });
}

// 自营业务列表
export function dispatchOrder(params: any) {
  return request({
    url: "/api/v1/dispatchOrder/page",
    method: "get",
    params
  });
}
// 车牌号码（牵引车）
export function tractorList() {
  return request({
    url:'/api/v1/vehicle/tractor/list',
    method: "get",

  });
}

export function tractorListQuery(data:any) {
  return request({
    url:'/api/v1/vehicle/tractor/list',
    method: "get",
    params: data
  });
}

// 司机姓名
export function driverList() {
  return request({
    url:'/api/v1/driver/list',
    method: "get",
  });
}

export function driverParamsList(param: any) {
  return request({
    url:'/api/v1/driver/list',
    method: "get",
    params: param
  });
}

// 项目信息
export function projectList() {
  return request({
    url:'/api/v1/highSpeedLine/project/info/list',
    method: "get",
  });
}
// 自营业务新增
export function newDispatchOrder(data: NewDispatch) {
  return request({
    url: `/api/v1/dispatchOrder`,
    method: "post",
    data: data,
  });
}
// 近三次调度记录
export function threeRoute(routeCode: number | undefined) {
  return request({
    url:`/api/v1/dispatchOrder/list/three/${routeCode}`,
    method: "get",
  });
}

// 自营业务详情
export function dispatchOrderId(id: number ) {
  return request({
    url:`/api/v1/dispatchOrder/${id}`,
    method: "get",
  });
}
// 批量下发
export function dispatchOrderPush(ids: string | undefined) {
  return request({
    url:`/api/v1/dispatchOrder/push/${ids}`,
    method: "post",
  });
}

// 批量下发
export function dispatchOrderPut(data:EditForm,id: string | undefined) {
  return request({
    url:`/api/v1/dispatchOrder/${id}`,
    method: "put",
    data
  });
}

// 完整导入自营业务
export function importDispatchOrder(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/dispatchOrder/_import",
    method: "post",
    data: formData,
    timeout: 25000000,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 完整自营业务模板下载
 */
export function dispatchOrderTemplate(data: any) {
  return request({
    url: "/api/v1/dispatchOrder/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

// 基础导入自营业务
export function importDispatchOrderBase(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/dispatchOrder/_import_base",
    method: "post",
    timeout: 25000000,
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 基础自营业务模板下载
 */
export function dispatchOrderTemplateBase(data: any) {
  return request({
    url: "/api/v1/dispatchOrder/template_base",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}
// 删除自营业务
export function deleteTractor(params: string | undefined, url: string) {
  return request({
    url: `${url + params}`,
    method: "delete",
  });
}

// 平台业务列表
export function plateOrderPage(params: any) {
  return request({
    url: "/api/v1/plateOrder/page",
    method: "get",
    params
  });
}

// 导入平台业务
export function importPlateOrderOrder(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/plateOrder/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 平台业务模板下载
 */
export function plateOrderTemplate(data: any) {
  return request({
    url: "/api/v1/plateOrder/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

// // 批量开票
export function importIncome(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/plateOrder/income/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// /**
//  * 批量开票模板下载
//  */
export function incomeTemplate(data: any) {
  return request({
    url: "/api/v1/plateOrder/income/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}
// 平台业务新增
export function plateOrder(data: Platform) {
  return request({
    url: `/api/v1/plateOrder`,
    method: "post",
    data: data,
  });
}

// 平台业务修改
export function plateOrderId(data:Platform,id: number | undefined) {
  return request({
    url:`/api/v1/plateOrder/${id}`,
    method: "put",
    data
  });
}
// 统计

export function plateOrderStat(params: any) {
  return request({
    url: "/api/v1/plateOrder/stat",
    method: "get",
    params
  });
}

export function plateOrderPay(id: number | string | undefined,urlType:string) {
  return request({
    url:`/api/v1/plateOrder/${urlType}/${id}`,
    method: "post",
  });
}
export function plateOrderHistory(vehicleCard:string,params: any) {
  return request({
    url: `/api/v1/vehicle/map/history/${vehicleCard}`,
    method: "get",
    params
  });
}
// 地点管理
export function getStationList(params:any) {
  return request({
    url: "/api/v1/highSpeedLine/locationRoute/station/list",
    method: "get",
    params,
  });
}
// 自营业务修改
export function dispatchOrderBase(data:Platform,id: number | undefined) {
  return request({
    url:`/api/v1/dispatchOrder/base/${id}`,
    method: "put",
    data
  });
}


export function costFuelList(data: any) {
  return request({
    url: "/api/v1/dispatchFee/cost/fuel/list",
    method: "post",
    data,
    headers: {
      'Content-Type': 'application/form-data'
    }
  });
}
// 司机油量补扣款确认
export function expenseAdd(data: any) {
  return request({
    url: `/api/v1/dispatchFee/cost/expense/add`,
    method: "post",
    data: data,
  });
}

export function monthAdd(data:any) {
  return request({
    url:`/api/v1/dispatch/cost/driver/month/add`,
    method: "post",
    data: Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 司机油量补扣款确认
export function undoPush(id: any) {
  return request({
    url: `/api/v1/dispatchOrder/undo-push/${id}`,
    method: "post",
  });
}
