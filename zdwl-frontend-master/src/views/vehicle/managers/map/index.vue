<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { mapList } from "@/api/vehicleInfo/index";
import { TreeData } from "@/api/vehicleInfo/types";
import { ElTree } from "element-plus";
import Tree from "@/views/vehicle/managers/map/tree.vue";
import { Search } from "@element-plus/icons-vue";
import dayjs from "dayjs";
interface State {
  drawer: boolean;
  loading: boolean;
  keys: number[];
  mapData: TreeData[];
  treeData: TreeData[];
  filterText: string;
  throttle: boolean;
  treeLoading: boolean;
}
const state: State = reactive({
  drawer: true,
  loading: false,
  keys: [],
  mapData: [],
  treeData: [],
  filterText: "",
  throttle: false,
  treeLoading: false,
});
interface Maps {
  map: any;
  infoWindow: any;
  cluster: any;
  AMap: any;
  grasp: any;
  geocoder: any;
}
const maps: Maps = reactive({
  map: {},
  infoWindow: {},
  cluster: {},
  AMap: undefined,
  grasp: {},
  geocoder: undefined,
});
const tree = ref();
const getMapList = async (val: string) => {
  state.loading = true;
  state.treeLoading = true;
  const { data } = await mapList({ keywords: val });
  try {
    state.treeData = data;
    state.loading = false;
    state.treeLoading = false;
    
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
    state.treeLoading = false;
  }
};
const fileStatus = (val: number) => {
  let status = ["行驶", "静止", "离线", "异常", "未知"];
  return status[val];
};

const circulate = (arr: TreeData[]) => {
  arr.map((n: TreeData) => {
    if (n.children) {
      circulate(n.children);
    } else {
      pushData(n);
    }
  });
};
const pushData = (n: any) => {
  state.keys.push(n.id);
  state.mapData.push({
    type: fileStatus(n.status),
    lnglat: [n.lng02, n.lat02],
    fuelLevel: n.fuelLevel,
    direction: n.direction,
    card: n.card,
    id: n.id,
    speed: n.speed,
    gpsTime: n.gpsTime,
  });
};
const filterText = ref<string>('');
onMounted(async () => {
  lodeMap();
  await getMapList("");
  circulate(state.treeData);
  setCluster();
  newGeocoder();
  tree.value?.setTreeRefs();
});
const newMap = () => {
  maps.map = new maps.AMap.Map("container", {
    mapStyle: "amap://styles/macaron",
    // 设置地图容器id
    viewMode: "3D", // 是否为3D地图模式
    zoom: 5.6, // 初始化地图级别
    zooms: [2, 16],
    center: [109.03, 32.68], // 初始化地图中心点位置
  });
  maps.map.on("movestart", (val: any) => {
    const zoomIndex = maps.map.getZoom();
    if (zoomIndex <= 5.6 && state.throttle) {
      maps.cluster.setMap(null);
      setCluster();
      state.throttle = false;
    } else if (zoomIndex > 5.6 && !state.throttle) {
      maps.cluster.setMap(null);
      setCluster();
      state.throttle = true;
    }
  });
};

const _renderClusterMarker = function (context: any) {
  const div = document.createElement("div");
  div.setAttribute("class", "makerStyle");
  div.innerHTML = context.count;
  context.marker.setOffset(new maps.AMap.Pixel(-30, -30));
  context.marker.setContent(div);
};
const _renderMarker = function (context: any) {
  let template = '';
  if(filterText.value){
    template = filterText.value&&context.data[0].card.includes(filterText.value)?'makerImg':'makerImg makerImgNone';
  }else{
    template = 'makerImg';
  }
  let isIt =
    context.data[0].type === "行驶"
      ? "1"
      : context.data[0].type === "离线"
      ? "2"
      : "3";
  const makerImgContent = `<div class="${template}">
          <span><i>${context.data[0].card}</i></span>
          <div class="makerImg${isIt}" style="transform: rotatez(${context.data[0].direction}deg)"></div>
          </div>`;
  const offset = new maps.AMap.Pixel(-35, -65);
  // context.marker.setAngle(context.data[0].fuelLevel);
  context.marker.setContent(makerImgContent);
  context.marker.setOffset(offset);
  context.marker.on("click", async function () {
    let address = "";
    maps.geocoder.getAddress(
      context.data[0].lnglat,
      (status: any, result: any) => {
        if (status === "complete" && result.regeocode) {
          address = result.regeocode.formattedAddress;
        } else {
          address = "根据经纬度查询地址失败";
        }
        maps.infoWindow = new maps.AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: createInfoWindow(context.data[0], address),
          offset: new maps.AMap.Pixel(40, 0),
          anchor: "middle-left",
        });
        maps.infoWindow.open(maps.map, context.marker.getPosition());
      }
    );
  });
};

// 加载点聚合插件
const setCluster = () => {
  maps.cluster = new maps.AMap.MarkerCluster(maps.map, state.mapData, {
    gridSize: 60, // 聚合网格像素大小
    maxZoom: 8, //最大的聚合级别
    renderClusterMarker: _renderClusterMarker,
    renderMarker:
      maps.map.getZoom() <= 5.6 ? _renderClusterMarker : _renderMarker,
  });
  maps.map.add(maps.cluster);
};
// 逆地理编码
const newGeocoder = () => {
  maps.geocoder = new maps.AMap.Geocoder({
    extensions: "all",
    radius: 1000, //范围，默认：500
  });
};

const lodeMap = () => {
  AMapLoader.load({
    key: "f161e7ca3410e846e45d912eb83d38e6", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.MarkerCluster", "AMap.GraspRoad", "AMap.Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      maps.AMap = AMap;
      newMap();

      // setCluster();
      // newGeocoder();
    })
    .catch((e) => {
      console.log(e);
    });
};
const setGrasp = () => {
  maps.grasp = new maps.AMap.GraspRoad();
  maps.grasp.driving(state.mapData, function (error, result) {
    if (!error) {
      var newPath = result.data.points; //纠偏后的轨迹
      state.mapData = newPath;
      // var distance = result.data.distance;//里程
      setCluster();
    }
  });
};
function createInfoWindow(content: TreeData, address: string) {
  const div = document.createElement("div");
  div.setAttribute("class", "windowContent");
  const top = document.createElement("div");
  top.innerHTML = ` <span class='content-text'>${content.card}</span>`;
  top.setAttribute("class", "content-top");
  const span = document.createElement("span");
  span.setAttribute("class", "cross");
  span.innerHTML = `X`;
  span.onclick = closeInfoWindow;
  top.appendChild(span);
  div.appendChild(top);
  const bottom = document.createElement("div");
  bottom.innerHTML = `<div class='content-bottom'>
            <div class='mt-2'><span class='content-label'>车辆状态：</span><span><div class='state ${
              content.type === "行驶"
                ? "state-blue"
                : content.type === "离线"
                ? "state-yellow"
                : "state-red"
            }'>${content.type}</div></span></div>
            <div class='mt-2'><span class='content-label'>当前速度：</span><span>${
              content.speed
            } 公里/h</span></div>
            <div class='mt-2'><span class='content-label'>最后传输时间: </span><span>${dayjs(
              content.gpsTime
            ).format("YYYY-MM-DD HH:mm:ss")}</span></div>
            <div class='mt-2'><span class='content-label'>当前位置：</span><span class='address'>${address}</span></div>
          </div>`;
  div.appendChild(bottom);
  return div;
}
function closeInfoWindow() {
  maps.map.clearInfoWindow();
}

onUnmounted(() => {
  if (Object.keys(maps.map).length !== 0) {
    maps.map?.destroy();
  }
});
const search = async (val: string) => {
  filterText.value = val;
  await getMapList(val);
  maps.map.setZoomAndCenter(5.6, [109.03, 32.68],true);
  
};
const searchAll = () => {
  // 初始化地图级别

  maps.map.setZoomAndCenter(5.6, [109.03, 32.68]);
};

function open() {
  state.drawer = true;
}
const close = () => {
  state.drawer = false;
};
const clearCurrent = () => {
  state.keys = [];
  state.mapData = [];
  maps.cluster.setMap(null);
};
// 点击复选框
const current = (value: any) => {
  clearCurrent();
  const list = value.checkedNodes.filter(
    (item: any) => typeof item.children === "undefined"
  );
  circulate(list);
  setCluster();
  // setGrasp()
};
// 点击tree
const check = (tree: any) => {
  
  if (tree.id) {

    maps.map.setZoomAndCenter(15.6, [tree.lng02, tree.lat02],true);
    // maps.map.setCenter([tree.lng02, tree.lat02]);
  }
  //
};
interface Tree {
  [key: string]: any;
}
</script>

<template>
  <div class="set-relative map-content map-dialog" v-loading="state.loading">
    <el-drawer
      :show-close="false"
      size="default"
      class="drawer"
      v-model="state.drawer"
      direction="ltr"
      v-loading="state.treeLoading"
    >
      <Tree
        @searchAll="searchAll"
        @check="check"
        @current="current"
        @serach="search"
        :treeData="state.treeData"
        :keys="state.keys"
        ref="tree"
      ></Tree>

      <!-- <el-button class="button-bo" @click="close">关闭</el-button> -->
    </el-drawer>
    <div class="search-button">
      <el-button @click="open" type="primary" :icon="Search" circle />
    </div>
    <div id="container"></div>
  </div>
</template>

<style scoped lang="scss">
.button-bo {
  bottom: 10px;
  position: absolute;
  right: 20px;
}

.map-relative {
  position: relative;
  width: 100%;
  height: 100%;
}
#container {
  width: 100%;
  height: 100%;
}
.search-button {
  position: absolute;
  top: 20px;
  left: 50px;
  z-index: 10;
}
</style>
<style lang="scss">
.map-dialog {
  .el-overlay {
    position: absolute;
    width: 296px;
    background-color: transparent;
  }
  .drawer {
    width: 300px !important;
    height: calc(100% - 40px);
    top: 20px;
    left: 16px;
  }
  .el-drawer__header {
    display: none;
  }
}
.custom-tree-node {
  width: 200px;
  .card {
    float: right;
  }
}
.makerStyle {
  width: 60px;
  height: 60px;
  background: url("@/assets/images/round.png") no-repeat;
  background-size: contain;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.makerImg {
  width: 70px;
  height: 90px;

  & > span {
    display: block;
    position: relative;
    height: 30px;
    top: 6px;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.1),
      0px 3px 6px -4px rgba(0, 0, 0, 0.2);
    & > i {
      font-style: normal;
      color: #303030;
      font-size: 12px;
      width: 70px;
      background-color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;
      position: absolute;
      z-index: 1;
      bottom: 0;
      left: 0;
    }
    & > i::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-color: #fff transparent transparent transparent;
    }
  }
  & > div {
    width: 30px;
    height: 50px;
    margin: 10px auto 0;
    background-size: contain;
  }
}
.makerImg1 {
  background: url("@/assets/images/blueCar.svg") no-repeat center;
}
.makerImg2 {
  background: url("@/assets/images/redCar.svg") no-repeat center;
}
.makerImg3 {
  background: url("@/assets/images/yelloCar.svg") no-repeat center;
}
.windowContent {
  width: 300px;
  height: 228px;
  background: #ffffff;
  border-radius: 4px;
  padding: 0 16px;
  .content-top {
    border-bottom: 1px solid #e4e4e4;
    padding-top: 12px;
    padding-bottom: 8px;
    .content-text {
      color: #303030;
      font-weight: 500;
      font-size: 16px;
    }
  }
  .content-bottom {
    font-size: 14px;
    .content-label {
      color: #8c8c8c;
      font-size: 14px;
    }
    .address {
      width: 178px;
      display: inline-block;
      vertical-align: text-top;
    }
    .state {
      width: 40px;
      height: 20px;
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      line-height: 20px;
      display: inline-block;
    }
    .state-red {
      color: #ff4d4f;
      background: rgba(255, 77, 79, 0.05);
    }
    .state-blue {
      color: #3270ff;
      background: rgba(50, 112, 255, 0.05);
    }
    .state-yellow {
      color: #ffb608;
      background: rgba(255, 182, 8, 0.1);
    }
  }
}
.cross {
  position: relative;
  font-size: 14px;
  cursor: pointer;
  color: #646566;
  float: right;
}
.set-relative {
  position: relative;
}
::-webkit-scrollbar {
  width: 8px;
  height: 16px;
  background-color: rgba(144, 147, 153, 0.3);
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  // -webkit-box-shadow:inset 0 0 6px rgba(144, 147, 153,.3);
  border-radius: 10px;
  // background-color:rgba(144, 147, 153,.3);
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  // -webkit-box-shadow:inset 0 0 6px rgba(144, 147, 153,.3);
  background-color: rgba(144, 147, 153, 0.2);
}
.makerImgNone{
  display: none;
}
</style>
