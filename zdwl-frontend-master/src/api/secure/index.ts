import request from "@/utils/request";
import { jobForm, OnJobForm, ProjecFormDialog, EditProject } from "./types"


export function driverPage(params: jobForm, url: string) {
    return request({
      url,
      method: "get",
      params
    });
  }
// 安全员新增
export function postDriver(data: OnJobForm) {
  return request({
    url: "/api/v1/driver",
    method: "post",
    data: data,
  });
}
// 安全员修改
export function putDriver(data: OnJobForm, params: number | undefined) {
  return request({
    url: `/api/v1/driver/${params}`,
    method: "put",
    data
  });
}
  
// 导入安全员
export function importDriver(file: File, supplierType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("supplierType", supplierType);
  return request({
    url: "/api/v1/driver/_import",
    method: "post",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 安全员模板下载
 */
export function driverTemplate(data: any) {
  return request({
    url: "/api/v1/driver/template",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}

// 新建培训项目
export function safeProject(data: ProjecFormDialog) {
  return request({
    url: `/api/v1/safe/project`,
    method: "post",
    data: data,
  });
}
// 修改培训项目
export function editProject(data: ProjecFormDialog,id: string) {
  return request({
    url: `/api/v1/safe/project/${id}`,
    method: "put",
    data
  });
}
// 发布培训项目
export function projectPush(id: number) {
  return request({
    url: `/api/v1/safe/project/${id}/push`,
    method: "put",
  });
}
// 培训情况分页
export function resultPage(params: any) {
  return request({
    url: "/api/v1/safe/result/page",
    method: "get",
    params
  });
}
// 修改培训情况
export function safeResult(data: EditProject, params: number | undefined) {
  return request({
    url: `/api/v1/safe/result/${params}`,
    method: "put",
    data
  });
}

// 文件删除
export function deleteFiles(params: any) {
  return request({
    url: "/api/v1/files",
    method: "delete",
    params
  });
}