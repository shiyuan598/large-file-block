
// 线路分页列表查询
export interface RoutePage extends PageQuery {
  // 线路名称
  routeName?: string
}
//   新建线路
export interface NewRoute {
  id?: number | undefined;
  // 线路名称
  routeName?: string;
  // 起点
  start: string;
  // 终点
  end: string;
  // 长度
  length: number | undefined;
  // 宽度
  width: number | undefined;
  // 面积
  area: number | undefined;
  // 最高限速
  maxSpeed: number | undefined;
  // 高精度地图
  file: any;
  fileName?: string;
  // 等级
  level: string;
  // 线路编号
  uuid: string;
}

export interface InjectList {
  card?: string;
  injectId?: number | undefined;
  vehicleId?: number | undefined;
  routerId?: number | undefined;
  driverStatus: number;
  workStatus: number;
  gpsList: number[];
  vin: string;
  heading: null | number;
  driverId?: null | number;
}

export interface StateCar {
  // VIN
  vin: string;
  // 在线状态
  vehOnlineStat: string;
  // 时间戳
  ts_recvFromMqtt: string;
  // 经度
  longitude: number | null;
  // 纬度
  latitude: number | null;
  // 车速
  vehSpd: number | null;
  // 里程
  vehDistance: number | null;
  // 作业状态
  oneKeyOperateStat: number | null;
  // 前边刷状态
  ftBrushDrop: number | null;
  // 扫盘边刷水阀
  brushSwpWtrVal: number | null;
  // 垃圾倾倒
  vehStatRsv4: number | null;
  // 剩余电量
  powerBattSoc: number | null;
  // 剩余水量
  vehStatRsv9: number | null;
  // 控制状态
  vehCtrlStat: number | null;
  // 紧急制动
  stopStat: number | null;
  // EBS制动
  xbrActiveCtrlMode: number | null;
  // 油门开度
  accelPedal: number | null;
  // brakePedal
  brakePedal: number | null;
  // 车轮转角
  steerAngle: number | null;
  // RDU连接状态
  // 上电状态
  igStat: number | null;
  rduConnect: number | null;
  // 电机转速
  engineSpd: number | null;
  // 电机扭矩
  engineTrq: number | null;
  // 驱动线控
  vcuStat: number | null;

  // 实时档位
  currentGear: number | null;
  // MCU电机
  mcuSysStat: number | null;
  // 左转灯
  leftTurnLight: number | null;
  // 右转灯
  rightTurnLight: number | null;
  // 制动灯状态
  brakeLight: number | null;
  // 近光灯状态
  lowBeam: number | null;
  // 倒车灯状态
  backLight: number | null;
  // 危险警报灯
  hazardLight: number | null;
  // takeoverReq
  takeoverReq: number | null;
  // MCU故障状态
  mcuFailureStat: number | null;
  // HCU系统状态
  hcuSysStat: number | null;
  // 高压系统状态
  highVoltSysStat: number | null;
  // EBS故障灯
  ebsWarnSignal: number | null;
  // EPB驻车故障
  epbWarnSignal: number | null;
 // RDU运行状态
 rduRmtCtrlStat: number | null;
 // RDU故障状态
 rduErrorStat: number | null;
 // RDU使能反馈
 rduRmtEnableResp: number | null;
 // 远驾接管请求
 aduRmtCtrlReq: number | null;
 // 整车ready状态
 readyStat: number | null;
 // 当前RDU信息时间戳
 rduTs: number |null;
//  当前版本
vehStatRsv26: string | null;
// 最新进度
otaResp: string | null;
}
export interface RDU_type {
  // RDU运行状态
  rduRmtCtrlStat: null | string;
  // RDU故障状态
  rduErrorStat: null | string;
  // RDU使能反馈
  rduRmtEnableResp: null | string;
  // 远驾接管请求
  aduRmtCtrlReq: null | string;
  // 整车ready状态
  readyStat: null | string
  // 当前RDU信息时间戳
  ts: null | string
}
export interface LedgerForm {
  id?: null | number;
  // 台账日期
  orderDate: string;
  // 车辆租金
  leaseCost: null | number;
  // 维保费用
  repairCost: null | number;
  // 驾驶服务费
  driverCost: null | number;
  // 月度电费
  electricCost: null | number;
  // 月度油费
  fuelCost: null | number;
  // 月度水费
  waterCost: null | number;
  // 耗材费用
  equipmentUseCost: null | number;
  // 其他费用
  otherCost: null | number;
  // 直接人工费
  personCost: null | number;
  // 税率比例
  tax: number;
  // 小计
  totalCost: number;
  // 综合费用
  omnibusFee: number;
  // 成本总额
  finalCost: number;
  // 成本加成
  finalCostAdd: number;
  // 结算收入
  finalCostTotal: number;
  // 结算金额
  finalAmount: number;
}

export interface RouterParmes extends PageQuery {
  startTime?: string;
  endTime?: string;
  makeStatus?: string;
  writeStatus?: string;
  picker?: any[]
}
// 驾驶台查询
export interface BoxParmes extends PageQuery {
  name?: string;
  keeper?: string;
  status?: undefined | number;
}
// 驾驶台新增
export interface BoxAdd {
  cockpitName: string;
  cockpitIp: string;
  keeper: string;
  priority: null | number;
  cockpitConfig: string;
  cockpitCode: null | number
}

export interface LogParmes extends PageQuery {
  // 车辆win码
  vehVin: string;
  dateFrom: string;
  dateTo: string;
  picker: string[];
  event: string;
}
export interface StatusForm {
  cockpitCode: string;
  vehVin: string;
  status: string;
  driverName: string;
  dateFrom: string;
  dateTo: string;
  picker?: any
}

export interface DispatchForm extends PageQuery {
  vehCode?: string;
  cockpitCode?: string;
  driverName?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  picker?: string[];
}

export interface NewSate {
  id?: string;
  driverId: string;
  driverName?: string;
  vehId: string;
  vehCode?: string;
  vehVin: string;
  cockpitId: string;
  cockpitCode?: string;
  createBy?: string;
}

export interface Report {
  dateFrom?: string;
  dateTo?: string;
}