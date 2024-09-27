<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { defineExpose, reactive, defineProps, nextTick } from "vue";
import { plateOrderHistory } from "@/api/depreciation";
interface Maps {
  map: any;
  infoWindow: any;
  polyline: any;
  AMap: any;
  grasp: any;
}
const maps: Maps = reactive({
  map: {},
  infoWindow: {},
  polyline: {},
  AMap: undefined,
  grasp: {},
});
const state = reactive({
  loading: false,
  fuelSum: 0,
  mileage: 0,
  card: "",
  avgFuel: 0,
  aiMileage: 0
});

const props = defineProps(["rowHistory"]);
const getHistory = async () => {
  state.loading = true;
  lineArr.value=[];
  let parmers = {
    vehicleCard: props.rowHistory.tractor,
    startTime: props.rowHistory.startTime,
    endTime: props.rowHistory.endTime,
  };

  try {
    const { data } = await plateOrderHistory(parmers.vehicleCard, parmers);
    data.gpsList?.map((n: any) => {
      lineArr.value.push([n.lng02, n.lat02]);
    });
    state.loading = false;
    state.fuelSum = data.fuelSum;
    state.mileage = data.mileage;
    state.card = data.card;
    state.avgFuel = data.avgFuel;
    state.aiMileage = data.aiMileage;

  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
onMounted(async () => {
  await getHistory();
  lodeMap();
});
watch(
  [() => props.rowHistory, () => props.rowHistory],
  ([newValue, oldValue]) => {
    console.log(newValue);
  },
  {
    deep: true,
  }
);
const lodeMap = () => {
  AMapLoader.load({
    key: "f161e7ca3410e846e45d912eb83d38e6", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.MoveAnimation"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      maps.AMap = AMap;
      newMap();
      if(lineArr.value.length<1) return;
      setPolyline();
    })
    .catch((e) => {
      console.log(e);
    });
};
const newMap = () => {
  maps.map = new maps.AMap.Map("container", {
    viewMode: "3D", // 是否为3D地图模式
    zoom: 8, // 初始化地图级别
    center: [116.397428, 39.90923],
  });
};
const lineArr = ref([
  // [116.478935, 39.997761],
  // [116.478939, 39.997825],
  // [116.478912, 39.998549],
  // [116.478912, 39.998549],
  // [116.478998, 39.998555],
  // [116.478998, 39.998555],
  // [116.479282, 39.99856],
  // [116.479658, 39.998528],
  // [116.480151, 39.998453],
  // [116.480784, 39.998302],
  // [116.480784, 39.998302],
  // [116.481149, 39.998184],
  // [116.481573, 39.997997],
  // [116.481863, 39.997846],
  // [116.482072, 39.997718],
  // [116.482362, 39.997718],
  // [116.483633, 39.998935],
  // [116.48367, 39.998968],
  // [116.484648, 39.999861],
]);
const setPolyline = () => {
  maps.polyline = new maps.AMap.Polyline({
    map: maps.map,
    path: lineArr.value,
    showDir: true,
    strokeColor: "#28F", // 线颜色
    // strokeOpacity: 1,     //线透明度
    strokeWeight: 6, // 线宽
    // strokeStyle: "solid"  //线样式
  });
  maps.map.setFitView();
  setMaker();
};
const setMaker = () => {
  // 创建一个 Icon
  const startIcon = new maps.AMap.Icon({
    // 图标尺寸
    size: new maps.AMap.Size(25, 34),
    // 图标的取图地址
    image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
    // 图标所用图片大小
    imageSize: new maps.AMap.Size(135, 40),
    // 图标取图偏移量
    imageOffset: new maps.AMap.Pixel(-9, -3),
  });
  // 创建一个 icon
  const endIcon = new maps.AMap.Icon({
    size: new maps.AMap.Size(25, 34),
    image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
    imageSize: new maps.AMap.Size(135, 40),
    imageOffset: new maps.AMap.Pixel(-95, -3),
  });
  // 将 icon 传入 marker
  const startMarker = new maps.AMap.Marker({
    position: new maps.AMap.LngLat(lineArr.value[0][0],lineArr.value[0][1]),
    icon: startIcon,
    offset: new maps.AMap.Pixel(-13, -30),
  });
  // 将 icon 传入 marker
  const endMarker = new maps.AMap.Marker({
    position: new maps.AMap.LngLat(lineArr.value[lineArr.value.length-1][0],lineArr.value[lineArr.value.length-1][1]),
    icon: endIcon,
    offset: new maps.AMap.Pixel(-13, -30),
  });
  maps.map.add([startMarker, endMarker]);
  onUnmounted(() => {
  if (Object.keys(maps.map).length !== 0) {
    maps.map?.destroy();
  }
});
};
</script>
<template>
  <div id="container"></div>
  <div class="windowContent">
    <div class="content-bottom">
      <div class="mt-3">
          <span class="content-label">车牌号：</span>
          <span class="content-text">&nbsp; {{ state.card }}</span>
        </div>
        <!-- <div class="mt-2">
          <span class="content-label">油耗：</span>
          <span class="content-text">&nbsp; {{ Math.floor(state.fuelSum) }}升</span>
        </div>
        <div class="mt-2">
          <span class="content-label">百公里油耗:</span>
          <span class="content-text">&nbsp; {{ Math.floor(state.avgFuel) }}升</span>
        </div>
        <div class="mt-2">
          <span class="content-label">里程：</span>
          <span class="content-text">&nbsp; {{ state.mileage }}公里</span>
        </div>
        <div class="mt-2">
          <span class="content-label">自动驾驶里程:</span>
          <span class="content-text">&nbsp; {{ state.aiMileage }}公里</span>
        </div> -->
        <div class="mt-2">
          <span class="content-label">实际路线：</span>
          <span class="content-text" :class="props.rowHistory.waypointsStatus==0?'':'red-color'">&nbsp; {{ props.rowHistory.routeLine }}</span>
        </div>
        <div class="mt-2">
          <span class="content-label">实际时效：</span>
          <span class="content-text">&nbsp; {{ props.rowHistory.downTime }}（分钟）</span>
        </div>
        <div class="mt-2">
          <span class="content-label">实际里程：</span>
          <span class="content-text">&nbsp; {{ props.rowHistory.gpsMileage }}KM</span>
        </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
#container {
  width: 100%;
  height: 600px;
}
.red-color{
  color: #F56C6C;
}
.windowContent {
  width: 220px;
  height: 160px;
  background: #ffffff;
  border-radius: 4px;
  padding: 0 16px;
  position: absolute;
  top: 70px;
  left: 30px;
  .content-bottom {
    font-size: 14px;
    color: #303030;
    .content-label {
      color: #8c8c8c;
      font-size: 14px;
    }
  }
}
</style>
