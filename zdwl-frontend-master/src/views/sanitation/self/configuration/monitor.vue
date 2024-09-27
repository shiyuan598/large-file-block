<template>
  <div class="pane-content h-full" v-loading="state.configurationLoading">
    <!-- <Top></Top> -->
    <div class="map-content mt-24px">
      <template
        v-for="item in formProjectDialog?.cameraSetList"
        :key="item.index"
      >
        <div class="camera" v-if="filterShow(item.index)">
          <div class="text-center text-16px breadcrumb-color-is font-bold">
            {{ filterLabel(item.index) }}
            <div class="switch-po">
              <el-switch
                v-model="item.on"
                inline-prompt
                active-text="打开"
                inactive-text="关闭"
                @change="changeRtc(item.index)"
              />
            </div>
          </div>
          <div class="video mt-8px">
            <WebRtc :videoSrc="`${filterUrl(item.index)}`"></WebRtc>
          </div>
        </div>
      </template>
    </div>
    <!-- <Bottom></Bottom> -->
  </div>
</template>
<script setup lang="ts">
import WebRtc from "./components/webRtc.vue";
// import Top from "./top.vue";
import { reactive, inject, onMounted } from "vue";
import { InjectList } from "@/api/sanitation/type";
import { configQuery, configSet } from "@/api/sanitation";
const state = reactive({
  configurationLoading: false,
});
const formProjectDialog = reactive({});

const arr = [
  {
    index: "0",
    value: "正前摄像",
    rtcURL: "webrtc://122.193.28.107:1985/live/hwrd.0.h264",
    show: true,
  },
  {
    index: "1",
    value: "左侧摄像",
    rtcURL: "webrtc://122.193.28.107:1985/live/hwrd.1.h264",
    show: true,
  },
  {
    index: "2",
    value: "右侧摄像",
    rtcURL: "webrtc://122.193.28.107:1985/live/hwrd.3.h264",
    show: true,
  },
  { index: "3", value: "左后摄像", rtcURL: "", show: false },
  { index: "4", value: "右后摄像", rtcURL: "", show: false },
  { index: "5", value: "驾驶室内摄像", rtcURL: "", show: false },
  { index: "6", value: "前补摄像", rtcURL: "", show: false },
  {
    index: "7",
    value: "后视摄像",
    rtcURL: "webrtc://122.193.28.107:1985/live/hwrd.2.h264",
    show: true,
  },
];
const interList = <InjectList>inject("injectList");
onMounted(() => {
  configuration(interList.value.vin);
});
const configuration = async (vin: any) => {
  await nextTick();
  state.configurationLoading = true;
  try {
    const { data } = await configQuery({ vehVin: vin }).finally(
      () => (state.configurationLoading = false)
    );
    // console.log(data);
    Object.assign(formProjectDialog, data);
    // formProjectDialog.vehVin = row.vehVin;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.configurationLoading = false;
  }
};
const changeRtc = (index: string) => {
  submitForm();
};
const submitForm = async () => {
  try {
    const { data } = await configSet(formProjectDialog);
    ElMessage.success("操作成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const filterLabel = (val: string) => {
  return arr.filter((n) => n.index == val)[0].value;
};
const filterUrl = (val: string) => {
  return arr.filter((n) => n.index == val)[0].rtcURL;
};
const filterShow = (val: string) => {
  return arr.filter((n) => n.index == val)[0].show;
};
</script>
<style lang="scss" scoped>
.map-content {
  height: calc(100% - 44px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(100px, auto) minmax(100px, auto);
  overflow: auto;
  grid-gap: 12px;
  .switch-po {
    position: absolute;
    top: 2px;
    right: 16px;
  }
}
.camera {
  border-radius: 2px;
  border: 1px solid #ebe9e9;
  padding: 8px 16px;
  height: 100%;
  position: relative;
}
.video {
  height: calc(100% - 36px);
}
</style>
