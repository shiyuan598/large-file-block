export interface dispatchAccrual extends PageQuery {
    // 订单编号
    orderUuid: string;
    // 费用类型
    billType: number | null;
    // 供应商
    supplier: string;
    // 车牌号码
    tractorCode: string;
    startTime: string;
    endTime: string;
    picker?:string[];
  }
  