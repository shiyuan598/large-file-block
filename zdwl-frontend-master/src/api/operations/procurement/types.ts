/**
 * 智慧运营-采购信息-柴油查询对象类型
 */
export interface PurchaseFuelQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  supplierCode?: string;
  min?: string;
  max?: string;
  purPerson?: string;
  businessCode?: string;
  business?: string;
  supplierFuelCode?: string;
  supplierFuel?: string;
  startTime?: string;
  endTime?: string;
  purTimeSort?: string;
  projectCode?: string;
}
/**
 * 智慧运营-采购信息-尿素对象类型
 */
export interface PurchaseUreaQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  supplierCode?: string;
  min?: string;
  max?: string;
  purPerson?: string;
  businessCode?: string;
  business?: string;
  supplierFuelCode?: string;
  supplierFuel?: string;
  startTime?: string;
  endTime?: string;
  purTimeSort?: string;
  projectCode?: string;
}
/**
 * 智慧运营-采购信息-ETC查询对象类型
 */
export interface PurchaseETCQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  supplierCode?: string;
  min?: string;
  max?: string;
  purPerson?: string;
  businessCode?: string;
  business?: string;
  supplierFuelCode?: string;
  supplierFuel?: string;
  startTime?: string;
  endTime?: string;
  purTimeSort?: string;
  projectCode?: string;
}

/**
 * 智慧运营-采购信息-柴油分页对象
 */
export interface PurchaseFuelPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  PurchaseTime?: string;
  /**
   * 维修厂名称
   */
  supplierPurchase?: string;
  /**
   * 维修金额（元）
   */
  amount?: number;
  /**
   * 送修人
   */
  PurchasePerson?: string;
}

/**
 * 智慧运营-采购信息-尿素分页对象
 */
export interface PurchaseUreaPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  PurchaseTime?: string;
  /**
   * 维修厂名称
   */
  supplierPurchase?: string;
  /**
   * 维修金额（元）
   */
  amount?: number;
  /**
   * 尿素位置
   */
  UreaLocationCode?: number;
  /**
   * 送修人
   */
  PurchasePerson?: string;
}
/**
 * 智慧运营-采购信息-ETC分页对象
 */
export interface PurchaseETCPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  PurchaseTime?: string;
  /**
   * 维修厂名称
   */
  supplierPurchase?: string;
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
  PurchasePerson?: string;
}

/**
 * 智慧运营-采购信息-柴油表单类型
 */
export interface PurchaseFuelForm {
  /**
   * 加油站名称
   */
  supplierFuel?: string;
  /**
   * 加油站code
   */
  supplierFuelCode?: string;
  /**
   * 采购日期
   */
  purTime?: string;
  /**
   * 采购量
   */
  purNum?: string;
  /**
   * 采购金额
   */
  purAmount?: string;
  /**
   * 采购单价（升）
   */
  purPriceLitre?: string;
  /**
   * 采购单价（吨）
   */
  purPriceTon?: string;
  /**
   * 采购人
   */
  purPerson?: string;
  /**
   * 折扣比例
   */
  discount?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 采购有无协议
   */
  agreement: number,
  /**
   * 协议附件
   */
  file: string,
  /**
   * 行业
   */
  business: string,
  /**
   * 行业code
   */
  businessCode: number
}

/**
 * 智慧运营-采购信息-尿素表单类型
 */
export interface PurchaseUreaForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  PurchaseTime?: string;
  /**
   * 维修厂名称
   */
  supplierPurchase?: string;
  /**
   * 维修金额（元）
   */
  amount?: string;
  /**
   * 尿素位置
   */
  UreaLocationCode?: string;
  /**
   * 送修人
   */
  PurchasePerson?: string;
}

/**
 * 智慧运营-采购信息-ETC表单类型
 */
export interface PurchaseETCForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 维修日期
   */
  PurchaseTime?: string;
  /**
   * 维修厂名称
   */
  supplierPurchase?: string;
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
  PurchasePerson?: string;
}
