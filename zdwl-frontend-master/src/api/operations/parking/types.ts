/**
 * 智慧运营-固定停车查询对象类型
 */
export interface ParkingQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  supplierCode?: string
  business?: string
  startTimeS?: string
  startTimeE?: string
  endTimeS?: string
  endTimeE?: string
  supplierParking?: string
  businessCode?: string
}

/**
 * 智慧运营-固定停车分页对象
 */
export interface ParkingPageVO {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 停车厂
   */
  supplierParking?: string;
  /**
   * 金额（元）
   */
  amount?: number;
  /**
   * 停车时间
   */
  //TODO
  time?: string
}

/**
 * 智慧运营-固定停车表单类型
 */
export interface ParkingForm {
  /**
   * 车牌号码
   */
  card?: string;
  /**
   * 业务场景编码
   */
  businessCode?: string;
  /**
   * 业务场景
   */
  business?: string;
  /**
   * 停车厂
   */
  supplierParking?: string;
  /**
   * 停车厂编码
   */
  supplierParkingCode?: string;
  /**
   * 金额（元）
   */
  amount?: number;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
}
