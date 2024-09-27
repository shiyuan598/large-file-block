<template>
  <el-table :data="props.stationForms" style="width: 100%">
    <el-table-column prop="stationType" label="路线">
      <template #default="scope">
        {{ filterRoute(scope.$index, scope.row.stationType) }}
      </template>
    </el-table-column>
    <el-table-column prop="" label="地点名称"
      ><template #default="scope">
        <el-select
          v-model="scope.row.station"
          filterable
          style="width: 100%"
          placeholder="请选择起运地点"
          @change="
            (value) => {
              changeselect(value, scope.row);
            }
          "
        >
          <el-option
            v-for="item in location"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select> </template
    ></el-table-column>
    <el-table-column prop="" label="到达时间">
      <template #default="scope">
        <el-date-picker
          v-if="scope.row.stationType !== 0"
          v-model="scope.row.arriveTime"
          type="datetime"
          placeholder="到达时间"
          size="default"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"

          style="width: 100%"
        />
        <span v-else>--</span>
      </template></el-table-column
    >
    <el-table-column prop="" label="发车时间">
      <template #default="scope">
        <el-date-picker
          v-if="scope.row.stationType !== 9"
          v-model="scope.row.leaveTime"
          type="datetime"
          placeholder="发车时间"
          size="default"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"

          style="width: 100%"
        />
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column prop="downMileage" label="里程数">
      <template #default="scope">
        <el-input v-model="scope.row.downMileage" placeholder="请输入里程数">
            <template #append>KM</template>
          </el-input>
        <!-- <el-form-item  :rules="rules.downMileage" label-width="0" :prop="scope.row.downMileage"> </el-form-item> -->
      </template>
    </el-table-column>
    <el-table-column prop="" label="状态">
      <template #default="scope">
        <el-select
          v-model="scope.row.status"
          style="width: 100%"
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="url" label="里程表图片">
      <template #default="scope">
        <el-upload
          class="upload-demo"
          ref="getDom"
          v-model="scope.row.downMileageFile"
          :headers="setHeaders"
          :action="API + '/api/v1/files'"
          :file-list="[
            {
              name: scope.row.downMileageFileName,
              url: scope.row.downMileageFile,
            },
          ]"
          :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
          :on-remove="(uploadFile:UploadFile, uploadFiles: UploadFiles)=>{
                    fileRemove(uploadFile,uploadFiles,scope.row)
                  }"
          :on-error="(response: any)=>{fileSError(response)}"
          :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles,scope.row);
                }"
        >
          <el-button v-show="!scope.row.downMileageFile" size="default"
            ><el-icon><Upload /></el-icon
          ></el-button>
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column prop="action" label="操作">
      <template #default="scope">
        <el-popconfirm
        
          title="确定要删除吗?"
          @confirm="handleDelete(scope.$index, scope.row)"
        >
          <template #reference>
             <el-button key="text" v-if="scope.row.stationType !== 0 && scope.row.stationType !== 9" type="text">删除</el-button>
          </template>
        </el-popconfirm>
       
      </template>
    </el-table-column>
  </el-table>
  <el-button :disabled="props.stationForms.length===7" class="mt-4 tableAdd" style="width: 100%" @click="onAddItem"
    ><el-icon><Plus /></el-icon>&nbsp;添加经停点({{props.stationForms.length-2}}/5)</el-button
  >

  <ImageModel ref="image" :options="state"></ImageModel>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, defineExpose } from "vue";
import type { UploadFile, UploadFiles } from "element-plus";
import { Upload, Plus } from "@element-plus/icons-vue";
import ImageModel from "@/views/vehicle/safety/components/imageModel.vue";
import { NewState, StationForms, Options} from "@/api/depreciation/types";
import { useUserStoreHook } from "@/store/modules/user";
import { locationStation ,getStationList} from "@/api/depreciation";
import { debounce } from "lodash-es";
const props = defineProps<{ state: any; stationForms: StationForms[],projectCode:number | undefined}>();
const state = reactive<NewState>({
  title: "",
  fileSrc: "",
  dialogBorder: false,
  selectloading: false,
});
// {
//     stationType: "起点",
//     station: 0,
//     arriveTime: "2006-1-11 14:11:59",
//     leaveTime: "2023-1-11 14:11:59",
//     downMileage: 70,
//     status: 0,
//     downMileageFileName: "element-plus-logo.svg",
//     downMileageFile: "/20231221/51833b9941284b4a8b8b1ca80ea54125.png",
//   }
onMounted(() => {
  // Object.assign(props.stationForms, tableData.value);
});
const userStore = useUserStoreHook();
const API = ref(import.meta.env.VITE_APP_BASE_API);
const setHeaders = ref({
  Authorization: userStore.token,
});
const startCodeOptions: any = ref([]);
const remoteMethod = debounce(async (query: string, item: any) => {
  if (query) {
    state.selectloading = true;
    try {
      const { data } = await locationStation({ keywords: query });
      startCodeOptions.value = data;
      state.selectloading = false;
    } catch (e: any) {
      state.selectloading = false;
      ElMessage.error(e.message);
    }
  }
}, 1000);

// 地点列表
const location: any = ref([]);
// 地点请求
const stationList = async (val: number | undefined) => {
  try {
    const { data } = await getStationList({ projectCode: val });
    location.value = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const changeselect = (val: string, row: any) => {
  const obj = location.value.filter((n: any) => n.name === val);
  row.stationCode = obj[0]?.id;
};
const statusOptions = [
  {
    label: "已发车",
    value: 2,
  },
  {
    label: "已到达",
    value: 1,
  },
  {
    label: "未到达",
    value: 0,
  },
];
const image = ref();
const fileRemove = (file: UploadFile, UploadFiles: UploadFiles, row: any) => {
  row.downMileageFileName = null;
  row.downMileageFile = null;
  image.value?.setDeleteFilesUrl(file.url);
};
const filePreview = (fileList: UploadFile) => {
  state.dialogBorder = true;
  state.fileSrc = fileList.url;
  state.title = fileList.name;
};
const fileSError = (response: any) => {
  ElMessage.error(response);
};
const fileSuccess = (file: any, uploadFiles: any, row: any) => {
  row.downMileageFileName = uploadFiles.name;
  row.downMileageFile = file.data.url;
};
const handleDelete = (index: number, row: any) => {
  props.stationForms.splice(index, 1);
};
const onAddItem = () => {
  props.stationForms.splice(-1, 0, {
    stationType: undefined,
    station: "",
    stationCode: undefined,
    arriveTime: "",
    leaveTime: "",
    downMileage: undefined,
    status: undefined,
    downMileageFileName: "",
    downMileageFile: "",
  });
};
const filterRoute = (index: number, type: number) => {
  let length = type ? type : index;
  return type === 0 ? "起点" : type === 9 ? "终点" : "经停点" + length;
};
const rules = {
  downMileage: [{ required: true, message: "请选择业务场景", trigger: "blur" }],
}
defineExpose({
  stationList
})
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
    width: 100%;
  }
}
.upload-demo {
  :deep(.el-upload-list__item.is-success:focus:not(:hover)) {
    display: none !important;
  }
  :deep(.el-upload-list__item-name .el-icon) {
    display: none;
  }
}
.tableAdd {
  border-style: dashed;
}
</style>
