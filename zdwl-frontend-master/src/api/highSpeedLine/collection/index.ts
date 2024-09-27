import request from "@/utils/request";
export function dispatchFeeInvoice(params: any ) {
    return request({
      url:`/api/v1/dispatchFee/invoice`,
      method: "get",
      params:params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  export function dispatchFeeInvoicePost( data: any) {
    return request({
      url: "/api/v1/dispatchFee/invoice",
      method: "post",
      data: data,
    });
  }

  export function dispatchFeeInvoiceStat( params: any) {
    return request({
      url: "/api/v1/dispatchFee/invoice/stat",
      method: "get",
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  export function dispatchFeeInvoicePut(id:string | null, data: any) {
    return request({
      url: `/api/v1/dispatchFee/invoice/${id}`,
      method: "put",
      data: data,
    });
  }
// 导入回款
export function importInvoice(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/dispatchFee/use/invoice/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 回款模板下载
 */
export function invoiceTemplate(data: any) {
  return request({
    url: "/api/v1/dispatchFee/use/invoice/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}
