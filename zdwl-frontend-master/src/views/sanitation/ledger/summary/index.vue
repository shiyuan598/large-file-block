<template>
  <div class="map-content">
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
          line-height: 30px;
        "
        >当前位置：</span
      >
      <el-breadcrumb separator="-" style="display: flex; align-items: center">
        <el-breadcrumb-item :to="{ path: '/sanitation/line' }"
          ><span style="color: #8c8c8c">无人环卫</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span
            @click="returnList"
            :class="
              state.import || !state.built
                ? 'breadcrumb-color'
                : 'breadcrumb-color-is'
            "
            >环卫业务台账</span
          ></el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="state.import"
          ><span style="color: #303030">导入</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi" v-if="!state.import">
      <Form
        class="hide-form"
        :formModel="queryParames"
        :fromList="list"
        @searchInput="searchInput"
        @onSubmit="onSubmit"
      >
      </Form>
      <el-row>
        <el-button @click="newBuilt" type="primary" size="default"
          >新建</el-button
        >
        <el-button @click="batchTotal('批量结算')" size="default"
          >批量结算</el-button
        >
        <el-button @click="batchTotal('批量核销')" size="default"
          >批量核销</el-button
        >
        <el-button @click="importVehicle" size="default">导入</el-button>
        <el-button @click="exportVehicle" size="default">导出</el-button>
        <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
          <template #reference>
            <!-- <el-button key="text" type="text">删除</el-button> -->
            <el-button size="default">删除</el-button>
          </template>
        </el-popconfirm>
      </el-row>
      <el-table
        :data="tableData"
        v-loading="state.loading"
        :max-height="setHeight"
        size="default"
        style="width: 100%; margin-top: 16px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :selectable="callback" type="selection" width="55" />
        <el-table-column width="152" prop="uuid" fixed label="编号" />
        <el-table-column width="156" prop="" label="状态">
          <template #default="scope">
            <span
              class="round"
              :class="'roundColor' + scope.row.makeStatus"
            ></span>
            {{ scope.row.makeStatus === 0 ? "未结算" : "已结算" }}
            <span
              class="round ml-10px"
              :class="'roundColor' + scope.row.writeStatus"
            ></span>
            {{ scope.row.writeStatus === 0 ? "未核销" : "已核销" }}
          </template>
        </el-table-column>
        <el-table-column width="110" prop="orderDate" label="台账日期" />
        <el-table-column
          width=""
          align="right"
          prop="leaseCost"
          label="车辆租金"
        />
        <el-table-column
          width=""
          align="right"
          prop="repairCost"
          label="维保费用"
        />
        <el-table-column
          width="100"
          align="right"
          prop="driverCost"
          label="驾驶服务费"
        />
        <el-table-column
          width=""
          align="right"
          prop="electricCost"
          label="月度费用"
        />
        <el-table-column
          width=""
          align="right"
          prop="fuelCost"
          label="月度油费"
        />
        <el-table-column
          width=""
          align="right"
          prop="waterCost"
          label="月度水费"
        />
        <el-table-column
          width=""
          align="right"
          prop="equipmentUseCost"
          label="耗材费用"
        />
        <el-table-column
          width=""
          align="right"
          prop="otherCost"
          label="其他费用"
        />
        <el-table-column
          width="100"
          align="right"
          prop="personCost"
          label="直接人工费"
        />
        <el-table-column align="right" width="" prop="totalCost">
          <template #header="header">
            <span>小计</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="小计=车辆租金+维保费+驾驶服务费
+月度电费+月度油费+月度水费+耗材
+其他+直接人工"
              placement="top"
            >
              <span class="scope-icon m-2px">
                <el-icon><Warning /></el-icon
              ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="right" width="110" prop="omnibusFee">
          <template #header="header">
            <span>综合费用</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="综合费用=小计*12%"
              placement="top"
            >
              <span class="scope-icon m-2px">
                <el-icon><Warning /></el-icon
              ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="right" width="130" prop="finalCost">
          <template #header="header">
            <span>成本费用总额</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="成本费用总额=小计+综合费用"
              placement="top"
            >
              <span class="scope-icon m-2px">
                <el-icon><Warning /></el-icon
              ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="right" width="110" prop="finalCostAdd">
          <template #header="header">
            <span>成本加成</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="成本加成=成本费用总额*3%"
              placement="top"
            >
              <span class="scope-icon m-2px">
                <el-icon><Warning /></el-icon
              ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="right" width="110" prop="finalCostTotal">
          <template #header="header">
            <span>结算收入</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="结算收入=成本费用总额+成本加成"
              placement="top"
            >
              <span class="scope-icon m-2px">
                <el-icon><Warning /></el-icon
              ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="right" width="90" prop="tax" label="税率(%)" />
        <el-table-column align="right" width="110" prop="finalAmount">
          <template #header="header">
            <span>结算金额</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="结算金额=结算收入*（1+税率）"
              placement="top"
            >
              <span class="scope-icon m-2px">
                <el-icon><Warning /></el-icon
              ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="action" fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button
              key="text"
              type="text"
              :disabled="scope.row.makeStatus === 1"
              @click.stop="paymentClick(scope.$index, scope.row, '结算')"
              >结算</el-button
            >
            <el-button
              key="text"
              :disabled="scope.row.writeStatus === 1"
              type="text"
              @click.stop="paymentClick(scope.$index, scope.row, '核销')"
              >核销</el-button
            >
            <el-button
              key="text"
              type="text"
              @click.stop="editClick(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除吗?"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button @click.stop key="text" type="text">删除</el-button>
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
          :total="state.total"
        />
      </el-row>
    </div>
    <el-dialog
      width="784"
      v-model="state.dialogVisible"
      :close-on-click-modal="false"
      @close="cancelClick"
      class="newDialogClass"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">{{ state.title }}台账</div>
      </template>
      <el-form
        :model="newForm"
        :rules="newRules"
        label-position="left"
        label-width="100px"
        ref="newFormRef"
        class="newFormClass"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="台账日期" prop="orderDate">
              <el-date-picker
                style="width: 100%"
                v-model="newForm.orderDate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆租金" prop="leaseCost">
              <el-input
                v-model="newForm.leaseCost"
                type="number"
                placeholder="请输入车辆租金"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保费用" prop="repairCost">
              <el-input
                v-model="newForm.repairCost"
                type="number"
                placeholder="请输入维保费用"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶服务费" prop="driverCost">
              <el-input
                v-model="newForm.driverCost"
                type="number"
                placeholder="请输入驾驶服务费"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月度电费" prop="electricCost">
              <el-input
                v-model="newForm.electricCost"
                type="number"
                placeholder="请输入月度电费"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月度油费" prop="fuelCost">
              <el-input
                v-model="newForm.fuelCost"
                type="number"
                placeholder="请输入月度油费"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月度水费" prop="waterCost">
              <el-input
                v-model="newForm.waterCost"
                type="number"
                placeholder="请输入月度水费"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗材费用" prop="equipmentUseCost">
              <el-input
                v-model="newForm.equipmentUseCost"
                type="number"
                placeholder="请输入耗材费用"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他费用" prop="otherCost">
              <el-input
                v-model="newForm.otherCost"
                type="number"
                placeholder="请输入其他费用"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="直接人工费" prop="personCost">
              <el-input
                v-model="newForm.personCost"
                type="number"
                placeholder="请输入直接人工费"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;小计" prop="totalCost">
              <el-input
                v-model="newForm.totalCost"
                placeholder="请输入直接人工费"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税率比例" prop="tax">
              <el-input
                v-model="newForm.tax"
                type="number"
                placeholder="请输入税率比例"
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;综合费用" prop="omnibusFee">
              <el-input
                v-model="newForm.omnibusFee"
                placeholder="请输入综合费用"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;成本总额" prop="finalCost">
              <el-input
                v-model="newForm.finalCost"
                placeholder="请输入成本总额"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;成本加成" prop="finalCostAdd">
              <el-input
                v-model="newForm.finalCostAdd"
                placeholder="请输入成本加成"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;结算收入" prop="finalCostTotal">
              <el-input
                v-model="newForm.finalCostTotal"
                placeholder="请输入结算收入"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;结算金额" prop="finalAmount">
              <el-input
                v-model="newForm.finalAmount"
                placeholder="请输入结算金额"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelClick">取 消</el-button>
          <el-button
            type="primary"
            @click="newFormClick"
            :disabled="state.getDisabled"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="state.routerVisible"
      :close-on-click-modal="false"
      class="newDialogClass"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">{{ state.titleRouter }}</div>
      </template>

      <div class="dialog-content">
        <el-row class="mb-5">
          <el-col :span="12">
            <span class="span-color">订单数量：</span>
            <el-text class="w-150px text-span" truncated>{{
              state.length
            }}</el-text>
          </el-col>
          <el-col :span="12">
            <span class="span-color ml-6 mr-1"
              >{{ state.titleRouter }}金额:
            </span>

            <el-text class="w-150px text-span" truncated>{{
              state.expenditure
            }}</el-text>
          </el-col>
        </el-row>
      </div>

      <div class="aline-right">
        <el-button @click="cancellation" size="default">取消</el-button>
        <el-button type="primary" @click="submitPayment" size="default">{{
          state.titleRouter
        }}</el-button>
      </div>
    </el-dialog>
    <div class="map-content overflow-hidden" v-if="state.import">
      <div class="importSlot-height">
        <importSlot
          :apiFn="state.apiFn"
          :downFn="state.downFn"
          :downloadType="state.downloadType"
          @returnList="returnList"
        ></importSlot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { ref, onMounted, reactive, computed } from "vue";
import type { FormInstance } from "element-plus";
import { exportFile, calculate } from "@/utils";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { Warning } from "@element-plus/icons-vue";
import {
  newOrder,
  orderTotalPage,
  importOrderOrder,
  getOrderTemplate,
  putOrder,
  totalMake,
  totalWrite,
} from "@/api/sanitation/index";
import { LedgerForm, RouterParmes } from "@/api/sanitation/type";
import { deleteTractor } from "@/api/vehicleInfo";
import importSlot from "@/views/Import/index.vue";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 210;
});
const state = reactive({
  loading: false,
  dialogVisible: false,
  built: true,
  total: 0,
  getDisabled: true,
  import: false,
  apiFn: importOrderOrder,
  downFn: getOrderTemplate,
  downloadType: "fuel",
  title: "新建",
  titleRouter: "",
  length: 0,
  routerVisible: false,
  expenditure: 0,
  id: null,
});

const newForm = reactive<LedgerForm>({
  // 台账日期
  orderDate: "",
  // 车辆租金
  leaseCost: null,
  // 维保费用
  repairCost: null,
  // 驾驶服务费
  driverCost: null,
  // 月度电费
  electricCost: null,
  // 月度油费
  fuelCost: null,
  // 月度水费
  waterCost: null,
  // 耗材费用
  equipmentUseCost: null,
  // 其他费用
  otherCost: null,
  // 直接人工费
  personCost: null,
  // 税率比例
  tax: 0,
  // 小计
  totalCost: 0,
  // 综合费用
  omnibusFee: 0,
  // 成本总额
  finalCost: 0,
  // 成本加成
  finalCostAdd: 0,
  // 结算收入
  finalCostTotal: 0,
  // 结算金额
  finalAmount: 0,
});
newForm.totalCost = computed(() => {
  return (
    ((Number(newForm.leaseCost).toFixed(2)*100) +
    (Number(newForm.repairCost).toFixed(2)*100) +
    (Number(newForm.driverCost).toFixed(2)*100) +
    (Number(newForm.electricCost).toFixed(2)*100) +
    (Number(newForm.fuelCost).toFixed(2)*100) +
    (Number(newForm.waterCost).toFixed(2)*100) +
    (Number(newForm.equipmentUseCost).toFixed(2)*100) +
    (Number(newForm.otherCost).toFixed(2)*100) +
    (Number(newForm.personCost).toFixed(2)*100))/100
  );
});
newForm.omnibusFee = computed(
  () => calculate(newForm.totalCost, 0.12, "*").toFixed(2)
  // (Number(newForm.totalCost) * 0.12).toFixed(2);
);
newForm.finalCost = computed(() =>
calculate(newForm.totalCost,Number(newForm.omnibusFee),'+').toFixed(2)

  // (Number(newForm.totalCost) + Number(newForm.omnibusFee)).toFixed(2)
);
newForm.finalCostAdd = computed(() =>
  calculate(Number(newForm.finalCost), 0.03, "*").toFixed(2)
  // (Number(newForm.finalCost) * 0.03).toFixed(2)
);
newForm.finalCostTotal = computed(() =>
  calculate(Number(newForm.finalCost),Number(newForm.finalCostAdd),'+').toFixed(2)
  // (Number(newForm.finalCost) + Number(newForm.finalCostAdd)).toFixed(2)
);
newForm.finalAmount = computed(() =>
// calculate(Number(newForm.finalCost),Number(newForm.finalCostAdd),'+').toFixed(2)
calculate(Number(newForm.finalCostTotal),(1 + Number(newForm.tax) / 100),'*')
  // (Number(newForm.finalCostTotal) * (1 + Number(newForm.tax) / 100))
);
const newFormRef = ref<FormInstance>();
watch(
  [() => newForm],
  async ([newValue]) => {
    await nextTick();
    watchRules(newFormRef.value);
  },
  {
    deep: true,
  }
);
const watchRules = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    state.getDisabled = !valid;
  });
};

const newRules = {
  orderDate: [{ required: true, message: "", trigger: "blur" }],
  leaseCost: [{ required: true, message: "", trigger: "blur" }],
  repairCost: [{ required: true, message: "", trigger: "blur" }],
  driverCost: [{ required: true, message: "", trigger: "blur" }],
  electricCost: [{ required: true, message: "", trigger: "blur" }],
  fuelCost: [{ required: true, message: "", trigger: "blur" }],
  waterCost: [{ required: true, message: "", trigger: "blur" }],
  equipmentUseCost: [{ required: true, message: "", trigger: "blur" }],
  otherCost: [{ required: true, message: "", trigger: "blur" }],
  personCost: [{ required: true, message: "", trigger: "blur" }],
  tax: [{ required: true, message: "", trigger: "blur" }],
};
const queryParames = ref<RouterParmes>({
  pageNum: 1,
  pageSize: 10,
  makeStatus: "",
  writeStatus: "",
  picker: [],
});
// 查询form
let list = reactive([
  {
    type: "picker",
    label: "费用日期",
    prop: "picker",
    placeholder: "请选择费用日期",
  },
  {
    type: "selectValue",
    label: "结算状态",
    prop: "makeStatus",
    placeholder: "请选择结算状态",
    optionList: [
      {
        label: "已结算",
        value: "1",
      },
      {
        label: "未结算",
        value: "0",
      },
    ],
  },
  {
    type: "selectValue",
    label: "核销状态",
    prop: "writeStatus",
    placeholder: "请选择核销状态",
    optionList: [
      {
        label: "已核销",
        value: "1",
      },
      {
        label: "未核销",
        value: "0",
      },
    ],
  },
  {
    type: "row",
  },
  {
    type: "row",
  },
]);

onMounted(() => {
  getStatList();
});
const tableData = ref([]);
// 列表查询
const getStatList = async () => {
  state.loading = true;
  let parames: any = {};
  parames.startTime = queryParames.value.picker[0];
  parames.endTime = queryParames.value.picker[1];
  Object.assign(parames, queryParames.value);
  parames.picker = [];
  const { data } = await orderTotalPage(parames);
  try {
    tableData.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    state.loading = false;
    ElMessage(e.message);
  }
};
const searchInput = () => {
  getStatList();
};
const onSubmit = () => {
  getStatList();
};
// 新增
const newBuilt = () => {
  state.dialogVisible = true;
  state.title = "新建";
  newForm.id = null;
};
const editClick = async (index: number, row: any) => {
  state.title = "编辑";
  state.dialogVisible = true;
  await nextTick();
  newForm.id = row.id;
  newForm.orderDate = row.orderDate;
  // 车辆租金
  newForm.leaseCost = row.leaseCost;
  // 维保费用
  newForm.repairCost = row.repairCost;
  // 驾驶服务费
  newForm.driverCost = row.driverCost;
  // 月度电费
  newForm.electricCost = row.electricCost;
  // 月度油费
  newForm.fuelCost = row.fuelCost;
  // 月度水费
  newForm.waterCost = row.waterCost;
  // 耗材费用
  newForm.equipmentUseCost = row.equipmentUseCost;
  // 其他费用
  newForm.otherCost = row.otherCost;
  // 直接人工费
  newForm.personCost = row.personCost;
  // 税率比例
  newForm.tax = row.tax;
};
// 取消
const cancelClick = () => {
  state.dialogVisible = false;
  newFormRef.value?.resetFields();
};
// 确定
const newFormClick = async () => {
  state.title === "新建" ? await postNewOrder() : await putNewOrder();
};
// 单个操作
const paymentClick = (index: number, row: any, title: string) => {
  state.routerVisible = true;
  state.titleRouter = title;
  state.expenditure = row.finalAmount;
  state.length = 1;
  state.id = row.id;
};
// 批量操作
const batchTotal = (title: string) => {
  state.titleRouter = title;
  let number = 0;
  let type = title === "批量结算" ? "makeStatus" : "writeStatus";
  try {
    multipleSelection.value.some((item: any) => {
      if (item[type] === 1) {
        throw new Error(item.uuid + "已经被" + title + "，不能重复勾选");
      }
      number = calculate(number, item.finalAmount, "+");
      // number += item.finalAmount;
    });
    state.expenditure = number;
    state.length = multipleSelection.value.length;
    state.routerVisible = true;
  } catch (e: any) {
    ElMessage.warning(e.message);
  }
};

const submitPayment = async () => {
  let ids: any = null;
  let method: any = null;
  switch (state.titleRouter) {
    case "结算":
      ids = state.id;
      method = totalMake;
      break;
    case "核销":
      ids = state.id;
      method = totalWrite;
      break;
    case "批量结算":
      ids = Array.from(multipleSelection.value, (item: any) => item.id).join();
      method = totalMake;
      break;
    case "批量核销":
      ids = Array.from(multipleSelection.value, (item: any) => item.id).join();
      method = totalWrite;
      break;
  }
  try {
    await method(ids);
    state.routerVisible = false;
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

const callback = (row: any) => {
  return !(row.makeStatus === 1 && row.writeStatus === 1);
};

const cancellation = () => {
  state.routerVisible = false;
};
const postNewOrder = async () => {
  try {
    const { data } = await newOrder(newForm);
    state.dialogVisible = false;
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const putNewOrder = async () => {
  try {
    const { data } = await putOrder(newForm, newForm.id);
    state.dialogVisible = false;
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
// 导入
const importVehicle = () => {
  state.import = true;
};
// 导出
const exportVehicle = () => {
  let parames: any = {};
  parames.startTime = queryParames.value.picker[0];
  parames.endTime = queryParames.value.picker[1];
  Object.assign(parames, queryParames.value);
  parames.picker = [];
  exportFile(parames, "/api/v1/ems/order/total/_export");
};

const returnList = () => {
  state.import = false;
  // state.built = true;
};
const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
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
  await deleteTractor(ids, "/api/v1/ems/order/total/");
  getStatList();
};
const handleQuery = () => {
  getStatList();
};
const handleSizeChange = (value: number) => {
  queryParames.value.pageSize = value;
  getStatList();
};
const handleCurrentChange = (value: number) => {
  queryParames.value.pageNum = value;
  getStatList();
};
</script>
<style scoped lang="scss">
.scope-icon {
  :deep(.el-icon) {
    vertical-align: middle;
  }
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
:deep(.newDialogClass .el-dialog__body) {
  padding: 10px var(--el-dialog-padding-primary);
}
:deep(.el-table thead th) {
  background: #f6f9ff;
  color: #303030;
}
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
:deep(.el-button--text.is-disabled) {
  color: var(--el-color-primary);
  opacity: 0.5;
}
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor1 {
  background: #bbbbbb;
}
.roundColor0 {
  background: #ffb608;
}
.text-span {
  color: #303030;
  font-size: 16px;
  line-height: 32px;
  font-weight: 600;
  text-align: left;
  display: inline;
}
</style>
