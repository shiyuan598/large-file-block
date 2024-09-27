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
        <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }"
          ><span style="color: #8c8c8c">无人环卫</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span style="color: #303030">车辆作业配置</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="flex-height  fullscreen-container flex-content" v-loading="state.allLoadings">
      <div class="flex-left">
        <el-input
          class="custom-input"
          v-model="state.keywords"
          placeholder="请输入车牌号码"
          :suffix-icon="Search"
        />
        <div class="custom" v-loading="state.loading">
          <div
            class="custom-div"
            @click="customClick(index, item)"
            :class="state.index === index ? 'active-custom-color' : ''"
            :key="item.id"
            v-for="(item, index) in deepList"
          >
            <span>
              {{ item.card }}
            </span>
          </div>
          <el-empty v-show="deepList.length === 0" :image-size="40" />
        </div>
      </div>
      <div class="flex-right">
        <el-button
          id="fullscreen-button"
          @click="toggleFullscreen"
          class="fullscreen-button"
          :icon="FullScreen"
        >
          <!-- 使用你的图标字体或SVG图标 -->
        </el-button>
        <el-tabs
          v-model="state.activeName"
          class="demo-tabs h-full"
          @tab-click="handleClick"
        >
          <el-tab-pane label="规划路线" name="router">
            <Router ref="router" v-if="state.activeName === 'router'"></Router>
          </el-tab-pane>
          <el-tab-pane label="车辆状态" name="state">
            <State ref="carState" v-if="state.activeName === 'state'"></State>
          </el-tab-pane>
          <el-tab-pane label="视频监控" name="monitor">
            <Monitor v-if="state.activeName === 'monitor'"></Monitor>
          </el-tab-pane>
          <el-tab-pane label="历史轨迹" name="trajectory">
            <Trajectory v-if="state.activeName === 'trajectory'"></Trajectory>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref, watch, provide } from "vue";
import { Search } from "@element-plus/icons-vue";
import Router from "./route.vue";
import State from "./state.vue";
import Monitor from "./monitor.vue";
import Trajectory from "./trajectory.vue";
import {
  sanitationPage,
  vehicleRouteSetting,
  putRouter,
  getRouter,
} from "@/api/sanitation/index";
import { InjectList } from "@/api/sanitation/type";
import { useRoute } from "vue-router";
import { FullScreen  } from '@element-plus/icons-vue';
const state = reactive({
  keywords: "",
  index: 0,
  activeName: "off",
  loading: false,
  allLoadings: false,
});
const route = useRoute();
console.log(route.query);
watch(
  () => state.keywords,
  (val: any) => {
    if (val) {
      deepList.value = carList.value.filter((n: any) => n.card.includes(val));
    } else {
      deepList.value = carList.value;
    }
  }
);

const carList = ref([]);
const deepList = ref([]);
const router = ref();
const carState = ref();
const timeInterval: any = ref(null);
const injectList = ref<InjectList>({
  card: "",
  injectId: undefined,
  vehicleId: undefined,
  routerId: undefined,
  driverId: null,
  driverStatus: 0,
  workStatus: 0,
  // dumpStat: 0,
  gpsList: [],
  vin: "",
  heading: null,
});
const stateList = ref({});
provide("injectList", injectList);
provide("stateList", stateList);
onMounted(async () => {
  await getStatList();
  if (carList.value.length === 0) return;
  await getVehicleRouteSetting(carList.value[0]);

  if (route.query.active === "state") {
    state.activeName = "state";
  } else {
    state.activeName = "router";
  }
});
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await sanitationPage({ enabled: 1 });
    carList.value = data.list;
    deepList.value = data.list;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const setTime = () => {
  getPosition();
  timeInterval.value = setInterval(() => getPosition(), 1000);
};
const getPosition = async () => {
  try {
    const { data } = await getRouter(
      "/api/v1/ems/vehicleRouteSetting/status/",
      injectList.value.card
    );
    stateList.value = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
// 获取车辆配置
const getVehicleRouteSetting = async (car: any) => {
  injectList.value.card = car.card;
  injectList.value.vehicleId = car.id;
  // injectList.value.driverStatus = car.vehCtrlStat;
  // injectList.value.workStatus = car.oneKeyOperateStat;
  // injectList.value.dumpStat = car.dumpStat;
  injectList.value.vin = car.vin;
  injectList.value.heading = car.heading;
  state.allLoadings = true;
  try {
    const { data } = await vehicleRouteSetting(car.card);

    state.allLoadings = false;
    if (data) {
      injectList.value.routerId = data.routeId;
      injectList.value.injectId = data.id;
      injectList.value.driverId = data.driverId;
      // injectList.value.routerCode = data.routeCode;
      const mapList: any = [];
      data?.routeGPS?.map((n: any) => {
        mapList.push([n.lng02, n.lat02]);
      });
      injectList.value.gpsList = mapList;
      // state.activeName = "router";
    } else {
      injectList.value.routerId = undefined;
      injectList.value.injectId = undefined;
      injectList.value.gpsList = [];
    }
    if (timeInterval.value) {
      clearInterval(timeInterval.value);
    }
    setTime();
  } catch (e: any) {
    state.allLoadings = false;
    ElMessage.error(e.message);
  }
};

const customClick = async (index: number, item: any) => {
  
  state.index = index;
  await getVehicleRouteSetting(item);
  carState.value?.getOtaList(item.card)
  router.value?.gpsCar();
};
const filterList = (value: any) => {
  return value.filter((n: any) => n.enabled == 1);
};
const handleClick = (val: string) => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value);
  }

  setTime();
};
onUnmounted(() => {
  clearInterval(timeInterval.value);
});
const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        // 请求全屏，但不包括导航栏
        const mainContent = document.querySelector('.fullscreen-container');
        if (mainContent.requestFullscreen) {
          mainContent.requestFullscreen();
        } else if (mainContent.mozRequestFullScreen) {
          mainContent.mozRequestFullScreen();
        } else if (mainContent.webkitRequestFullscreen) {
          mainContent.webkitRequestFullscreen();
        } else if (mainContent.msRequestFullscreen) {
          mainContent.msRequestFullscreen();
        }
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
</script>
<style scoped lang="scss">
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
:deep(.newDialogClass .el-dialog__body) {
  padding: 10px var(--el-dialog-padding-primary);
}

:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
:deep(.flex-height .el-tabs__item) {
  font-size: 16px;
}
:deep(.el-tabs__nav) {
  padding: 10px 32px;
}
.flex-height {
  height: calc(100% - 86px);
  margin: 12px;
  background: #ffffff;
}
.flex-content {
  display: flex;
}
.flex-left {
  width: 15%;
  min-width: 180px;
  max-width: 300px;
  border-right: 2px solid rgb(0, 0, 0, 0.09);
}
.flex-right {
  flex: 1;
  position: relative;
}
.custom-input {
  margin: 24px 0;
  padding: 0 24px;
}
.custom {
  height: calc(100% - 100px);
  overflow: auto;
}
.custom-div {
  padding-left: 36px;
  margin: 0 8px;
  margin-bottom: 8px;
  height: 32px;
  line-height: 32px;
  color: #303030;
  font-size: 14px;
  cursor: pointer;
}
.active-custom-color {
  background: rgba(50, 112, 255, 0.1);
}
.demo-tabs {
  height: 100%;
}
:deep(.el-tabs__content) {
  height: calc(100% - 74px);
}
:deep(.el-tab-pane) {
  height: 100%;
}
#fullscreen-button{
  position: absolute;
  right: 20px;
  top: 16px;
  z-index: 9;
}
</style>
