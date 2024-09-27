/**
 * 智慧运营-维修-黄油查询对象类型
 */
export interface RepairButterQuery extends PageQuery {
  supplierRepairCode?: string;
  supplierRepair?: string;
  keywords?: string;
  business?: string;
  startTime?: string;
  endTime?: string;
  repairPerson?: string;
  businessCode?: string;
  repairTimeSort?: string;
}
/**
 * 智慧运营-维修-轮胎对象类型
 */
export interface RepairTireQuery extends PageQuery {
  supplierRepairCode?: string;
  supplierRepair?: string;
  keywords?: string;
  business?: string;
  businessCode?: string;
  startTime?: string;
  endTime?: string;
  repairPerson?: string;
  repairTimeSort?: string;
  tireRepairType?: string
}
/**
 * 智慧运营-维修-杂项查询对象类型
 */
export interface RepairOtherQuery extends PageQuery {
  supplierRepairCode?: string;
  supplierRepair?: string;
  keywords?: string;
  business?: string;
  businessCode?: string;
  startTime?: string;
  endTime?: string;
  repairPerson?: string;
  repairTimeSort?: string;
  content?: string;
}
/**
 * 智慧运营-维修-保养查询对象类型
 */
export interface RepairUpkeepQuery extends PageQuery {
  supplierRepairCode?: string;
  supplierRepair?: string;
  keywords?: string;
  business?: string;
  businessCode?: string;
  startTime?: string;
  endTime?: string;
  repairPerson?: string;
  upkeepType: string;
  repairTimeSort?: string;
}

/**
 * 智慧运营-维修-黄油分页对象
 */
export interface RepairButterPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepair?: string;
  /**
   * 维修金额（元）
   */
  amount?: string;
  /**
   * 送修人
   */
  repairPerson?: string;
}

/**
 * 智慧运营-维修-轮胎分页对象
 */
export interface RepairTirePageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepair?: string;
  /**
   * 维修金额（元）
   */
  amount?: string;
  /**
   * 轮胎位置
   */
  tireLocationCode?: string;
  /**
   * 送修人
   */
  repairPerson?: string;
}
/**
 * 智慧运营-维修-杂项分页对象
 */
export interface RepairOtherPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepair?: string;
  /**
   * 维修金额（元）
   */
  amount?: string;
  /**
   * 维修项目
   */
  content?: string;
  /**
   * 送修人
   */
  repairPerson?: string;
}

/**
 * 智慧运营-维修-保养分页对象
 */
export interface RepairUpkeepPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 保养日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepair?: string;
  /**
   * 保养金额（元）
   */
  amount?: string;
  /**
   * 保养位置
   */
  upkeepType?: string;
  /**
   * 保养项目
   */
  content?: string;
  /**
   * 本次保养公里数
   */
  mileage?: number;
  /**
   * 下次保养公里数
   */
  nextMileage?: number;
  /**
   * 送修人
   */
  repairPerson?: string;
}

/**
 * 智慧运营-维修-黄油表单类型
 */
export interface RepairButterForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepair?: string;
  /**
   * 维修厂名称code
   */
  supplierRepairCode?: string;
  /**
   * 维修金额（元）
   */
  amount?: string;
  /**
   * 送修人
   */
  repairPerson?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 行业
   */
  business: string;
  /**
   * 行业code
   */
  businessCode: string;
}

/**
 * 智慧运营-维修-轮胎表单类型
 */
export interface RepairTireForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepair?: string;
  /**
   * 维修金额（元）
   */
  amount?: string;
  /**
   * 轮胎位置
   */
  tireLocationCode?: string;
  /**
   * 送修人
   */
  repairPerson?: string;
  /**
   * 行业
   */
  business: string;
  /**
   * 行业code
   */
  businessCode: string;
}

/**
 * 智慧运营-维修-杂项表单类型
 */
export interface RepairOtherForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepair?: string;
  /**
   * 维修金额（元）
   */
  amount?: string;
  /**
   * 维修项目
   */
  content?: string;
  /**
   * 送修人
   */
  repairPerson?: string;
  /**
   * 行业
   */
  business: string;
  /**
   * 行业code
   */
  businessCode: string;
}

/**
 * 智慧运营-维修-保养表单类型
 */
export interface RepairUpkeepForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 保养日期
   */
  repairTime?: string;
  /**
   * 维修厂名称
   */
  supplierRepairCode?: string;
  /**
   * 保养金额（元）
   */
  amount?: string;
  /**
   * 保养位置
   */
  upkeepType?: string;
  /**
   * 保养项目
   */
  content?: string;
  /**
   * 本次保养公里数
   */
  mileage?: number;
  /**
   * 下次保养公里数
   */
  nextMileage?: number;
  /**
   * 送修人
   */
  repairPerson?: string;
  /**
   * 行业
   */
  business: string;
  /**
   * 行业code
   */
  businessCode: string;
}
