/**
 * 智慧运营-保险信息查询对象类型
 */
export interface InsuranceQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  startTimeS?: string;
  startTimeE?: string;
  endTimeS?: string;
  endTimeE?: string;
  supplierCode?: string;
  insuranceType?: string;
  insuranceTypeCode?: string;
  business?: string;
  businessCode?: string;
}

/**
 * 智慧运营-保险信息分页对象
 */
export interface InsurancePageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 业务名称
   */
  business?: string;

  /**
   * 业务名称Code
   */
  businessCode?: string;
  /**
   * 保险公司
   */
  supplierInsurance?: string;
  /**
   * 保险公司Code
   */
  supplierInsuranceCode?: string;
  /**
   * 保险项目
   */
  insuranceType?: string
  /**
   * 保险项目Code
   */
  insuranceTypeCode?: string
  /**
   * 保单附件
   */
  file?: string;
  /**
   * 保险费用（元）
   */
  amount?: string;
  /**
   * 保险开始时间
   */
  startTime?: string;
  /**
   * 保险结束时间
   */
  endTime?: string;
}

/**
 * 智慧运营-保险信息表单类型
 */
export interface InsuranceForm {
  /**
   * 车牌号码
   */
  card?: string;
  
  /**
   * 业务名称
   */
  business?: string;

  /**
   * 业务名称Code
   */
  businessCode?: string;

  /**
   * 保险公司
   */
  supplierInsurance?: string;
  /**
   * 保险项目Code
   */
  supplierInsuranceCode?: string
  /**
   * 保险项目
   */
  insuranceType?: string
  /**
   * 保单附件
   */
  file?: string;
  /**
   * 保险费用（元）
   */
  amount?: string;
  /**
   * 保险开始时间
   */
  startTime?: string;
  /**
   * 保险结束时间
   */
  endTime?: string;
}
