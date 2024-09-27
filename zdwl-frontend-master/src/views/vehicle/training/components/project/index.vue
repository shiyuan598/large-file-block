<template>
  <div class="all-height">
    <Form
      :formModel="form"
      :fromList="list"
      @searchInput="searchInput"
      @onSubmit="onSubmit"
    >
      <template #formSlot>
        <el-col :span="8"></el-col>
        <el-col :span="8"></el-col>
      </template>
    </Form>
    <el-row>
      <el-button @click="newBuilt" type="primary" size="default"
        >新建</el-button
      >
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
      :max-height="height"
      @sort-change="sortChange"
      style="width: 100%; margin-top: 16px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column prop="fileName" :show-overflow-tooltip="true" label="附件">
        <template #default="scope">
          <span @click.stop="clickFile(scope.row)" class="text-color">{{
            scope.row.fileName
          }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="business" :show-overflow-tooltip="true" label="业务场景" />
      <el-table-column prop="startTime" width="206" sortable="custom" label="培训日期">
        <template #default="scope">
          {{ fileTime(scope.row.startTime) }} — {{ fileTime(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="learnNum" label="学习人数" />
      <el-table-column prop="unLearnNum" label="待学习人数" >
          <template #default="scope">
            <el-button key="text" @click.stop="rowClick(scope.row)" type="text">{{ scope.row.unLearnNum }}</el-button>
          </template>        
      </el-table-column>
      <el-table-column prop="" sortable="custom" label="状态">
        <template #default="scope">
          <span class="round" :class="'signStatusColor' + scope.row.status"></span
        >
          {{ fileStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="action" width="142" label="操作">
        <template #default="scope">
          <el-button
            @click.stop="releaseClick(scope.$index, scope.row)"
            v-if="scope.row.status === 0"
            key="text"
            type="text"
            >发布</el-button
          >
          <el-button
            @click.stop="editClick(scope.$index, scope.row)"
            v-if="scope.row.status === 0"
            key="text"
            type="text"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定要删除吗?"
            @confirm="rowelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button @click.stop key="text" type="text">删除</el-button>
            </template>
          </el-popconfirm>
        </template></el-table-column
      >
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
    <el-dialog
      :close-on-click-modal="false"

      v-model="state.dialogVisible"
      @close="closeDialog('file')"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div>{{ projecFormDialog.id ? "编辑" : "新建" }}项目</div>
        </div>
      </template>
      <div class="border"></div>
      <div class="dialog-content">
        <el-form
          :model="projecFormDialog"
          :rules="rulesProjecDialog"
          label-width="90px"
          v-loading="state.loading"
          ref="ruleFormRef"
          size="default"
          label-position="left"
          class="map-content"
        >
          <el-row :gutter="80" :align="'middle'">
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="projecFormDialog.projectName"
                  placeholder="请输入项目名称"
                /> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="附件" prop="file">
                <el-upload
                  ref="upload"
                  style="width: 100%"
                  v-model:file-list="fileList"
                  v-model="projecFormDialog.file"
                  :headers="setHeaders"
                  class="upload-demo"
                  :action="APIFile + '/api/v1/files'"
                  :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
                  :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile)
                  }"
                  :on-error="(response: any)=>{fileSError(response)}"
                  :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles, 'file');
                }"
                  :limit="1"
                  :on-exceed="
                (files :any, uploadFiles:any) => {
                  handleExceed(files, uploadFiles, upload);
                }
              "
                >
                  <el-button :disabled="fileList.length > 0" :icon="Upload" size="default">上传附件</el-button>
                </el-upload>
              </el-form-item></el-col
            >
          </el-row>
          <el-row :gutter="80" :align="'middle'">
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="项目时间" prop="time">
                <el-date-picker
                  v-model="projecFormDialog.time"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                /> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="业务场景" prop="businessList">
                <el-select
                  v-model="projecFormDialog.businessList"
                  style="width: 100%"
                  multiple
                  placeholder="请选择业务场景"
                  @change="(val:number|string)=>selectLabel(val,'business')"
                >
                  <el-option
                    v-for="item in setDictionary.state.business"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="aline-right">
        <el-button @click="cancellation('file')" size="default">取消</el-button>
        <el-button
          type="primary"
          :disabled="useForRecord"
          @click="submitForm(ruleFormRef)"
          size="default"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog v-model="state.dialogBorder" v-if="state.dialogBorder">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          {{ options.title }}
        </div>
      </template>
      <div class="border"></div>
      <VideoJs ref="videojs" :options="options"></VideoJs>
      <div class="aline-right mt-2">
        <el-button @click="cancellation" class="mr-4" size="default"
          >取消</el-button
        >
        <a class="view" download :href="options.fileSrc">
          <el-button type="primary" size="default"> 下载 </el-button></a
        >
      </div>
    </el-dialog>
    <el-dialog
      class="dialog-padding"
      v-model="state.dialogRelease"
      top="5vh"
      v-if="state.dialogRelease"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">视频发布</div>
      </template>
      <div class="border">
        <div class="releaseText">
          <el-icon class="iconStyle" color="#FFB608"><WarningFilled /></el-icon
          >请仔细检查培训课程内容，以防影响司机学习质量。如果发生错误需要撤回，会给领导发送邮件。
        </div>
        <el-descriptions :column="2" class="mt-7">
          <el-descriptions-item label="项目名称：">{{
            releaseRow.projectName
          }}</el-descriptions-item>
           <el-descriptions-item label="业务场景："
            >{{ releaseRow.business }}
          </el-descriptions-item>
          <el-descriptions-item label="培训时间："
            >{{ fileTime(releaseRow.startTime) }}-{{
              fileTime(releaseRow.endTime)
            }}</el-descriptions-item
          >
         
        </el-descriptions>
        
        <VideoJs ref="videojs" :options="options"></VideoJs>
        <div class="aline-right mt-6">
          <el-button @click="cancellation" size="default">取消</el-button>
          <el-button
            type="primary"
            :disabled="releaseDisplay"
            @click="releaseVideo"
            size="default"
            >发布<span v-if="number > 0">{{ number }}S</span></el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="state.waitVisible" width="70%">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div>待学习详情</div>
        </div>
      </template>
      <div class="border">
        <el-descriptions :column="2" class="mt-7">
          <el-descriptions-item label="项目名称：">{{
            releaseRowDetails.projectName
          }}</el-descriptions-item>
          <el-descriptions-item label="培训时间："
            >{{ fileTime(releaseRowDetails.startTime) }} ~
            {{ fileTime(releaseRowDetails.endTime) }}</el-descriptions-item
          >
          <el-descriptions-item label="待学习人数："
            >{{ releaseRowDetails.unLearnNum  }}人</el-descriptions-item
          >
        </el-descriptions>
        <div class="record mt-3">待学习人员</div>
        <Table
          :tableList="detailsList"
          :state="state"
          :tableData="detailsData"
          v-loading="resultParmes.loading"
        ></Table>
        <el-row class="pagination-style" justify="end">
          <el-pagination
            background
            layout="total, prev, pager, next, sizes, jumper"
            @size-change="releaseSizeChange"
            @current-change="releaseCurrentChange"
            :pager-count="5"
            :page-sizes="[10, 20, 30, 40, 100]"
            :total="resultParmes.total"
          />
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref, watch, nextTick, inject } from "vue";
import type {
  UploadUserFile,
  UploadProps,
  UploadRawFile,
  UploadInstance,
  FormInstance,
  UploadFile,
} from "element-plus";
import { ElMessage, genFileId } from "element-plus";
import { WarningFilled } from "@element-plus/icons-vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { projectForm, ProjecFormDialog, jobForm } from "@/api/secure/types";
import {
  driverPage,
  safeProject,
  projectPush,
  deleteFiles,
  editProject,
  resultPage,
} from "@/api/secure";
import { State, AssemblyForm, UseParmes } from "@/api/vehicleInfo/types";
import { deleteTractor } from "@/api/vehicleInfo";
import { dictionary } from "@/store/modules/dictionary";
import { useUserStoreHook } from "@/store/modules/user";
import Table from "@/views/vehicle/managers/vehicleInfo/table.vue";
import VideoJs from "../videoJs.vue";
const height: any = inject("height");
const APIFile = ref(import.meta.env.VITE_APP_BASE_API);
const API = ref(import.meta.env.VITE_FILE_API);
const options = reactive({
  src: import.meta.env.VITE_FILE_HOME + API.value,
  title: "",
  videoId: "videoId",
  fileSrc: "",
  status: false,
});

const porps = defineProps<{ driverType: any }>();
const form = reactive<projectForm>({
  keywords: "",
  business: "",
  businessArr: [],
  startTime: "",
  endTime: "",
  startTimeSort: "desc",
  picker: [],
  pageNum: 1,
  pageSize: 10,
});
let projecFormDialog = reactive<ProjecFormDialog>({
  projectName: "",
  file: undefined,
  fileName: "",
  startTime: "",
  endTime: "",
  business: "",
  businessCodes: "",
  businessList: [],
  time: [],
  id: "",
});
const useForRecord = computed(
  () =>
  projecFormDialog.projectName == "" ||
    projecFormDialog.file == undefined ||
    projecFormDialog.time?.length==0 ||
    projecFormDialog.businessList?.length==0   
);

const state = reactive<State>({
  button: false,
  optionHideen: true,
  loading: false,
  dialogVisible: false,
  dialogBorder: false,
  dialogRelease: false,
  waitVisible: false,
  total: 0,
});

const rulesProjecDialog = reactive({
  projectName: [
    {
      required: true,
      message: "请输入项目名称",
      trigger: "change",
    },
  ],
  file: [
    {
      required: true,
      message: "请选择文件",
      trigger: "change",
    },
  ],
  time: [
    {
      required: true,
      message: "请选择日期",
      trigger: "change",
    },
  ],
  businessList: [
    {
      required: true,
      message: "请选择业务场景",
      trigger: "change",
    },
  ],
});
watch(
  () => porps.driverType,
  (val) => {
    form.driverType = val;
    getStatList();
  }
);
const tableData = ref([]);
const fileList = ref<UploadUserFile[]>([]);
const upload = ref<UploadInstance>();
const userStore = useUserStoreHook();

const setHeaders = ref({
  Authorization: userStore.token,
});
const sortChange = (column: any) => {
  form.startTimeSort = column.order === "descending" ? "asc" : "desc";
  getStatList();
};
const selectLabel = (val: any | string, label: any) => {
  let list: any = [];
  val.map((n: number) => {
    list.push(
      setDictionary.state.business.filter(
        (i: { label: string; value: Number }) => i.value === n
      )[0].label
    );
  });
  projecFormDialog.business = list.join(",");
};
const filePreview = async (fileList: UploadFile) => {
  state.dialogBorder = true;
  await nextTick();
  options.fileSrc = options.src + fileList.url;
  options.title = fileList.name;
  videojs.value?.play();
};
const fileRemove = (file: UploadFile) => {
  setDeleteFiles();
};
const fileSError = (response: any) => {
  ElMessage.error(response);
};
const fileSuccess = (file: any, uploadFiles: any, val: string) => {
  projecFormDialog.fileName = uploadFiles.name;
  projecFormDialog.file = file.data.url;
  options.status = true;
};
const handleExceed = (
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

const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const submitSafeProject = async (parms: ProjecFormDialog) => {
  try {
    const { data } = await safeProject(parms);
    state.useVisible = false;
    getStatList();
    // ElMessage.success("领用成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const submitEditProject = async (parmes: ProjecFormDialog, id: string) => {
  try {
    const { data } = await editProject(parmes, id);

    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const parms = {
        projectName: projecFormDialog.projectName,
        businessCodes: projecFormDialog.businessList.join(","),
        fileName: projecFormDialog.fileName,
        file: projecFormDialog.file,
        startTime: projecFormDialog.time[0],
        endTime: projecFormDialog.time[1],
        business: projecFormDialog.business,
        id: projecFormDialog.id,
      };
      projecFormDialog.id
        ? submitEditProject(parms, projecFormDialog.id)
        : submitSafeProject(parms);
      state.dialogVisible = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};
const fileStatus = (sign: string | number) => {
  let signArray = ["未发布", "已发布"];
  return signArray[sign];
};
// 分页列表查询
const getStatList = async () => {
  let parmes = {
    startTime: form.picker && form.picker[0],
    endTime: form.picker && form.picker[1],
    keywords: form.keywords,
    business: form.businessArr?.join(","),
    pageNum: form.pageNum,
    pageSize: form.pageSize,
    startTimeSort: form.startTimeSort,
  };
  // delete form.businessArr
  state.loading = true;
  const { data } = await driverPage(parmes, "/api/v1/safe/project/page");
  try {
    tableData.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage(e.message);
    state.loading = false;
  }
};
const emit = defineEmits(["newBuilt", "clickImport"]);
const ruleFormRef = ref<FormInstance>();
const closeDialog = (val: string) => {
  ruleFormRef.value?.resetFields();
  fileList.value = [];
};
// 修改
const editClick = async (index: any, row: any) => {
  options.status = false;
  state.dialogVisible = true;
  await nextTick();
  Object.assign(projecFormDialog, row);
  fileList.value = [
    {
      name: row.fileName,
      url: row.file,
    },
  ];
  projecFormDialog.time = [row.startTime, row.endTime];

  projecFormDialog.businessList = row.businessCodes.split(",").map(Number);
};
// 查询
const onSubmit = () => {
  getStatList();
};
// 删除
const handleDelete = async (index: any, ids: any) => {
  await deleteTractor(ids, "/api/v1/safe/project/");
  getStatList();
};
const rowelete = (index: number, row: any) => {
  let partId = row.partId ? row.id : null;
  handleDelete(partId, row.id);
};
interface User {
  date: string;
  name: string;
  address: string;
}

const multipleSelection = ref<User[]>([]);
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
const batchVehicle = () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  handleDelete(null, arr);
};
const setDictionary: any = dictionary();
// 发布
const releaseRow = ref();
const releaseDisplay = ref(true);
let number = ref(3);
const releaseClick = async (index: number, row: any) => {
  number.value = 3;
  releaseDisplay.value = true;
  releaseRow.value = row;
  state.dialogRelease = true;
  await nextTick();
  options.fileSrc = options.src + row.file;
  videojs.value?.play("releaseId");
  const interval = setInterval(() => {
    if (number.value !== 0) {
      number.value--;
    } else {
      clearInterval(interval);
      releaseDisplay.value = false;
    }
  }, 1000);
};
const releaseVideo = async () => {
  const { data } = await projectPush(releaseRow.value.id);
  try {
    state.dialogRelease = false;
    ElMessage.success("发布成功");
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

// 查询form
let list: AssemblyForm[] = reactive([]);

const newBuilt = () => {
  options.status = false;
  state.dialogVisible = true;
};
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
const videojs = ref();
const clickFile = async (row: any) => {
  state.dialogBorder = true;
  await nextTick();
  options.fileSrc = options.src + row.file;
  options.title = row.fileName;
  videojs.value?.play("videoId");
};

const cancellation = (val: string) => {
  state.dialogVisible = false;
  state.dialogBorder = false;
  state.dialogRelease = false;
  if (val && options.status) {
    setDeleteFiles();
  }
};
const releaseRowDetails: any = ref();
const detailsData = ref([]);
const resultParmes: UseParmes = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  loading: false,
  result: 0,
  detailsData: releaseRowDetails.id,
  projectCode: null
});

const getResultPage = async () => {
  resultParmes.loading = true;
  
  const { data } = await resultPage(resultParmes);
  try {
    detailsData.value = data.list;
    resultParmes.total = data.total;
    resultParmes.loading = false;
  } catch (e: any) {
    resultParmes.loading = false;
    ElMessage(e.message);
  }
};

const releaseSizeChange = (value: number) => {
  resultParmes.pageSize = value;
  getResultPage();
};
const releaseCurrentChange = (value: number) => {
  resultParmes.pageNum = value;
  getResultPage();
};

// 行内点击事件

const rowClick = (row: any) => {
  state.waitVisible = true;
  releaseRowDetails.value = row;
  resultParmes.projectCode = row.id;
  getResultPage();
};
const setDeleteFiles = async () => {
  const { data } = await deleteFiles({ filePath: projecFormDialog.file });
};
const detailsList = [
  {
    width: "80",
    type: "index",
    label: "编号",
    prop: "",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "司机姓名",
    prop: "driver",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "业务场景",
    prop: "business",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "手机号码",
    prop: "phone",
    template: "",
  },
];
const setList = () => {
  Object.assign(list, [
    {
      type: "input",
      label: "项目名称",
      prop: "keywords",
      placeholder: "请输入项目名称",
    },
    {
      type: "select",
      label: "业务场景",
      prop: "businessArr",
      placeholder: "请选择业务场景",
      optionList: setDictionary.state.business,
      multiple: true,
    },
    {
      type: "picker",
      label: "培训日期",
      prop: "picker",
      placeholder: "请选择培训培训日期",
    },
  ]);
};
onMounted(async () => {
  await getStatList();
});
const searchInput = () => {
  getStatList();
};
defineExpose({
  getStatList,
  setList,
});
</script>

<style scoped lang="scss">
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
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
.dialog-content {
  // border-top: 1px solid #e4e4e4;
  background: rgba(220, 222, 224, 0.17);
  margin: 16px 0;
  padding: 24px 10px 6px;
}
.border {
  border-width: 0;
  display: block;
  border-top: 1px solid #e4e4e4;
}
:deep(.el-dialog__body) {
  padding-top: 0;
  padding-bottom: 50px;
}
.dialog-padding {
  .border {
    padding-bottom: 26px;
  }
}
.aline-right {
  text-align: right;
  float: right;
  padding-bottom: 16px;
}
.text-color {
  color: #409eff;
  cursor: pointer;
}
.releaseText {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: rgba(48, 48, 48, 0.88);
  background: #fffbe6;
  border: 1px solid #ffe5a8;
  margin-top: 8px;
  overflow: hidden;
}
.video-js {
  width: 100%;
  height: 500px;
  // :deep(.vjs-progress-control){
  //   height: 10px;
  //   width: 100%;
  //   bottom: 0;
  //   position: absolute;
  // }
}
:deep(.el-descriptions__label:not(.is-bordered-label)) {
  color: #8c8c8c;
}
:deep(.el-descriptions__content:not(.is-bordered-label)) {
  color: #303030;
}
:deep(
    .el-descriptions__body
      .el-descriptions__table:not(.is-bordered)
      .el-descriptions__cell
  ) {
  padding-bottom: 24px;
}
.iconStyle {
  margin: 12px;
  vertical-align: bottom;
}
.record {
  color: #323233;
  font-size: 14px;
  font-weight: 600;
}
.my-header {
  color: #303030;
  font-size: 16px;
  font-weight: 600;
}
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
    vertical-align: middle;
}
.signStatusColor0{
  background: #ff4d4f;
}
.signStatusColor1{
  background: #bbbbbb;
}
</style>
