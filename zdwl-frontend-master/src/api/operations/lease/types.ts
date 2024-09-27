/**
 * 智慧运营-租赁管理查询对象类型
 */
export interface LeaseQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  supplierCode?: string;
  startTimeS?: string
  startTimeE?: string
  endTimeS?: string
  endTimeE?: string
  business?: string;
  businessCode?: string;
}

/**
 * 智慧运营-租赁管理分页对象
 */
export interface LeasePageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 租赁公司
   */
  supplierLease?: string;
  /**
   * 金额（元）
   */
  amount?: string;
  /**
   * 租赁时间
   */
  startTime?: string
}

/**
 * 智慧运营-租赁管理表单类型
 */
export interface LeaseForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 租赁公司
   */
  supplierLease?: string;
  /**
   * 金额（元）
   */
  amount?: string;
  /**
   * 租赁时间
   */
  startTime?: string
}
