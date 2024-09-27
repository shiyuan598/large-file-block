/**
 * 自营业务台账
 */
export interface totalQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
  tractorCode?: string;
  customerCode?: string;
  projectCode?: string;
  routeCode?: string;
  status?: string;
  orderUuid?: string;
  arriveDate?: string;
  arriveStartDate?: string;
  arriveEndDate?: string;
}
export interface incomeQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
  tractorCode?: string;
  customerCode?: string;
  projectCode?: string;
  routeCode?: string;
  orderDateSort?: string;
  status?: string;
  orderUuid?: string;
  tranType?: string;
}
export interface ureaQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
  costStartTime?: string;
  costEndTime?: string;
  tractorCode?: string;
  customerCode?: string;
  projectCode?: string;
  routeCode?: string;
  location?: string;
  driverName?: string;
  orderDateSort?: string;
  status?: string;
  fuelType?: string;
  orderUuid?: string;
  supplierFuel?: string;
  tranType?: string;
  // fuleType?: string;
}
export interface highwayQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
  tractorCode?: string;
  customerCode?: string;
  projectCode?: string;
  routeCode?: string;
  orderDateSort?: string;
  status?: string;
  orderUuid?: string;
  costStartTime?: string;
  costEndTime?: string;
  tranType?: string;
}
export interface fuelQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
  costStartTime?: string;
  costEndTime?: string;
  tractorCode?: string;
  customerCode?: string;
  projectCode?: string;
  routeCode?: string;
  location?: string;
  driverName?: string;
  orderDateSort?: string;
  fuelType?: string;
  status?: string;
  orderUuid?: string;
  supplierFuel?: string;
  tranType?: string;
  fuleType?: string;
}
export interface expenseQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
  costStartTime?: string;
  costEndTime?: string;
  tractorCode?: string;
  customerCode?: string;
  projectCode?: string;
  routeCode?: string;
  driverCode?: string;
  location?: string;
  type?: string;
  orderDateSort?: string;
  status?: string;
  orderUuid?: string;
}
export interface driverQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
  tractorCode?: string;
  customerCode?: string;
  projectCode?: string;
  routeCode?: string;
  driverCode?: string;
  orderDateSort?: string;
  status?: string;
  orderUuid?: string;
}
export interface driverMonthQuery extends PageQuery {
  driverCode?: string;
  date?: string;
  status?: string;
  orderUuid?: string;
}
/**
 * 分页对象
 */
export interface totalPageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 收入
   */
  income?: string;

  /**
   * 主驾司机提成
   */
  firstDriverCost?: string;

  /**
   * 副驾司机提成
   */
  secondDriverCost?: string;

  /**
   * 油量
   */
  fuelNum?: string;

  /**
   * 油费
   */
  fuelCost?: string;

  /**
   * 尿素量
   */
  ureaNum?: string;

  /**
   * 高速费
   */
  highCost?: string;

  /**
   * 过磅费
   */
  weighCost?: string;

  /**
   * 停车费
   */
  parkingCost?: string;

  /**
   * 其他费
   */
  otherCost?: string;

  /**
   * 状态码
   * 收入【0未开票，1已开票】，
   * 主驾【0未付款，1已付款，2已核销】，
   * 副驾【0未付款，1已付款，2已核销】，
   * 油费【0未核销，1已核销】，
   * 尿素【0未核销，1已核销】，
   * 高速【0未核销，1已核销】，
   * 过磅【0未通过，1已通过，2已付款，3已核销】，
   * 停车【0未通过，1已通过，2已付款，3已核销】，
   * 其他【0未通过，1已通过，2已付款，3已核销】）
   */
  status?: string;
}

export interface incomePageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 标准运费
   */
  upAmount?: string;

  /**
   * 实际收入
   */
  amount?: string;

  /**
   * 放空里程
   */
  emptyMileage?: string;

  /**
   * 多装多卸里程
   */
  multipleMileage?: string;

  /**
   * 提送货里程
   */
  takeMileage?: string;

  /**
   * 额外运费
   */
  expandFee?: string;

  /**
   * 扣款
   */
  fineFee?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态（1：开票，0未开票）
   */
  status?: string;
}

export interface ureaPageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 费用日期
   */
  date?: string;

  /**
   * 加油站
   */
  location?: string;

  /**
   * 司机名称（主驾，副驾）
   */
  upDriver?: string;

  /**
   * 车牌号
   */
  upTractor?: string;

  /**
   * 标准用量
   */
  upNum?: string;

  /**
   * 标准单价
   */
  upPrice?: string;

  /**
   * 标准费用
   */
  upAmount?: string;

  /**
   * 核销量
   */
  useNum?: string;

  /**
   * 核销单价
   */
  usePrice?: string;

  /**
   * 核销金额
   */
  amount?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态（1：开票，0未开票）
   */
  status?: string;
}

export interface highwayPageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 费用日期
   */
  date?: string;

  /**
   * 司机名称（主驾，副驾）
   */
  upDriver?: string;

  /**
   * 车牌号
   */
  upTractor?: string;

  /**
   * 标准费用
   */
  upAmount?: string;

  /**
   * 核销金额
   */
  amount?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态（1：开票，0未开票）
   */
  status?: string;
}

export interface fuelPageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 费用日期
   */
  date?: string;

  /**
   * 加油站点
   */
  location?: string;

  /**
   * 司机名称（主驾，副驾）
   */
  upDriver?: string;

  /**
   * 车牌号
   */
  upTractor?: string;

  /**
   * 标准用量（二次加油为0）
   */
  upNum?: string;

  /**
   * 标准单价（二次加油为0）
   */
  upPrice?: string;

  /**
   * 标准费用
   */
  upAmount?: string;

  /**
   * 核销量
   */
  useNum?: string;

  /**
   * 核销单价
   */
  usePrice?: string;

  /**
   * 核销金额
   */
  amount?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态（1：开票，0未开票）
   */
  status?: string;
}

export interface expensePageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 费用日期
   */
  date?: string;

  /**
   * 费用类型（1过磅，2停车，3.其他）
   */
  type?: string;

  /**
   * 地点
   */
  location?: string;

  /**
   * 司机名称（主驾，副驾）
   */
  upDriver?: string;

  /**
   * 司机编号
   */
  upDriverCode?: string;

  /**
   * 司机联系方式
   */
  upDriverPhone?: string;

  /**
   * 车牌号
   */
  upTractor?: string;

  /**
   * 标准费用
   */
  upAmount?: string;

  /**
   * 核销金额
   */
  amount?: string;

  /**
   * 附件凭证
   */
  file?: string;

  /**
   * 附件凭证名称
   */
  fileName?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态(1:已通过;0:未通过)
   */
  status?: string;
}

export interface driverPageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 费用日期
   */
  date?: string;

  /**
   * 驾驶类型（1.主驾，2.副驾）
   */
  type?: string;

  /**
   * 司机名称（主驾，副驾）
   */
  upDriver?: string;

  /**
   * 司机编号
   */
  upDriverCode?: string;

  /**
   * 司机联系方式
   */
  upDriverPhone?: string;

  /**
   * 车牌号
   */
  upTractor?: string;

  /**
   * 标准提成
   */
  upAmount?: string;

  /**
   * 实际付款
   */
  realAmount?: string;

   /**
   * 平台付款
   */
   plateAmount?: string;

  /**
   * 实际垫付
   */
  expandFee?: string;

  /**
   * 实际扣款
   */
  fineFee?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态(1:已通过;0:未通过)
   */
  status?: string;
}
export interface driverMonthPageVO {
  /**
   * 订单编号
   */
  orderCode?: string;

  /**
   * 订单日期
   */
  orderDate?: string;

  /**
   * 客户（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编码（客户表base_up_customer）
   */
  customerCode?: string;

  /**
   * 项目(项目表base_up_project）
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 线路编码
   */
  routeCode?: string;

  /**
   * 订单线路
   */
  orderRoute?: string;

  /**
   * 实际牵引车
   */
  tractor?: string;

  /**
   * 实际牵引车编码
   */
  tractorCode?: string;

  /**
   * 费用日期
   */
  date?: string;

  /**
   * 实际付款
   */
  realAmount?: string;

  /**
   * 平台付款
   */
  plateAmount?: string;

  /**
   * 司机名称
   */
  driver?: string;

  /**
   * 司机编号
   */
  driverCode?: string;

  /**
   * 订单数
   */
  orderNum?: string;

  /**
   * 基础提成
   */
  baseAmount?: string;

  /**
   * 标准里程
   */
  upMileage?: string;

  /**
   * 实际里程
   */
  downMileage?: string;

  /**
   * 额外里程
   */
  extraMileage?: string;

  /**
   * 标准油耗
   */
  upFuelNum?: string;

  /**
   * 实际油耗
   */
  downFuelNum?: string;

  /**
   * 额外油耗
   */
  extraFuelNum?: string;

  /**
   * 油量奖励/扣款
   */
  fuelFee?: string;

  /**
   * 其他扣款
   */
  otherFineFee?: string;

  /**
   * 垫付金额
   */
  expendFee?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态(1:已通过;0:未通过)
   */
  status?: string;
}
