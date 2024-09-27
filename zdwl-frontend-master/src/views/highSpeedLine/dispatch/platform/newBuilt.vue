<template>
  <el-form
    :model="form"
    :rules="rules"
    label-width="110px"
    v-loading="state.loading"
    :show-message="false"
    size="default"
    ref="ruleFormRef"
    label-position="left"
    class="map-content"
  >
    <div class="set-height">
      <div class="blod">业务信息</div>
      <el-row :gutter="80" class="mt-8">
        <el-col :span="8">
          <el-form-item label="订单日期" prop="orderDate">
            <el-date-picker
              v-model="form.orderDate"
              type="date"
              placeholder="请选择订单日期"
              size="default"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="客户名称" prop="customerCode">
            <el-select
              v-model="form.customerCode"
              style="width: 100%"
              placeholder="请选择客户名称"
            >
              <el-option
                v-for="item in props.cooperateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="projectCode">
            <el-select
              v-model="form.projectCode"
              style="width: 100%"
              placeholder="请选择项目名称"
           
            >
              <el-option
                v-for="item in props.projectOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="路线名称" prop="route">
            <el-input
              placeholder="请输入线名称"
              v-model="form.route"
            /> </el-form-item
        ></el-col>
        
        <!-- <el-col :span="8">
          <el-form-item label="车辆类型" prop="">
            <el-input placeholder="请输入车辆类型" v-model="form." /> 
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="收入结算" prop="income">
            <el-input v-model="form.income" placeholder="请输入收入结算">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
   
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <el-form-item label="牵引车牌" prop="tractor">
            <el-input
              placeholder="请输入牵引车牌"
              v-model="form.tractor"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="挂车车牌" prop="trailer">
            <el-input
              placeholder="请输入挂车车牌"
              v-model="form.trailer"
            /> </el-form-item
        ></el-col>
        
        <el-col :span="8">
          <el-form-item label="司机姓名" prop="driver">
            <el-input
              placeholder="请输入司机姓名"
              v-model="form.driver"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="司机联系方式" prop="driverPhone">
            <el-input v-model="form.driverPhone" placeholder="请输入司机联系方式">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="司机运费" prop="driverCost">
            <el-input v-model="form.driverCost" placeholder="请输入司机运费">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="plateCost" label-width="">
            <template #label="label">
              <span>平台运费</span>
              <el-tooltip effect="dark" content="含税" placement="top">
                <el-icon class="box-item"><Warning /></el-icon>
              </el-tooltip>
            </template>

            <el-input v-model="form.plateCost" placeholder="请输入平台运费"
              ><template #append>元</template></el-input
            >
          </el-form-item></el-col
        >
        <el-col :span="8">
          <el-form-item label="&nbsp;&nbsp;&nbsp;压车费用" prop="">
            <el-input v-model="form.delayCost" placeholder="请输入主押车费用">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="&nbsp;&nbsp;&nbsp;放空费用" prop="">
            <el-input v-model="form.emptyCost" placeholder="请输入放空费用">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="&nbsp;&nbsp;&nbsp;经停费用" prop="">
            <el-input v-model="form.parkCost" placeholder="请输入经停费用">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="&nbsp;&nbsp;&nbsp;扣款费用" prop="">
            <el-input v-model="form.outCost" placeholder="请输入扣款费用">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="blod mt-4">收款信息</div>
      <el-row :gutter="80" class="mt-8">
        <el-col :span="8">
          <el-form-item label="收款人姓名" prop="payPerson">
            <el-input
              v-model="form.payPerson"
              placeholder="请输入收款人姓名"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="收款电话" prop="payPhone">
            <el-input
              v-model="form.payPhone"
              placeholder="请输入收款电话"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="开户银行" prop="payBank">
            <el-input v-model="form.payBank" placeholder="请输入开户银行">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行卡号" prop="payNumber">
            <el-input v-model="form.payNumber" placeholder="请输入银行卡号">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="&nbsp;&nbsp;&nbsp;备注信息" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注信息">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="operate mt-14">
        <el-button @click="cancellation" size="default">取消</el-button>
        <el-button
        :disabled="!state.submitRecord"
          type="primary"
          @click="submitForm(ruleFormRef)"
          size="default"
          >确定</el-button
        >
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { Warning } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { NewState, Platform, Options } from "@/api/depreciation/types";
import { plateOrder, plateOrderId } from "@/api/depreciation";
import { Option } from "element-plus/es/components/select-v2/src/select.types";
const form = reactive<Platform>({
  orderDate: "",
  customerCode: undefined,
  projectCode: undefined,
  project: "",
  route: "",
  tractor: "",
  trailer: "",
  driver: "",
  plateCost: undefined,
  driverCost: undefined,
  income: undefined,
  driverPhone: "",
  delayCost: 0,
  emptyCost: 0,
  parkCost: 0,
  outCost: 0,
  payPerson: "",
  payPhone: "",
  payBank: "",
  payNumber: "",
  remark: "",
});
watch(
  [() => form, () => form],
  ([newValue, oldValue]) => {
    watchRules(ruleFormRef.value);
  },
  {
    deep: true,
  }
);
const watchRules = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    state.submitRecord = valid
  });
};
const state = reactive<NewState>({
  loading: false,
  dialogBorder: false,
  fileSrc: "",
  title: "",
  edit: false,
  submitRecord: false,
});
const rules = {
  orderDate: [
    {
      required: true,
      trigger: "change",
    },
  ],
  customerCode: [
    {
      required: true,
      trigger: "change",
    },
  ],
  projectCode: [
    {
      required: true,
      trigger: "change",
    },
  ],
  route: [
    {
      required: true,
      trigger: "change",
    },
  ],
  tractor: [
    {
      required: true,
      trigger: "change",
    },
  ],
  trailer: [
    {
      required: true,
      trigger: "change",
    },
  ],
  driver: [
    {
      required: true,
      trigger: "change",
    },
  ],
  plateCost: [
    {
      required: true,
      trigger: "change",
    },
  ],
  payPerson: [
    {
      required: true,
      trigger: "change",
    },
  ],
  payPhone: [
    {
      required: true,
      trigger: "change",
    },
  ],
  payBank: [
    {
      required: true,
      trigger: "change",
    },
  ],

  payNumber: [
    {
      required: true,
      trigger: "change",
    },
  ],
  driverCost: [
    {
      required: true,
      trigger: "change",
    },
  ],
  income: [
    {
      required: true,
      trigger: "change",
    },
  ],
  driverPhone: [
    {
      required: true,
      trigger: "change",
    },
  ],
};
interface Props {
  editForm: Platform;
  projectOption: any;
  cooperateOptions: any;
}
// const projectChange = (val:number) =>{
//   form.project = props.projectOption.filter((value:any)=> value.value === val)[0]?.label;
// }
const props = defineProps<Props>();
const editForm = async () => {
  if (props.editForm&&props.editForm.id) {
    Object.assign(form, props.editForm);
    state.edit = true;
  }
  state.loading = false;
};
const ruleFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      state.edit ? editPlateOrder() : getPlateOrderId();
      
    } else {
      console.log("error submit!", fields);
    }
  });
};

const emit = defineEmits(["cancelBuit"]);
const cancellation = () => {
  emit("cancelBuit");
};
const getPlateOrderId = async () => {
  try {
    const { data } = await plateOrder(form);
    ElMessage.success("新增成功");
    emit("cancelBuit",true);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const editPlateOrder = async () => {
  try {
    const { data } = await plateOrderId(form, props.editForm.id);
    ElMessage.success("修改成功");
    emit("cancelBuit",true);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
onMounted(() => {
  state.loading = true;
  try {
    editForm();
  } catch (e: any) {
    state.loading = false;
    ElMessage.error(e.message);
  }
});
</script>
<style scoped lang="scss">
.box-item {
  margin-top: 8px;
}
.set-height {
  padding-bottom: 0;
  
}
.map-content{
  overflow: auto;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
</style>
