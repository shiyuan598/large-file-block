/**
 * 智慧运营-年检信息查询对象类型
 */
export interface AnnualInspectionExaminedQuery extends PageQuery {
  keywords?: string;
  card?: string;
  checkLocation?: string;
  businessCode?: string;
  business?: string;
  examinedTimeSort?: string
  time?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * 智慧运营-年检信息分页对象
 */
export interface AnnualInspectionExaminedPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 年检时间
   */
  checkTime?: string;
  /**
   * 检查地点
   */
  checkLocation?: string;
  /**
   * 金额（元）
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
   * 业务场景code
   */
  businessCode?: string;
  /**
   * 业务场景
   */
  business?: string;
}

/**
 * 智慧运营-维修-黄油表单类型
 */
export interface AnnualInspectionExaminedForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 年检时间
   */
  checkTime?: string;
  /**
   * 检查地点
   */
  checkLocation?: string;
  /**
   * 金额（元）
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
   * 业务场景code
   */
  businessCode?: string;
  /**
   * 业务场景
   */
  business?: string;
}
