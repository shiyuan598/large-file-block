/**
 * 高速干线-单价信息查询对象类型
 */
export interface priceinfoQuery extends PageQuery {
  startTime?: string;
  endTime?: string;
}

/**
 * 高速干线-单价信息分页对象
 */
export interface priceinfoPageVO {

  /**
   * 油费单价
   */
  fuelPrice?: string;

  /**
   * 尿素单价
   */
  ureaPrice?: string;

  /**
   * 创建日期
   */
  createTime?: string;
}

/**
 * 高速干线-单价信息表单类型
 */
export interface priceinfoForm {
  /**
   * 油费单价
   */
  fuelPrice?: string;

  /**
   * 尿素单价
   */
  ureaPrice?: string;

  /**
   * 创建日期
   */
  createTime?: string;
}
