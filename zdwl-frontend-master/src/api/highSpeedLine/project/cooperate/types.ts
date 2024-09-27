/**
 * 高速干线-合作客户查询对象类型
 */
export interface projectCooperateQuery extends PageQuery {
  keywords?: string;
}

/**
 * 高速干线-合作客户分页对象
 */
export interface projectCooperatePageVO {
  /**
   * 客户名称
   */
  customName?: string;
  /**
   * 客户全称
   */
  fullName?: string;
  /**
   * 联系人姓名
   */
  name?: string;
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 合作状态
   */
  handleStatus?: string;
}

/**
 * 高速干线-合作客户表单类型
 */
export interface projectCooperateForm {
  /**
   * 客户名称
   */
  customName?: string;
  /**
   * 客户全称
   */
  fullName?: string;
  /**
   * 联系人姓名
   */
  name?: string;
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 合作状态
   */
  handleStatus?: string;
}
