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
          <el-form-item label="车牌号码" prop="card">
            <el-input
              :disabled="state.edit"
              v-model="form.card"
              placeholder="请输入车牌号码"
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
        <el-col :span="8"
          ><el-form-item label="环卫车类型" prop="sanitationTypeCode">
            <el-select
              v-model="form.sanitationTypeCode"
              style="width: 100%"
              placeholder="请选择环卫车类型"
              @change="(val:number|string)=>selectLabel(val,'sanitationType')"
            >
              <el-option
                v-for="item in setDictionary.state.sanitationType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="动力类型" prop="powerTypeCode">
            <el-select
              v-model="form.powerTypeCode"
              style="width: 100%"
              placeholder="请选择动力类型"
              @change="(val:number|string)=>selectLabel(val,'powerType')"
            >
              <el-option
                v-for="item in setDictionary.state.powerType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="车架号码" prop="vin">
            <el-input
              v-model="form.vin"
              placeholder="请输入车架号码"
            /> </el-form-item
        ></el-col>
      </el-row>
      <div class="blod mt-4">证件信息</div>
      <el-row :gutter="80" class="mt-8">
        <el-col :span="8">
          <el-form-item label="行驶证件" prop="drivingCardFile">
            <el-upload
              ref="upload1"
              style="width: 100%;"
              v-model:file-list="fileList1"
              v-model="form.drivingCardFile"
              :headers="setHeaders"
              class="upload-demo"
              :action="API + '/api/v1/files'"
              multiple
              :limit="1"
              :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
              :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload1)
                  }"
              :on-error="(response: any)=>{fileSError(response)}"
              :on-exceed="
                (files :any, uploadFiles:any,val: string) => {
                  handleExceed(files, uploadFiles, 'upload1');
                }
              "
              :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles, 'drivingCardFile');
                }"
            >
              <el-button :disabled="fileList1.length>0" :icon="Upload" size="default">上传图片</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行驶证有效期" prop="drivingCardTime">
            <el-date-picker
              v-model="form.drivingCardTime"
              type="date"
              placeholder="请选择行驶证有效期"
              size="default"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="营运证件" prop="tradingCardFile">
            <el-upload
              ref="upload2"
              style="width: 100%;"
              v-model:file-list="fileList2"
              v-model="form.tradingCardFile"
              :headers="setHeaders"
              class="upload-demo"
              :action="API + '/api/v1/files'"
              multiple
              :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
              :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload1)
                  }"
              :on-error="(response: any)=>{fileSError(response)}"
              :on-success="(files :any, uploadFiles:any,val: string) => {
                  fileSuccess(files, uploadFiles, 'tradingCardFile');
                }"
              :limit="1"
              :on-exceed="
                (files :any, uploadFiles:any,val: string) => {
                  handleExceed(files, uploadFiles, 'upload2');
                }
              "
            >
              <el-button :disabled="fileList2.length>0" :icon="Upload" size="default">上传图片</el-button>
            </el-upload>
          </el-form-item></el-col
        >
        <el-col :span="8">
          <el-form-item label="运营证有效期" prop="tradingCardTime">
            <el-date-picker
              v-model="form.tradingCardTime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择运营证有效期"
              size="default"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
      </el-row>
    </div>
    <div class="operate">
      <el-button @click="cancellation" size="default">取消</el-button>
      <el-button :disabled="!state.submitRecord" type="primary" @click="submitForm(ruleFormRef)" size="default"
        >确定</el-button
      >
    </div>
  </el-form>
  <ImageModel ref="image" :options="options"></ImageModel>
</template>
<script setup lang="ts">
import { ref, defineEmits, reactive, onMounted } from "vue";
import { ElMessage, genFileId } from "element-plus";
import type {
  UploadProps,
  UploadUserFile,
  FormRules,
  FormInstance,
  UploadInstance,
  UploadRawFile,
  UploadFile
} from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { useUserStoreHook } from "@/store/modules/user";
import {
  getOptions,
  sanitation,
  depreciationCard,
  putSanitation,
} from "@/api/vehicleInfo";
import { State, SanitationForm } from "@/api/vehicleInfo/types";
import { dictionary } from "@/store/modules/dictionary";
import { Options } from "@/api/secure/types";
import ImageModel from "@/views/vehicle/safety/components/imageModel.vue";

const options: Options = reactive({
  dialogBorder: false,
  fileSrc: "",
  title: "",
});
const image = ref();
const fileRemove = (file: UploadFile, ref: any) => {
  console.log(file);
  image.value?.setDeleteFiles(file);
};
const fileSError = (response: any) => {
  ElMessage.error(response);
};
const filePreview = (fileList: UploadFile) => {
  options.dialogBorder = true;
  options.fileSrc = fileList.url;
  options.title = fileList.name;
};
const form = reactive<SanitationForm>({
  id: undefined,
  card: undefined,
  brand: "",
  ownership: "",
  ownershipCode: undefined,
  sanitationType: "",
  sanitationTypeCode: undefined,
  powerType: "",
  powerTypeCode: undefined,
  vin: undefined,
  fuelCode: undefined,
  drivingCardFile: "",
  drivingCardTime: undefined,
  drivingCardFileName: "",
  tradingCardFile: "",
  tradingCardTime: undefined,
  tradingCardFileName: "",
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
const rules = reactive<FormRules<SanitationForm>>({
  card: [
    {
      required: true,
      message: "请输入车牌号码",
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
  powerTypeCode: [
    {
      required: true,
      message: "请选择动力类型",
      trigger: "change",
    },
  ],
  sanitationTypeCode: [
    {
      required: true,
      message: "请选择环卫车类型",
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
  vin: [
    {
      required: true,
      message: "请输入车架号",
      trigger: "change",
    },
  ],
  drivingCardFile: [
    {
      required: true,
      message: "请上传行驶证附件",
      trigger: "change",
    },
  ],
  drivingCardTime: [
    {
      required: true,
      message: "请选择行驶证有效期",
      trigger: "change",
    },
  ],
  tradingCardFile: [
    {
      required: true,
      message: "请上传营运证件附件",
      trigger: "change",
    },
  ],
  tradingCardTime: [
    {
      required: true,
      message: "请选择营运证件有效期",
      trigger: "change",
    },
  ],
});
const setDictionary: any = dictionary();
const props = defineProps<Props>();
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
    await getCard(props.editFrom.card);
    Object.assign(form, props.editFrom);
    state.edit = true;
    fileList1.value = [
      {
        name: form.drivingCardFileName,
        url: form.drivingCardFile,
      },
    ];
    fileList2.value = [
      {
        name: form.tradingCardFileName,
        url: form.tradingCardFile,
      },
    ];
  }
  state.loading = false;
};
interface Props {
  editFrom: SanitationForm;
}
const getCard = async (card: string | undefined) => {
  const { data } = await depreciationCard(card);
  try {
    if (data) {
      Object.assign(form, data);
    }
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

const state = reactive<State>({
  edit: false,
  loading: false,
  business: [],
  ownership: [],
  submitRecord:false
});
const getOption = async (type: string) => {
  const { data } = await getOptions(type);
  data.map((n: { label: string; value: Number }) => {
    n.value = Number(n.value);
  });
  state[type] = data;
};
const API = ref(import.meta.env.VITE_APP_BASE_API);
const emit = defineEmits(["cancellation"]);
const cancellation = () => {
  emit("cancellation");
};
const selectLabel = (val: number | string, label: any) => {
  form[label] = setDictionary.state[label].filter(
    (n: { label: string; value: Number }) => n.value === val
  )[0].label;
};
const userStore = useUserStoreHook();
const setHeaders = ref({
  Authorization: userStore.token,
});
const ruleFormRef = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      state.edit ? editPuttractor() : getVehicleTractor();
    } else {
      console.log("error submit!", fields);
    }
  });
};
const getVehicleTractor = async () => {
  try {
    const { data } = await sanitation(form);
    ElMessage.success("新增成功");
    emit("cancellation");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const editPuttractor = async () => {
  try {
    const { data } = await putSanitation(form, props.editFrom.id);
    ElMessage.success("修改成功");
    emit("cancellation");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const fileList1 = ref<UploadUserFile[]>([]);
console.log(fileList1);
const fileList2 = ref<UploadUserFile[]>([]);
const fileSuccess = (file: any, uploadFiles: any, val: string) => {
  form[val + "Name"] = uploadFiles.name;
  form[val] = file.data.url;
};
const upload1 = ref<UploadInstance>();
const upload2 = ref<UploadInstance>();
const handleExceed: UploadProps["onExceed"] = (
  files: any,
  uploadFiles: any,
  val: string
) => {
  let upload = val === "upload1" ? upload1 : upload2;
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  upload.value!.submit();
};
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
