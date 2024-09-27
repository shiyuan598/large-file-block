/**
 * 供应商-加油站查询对象类型
 */
export interface SupplierGasQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  status?: number;
}
/**
 * 供应商-ETC供应商查询对象类型
 */
export interface SupplierETCQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  status?: number;
}
/**
 * 供应商-修理厂查询对象类型
 */
export interface SupplierRepairQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  status?: number;
}
/**
 * 供应商-保险公司查询对象类型
 */
export interface SupplierInsuranceQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  status?: number;
}
/**
 * 供应商-挂车租赁公司查询对象类型
 */
export interface SupplierTrailerQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  status?: number;
}
/**
 * 供应商-固定停车场查询对象类型
 */
export interface SupplierParkQuery extends PageQuery {
  supplierType?: string;
  keywords?: string;
  status?: number;
}

/**
 * 供应商-加油站分页对象
 */
export interface SupplierGasPageVO {
  /**
   * 加油站名称
   */
  name?: string;
  /**
   * 油量剩余情况(L)
   */
  balanceFuel?: number;
  /**
   * 尿素量剩余情况(KG)
   */
  balanceUrea?: number;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}

/**
 * 供应商-ETC供应商分页对象
 */
export interface SupplierETCPageVO {
  /**
   * ETC供应商名称
   */
  name?: string;
  /**
   * 剩余金额(元)
   */
  balance?: string;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}

/**
 * 供应商-修理厂分页对象
 */
export interface SupplierRepairPageVO {
  /**
   * 修理厂名称
   */
  name?: string;
  /**
   * 本月维修记录（次）
   */
  recordNumMonth?: number;
  /**
   * 本月维修金额（元）
   */
  useAmountMonth?: number;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}

/**
 * 供应商-保险公司分页对象
 */
export interface SupplierInsurancePageVO {
  /**
   * 保险公司名称
   */
  name?: string;
  /**
   * 年度累计金额（元）
   */
  useAmountMonth?: number;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}

/**
 * 供应商-挂车租赁公司分页对象
 */
export interface SupplierTrailerPageVO {
  /**
   * 租赁公司名称
   */
  name?: string;
  /**
   * 本月累计金额（元）
   */
  useAmountMonth?: number;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}


/**
 * 供应商-固定停车场分页对象
 */
export interface SupplierParkPageVO {
  /**
   * 租赁公司名称
   */
  name?: string;
  /**
   * 本月累计金额（元）
   */
  useAmountMonth?: number;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}


/**
 * 供应商-加油站表单类型
 */
export interface SupplierGasForm {
  /**
   * 加油站名称
   */
  name?: string;
  /**
   * 油量剩余情况(L)
   */
  balanceFuel?: string;
  /**
   * 尿素量剩余情况(KG)
   */
  balanceUrea?: string;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}

/**
 * 供应商-ETC供应商表单类型
 */
export interface SupplierETCForm {
  /**
   * ETC供应商名称
   */
  name?: string;
  /**
   * 剩余金额(元)
   */
  balance?: string;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}

/**
 * 供应商-修理厂表单类型
 */
export interface SupplierRepairForm {
  /**
   * 修理厂名称
   */
  name?: string;
  /**
   * 本月维修记录（次）
   */
  recordNumMonth?: string;
  /**
   * 本月维修金额（元）
   */
  useAmountMonth?: string;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}

/**
 * 供应商-保险公司表单类型
 */
export interface SupplierInsuranceForm {
  /**
   * 保险公司名称
   */
  name?: string;
  /**
   * 年度累计金额（元）
   */
  useAmountMonth?: number;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: string;

  contractStatus?: string;
}

/**
 * 供应商-挂车租赁公司分页对象
 */
export interface SupplierTrailerForm {
  /**
   * 租赁公司名称
   */
  name?: string;
  /**
   * 本月累计金额（元）
   */
  useAmountMonth?: string;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}


/**
 * 供应商-固定停车场分页对象
 */
export interface SupplierParkForm {
  /**
   * 租赁公司名称
   */
  name?: string;
  /**
   * 本月累计金额（元）
   */
  useAmountMonth?: string;
  /**
   * 联系人
   */
  contactPerson?: string;
  /**
   * 联系方式
   */
  phone?: string;
  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;

  contractStatus?: string;
}
