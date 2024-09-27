/**
 * 高速干线-项目信息查询对象类型
 */
export interface projectInfoQuery extends PageQuery {
  keywords?: string;
}

/**
 * 高速干线-项目信息分页对象
 */
export interface projectInfoPageVO {
  /**
   * 项目名称
   */
  projectName?: string;
  /**
   * 项目描述
   */
  projectDesc?: string;
  /**
   * 项目状态
   */
  handleStatus?: string;
}

/**
 * 高速干线-项目信息表单类型
 */
export interface projectInfoForm {
  /**
   * 项目名称
   */
  projectName?: string;
  /**
   * 项目描述
   */
  projectDesc?: string;
  /**
   * 项目状态
   */
  handleStatus?: string;
}
