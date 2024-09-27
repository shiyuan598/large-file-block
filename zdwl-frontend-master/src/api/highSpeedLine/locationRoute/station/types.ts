/**
 * 高速干线-站点信息查询对象类型
 */
export interface stationQuery extends PageQuery {
  keywords?: string;
  projectCode?: string;
  status?: string
}

/**
 * 高速干线-站点信息分页对象
 */
export interface stationPageVO {
  /**
   * 站点名称
   */
  name?: string;

  /**
   * 所属项目
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 电子围栏半径
   */
  radius?: string;

  /**
   * 经度
   */
  longitude?: string;

  /**
   * 纬度
   */
  latitude?: string;

  /**
   * 状态(1:关;0:开)
   */
  status?: string;
}

/**
 * 高速干线-站点信息表单类型
 */
export interface stationForm {
  /**
   * 站点名称
   */
  name?: string;

  /**
   * 所属项目
   */
  project?: string;

  /**
   * 项目编号(项目表base_up_project）
   */
  projectCode?: string;

  /**
   * 电子围栏半径
   */
  radius?: string;

  /**
   * 经度
   */
  longitude?: string;

  /**
   * 纬度
   */
  latitude?: string;

  /**
   * 状态(1:关;0:开)
   */
  status?: string;
}
