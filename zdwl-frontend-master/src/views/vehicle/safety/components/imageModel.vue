<template>
  <div v-if="props.options.dialogBorder">
    <el-image-viewer
    @close="cancellation"
    :initial-index="0"
    
    :url-list="[API + props.options.fileSrc]"
  ></el-image-viewer>
  <a class="view imageView"  download :href="API + options.fileSrc">
    <el-button circle>
      <el-icon><Download /></el-icon> </el-button
  ></a>
  </div>
</template>
<script lang="ts" setup>
import type { UploadFile } from "element-plus";
import { Download } from "@element-plus/icons-vue";
// import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { defineProps, defineExpose } from "vue";
import { deleteFiles } from "@/api/secure";
const API = import.meta.env.VITE_FILE_HOME + import.meta.env.VITE_FILE_API;
const props = defineProps<{ options: any }>();
const cancellation = () => {
  props.options.dialogBorder = false;
};
const setDeleteFiles = async (file: any) => {
  const { data } = await deleteFiles({ filePath: file.response.data.url });
};
const setDeleteFilesUrl = async (url: any) => {
  const { data } = await deleteFiles({ filePath: url });
};
defineExpose({
  setDeleteFiles,
  setDeleteFilesUrl,
});
</script>
<style scoped lang="scss">
.fileImg {
  width: 100%;
  height: 400px;
}

.aline-right {
  text-align: right;
}
.imageView {
  position: absolute;
  z-index: 9999;
  bottom: 30px;
  right: 30px;
}
</style>
