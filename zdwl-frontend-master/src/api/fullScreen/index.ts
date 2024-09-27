import { AxiosPromise } from "axios";
import request from "@/utils/request";

/**
 * 数据指标-车辆状态统计
 */
export function getDataCenter() {
  return request({
    url: "/api/v1/fullScreen/unmannedSanitation/dataCenter",
    method: "get",
  });
}

/**
 * 车辆指标
 */
export function getVehicleCenter() {
  return request({
    url: "/api/v1/fullScreen/unmannedSanitation/vehicleCenter",
    method: "get",
  });
}

/**
 * 车辆位置
 */
export function getVehiclePosition() {
  return request({
    url: "/api/v1/fullScreen/unmannedSanitation/vehiclePosition",
    method: "get",
  });
}
