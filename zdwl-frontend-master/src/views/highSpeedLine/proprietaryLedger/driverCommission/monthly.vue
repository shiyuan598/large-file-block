<template>
  <div class="app-container">
    <div class="parkClass" v-if="!importFlg">
      <footer class="header__footer">
        <el-form
          :model="queryParams"
          class="demo-form-inline"
          ref="queryFormRef"
          style="margin-bottom: 0px"
        >
          <el-row class="row-bg" justify="space-between">
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
            <el-col :span="6">
              <el-form-item label="订单时间">
                <el-date-picker
                  v-model="queryParams.date"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  style="width: 100%"
                  placeholder="请选择订单时间"
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
            <el-col :span="6"></el-col>
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
          <el-button type="primary" @click="payClick">付款</el-button>
          <el-button type="primary" @click="payBackClick">核销</el-button>
          <el-button @click="dialogMounthVisible = true" type="primary"
            >结算月提成</el-button
          >
          <el-button @click="payExportClick">汇款导出</el-button>
          <el-button @click="exportClick">导出</el-button>
          <!-- <el-button @click="importClick">导入</el-button> -->
          <el-button @click="newlyAdded">新增</el-button>
        </div>
        <div
          class="indexClass"
          style="display: flex; align-items: center; height: 30px"
        >
          <span class="span-color">基本提成(元)：</span
          ><span class="text-span">{{ totalInfo.baseAmount }}</span>
          <span style="padding-left: 24px" class="span-color"
            >实际付款(元)：</span
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
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column fixed prop="driver" label="司机姓名" />
          <el-table-column prop="status" label="费用状态">
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
          <el-table-column prop="realAmount" label="实际付款" align="right" />
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
          <el-table-column prop="date" label="费用时间"></el-table-column>
          <el-table-column prop="orderNum" label="本月订单量" align="right" >
            <template #default="scope">
              <el-button :disabled="scope.row.orderNum==0" type="primary" @click="clickOrderNum(scope.row)" text="primary">
                {{ scope.row.orderNum }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="baseAmount" label="基本提成" align="right" />
          <el-table-column prop="expandFee" label="补扣款(元)" align="right">
            <template #default="scope">
              <el-button :disabled="!scope.row.expandFeeIds" type="primary" @click="clickButton(scope.row)" text="primary">
                {{ scope.row.expandFee }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="action" width="60" label="操作">
            <template #default="scope">
              <el-popconfirm
                title="确定要删除吗?"
                @confirm="handleDelete(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button key="text" type="text">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
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
    <el-dialog v-model="dialogMounthVisible" title="结算月提成" width="30%">
      <el-form :model="mounthForm" label-width="80px" :rules="newMounthRules">
        <el-form-item label="结算日期">
          <el-date-picker
            v-model="mounthForm.date"
            type="month"
            placeholder="选择月"
            format="YYYY-MM"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="dialogMounthVisible = false"
            :disabled="checkMounthVisible"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="upMonthClick({ date: mounthForm.date })"
            :disabled="checkMounthVisible"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 添加或修改对话框 -->
    <el-dialog
      v-model="state.newlyVisible"
      title="新增"
      width="50%"
      :before-close="handleClose"
      class="newDialogClass"
    >
      <el-form
        :model="newForm"
        :rules="newRules"
        label-position="right"
        label-width="115px"
        ref="newFormRef"
        class="newFormClass"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="司机姓名" prop="driverCode">
              <el-select
                clearable
                filterable
                v-model="newForm.driverCode"
                size="default"
                placeholder="请选择司机姓名"
                @change="changeDriver"
                style="align-items: center; width: 100%"
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
          <el-col :span="12">
            <el-form-item label="费用日期" prop="yearMonth">
              <el-date-picker
                v-model="newForm.yearMonth"
                placeholder="请选择费用日期"
                size="default"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="实际付款" prop="realAmount">
              <el-input
                v-model="newForm.realAmount"
                placeholder="请输入数值"
                style="width: 100%"
              >
                <template #append>
                  <span>元</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基本提成" prop="baseAmount">
              <el-input
                v-model="newForm.baseAmount"
                placeholder="请输入数值"
                style="width: 100%"
              >
                <template #append>
                  <span>元</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="本月订单量" prop="orderNum">
              <el-input
                v-model="newForm.orderNum"
                placeholder="请输入数值"
                style="width: 100%"
              >
                <template #append>
                  <span>元</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="补扣款" prop="expandFee">
              <el-input
                v-model="newForm.expandFee"
                placeholder="请输入数值"
                style="width: 100%"
              >
                <template #append>
                  <span>元</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20"> </el-row>
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
    <el-dialog
      v-model="dialogDeleteVisible"
      class="deleteDialogClass"
      width="90%"
      title="司机补扣款明细"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <Detailed :expenseIds="state.expenseIds"></Detailed>
    </el-dialog>
    <el-dialog
      v-model="orderNumVisible"
      class="deleteDialogClass"
      width="90%"
      title="订单信息"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <OrderNum :driverCode="state.driverCode" :relationIds="state.relationIds"></OrderNum>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { Calendar, Search } from "@element-plus/icons-vue";
import { driverMonthQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  getDriverMonthPage,
  exportDriverMonth,
  payExport,
  getDriverMonthStat,
  getDriverUpMonth,
  postCostDriver,
} from "@/api/highSpeedLine/platformLedger/index";
import Detailed from "./detailed.vue"
import OrderNum from "./orderNum.vue"
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close, InfoFilled } from "@element-plus/icons-vue";
import { getRepair, getPark } from "@/api/supplier/index";
import { driverList, driverParamsList, monthAdd } from "@/api/depreciation";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import importSlot from "@/views/Import/index.vue";
import { deleteTractor } from "@/api/vehicleInfo";
import { exportFile } from "@/utils";
const multipleSelection = ref([]);
const total = ref(0);
const dialogNewVisible = ref(false);
const dialogHandleVisible = ref(false);
const dialogDeleteVisible = ref(false);
const customerNameOptions = ref([] as any[]);
const driverOptions = ref([] as any[]);
const queryFormRef = ref(ElForm);
const checkMounthVisible = ref(false);
const queryParams = reactive<driverMonthQuery>({
  pageNum: 1,
  pageSize: 10,
});
const importFlg = ref(false);
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
  newlyVisible: false,
  expenseIds: '',
  relationIds: '',
  driverCode: ''
});
const dialogMounthVisible = ref(false);
const newFormRef = ref();
const getDisabled = computed(
  () =>
    newForm.driverCode === "" ||
    newForm.yearMonth === "" ||
    newForm.expandFee === ""
);
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
    id: 3,
    name: "已核销",
  },
];
const totalInfo = ref({
  amount: 0,
  plateAmount: 0,
  baseAmount: 0,
});
interface RuleForm {
  id: number;
  fuelPrice: string;
  ureaPrice: string;
}
interface MonthForm {
  date: string;
}
const mounthForm = reactive<MonthForm>({
  date: "",
});
const newForm = reactive({
  id: null,
  yearMonth: "",
  realAmount: "",
  driverCode: "",
  driver: "",
  orderNum: "",
  baseAmount: "",
  expandFee: "",
});
const newMounthRules = reactive<FormRules<MonthForm>>({
  date: [{ required: true, message: "请输入月份", trigger: "blur" }],
});
const newRules = reactive({
  driverCode: [{ required: true, message: "请选择司机姓名", trigger: "blur" }],
  yearMonth: [{ required: true, message: "请选择费用日期", trigger: "blur" }],
  expandFee: [{ required: true, message: "请输入补扣款", trigger: "blur" }],
});

const loading = ref(false);
const resetForm = () => {
  newForm.id = null;
  newForm.yearMonth = "";
  newForm.realAmount = "";
  newForm.driverCode = "";
  newForm.driver = "";
  newForm.orderNum = "";
  newForm.baseAmount = "";
  newForm.expandFee = "";
};
const returnList = () => {
  importFlg.value = !importFlg.value;
  handleQuery();
};
const importClick = () => {
  importFlg.value = true;
};

const payClick = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先勾选数据");
  } else {
    let bl = true;
    multipleSelection.value.forEach((item) => {
      if (item.status != "0") {
        return (bl = false);
      }
    });
    if (!bl) {
      ElMessage.warning("请勾选未付款的数据");
    } else {
      let ids = multipleSelection.value
        .map((item: any) => item.id)
        .join(",")
        .toString();
      postCostDriver({ ids: ids, status: "1" }).then((rs) => {
        ElMessage.success("付款成功");
        handleQuery();
      });
    }
  }
};

const payBackClick = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先勾选数据");
  } else {
    let bl = true;
    multipleSelection.value.forEach((item) => {
      if (item.status != "1") {
        return (bl = false);
      }
    });
    if (!bl) {
      ElMessage.warning("请勾选未核销的数据");
    } else {
      let ids = multipleSelection.value
        .map((item: any) => item.id)
        .join(",")
        .toString();
      postCostDriver({ ids: ids, status: "2" }).then((rs) => {
        ElMessage.success("核销成功");
        handleQuery();
      });
    }
  }
};

const datePickerStartChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const handleClose = () => {
  state.newlyVisible = false;
  resetForm();
};

const handleFormClose = () => {
  dialogHandleVisible.value = false;
  resetForm();
};

const clickButton = (value:any)=>{
  dialogDeleteVisible.value = true;
  state.expenseIds = value.expandFeeIds;
}
const orderNumVisible = ref(false);
const clickOrderNum = (value:any)=>{
  orderNumVisible.value = true;
  state.relationIds = value.orderIds;
  state.driverCode = value.driverCode;
};
const handleDeleteClose = () => {
  dialogDeleteVisible.value = false;
};

const onReset = () => {
  queryParams.driverCode = "";
  queryParams.date = "";
  queryParams.status = "";
  handleQuery();
};
const newlyAdded = () => {
  state.newlyVisible = true;
};

const newCancelClick = () => {
  state.newlyVisible = false;
};
const remoteDriverMethod = (query: string) => {
  driverParamsList({ keywords: query }).then((rs) => {
    driverOptions.value = [];
    Object.assign(driverOptions.value, rs.data);
  });
};

const exportClick = () => {
  exportFile(queryParams, "/api/v1/dispatch/cost/driver/month/_export");
};
const payExportClick = () => {
  exportFile(queryParams, "/api/v1/dispatch/cost/driver/month/_payExport");
};
const exportFunction = (response: any) => {
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
};
const upMonthClick = (val: any) => {
  checkMounthVisible.value = true;
  getDriverUpMonth(val)
    .then((rs) => {
      ElMessage.success("结算月提成成功");
      checkMounthVisible.value = false;
      dialogMounthVisible.value = false;
    })
    .finally(() => {
      handleQuery();
      checkMounthVisible.value = false;
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
  getDriverMonthPage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getDriverMonthStatInfo();
    })
    .finally(() => {
      loading.value = false;
    });
};

const getDriverList = () => {
  driverList().then((rs) => {
    driverOptions.value = [];
    Object.assign(driverOptions.value, rs.data);
  });
};

const getDriverMonthStatInfo = () => {
  getDriverMonthStat(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};
// 新增确认
const newFormClick = async () => {
  try {
    const { data } = await monthAdd(newForm);
    state.newlyVisible = false;
    ElMessage("新增成功");
    handleQuery();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const changeDriver = (val: number) => {
  newForm.driver = driverOptions.value.find((p) => p.id === val).name;
};
// 删除确认
const handleDelete = async (index: number, val: string) => {
  try {
    await deleteTractor(val.id, "/api/v1/dispatch/cost/driver/month/");
    ElMessage("删除成功");
    handleQuery();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
onMounted(() => {
  handleQuery();
  getDriverList();
  getDriverMonthStatInfo();
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
  .processed {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: red;
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
  .blueS {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: blue !important;
    }
  }
}
</style>
