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
                <el-date-picker
                  v-model="state.time"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  date-format="YYYY/MM/DD ddd"
                  style="width: 100%"
                  @change="datePickerStartChange"
                />
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
            <el-col :span="6">
              <el-form-item label="供应商">
                <el-select
                  v-model="queryParams.supplierFuel"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择供应商"
                  style="width: 100%"
                  :remote-method="remoteQueryMethod"
                  clearable
                >
                  <el-option
                    v-for="item in supplierFuelOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="加油日期">
                <el-date-picker
                  v-model="state.costTime"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  date-format="YYYY/MM/DD ddd"
                  style="width: 100%"
                  @change="datePickerCostChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" justify="space-between">
            <el-col :span="6">
              <el-form-item label="运输类型">
                <el-select
                  v-model="queryParams.tranType"
                  size="default"
                  placeholder="请选择运输类型"
                  style="align-items: center; width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in props.tranTypelist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6"></el-col>
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
          <el-popconfirm
            width="180px"
            title="确定要核销归零吗?"
            @confirm="zeroClick"
          >
            <template #reference>
              <el-button type="primary">核销归零</el-button>
            </template>
          </el-popconfirm>
        </div>
        <div
          class="indexClass"
          style="display: flex; align-items: center; height: 30px"
        >
          <span class="span-color">标准油量(L)：</span
          ><span class="text-span">{{ totalInfo.upNum }}</span>
          <span style="padding-left: 24px" class="span-color"
            >核销油量(L)：</span
          ><span class="text-span">{{ totalInfo.useNum }}</span>
          <span style="padding-left: 24px" class="span-color"
            >标准费用(元)：</span
          ><span class="text-span">{{ totalInfo.upAmount }}</span>
          <span style="padding-left: 24px" class="span-color"
            >核销费用(元)：</span
          ><span class="text-span">{{ totalInfo.amount }}</span>
        </div>
      </el-row>
      <div style="padding: 10px 20px; width: 100%">
        <el-table
          ref="multipleTableRef"
          :data="state.tableData"
          style="width: 100%"
          header-cell-class-name="headclass"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          border
          show-overflow-tooltip="true"
          tooltip-effect="light"
          @sort-change="sortChange"
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column
            fixed
            prop="orderUuid"
            label="订单编号"
            width="150"
          />
          <el-table-column fixed prop="status" label="核销状态" width="100">
            <template #default="scope">
              <div v-if="scope.row.status == '0'" style="display: flex">
                <el-badge is-dot class="warning"></el-badge>未核销
              </div>
              <div v-if="scope.row.status == '1'" style="display: flex">
                <el-badge is-dot class="untreated"></el-badge>已核销
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderDate"
            label="订单日期"
            width="120"
            sortable
          >
            <template #default="scope">
              {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column prop="upTractor" label="车牌号" width="100" />
          <el-table-column label="核销金额(元)" align="center">
            <el-table-column
              prop="upAmount"
              label="标准"
              align="right"
              width="100"
            />
            <el-table-column
              prop="amount"
              label="核销"
              align="right"
              width="100"
            />
          </el-table-column>
          <el-table-column prop="route" label="路线名称" width="300">
            <template #default="scope">
              <span v-if="scope.row.route != ''"
                >{{ scope.row.route }}({{ scope.row.project }})</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="date" label="加油日期" width="100">
            <template #default="scope">
              {{ dayjs(scope.row.date).format("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column prop="location" label="加油站" width="120" />
          <el-table-column prop="supplierFuel" label="供应商" width="300" />
          <el-table-column label="加油单价(元/L)" align="center">
            <el-table-column
              prop="upPrice"
              label="标准"
              align="right"
              width="100"
            />
            <el-table-column
              prop="usePrice"
              label="核销"
              align="right"
              width="100"
            />
          </el-table-column>
          <el-table-column label="加油量(L)" align="center">
            <el-table-column
              prop="upNum"
              label="标准"
              align="right"
              width="100"
            />
            <el-table-column
              prop="useNum"
              label="核销"
              align="right"
              width="100"
            />
          </el-table-column>
          <el-table-column
            prop="route"
            :show-overflow-tooltip="true"
            width="82"
            label="运输类型"
          >
            <template #default="scope">
              {{ scope.row.tranType }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="driver" label="行驶里程（KM）" width="150"/>
          <el-table-column prop="result" label="里程表图片" width="150" /> -->
          <!-- <el-table-column prop="action" label="操作">
            <template #default="scope">
              <el-button key="text" type="text" @click="editClick(scope.$index, scope.row)">编辑</el-button>
              <el-button key="text" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button key="text" type="text" @click="handleClick(scope.$index, scope.row)" v-if="scope.row.handleStatus == '0'">处理</el-button>
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
import { fuelQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  getFuelPage,
  exportFuel,
  getFuelStat,
  fuelZero,
} from "@/api/highSpeedLine/platformLedger/index";
import { tractorListQuery } from "@/api/depreciation/index";
import { getLineinfoList } from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import { getRepair, getFuelInfo } from "@/api/supplier/index";
import dayjs from "dayjs";
import router from "@/router";
const multipleSelection = ref([]);
const total = ref(0);
const customerNameOptions = ref([] as any[]);
const fuelOptions = ref([] as any[]);
const queryFormRef = ref(ElForm);
const queryParams = reactive<fuelQuery>({
  pageNum: 1,
  pageSize: 10,
});
const props = defineProps(["tranTypelist"]);
const state = reactive({
  showData: false,
  componentList: [],
  tableData: [],
  dialogTitle: "",
  dialogAction: "",
  deleteId: "",
  time: "",
  costTime: "",
  startTime: "",
  endTime: "",
});
const cardOptions = ref([] as any[]);
const projectNameOptions = ref([] as any[]);
const supplierFuelOptions = ref([] as any[]);
const routeOptions = ref([] as any[]);
const loading = ref(false);
const totalInfo = ref({
  amount: 0,
  upAmount: 0,
  upNum: 0,
  useNum: 0,
});
const statusOptions = [
  {
    id: 0,
    name: "未核销",
  },
  {
    id: 1,
    name: "已核销",
  },
];
const onReset = () => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  queryParams.costStartTime = "";
  queryParams.costEndTime = "";
  queryParams.tractorCode = "";
  queryParams.customerCode = "";
  queryParams.projectCode = "";
  queryParams.routeCode = "";
  queryParams.location = "";
  queryParams.driverName = "";
  queryParams.orderDateSort = "";
  queryParams.fuelType = "1";
  queryParams.status = "";
  queryParams.pageNum = 1;
  queryParams.orderUuid = "";
  queryParams.supplierFuel = "";
  queryParams.tranType = "";
  state.time = "";
  state.costTime = "";
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
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const datePickerCostChange = (val: any) => {
  queryParams.costStartTime = "";
  queryParams.costEndTime = "";
  if (val) {
    queryParams.costStartTime = val[0];
    queryParams.costEndTime = val[1];
  }
};

const exportClick = () => {
  exportFuel(queryParams)
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

const zeroClick = () => {
  let ids = multipleSelection.value
    .map((item: any) => item.id)
    .join(",")
    .toString();
  fuelZero(ids).then((rs) => {
    ElMessage.success("核销归零成功");
    handleQuery();
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
  getFuelPage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getFuelStatInfo();
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

const remoteQueryMethod = (query: string) => {
  getFuelInfo({ keywords: query }).then((rs) => {
    supplierFuelOptions.value = [];
    Object.assign(supplierFuelOptions.value, rs.data);
  });
};

const getFuelList = () => {
  getFuelInfo({}).then((rs) => {
    supplierFuelOptions.value = [];
    Object.assign(supplierFuelOptions.value, rs.data);
  });
};

const getLineList = (data: { keywords: string } | null) => {
  getLineinfoList(data).then((rs) => {
    routeOptions.value = [];
    Object.assign(routeOptions.value, rs.data);
  });
};

const getFuelStatInfo = () => {
  getFuelStat(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};

const projectList = () => {
  getInfoList({}).then((rs) => {
    Object.assign(projectNameOptions.value, rs.data);
  });
};

onMounted(() => {
  queryParams.fuelType = "1";
  queryParams.orderDateSort = "desc";
  handleQuery();
  projectList();
  getVehicleList({});
  customerList();
  getLineList(null);
  getFuelList();
  getFuelStatInfo();
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
