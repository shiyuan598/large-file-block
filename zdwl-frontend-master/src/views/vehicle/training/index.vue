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
        <el-breadcrumb-item :to="{ path: '/vehicle/safetyTraining/safetyTraining' }"
          ><span style="color: #8c8c8c">安全培训</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span
            :class="state.import ? 'breadcrumb-color' : 'breadcrumb-color-is'"
            >培训信息</span
          ></el-breadcrumb-item
        >

      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi">
      <el-tabs
        v-model="state.activeName"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="培训项目" name="on">
          <Project
            :driverType="state.activeName"
            ref="builtTrailer"
            @newBuilt="newBuilt"
            @clickImport="clickImport"
          >
          </Project>
        </el-tab-pane>
        <el-tab-pane label="培训情况" name="time">
          <Situation ref="situation"></Situation>  
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, provide } from "vue";
import { getOptions } from "@/api/vehicleInfo";
import { dictionary } from "@/store/modules/dictionary";
import Project from "./components/project/index.vue";
import { OnJobForm } from "@/api/secure/types";
import Situation from "./components/situation/index.vue";
import { useElementSize } from "@vueuse/core";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value -290;
});
provide("height", setHeight);
const state = reactive({
  activeName: "on",
  built: true,
  import: false,
  onJobFrom: {} as unknown as OnJobForm,
  title: "",
  downloadType: "",
});
//
const parentNewBuilt = () => {
  state.built = false;
};
provide("parentNewBuiltClick", parentNewBuilt);
const returnList = () => {
  state.import = false;
};
const handleClick = () => {
};
onMounted(async() => {
 await getOption("business");
 builtTrailer.value?.setList()
 situation.value?.setList()
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
const builtTrailer = ref<InstanceType<typeof Project> | null>(null);
  const situation = ref<InstanceType<typeof Situation> | null>(null);
const clickImport = (obj: {
  importFn: Function;
  downFn: Function;
  downloadType: string;
  title: string;
}) => {
  state.import = true;
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
:deep(.el-breadcrumb__inner){
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
  }
</style>
