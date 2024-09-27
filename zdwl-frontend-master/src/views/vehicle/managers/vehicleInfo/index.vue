<template>
  <div class="map-content">
    <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;line-height: 30px;">当前位置：</span>
        <el-breadcrumb separator="-" style="display: flex;align-items: center;">
          <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }"><span style="color: #8C8C8C;">智能车管</span></el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/vehicle/managers/depreciation' }"><span style="color: #8C8C8C;">车辆管理</span></el-breadcrumb-item>
          <el-breadcrumb-item ><span :class="state.import?'breadcrumb-color':'breadcrumb-color-is'"  @click="returnList">车辆信息</span></el-breadcrumb-item>
          <span class="black" v-if="!state.built">新建{{ activeName }}</span>
          <el-breadcrumb-item v-if="state.import"><span style="color: #303030;">导入</span></el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
    <div
      class="app-container all-height mg-10"
      v-show="state.built && !state.import"
    >
      <div class="content-div content-number">
        <el-row :gutter="20" justify="center">
          <el-col :span="3" v-for="item in categoryNumber" :key="item.text">
            <div class="text">{{ item.text }}</div>
            <div class="number">{{ item.number }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="content-div mt-3 pd-20 tab-height" ref="vehi">
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="牵引车" name="牵引车">
            <Trailer
              ref="trailer"
              v-if="activeName === '牵引车'"
              @newBuilt="newBuilt"
              @clickImport="clickImport"
              :height="height"
            ></Trailer>
          </el-tab-pane>
          <el-tab-pane label="挂车" name="挂车"
            ><Tractor
              ref="tractor"
              v-if="activeName === '挂车'"
              @newBuilt="newBuilt"
              @clickImport="clickImport"
              :height="height"
            ></Tractor
          ></el-tab-pane>
          <el-tab-pane label="集装箱" name="集装箱">
            <Container
              ref="container"
              v-if="activeName === '集装箱'"
              @newBuilt="newBuilt"
              @clickImport="clickImport"
              :height="height"
            ></Container>
          </el-tab-pane>
          <el-tab-pane label="环卫车" name="环卫车">
            <Sanitation
              ref="sanitation"
              v-if="activeName === '环卫车'"
              @newBuilt="newBuilt"
              @clickImport="clickImport"
              :height="height"
            ></Sanitation>
          </el-tab-pane>
          <el-tab-pane label="乘用车" name="乘用车"
            ><Passenger
              ref="passenger"
              v-if="activeName === '乘用车'"
              @newBuilt="newBuilt"
              @clickImport="clickImport"
              :height="height"
            ></Passenger
          ></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div
      class="app-container all-height mg-10"
      v-if="!state.built && activeName === '牵引车'"
    >
      <TrailerBuilt
        @cancellation="cancellation"
        :editFrom="state.editFrom"
      ></TrailerBuilt>
    </div>
    <div
      class="app-container all-height mg-10"
      v-if="!state.built && activeName === '挂车'"
    >
      <TractorBuilt
        @cancellation="cancellation"
        :editFrom="state.editTractorFrom"
      ></TractorBuilt>
    </div>
    <div
      class="app-container all-height mg-10"
      v-if="!state.built && activeName === '集装箱'"
    >
      <ContainerBuilt
        @cancellation="cancellation"
        :editFrom="state.containerFrom"
      ></ContainerBuilt>
    </div>
    <div
      class="app-container all-height mg-10"
      v-if="!state.built && activeName === '环卫车'"
    >
      <SanitationBuilt
        @cancellation="cancellation"
        :editFrom="state.sanitationFrom"
      ></SanitationBuilt>
    </div>
    <div
      class="app-container all-height mg-10"
      v-if="!state.built && activeName === '乘用车'"
    >
      <PassengerBuilt
        @cancellation="cancellation"
        :editFrom="state.passengerFrom"
      ></PassengerBuilt>
    </div>
    <div v-if="state.import" class="importSlot-height">
      <importSlot
      :title="state.title"
      :apiFn="state.apiFn"
      :downFn="state.downFn"
      :downloadType="state.downloadType"
      @returnList="returnList"
    ></importSlot>
    </div>
    
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import type { TabsPaneContext } from "element-plus";
import Trailer from "./components/trailer/index.vue";
import TrailerBuilt from "./components/trailer/newBuilt.vue";
import Tractor from "./components/tractor/index.vue";
import TractorBuilt from "./components/tractor/newBuilt.vue";
import { useElementSize } from "@vueuse/core";
import Container from "./components/container/index.vue";
import ContainerBuilt from "./components/container/newBuilt.vue";
import Sanitation from "./components/sanitation/index.vue";
import SanitationBuilt from "./components/sanitation/newBuilt.vue";
import Passenger from "./components/passenger/index.vue";
import PassengerBuilt from "./components/passenger/newBuilt.vue";
import { getvVhicleStat, getOptions } from "@/api/vehicleInfo";
import {
  Form,
  TractorForm,
  ContainerForm,
  SanitationForm,
  PassengerFrom,
} from "@/api/vehicleInfo/types";
import { dictionary } from "@/store/modules/dictionary";
import importSlot from "@/views/Import/index.vue";
const setDictionary = dictionary();
const state = reactive({
  built: true,
  import: false,
  editFrom: {} as unknown as Form,
  editTractorFrom: {} as unknown as TractorForm,
  containerFrom: {} as unknown as ContainerForm,
  sanitationFrom: {} as unknown as SanitationForm,
  passengerFrom: {} as unknown as PassengerFrom,
  title: "",
  downloadType: "",
  apiFn: null,
  downFn: null,
});
const newBuilt = (val: Form, type: string) => {
  state[type] = val;
  state.built = false;
};
const parentNewBuilt = () => {
  state.built = false;
};
provide("parentNewBuiltClick", parentNewBuilt);
const returnList = () => {
  state.import = false;
};
const clickImport = (obj: {
  importFn: Function;
  downFn: Function;
  downloadType: string;
  title: string;
}) => {
  state.import = true;
  state.apiFn = obj.importFn;
  state.downFn = obj.downFn;
  state.downloadType = obj.downloadType;
  state.title = obj.title;
};
const trailer = ref<InstanceType<typeof Trailer> | null>(null);
const tractor = ref<InstanceType<typeof Tractor> | null>(null);
const container = ref<InstanceType<typeof Container> | null>(null);
const sanitation = ref<InstanceType<typeof Sanitation> | null>(null);
const passenger = ref<InstanceType<typeof Passenger> | null>(null);
const cancellation = () => {
  state.editFrom = {} as unknown as Form;
  state.editTractorFrom = {} as unknown as TractorForm;
  state.containerFrom = {} as unknown as ContainerForm;
  state.sanitationFrom = {} as unknown as SanitationForm;
  state.passengerFrom = {} as unknown as PassengerFrom;
  state.built = true;
  trailer.value?.getStatList();
  tractor.value?.getStatList();
  container.value?.getStatList();
  sanitation.value?.getStatList();
  passenger.value?.getStatList();
};
onMounted(() => {
  getStatList();
  Promise.all([getOption("business"),getOption("ownership"),getOption("gps_source"),getOption("sanitation_type"),getOption("power_type")]).then((res)=>{
    trailer.value?.setList()
  })
})

const getOption = async (type: string) => {
  const { data } = await getOptions(type);
  data.map((n: { label: string; value: Number }) => {
    n.value = Number(n.value);
  });
  switch (type) {
    case "gps_source":
      setDictionary.setDictionaryList("gpsSource", data);
      break;
    case "sanitation_type":
      setDictionary.setDictionaryList("sanitationType", data);
      break;
    case "power_type":
      setDictionary.setDictionaryList("powerType", data);
      break;
    default:
      setDictionary.setDictionaryList(type, data);
      break;
  }
};
const getStatList = async () => {
  const { data } = await getvVhicleStat();
  try {
    categoryNumber.value[0].number = data.total;
    categoryNumber.value[1].number = data.tractorStat;
    categoryNumber.value[2].number = data.trailerStat;
    categoryNumber.value[3].number = data.boxStat;
    categoryNumber.value[4].number = data.sanitationStat;
    categoryNumber.value[5].number = data.carStat;
  } catch (e: any) {
    ElMessage(e.message);
  }
};
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 280;
});
provide("height", setHeight);
const categoryNumber = ref([
  {
    text: "车辆总数",
    number: 0,
  },
  {
    text: "牵引车",
    number: 0,
  },
  {
    text: "挂车",
    number: 0,
  },
  {
    text: "集装箱",
    number: 0,
  },
  {
    text: "环卫车",
    number: 32,
  },
  {
    text: "乘用车",
    number: 0,
  },
]);

const activeName = ref("牵引车");
const handleClick = (tab: TabsPaneContext, event: Event) => {};
</script>
<style scoped lang="scss">
:deep(.content-div .el-tabs__item) {
  font-size: 16px;
}
:deep(.content-div .el-tabs__content) {
  margin-top: 32px;
}
.set-height {
  background-color: transparent;
}
.content-number {
  height: 82px;
}
.content-div {
  background: #fff;
  border-radius: 2px;
}
.text {
  color: #8c8c8c;
  font-size: 14px;
  margin: 16px 0 8px;
}
.number {
  color: #303030;
  font-size: 20px;
}
.pd-20 {
  padding: 16px 24px;
}
.tab-height {
  height: calc(100% - 104px);
}
.black {
  color: black;
}
:deep(.el-breadcrumb__inner){
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
  }
</style>
