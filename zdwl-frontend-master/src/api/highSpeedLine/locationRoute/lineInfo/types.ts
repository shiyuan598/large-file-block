/**
 * 高速干线-线路信息查询对象类型
 */
export interface lineinfoQuery extends PageQuery {
  keywords?: string;
  projectCode?: string;
  customerCode?: string;
  upDriverType?: string
}

/**
 * 高速干线-线路信息分页对象
 */
export interface lineinfoPageVO {
  /**
     * 线路名称（不可编辑，唯一）
     */
  name?: string;

  /**
   * 客户名称（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编号（客户表base_up_customer）
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
   * 标准运费
   */
  upAmount?: string;

  /**
   * 标准里程
   */
  upMileage?: string;

  /**
   * 标准时效(小时)
   */
  upTime?: string;

  /**
   * 1:单驾，2:双驾
   */
  upDriverType?: string;

  /**
   * 标准主驾费用
   */
  upFirstDriverAmount?: string;

  /**
   * 标准副驾费用
   */
  upSecondDriverAmount?: string;

  /**
   * 标准油量
   */
  upFuelNum?: string;

  /**
   * 标准尿素量
   */
  upUreaNum?: string;

  /**
   * 标准高速费
   */
  upHighAmount?: string;

  /**
   * 出发地(站点表base_up_station)
   */
  startStation?: string;

  /**
   * 出发地编码(站点表base_up_station)
   */
  startCode?: string;

  /**
   * 目的地(站点表base_up_station)
   */
  endStation?: string;

  /**
   * 目的地编码(站点表base_up_station)
   */
  endCode?: string;

  /**
   * 途经点（，分割）(站点表base_up_station)
   */
  waypoints?: string;

  /**
   * 途经点编码（，分割）(站点表base_up_station)
   */
  waypointCodes?: string;
}

/**
 * 高速干线-线路信息表单类型
 */
export interface lineinfoForm {
  /**
     * 线路名称（不可编辑，唯一）
     */
  name?: string;

  /**
   * 客户名称（客户表base_up_customer）
   */
  customer?: string;

  /**
   * 客户编号（客户表base_up_customer）
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
   * 标准运费
   */
  upAmount?: string;

  /**
   * 标准里程
   */
  upMileage?: string;

  /**
   * 标准时效(小时)
   */
  upTime?: string;

  /**
   * 1:单驾，2:双驾
   */
  upDriverType?: string;

  /**
   * 标准主驾费用
   */
  upFirstDriverAmount?: string;

  /**
   * 标准副驾费用
   */
  upSecondDriverAmount?: string;

  /**
   * 标准油量
   */
  upFuelNum?: string;

  /**
   * 标准尿素量
   */
  upUreaNum?: string;

  /**
   * 标准高速费
   */
  upHighAmount?: string;

  /**
   * 出发地(站点表base_up_station)
   */
  startStation?: string;

  /**
   * 出发地编码(站点表base_up_station)
   */
  startCode?: string;

  /**
   * 目的地(站点表base_up_station)
   */
  endStation?: string;

  /**
   * 目的地编码(站点表base_up_station)
   */
  endCode?: string;

  /**
   * 途经点（，分割）(站点表base_up_station)
   */
  waypoints?: string;

  /**
   * 途经点编码（，分割）(站点表base_up_station)
   */
  waypointCodes?: string;
}
