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
            >司机垫付</el-breadcrumb-item
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
                  </el-row>
                  <el-row class="row-bg" justify="space-between">
                    <el-col :span="6">
                      <el-form-item label="地点名称">
                        <el-input
                          v-model="queryParams.location"
                          placeholder="请输入地点名称"
                          clearable
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
                    <el-col :span="6">
                      <el-form-item label="垫付类型">
                        <el-select
                          v-model="queryParams.type"
                          filterable
                          placeholder="请选择垫付类型"
                          style="width: 100%"
                          clearable
                        >
                          <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label"
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
                      <el-form-item label="司机姓名">
                        <el-select
                          v-model="queryParams.driverCode"
                          placeholder="请选择司机姓名"
                          style="align-items: center; width: 100%"
                          clearable
                          filterable
                          remote
                          reserve-keyword
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
                  <!-- <el-button type="primary" @click="expenseClick">审批</el-button> -->
                  <el-button @click="exportClick">导出</el-button>
                  <el-button @click="importClick">导入</el-button>
                  <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
                    <template #reference>
                      <!-- <el-button key="text" type="text">删除</el-button> -->
                      <el-button size="default">删除</el-button>
                    </template>
                  </el-popconfirm>
                </div>
                <div
                  class="indexClass"
                  style="display: flex; align-items: center; height: 30px"
                >
                  <span class="span-color">司机垫付费用(元)：</span
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
                  <el-table-column prop="status" label="状态">
                    <template #default="scope">
                      <div v-if="scope.row.status == '0'" style="display: flex">
                        <el-badge is-dot class="untreated"></el-badge>未通过
                      </div>
                      <div v-if="scope.row.status == '1'" style="display: flex">
                        <el-badge is-dot class="greenS"></el-badge>已通过
                      </div>
                      <div v-if="scope.row.status == '2'" style="display: flex">
                        <el-badge is-dot class="processed"></el-badge>已驳回
                      </div>
                      <div v-if="scope.row.status == '3'" style="display: flex">
                        <el-badge is-dot class="warning"></el-badge>已付款
                      </div>
                      <div v-if="scope.row.status == '4'" style="display: flex">
                        <el-badge is-dot class="untreated"></el-badge>已核销
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="orderDate"
                    label="订单日期"
                    width="110"
                    sortable
                  >
                    <template #default="scope">
                      {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="upTractor" label="车牌号码" />
                  <el-table-column prop="upDriver" label="司机名称" />
                  <el-table-column
                    prop="amount"
                    label="垫付费用（元）"
                    align="right"
                    width="130"
                  >
                    <template #default="scope">
                      <el-button
                      :disabled="!scope.row.relationIds"
                        type="primary"
                        @click="clickButton(scope.row)"
                        text
                      >
                        {{ scope.row.amount }}
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="费用类型" />
                  <el-table-column prop="date" label="费用日期">
                    <template #default="scope">
                      {{ dayjs(scope.row.date).format("YYYY-MM-DD") }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="location" label="地点" />
                  <el-table-column prop="fileName" label="费用附件">
                    <template #default="scope">
                      <div v-if="scope.row.fileName != '-'">
                        <button @click="showImg(scope.row.file)">附件</button>
                      </div>
                      <div v-else>{{ scope.row.fileName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="route" label="路线名称" width="300">
                    <template #default="scope">
                      <span v-if="scope.row.route != ''"
                        >{{ scope.row.route }}({{ scope.row.project }})</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" />
                  <!-- <el-table-column prop="action" label="操作">
                    <template #default="scope">
                      <el-button
                        key="text"
                        type="text"
                        @click="handleClick(scope.$index, scope.row)"
                        :disabled="scope.row.handleStatus != '0'"
                        >审批</el-button
                      >
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
      v-model="dialogVisible"
      :title="'审批'"
      width="40%"
      :before-close="handleClose"
      class="newDialogClass"
    >
      <el-form
        :model="newForm"
        :rules="newRules"
        label-position="right"
        label-width="80px"
        ref="newFormRef"
        class="newFormClass"
      >
        <el-form-item label="审批意见" prop="status">
          <el-radio-group v-model="newForm.status" class="ml-4">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="checkContent">
          <el-input
            v-model="newForm.checkContent"
            placeholder="请输入备注信息"
            autosize
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newCancelClick">取 消</el-button>
          <el-button type="primary" @click="newFormClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="state.orderVisible"
      class="deleteDialogClass"
      width="90%"
      title="自营订单列表"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <Order :relationIds="relationIds"></Order>
    </el-dialog>
    <el-dialog
      v-model="state.accidentVisible"
      class="deleteDialogClass"
      width="90%"
      title="事故列表"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <Accident :relationIds="relationIds"></Accident>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { expenseQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  getExpensePage,
  exportExpense,
  getExpenseStat,
  expenseCheck,
  getWeighingFeeTemplate,
  importWeighingFee,
} from "@/api/highSpeedLine/platformLedger/index";
import { deleteTractor } from "@/api/vehicleInfo";
import { tractorListQuery, driverList } from "@/api/depreciation/index";
import { getLineinfoList } from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { getDictOptions } from "@/api/dict/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import importSlot from "@/views/Import/index.vue";
import dayjs from "dayjs";
import router from "@/router";
import { preview, vPreview, Vue3ImagePreview } from "vue3-image-preview";
import Order from "./order.vue"
import Accident from "./accident.vue"
const multipleSelection = ref([]);
const total = ref(0);
const customerNameOptions = ref([] as any[]);
const queryFormRef = ref(ElForm);
const queryParams = reactive<expenseQuery>({
  pageNum: 1,
  pageSize: 10,
});
const dialogVisible = ref(false);
const importFlg = ref(false);
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
  title: "",
  apiFn: importWeighingFee,
  downFn: getWeighingFeeTemplate,
  downloadType: "智能调度 - 自营业务台账 - 司机垫付",
  orderVisible: false,
  accidentVisible: false,
});
const cardOptions = ref([] as any[]);
const projectNameOptions = ref([] as any[]);
const routeOptions = ref([] as any[]);
const typeOptions = ref([] as any[]);
const driverOptions = ref([] as any[]);
const loading = ref(false);
const statusOptions = [
  {
    id: 0,
    name: "未通过",
  },
  {
    id: 1,
    name: "已通过",
  },
  {
    id: 3,
    name: "已付款",
  },
];
const totalInfo = ref({
  amount: 0,
});
const onReset = () => {
  state.time = "";
  state.costTime = "";
  queryParams.startTime = "";
  queryParams.endTime = "";
  queryParams.costStartTime = "";
  queryParams.costEndTime = "";
  queryParams.tractorCode = "";
  queryParams.customerCode = "";
  queryParams.projectCode = "";
  queryParams.routeCode = "";
  queryParams.driverCode = "";
  queryParams.location = "";
  queryParams.type = "";
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

const selectable = (row: any, index: any) => {
  return Number(row.status) < 3;
};

const showImg = (val: any) => {
  preview({
    images: val,
  });
};

interface RuleForm {
  ids: string;
  status: string;
  checkContent: string;
}
const newForm = reactive<RuleForm>({
  ids: "",
  status: "1",
  checkContent: "",
});
const newRules = reactive<FormRules<RuleForm>>({
  status: [{ required: true, message: "请选择审批意见", trigger: "blur" }],
});

const newCancelClick = () => {
  handleClose();
};

const newFormClick = () => {
  // let obj = {
  //   ids: newForm.ids.toString(),
  //   status: parseInt(newForm.status),
  //   checkContent: newForm.checkContent
  // }
  expenseCheck(newForm)
    .then((rs) => {
      ElMessage.success("审批通过");
      handleClose();
      handleQuery();
    })
    .catch(() => {
      ElMessage.error("审批发送失败");
    });
};

const handleClose = () => {
  resetForm();
  dialogVisible.value = false;
};

const resetForm = () => {
  newForm.ids = "";
  newForm.status = "1";
  newForm.checkContent = "";
};

const handleClick = (val: any, val1: any) => {
  resetForm();
  newForm.ids = val1.id;
  dialogVisible.value = true;
};

const datePickerStartChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const datePickerCostStartChange = (val: any) => {
  queryParams.costStartTime = "";
  queryParams.costEndTime = "";
  if (val) {
    queryParams.costStartTime = val[0];
    queryParams.costEndTime = val[1];
  }
};

const exportClick = () => {
  exportExpense(queryParams)
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
const relationIds = ref([]);
const clickButton = (value:any)=>{

  relationIds.value = value.relationIds;
  value.relationType == 1?  state.orderVisible = true : state.accidentVisible = true;
 ;
}
const handleQuery = () => {
  loading.value = true;
  getExpensePage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getExpenseStatInfo();
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
const batchVehicle = () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  handleDelete(arr);
};
// 批量删除与单个删除
const handleDelete = async (ids: any) => {
  await deleteTractor(ids, "/api/v1/dispatchFee/cost/expense/");
  handleQuery();
};
const remoteMethod = (query: string) => {
  getVehicleList({ keywords: query });
};

const remoteRouteMethod = (query: string) => {
  getLineList({ keywords: query });
};

const returnList = () => {
  importFlg.value = !importFlg.value;
  handleQuery();
};

const getLineList = (data: { keywords: string } | null) => {
  getLineinfoList(data).then((rs) => {
    routeOptions.value = [];
    Object.assign(routeOptions.value, rs.data);
  });
};

const getExpenseStatInfo = () => {
  getExpenseStat(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};

const getTypeOptions = () => {
  getDictOptions("expense_type").then((rs) => {
    Object.assign(typeOptions.value, rs.data);
  });
};

const projectList = () => {
  getInfoList({}).then((rs) => {
    Object.assign(projectNameOptions.value, rs.data);
  });
};

const expenseClick = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先勾选数据");
  } else {
    resetForm();
    let ids = multipleSelection.value
      .map((item: any) => item.id)
      .join(",")
      .toString();
    newForm.ids = ids;
    dialogVisible.value = true;
  }
};

const importClick = () => {
  importFlg.value = true;
};
const getDriverList = () => {
  driverList().then((rs) => {
    driverOptions.value = [];
    Object.assign(driverOptions.value, rs.data);
  });
};
onMounted(() => {
  queryParams.orderDateSort = "desc";
  handleQuery();
  getTypeOptions();
  getVehicleList({});
  projectList();
  customerList();
  getLineList(null);
  getDriverList();
  getExpenseStatInfo();
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

  .greenS {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: #6eeb4f !important;
    }
  }
  .blues {
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
