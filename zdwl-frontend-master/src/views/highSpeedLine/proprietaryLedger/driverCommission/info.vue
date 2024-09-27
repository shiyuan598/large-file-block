<template>
  <div class="app-container">
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
              <el-form-item label="司机姓名">
                <el-select
                  v-model="queryParams.driverCode"
                  placeholder="请选择司机姓名"
                  style="align-items: center; width: 100%"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="remoteDriverMethod"
                >
                  <el-option
                    v-for="item in driverOptions"
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
            <el-col :span="6">
              <el-form-item label="订单编号">
                <el-input
                  v-model="queryParams.orderUuid"
                  style="width: 100%"
                  placeholder="请输入订单编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" style="justify-content: flex-end">
              <div style="display: flex">
                <el-button style="margin-right: 10px" @click="onReset"
                  >重置</el-button
                >
                <el-button type="primary" @click="handleQuery">查询</el-button>
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
          <el-button @click="exportClick">导出</el-button>
          <!-- <el-button type="primary" @click="importClick">批量付款</el-button> -->
        </div>
        <div
          class="indexClass"
          style="display: flex; align-items: center; height: 30px"
        >
          <span class="span-color">标准提成(元)：</span
          ><span class="text-span">{{ totalInfo.upAmount }}</span>
          <span style="padding-left: 24px" class="span-color"
            >付款提成(元)：</span
          ><span class="text-span">{{ totalInfo.amount }}</span>
          <span style="padding-left: 24px" class="span-color"
            >平台付款(元)：</span
          ><span class="text-span">{{ totalInfo.plateAmount }}</span>
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
          border
          tooltip-effect="light"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column fixed prop="orderUuid" label="订单编号" />
          <el-table-column fixed prop="status" label="核销状态">
            <template #default="scope">
              <div v-if="scope.row.status == 0" style="display: flex">
                <el-badge is-dot class="warning"></el-badge>未付款
              </div>
              <div v-if="scope.row.status == 1" style="display: flex">
                <el-badge is-dot class="blueS"></el-badge>已付款
              </div>
              <div v-if="scope.row.status == 2" style="display: flex">
                <el-badge is-dot class="untreated"></el-badge>已核销
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="订单日期" sortable>
            <template #default="scope">
              {{ dayjs(scope.row.date).format("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column prop="upDriver" label="司机姓名" />
          <el-table-column label="线路">
            <template #default="scope">
              {{ scope.row.route }}({{ scope.row.project }})
            </template>
          </el-table-column>
          <el-table-column prop="upTractor" label="车牌号" />
          <el-table-column label="司机提成(元)" align="center">
            <el-table-column prop="upAmount" label="标准" align="right" />
            <el-table-column prop="realAmount" label="付款" align="right">
              <template #default="scope">
                <el-tooltip
                  :content="scope.row.remark"
                  placement="top-start"
                  effect="light"
                >
                  {{ scope.row.realAmount }}
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="expandFee" label="补扣款(元)" align="right" />
          <el-table-column prop="plateAmount" align="right">
            <template v-slot:header>
              <span>平台付款</span>
              <el-tooltip
                content="实际付款*1.056"
                placement="top-start"
                effect="light"
              >
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          
          <!-- <el-table-column prop="fuelFee" width="130" align="right">
            <template v-slot:header>
              <span>油量奖励/扣款</span>
              <el-tooltip content="（里程标准油耗-实际油耗）*6" placement="top-start" effect="light">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="fineFee" label="扣款(元)"  width="130" align="right"/>
          <el-table-column prop="expandFee" label="垫付(元)"  width="130" align="right"/>
          <el-table-column prop="downMileage" label="实际里程"  width="130" align="right"/>
          <el-table-column prop="upMileage" label="标准里程"  width="130" align="right"/>
          <el-table-column prop="upUpFuelNum" label="标准油耗"  width="130" align="right"/>
          <el-table-column prop="upFuelNum" width="130" align="right">
            <template v-slot:header>
              <span>里程标准油耗</span>
              <el-tooltip content="实际里程*95% * (标准油耗/标准里程)" placement="top-start" effect="light">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="downFuelNum" width="130" label="实际油耗" align="right"/>
          <el-table-column prop="extraFuelNum" width="130" label="额外油耗" align="right"/>

          <el-table-column prop="route" label="路线名称"  width="300">
            <template #default="scope">
              <span v-if="scope.row.route != ''">{{ scope.row.route }}({{ scope.row.project }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="upTractor" label="车牌号码"  width="100"/>
          <el-table-column prop="driverType" label="单双驾"  width="100">
            <template #default="scope">
              <div v-if="scope.row.driverType == 1">单驾</div>
              <div v-if="scope.row.driverType == 2">双驾</div>
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
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { driverQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  getDriverPage,
  exportDriver,
  getDriverStat,
  postCostDriver,
  getDriverTemplate,
  importDriver,
} from "@/api/highSpeedLine/platformLedger/index";
import { tractorListQuery } from "@/api/depreciation/index";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { getLineinfoList } from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close, InfoFilled } from "@element-plus/icons-vue";
import { driverList, driverParamsList } from "@/api/depreciation";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import dayjs from "dayjs";
const multipleSelection = ref([]);
const total = ref(0);
const customerNameOptions = ref([] as any[]);
const queryFormRef = ref(ElForm);
const queryParams = reactive<driverQuery>({
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
  apiFn: importDriver,
  downFn: getDriverTemplate,
});
const cardOptions = ref([] as any[]);
const projectNameOptions = ref([] as any[]);
const routeOptions = ref([] as any[]);
const driverOptions = ref([] as any[]);
const loading = ref(false);
const totalInfo = ref({
  amount: 0,
  plateAmount: 0,
  upAmount: 0,
});
const statusOptions = [
  {
    id: 0,
    name: "未付款",
  },
  {
    id: 1,
    name: "已付款",
  },
  {
    id: 2,
    name: "已核销",
  },
];
const emit = defineEmits({
  paramsFn: null,
  disableClick: null,
});
const onReset = () => {
  state.time = "";
  queryParams.startTime = "";
  queryParams.endTime = "";
  queryParams.tractorCode = "";
  queryParams.customerCode = "";
  queryParams.projectCode = "";
  queryParams.routeCode = "";
  queryParams.driverCode = "";
  queryParams.orderDateSort = "";
  queryParams.status = "";
  queryParams.pageNum = 1;
  queryParams.orderUuid = "";
  handleQuery();
};

const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.orderDateSort = "asc";
  } else {
    queryParams.orderDateSort = "desc";
  }
  handleQuery();
};

const datePickerStartChange = (val: any) => {
  // queryParams.startTime = "";
  // queryParams.endTime = "";
  // if (val) {
  //   queryParams.startTime = val[0];
  //   queryParams.endTime = val[1];
  // }
  console.log(val)
};

const importClick = () => {
  emit("disableClick", true);
  emit("paramsFn", {
    importFn: state.apiFn,
    downFn: state.downFn,
    downloadType: "",
    title: "智能调度 - 自营业务台账 - 司机提成",
  });
};

const exportClick = () => {
  exportDriver(queryParams)
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

const handleQuery = () => {
  loading.value = true;
  getDriverPage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getDriverStatInfo();
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

const remoteDriverMethod = (query: string) => {
  driverParamsList({ keywords: query }).then((rs) => {
    driverOptions.value = [];
    Object.assign(driverOptions.value, rs.data);
  });
};

const remoteRouteMethod = (query: string) => {
  getLineList({ keywords: query });
};

const getDriverList = () => {
  driverList().then((rs) => {
    driverOptions.value = [];
    Object.assign(driverOptions.value, rs.data);
  });
};
const getLineList = (data: { keywords: string } | null) => {
  getLineinfoList(data).then((rs) => {
    routeOptions.value = [];
    Object.assign(routeOptions.value, rs.data);
  });
};

const getDriverStatInfo = () => {
  getDriverStat(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};

const projectList = () => {
  getInfoList({}).then((rs) => {
    Object.assign(projectNameOptions.value, rs.data);
  });
};

onMounted(() => {
  queryParams.orderDateSort = "desc";
  handleQuery();
  projectList();
  getVehicleList({});
  customerList();
  getDriverList();
  getLineList(null);
  getDriverStatInfo();
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

  .blueS {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: blue !important;
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
