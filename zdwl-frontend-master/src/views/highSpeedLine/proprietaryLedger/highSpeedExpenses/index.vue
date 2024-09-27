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
            >高速费用</el-breadcrumb-item
          >
          <el-breadcrumb-item
            style="
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              color: #323233;
            "
            v-if="importFlg"
            >导入</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-header>
      <el-main>
        <div v-if="!importFlg">
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
                    <el-col :span="6">
                      <el-form-item label="费用日期">
                        <el-col :span="11"
                          ><el-date-picker
                            style="width: 100%"
                            v-model="queryParams.costStartTime"
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
                            v-model="queryParams.costEndTime"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            date-format="YYYY/MM/DD"
                            type="date"
                            placeholder="结束时间"
                        /></el-col>
                      </el-form-item>
                    </el-col>
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
                            v-for="item in tranTypelist"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="row-bg" justify="space-between">
                    <el-col :span="6"></el-col>
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
                  margin: 12px 16px 2px;
                "
              >
                <div>
                  <!-- <el-button type="primary" @click="makeClick"
                    >对账核销</el-button
                  > -->
                  <el-button type="primary" @click="importClick"
                    >对账核销</el-button
                  >
                  <el-button @click="exportClick">导出</el-button>
                </div>
                <div
                  class="indexClass"
                  style="display: flex; align-items: center; height: 30px"
                >
                  <span class="span-color">标准费用(元)：</span
                  ><span class="text-span">{{ totalInfo.upAmount }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >实际费用(元)：</span
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
                  show-overflow-tooltip="true"
                  border
                  tooltip-effect="light"
                  @selection-change="handleSelectionChange"
                  @sort-change="sortChange"
                >
                  <el-table-column
                    fixed
                    type="selection"
                    width="55"
                    :selectable="selectable"
                  />
                  <el-table-column
                    fixed
                    prop="orderUuid"
                    label="订单编号"
                    width="150"
                  />
                  <el-table-column prop="status" label="核销状态">
                    <template #default="scope">
                      <div v-if="scope.row.status == '0'" style="display: flex">
                        <el-badge is-dot class="warning"></el-badge>未对账
                      </div>
                      <div v-if="scope.row.status == '1'" style="display: flex">
                        <el-badge is-dot class="untreated"></el-badge>已核销
                      </div>
                      <div v-if="scope.row.status == '2'" style="display: flex">
                        <el-badge is-dot class="untreated"></el-badge>已对账
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="订单日期" sortable>
                    <template #default="scope">
                      {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="upTractor" label="车牌号码" />
                  <el-table-column prop="downMileage" label="实际里程" />
                  <el-table-column prop="date" label="费用日期">
                    <template #default="scope">
                      {{ dayjs(scope.row.date).format("YYYY-MM-DD") }}
                    </template>
                  </el-table-column>
                  <el-table-column label="核销金额(元)" align="center">
                    <el-table-column
                      prop="upAmount"
                      label="标准"
                      align="right"
                    />
                    <el-table-column prop="amount" label="核销" align="right" />
                  </el-table-column>
                  <el-table-column prop="route" label="路线名称" width="300">
                    <template #default="scope">
                      <span v-if="scope.row.route != ''"
                        >{{ scope.row.route }}({{ scope.row.project }})</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="updateTime" label="更新时间" width="160" />
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
        </div>
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
      v-model="dialogMakeVisible"
      :title="'批量核销'"
      width="50%"
      :before-close="handleClose"
      class="newDialogClass"
    >
      <div style="display: flex; text-align: center; padding: 24px 0 24px 56px">
        <div style="display: table-cell">
          <div>累计标准高速费(元)</div>
          <div>{{ state.sumMileages * 0.6 }}</div>
        </div>
        <div style="padding: 20px">=</div>
        <div style="display: table-cell">
          <div>累计里程(KM)</div>
          <div>{{ state.sumMileages }}</div>
        </div>
        <div style="padding: 20px">x</div>
        <div style="display: table-cell">
          <div>高速标准单价(元/KM)</div>
          <div>0.6</div>
        </div>
      </div>
      <el-form
        :model="newMakeForm"
        :rules="newRules"
        label-position="left"
        label-width="120px"
        ref="newFormRef"
        class="newFormClass"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="累计核销金额" prop="amount">
              <el-input
                v-model="newMakeForm.amount"
                placeholder="请输入累计核销金额"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newCancelClick">取 消</el-button>
          <el-button
            type="primary"
            @click="newFormClick"
            :disabled="getDisabled"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { highwayQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  getHighwayPage,
  exportHighway,
  getHighwayStat,
  makeHighway,
  getHighwayTemplate,
  importHighway,
} from "@/api/highSpeedLine/platformLedger/index";
import { tractorListQuery } from "@/api/depreciation/index";
import { getLineinfoList } from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import importSlot from "@/views/Import/index.vue";
import dayjs from "dayjs";
import { Options } from "@/api/depreciation/types";
import { getOptions } from "@/api/vehicleInfo";
const multipleSelection = ref([]);
const total = ref(0);
const getDisabled = computed(
  () => newMakeForm.amount === "" && validateNumber(newMakeForm.amount)
);
const customerNameOptions = ref([] as any[]);
const projectNameOptions = ref([] as any[]);
const queryFormRef = ref(ElForm);
const queryParams = reactive<highwayQuery>({
  pageNum: 1,
  pageSize: 10,
});
const importFlg = ref(false);
const returnList = () => {
  importFlg.value = !importFlg.value;
};
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
  downloadType: "",
  costTime: "",
  selectId: "",
  sumMileages: 0,
  apiFn: importHighway,
  downFn: getHighwayTemplate,
  title: "智能调度 - 自营业务台账 - 高速费用",
});
const emit = defineEmits({
  paramsFn: null,
  disableClick: null,
});
interface RuleForm {
  amount: string;
}
const newMakeForm = reactive<RuleForm>({
  amount: "",
});
const newRules = reactive<FormRules<RuleForm>>({
  amount: [
    { required: true, message: "请输入累计核销金额", trigger: "blur" },
    { type: "number", message: "请输入数字", trigger: "blur" },
  ],
});
const cardOptions = ref([] as any[]);
const routeOptions = ref([] as any[]);
const loading = ref(false);
const dialogMakeVisible = ref(false);
const totalInfo = ref({
  amount: 0,
  upAmount: 0,
});
const statusOptions = [
  {
    id: 0,
    name: "未对账",
  },
  {
    id: 1,
    name: "已核销",
  },
  {
    id: 2,
    name: "已对账",
  },
];
const selectable = (row: any, index: any) => {
  return row.status == 0;
};
// 运输类型
const tranTypelist = ref<Options[]>([]);
const getOption = async (type: string) => {
  const { data } = await getOptions(type);
  data.map((n: { label: string; value: Number }) => {
    n.value = Number(n.value);
  });
  tranTypelist.value = data;
};
const onReset = () => {
  state.time = "";
  queryParams.startTime = "";
  queryParams.endTime = "";
  queryParams.tractorCode = "";
  queryParams.customerCode = "";
  queryParams.projectCode = "";
  queryParams.routeCode = "";
  queryParams.orderDateSort = "";
  queryParams.status = "";
  queryParams.pageNum = 1;
  queryParams.orderUuid = "";
  state.costTime = "";
  queryParams.costStartTime = "";
  queryParams.costEndTime = "";
  queryParams.tranType = "";
  handleQuery();
};
const importClick = () => {
  importFlg.value = true;
};
const resetMakeForm = () => {
  newMakeForm.amount = "";
};

const datePickerStartChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.orderDateSort = "asc";
  } else {
    queryParams.orderDateSort = "desc";
  }
  handleQuery();
};

const newCancelClick = () => {
  handleClose();
};

const validateNumber = (val: any) => {
  if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
    return true;
  } else {
    return false;
  }
};

const exportClick = () => {
  exportHighway(queryParams)
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
  getHighwayPage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      highwayStatInfo();
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

const highwayStatInfo = () => {
  getHighwayStat(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};

const newFormClick = () => {
  makeHighway(newMakeForm, state.selectId)
    .then((res) => {
      ElMessage.success("批量核销成功");
    })
    .catch(() => {
      ElMessage.error("批量核销失败");
    })
    .finally(() => {
      handleClose();
      handleQuery();
    });
};

const makeClick = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先勾选数据");
  } else {
    dialogMakeVisible.value = true;
    let ids = multipleSelection.value.map((item: any) => item.id);
    state.selectId = ids.join(",").toString();
    let mileages = multipleSelection.value.map((item: any) => item.downMileage);
    state.sumMileages = eval(mileages.join("+"));
  }
};

const projectList = () => {
  getInfoList({}).then((rs) => {
    Object.assign(projectNameOptions.value, rs.data);
  });
};

const handleClose = () => {
  resetMakeForm();
  dialogMakeVisible.value = false;
};
const datePickerCostChange = (val: any) => {
  queryParams.costStartTime = "";
  queryParams.costEndTime = "";
  if (val) {
    queryParams.costStartTime = val[0];
    queryParams.costEndTime = val[1];
  }
};

onMounted(() => {
  queryParams.orderDateSort = "desc";
  handleQuery();
  projectList();
  getVehicleList({});
  customerList();
  getLineList(null);
  highwayStatInfo();
  getOption("tran_type");
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

  :deep(.newDialogClass .el-dialog__header) {
    border-bottom: 1px solid lightgray;
    margin: 0 10px;
  }
  :deep(.newDialogClass .el-dialog__body) {
    padding: 10px var(--el-dialog-padding-primary);
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
