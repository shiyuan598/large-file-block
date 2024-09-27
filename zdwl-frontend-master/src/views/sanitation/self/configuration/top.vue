<template>
  <span class="pane-number">司机</span>
  <el-select
    v-model="state.driverId"
    style="width: 130px"
    filterable
    clearable
    placeholder="选择司机"
    @change="selectClick"
  >
    <el-option
      v-for="item in onDriverList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
  <span class="pane-number ml-20px">路径名称</span>
  <el-select
    v-model="state.routerCode"
    placeholder="请选择路径编号"
    style="align-items: center; width: 130px"
    filterable
    @change="selectClick"
  >
    <el-option
      v-for="(item, index) in dataList"
      :key="item.id"
      :label="item.routeName"
      :value="item.id"
    />
  </el-select>
  <el-button
    class="ml-32px"
    :disabled="!state.routerCode"
    type="primary"
    @click="distribute"
    >下发路径</el-button
  >
  <el-button
    type="primary"
    plain
    :icon="Refresh"
    round
    @click="changeRefresh"
  ></el-button>
  <span class="gps-title"> {{ filterTitle(props.gpsTitle) }} </span>
  <span class="float-right">
    <template v-for="item in switchArr" :key="item.key">
      <span class="pane-number ml-40px">{{ item.tips }}</span>
      <el-switch
        v-model="item.parmers"
        @change="changeSwitch(item.url, item.parmers, item.tips)"
        :active-value="true"
        :inactive-value="false"
        style="--el-switch-off-color: rgba(50, 112, 255, 0.4)"
      />
    </template>
  </span>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, watch, inject, defineProps } from "vue";
import {
  routePage,
  putUnify,
  gpsRoute,
  updateOrAdd,
  putRouter,
  vehicleRouteSetting,
} from "@/api/sanitation/index";
import { Refresh } from "@element-plus/icons-vue";
import { RoutePage, InjectList, StateCar } from "@/api/sanitation/type";
import { driverPage } from "@/api/secure";
const state = reactive({
  card: "",
  routerCode: undefined,
  drive: false,
  job: false,
  fall: false,
  xbrActiveCtrlMode: false,
  driverId: null
});
const queryParams = ref<RoutePage>({
  pageNum: 1,
  pageSize: 99,
  routeName: "",
});
const props = defineProps(["gpsTitle"]);
const interList = <InjectList>inject("injectList");
const stateList = <InjectList>inject("stateList");
onMounted(() => {
  state.routerCode = interList.value.routerId;
  state.card = interList.value.card;
  onDriver();
  getStatList();
  // state.drive = interList.value.driverStatus;
  // state.job = interList.value.workStatus;
  // state.fall = interList.value.dumpStat;
  // getStatList();
});
const switchArr = reactive([
  {
    key: "1",
    url: "/api/v1/ems/vehicleRouteSetting/autoDriver/",
    parmers: state.drive,
    tips: "自动驾驶",
  },
  {
    key: "2",
    url: "/api/v1/ems/vehicleRouteSetting/autoWork/",
    parmers: state.job,
    tips: "自动作业",
  },
  {
    key: "3",
    url: "/api/v1/ems/vehicleRouteSetting/autoDump/",
    parmers: state.fall,
    tips: "垃圾倾倒",
  },
  {
    key: "4",
    url: "/api/v1/ems/vehicleRouteSetting/toGo/",
    parmers: state.xbrActiveCtrlMode,
    tips: "自动驻车",
  },
]);
watch(
  () => stateList.value,
  (newVal: StateCar, oldVal: undefined) => {
    state.drive = newVal.vehCtrlStat == 1 ? true : false;
    state.job = newVal.oneKeyOperateStat == 2 ? true : false;
    state.fall = newVal.vehStatRsv4 == 0 ? true : false;
    state.xbrActiveCtrlMode = newVal.xbrActiveCtrlMode == 0 ? true : false;
  },

  { deep: true }
);

// 在职司机
let onDriverList = reactive([]);
const onDriver = async () => {
  onDriverList.length = 0;
  try {
    const { data } = await driverPage(
      { driverType: "on", pageSize: 9999,business: '环卫场景'},
      "/api/v1/driver/page"
    );
    Object.assign(onDriverList, data.list);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const dataList = ref([]);

const getStatList = async () => {
  const { data } = await routePage(queryParams.value);
  try {
    dataList.value = data.list;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const setRouter = () => {
  state.driverId = interList.value.driverId;
  state.routerCode = interList.value.routerId;
};
const changeSwitch = async (url: string, parmer: boolean, tips: string) => {
  // const parmers = {
  //   vehicleCard: interList.value.card ,
  //   status: parmer
  // }
  try {
    const { data } = await putRouter(url, interList.value.card, parmer);
    ElMessage.success(parmer ? "开启" + tips : "关闭" + tips);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const distribute = async () => {
  try {
    const { data } = await putUnify(
      "/api/v1/ems/vehicleRouteSetting/pushRoute/",
      interList.value.card
    );
    ElMessage.success("下发成功");
    emit("emitGps");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const gpsList = ref([]);
const emit = defineEmits(["emitGpsList", "emitGps", "refresh"]);
const changeRefresh = () => {
  emit("refresh");
};
const selectClick = async () => {
  await putUpdateOrAdd();
  try {
    const { data } = await vehicleRouteSetting(state.card);
    const mapList: any = [];
    data?.routeGPS?.map((n: any) => {
      mapList.push([n.lng02, n.lat02]);
    });
    gpsList.value = mapList;
    interList.value.gpsList = mapList;
    emit("emitGpsList", gpsList.value);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const putUpdateOrAdd = async () => {
  let parmers = {
    vehicleId: interList.value.vehicleId,
    id: interList.value.injectId,
    routeId: state.routerCode,
    driverId: state.driverId
  };
  try {
    const { data } = await updateOrAdd(parmers);
    ElMessage.success("配置成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const filterTitle = (val: string) => {
  const titleList = [
    "规划成功",
    "车辆不在地图内",
    "指定区域不在地图内",
    "无法到达指定区域",
    "请求超时",
  ];
  return titleList[Number(val)];
};
defineExpose({
  setRouter,
});
</script>
<style lang="scss" scoped>
.pane-number {
  color: #303030;
  font-size: 14px;
  margin-right: 8px;
}
.gps-title {
  font-size: 14px;
  margin-left: 16px;
  display: inline-block;
}
</style>
