<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { defineExpose, reactive, defineProps, nextTick, onMounted } from "vue";

const lineArr = reactive({
  router0: [
    [116.478935, 39.997761],
    [116.478939, 39.997825],
    [116.478912, 39.998549],
    [116.478912, 39.998549],
    [116.478998, 39.998555],
    [116.478998, 39.998555],
    [116.479282, 39.99856],
    [116.479658, 39.998528],
    [116.480151, 39.998453],
  ],
  router1: [
    // [116.480151, 39.998453],
    [116.480784, 39.998302],
    [116.480784, 39.998302],
    [116.481149, 39.998184],
    [116.481573, 39.997997],
    [116.481863, 39.997846],
    [116.482072, 39.997718],
    [116.482362, 39.997718],
    [116.483633, 39.998935],
    [116.48367, 39.998968],
    [116.484648, 39.999861],
  ],
});
let KeyArr = Object.keys(lineArr);
KeyArr.map((n, i) => {
  if (KeyArr.length - 1 > i) {
    lineArr[n].push(lineArr[KeyArr[i + 1]][0]);
  }
});
console.log(lineArr);
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
const lodeMap = () => {
  AMapLoader.load({
    key: "f161e7ca3410e846e45d912eb83d38e6", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.MoveAnimation"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      maps.AMap = AMap;
      newMap();
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
const rotateArr = reactive([]);
const setPolyline = () => {
  let nameArr = [];
  for (let i in lineArr) {
    let color = "";
    color = i == 0 ? "28F" : "#67C23A";
    let lineName = new maps.AMap.Polyline({
      map: maps.map,
      path: lineArr[i],
      showDir: true,
      strokeColor: color, // 线颜色
      strokeWeight: 6, // 线宽
    });
    console.log(i);

    // rotateArr.concat(lineArr[i]);
    Object.assign(rotateArr, lineArr[i]);
    nameArr.push(lineName);
  }
  maps.polyline = nameArr;
  console.log(rotateArr);
  const carMarker = new maps.AMap.Marker({
    map: maps.map,
    position: [116.478935, 39.997761],
    icon: "https://webapi.amap.com/images/car.png",
    offset: new maps.AMap.Pixel(-13, -26),
    autoRotation: true,
    angle: 0,
  });

  maps.map.setFitView();

  carMarker.moveAlong(rotateArr, {
    // 每一段的时长
    duration: 1000, // 可根据实际采集时间间隔设置
    // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
    autoRotation: true,
  });
  const passedPolyline = new maps.AMap.Polyline({
    map: maps.map,
    strokeColor: "#AF5", //线颜色
    strokeWeight: 6, //线宽
  });

  carMarker.on("moving", function (e:any) {
    passedPolyline.setPath(e.passedPath);
    maps.map.setCenter(e.target.getPosition(), true);
  });
};
onMounted(() => {
  lodeMap();
});
</script>
<style scoped lang="scss">
#container {
  width: 100%;
  height: 100%;
}
</style>
