<template>
  <div class="pane-content h-full">
    <Top
      @emitGpsList="emitGpsList"
      @refresh="lineRouteResp"
      @emitGps="emitGps"
      ref="templateTop"
      :gpsTitle="state.gpsTitle"
    ></Top>
    <div
      v-loading="state.loading"

      element-loading-background="rgba(255,255,255, 0.5)"
      class="map-content mt-24px"
    >
      <Map
        @emitMap="emitMap"
        :gpsList="gpsList"
        :mapListType="'route'"
        ref="mapRef"
      ></Map>
    </div>
    <!-- <Bottom></Bottom> -->
  </div>
</template>
<script setup lang="ts">
import { defineExpose, onMounted, inject, watch, onUnmounted } from "vue";
import Top from "./top.vue";
import Map from "../line/map.vue";
import Bottom from "./bottom.vue";
import { InjectList } from "@/api/sanitation/type";
import { putRouter, getRouter, routeResp } from "@/api/sanitation/index";

const state = reactive({
  routerCode: 0,
  switch: true,
  gpsTitle: "",
  loading: false,
});
const gpsList = ref([]);
const mapRef = ref();
const setTime: any = ref(null);
const interList = <InjectList>inject("injectList");
const injectStateList = <InjectList>inject("stateList");
watch(
  () => injectStateList,
  (newVal: any, oldVal: undefined) => {
    setMarker(newVal.value);
  },
  { deep: true }
);

onMounted(() => {
  // setTimeInterval();
  lineRouteResp();
});
// const setTimeInterval = () => {
//   setTime.value = setInterval(() => {
//     lineRouteResp();
//   }, 1000);
// };
const lineRouteResp = async () => {
  state.loading = true;
  try {
    const { data } = await routeResp(interList.value.card);
    state.gpsTitle = data.reqRespCode;
    // reloadLine([]);
    // if (data.reqRespCode != '0') return;
    // clearInterval(setTime.value);
    const mapList: any = [];
    data.pointDToList.map((n: any) => {
      mapList.push([n.lng02, n.lat02]);
    });
    // emitGpsList(mapList);
    reloadLine(mapList);
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    console.log(e.message);
    state.loading = false;
  }
};
// map组件返回方法
const emitMap = async () => {
  // await emitGpsList(interList.value.gpsList);
  // getPosition();props透传
};
// top组件返回方法
const emitGpsList = (val: any) => {
  gpsList.value = val;
  mapRef.value.reloadMarker();
};
const reloadLine = (val: any) => {
  mapRef.value.reloadLine(val);
};
const templateTop = ref();
const gpsCar = () => {
  templateTop.value.setRouter();
  mapRef.value.reloadMarker();
  // if(setTime.value) {clearInterval(setTime.value)}
  lineRouteResp();
  // setTimeInterval()
};
const emitGps = () => {
  // if(setTime.value) {clearInterval(setTime.value)}
  lineRouteResp();
  // setTimeInterval()
};
const setMarker = (marker: any) => {
  mapRef.value.setCarMaker([marker.lng02, marker.lat02], marker.heading);
};

onUnmounted(() => {
  clearInterval(setTime.value);
});
defineExpose({
  emitGpsList,
  setMarker,
  gpsCar,
});
</script>
<style lang="scss" scoped>
.map-content {
  height: calc(100% - 56px);
}
</style>
