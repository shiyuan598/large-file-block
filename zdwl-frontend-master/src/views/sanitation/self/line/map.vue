<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { defineExpose, reactive, defineProps, nextTick } from "vue";
import { InjectList } from "@/api/sanitation/type";
interface Maps {
  map: any;
  infoWindow: any;
  polyline: any;
  AMap: any;
  grasp: any;
}
const maps: Maps = reactive({
  map: [],
  infoWindow: {},
  polyline: {},
  AMap: undefined,
  grasp: {},
});
const props = defineProps<{ gpsList: any; mapListType: string }>();
const container = ref();
const interList = <InjectList>inject("injectList");
const mapList = reactive(
  props.mapListType === "line" ? props.gpsList : interList.value.gpsList
);
onMounted(async () => {
  lodeMap();
});
const emit = defineEmits(["emitMap"]);
const reloadMarker = async () => {
  if (Object.keys(maps.map).length !== 0) {
    maps.map?.remove(markerArr);
    if (interList.value.gpsList.length > 0) {
      setMaker();
    }
  }
};
const reloadLine = async (val: any) => {
  if (Object.keys(maps.polyline).length > 0) {
    // console.log('执行')
    maps.map?.remove(maps.polyline);
  }
  if (val.length > 0) {
    await nextTick();
    setPolyline(val);
  }
};
const lodeMap = () => {
  AMapLoader.load({
    key: "f161e7ca3410e846e45d912eb83d38e6", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.MoveAnimation"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then(async (AMap) => {
      maps.AMap = AMap;
      await newMap();
      if (interList.value.gpsList.length > 0) {
        setMaker();
      }
      if (props.mapListType === "route") {
        loadGpsMaker();
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const newMap = () => {
  maps.map = new maps.AMap.Map(container.value, {
    viewMode: "3D", // 是否为3D地图模式
    zoom: 17, // 初始化地图级别
    center:
      interList.value.gpsList.length > 0
        ? [interList.value.gpsList[0][0], interList.value.gpsList[0][1]]
        : [120.65097854457737, 31.418889586846984],
  });
  // maps.map.on("click", (e: any) => {
  //   console.log("您在[ " + e.lnglat.getLng() + "," + e.lnglat.getLat() + " ]");
  // });
};

const setPolyline = (arr: any) => {
  maps.polyline = new maps.AMap.Polyline({
    map: maps.map,
    path: arr,
    showDir: true,
    strokeColor: "#28F", // 线颜色
    // strokeOpacity: 1,     //线透明度
    strokeWeight: 6, // 线宽
    // strokeStyle: "solid"  //线样式
  });
  // maps.map.setFitView();
};
const gpsMaker = ref(null);
const loadGpsMaker = () => {
  const markerContent = "" + '<div class="custom-content-marker">' + "</div>";
  gpsMaker.value = new maps.AMap.Marker({
    content: markerContent,
    offset: new maps.AMap.Pixel(-13, -13),
    // angle: direction
  });
  maps.map.add([gpsMaker.value]);
};
let markerArr = reactive([]);
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
    position: new maps.AMap.LngLat(
      interList.value.gpsList[0][0],
      interList.value.gpsList[0][1]
    ),
    icon: startIcon,
    map: maps.map,
    offset: new maps.AMap.Pixel(-13, -30),
  });
  // 将 icon 传入 marker
  const endMarker = new maps.AMap.Marker({
    position: new maps.AMap.LngLat(
      interList.value.gpsList[interList.value.gpsList.length - 1][0],
      interList.value.gpsList[interList.value.gpsList.length - 1][1]
    ),
    icon: endIcon,
    map: maps.map,
    offset: new maps.AMap.Pixel(-13, -30),
  });

  interList.value.gpsList.map((n: any, index: number) => {
    if (index === 0 || index === interList.value.gpsList.length - 1) return;
    let marker = new maps.AMap.Marker({
      position: new maps.AMap.LngLat(n[0], n[1]), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: index + 1,
      map: maps.map,
      content: `<div class="marker_ev">
<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png">
<span class=''>${index + 1}</span>
</div>`,
      offset: new maps.AMap.Pixel(-13, -30),
    });
    markerArr.push(marker);
  });
  markerArr = markerArr.concat([startMarker, endMarker]);
  // console.log(maps.map)
  // maps.map.push(markerArr);
};

const setCarMaker = async (position: any, direction: number) => {
  if (gpsMaker.value && position[0] !== 0) {
    gpsMaker.value.show();
    gpsMaker.value.setPosition(position);
    gpsMaker.value.setAngle(direction);
    // maps.map.setCenter(position,true)
  } else {
    gpsMaker.value && gpsMaker.value.hide();
  }
};
const mapZoomIn = () => {
  maps.map.zoomIn();
};
const mapZoomOut = () => {
  maps.map.zoomOut();
};

onUnmounted(() => {
  if (Object.keys(maps.map).length !== 0) {
    maps.map?.destroy();
  }
});
defineExpose({
  mapZoomIn,
  mapZoomOut,
  reloadMarker,
  setCarMaker,
  reloadLine,
});
</script>
<template>
  <div ref="container" class="container"></div>
</template>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
:deep(.marker_ev) {
  position: relative;
  text-align: center;
  height: 30px;
  span {
    color: #fff;
    position: absolute;
    text-align: center;
    font-size: 12px;
    left: 0px;
    z-index: 9;
    width: 20px;
  }
  img {
  }
}
</style>
