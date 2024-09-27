<template>
  <div class="app-container">
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
          <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }"
            ><span style="color: #8c8c8c">高速干线</span></el-breadcrumb-item
          >
          <el-breadcrumb-item
            :to="{ path: '/highSpeedLine/platformLedger/platformInfo' }"
            ><span style="color: #8c8c8c"
              >平台业务台账</span
            ></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><span
              @click="returnList"
              :class="state.import ? 'breadcrumb-color' : 'breadcrumb-color-is'"
              >平台业务信息</span
            ></el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="state.import"
            ><span style="color: #303030">批量开票</span></el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-header>
      <div v-if="!state.import" class="set-height" ref="vehi">
        <!-- <el-tabs
          v-model="form.orderType"
          class="demo-tabs"
          @tab-change="handleClick"
        >
          <el-tab-pane label="付款订单" name="pay"> </el-tab-pane>
          <el-tab-pane label="核销订单" name="write"> </el-tab-pane>
          <el-tab-pane label="开票订单" name="make"> </el-tab-pane>
        </el-tabs> -->
        <Form
          class="hide-form"
          :formModel="form"
          :fromList="list"
          ref="formList"
          @collapseExpand="collapseExpand"
          @searchInput="searchInput"
          @onSubmit="onSubmit"
          @restFunction="restFunction"
        >
          <template #formSlot> </template>
        </Form>
        <el-row>
          <el-col :span="12">
            <el-button
              @click="batchPayment('批量付款', 'pay')"
              type="primary"
              size="default"
              >付款</el-button
            >
            <el-button
              @click="batchPayment('批量核销', 'write')"
              type="primary"
              size="default"
              >核销</el-button
            >
            <el-button
              @click="batchPayment('批量开票', 'make')"
              type="primary"
              size="default"
              >开票</el-button
            >
            <el-button @click="importClick">批量开票</el-button>
            <el-button @click="exportVehicle" size="default">导出</el-button>
          </el-col>
          <el-col :span="12" class="property">
            <div>
              <span class="span-color">收入结算(元)：</span>
              <el-text class="w-150px text-span" truncated>
                {{ stat.incomeSum }}
              </el-text>
              <span class="span-color ml-8">平台支出(元)：</span>
              <el-text class="w-150px text-span" truncated>
                {{ stat.plateSum }}
              </el-text>
            </div>
          </el-col>
        </el-row>
        <div class="selectDiv" v-show="multipleSelection.length !== 0">
          已选择
          <span class="selectText"> {{ multipleSelection.length }} </span>
          项，收入结算总金额
          <span class="selectText">{{ state.number }}</span> 元，平台支出总金额
          <span class="selectText">{{ state.settlement }}</span> 元
          <span
            @click="cancellationAll"
            class="selectText float-right cursor-pointer"
            >取消选择</span
          >
        </div>
        <el-table
          :data="tableData"
          v-loading="state.loading"
          @sort-change="sortChange"
          :max-height="setHeight"
          ref="multipleTableRef"
          size="default"
          show-overflow-tooltip
          style="width: 100%; margin-top: 16px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column width="144" prop="uuid" fixed label="订单编号" />
          <el-table-column width="240" prop="" label="订单状态" align="center">
            <template #default="scope">
              <el-button
                :type="scope.row.payStatus === 0 ? '' : 'primary'"
                size="small"
                plain
                round
                >{{
                  scope.row.payStatus === 0 ? "未付款" : "已付款"
                }}</el-button
              >
              <el-button
                :type="scope.row.writeStatus === 0 ? '' : 'primary'"
                size="small"
                plain
                round
                >{{
                  scope.row.writeStatus === 0 ? "未核销" : "已核销"
                }}</el-button
              >
              <el-button
                :type="scope.row.makeStatus === 0 ? '' : 'primary'"
                size="small"
                plain
                round
                >{{
                  scope.row.makeStatus === 0 ? "未开票" : "已开票"
                }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            width="110"
            sortable="custom"
            prop="orderDate"
            label="订单日期"
          >
            <template #default="scope">
              {{ fileTime(scope.row.orderDate) }}
            </template>
          </el-table-column>
          <el-table-column width="160" prop="customerCode" label="客户名称">
            <template #default="scope">
              {{ fileOption(cooperateOptions, scope.row.customerCode) }}
            </template>
          </el-table-column>
          <el-table-column width="200" prop="route" label="路线名称" />
          <el-table-column width="110" prop="tractor" label="牵引车牌" />
          <el-table-column width="90" prop="driver" label="司机姓名" />
          <el-table-column
            width="130"
            prop="income"
            align="right"
            label="收入结算（元）"
          ></el-table-column>
          <el-table-column width="140" align="right" prop="plateCost">
            <template #header="header">
              <span>平台支出（元）</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="含税"
                placement="top"
              >
                <span class="scope-icon">
                  <el-icon><Warning /></el-icon
                ></span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            width="110"
            align="right"
            prop="delayCost"
            label="压车费（元）"
          />
          <el-table-column
            width="110"
            align="right"
            prop="emptyCost"
            label="放空费（元）"
          />
          <el-table-column
            width="110"
            align="right"
            prop="parkCost"
            label="经停费（元）"
          />
          <el-table-column
            width="100"
            align="right"
            prop="outCost"
            label="扣款（元）"
          />
          <el-table-column
            width="126"
            prop="driverCost"
            align="right"
            label="司机运费（元）"
          />
          
          <el-table-column prop="remark" width="126" label="备注" />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
            width="170"
          />
          <el-table-column prop="" fixed="right" label="操作" width="190">
            <template #default="scope">
              <el-button
                key="text"
                type="text"
                @click.stop="editClick(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                key="text"
                type="text"
                :disabled="scope.row.payStatus === 1"
                @click.stop="
                  paymentClick(
                    scope.$index,
                    scope.row,
                    '付款',
                    scope.row.plateCost,
                    'pay'
                  )
                "
                >付款</el-button
              >
              <el-button
                key="text"
                type="text"
                :disabled="
                  scope.row.writeStatus === 1 || scope.row.payStatus === 0
                "
                @click.stop="
                  paymentClick(
                    scope.$index,
                    scope.row,
                    '核销',
                    scope.row.plateCost,
                    'write'
                  )
                "
                >核销</el-button
              >
              <el-button
                key="text"
                type="text"
                :disabled="scope.row.makeStatus === 1"
                @click.stop="
                  paymentClick(
                    scope.$index,
                    scope.row,
                    '开票',
                    scope.row.income,
                    'make'
                  )
                "
                >开票</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row class="pagination-style" justify="end">
          <el-pagination
            background
            layout="total, prev, pager, next, sizes, jumper"
            @size-change="handleUseSizeChange"
            @current-change="handleUseCurrentChange"
            :pager-count="5"
            :page-sizes="[10, 20, 30, 40, 100]"
            :total="state.total"
          />
        </el-row>
      </div>
      <div class="importSlot-height" v-if="state.import">
        <importSlot
          :title="state.title"
          :apiFn="state.apiFn"
          :downFn="state.downFn"
          :downloadType="state.downloadType"
          @returnList="returnList"
        ></importSlot>
      </div>
    </div>
    <el-dialog
      v-model="state.dialogVisible"
      :close-on-click-modal="false"
      class="newDialogClass"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">{{ payment.title }}</div>
      </template>
      <div class="border"></div>
      <div class="dialog-content">
        <el-row class="mb-5">
          <el-col :span="12">
            <span class="span-color">订单数量：</span>
            <el-text class="w-150px text-span" truncated>{{
              payment.length
            }}</el-text>
          </el-col>
          <el-col :span="12">
            <span
              v-if="payment.title.includes('开票')"
              class="span-color ml-6"
              >{{
                payment.title.includes("批量")
                  ? "累计收入结算(含税)："
                  : "收入结算(含税)："
              }}</span
            >
            <span v-else class="span-color ml-6">{{
              payment.title.includes("批量")
                ? "平台累计支出(含税)："
                : "平台支出(含税)："
            }}</span>
            <el-text class="w-150px text-span" truncated>{{
              payment.expenditure
            }}</el-text>
          </el-col>
        </el-row>
      </div>

      <div class="aline-right">
        <el-button @click="cancellation" size="default">取消</el-button>
        <el-button type="primary" @click="submitPayment" size="default">{{
          payment.title
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="state.editVisible" :close-on-click-modal="false">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div>编辑</div>
        </div>
      </template>
      <div class="border"></div>
      <div class="dialog-content">
        <el-form
          :model="paymentForm"
          :rules="paymentRules"
          label-position="left"
          label-width="100px"
          ref="editFormRef"
          class="newFormClass"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="收入结算" prop="income">
                <el-input
                  v-model="paymentForm.income"
                  placeholder="请输入收入结算"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平台支付" prop="plateCost">
                <el-input
                  v-model="paymentForm.plateCost"
                  placeholder="请输入平台支付"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="司机运费" prop="driverCost">
                <el-input
                  v-model="paymentForm.driverCost"
                  placeholder="请输入司机运费"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="压车费" prop="delayCost">
                <el-input
                  v-model="paymentForm.delayCost"
                  placeholder="请输入压车费"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="放空费" prop="emptyCost">
                <el-input
                  v-model="paymentForm.emptyCost"
                  placeholder="请输入放空费"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经停费" prop="parkCost">
                <el-input
                  v-model="paymentForm.parkCost"
                  placeholder="请输入经停费"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扣款费" prop="outCost">
                <el-input
                  v-model="paymentForm.outCost"
                  placeholder="请输入扣款费"
                >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="aline-right">
        <el-button @click="cancellation" size="default">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm(editFormRef)"
          size="default"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { Warning } from "@element-plus/icons-vue";
import { AssemblyForm } from "@/api/vehicleInfo/types";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { useElementSize } from "@vueuse/core";
import { exportFile, calculate } from "@/utils";
import { deleteTractor } from "@/api/vehicleInfo";
import {
  projectList,
  cooperateList,
  lineInfoList,
  tractorList,
  driverList,
  plateOrderPage,
  importIncome,
  incomeTemplate,
  plateOrderStat,
  plateOrderId,
  plateOrderPay,
} from "@/api/depreciation";
import importSlot from "@/views/Import/index.vue";
import { Options, Stat, Platform, Payment } from "@/api/depreciation/types";
import type { FormInstance } from "element-plus";
import { onMounted } from "vue";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 180;
});

// 司机姓名
const driverOptions = ref<Options[]>([]);
// 项目名称
const projectOption = ref<Options[]>([]);
// 线路名称
const licenseOptions = ref<Options[]>([]);
// 牵引车牌
const tractorOptions = ref<Options[]>([]);
// 客户名称
const cooperateOptions = ref<Options[]>([]);
// 查询form
let list: AssemblyForm[] = reactive([]);
const form = reactive({
  startTime: "",
  endTime: "",
  picker: [],
  pageNum: 1,
  pageSize: 10,
  status: undefined,
  customerCode: undefined,
  routeCode: undefined,
  orderType: "",
  tractorCode: undefined,
  driverCod: undefined,
  payStatus: null,
  makeStatus: null,
  writeStatus: null,
  orderDateSort: "desc",
});

const paymentForm = reactive<Platform>({
  orderDate: "",
  customerCode: undefined,
  projectCode: undefined,
  route: "",
  tractor: "",
  trailer: "",
  driver: "",
  plateCost: undefined,
  driverCost: undefined,
  income: undefined,
  driverPhone: "",
  delayCost: undefined,
  emptyCost: undefined,
  parkCost: undefined,
  outCost: undefined,
  payPerson: "",
  payPhone: "",
  payBank: "",
  payNumber: "",
  remark: "",
});
const paymentRules = {
  income: [{ required: true, message: "", trigger: "blur" }],
  plateCost: [{ required: true, message: "", trigger: "blur" }],
  driverCost: [{ required: true, message: "", trigger: "blur" }],
  delayCost: [{ required: true, message: "", trigger: "blur" }],
  emptyCost: [{ required: true, message: "", trigger: "blur" }],
  parkCost: [{ required: true, message: "", trigger: "blur" }],
  outCost: [{ required: true, message: "", trigger: "blur" }],
};
onMounted(() => {
  Promise.all([
    driverList(),
    tractorList(),
    cooperateList(),
    lineInfoList({}),
    projectList(),
  ]).then((res) => {
    res.map((n, index) => {
      if (index === 0) {
        n.data.map((i: any) => {
          driverOptions.value.push({ value: i.id, label: i.name, ...i });
        });
      } else if (index === 1) {
        n.data.map((i: any) => {
          tractorOptions.value?.push({ value: i.id, label: i.card, ...i });
        });
      } else if (index === 2) {
        n.data.map((i: any) => {
          cooperateOptions.value?.push({ value: i.id, label: i.name });
        });
      } else if (index === 3) {
        n.data.map((i: any) => {
          licenseOptions.value?.push({ value: i.id, label: i.name });
        });
      } else if (index === 4) {
        n.data.map((i: any) => {
          projectOption.value?.push({ value: i.id, label: i.name });
        });
      }
    });
  });
  Object.assign(list, [
    // {
    //   type: "input",
    //   label: "订单编号",
    //   prop: "keywords",
    //   placeholder: "请输入订单编号",
    // },强制完成，路线轨迹,改为code编码
    {
      type: "selectValue",
      label: "客户名称",
      prop: "customerCode",
      placeholder: "请选择客户名称",
      optionList: cooperateOptions,
    },
    {
      type: "selectValue",
      label: "项目名称",
      prop: "projectCode",
      placeholder: "请选择项目名称",
      optionList: projectOption,
    },
    {
      type: "input",
      label: "线路名称",
      prop: "route",
      placeholder: "请输入线路名称",
    },
    {
      type: "input",
      label: "订单编号",
      prop: "uuid",
      placeholder: "请输入订单编号",
    },
    {
      type: "pickerDate",
      label: "订单日期",
      prop: ["startTime", "endTime"],
      placeholder: "请选择订单日期",
    },
    {
      type: "input",
      label: "司机姓名",
      prop: "driver",
      placeholder: "请输入司机姓名",
    },
    {
      type: "input",
      label: "车牌号码",
      prop: "tractor",
      placeholder: "请输入车牌号码",
    },
    {
      type: "selectValue",
      label: "付款状态",
      prop: "payStatus",
      placeholder: "请选择付款状态",
      optionList: [
        {
          label: "已付款",
          value: "1",
        },
        {
          label: "未付款",
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
      type: "selectValue",
      label: "开票状态",
      prop: "makeStatus",
      placeholder: "请选择开票状态",
      optionList: [
        {
          label: "已开票",
          value: "1",
        },
        {
          label: "未开票",
          value: "0",
        },
      ],
    },
    {
      type: "row",
    },
  ]);
  getStatList();
});
const searchInput = () => {
  getStatList();
};
const orderType = { pay: "付款", write: "核销", make: "开票" };

let stat = reactive<Stat>({
  // 收入结算
  incomeSum: 0,
  // 平台支出
  plateSum: 0,
});
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
const tableData: any = ref([]);
// 列表查询
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await plateOrderPage(form);
    tableData.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
  // 统计查询
  try {
    const { data } = await plateOrderStat(form);
    stat.incomeSum = data.incomeSum;
    stat.plateSum = data.plateSum;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const state = reactive({
  loading: false,
  dialogVisible: false,
  paymentVisible: false,
  editVisible: false,
  title: "",
  apiFn: importIncome,
  downFn: incomeTemplate,
  downloadType: "fuel",
  projectLoading: false,
  step: 0,
  built: true,
  total: 0,
  number: 0,
  settlement: 0,
  import: false,
});
const returnList = () => {
  state.import = false;
  getStatList();
};
const importClick = () => {
  state.import = true;
};
const newBuilt = () => {
  state.dialogVisible = true;
};

const cancellation = () => {
  state.dialogVisible = false;
  state.paymentVisible = false;
  state.editVisible = false;
};
const editFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      getplateOrderId();
    } else {
      console.log("error submit!", fields);
    }
  });
};
const sortChange = (column: any) => {
  form.orderDateSort = column.order === "descending" ? "asc" : "desc";
  getStatList();
};
const getplateOrderId = async () => {
  try {
    const { data } = await plateOrderId(paymentForm, paymentForm.id);
    state.editVisible = false;
    ElMessage.success("修改成功");
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const editClick = (index: number, row: any) => {
  state.editVisible = true;
  Object.assign(paymentForm, row);
};
// 导出
const exportVehicle = () => {
  exportFile(form, "/api/v1/plateOrder/_export");
};
const restFunction = () => {
  form.startTime = "";
  form.endTime = "";
};
const onSubmit = () => {
  getStatList();
};
const collapseExpand = (val: boolean) => {
  val ? (height.value = height.value + 50) : (height.value = height.value - 50);
};
interface User {
  date: string;
  name: string;
  address: string;
}

const multipleSelection = ref<User[]>([]);
// 删除
const handleDelete = async (index: number, ids: any) => {
  await deleteTractor(ids, "/api/v1/plateOrder/");
  getStatList();
};
const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const fileOption = (list: any, code: number) => {
  return list.filter((n: any) => n.value === code)[0]?.label;
};
const payment = reactive<Payment>({
  title: "",
  number: 0,
  expenditure: 0,
  length: 0,
  ids: undefined,
});
// 单个付款
const paymentClick = (
  index: number,
  row: any,
  value: string,
  number: number,
  type: string
) => {
  state.dialogVisible = true;
  payment.title = value;
  form.orderType = type;
  payment.expenditure = number;
  payment.length = 1;
  payment.ids = row.id;
};
// 多个付款
const batchPayment = (value: string, type: string) => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请先选择订单");
    return;
  }
  state.dialogVisible = true;
  form.orderType = type;
  payment.title = value;
  let sum = 0;
  multipleSelection.value.map((n: any) => {
    let numberEv = payment.title.includes("开票") ? n.income : n.plateCost;
    sum = calculate(sum, numberEv, "+");
  });
  payment.expenditure = sum;
  payment.length = multipleSelection.value.length;
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  payment.ids = arr;
};
const submitPayment = async (ids: number | string) => {
  try {
    await plateOrderPay(payment.ids, form.orderType);
    state.dialogVisible = false;
    ElMessage.success(payment.title + "成功");
    getStatList();
  } catch (e: any) {
    state.dialogVisible = false;
    ElMessage.error(e.message);
  }
};
const multipleTableRef = ref();
// 取消多选
const cancellationAll = () => {
  multipleTableRef.value?.clearSelection();
};
// 多选点击事件
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
  let number: number | null = 0;
  let settlement: number | null = 0;
  multipleSelection.value.map((n: any) => {
    number = calculate(number, n.income, "+");
    settlement = calculate(settlement, n.plateCost, "+");
  });
  state.number = number;
  state.settlement = settlement;
};
const formList = ref();
const handleClick = (value: any) => {
  form.payStatus = null;
  form.writeStatus = null;
  form.makeStatus = null;
  list.pop();
  let obj = {};
  switch (form.orderType) {
    case "pay":
      obj = {
        type: "selectValue",
        label: "付款状态",
        prop: "payStatus",
        placeholder: "请选择付款状态",
        optionList: [
          {
            label: "已付款",
            value: "1",
          },
          {
            label: "未付款",
            value: "0",
          },
        ],
      };
      break;
    case "write":
      obj = {
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
      };
      break;
    case "make":
      obj = {
        type: "selectValue",
        label: "开票状态",
        prop: "makeStatus",
        placeholder: "请选择开票状态",
        optionList: [
          {
            label: "已开票",
            value: "1",
          },
          {
            label: "未开票",
            value: "0",
          },
        ],
      };

      break;
  }
  list.push(obj);
  getStatList();
};
</script>
<style scoped lang="scss">
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-button--text.is-disabled) {
  color: var(--el-color-primary);
  opacity: 0.5;
}
.text-span {
  color: #303030;
  font-size: 16px;
  line-height: 32px;
  font-weight: 600;
  text-align: left;
  display: inline;
}
:deep(.set-height .el-tabs__item) {
  font-size: 16px;
}
:deep(.set-height .el-tabs__content) {
  margin-top: 32px;
}
:deep(.el-tabs__nav) {
  padding: 10px 0;
}
.set-height {
  padding-top: 24px;
  height: auto;
  min-height: calc(100% - 86px);
}
.app-container {
  height: 100%;
}
.scope-icon {
  :deep(.el-icon) {
    vertical-align: middle;
  }
}
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 10px;
}
.border {
  border-width: 0;
  display: block;
  border-top: 1px solid #e4e4e4;
}
:deep(.el-dialog__body) {
  padding-top: 0;
  padding-bottom: 10px;
}
.property {
  text-align: right;
}
.t-right {
  text-align: right;
}
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor0 {
  background: #bbbbbb;
}
.span-color {
  color: #606060;
  font-size: 14px;
  line-height: 32px;
  display: inline-block;
  vertical-align: top;
}
.roundColor1 {
  background: #ffb608;
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
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
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
</style>
