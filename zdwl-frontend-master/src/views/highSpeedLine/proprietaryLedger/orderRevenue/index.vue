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
            v-if="!importFlg"
            >订单收入</el-breadcrumb-item
          >
          <el-breadcrumb-item
            :to="{ path: '/highSpeedLine/proprietaryLedger/orderRevenue' }"
            @click="returnList"
            v-if="importFlg"
            >固定停车</el-breadcrumb-item
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
                  <el-button type="primary" @click="handleWrite"
                    >开票</el-button
                  >
                  <!-- <el-button type="primary" @click="handlePayment"
                    >回款</el-button
                  > -->
                  <el-button @click="exportClick">导出</el-button>
                  <el-button @click="importClick">批量开票</el-button>
                </div>
                <div
                  class="indexClass"
                  style="display: flex; align-items: center; height: 30px"
                >
                  <span class="span-color">标准运费(元)：</span
                  ><span class="text-span">{{ totalInfo.upAmount }}</span>
                  <span style="padding-left: 24px" class="span-color"
                    >开票收入(元)：</span
                  ><span class="text-span">{{ totalInfo.amount }}</span>
                </div>
              </el-row>
              <div class="selectDiv" v-show="multipleSelection.length !== 0">
                已选择
                <span class="selectText"> {{ multipleSelection.length }} </span>
                项，标准运费总金额
                <span class="selectText">{{ state.number }}</span>
                元，开票收入总金额
                <span class="selectText">{{ state.settlement }}</span> 元
                <span
                  @click="cancellationAll"
                  class="selectText float-right cursor-pointer"
                  >取消选择</span
                >
              </div>
              <div style="padding: 10px 20px; width: 100%">
                <el-table
                  ref="multipleTableRef"
                  :data="state.tableData"
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
                  <el-table-column prop="status" label="费用状态" width="120">
                    <template #default="scope">
                      <div v-if="scope.row.status == '0'" style="display: flex">
                        <el-badge is-dot class="warning"></el-badge>未开票
                      </div>
                      <div v-if="scope.row.status == '1'" style="display: flex">
                        <el-badge is-dot class="untreated"></el-badge>已开票
                      </div>
                      <div v-if="scope.row.status == '2'" style="display: flex">
                        <el-badge is-dot class="untreated"></el-badge>已回款
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="accidentTime"
                    label="订单日期"
                    width="120"
                    sortable
                  >
                    <template #default="scope">
                      {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
                    </template>
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
                  <el-table-column label="运费(元)" align="center">
                    <el-table-column
                      prop="upAmount"
                      label="标准"
                      align="right"
                    />
                    <el-table-column prop="amount" label="开票" align="right" />
                  </el-table-column>
                  <el-table-column
                    prop="customer"
                    label="客户名称"
                    width="120"
                  />
                  <el-table-column prop="route" label="路线名称" width="300">
                    <template #default="scope">
                      <span v-if="scope.row.route != ''"
                        >{{ scope.row.route }}({{ scope.row.project }})</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="tractor"
                    label="车牌号码"
                    width="100"
                  />
                  <el-table-column
                    prop="expandMileage"
                    label="额外里程(KM)"
                    align="right"
                    width="120"
                  />
                  <el-table-column
                    prop="expandFee"
                    label="额外运费(元)"
                    align="right"
                    width="120"
                  />
                  <el-table-column
                    prop="fineFee"
                    label="额外扣费(元)"
                    align="right"
                    width="120"
                  />
                  <el-table-column
                    prop="emptyMileage"
                    label="放空里程(KM)"
                    align="right"
                    width="120"
                  />
                  <el-table-column
                    prop="multipleMileage"
                    label="多装多卸里程(KM)"
                    align="right"
                    width="150"
                  />
                  <el-table-column
                    prop="takeMileage"
                    label="提送货里程(KM)"
                    align="right"
                    width="140"
                  />
                  <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    align="center"
                    width="160"
                  />
                  <el-table-column prop="action" label="操作" fixed="right">
                    <template #default="scope">
                      <el-button
                        key="text"
                        type="text"
                        @click="handleClick(scope.$index, scope.row)"
                        >开票</el-button
                      >
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
      :title="'批量开票'"
      width="30%"
      :before-close="handleClose"
      class="newDialogClass"
    >
      <div
        class="indexClass"
        style="
          display: flex;
          align-items: center;
          height: 30px;
          padding-left: 10px;
        "
      >
        <span class="span-color">累计开票金额(元)：</span
        ><span class="text-span">{{ writeAmount }}</span>
        <span style="padding-left: 24px" class="span-color"
          >累计订单数量(条)：</span
        ><span class="text-span">{{ writeOrderNum }}</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogPayVisible"
      :title="'批量回款'"
      width="30%"
      :before-close="handlePayClose"
      class="newDialogClass"
    >
      <div
        class="indexClass"
        style="
          display: flex;
          align-items: center;
          height: 30px;
          padding-left: 10px;
        "
      >
        <span class="span-color">累计回款金额(元)：</span
        ><span class="text-span">{{ payAmount }}</span>
        <span style="padding-left: 24px" class="span-color"
          >累计订单数量(条)：</span
        ><span class="text-span">{{ payNum }}</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogPayVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmPayClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogNewVisible"
      :title="'开票'"
      width="50%"
      :before-close="handleNewClose"
      class="newDialogClass"
    >
      <el-form
        :model="newForm"
        :rules="newRules"
        label-position="right"
        label-width="120px"
        ref="newFormRef"
        class="newFormClass"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="放空里程" prop="emptyMileage">
              <el-input
                v-model="newForm.emptyMileage"
                placeholder="请输入放空里程"
                style="width: 100%"
                @blur="mileageChange"
              >
                <template #append>KM</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="多装多卸里程" prop="multipleMileage">
              <el-input
                v-model="newForm.multipleMileage"
                placeholder="请输入多装多卸里程"
                style="width: 100%"
                @blur="mileageChange"
              >
                <template #append>KM</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="提送货里程" prop="takeMileage">
              <el-input
                v-model="newForm.takeMileage"
                placeholder="请输入提送货里程"
                style="width: 100%"
                @blur="mileageChange"
              >
                <template #append>KM</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="额外里程" prop="expandMileage">
              <el-input
                v-model="newForm.expandMileage"
                placeholder="请输入额外里程"
                style="width: 100%"
                disabled
              >
                <template #append>KM</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="额外扣费" prop="fineFee">
              <el-input
                v-model="newForm.fineFee"
                placeholder="请输入额外扣费"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="额外运费" prop="expandFee">
              <el-input
                v-model="newForm.expandFee"
                placeholder="请输入额外运费"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标准运费">
              <el-input
                v-model="state.upAmount"
                placeholder="请输入标准运费"
                style="width: 100%"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票收入" prop="amount">
              <el-input
                v-model="newForm.amount"
                placeholder="请输入开票收入"
                style="width: 100%"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogNewVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmNewClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { incomeQuery } from "@/api/highSpeedLine/platformLedger/types";
import {
  getIncomePage,
  exportIncome,
  getIncomeStat,
  writeOrder,
  writeOrderOne,
  payBack,
  getIncomeTemplate,
  importIncome,
} from "@/api/highSpeedLine/platformLedger/index";
import { tractorListQuery } from "@/api/depreciation/index";
import { Options } from "@/api/depreciation/types";
import { getOptions } from "@/api/vehicleInfo";
import { getLineinfoList } from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import importSlot from "@/views/Import/index.vue";
import dayjs from "dayjs";
import { calculate } from "@/utils";
import {
  exportParking,
  getParkingTemplate,
  importParking,
} from "@/api/operations/parking";
const importFlg = ref(false);
const returnList = () => {
  importFlg.value = !importFlg.value;
};
const multipleSelection = ref([]);
const total = ref(0);
const customerNameOptions = ref([] as any[]);
const dialogVisible = ref(false);
const dialogPayVisible = ref(false);
const dialogNewVisible = ref(false);
const queryFormRef = ref(ElForm);
const queryParams = reactive<incomeQuery>({
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
  upAmount: 0,
  apiFn: importIncome,
  downFn: getIncomeTemplate,
  title: "智能调度 - 自营业务台账 - 订单收入",
  number: 0,
  settlement: 0
});
const totalInfo = ref({
  amount: 0,
  upAmount: 0,
});
const statusOptions = [
  {
    id: 0,
    name: "未开票",
  },
  {
    id: 1,
    name: "已开票",
  },
];
const cardOptions = ref([] as any[]);
const projectNameOptions = ref([] as any[]);
const routeOptions = ref([] as any[]);
const loading = ref(false);
const writeAmount = ref(0);
const writeOrderNum = ref(0);
const payAmount = ref(0);
const payNum = ref(0);
const selectable = (row: any, index: any) => {
  return row.status == 0;
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
  queryParams.tranType = "";
  handleQuery();
};

interface RuleForm {
  id: number;
  amount: number;
  emptyMileage: number;
  multipleMileage: number;
  takeMileage: number;
  expandMileage: number;
  expandFee: number;
  fineFee: number;
  remark: string;
}
const newForm = reactive<RuleForm>({
  id: 0,
  amount: 0,
  emptyMileage: 0,
  multipleMileage: 0,
  takeMileage: 0,
  expandMileage: 0,
  expandFee: 0,
  fineFee: 0,
  remark: "",
});

const resetNewForm = () => {
  (newForm.id = 0), (newForm.amount = 0);
  newForm.emptyMileage = 0;
  newForm.multipleMileage = 0;
  newForm.takeMileage = 0;
  newForm.expandMileage = 0;
  newForm.expandFee = 0;
  newForm.fineFee = 0;
  newForm.remark = "";
};
const newRules = reactive<FormRules<RuleForm>>({
  amount: [{ required: true, message: "请输入实际收入", trigger: "blur" }],
  emptyMileage: [
    { required: true, message: "请输入放空里程", trigger: "blur" },
  ],
  multipleMileage: [
    { required: true, message: "请输入多装多卸里程", trigger: "blur" },
  ],
  takeMileage: [
    { required: true, message: "请输入提送货里程", trigger: "blur" },
  ],
  expandMileage: [
    { required: true, message: "请输入额外里程", trigger: "blur" },
  ],
  expandFee: [{ required: true, message: "请输入额外运费", trigger: "blur" }],
  fineFee: [{ required: true, message: "请输入额外扣款", trigger: "blur" }],
});

const importClick = () => {
  importFlg.value = true;
};

const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.orderDateSort = "asc";
  } else {
    queryParams.orderDateSort = "desc";
  }
  handleQuery();
};

const mileageChange = () => {
  newForm.expandMileage =
    Number(newForm.emptyMileage) +
    Number(newForm.multipleMileage) +
    Number(newForm.takeMileage);
};

const handleClose = () => {
  dialogVisible.value = false;
};

const handlePayClose = () => {
  dialogPayVisible.value = false;
};

const datePickerStartChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const handleWrite = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先勾选数据");
  } else {
    let bl = true;
    multipleSelection.value.forEach((item) => {
      if (item.status == "1") {
        return (bl = false);
      }
    });
    if (!bl) {
      ElMessage.warning("请勾选未开票的数据");
    } else {
      writeOrderNum.value = multipleSelection.value.length;
      let amountArr = multipleSelection.value.map((item: any) => item.upAmount);
      writeAmount.value = eval(amountArr.join("+"));
      dialogVisible.value = true;
    }
  }
};

const handlePayment = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先勾选数据");
  } else {
    let bl = true;
    multipleSelection.value.forEach((item) => {
      if (item.status == "0") {
        return (bl = false);
      }
    });
    if (!bl) {
      ElMessage.warning("请勾选已开票的数据");
    } else {
      payNum.value = multipleSelection.value.length;
      let payArr = multipleSelection.value.map((item: any) => item.amount);
      payAmount.value = eval(payArr.join("+"));
      dialogPayVisible.value = true;
    }
  }
};

const handleClick = (val: any, val1: any) => {
  newForm.id = val1.id;
  state.upAmount = val1.upAmount;
  dialogNewVisible.value = true;
};

const confirmNewClick = () => {
  writeOrderOne(newForm).then((rs) => {
    ElMessage.success("开票成功");
    handleNewClose();
    resetNewForm();
    handleQuery();
  });
};

const confirmClick = () => {
  let ids = multipleSelection.value
    .map((item: any) => item.id)
    .join(",")
    .toString();
  writeOrder(ids)
    .then(() => {
      handleClose();
      ElMessage.success("开票成功");
      handleQuery();
    })
    .catch(() => {
      ElMessage.error("开票失败");
    });
};

const confirmPayClick = () => {
  let ids = multipleSelection.value
    .map((item: any) => item.id)
    .join(",")
    .toString();
  payBack(ids)
    .then(() => {
      handlePayClose();
      ElMessage.success("回款成功");
      handleQuery();
    })
    .catch(() => {
      ElMessage.error("回款失败");
    });
};

const handleNewClose = () => {
  dialogNewVisible.value = false;
};

const exportClick = () => {
  exportIncome(queryParams)
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
  let number1 : number | null = 0;
  let number2 : number | null= 0;
  multipleSelection.value = val;
  multipleSelection.value.map((n:any)=>{
    number1 = calculate(number1,n.upAmount,"+");
    number2 = calculate(number2,n.amount,"+");
  })
  state.number = number1;
  state.settlement = number2;
};
const multipleTableRef = ref();
const cancellationAll = () => {
  multipleTableRef.value?.clearSelection();
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
  getIncomePage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getIncomeStatInfo();
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

const getIncomeStatInfo = () => {
  getIncomeStat(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};

const projectList = () => {
  getInfoList({}).then((rs) => {
    Object.assign(projectNameOptions.value, rs.data);
  });
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
onMounted(() => {
  importFlg.value = false;
  queryParams.orderDateSort = "desc";
  handleQuery();
  projectList();
  getVehicleList({});
  customerList();
  getLineList(null);
  getIncomeStatInfo();
  getOption("tran_type");
});

onUnmounted(() => {
  importFlg.value = false;
});
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
.selectText {
  color: #3270ff;
}
.selectDiv {
  width: 100%;
  height: 54px;
  line-height: 54px;
  color: #606060;
  font-size: 14px;
  background: #fafafa;
  border-radius: 2px 2px 0px 0px;
  border: 1px solid #e4e4e4;
  padding: 0 16px;
  margin-top: 2px;
}
</style>
