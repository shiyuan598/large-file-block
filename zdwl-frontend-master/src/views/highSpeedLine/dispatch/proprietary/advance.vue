<template>
  <el-table :data="props.costProps" style="width: 100%">
    <el-table-column prop="" label="司机姓名">
      <template #default="scope">
        <el-select
          v-model="scope.row.upDriverCode"
          style="width: 100%"
          filterable
          placeholder="请选择司机姓名"
          @change="(value:number)=>{setName(value,scope.row)}"
        >
          <el-option
            v-for="item in props.driverOptionsProps"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="" label="费用日期">
      <template #default="scope">
        <el-date-picker
          v-model="scope.row.date"
          type="date"
          placeholder="费用日期"
          size="default"
          format="YYYY-MM-DD"
          style="width: 100%"
        /> </template
    ></el-table-column>
    <el-table-column prop="" label="费用类型">
      <template #default="scope">
        <el-select
          v-model="scope.row.typeCode"
          style="width: 100%"
          placeholder="请选择费用类型"
          @change="(value:number)=>typeChange(value,scope.row)"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="Number(item.value)"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="" label="费用地点"
      ><template #default="scope">
        <el-input
          v-model="scope.row.location"
          placeholder="费用地点"
        /> </template
    ></el-table-column>
    <el-table-column prop="" label="费用金额（元）"
      ><template #default="scope">
        <el-input
          v-model="scope.row.amount"
          placeholder="费用金额"
        /> </template
    ></el-table-column>

    <el-table-column prop="url" label="支付截图">
      <template #default="scope">
        <el-upload
          class="upload-demo"
          ref="getDom"
          :data-id="scope.row.id"
          :action="API + '/api/v1/files'"
          :headers="setHeaders"
          v-model="scope.row.file"
          :file-list="[{ name: scope.row.fileName, url: scope.row.file }]"
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
          <el-button v-show="!scope.row.file" size="default"
            ><el-icon><Upload /></el-icon
          ></el-button>
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column prop="" label="备注"
      ><template #default="scope">
        <el-input v-model="scope.row.remark" placeholder="备注" /> </template
    ></el-table-column>
    <el-table-column prop="action" label="操作">
      <template #default="scope">
        <el-popconfirm
          title="确定要删除吗?"
          @confirm="handleDelete(scope.$index, scope.row)"
        >
          <template #reference>
            <el-button @click.stop key="text" type="text">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-button
    :disabled="props.costProps?.length === 5"
    class="mt-4 tableAdd"
    style="width: 100%"
    @click="onAddItem"
    ><el-icon><Plus /></el-icon>&nbsp;添加垫付费信息({{
      props.costProps?.length
    }}/5)</el-button
  >

  <ImageModel ref="image" :options="state"></ImageModel>
</template>
<script setup lang="ts">
import type { UploadFile, UploadFiles } from "element-plus";
import { Upload, Plus } from "@element-plus/icons-vue";
import ImageModel from "@/views/vehicle/safety/components/imageModel.vue";
import { CostExpenseForms, Options } from "@/api/depreciation/types";
import { useUserStoreHook } from "@/store/modules/user";
import { getDictOptions } from "@/api/dict/index";
import { ref, reactive, onMounted } from "vue";
const props = defineProps<{
  state: any;
  costProps: CostExpenseForms[];
  driverOptionsProps: Options;
}>();

const typeOptions = ref([] as any[]);
// 司机垫付
const getTypeOptions = () => {
  getDictOptions("expense_type").then((rs) => {

    Object.assign(typeOptions.value, rs.data);
  });
};
onMounted(() => {
  getTypeOptions();
});
const state = reactive({
  title: "",
  fileSrc: "",
  dialogBorder: false,
});

const userStore = useUserStoreHook();
const API = ref(import.meta.env.VITE_APP_BASE_API);
const setHeaders = ref({
  Authorization: userStore.token,
});
const image = ref();
const fileRemove = (file: UploadFile, UploadFiles: UploadFiles, row: any) => {
  row.file = null;
  row.fileName = null;
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
  row.fileName = uploadFiles.name;
  row.file = file.data.url;
};
const handleDelete = (index: number, row: any) => {
  props.costProps.splice(index, 1);
};
const setName = (value: number, row: any) => {
  let obj = props.driverOptionsProps.filter((n: any) => n.value === value);
  row.upDriver = obj[0].label;
  row.upDriverPhone = obj[0].phone;
};
const typeChange = (val:number,row:any)=>{
  row.type = typeOptions.value.filter((n:any)=>Number(n.value) === Number(val))[0]?.label;
}
const onAddItem = () => {
  props.costProps.push({
    upDriverCode: undefined,
    upDriver: "",
    date: "",
    type: "",
    typeCode: undefined,
    location: "",
    amount: undefined,
    fileName: "",
    file: "",
    remark: "",
  });
};
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
