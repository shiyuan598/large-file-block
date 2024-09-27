export interface Depreciation extends PageQuery {
  keywords?: string;
  startTime?: string;
  endTime?: string;
  vehicleType?: string;
  picker?: any;
  driverCode?: number | undefined;
  tractorCode?: number | undefined;
  status?: number | undefined;
  customerCode?: number | undefined;
  orderType?: number | null;
  routeCode?: number | undefined;
  orderDateSort?: string;
}

// export interface DispatchOrder {
//   keywords?: string;
// }
export interface Options {
  label: string;
  value: number
  list?: []
}

export interface DispatchOrder {
  id?: number;
  // 项目名称
  project: string;
  // 项目编号
  projectCode: number | undefined;
  // 订单日期
  orderDate: string;
  // 线路
  route: string;
  // 线路编码
  routeCode: number | undefined;
  // 起运地
  startStation: string;
  // 起运地编码
  startCode: number | undefined;
  // 目的地
  endStation: string;
  // 目的地编码
  endCode: number | undefined;
  // 途径点
  waypoints: string;
  // 途径点编码
  waypointCodes: number | undefined;
  tranType: string;
  // 运输类型编号
  tranTypeCode: number | undefined;
  // // 实际主驾
  // firstDriver?: string;
  // // 实际主驾编码
  // firstDriverCode?: number | undefined;
  // 实际主驾联系方式
  // firstDriverPhone?: string;
  // 实际牵引车
  tractor?: string;
  // 实际牵引车编码
  tractorCode?: number | undefined;
  // 客户
  customer?: string;
  // 项目编码
  customerCode?: number | undefined;
  // 标准运费
  upAmount?: number | undefined;
  // 标准里程
  upMileage?: number | undefined;
  // 标准时效
  upTime?: number | undefined;
  // 标准油量
  upFuelNum?: number | undefined;
  // 标准尿素量
  upUreaNum?: number | undefined;
  // 标准高速费
  upHighAmount?: number | undefined;
  // 标准主驾费用
  // upFirstDriverAmount?: number | undefined;
  // 标准副驾费用
  // upSecondDriverAmount?: number | undefined;
  // 单双驾驶
  // driverType?: number | undefined;

  upDriverType?: number | undefined;
}
export interface RecordOrder {
  // 单双驾
  driverType?: number | undefined;
  // 牵引车牌
  tractor?: string;
  // 牵引车编码
  tractorCode?: number | undefined;
  // 主驾
  firstDriver: string;
  // // 主驾编码
  firstDriverCode: number | undefined;
  // 主驾费用
  upFirstDriverAmount?: number | undefined;

  // 副驾
  secondDriver: string;
  // 副驾编码
  secondDriverCode: number | undefined | null;
  // 副驾费用
  upSecondDriverAmount?: number | undefined;
  // // 主驾联系方
  firstDriverPhone?: string;
  // 副驾联系方式
  secondDriverPhone?: string;
}
export interface NewDispatch extends RecordOrder, DispatchOrder {
  // 客户名称
  customer: string;
  // 客户编码
  customerCode: number | undefined;
  // 标准运费
  upAmount: number | undefined;
  // 标准里程
  upMileage?: number | undefined;
  // 标准时效
  upTime?: number | undefined;
  // 标准油量
  upFuelNum: number | undefined;
  // 标准尿素量
  upUreaNum: number | undefined;
  // 标准高速费
  upHighAmount: number | undefined;
  id?: number;

}
// export BaseForm extends NewDispatch{
//   downMileage: number;

// }
export interface StationForms {
  // 订单编号
  // orderCode: number | undefined;
  // 站点状态
  stationType: number | undefined;
  // 站点
  station: string;
  // 站点编码
  stationCode: number | undefined;
  // 发车时间
  leaveTime?: string;
  // 到达时间
  arriveTime?: string;
  // 实际里程
  downMileage?: number;
  // 仪表盘照片
  downMileageFile?: any;
  // 仪表盘照片名称
  downMileageFileName?: string;
  // 状态
  status: number | undefined;

}
export interface CostDriverForms {
  // 订单编号
  // 费用日期
  date: string;
  // 驾驶类型
  type: number | undefined;
  // 司机名称
  upDriver: string;
  upDriverCode: number | undefined;
  // 司机联系方式
  upDriverPhone: string;
  // 车牌号
  upTractor: string;
  // 标准提成
  upAmount: number | undefined;
  fineFee: number | undefined;
  remark: string;
}
export interface IncomeForm {
  // 标准运费
  upAmount: number | undefined;
  // 放空里程
  emptyMileage: number | undefined;
  // 多装多卸里程
  multipleMileage: number | undefined;
  // 提送货里程
  takeMileage: number | undefined;
  // 备注信息
  remark: string;
}
export interface CostFuelForms {
  // 费用日期
  date: string;
  // 加油站
  location: string;
  // 司机名称
  upDriver?: string;
  // 标准用量
  upNum: number | undefined;

  // 标准单价
  upPrice?: number | undefined;
  // 标准费用
  upAmount: number | undefined;
  // 备注
  remark?: string;
  // 实际使用量（L）
  useNum: number | undefined; 
  // 实际费用（元）
  amount: number | undefined;
  // 实际单价（元）
  usePrice: number | undefined;
  status: number | undefined;
  supplierFuel?: string;
}
interface CostHighwayForms {
  date: string;
  upDriver?: string;
  upTractor?: string;
  upAmount: number | undefined;
}
export interface CostExpenseForms {
  // 司机姓名
  upDriver?: string;
  // 司机编码
  upDriverCode?: string;
  // 司机联系方式
  upDriverPhone?: string;
  // 车牌号
  upTractor?: string;
  // 报销费用
  amount: number | undefined;
  // 附件凭证
  file: string;
  // 附件名称
  fileName: string;
  // 备注
  remark?: string;
  // 费用日期
  date?: string;
  // 费用类型
  type?: string;
  typeCode?: number | undefined;
  // 费用地点
  location?: string;

}
export interface EditForm {
  baseForm: NewDispatch
  stationForms: StationForms[]
  costDriverForms: CostDriverForms[]
  costFuelForms: CostFuelForms[]
  costUreaForms: CostFuelForms[]
  costHighwayForms: CostHighwayForms[]
  costExpenseForms: CostExpenseForms[]
  incomeForm: IncomeForm
}

export interface NewState {
  loading?: boolean;
  dialogBorder?: boolean;
  fileSrc?: string;
  title?: string;
  tractor?: any;
  builtRow?: any;
  selectloading?: boolean;
  type?: number;
  date?: string;
  edit?: boolean;
  submitRecord?: boolean;
}

export interface Platform {
  // 客户日期
  orderDate: string;
  // 客户编号
  customerCode: number | undefined;
  // 项目编号
  projectCode: number | undefined;
  project?: string;
  // 线路
  route: string;
  // 牵引车牌
  tractor: string;
  // 车辆类型
  // 挂车车牌
  trailer: string;
  // 司机姓名
  driver: string;
  // 司机运费
  driverCost: number | undefined;
  // 平台运费
  plateCost: number | undefined;
  // 压车费用
  delayCost: number | undefined;
  // 司机收入
  income?: number | undefined;
  // 司机联系方式
  driverPhone: string;
  // 放空费用
  emptyCost: number | undefined;
  // 经停费用
  parkCost: number | undefined;
  // 扣款费用
  outCost: number | undefined;
  // 收款人姓名
  payPerson: string;
  // 收款电话
  payPhone: string;
  // 开户银行
  payBank: string;
  // 银行卡号
  payNumber: string;
  // 备注信息
  remark: string;
  id?: number | undefined;
}
export interface Stat {
  // 收入结算
  incomeSum: number;
  // 平台支出
  plateSum: number;
}
export interface PaymentForm {
  // 收入结算
  income: undefined | number;
  // 平台支付
  plateCost: undefined | number;
  // 司机运费
  driverCost: undefined | number;
  // 压车费
  delayCost: undefined | number;
  // 放空费
  emptyCost: undefined | number;
  // 经停费
  parkCost: undefined | number;
  // 扣款费
  outCost: undefined | number;
}
export interface Payment{
  title: string;
  number?: number;
  expenditure: number;
  length?: number;
  ids: undefined | string | number;
}