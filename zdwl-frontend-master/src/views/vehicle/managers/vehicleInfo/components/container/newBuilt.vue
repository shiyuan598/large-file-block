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
    <div class="set-height auto">
      <div class="blod">业务信息</div>
      <el-row :gutter="80" class="mt-8">
        <el-col :span="8">
          <el-form-item label="集装箱编号" prop="boxCard">
            <el-input
              :disabled="state.edit"
              v-model="form.boxCard"
              placeholder="请输入集装箱编号"
            /> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="车辆品牌" prop="brand">
            <el-input
              v-model="form.brand"
              placeholder="请输入车辆品牌"
            /> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="业务场景" prop="businessCode">
            <el-select
              v-model="form.businessCode"
              style="width: 100%"
              placeholder="请选择业务场景"
              @change="(val:number|string)=>selectLabel(val,'business')"
            >
              <el-option
                v-for="item in setDictionary.state.business"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="所有权" prop="ownershipCode">
            <el-select
              v-model="form.ownershipCode"
              style="width: 100%"
              placeholder="请选择所有权"
              @change="(val:number|string)=>selectLabel(val,'ownership')"
            >
              <el-option
                v-for="item in setDictionary.state.ownership"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="挂车车牌" prop="trailerCard">
            <el-input
              v-model="form.trailerCard"
              placeholder="请输入挂车车牌"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="额定装载体积" prop="loadVolume">
            <el-input
              v-model="form.loadVolume"
              placeholder="请输入额定装载体积"
            /> </el-form-item
        ></el-col>
      </el-row>
      <div class="blod mt-4" v-if="form.ownershipCode==1">
        购车信息<span class="ml-8">填写的金额都需要精确到分</span>
      </div>
      <el-row :gutter="80" class="mt-8" v-if="form.ownershipCode==1">
        <el-col :span="8">
          <el-form-item label="启用时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择启用时间"
              size="default"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="裸车金额" prop="purAmount">
            <el-input v-model="form.purAmount" placeholder="请输入裸车金额">
              <template #append>元</template>
            </el-input>
          </el-form-item></el-col
        >
        <el-col :span="8">
          <el-form-item label="含税费用" prop="purAmountTax">
            <el-input v-model="form.purAmountTax" placeholder="请输入含税费用">
              <template #append>元</template>
            </el-input>
          </el-form-item></el-col
        >
        <el-col :span="8">
          <el-form-item label="购车时间" prop="purTime">
            <el-date-picker
              v-model="form.purTime"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择购车时间"
              size="default"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="购车地点" prop="purLocation">
            <el-input
              v-model="form.purLocation"
              placeholder="请输入购车地点"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="折旧年限" prop="depreciationPeriod">
            <el-input
              v-model="form.depreciationPeriod"
              placeholder="请输入折旧年限"
            >
              <template #append>年</template>
            </el-input>
          </el-form-item></el-col
        >
        <el-col :span="8">
          <el-form-item label="残值率" prop="residualRate">
            <el-input v-model="form.residualRate" placeholder="请输入残值率">
              <template #append>%</template>
            </el-input>
          </el-form-item></el-col
        >
      </el-row>
    </div>
    <div class="operate">
      <el-button @click="cancellation" size="default">取消</el-button>
      <el-button :disabled="!state.submitRecord" type="primary" @click="submitForm(ruleFormRef)" size="default"
        >确定</el-button
      >
    </div>
  </el-form>
</template>
<script setup lang="ts">
import { ref, defineEmits, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type {
  FormRules,
  FormInstance,
} from "element-plus";
import {
  vehicleBox,
  puttractorBox,
  depreciationCard
} from "@/api/vehicleInfo";
import { State, ContainerForm } from "@/api/vehicleInfo/types";
import { dictionary } from "@/store/modules/dictionary";


const setDictionary: any = dictionary();
const form = reactive<ContainerForm>({
  id: undefined,
  trailerCard: "",
  boxCard: "",
  brand: "",
  business: "",
  loadVolume: "",
  businessCode: undefined,
  ownership: "",
  ownershipCode: undefined,
  startTime: "",
  purAmount: undefined,
  purAmountTax: undefined,
  purTime: undefined,
  purLocation: "",
  depreciationPeriod: 7,
  residualRate: 5,
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
const rules = reactive<FormRules<ContainerForm>>({
  trailerCard: [
    {
      required: true,
      message: "请输入挂车车牌",
      trigger: "change",
    },
  ],
  brand: [
    {
      required: true,
      message: "请输入车辆品牌",
      trigger: "change",
    },
  ],
  businessCode: [
    {
      required: true,
      message: "请选择业务场景",
      trigger: "change",
    },
  ],
  ownershipCode: [
    {
      required: true,
      message: "请选择所有权",
      trigger: "change",
    },
  ],
  boxCard: [
    {
      required: true,
      message: "请输入集装箱编号",
      trigger: "change",
    },
  ],
  startTime: [
    {
      required: true,
      message: "请选择启用时间",
      trigger: "change",
    },
  ],
  purTime: [
    {
      required: true,
      message: "请选择购车时间",
      trigger: "change",
    },
  ],
  purLocation: [
    {
      required: true,
      message: "请输入购车地点",
      trigger: "change",
    },
  ],
  depreciationPeriod: [
    {
      required: true,
      message: "请输入折旧年限",
      trigger: "change",
    },
  ],
  residualRate: [
    {
      required: true,
      message: "请输入残值率",
      trigger: "change",
    },
  ],
  purAmountTax: [
    {
      required: true,
      message: "请输入含税费用",
      trigger: "change",
    },
  ],
  purAmount: [
    {
      required: true,
      message: "请输入裸车金额",
      trigger: "change",
    },
  ],
  loadVolume: [
  {
      required: true,
      message: "请输入额定装载体积",
      trigger: "change",
    },
  ]
});
const props = defineProps<Props>();

interface Props {
  editFrom: ContainerForm;
}

const state = reactive<State>({
  edit: false,
  loading: false,
  business: [],
  ownership: [],
  gpsSource: [],
  submitRecord: false
});
const emit = defineEmits(["cancellation"]);
const cancellation = () => {
  emit("cancellation");
};
const selectLabel = (val: any | string, label: any) => {
  form[label] = setDictionary.state[label].filter(
    (n: { label: string; value: Number }) => n.value === val
  )[0].label;
  console.log(form);
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
const editForm = async () => {
  if (props.editFrom.id) {
    await getCard(props.editFrom.boxCard);
    Object.assign(form, props.editFrom);
    state.edit = true;
  }
  state.loading = false;
};
const getCard = async (card: string | undefined) => {
  console.log(card)
  const { data } = await depreciationCard(card);
  try {
    if (data) {
      Object.assign(form, data);
    }
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const ruleFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
     state.edit?editPuttractor() : getVehicleTractor();
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 新增
const getVehicleTractor = async () => {
  try {
    const { data } = await vehicleBox(form);
    ElMessage.success("新增成功");
    emit("cancellation");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
// 修改
const editPuttractor = async () =>{
  try {
    const { data } = await puttractorBox(form,props.editFrom.id);
    ElMessage.success("修改成功");
    emit("cancellation");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
}
</script>
<style scoped lang="scss">
.blod {
  color: #303030;
  font-size: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid #e9e9e9;
  font-weight: 600;
  span {
    color: #969799;
    font-size: 14px;
  }
}
.upload-demo {
    width: 100%;
    position: relative;
    height: 32px;
  }
  .upload-demo {
    :deep(.el-upload-list) {
      display: inline-block;
      vertical-align: text-top;
      position: absolute;
      margin-top: 0;
      line-height: 32px;
      width: calc(100% - 110px);
    }
  }
.operate {
  height: 64px;
  border-top: 1px solid #e9e9e9;
  text-align: right;
  padding: 0 24px;
  margin: 0 16px;
  padding-top: 16px;
  background: #ffffff;
}
.set-height {
  height: calc(100% - 64px);
}
:deep(.el-form-item--default) {
  margin-bottom: 32px;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
</style>
