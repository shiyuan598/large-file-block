<template>
  <div class="app-container">
    <el-container>
      <el-header
        style="
          background-color: white;
          display: flex;
          justify-content: flex-start;
          height: 56px;
        "
      >
        <span
          style="
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #8c8c8c;
            display: flex;
            align-items: center;
          "
          >当前位置：</span
        >
        <el-breadcrumb separator="-" style="display: flex; align-items: center">
          <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }"
            >智能调度</el-breadcrumb-item
          >
          <el-breadcrumb-item
            :to="{ path: '/highSpeedLine/proprietaryLedger/overview' }"
            >自营业务台账</el-breadcrumb-item
          >
          <el-breadcrumb-item
            style="
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              color: #323233;
            "
            >计提总览</el-breadcrumb-item
          >
          <el-breadcrumb-item
            style="
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              color: #323233;
            "
            v-if="importFlg"
            >{{ state.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-card v-if="!importFlg">
          <div class="parkClass">
            <footer class="header__footer">
              <el-form
                :model="queryParams"
                class="demo-form-inline"
                ref="queryFormRef"
                style="margin-bottom: 0px"
                label-width="70"
                label-position="left"
              >
                <el-row class="row-bg" justify="space-between">
                  <el-col :span="6">
                    <el-form-item label="客户名称">
                      <el-select
                        v-model="queryParams.customerCode"
                        size="default"
                        placeholder="请选择项目名称"
                        style="align-items: center; width: 100%"
                        clearable
                      >
                        <el-option
                          v-for="item in customerNameOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="项目名称">
                      <el-select
                        v-model="queryParams.projectCode"
                        size="default"
                        placeholder="请选择项目名称"
                        style="align-items: center; width: 100%"
                        clearable
                      >
                        <el-option
                          v-for="item in projectNameOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="路线名称">
                      <el-select
                        v-model="queryParams.routeCode"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请选择路线名称"
                        style="width: 100%"
                        :remote-method="remoteRouteMethod"
                        clearable
                      >
                        <el-option
                          v-for="item in routeOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-bg" justify="space-between">
                  <el-col :span="6">
                    <el-form-item label="车牌号码">
                      <el-select
                        v-model="queryParams.tractorCode"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请选择车牌号码"
                        style="width: 100%"
                        :remote-method="remoteMethod"
                        clearable
                      >
                        <el-option
                          v-for="item in cardOptions"
                          :key="item.card"
                          :label="item.card"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单日期">
                      <el-col :span="11"
                        ><el-date-picker
                          style="width: 100%"
                          v-model="queryParams.startTime"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          date-format="YYYY/MM/DD"
                          type="date"
                          placeholder="开始时间"
                      /></el-col>
                      <el-col :span="2" class="text-center">-</el-col>
                      <el-col :span="11">
                        <el-date-picker
                          style="width: 100%"
                          v-model="queryParams.endTime"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          date-format="YYYY/MM/DD"
                          type="date"
                          placeholder="结束时间"
                      /></el-col>
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-show="state.activeType"
                    :span="6"
                    style="justify-content: flex-end"
                  >
                    <div style="display: flex">
                      <el-button style="margin-right: 10px" @click="onReset"
                        >重置</el-button
                      >
                      <el-button type="primary" @click="handleQuery"
                        >查询</el-button
                      >
                      <el-button
                        type="primary"
                        v-if="state.activeType"
                        @click="activeClick"
                        link
                        >展开<el-icon><ArrowDown /></el-icon
                      ></el-button>
                    </div>
                  </el-col>
                  <el-col v-show="!state.activeType" :span="6">
                    <el-form-item label="订单编号">
                      <el-input
                        v-model="queryParams.orderUuid"
                        style="width: 100%"
                        placeholder="请输入订单编号"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row
                  v-show="!state.activeType"
                  class="row-bg"
                  justify="space-between"
                >
                  <el-col v-show="!state.activeType" :span="6">
                    <el-form-item label="到达日期">
                      <el-date-picker
                        v-model="state.arrTime"
                        type="daterange"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        date-format="YYYY/MM/DD ddd"
                        style="width: 100%"
                        @change="dateArrStartChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="6" style="justify-content: flex-end">
                    <div style="display: flex">
                      <el-button style="margin-right: 10px" @click="onReset"
                        >重置</el-button
                      >
                      <el-button type="primary" @click="handleQuery"
                        >查询</el-button
                      >
                      <el-button
                        type="primary"
                        v-if="!state.activeType"
                        @click="activeClick"
                        link
                        >收起<el-icon><ArrowUp /></el-icon
                      ></el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </footer>
            <el-row
              class="mb-4"
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-right: 20px;
                margin-bottom: 0;
              "
            >
              <div style="margin-top: 28px; padding-left: 20px">
                <el-button type="primary" @click="monthLoadingClick"
                  >刷新指定月份数据</el-button
                >

                <el-button @click="exportClick">导出</el-button>

                <el-popover placement="right" :width="400" trigger="click">
                  <template #reference>
                    <el-button>导入</el-button>
                  </template>
                  <!-- <el-select
                  v-model="state.importSelect"
                  placeholder="Select"
                  style="width: 140px"
                >
                  <el-option label="油费计提导入" value="1" />
                  <el-option label="尿素计提导入" value="2" />
                  <el-option label="高速费计提导入" value="3" />
                </el-select> -->
                  <el-row justify="space-around">
                    <el-col :span="8"
                      ><el-button
                        type="primary"
                        @click="importClick('油费计提导入', 'fuel')"
                        plain
                        >油费计提导入</el-button
                      ></el-col
                    >
                    <el-col :span="8"
                      ><el-button
                        type="primary"
                        @click="importClick('尿素计提导入', 'urea')"
                        plain
                        >尿素计提导入</el-button
                      ></el-col
                    >
                    <el-col :span="8"
                      ><el-button
                        type="primary"
                        @click="importClick('高速费计提导入', 'highway')"
                        plain
                        >高速费计提导入</el-button
                      ></el-col
                    >
                  </el-row>
                </el-popover>
              </div>
              <div class="indexClass" style="text-align: right; height: 80px">
                <div>
                  <span class="span-color">合同收入(元)：</span
                  ><span class="text-span">{{ totalInfo.incomeTotal }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >未开票收入(元)：</span
                  ><span class="text-span">{{ totalInfo.NotClosedTotal }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >开票收入(元)：</span
                  ><span class="text-span">{{
                    totalInfo.closedIncomeTotal
                  }}</span>
                </div>
                <div>
                  <span class="span-color">计提费用：</span
                  ><span class="text-span">{{ totalInfo.accrualTotal }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >未核销费用(元)：</span
                  ><span class="text-span">{{
                    totalInfo.NotClosedIncomeTotal
                  }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >核销费用(元)：</span
                  ><span class="text-span">{{ totalInfo.closedTotal }}</span>
                </div>
              </div>
            </el-row>
            <div style="padding: 10px 20px; width: 100%">
              <el-table
                ref="multipleTableRef"
                :data="state.tableData"
                style="width: 100%"
                header-cell-class-name="headclass"
                v-loading="loading"
                show-overflow-tooltip="true"
                tooltip-effect="light"
                border
                @selection-change="handleSelectionChange"
              >
                <el-table-column fixed type="selection" width="55" />
                <el-table-column
                  fixed
                  prop="orderUuid"
                  label="订单编号"
                  width="150"
                />
                <el-table-column prop="orderDate" label="订单日期" width="100">
                  <template #default="scope">
                    {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
                  </template>
                </el-table-column>
                <el-table-column prop="orderDate" label="到达日期" width="100">
                  <template #default="scope">
                    {{
                      (scope.row.arriveDate &&
                        dayjs(scope.row.arriveDate).format("YYYY-MM-DD")) ||
                      "--"
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="customer" label="客户名称" width="100" />
                <el-table-column prop="orderRoute" label="路线名称" width="300">
                  <template #default="scope">
                    <span v-if="scope.row.orderRoute != ''"
                      >{{ scope.row.route }}({{ scope.row.project }})</span
                    >
                  </template>
                </el-table-column>

                <el-table-column prop="tractor" label="车牌号" width="120" />
                <el-table-column label="运费(元)" align="center">
                  <el-table-column
                    prop="income"
                    label="计提费用"
                    align="right"
                    width="100"
                  />
                  <el-table-column
                    prop="closedIncome"
                    label="开票费用"
                    align="right"
                    width="100"
                  />
                </el-table-column>
                <el-table-column label="平台司机提成(元)" align="center">
                  <el-table-column
                    prop="driverCost"
                    label="计提费用"
                    align="right"
                    width="100"
                  />
                  <el-table-column
                    prop="closedDriverCost"
                    label="核销费用"
                    align="right"
                    width="100"
                  />
                </el-table-column>
                <el-table-column label="油费(元)" align="center">
                  <el-table-column
                    prop="fuelCost"
                    label="计提费用"
                    align="right"
                    width="100"
                  />
                  <el-table-column
                    prop="closedFuelCost"
                    label="核销费用"
                    align="right"
                    width="100"
                  />
                </el-table-column>
                <el-table-column label="尿素费(元)" align="center">
                  <el-table-column
                    prop="ureaCost"
                    label="计提费用"
                    align="right"
                    width="100"
                  />
                  <el-table-column
                    prop="closedUreaCost"
                    label="核销费用"
                    align="right"
                    width="100"
                  />
                </el-table-column>
                <el-table-column label="高速费(元)" align="center">
                  <el-table-column
                    prop="highCost"
                    label="计提费用"
                    align="right"
                    width="100"
                  />
                  <el-table-column
                    prop="closedHighCost"
                    label="核销费用"
                    align="right"
                    width="100"
                  />
                </el-table-column>
              </el-table>
              <el-row class="pagination-style" justify="end">
                <el-pagination
                  background
                  layout="total, prev, pager, next, sizes, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  @pagination="handleQuery"
                  :pager-count="5"
                  :page-sizes="[10, 20, 30, 40, 100]"
                  v-model:total="total"
                  v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize"
                />
              </el-row>
            </div>
          </div>
        </el-card>
        <div v-if="importFlg">
          <el-card class="procurementClass" shadow="never" style="height: 85vh">
            <importSlot
              :title="state.title"
              :apiFn="state.apiFn"
              :downFn="state.downFn"
              @returnList="returnList"
            ></importSlot>
          </el-card>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      width="1000"
      v-model="state.monthLoading"
      class="newDialogClass"
      title="刷新指定月份数据"
      @close="cancellation"
    >
      <div class="text-center mt-4 mb-4">
        <el-date-picker
          class="mr-20px"
          v-model="state.month"
          type="month"
          placeholder="刷新指定月份数据"
          format="YYYY-MM"
          value-format="YYYY-MM"
        />
      </div>
      <div class="text-right mb-10px">
        <el-button @click="cancellation" size="default">取消</el-button>
        <el-button type="primary" @click="refreshClick()" size="default"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { totalQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  dispatchAccrualPage,
  exportTotal,
  getDispatchAccrual,
  refreshByMonth,
  getDispatchAccrualTemplate,
  imporDispatchFuel,
  imporDispatchUrea,
  imporDispatcHighway,
} from "@/api/highSpeedLine/platformLedger/index";
import { tractorListQuery } from "@/api/depreciation/index";
import { getLineinfoList } from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { ElMessage } from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import dayjs from "dayjs";
import importSlot from "@/views/Import/index.vue";
import { calculate } from "@/utils";
const multipleSelection = ref([]);
const total = ref(0);
const customerNameOptions = ref([] as any[]);
const queryFormRef = ref(ElForm);
const queryParams = reactive<totalQuery>({
  pageNum: 1,
  pageSize: 10,
});
const importFlg = ref(false);
const state = reactive({
  activeType: true,
  showData: false,
  componentList: [],
  tableData: [],
  dialogTitle: "",
  dialogAction: "",
  deleteId: "",
  time: "",
  arrTime: "",
  startTime: "",
  endTime: "",
  importSelect: "1",
  month: "",
  monthLoading: false,
  title: "导入",
  apiFn: undefined,
  downFn: getDispatchAccrualTemplate,
});
const statusOptions = [
  {
    id: 0,
    name: "未完结",
  },
  {
    id: 1,
    name: "已完结",
  },
];
const cardOptions = ref([] as any[]);
const projectNameOptions = ref([] as any[]);
const routeOptions = ref([] as any[]);
const loading = ref(false);
const totalInfo = ref({
  incomeTotal: 0, // 合同收入
  accrualTotal: 0, //计提费用
  NotClosedTotal: 0, //未开票费用
  closedTotal: 0, // 开票收入
  closedIncomeTotal: 0, // 核销费用
  NotClosedIncomeTotal: 0, //未核销费用
});
totalInfo.value.NotClosedTotal = computed(() =>
  calculate(
    Number(totalInfo.value.incomeTotal),
    Number(totalInfo.value.closedIncomeTotal),
    "-"
  )
);

totalInfo.value.NotClosedIncomeTotal = computed(() =>
  calculate(totalInfo.value.accrualTotal, totalInfo.value.closedTotal, "-")
);
const onReset = () => {
  state.time = "";
  queryParams.startTime = "";
  queryParams.endTime = "";
  state.arrTime = "";
  queryParams.arriveStartDate = "";
  queryParams.arriveEndDate = "";
  queryParams.tractorCode = "";
  queryParams.customerCode = "";
  queryParams.projectCode = "";
  queryParams.routeCode = "";
  queryParams.status = "";
  queryParams.pageNum = 1;
  queryParams.orderUuid = "";
  queryParams.arriveDate = "";
  handleQuery();
};

const refreshClick = () => {
  loading.value = true;
  refreshByMonth({ month: state.month })
    .then((rs) => {
      handleQuery();
      state.monthLoading = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

const datePickerStartChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};
const dateArrStartChange = (val: any) => {
  queryParams.arriveStartDate = "";
  queryParams.arriveEndDate = "";
  if (val) {
    queryParams.arriveStartDate = val[0];
    queryParams.arriveEndDate = val[1];
  }
};

const exportClick = () => {
  exportTotal(queryParams)
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      });
      const a = document.createElement("a");
      const href = window.URL.createObjectURL(blob); // 下载的链接
      a.href = href;
      a.download = decodeURI(
        response.headers["content-disposition"].split(";")[1].split("=")[1]
      ); // 获取后台设置的文件名称
      document.body.appendChild(a);
      a.click(); // 点击导出
      document.body.removeChild(a); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
      ElMessage.success("导出成功");
    })
    .catch(() => {
      ElMessage.error("导出失败");
    });
};

const customerList = () => {
  getCooperateList({}).then((rs) => {
    Object.assign(customerNameOptions.value, rs.data);
  });
};
const activeClick = () => {
  state.activeType = !state.activeType;
};
const handleSelectionChange = (val: never[]) => {
  multipleSelection.value = val;
};

const handleSizeChange = (value: number) => {
  queryParams.pageSize = value;
  handleQuery();
};
const handleCurrentChange = (value: number) => {
  queryParams.pageNum = value;
  handleQuery();
};

const handleQuery = () => {
  loading.value = true;
  dispatchAccrualPage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getTotalStatInfo();
    })
    .finally(() => {
      loading.value = false;
    });
};
const cancellation = () => {
  state.monthLoading = false;
  state.month = "";
};
const monthLoadingClick = () => {
  state.monthLoading = true;
};
const getVehicleList = (data: any) => {
  tractorListQuery(data).then((res) => {
    cardOptions.value = res.data;
  });
};

const remoteMethod = (query: string) => {
  getVehicleList({ keywords: query });
};

const remoteRouteMethod = (query: string) => {
  getLineList({ keywords: query });
};

const getLineList = (data: { keywords: string } | null) => {
  getLineinfoList(data).then((rs) => {
    routeOptions.value = [];
    Object.assign(routeOptions.value, rs.data);
  });
};

const getTotalStatInfo = () => {
  getDispatchAccrual(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};

const sum = (arr: any) => {
  return arr.reduce(function (prev: any, curr: any, idx: any, arr: any) {
    console.log(parseInt(prev) + parseInt(curr));
    return parseInt(prev) + parseInt(curr);
  });
};

const projectList = () => {
  getInfoList({}).then((rs) => {
    Object.assign(projectNameOptions.value, rs.data);
  });
};
const importClick = (val: string, type: string) => {
  state.apiFn =
    type === "fuel"
      ? imporDispatchFuel
      : type === "urea"
      ? imporDispatchUrea
      : imporDispatcHighway;
  importFlg.value = true;
  state.title = val;
};
const returnList = () => {
  importFlg.value = !importFlg.value;
  handleQuery();
};
onMounted(() => {
  handleQuery();
  projectList();
  getVehicleList({});
  customerList();
  getLineList(null);
});

onUnmounted(() => {});
</script>
<style lang="scss" scoped>
.app-container {
  .parkClass {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .header__footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .demo-form-inline {
    width: 100%;
    margin: 0 20px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .el-row {
    margin-bottom: 20px;
  }

  :deep(.el-table th) {
    background-color: #f6f9ff;
  }

  :deep(.newDialogClass .el-dialog__header) {
    border-bottom: 1px solid lightgray;
    margin: 0 10px;
  }
  :deep(.newDialogClass .el-dialog__body) {
    padding: 10px var(--el-dialog-padding-primary);
  }

  .newFormClass {
    background-color: rgba(220, 222, 224, 0.17);
    padding: 20px;
  }

  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .el-col-6 {
    display: flex;
    align-items: center;
  }

  .indexClass {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #606060;
    margin-right: 40px;
  }
  :deep(.demo-form-inline .el-form-item) {
    margin: 0px !important;
    align-items: center;
    width: 100%;
  }

  .untreated {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: lightgray !important;
    }
  }
  .warning {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: #ffb608 !important;
    }
  }
  .processed {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: red;
    }
  }

  :deep(.el-breadcrumb__inner) {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #303030 !important;
  }

  :deep(.el-breadcrumb__inner.is-link) {
    color: #8c8c8c !important;
  }

  :deep(.el-table thead th) {
    background: #f6f9ff;
    color: #303030;
  }

  .text-span {
    color: #303030;
    font-size: 16px;
    line-height: 40px;
    font-weight: 600;
    text-align: left;
  }

  .span-color {
    color: #606060;
    font-size: 14px;
    line-height: 40px;
    display: inline-block;
    vertical-align: top;
  }
}
</style>
