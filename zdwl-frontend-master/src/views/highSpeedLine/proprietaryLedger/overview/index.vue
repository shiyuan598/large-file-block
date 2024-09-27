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
            >总览</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-card>
          <div class="parkClass">
            <footer class="header__footer">
              <el-form
                :model="queryParams"
                class="demo-form-inline"
                ref="queryFormRef"
                style="margin-bottom: 0px"
                label-width="100px"
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
                  <el-col :span="6">
                    <el-form-item label="费用状态">
                      <el-select
                        v-model="queryParams.status"
                        size="default"
                        placeholder="请选择费用状态"
                        style="align-items: center; width: 100%"
                        clearable
                      >
                        <el-option
                          v-for="item in statusOptions"
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
                    <el-form-item label="订单编号">
                      <el-input
                        v-model="queryParams.orderUuid"
                        style="width: 100%"
                        placeholder="请输入订单编号"
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
              "
            >
              <div>
                <el-button type="primary" @click="refreshClick"
                  >刷新最近三个月数据</el-button
                >
                <el-button @click="exportClick">导出</el-button>
              </div>
              <div class="indexClass" style="text-align: right; height: 60px">
                <div>
                  <span class="span-color">合同收入(元)：</span
                  ><span class="text-span">{{ totalInfo.upIncome }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >开票收入(元)：</span
                  ><span class="text-span">{{ totalInfo.income }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >预计支出(元)：</span
                  ><span class="text-span">{{ totalInfo.upCost }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >支出核销(元)：</span
                  ><span class="text-span">{{ totalInfo.cost }}</span>
                </div>
                <div>
                  <span class="span-color">实际运营里程(KM)：</span
                  ><span class="text-span">{{ totalInfo.downMileage }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >预计差额(元)：</span
                  ><span class="text-span">{{ totalInfo.expect }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >实际差额(元)：</span
                  ><span class="text-span">{{ totalInfo.actual }}</span>
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
                <el-table-column prop="status" label="费用状态" width="100">
                  <template #default="scope">
                    <div
                      v-if="scope.row.status != '2221111'"
                      style="display: flex"
                    >
                      <el-badge is-dot class="warning"></el-badge>未完结
                    </div>
                    <div v-else style="display: flex">
                      <el-badge is-dot class="untreated"></el-badge>已完结
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderDate" label="订单日期" width="100">
                  <template #default="scope">
                    {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
                  </template>
                </el-table-column>
                <el-table-column prop="orderDate" label="到达日期" width="100">
                  <template #default="scope">
                    {{
                      (scope.row.arriveTime &&
                        dayjs(scope.row.arriveTime).format("YYYY-MM-DD")) ||
                      "--"
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="customer" label="客户名称" width="100" />
                <el-table-column prop="orderRoute" label="路线名称" width="300">
                  <template #default="scope">
                    <span v-if="scope.row.orderRoute != ''"
                      >{{ scope.row.orderRoute }}({{ scope.row.project }})</span
                    >
                  </template>
                </el-table-column>

                <el-table-column prop="tractor" label="车牌号" width="120" />
                <el-table-column
                  prop="income"
                  label="运费（元）"
                  align="right"
                  width="150"
                >
                  <template #default="scope">
                    <div style="display: flex">
                      <div>{{ scope.row.income }}</div>
                      <div
                        v-if="scope.row.status.split('')[0] == '0'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>未开票</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[0] == '1'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已开票</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[0] == '2'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已回款</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="firstDriverCost"
                  label="主驾提成（元）"
                  align="right"
                  width="150"
                >
                  <template #default="scope">
                    <div style="display: flex">
                      <div>{{ scope.row.firstDriverCost }}</div>
                      <div
                        v-if="scope.row.status.split('')[1] == '0'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>未付款</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[1] == '1'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已付款</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[1] == '2'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已核销</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="secondDriverCost"
                  label="副驾提成（元）"
                  align="right"
                  width="150"
                >
                  <template #default="scope">
                    <div style="display: flex">
                      <div>{{ scope.row.secondDriverCost }}</div>
                      <div
                        v-if="scope.row.status.split('')[2] == '0'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>未付款</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[2] == '1'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已付款</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[2] == '2'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已核销</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fuelCost"
                  label="油费（元）"
                  align="right"
                  width="150"
                >
                  <template #default="scope">
                    <div style="display: flex">
                      <div>{{ scope.row.fuelCost }}</div>
                      <div
                        v-if="scope.row.status.split('')[3] == '0'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>未核销</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[3] == '1'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已核销</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ureaCost"
                  label="尿素费用（元）"
                  align="right"
                  width="150"
                >
                  <template #default="scope">
                    <div style="display: flex">
                      <div>{{ scope.row.ureaCost }}</div>
                      <div
                        v-if="scope.row.status.split('')[4] == '0'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>未核销</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[4] == '1'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已核销</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="highCost"
                  label="高速费用（元）"
                  align="right"
                  width="150"
                >
                  <template #default="scope">
                    <div style="display: flex">
                      <div>{{ scope.row.highCost }}</div>
                      <div
                        v-if="scope.row.status.split('')[5] == '0'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>未核销</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[5] == '1'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已核销</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="expenseCost"
                  label="垫付费用（元）"
                  align="right"
                  width="150"
                >
                  <template #default="scope">
                    <div style="display: flex">
                      <div>{{ scope.row.expenseCost }}</div>
                      <div
                        v-if="scope.row.status.split('')[6] == '0'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>未通过</el-button>
                      </div>
                      <div
                        v-if="scope.row.status.split('')[6] == '1'"
                        style="padding-left: 10px"
                      >
                        <el-button size="small" round>已通过</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gpsMileage"
                  label="GPS里程"
                  width="100"
                />
                <!-- <el-table-column prop="parkingCost" label="停车费用（元）"  width="150">
                  <template #default="scope">
                    <div style="display: flex;">
                      <div>{{ scope.row.parkingCost }}</div>
                      <div v-if="scope.row.status.split('')[7] == '0'" style="padding-left: 10px;"><el-button size="small" round>未通过</el-button></div>
                      <div v-if="scope.row.status.split('')[7] == '1'" style="padding-left: 10px;"><el-button size="small" round>已通过</el-button></div>
                      <div v-if="scope.row.status.split('')[7] == '2'" style="padding-left: 10px;"><el-button size="small" round>已付款</el-button></div>
                      <div v-if="scope.row.status.split('')[7] == '3'" style="padding-left: 10px;"><el-button size="small" round>已核销</el-button></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="otherCost" label="其他费用（元）" width="150">
                  <template #default="scope">
                    <div style="display: flex;">
                      <div>{{ scope.row.otherCost }}</div>
                      <div v-if="scope.row.status.split('')[8] == '0'" style="padding-left: 10px;"><el-button size="small" round>未通过</el-button></div>
                      <div v-if="scope.row.status.split('')[8] == '1'" style="padding-left: 10px;"><el-button size="small" round>已通过</el-button></div>
                      <div v-if="scope.row.status.split('')[8] == '2'" style="padding-left: 10px;"><el-button size="small" round>已付款</el-button></div>
                      <div v-if="scope.row.status.split('')[8] == '3'" style="padding-left: 10px;"><el-button size="small" round>已核销</el-button></div>
                    </div>
                  </template>
                </el-table-column> -->
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
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { totalQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  getTotalPage,
  exportTotal,
  getTotalStat,
  getThreeMounth,
} from "@/api/highSpeedLine/platformLedger/index";
import { tractorListQuery } from "@/api/depreciation/index";
import { getLineinfoList } from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import dayjs from "dayjs";
import router from "@/router";
import { calculate } from "@/utils";
const multipleSelection = ref([]);
const total = ref(0);
const customerNameOptions = ref([] as any[]);
const queryFormRef = ref(ElForm);
const queryParams = reactive<totalQuery>({
  pageNum: 1,
  pageSize: 10,
});
const state = reactive({
  showData: false,
  componentList: [],
  tableData: [],
  dialogTitle: "",
  dialogAction: "",
  deleteId: "",
  time: "",
  startTime: "",
  endTime: "",
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
  downMileage: 0,
  cost: 0,
  income: 0,
  upCost: 0,
  upIncome: 0,
  expect: 0,
  actual: 0,
});
totalInfo.value.expect = computed(() =>
  calculate(
    Number(totalInfo.value.upIncome),
    Number(totalInfo.value.upCost),
    "-"
  )
);

totalInfo.value.actual = computed(() =>
  calculate(totalInfo.value.income, totalInfo.value.cost, "-")
);
const onReset = () => {
  state.time = "";
  queryParams.startTime = "";
  queryParams.endTime = "";
  queryParams.tractorCode = "";
  queryParams.customerCode = "";
  queryParams.projectCode = "";
  queryParams.routeCode = "";
  queryParams.status = "";
  queryParams.pageNum = 1;
  queryParams.orderUuid = "";
  handleQuery();
};

const refreshClick = () => {
  loading.value = true;
  getThreeMounth().then((rs) => {
    handleQuery();
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
// const startTime = computed(()=>queryParams.startTime!==""&&typeof(queryParams.startTime)!=='undefined')
// const startTime = computed(()=>queryParams.startTime!==""&&typeof(queryParams.startTime)!=='undefined')
// console.log(startTime)
const handleQuery = () => {
  loading.value = true;
  getTotalPage(queryParams)
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
  getTotalStat(queryParams).then((rs) => {
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

onMounted(() => {
  handleQuery();
  projectList();
  getVehicleList({});
  customerList();
  getLineList(null);
  getTotalStatInfo();
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
    margin-left: 20px !important;
    margin-top: 20px;
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
