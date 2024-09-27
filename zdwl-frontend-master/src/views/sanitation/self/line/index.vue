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
          ><span style="color: #303030">线路管理</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi">
      <el-col class="mt-2" :span="10">
        <span class="mr-8 text-color">车牌号码</span>
        <el-input
          v-model="queryParams.routeName"
          size="default"
          style="width: 272px"
          placeholder="请输入车牌号码"
          :suffix-icon="Search"
          @input="inputClick"
        />
      </el-col>
      <el-row class="mt-6">
       
        <el-button type="primary" @click="newBuilt">新建</el-button>
        <el-popconfirm title="确定要删除吗?" @confirm="issuanceOrder('batch')">
          <template #reference>
            <!-- <el-button key="text" type="text">删除</el-button> -->
            <el-button size="default">删除</el-button>
          </template>
        </el-popconfirm>
      </el-row>
      <el-table
        v-loading="state.loading"
        :max-height="height - 150"
        :data="dataList"
        style="width: 100%; margin-top: 16px"
        @selection-change="handleSelectionChange"
        size="large"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uuid" label="线路编号" />
        <el-table-column prop="routeName" label="线路名称" />
        <el-table-column prop="" label="起/终点" >
          <template #default="scope">
            <span @click="mapClick(scope.row)" class="start-end">{{ scope.row.start }}-{{ scope.row.end }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="length" label="长度(m)" />
        <el-table-column prop="width" label="宽度(m)" />
        <el-table-column prop="area" label="面积(m²)" />
        <el-table-column prop="maxSpeed" label="最高限速(km/h)" />
        <el-table-column prop="level" label="等级" />
        <el-table-column prop="action" label="操作">
          <template #default="scope">
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
      v-model="state.dialogVisible"
      :close-on-click-modal="false"
      @close="cancelClick"
      class="newDialogClass"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">{{state.dialogTitle}}线路</div>
      </template>
      <el-form
        :model="newForm"
        :rules="newRules"
        label-position="left"
        label-width="94px"
        ref="newFormRef"
        class="newFormClass"
        :show-message="false"
      >
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="线路名称" prop="routeName">
              <el-input
                v-model="newForm.routeName"
                placeholder="请输入线路名称"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col class="mb-1" :span="12">
            <el-row>
              <el-col :span="15">
                <el-form-item label="起/终点" prop="start">
                  <el-input v-model="newForm.start" placeholder="请输入起点">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="line-height: 32px" class="center">
                -
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="0px" label="" prop="end">
                  <el-input v-model="newForm.end" placeholder="请输入终点">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col class="mb-1" :span="12">
            <el-form-item label="线路长度" prop="length">
              <el-input v-model="newForm.length" placeholder="请输入线路长度">
                <template #append>M</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线路宽度" prop="width">
              <el-input v-model="newForm.width" placeholder="请输入线路宽度">
                <template #append>M</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="mb-1" :span="12">
            <el-form-item label="线路面积" prop="area">
              <el-input v-model="newForm.area" placeholder="请输入线路面积">
                <template #append>M²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高限速" prop="maxSpeed">
              <el-input v-model="newForm.maxSpeed" placeholder="请输入最高限速">
                <template #append>km/h</template>
              </el-input>
            </el-form-item>
          </el-col>
        
          <el-col :span="12">
            <el-form-item label="线路等级" prop="level">
              <el-input
                v-model="newForm.level"
                placeholder="请输入线路等级"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路径编号" prop="uuid">
              <el-input
                v-model="newForm.uuid"
                placeholder="请输入路径编号"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高精度地图" prop="file">
              <el-upload
                ref="upload"
                style="width: 100%"
                v-model:file-list="fileList"
                v-model="newForm.file"
                :headers="setHeaders"
                class="upload-demo mb-1"
                :action="API + '/api/v1/files'"
                multiple
                :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
                :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload)
                  }"
                :on-error="(response: any)=>{fileSError(response)}"
                :limit="1"
                :on-exceed="
                (files :any, uploadFiles:any) => {
                  handleExceed(files, uploadFiles);
                }
              "
                :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles);
                }"
              >
                <el-button
                  :disabled="fileList.length > 0"
                  :icon="Upload"
                  size="default"
                  >上传json文件</el-button
                >
              </el-upload>
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
    <el-dialog v-model="state.lineMapVisible" class="newDialogClass map-dialog">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">历史轨迹</div>
      </template>
      <lineMap v-if="state.lineMapVisible" :gpsList="gpsList" :mapListType="'line'" ref="lineMapRef"></lineMap>
      <div class="map-position">
        <el-icon @click="mapZoomIn" class="cursor-pointer"><ZoomIn /></el-icon>
        <el-icon @click="mapZoomOut" class="cursor-pointer"
          ><ZoomOut
        /></el-icon>
        <a class="view" download :href="state.fileSrc">
          <el-icon class="cursor-pointer"><Download /></el-icon></a
        >
        
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import { debounce, cloneDeep } from "lodash-es";
import { useElementSize } from "@vueuse/core";
import { Search } from "@element-plus/icons-vue";
import { Upload, ZoomIn, ZoomOut, Download } from "@element-plus/icons-vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, genFileId } from "element-plus";
import type {
  UploadFile,
  UploadUserFile,
  UploadInstance,
  UploadRawFile,
  FormInstance,
} from "element-plus";
import { routePage, newRoute, editRoute, gpsRoute } from "@/api/sanitation/index";
import { RoutePage, NewRoute } from "@/api/sanitation/type";
import { deleteFiles } from "@/api/secure";
import { deleteTractor } from "@/api/vehicleInfo";
import lineMap from "./map2.vue";
const vehi = ref();
const { height } = useElementSize(vehi);
const FILEAPI = ref(import.meta.env.VITE_FILE_API);
const state = reactive({
  loading: false,
  total: 0,
  dialogVisible: false,
  getDisabled: true,
  lineMapVisible: false,
  dialogTitle: '新增',
  src: import.meta.env.VITE_FILE_HOME + FILEAPI.value,
  fileSrc: ''
});
const queryParams = ref<RoutePage>({
  pageNum: 1,
  pageSize: 10,
  routeName: "",
});
const dataList = ref([]);
const newForm = ref<NewRoute>({
  routeName: "",
  start: "",
  end: "",
  length: undefined,
  width: undefined,
  area: undefined,
  maxSpeed: undefined,
  file: undefined,
  fileName: "",
  level: "",
  uuid: ""
});
const resetForm = cloneDeep(newForm);

const newRules = reactive({
  routeName: [{ required: true, message: "请输入线路名称", trigger: "blur" }],
  start: [{ required: true, message: "请输入起点", trigger: "blur" }],
  end: [{ required: true, message: "请输入终点", trigger: "blur" }],
  length: [{ required: true, message: "请输入长度", trigger: "blur" }],
  width: [{ required: true, message: "请输入宽度", trigger: "blur" }],
  area: [{ required: true, message: "请输入面积", trigger: "blur" }],
  maxSpeed: [{ required: true, message: "请输入最高限速", trigger: "blur" }],
  file: [{ required: true, message: "请上传高精度地图", trigger: "blur" }],
  level: [{ required: true, message: "请输入线路等级", trigger: "blur" }],
  uuid: [{ required: true, message: "请输入线路编号", trigger: "blur" }],
});
const inputClick = debounce(() => {
  getStatList();
}, 1500);
const newFormRef = ref<FormInstance>();
watch(
  [() => newForm.value],
  async ([newValue]) => {
    await nextTick()
    watchRules(newFormRef.value);
  },
  {
    deep: true,
  }
);

const watchRules = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    console.log(valid, fields)
    state.getDisabled = !valid;
  });
};
onMounted(() => {
  getStatList();
});

const getStatList = async () => {
  state.loading = true;
  const { data } = await routePage(queryParams.value);
  try {
    dataList.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    state.loading = false;
    ElMessage(e.message);
  }
};
const newBuilt = () => {
  state.dialogVisible = true;
  state.dialogTitle = '新增'
};
const multipleSelection = ref([]);
  const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
const issuanceOrder = (value: string) => {
  const arr = Array.from(multipleSelection.value, (item: any) => item.id).join(
    ","
  );
  handleDelete(arr);
};

const editClick = async(index: number, row: any) => {
  state.dialogVisible = true;
  state.dialogTitle = '编辑'
  await nextTick();
  Object.assign(newForm.value,row);
  fileList.value = [
    {
      name: row.fileName,
      url: row.file,
    },
  ]
};

// 批量删除与单个删除
const handleDelete = async (ids: any) => {
  await deleteTractor(ids, "/api/v1/ems/route/");
  getStatList();
};
const handleQuery = () => {
  getStatList();
};
const handleSizeChange = (value: number) => {
  queryParams.value.pageSize = value;
  getStatList();
};
const handleCurrentChange = (value: number) => {
  queryParams.value.pageNum = value;
  getStatList();
};
const newRoutePost = async () => {
  try {
    const { data } = await newRoute(newForm.value);
    getStatList();
    state.dialogVisible = false;
    ElMessage.success("新增成功");
  } catch (e: any) {
    ElMessage(e.message);
  }
};
const editRoutePut = async () => {
  try {
    const { data } = await editRoute(newForm.value, newForm.value?.id);
    getStatList();
    state.dialogVisible = false;
    ElMessage.success("编辑成功");
  } catch (e: any) {
    ElMessage(e.message);
  }
};
const cancelClick = () => {
  state.dialogVisible = false;
  newFormRef.value?.resetFields();
  fileList.value = [];
  newForm.value.id = undefined;
  // newForm = resetForm;
  console.log(newForm.value)
};
const newFormClick = async () => {
  state.dialogTitle ==='新增'?newRoutePost():editRoutePut();
  
};

const fileList = ref<UploadUserFile[]>([]);
const upload = ref<UploadInstance>();
const API = ref(import.meta.env.VITE_APP_BASE_API);
const userStore = useUserStoreHook();
const setHeaders = ref({
  Authorization: userStore.token,
});

const filePreview = async (fileList: UploadFile) => {
  await nextTick();
  let url = state.src + fileList.url;
  console.log(url)
  let link = document.createElement("a");
  link.href = url;
  link.download = fileList.name;
  link.click();
  document.body.removeChild(link);
};
const fileRemove = (file: UploadFile, ref: any) => {
  setDeleteFiles();
};
const setDeleteFiles = async () => {
  const { data } = await deleteFiles({ filePath: newForm.value.file });
};
const fileSError = (response: any) => {
  ElMessage.error(response);
};

const handleExceed = (files: File[], uploadFiles: any) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  upload.value!.submit();
};
const fileSuccess = (file: any, uploadFiles: any) => {
  newForm.value.fileName = uploadFiles.name;
  newForm.value.file = file.data.url;
};
const gpsList = ref([]);
// 点击出现地图路径
const mapClick = async(row:any)=>{
  state.fileSrc = state.src + row.file;
  try{
    const { data } = await gpsRoute(row.id);
    const mapList:any = [];
    data.map((n:any)=>{
      mapList.push([n.lng02,n.lat02])
    })
    gpsList.value = mapList;
    state.lineMapVisible = true;
    // await nextTick()
    // lineMapRef.value.reloadMarker();
  }catch (e: any) {
    ElMessage(e.message);
  }
}
const lineMapRef = ref();
const mapZoomIn = () => {
  lineMapRef.value?.mapZoomIn();
};

const mapZoomOut = () => {
  lineMapRef.value?.mapZoomOut();
};
</script>
<style scoped lang="scss">
.set-height {
  height: calc(100% - 80px);
}
.text-color {
  color: #303030;
  font-size: 14px;
  font-weight: 600;
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
.map-position {
  width: 180px;
  height: 56px;
  line-height: 56px;
  background: rgb(77, 78, 82, 0.8);
  border-radius: 30px;
  position: absolute;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  color: #cccccc;
  font-size: 26px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
:deep(.map-dialog .el-dialog__body) {
  height: 540px;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
.start-end{
  color: #3270FF;
  cursor: pointer;
}
</style>
