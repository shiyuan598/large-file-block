import { driverMonthPageVO, driverPageVO, expensePageVO, fuelPageVO, highwayPageVO, incomePageVO, totalPageVO, ureaPageVO } from "./types";
import { driverMonthQuery, driverQuery, expenseQuery, fuelQuery, highwayQuery, incomeQuery, totalQuery, ureaQuery } from "./types";

import { AxiosPromise } from "axios";
import request from "@/utils/request";
import Qs from 'qs'
export function exportTotal(queryParams: totalQuery) {
  return request({
    url: "/api/v1/dispatchAccrual/total/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getTotalPage(queryParams: totalQuery): AxiosPromise<PageResult<totalPageVO[]>> {
  return request({
    url: "/api/v1/dispatchFee/total/page",
    method: "get",
    params: queryParams,
  });
}
// 计提分页
export function dispatchAccrualPage(queryParams: totalQuery): AxiosPromise<PageResult<totalPageVO[]>> {
  return request({
    url: "/api/v1/dispatchAccrual/total/page",
    method: "get",
    params: queryParams,
  });
}
export function getTotalStat(data:any): AxiosPromise<totalPageVO> {
  return request({
    url: "/api/v1/dispatchFee/total/stat",
    method: "get",
    params: data,
  });
}
// 计提统计
export function getDispatchAccrual(params:any) {
  return request({
    url: "/api/v1/dispatchAccrual/total/stat",
    method: "get",
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function exportIncome(queryParams: incomeQuery) {
  return request({
    url: "/api/v1/dispatchFee/income/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getIncomePage(queryParams: incomeQuery): AxiosPromise<PageResult<incomePageVO[]>> {
  return request({
    url: "/api/v1/dispatchFee/income/page",
    method: "get",
    params: queryParams,
  });
}
export function getIncomeStat(data:any): AxiosPromise<incomePageVO> {
  return request({
    url: "/api/v1/dispatchFee/income/stat",
    method: "get",
    params: data,
  });
}

export function exportUrea(queryParams: ureaQuery) {
  return request({
    url: "/api/v1/dispatchFee/cost/urea/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getUreaPage(queryParams: ureaQuery): AxiosPromise<PageResult<ureaPageVO[]>> {
  return request({
    url: "/api/v1/dispatchFee/cost/urea/page",
    method: "get",
    params: queryParams,
  });
}
export function getUreaStat(data:any): AxiosPromise<ureaPageVO> {
  return request({
    url: "/api/v1/dispatchFee/cost/urea/stat",
    method: "get",
    params: data,
  });
}

export function exportHighway(queryParams: highwayQuery) {
  return request({
    url: "/api/v1/dispatchFee/cost/highway/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getHighwayPage(queryParams: highwayQuery): AxiosPromise<PageResult<highwayPageVO[]>> {
  return request({
    url: "/api/v1/dispatchFee/cost/highway/page",
    method: "get",
    params: queryParams,
  });
}
export function getHighwayStat(data:any): AxiosPromise<highwayPageVO> {
  return request({
    url: "/api/v1/dispatchFee/cost/highway/stat",
    method: "get",
    params: data,
  });
}

export function exportFuel(queryParams: fuelQuery) {
  return request({
    url: "/api/v1/dispatchFee/cost/fuel/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getFuelPage(queryParams: fuelQuery): AxiosPromise<PageResult<fuelPageVO[]>> {
  return request({
    url: "/api/v1/dispatchFee/cost/fuel/page",
    method: "get",
    params: queryParams,
  });
}
export function getFuelStat(data:any): AxiosPromise<fuelPageVO> {
  return request({
    url: "/api/v1/dispatchFee/cost/fuel/stat",
    method: "get",
    params: data,
  });
}

export function exportExpense(queryParams: expenseQuery) {
  return request({
    url: "/api/v1/dispatchFee/cost/expense/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getExpensePage(queryParams: expenseQuery): AxiosPromise<PageResult<expensePageVO[]>> {
  return request({
    url: "/api/v1/dispatchFee/cost/expense/page",
    method: "get",
    params: queryParams,
  });
}
export function getExpenseStat(data:any): AxiosPromise<expensePageVO> {
  return request({
    url: "/api/v1/dispatchFee/cost/expense/stat",
    method: "get",
    params: data,
  });
}

export function exportDriver(queryParams: driverQuery) {
  return request({
    url: "/api/v1/dispatchFee/cost/driver/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getDriverPage(queryParams: driverQuery): AxiosPromise<PageResult<driverPageVO[]>> {
  return request({
    url: "/api/v1/dispatchFee/cost/driver/page",
    method: "get",
    params: queryParams,
  });
}
export function getDriverStat(data:any): AxiosPromise<driverPageVO> {
  return request({
    url: "/api/v1/dispatchFee/cost/driver/stat",
    method: "get",
    params: data,
  });
}

export function exportDriverMonth(queryParams: driverMonthQuery) {
  return request({
    url: "/api/v1/dispatch/cost/driver/month/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

export function payExport(queryParams: any) {
  return request({
    url: "/api/v1/dispatch/cost/driver/month/_payExport",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}
export function getDriverMonthPage(queryParams: driverMonthQuery): AxiosPromise<PageResult<driverMonthPageVO[]>> {
  return request({
    url: "/api/v1/dispatch/cost/driver/month/page",
    method: "get",
    params: queryParams,
  });
}
export function getDriverMonthStat(data:any): AxiosPromise<driverMonthPageVO> {
  return request({
    url: "/api/v1/dispatch/cost/driver/month/stat",
    method: "get",
    params: data,
  });
}

export function getDriverUpMonth(val) {
  return request({
    url: "/api/v1/dispatch/cost/driver/month/lastMonth",
    method: "get",
    params:val
  });
}

export function postCostDriver(data: any) {
  return request({
    url: "/api/v1/dispatchFee/use/costDriver",
    method: "post",
    data: data
  });
}

export function getFuelTemplate(data : any) {
  return request({
    url: "/api/v1/dispatchFee/use/fuel/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

export function importFuel(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchFee/use/fuel/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getUreaTemplate(data : any) {
  return request({
    url: "/api/v1/dispatchFee/use/urea/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

export function importUrea(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchFee/use/urea/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function fuelZero(ids: string) {
  return request({
    url: "/api/v1/dispatchFee/use/fuel/zero/" + ids,
    method: "post"
  });
}

export function ureaZero(ids: string) {
  return request({
    url: "/api/v1/dispatchFee/use/urea/zero/" + ids,
    method: "post"
  });
}

export function makeHighway(data: any, ids: string) {
  data.ids = ids
  return request({
    url: "/api/v1/dispatchFee/use/highway",
    method: "post",
    data: data
  });
}

export function writeOrder(ids: string) {
  return request({
    url: "/api/v1/dispatchFee/use/income/make/" + ids,
    method: "post",
  });
}

export function writeOrderOne(data: any) {
  return request({
    url: "/api/v1/dispatchFee/use/income/makeByOne",
    method: "post",
    data: data
  });
}

export function payBack(ids: string) {
  return request({
    url: "/api/v1/dispatchFee/use/income/back/" + ids,
    method: "post"
  });
}


export function expenseCheck(data:any) {
  return request({
    url: "/api/v1/dispatchFee/use/expense/check",
    method: "post",
    data: data
  });
}

export function getThreeMounth() {
  return request({
    url: "/api/v1/dispatchFee/total/upByThreeMonth",
    method: "get",
  });
}
// 计提刷新三个月数据
export function refreshByMonth(params:{month:string}) {
  return request({
    url: "/api/v1/dispatchAccrual/total/refreshByMonth",
    method: "get",
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
// 计提模板下载
export function getDispatchAccrualTemplate(data : any) {
  return request({
    url: "/api/v1/dispatchAccrual/bill/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}
// 计提导入
export function imporDispatchFuel(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchAccrual/bill/_import/fuel",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export function imporDispatchUrea(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchAccrual/bill/_import/urea",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export function imporDispatcHighway(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchAccrual/bill/_import/highway",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export function getHighwayTemplate(data : any) {
  return request({
    url: "/api/v1/dispatchFee/use/highway/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

export function importHighway(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchFee/use/highway/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getWeighingFeeTemplate(data : any) {
  return request({
    url: "/api/v1/dispatchFee/use/expense/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

export function importWeighingFee(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchFee/use/expense/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getIncomeTemplate(data : any) {
  return request({
    url: "/api/v1/dispatchFee/use/income/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

export function importIncome(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchFee/use/income/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getDriverTemplate(data : any) {
  return request({
    url: "/api/v1/dispatchFee/use/driver/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

export function importDriver(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/dispatchFee/use/driver/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}


// 司机提成模板下载
// export function getWeighingFeeTemplate(data : any) {
//   return request({
//     url: "/api/v1/dispatchFee/use/expense/template",
//     method: "get",
//     responseType: "arraybuffer",
//     params: data
//   });
// }
// 司机提成导入
// export function importWeighingFee(file: File) {
//   const formData = new FormData();
//   formData.append("file", file);
//   return request({
//     url: "/api/v1/dispatchFee/use/expense/_import",
//     method: "post",
//     data: formData,
//     responseType: "arraybuffer",
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }
export function fuelUpdate(data:any) {
  return request({
    url: "/api/v1/dispatchFee/use/fuel/update",
    method: "put",
    data: data
  });
}
