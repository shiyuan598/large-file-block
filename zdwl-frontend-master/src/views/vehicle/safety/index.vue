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
          ><span style="color: #8c8c8c">智能车管</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/vehicle/safety/information' }"
          ><span style="color: #8c8c8c">安全员管理</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span
            :class="state.import ? 'breadcrumb-color' : 'breadcrumb-color-is'"
            @click="returnList"
            >安全员信息</span
          ></el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="state.import"
          ><span style="color: #303030">导入</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi" v-show="state.built && !state.import">
      <el-tabs
        v-model="state.activeName"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="在职员工" name="on"> </el-tab-pane>
        <!-- <el-tab-pane label="证件时效短" name="证件时效短">
          <ShortTime
            ref="builtTrailer"
            @newBuilt="newBuilt"
            @clickImport="clickImport"
            v-if="state.activeName === '在职员工'"
          ></ShortTime>  
        </el-tab-pane> -->
        <el-tab-pane label="证件时效短" name="time"> </el-tab-pane>
        <el-tab-pane label="离职员工" name="off"> </el-tab-pane>
      </el-tabs>
      <OnJob
        :driverType="state.activeName"
        ref="builtTrailer"
        @newBuilt="newBuilt"
        @clickImport="clickImport"
      ></OnJob>
    </div>
    <div class="app-container all-height mg-10" v-if="!state.built">
      <OnJobBuilt
        @cancellation="cancellation"
        :editFrom="state.onJobFrom"
      ></OnJobBuilt>
    </div>
    <div class="importSlot-height" v-if="state.import">
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
import { reactive, provide } from "vue";
import { getOptions } from "@/api/vehicleInfo";
import { dictionary } from "@/store/modules/dictionary";
import OnJob from "./components/onJob/index.vue";
import OnJobBuilt from "./components/onJob/newBuilt.vue";
import { OnJobForm } from "@/api/secure/types";
import importSlot from "@/views/Import/index.vue";
import { useElementSize } from "@vueuse/core";

const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 290;
});
provide("height", setHeight);
const state = reactive({
  activeName: "on",
  built: true,
  import: false,
  onJobFrom: {} as unknown as OnJobForm,
  title: "",
  downloadType: "",
  apiFn: undefined,
  downFn: undefined,
});
//
const parentNewBuilt = () => {
  state.built = false;
};
provide("parentNewBuiltClick", parentNewBuilt);
const returnList = () => {
  state.import = false;
};
const handleClick = (val: string) => {
  builtTrailer.value?.tabList(val.props.name);
};
onMounted(() => {
  Promise.all([
    getOption("business"),
    getOption("cooperation_way"),
    getOption("drive_card_type"),
  ]).then(() => {
    builtTrailer.value?.setList();
  });
});
const setDictionary = dictionary();
const getOption = async (type: string) => {
  const { data } = await getOptions(type);
  data.map((n: { label: string; value: Number }) => {
    n.value = Number(n.value);
  });
  switch (type) {
    case "cooperation_way":
      setDictionary.setDictionaryList("cooperationWay", data);
      break;
    case "drive_card_type":
      setDictionary.setDictionaryList("driveCardType", data);
      break;
    default:
      setDictionary.setDictionaryList(type, data);
      break;
  }
};
const builtTrailer = ref<InstanceType<typeof OnJob> | null>(null);
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
const newBuilt = (val: OnJobForm, type: string) => {
  state[type] = val;
  state.built = false;
};
const cancellation = () => {
  state.onJobFrom = {} as unknown as OnJobForm;
  state.built = true;
  builtTrailer.value?.getStatList();
};
</script>
<style scoped lang="scss">
:deep(.set-height .el-tabs__item) {
  font-size: 16px;
}
:deep(.set-height .el-tabs__content) {
  margin-top: 32px;
}
:deep(.el-tabs__nav) {
  padding: 10px 0;
}
.set-height {
  padding-top: 0;
}
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
</style>
