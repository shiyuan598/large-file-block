/**
 * 智慧运营-事故管理查询对象类型
 */
export interface AccidentQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  accidentType?: string;
  accidentTimeSort?: string;
  driver?: string;
  businessCode?: string;
  business?: string;
}

/**
 * 智慧运营-事故管理分页对象
 */
export interface AccidentPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 事故日期
   */
  accidentTime?: string;
  /**
   * 状态
   */
  handleStatus?: number;
  /**
   * 事故类型
   */
  accidentType?: string
  /**
   * 发生地点
   */
  location?: string;
  /**
   * 事故描述
   */
  content?: string;
  /**
   * 驾驶员
   */
  driver?: string;
  /**
   * 处罚结果
   */
  result?: string;
  /**
   * 自费金额（元）
   */
  amount?: string;
}

/**
 * 智慧运营-事故管理表单类型
 */
export interface AccidentForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 事故日期
   */
  accidentTime?: string;
  /**
   * 状态
   */
  handleStatus?: number;
  /**
   * 事故类型
   */
  accidentType?: string
  /**
   * 发生地点
   */
  location?: string;
  /**
   * 事故描述
   */
  content?: string;
  /**
   * 驾驶员
   */
  driver?: string;
  /**
   * 处罚结果
   */
  result?: string;
  /**
   * 自费金额（元）
   */
  amount?: string;
}
