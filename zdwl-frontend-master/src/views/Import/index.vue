<template>
  <div class="app-container">
    <el-container>
      <!-- <el-header class="elHeader">
        <span class="titleHeader">当前位置：{{props.title}}
          <span style="padding:0 2px;">-</span>
          <span style="color:black;">导入</span>
        </span>
      </el-header> -->
      <el-main>
        <div v-if="!importFlg" v-loading="importLoading">
          <el-row :gutter="20" >
            <el-col :span="12" :offset="6">
              <div class="fileClass">
                <el-input v-model="fileName" class="fileInputClass" disabled/>
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  action="#"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-change="handleExcelChange"
                  :auto-upload="false"
                  :show-file-list="false"
                >
                  <template #trigger>
                    <el-button type="primary">选 择</el-button>
                  </template>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="12" :offset="6">
              <div class="tipsClass font14 paddingT16 fontClass">
                <el-button type="primary" link class="fileBTClass" @click="templateClick">模板下载</el-button>
              </div>
            </el-col>
            <el-col :span="12" :offset="6" style="margin-top:8px;">
              <span style="color: lightgray;font-size: 14px;">支持导入总记录数300条以内，支持.xlsx格式的文件，大小不超过10M。</span>
            </el-col>
            <el-col :span="12" :offset="6" style="margin-top:32px;">
              <div class="tipsClass">
                <el-icon><Warning /></el-icon>
                <span class="font14 paddingL10 fontClass">选择文件后将自动上传并进行数据校验</span>
              </div>
            </el-col>
            <el-col :span="12" :offset="6" style="margin-top:32px;">
              <div class="importClass">
                <el-button plain @click="cancelClick">取消</el-button>
                <el-button type="primary" plain @click="importClick" :disabled="fileName=='' && !importFlg">导入数据</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="importFlg">
          <div style="display: grid;justify-content: center;padding-top: 10%;text-align: center;">
            <div>
              <img :src="getImageUrl('import_done.png')" fit="fill" v-if="!importStatus"/>
              <img :src="getImageUrl('import_warning.png')" fit="fill" v-if="importStatus"/>
            </div>
            <h1 style="font-size: 24px;margin-top:10px;">导入完成</h1>
            <span style="font-size:12px;color: gray;">{{ msg }}</span>
            <div style="display: flex;padding-top: 30px;">
              <el-button type="primary" @click="returnList" >返回列表</el-button>
              <el-button plain @click="importFn" >继续导入</el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Warning } from '@element-plus/icons-vue'
import { UploadFile, UploadInstance, UploadProps, UploadRawFile,genFileId } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const props = defineProps({
  title: String,
  apiFn: Function,
  downFn: Function,
  downloadType: {
    type: String,
    default: ""
  }
})
const emit = defineEmits({
  'returnList': null,
});
const importLoading = ref(false)
const excelFile = ref<File>();
const excelFilelist = ref<File[]>([]);
const fileName = ref('')
const route = useRoute();
const router = useRouter();
const importFlg = ref(false);
const importImage = ref(null);
const upload =ref<UploadInstance>()
const msg = ref('')
const importStatus = ref(false)
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  fileName.value = file.name
}

const getImageUrl = (name: any) => {
  return new URL(`../../assets/images/${name}`, import.meta.url).href
}

const exportFn = (response: any) => {
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
  });
  const a = document.createElement("a");
  const href = window.URL.createObjectURL(blob); // 下载链接
  a.href = href;
  a.download = decodeURI(
    response.headers["content-disposition"].split(";")[1].split("=")[1]
  ); // 获取后台设置的文件名称
  document.body.appendChild(a);
  a.click(); // 点击下载
  document.body.removeChild(a); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}

const importClick = () => {
  if(excelFile.value){
    importLoading.value = true
    props.apiFn!(excelFile.value, props.downloadType==''?'':props.downloadType).then((response:any) => {
      //显示导入完成页面
      importFlg.value = true
      importLoading.value = false
      //导入完成信息
      msg.value = decodeURI(response.headers['x-message'])
      if(response.data.byteLength>0){
        importStatus.value = true
        //导出错误文件
        exportFn(response)
      }
    });
  }
}

const cancelClick = () => {

  emit('returnList')
}

const templateClick = () => {
  props.downFn!(props.downloadType==''?{}:{supplierType: props.downloadType}).then((response: any) => {
    exportFn(response)
  });
}

/**
 * Excel文件change事件
 *
 * @param file
 */
 function handleExcelChange(file: UploadFile) {
  if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
    ElMessage.warning("上传Excel只能为xlsx、xls格式");
    excelFile.value = undefined;
    excelFilelist.value = [];
    return false;
  }
  excelFile.value = file.raw;
  fileName.value = file.name
}

const returnList = () => {
  emit('returnList')
}

const importFn = () => {
  importFlg.value = false
  fileName.value = ''
}

onMounted(()=>{
})
</script>

<style lang="scss" scoped>
.elHeader {
  background-color: white;
  position: relative;
}
.titleHeader{
  font-size: 12px;
  color: rgb(181, 181, 181);
  position: absolute;
  top: 35%;
}
.fileClass{
  display: flex;
  padding-top: 80px;
}
.fileInputClass{
  width:524px;
}
.fileButtonClass{
  width: 76px;
}
.fileBTClass{
  font-size:14px;
  color:rgba(50, 112, 255, 1);
}
.verticalBarClass{
  padding: 0 10px; 
  color: lightgray;
}
.importClass{
  display: flex;
  justify-content: center;
  align-items:center;
}
.tipsClass{
  display: flex;
  justify-content: start;
  align-items:center;
}
.fontClass{
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #303030;
  line-height: 20px;
}
.font14{
  font-size: 14px;
}
.paddingL10{
  padding-left: 10px;
}
.paddingT16{
  padding-top: 16px;
}
:deep(.el-upload-list){
  margin: 0;
}

:deep(.app-main){
    background-color: white;
}
</style>
