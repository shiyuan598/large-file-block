import { TmsDispatchPreOrderForm, OrderForm, ContainerForm, Form, FormDialog, PassengerFrom, RuleForm, SanitationForm, TractorForm, UseFormDialog, UseParmes } from "./types"
import Qs from 'qs'
import request from "@/utils/request";
export function getvVhicleStat() {
  return request({
    url: "/api/v1/vehicle/stat",
    method: "get",
  });
}

export function getTrailerPage(params: RuleForm, url: string) {
  return request({
    url,
    method: "get",
    params
  });
}
export function getOptions(params: string) {
  return request({
    url: `/api/v1/dict/${params}/options`,
    method: "get"
  });
}
export function vehicleTractor(data: Form) {
  return request({
    url: "/api/v1/vehicle/tractor",
    method: "post",
    data: data,
  });
}
export function depreciationCard(params: string | undefined) {
  return request({
    url: `/api/v1/vehicle/depreciation/${params}`,
    method: "get",
  });
}
export function puttractor(data: Form, params: number | undefined) {
  return request({
    url: `/api/v1/vehicle/tractor/${params}`,
    method: "put",
    data
  });
}

export function deleteTractor(params: string | undefined, url: string) {
  return request({
    url: `${url + params}`,
    method: "delete",
  });
}

export function getTemplate(url: string) {
  return request({
    url,
    method: "get",
    responseType: "arraybuffer",
  });
}
/**
 * 导入
 *
 * @param data
 */
export function importSupplier(supplierType: string, file: File, url: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function exportFileApi(params: unknown, url: string) {
  delete params?.picker;
  return request({
    url,
    method: "get",
    params,
    responseType: "arraybuffer",
  });
}


export function vehicleTractorTractor(data: TractorForm) {
  return request({
    url: "/api/v1/vehicle/trailer",
    method: "post",
    data: data,
  });
}
export function tractorPuttractor(data: TractorForm, params: number | undefined) {
  return request({
    url: `/api/v1/vehicle/trailer/${params}`,
    method: "put",
    data
  });
}
// 集装箱新增
export function vehicleBox(data: ContainerForm) {
  return request({
    url: "/api/v1/vehicle/box",
    method: "post",
    data: data,
  });
}
// 集装箱修改
export function puttractorBox(data: ContainerForm, params: number | undefined) {
  return request({
    url: `/api/v1/vehicle/box/${params}`,
    method: "put",
    data
  });
}

// 环卫车新增
export function sanitation(data: SanitationForm) {
  return request({
    url: "/api/v1/vehicle/sanitation",
    method: "post",
    data: data,
  });
}
// 环卫车修改
export function putSanitation(data: SanitationForm, params: number | undefined) {
  return request({
    url: `/api/v1/vehicle/sanitation/${params}`,
    method: "put",
    data
  });
}

// 乘用车新增
export function vehicleCar(data: PassengerFrom) {
  return request({
    url: "/api/v1/vehicle/car",
    method: "post",
    data: data,
  });
}
// 乘用车修改
export function vehicleEdit(data: PassengerFrom, params: number | undefined) {
  return request({
    url: `/api/v1/vehicle/car/${params}`,
    method: "put",
    data
  });
}

// 导入牵引车
export function importTractor(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/vehicle/tractor/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 牵引车模板下载
 */
export function tractorTemplate(data: any) {
  return request({
    url: "/api/v1/vehicle/tractor/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}
// 导入挂车
export function importTrailer(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/vehicle/trailer/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 挂车模板下载
 */
export function trailerTemplate(data: any) {
  return request({
    url: "/api/v1/vehicle/trailer/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}
// 导入集装箱
export function importBox(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/vehicle/box/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 供应商模板下载
 */
export function boxTemplate(data: any) {
  return request({
    url: "/api/v1/vehicle/box/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

// 导入环卫车
export function importSanitation(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/vehicle/sanitation/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 环卫车模板下载
 */
export function sanitationTemplate(data: any) {
  return request({
    url: "/api/v1/vehicle/sanitation/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

// 导入乘用车
export function importCar(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/vehicle/car/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 乘用车模板下载
 */
export function carTemplate(data: any) {
  return request({
    url: "/api/v1/vehicle/car/_import",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

export function mapList(params:any) {
  return request({
    url: '/api/v1/vehicle/map/list',
    method: "get",
    params
  });
}


// 导入车辆配件
export function importPart(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/vehicle/part/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 车辆配件模板下载
 */
export function partTemplate(data: any) {
  return request({
    url: "/api/v1/vehicle/part/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

// 新增车辆配件
export function vehiclePart(data: FormDialog) {
  return request({
    url: "/api/v1/vehicle/part",
    method: "post",
    data: data,
  });
}
// 领用车辆配件
export function partUse(data: UseFormDialog, id: string | undefined) {
  return request({
    url: `/api/v1/vehicle/part/use/${id}`,
    method: "post",
    data: data,
  });
}

// 车辆配件领用记录
export function useList(params: UseParmes, id: string | undefined) {
  return request({
    url: `/api/v1/vehicle/part/use/page/${id}`,
    method: "get",
    params
  });
}
// 修改车辆配件
export function putVehiclePart(data: FormDialog, params: string | undefined) {
  return request({
    url: `/api/v1/vehicle/part/${params}`,
    method: "put",
    data
  });
}
// 修改车辆配件使用记录
export function vehiclePartUse(data: UseFormDialog, params: string | undefined) {
  return request({
    url: `/api/v1/vehicle/part/use/${params}`,
    method: "put",
    data
  });
}
// 所有车辆列表
export function allList() {
  return request({
    url: `/api/v1/vehicle/allList`,
    method: "get",
  });
}
// 无人调度查询
export function orderTemplate(data: OrderForm) {
  return request({
    url: `/api/v1/orderTemplate/page`,
    method: "post",
    data: Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
// 无人调度新增
export function orderTemplateAdd(data: OrderForm) {
  return request({
    url: `/api/v1/orderTemplate/add`,
    method: "post",
    data: data,
  });
}
// 无人调度修改
export function orderTemplateUpd(data: OrderForm) {
  return request({
    url: `/api/v1/orderTemplate/upd`,
    method: "put",
    data: data,
  });
}
// 无人调度删除
export function envDeleteTractor(params: string | undefined, url: string) {
  return request({
    url: `${url + params}`,
    method: "delete",
  });
}
// 无人调度启用禁用
export function envEnableDisable(params: string | undefined, url: string) {
  return request({
      url: `${url + params}`,
      method: "get",
  });
}
// 一键调度
export function oneKeySchedule(params: string | undefined, url: string,parameObj:any) {
  return request({
      url: `${url + params}`,
      method: "get",
      params: parameObj
  });
}

// 根据线路获取最大班序
export function maxShift0rder(data: string | number | null) {
  return request({
    url: `/api/v1/orderTemplate/route/${data}/max-shift-order`,
    method: "post",
    // data: Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 智能调度
export function smartSchedule(params:any) {
  return request({
      url: `/api/v1/orderTemplate/smartSchedule`,
      method: "get",
      params: params
  });
}

// 预订单分页查询
export function dispatchPreOrderPage(params:PageQuery) {
  return request({
      url: `/api/v1/dispatchPreOrder/page`,
      params,
      method: "get",
  });
}
// 根据预订单生成订单

export function dispatchPreOrder(ids: string | number | null,data: TmsDispatchPreOrderForm) {
  return request({
    url: `/api/v1/dispatchPreOrder/${ids}`,
    method: "put",
    data: data,
  });
}

// 删除预订单

export function dispatchPreOrderDelete(ids: string | null) {
  return request({
    url: `/api/v1/dispatchPreOrder/${ids}`,
    method: "delete",
    // data: Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 根据预订单生成订单

export function dispatchPreOrderPOST(ids: string | null) {
  return request({
    url: `/api/v1/dispatchPreOrder/${ids}`,
    method: "POST",
    // data: Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 更新新GPS里程
export function gpsMileageUpdate(orderId: string | number | null,data: any) {
  return request({
    url: `/api/v1/dispatchOrder/gps-mileage/update/${orderId}`,
    method: "post",
    data: Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
