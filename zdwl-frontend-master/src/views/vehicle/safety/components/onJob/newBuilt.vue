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
          <el-form-item label="安全员" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入安全员姓名"
            /> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="联系方式" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入联系方式"
            /> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="&nbsp;&nbsp;&nbsp;在职状态" prop="status">
            <el-radio-group text-color="#303030" v-model="form.status" class="ml-4">
              <el-radio :label="0" size="large">在职</el-radio>
              <el-radio :label="1" size="large">离职</el-radio>
            </el-radio-group>
          </el-form-item></el-col
        >
        <el-col :span="8"
          ><el-form-item label="&nbsp;&nbsp;&nbsp;签署状态" prop="signStatus">
            <el-radio-group v-model="form.signStatus" class="ml-4">
              <el-radio :label="1" size="large">签署</el-radio>
              <el-radio :label="0" size="large">未签署</el-radio>
            </el-radio-group>
          </el-form-item></el-col
        >
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
          ><el-form-item label="合作方式" prop="cooperationWayCode">
            <el-select
              v-model="form.cooperationWayCode"
              style="width: 100%"
              placeholder="请选择合作方式"
              @change="(val:number|string)=>selectLabel(val,'cooperationWay')"
            >
              <el-option
                v-for="item in setDictionary.state.cooperationWay"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="驾驶证类型" prop="driveCardTypeCode">
            <el-select
              v-model="form.driveCardTypeCode"
              style="width: 100%"
              placeholder="请选择驾驶证类型"
              @change="(val:number|string)=>selectLabel(val,'driveCardType')"
            >
              <el-option
                v-for="item in setDictionary.state.driveCardType"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="初次合作日期" prop="firstTime">
            <el-date-picker
              v-model="form.firstTime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择初次合作日期"
              size="default"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
        
        <el-col :span="8"
          ><el-form-item label="所属项目" prop="commonProject">
            <el-input
              v-model="form.commonProject"
              placeholder="请输入所属项目"
            /> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="收款银行" prop="payBank">
            <el-input
              v-model="form.payBank"
              placeholder="请输入收款银行"
            /> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="收款账号" prop="payAccount">
            <el-input
              v-model="form.payAccount"
              placeholder="请输入收款账号"
            /> </el-form-item
        ></el-col>
        <el-col :span="8"
          ><el-form-item label="&nbsp;&nbsp;&nbsp;收款姓名" prop="commonTractorCard">
            <el-input
              v-model="form.commonTractorCard"
              placeholder="请输入收款姓名"
            /> </el-form-item
        ></el-col>
    
        <el-col :span="8"
          ><el-form-item label="&nbsp;&nbsp;&nbsp;收款手机号" prop="commonRoute">
            <el-input
              v-model="form.commonRoute"
              placeholder="请输入收款手机号"
            /> </el-form-item
        ></el-col>
      </el-row>
      <div class="blod">证件管理</div>
      <el-row :gutter="80" class="mt-8">
        <el-col :span="8">
          <el-form-item label="身份证正面" prop="idCardFront">
            <el-upload
              ref="upload1"
              style="width: 100%"
              v-model:file-list="fileList1"
              :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
              :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload1)
                  }"
              :on-error="(response: any)=>{fileSError(response)}"
              v-model="form.idCardFront"
              :headers="setHeaders"
              class="upload-demo"
              :action="API + '/api/v1/files'"
              multiple
              :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles, 'idCardFront');
                }"
              :limit="1"
              :on-exceed="
                (files :any, uploadFiles:any) => {
                  handleExceed(files, uploadFiles, upload1);
                }
              "
            >
              <el-button :disabled="fileList1.length>0" :icon="Upload" size="default">上传图片</el-button>
            </el-upload>
          </el-form-item></el-col
        >
        <el-col :span="8">
          <el-form-item label="身份证反面" prop="idCardBack">
            <el-upload
              ref="upload2"
              style="width: 100%"
              v-model:file-list="fileList2"
              v-model="form.idCardBack"
              :headers="setHeaders"
              class="upload-demo"
              :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
              :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload2)
                  }"
              :on-error="(response: any)=>{fileSError(response)}"
              :action="API + '/api/v1/files'"
              multiple
              :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles, 'idCardBack');
                }"
              :limit="1"
              :on-exceed="
                (files :any, uploadFiles:any) => {
                  handleExceed(files, uploadFiles, upload2);
                }
              "
            >
              <el-button :disabled="fileList2.length>0" :icon="Upload" size="default">上传图片</el-button>
            </el-upload>
          </el-form-item></el-col
        >
        <el-col :span="8"
          ><el-form-item label="&nbsp;&nbsp;&nbsp;身份证号" prop="card">
            <el-input
              v-model="form.card"
              placeholder="请输入身份证号"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="从业资格证" prop="workCard">
            <el-upload
              ref="upload3"
              style="width: 100%"
              v-model:file-list="fileList3"
              v-model="form.workCard"
              :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
              :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload3)
                  }"
              :on-error="(response: any)=>{fileSError(response)}"
              :headers="setHeaders"
              class="upload-demo"
              :action="API + '/api/v1/files'"
              multiple
              :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles, 'workCard');
                }"
              :limit="1"
              :on-exceed="
                (files :any, uploadFiles:any) => {
                  handleExceed(files, uploadFiles, upload3);
                }
              "
            >
              <el-button :disabled="fileList3.length>0" :icon="Upload" size="default">上传图片</el-button>
            </el-upload>
          </el-form-item></el-col
        >
        <el-col :span="8"
          ><el-form-item label="资格证有效期" prop="jobTime">
            <el-date-picker
              v-model="form.jobTime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择从业资格证有效期"
              size="default"
              style="width: 100%"
            /> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item label="&nbsp;&nbsp;&nbsp;行驶证" prop="driveCard">
            <el-upload
              style="width: 100%"
              ref="upload4"
              v-model:file-list="fileList4"
              v-model="form.driveCard"
              :headers="setHeaders"
              :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
              :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload4)
                  }"
              :on-error="(response: any)=>{fileSError(response)}"
              class="upload-demo"
              :action="API + '/api/v1/files'"
              multiple
              :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles, 'driveCard');
                }"
              :limit="1"
              :on-exceed="
                (files :any, uploadFiles:any) => {
                  handleExceed(files, uploadFiles, upload4);
                }
              "
            >
              <el-button :disabled="fileList4.length>0" :icon="Upload" size="default">上传图片</el-button>
            </el-upload>
          </el-form-item></el-col
        >
        <el-col :span="8">
          <el-form-item label="行驶证有效期" prop="drivingTime">
            <el-date-picker
              v-model="form.drivingTime"
              type="date"
              placeholder="请选择行驶证有效期"
              size="default"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
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
import { ref,reactive,watch } from 'vue';
import type {
  UploadUserFile,
  UploadProps,
  UploadRawFile,
  UploadInstance,
  FormRules,
  FormInstance,
  UploadFile,
} from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { ElMessage, genFileId } from "element-plus";
import { OnJobForm } from "@/api/secure/types";
import { postDriver, putDriver } from "@/api/secure";
import { State } from "@/api/vehicleInfo/types";
import { dictionary } from "@/store/modules/dictionary";
import { useUserStoreHook } from "@/store/modules/user";
import { onMounted } from "vue";
import { Options } from "@/api/secure/types";
import ImageModel from "../imageModel.vue";

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
const state = reactive<State>({
  edit: false,
  loading: false,
  business: [],
  cooperationWay: [],
  submitRecord: false,
});
const form = reactive<OnJobForm>({
  name: "",
  phone: "",
  business: "",
  businessCode: undefined,
  cooperationWay: "",
  cooperationWayCode: undefined,
  driveCardType: "",
  driveCardTypeCode: undefined,
  firstTime: "",
  payBank:  "",
  payAccount: "",
  jobTime: "",
  drivingTime: "",
  commonTractorCard: "",
  commonProject: "",
  commonRoute: "",
  idCardFrontName: "",
  card: "",
  idCardFront: "",
  idCardBackName: "",
  idCardBack: "",
  workCardName: "",
  workCard: "",
  driveCardName: "",
  driveCard: "",
  status: 0,
  signStatus: 0,
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
const rules = reactive<FormRules<OnJobForm>>({
  name: [
    {
      required: true,
      message: "请输入安全员姓名",
      trigger: "change",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入联系方式",
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
  cooperationWayCode: [
    {
      required: true,
      message: "请选择合作方式",
      trigger: "change",
    },
  ],
  driveCardTypeCode: [
    {
      required: true,
      message: "请选择驾驶证类型",
      trigger: "change",
    },
  ],
  firstTime: [
    {
      required: true,
      message: "请选择初次合作日期",
      trigger: "change",
    },
  ],
  payBank: [
    {
      required: true,
      message: "请输入收款银行",
      trigger: "change",
    },
  ],
  payAccount: [
    {
      required: true,
      message: "请输入收款账号",
      trigger: "change",
    },
  ],
  // commonTractorCard: [
  //   {
  //     required: true,
  //     message: "请输入常用牵引车",
  //     trigger: "change",
  //   },
  // ],
  // commonProject: [
  //   {
  //     required: true,
  //     message: "请输入所属项目",
  //     trigger: "change",
  //   },
  // ],
  // commonRoute: [
  //   {
  //     required: true,
  //     message: "请输入运输线路",
  //     trigger: "change",
  //   },
  // ],
  // idCardFront: [
  //   {
  //     required: true,
  //     message: "请上传身份证正面",
  //     trigger: "change",
  //   },
  // ],
  // idCardBack: [
  //   {
  //     required: true,
  //     message: "请上传身份证反面",
  //     trigger: "change",
  //   },
  // ],
  // workCard: [
  //   {
  //     required: true,
  //     message: "请上传从业资格证",
  //     trigger: "change",
  //   },
  // ],
  jobTime: [
    {
      required: true,
      message: "请选择资格证有效期",
      trigger: "change",
    },
  ],
  // driveCard: [
  //   {
  //     required: true,
  //     message: "请上传行驶证",
  //     trigger: "change",
  //   },
  // ],
  drivingTime: [
    {
      required: true,
      message: "请选择行驶证有效期",
      trigger: "change",
    },
  ],
});

interface Props {
  editFrom: OnJobForm;
}
const props = defineProps<Props>();
const setDictionary: any = dictionary();
const selectLabel = (val: number | string, label: any) => {
  form[label] = setDictionary.state[label].filter(
    (n: { label: string; value: Number }) => n.value === val
  )[0].label;
  console.log(form);
};
const fileList1 = ref<UploadUserFile[]>([]);
const fileList2 = ref<UploadUserFile[]>([]);
const fileList3 = ref<UploadUserFile[]>([]);
const fileList4 = ref<UploadUserFile[]>([]);
const userStore = useUserStoreHook();
const API = ref(import.meta.env.VITE_APP_BASE_API);
const setHeaders = ref({
  Authorization: userStore.token,
});
const fileSuccess = (file: any, uploadFiles: any, val: string) => {
  form[val + "Name"] = uploadFiles.name;
  form[val] = file.data.url;
};
const upload1 = ref<UploadInstance>();
const upload2 = ref<UploadInstance>();
const upload3 = ref<UploadInstance>();
const upload4 = ref<UploadInstance>();
const handleExceed: UploadProps["onExceed"] = (
  files: File[],
  uploadFiles: UploadUserFile[],
  upload: any
) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  upload.value!.submit();
};

const emit = defineEmits(["cancellation"]);
const cancellation = () => {
  emit("cancellation");
};
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
    const { data } = await postDriver(form);
    ElMessage.success("新增成功");
    emit("cancellation");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const editPuttractor = async () => {
  try {
    const { data } = await putDriver(form, props.editFrom.id);
    ElMessage.success("修改成功");
    emit("cancellation");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const editForm = async () => {
  if (props.editFrom.id) {
    Object.assign(form, props.editFrom);
    console.log(form.idCardFront,form.idCardFrontName)
    state.edit = true;
    fileList1.value =form.idCardFront? [
      {
        name: form.idCardFrontName,
        url: form.idCardFront,
      },
    ]:[];
    fileList2.value =form.idCardBack? [
      {
        name: form.idCardBackName,
        url: form.idCardBack,
      },
    ]:[];
    fileList3.value =form.workCard? [
      {
        name: form.workCardName,
        url: form.workCard,
      },
    ]:[];
    fileList4.value = form.driveCard? [
      {
        name: form.driveCardName,
        url: form.driveCard,
      },
    ]:[];
  }
  state.loading = false;
};
onMounted(() => {
  state.loading = true;
  console.log(setDictionary.state.driveCardType)
  try {
    editForm();
  } catch (e: any) {
    state.loading = false;
    ElMessage.error(e.message);
  }
});
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
:deep(.el-form-item--default) {
  margin-bottom: 32px;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
:deep(.el-radio__input.is-checked+.el-radio__label){
  color: #303030;
  height: 30px;
}
</style>
