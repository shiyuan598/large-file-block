<template>
  <el-form
    :model="form"
    :rules="rules"
    label-width="110px"
    v-loading="state.loading"
    size="default"
    ref="ruleFormRef"
    label-position="left"
    class="map-content"
  >
    <div class="auto">
      <div class="blod">业务信息</div>
      <el-row :gutter="80" class="mt-8">
        <el-col :span="8">
          <el-form-item label="客户名称" prop="baseForm.customer">
            <el-input
              disabled
              v-model="form.baseForm.customer"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="baseForm.project">
            <el-input disabled v-model="form.baseForm.project" /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="线路名称" prop="baseForm.route">
            <el-select
              v-model="form.baseForm.route"
              filterable
              style="width: 100%"
              placeholder="请选择路线名称"
            >
              <el-option
                v-for="item in licenseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单日期" prop="baseForm.orderDate">
            <el-date-picker
              v-model="form.baseForm.orderDate"
              type="date"
              placeholder="请选择订单日期"
              size="default"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="车牌号码" prop="baseForm.tractorCode">
            <el-select
              v-model="form.baseForm.tractorCode"
              style="width: 100%"
              placeholder="请选择车牌号码"
              filterable
              @change="changeTracto"
            >
              <el-option
                v-for="item in state.tractor"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输类型" prop="baseForm.tranTypeCode">
            <el-select
              v-model="form.baseForm.tranTypeCode"
              style="width: 100%"
              placeholder="请选择运输类型"
              @change="changeTranType"
            >
              <el-option
                v-for="item in setDictionary.state.tranType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="blod mt-4" style="border: 0">路线信息</div>
      <TableModel
        ref="tableModel"
        :state="state"
        :stationForms="form.stationForms"
      ></TableModel>
      <div class="blod mt-10">司机提成</div>
      <el-row :gutter="80" class="mt-8">
        <el-col class="margin-bo" :span="8">
          <el-form-item label="单双驾驶" prop="status">
            <el-radio-group v-model="form.baseForm.driverType" class="ml-4">
              <el-radio :label="2" size="large">双驾</el-radio>
              <el-radio :label="1" size="large">单驾</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col class="margin-bo" :span="8"></el-col>
        <el-col class="margin-bo" :span="8"></el-col>
        <template
          v-for="(formItem, index) in form.costDriverForms.slice(
            0,
            form.baseForm.driverType
          )"
          :key="formItem.id"
        >
          <el-col :span="8">
            <el-form-item
              :label="formItem.type === 1 ? '主驾姓名' : '副驾姓名'"
              prop="upDriver"
            >
              <el-select
                v-model="formItem.upDriverCode"
                style="width: 100%"
                filterable
                placeholder="请选择司机姓名"
                @change="(value:number)=>{setName(value,formItem)}"
              >
                <el-option
                  v-for="item in props.driverOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="formItem.type === 1 ? '主驾标准提成' : '副驾标准提成'"
              prop=""
            >
              <el-input
                v-model="formItem.upAmount"
                placeholder="请输入主驾标准提成"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="margin-bo" :span="8">
            <el-form-item
              :label="formItem.type === 1 ? '主驾标准扣款' : '副驾标准扣款'"
              prop=""
            >
              <el-row>
                <el-col :span="11">
                  <el-input v-model="formItem.fineFee" placeholder="扣款金额">
                    <template #append>元</template>
                  </el-input>
                </el-col>
                <el-col :span="1" class="center"> - </el-col>
                <el-col :span="12">
                  <el-input v-model="formItem.remark" placeholder="备注信息">
                  </el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <div class="blod mt-3" style="border: 0">油费信息</div>
      <OilFee
        :state="state"
        :unit="'L'"
        :costProps="form.costFuelForms"
        :formRules="formRules"
      ></OilFee>
      <div class="blod mt-11" style="border: 0">尿素费信息</div>
      <OilFee
        :state="state"
        :unit="'KG'"
        :formRules="formRules"
        :costProps="form.costUreaForms"
      ></OilFee>
      <div class="blod mt-11">高速费信息</div>
      <el-row
        :gutter="80"
        class="mt-8"
        v-for="(item, index) in form.costHighwayForms"
      >
        <el-col class="margin-bo" :span="8">
          <el-form-item
            label="费用日期"
            :prop="`costHighwayForms.${index}.date`"
            :rules="formRules.input"
          >
            <el-date-picker
              v-model="item.date"
              type="date"
              placeholder="费用日期"
              size="default"
              format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="高速标准费用"
            :prop="`costHighwayForms.${index}.upAmount`"
            :rules="formRules.input"
          >
            <el-input v-model="item.upAmount" placeholder="请输入高速标准费用">
              <template #append>元</template>
            </el-input>
          </el-form-item></el-col
        >
        <el-col :span="8"></el-col>
      </el-row>
      <div class="blod mt-3" style="border: 0">司机垫付</div>
      <Advance
        :state="state"
        :driverOptionsProps="props.driverOptions"
        :costProps="form.costExpenseForms"
      ></Advance>
      <div class="blod mt-11">运费收入</div>
      <el-row :gutter="80" class="mt-8">
        <el-col :span="8">
          <el-form-item label="标准运费" prop="incomeForm.upAmount">
            <el-input
              v-model="form.incomeForm.upAmount"
              placeholder="请输入标准运费"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="放空里程" prop="emptyMileage">
            <el-input
              v-model="form.incomeForm.emptyMileage"
              placeholder="请输入放空里程"
            >
              <template #append>KM</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="多装多卸里程" prop="multipleMileage">
            <el-input
              v-model="form.incomeForm.multipleMileage"
              placeholder="请输入多装多卸里程"
            >
              <template #append>KM</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提送货里程" prop="takeMileage">
            <el-input
              v-model="form.incomeForm.takeMileage"
              placeholder="请输入提送货里程"
            >
              <template #append>KM</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="form.incomeForm.remark"
              placeholder="请输入备注信息"
              type="textarea"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div class="operate mt-10">
      <el-button @click="cancellation" size="default">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)" size="default"
        >确定</el-button
      >
    </div>
  </el-form>
</template>
<script setup lang="ts">
import TableModel from "./tableModel.vue";
import OilFee from "./oilFee.vue";
import Advance from "./advance.vue";
import {
  NewState,
  NewDispatch,
  Options,
  EditForm,
} from "@/api/depreciation/types";
import { dispatchOrderId, dispatchOrderPut } from "@/api/depreciation";
import { dictionary } from "@/store/modules/dictionary";
import type { FormInstance } from "element-plus";
const props = defineProps<{
  builtRow: NewDispatch;
  tractorOptions: Options;
  driverOptions: Options;
  licenseOptions: Options;
}>();
const state = reactive<NewState>({
  loading: false,
  dialogBorder: false,
  fileSrc: "",
  title: "",
  tractor: [],
  type: 1,
  date: "",
});
const rules = {
  "baseForm.customer": [{ required: true, message: "", trigger: "blur" }],
  "baseForm.project": [{ required: true, message: "", trigger: "blur" }],
  "baseForm.route": [{ required: true, message: "", trigger: "blur" }],
  "baseForm.orderDate": [{ required: true, message: "", trigger: "blur" }],
  "baseForm.tractorCode": [{ required: true, message: "", trigger: "blur" }],
  "incomeForm.upAmount": [{ required: true, message: "", trigger: "blur" }],

  // costFuelForms:{
  //   supplierFuel:[{ required: true, message: "", trigger: "blur" }]
  // }
};
const formRules = reactive({
  input: { required: true, message: "", trigger: "blur" },
});
let form = reactive<EditForm>({
  baseForm: {
    orderDate: "",
    route: "",
    routeCode: undefined,
    startStation: "",
    startCode: undefined,
    endStation: "",
    endCode: undefined,
    waypoints: "",
    waypointCodes: undefined,
    driverType: undefined,
    firstDriver: "",
    firstDriverCode: undefined,
    firstDriverPhone: "",
    secondDriver: "",
    secondDriverCode: undefined,
    secondDriverPhone: "",
    tractor: "",
    tractorCode: undefined,
    tranType: "",
    tranTypeCode: undefined,
    customer: "",
    customerCode: undefined,
    project: "",
    projectCode: undefined,
    upAmount: undefined,
    upMileage: undefined,
    upTime: undefined,
    upFuelNum: undefined,
    upUreaNum: undefined,
    upHighAmount: undefined,
    upFirstDriverAmount: undefined,
    upSecondDriverAmount: undefined,
  },
  stationForms: [],
  costDriverForms: [],
  costFuelForms: [],
  costUreaForms: [],
  costHighwayForms: [],
  costExpenseForms: [],
  incomeForm: {
    // 标准运费
    upAmount: undefined,
    // 放空里程
    emptyMileage: undefined,
    // 多装多卸里程
    multipleMileage: undefined,
    // 提送货里程
    takeMileage: undefined,
    // 备注信息
    remark: "",
  },
});
const setDictionary: any = dictionary();
onMounted(() => {
  state.tractor = props.tractorOptions;
  getDispatchOrderId(props.builtRow.id);
});
// const firstDriverForm = ref<CostDriverForms>({
//   // 订单编号
//   // 费用日期
//   date: "",
//   // 驾驶类型
//   type: undefined,
//   // 司机名称
//   upDriver: "",
//   upDriverCode: undefined,
//   // 司机联系方式
//   upDriverPhone: "",
//   // 车牌号
//   upTractor: "",
//   // 标准提成
//   upAmount: undefined,
//   fineFee: undefined,
//   remark: undefined,
// });
// const secondDriverForm = ref<CostDriverForms>({
//   // 订单编号
//   // 费用日期
//   date: "",
//   // 驾驶类型
//   type: undefined,
//   // 司机名称
//   upDriver: "",
//   upDriverCode: undefined,
//   // 司机联系方式
//   upDriverPhone: "",
//   // 车牌号
//   upTractor: "",
//   // 标准提成
//   upAmount: undefined,
//   fineFee: undefined,
//   remark: undefined,
// });
const setName = (value: number, val: any) => {
  let obj = props.driverOptions.filter((n: any) => n.value === value);
  val.upDriver = obj[0].label;
  val.upDriverPhone = obj[0].phone;
};
const changeTracto = (value: number) => {
  let obj = state.tractor.filter((n: any) => n.value === value);
  form.baseForm.tractor = obj[0].label;
};
const changeTranType = (value: number) => {
  form.baseForm.tranType = setDictionary.state.tranType.filter(
    (val: any) => val.value === Number(value)
  )[0]?.label;
};
const tableModel = ref();
const getDispatchOrderId = async (id: number) => {
  state.loading = true;
  try {
    const { data } = await dispatchOrderId(id);

    form.baseForm = data.base;
    tableModel.value.stationList(form.baseForm.projectCode);
    form.stationForms = data.stations;
    form.costFuelForms = data.costFuels;
    form.costUreaForms = data.costUreas;
    form.costHighwayForms = data.costHighways;
    form.costExpenseForms = data.costExpenseList;
    form.incomeForm = data.income;
    form.costDriverForms = data.costDrivers;
    if (form.costDriverForms.length < 2) {
      form.costDriverForms.push({
        upDriverCode: undefined,
        upAmount: undefined,
        fineFee: undefined,
        remark: "",
        type: 2,
      });
    }
    state.type = data.base.driverType;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const ruleFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      editPut();
    } else {
      ElMessage.warning("必填项不能为空，请检查");
      console.log("error submit!", fields);
    }
  });
};

const editPut = async () => {
  try {
    console.log(form.baseForm.driverType);
    form.costDriverForms = form.costDriverForms.slice(
      0,
      form.baseForm.driverType
    );
    /** 路线提交bug修改  start**/
    form.stationForms.forEach((item, index) => {
      if (item.stationType! == 0 || item.stationType !== 9) {
        item.stationType = index;
      }
    });
    /** 路线提交bug修改  end**/

    const { data } = await dispatchOrderPut(form, props.builtRow.id);
    ElMessage.success("修改成功");
    emit("cancelBuit", true);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const emit = defineEmits(["cancelBuit"]);
const cancellation = () => {
  emit("cancelBuit");
};
</script>
<style scoped lang="scss">
:deep(.el-form-item--default) {
  margin-bottom: 32px;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
}
</style>
