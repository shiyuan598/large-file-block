import request from "@/utils/request";
import requesEnv from "@/utils/requestEnv";
import { Report, NewSate, RoutePage, NewRoute, LedgerForm, RouterParmes, BoxParmes, BoxAdd, LogParmes, DispatchForm } from "./type"
import Qs from 'qs'
export function routePage(params: RoutePage) {
    return request({
        url: "/api/v1/ems/route/page",
        method: "get",
        params
    });
}
export function newRoute(data: NewRoute) {
    return request({
        url: "/api/v1/ems/route",
        method: "post",
        data
    });
}
export function editRoute(data: NewRoute, id: number | undefined) {
    return request({
        url: `/api/v1/ems/route/${id}`,
        method: "put",
        data
    });
}

export function gpsRoute(id: number | undefined) {
    return request({
        url: `/api/v1/ems/route/gpsRoute/${id}`,
        method: "get",
    });
}


export function sanitationPage(params: any) {
    return request({
        url: "/api/v1/vehicle/sanitation/page",
        method: "get",
        params
    });
}

export function putUnify(url: string, id: number | undefined) {
    return request({
        url: `${url}${id}`,
        method: "put",
    });
}

export function vehicleRouteSetting(vehicleCard: string) {
    return request({
        url: `/api/v1/ems/vehicleRouteSetting/${vehicleCard}`,
        method: "get",
    });
}

export function updateOrAdd(data: any) {
    return request({
        url: `/api/v1/ems/vehicleRouteSetting/updateOrAdd`,
        method: "put",
        data
    });
}
export function getRouter(url: string, value: string) {
    return request({
        url: `${url}${value}`,
        method: "get",
    });
}
export function putRouter(url: string, data: string, params: string) {
    return request({
        url: `${url}${data}/${params}`,
        method: "put",
        // data: Qs.stringify(data),
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
    });
}
export function routeResp(vehicleCard: string) {
    return request({
        url: `/api/v1/ems/vehicleRouteSetting/routeResp/${vehicleCard}`,
        method: "get",
    });
}

export function postRdu(data: any) {
    return requesEnv({
        url: `/envSrv/rd/log/state`,
        method: "post",
        data
    });
}
export function newOrder(data: LedgerForm) {
    return request({
        url: "/api/v1/ems/order/total",
        method: "post",
        data
    });
}

export function orderTotalPage(params: RouterParmes) {
    return request({
        url: "/api/v1/ems/order/total/page",
        method: "get",
        params
    });
}

export function putOrder(data: any, id: null | number | undefined) {
    return request({
        url: `/api/v1/ems/order/total/${id}`,
        method: "put",
        data
    });
}


// 导入环卫业务台账
export function importOrderOrder(file: File, supplierType: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("supplierType", supplierType);
    return request({
        url: "/api/v1/ems/order/total/_import",
        method: "post",
        data: formData,
        responseType: "arraybuffer",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

/**
 * 环卫业务台账模板下载
 */
export function getOrderTemplate(data: any) {
    return request({
        url: "/api/v1/ems/order/total/template",
        method: "get",
        responseType: "arraybuffer",
        params: data
    });
}
//   批量结算
export function totalMake(ids: any) {
    return request({
        url: `/api/v1/ems/order/total/make/${ids}`,
        method: "post",
    });
}
//   批量核销
export function totalWrite(ids: any) {
    return request({
        url: `/api/v1/ems/order/total/write/${ids}`,
        method: "post",
    });
}

// 驾驶台分页查询

export function boxPage(data: BoxParmes) {
    return requesEnv({
        url: `/envSrv/rd/box/page`,
        method: "post",
        data
    });
}

// 驾驶台列表
export function getBoxList() {
    return requesEnv({
        url: `/envSrv/rd/box/list`,
        method: "get",
    });
}
// 生成驾驶台编码
export function genCode() {
    return requesEnv({
        url: `/envSrv/rd/box/genCode`,
        method: "get",
    });
}

// 驾驶台新增

export function boxAdd(data: BoxAdd) {
    return requesEnv({
        url: `/envSrv/rd/box/add`,
        method: "post",
        data
    });
}

// 编辑驾驶台

export function boxUpd(data: BoxAdd) {
    return requesEnv({
        url: `/envSrv/rd/box/upd`,
        method: "put",
        data
    });
}

// 删除
export function deleteBox(params: string | undefined, url: string) {
    return requesEnv({
        url: `${url + params}`,
        method: "delete",
    });
}


// 启用禁用驾驶台
export function enableDisable(params: string | undefined, url: string) {
    return requesEnv({
        url: `${url + params}`,
        method: "get",
    });
}
//   远驾日志分页查询

export function rdLog(data: LogParmes) {
    return requesEnv({
        url: `/envSrv/rd/log/page`,
        method: "post",
        data
    });
}
// 
export function dispatchReport(data: DispatchForm) {
    return requesEnv({
        url: `/envSrv/rd/dispatch/dispatchReport`,
        method: "post",
        data
    });
}
// 未完成调度单
export function dispatchPage(data: DispatchForm) {
    return requesEnv({
        url: `/envSrv/rd/dispatch/page`,
        method: "post",
        data
    });
}

// 驾驶员列表
export function listDriver() {
    return requesEnv({
        url: `/envSrv/rd/dispatch/listDriver`,
        method: "get",
    });
}

// 车辆列表
export function listVeh() {
    return requesEnv({
        url: `/envSrv/rd/dispatch/listVeh`,
        method: "get",
    });
}

// 新建调度单

export function dispatchAdd(data: NewSate) {
    return requesEnv({
        url: `/envSrv/rd/dispatch/add`,
        method: "post",
        data
    });
}

// 编辑调度单
export function dispatchUpd(data: NewSate) {
    return requesEnv({
        url: `/envSrv/rd/dispatch/upd`,
        method: "put",
        data
    });
}

// 调度单操作
export function dispatchPut(data: any, url: string) {
    return requesEnv({
        url,
        method: "put",
        data
    });
}

// 已完成调度单
export function dispatchPageFinish(data: DispatchForm) {
    return requesEnv({
        url: `/envSrv/rd/dispatch/page/finish`,
        method: "post",
        data
    });
}

// 运行时长
export function runtimeReport(data: any) {
    return requesEnv({
        url: `/envSrv/rd/dispatch/runtimeReport`,
        method: "post",
        data
    });
}

// 任务数量
export function taskCountReport(data: Report) {
    return requesEnv({
        url: `/envSrv/rd/dispatch/taskCountReport`,
        method: "post",
        data
    });
}

// 参数配置查询
export function configQuery(data: { vehVin: string }) {
    return requesEnv({
        url: `/envSrv/rd/config/query`,
        method: "post",
        data
    });
}

// 参数配置查询
export function configSet(data: any) {
    return requesEnv({
        url: `/envSrv/rd/config/set`,
        method: "post",
        data
    });
}

// 获取OTA软件仓库列表
export function otaList(vehicleCard: string) {
    return request({
        url: `/api/v1/ems/vehicleRouteSetting/otaList/${vehicleCard}`,
        method: "get",
    });
}


export function otaUpdate(data: any) {
    return request({
        url: `/api/v1/ems/vehicleRouteSetting/otaUpdate`,
        method: "put",
        data
        // data: Qs.stringify(data),
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
    });
}
// 事件数据
export function vehEvents(params: any) {
    return request({
        url: `/open-biz/l4-report/veh-events`,
        method: "get",
        params
    });
}

