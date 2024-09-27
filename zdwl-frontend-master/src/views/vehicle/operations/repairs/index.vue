<template>
  <div class="app-container">
    <el-container>
      <!-- <el-header style="background-color: white;position: relative;">
        <span style="font-size: 12px;color: rgb(181, 181, 181);position: absolute;top: 35%;">当前位置：智能车管
          <span style="padding: 10px;">-</span>
          <span style="color: rgb(181, 181, 181)">智慧运营</span>
          <span style="padding: 10px;">-</span>
          <span style="color:black;">维修情况</span>
        </span>
      </el-header> -->

      <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;">当前位置：</span>
        <el-breadcrumb separator="-" style="display: flex;align-items: center;">
          <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }">智能车管</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/vehicle/operations/repairs' }">智慧运营</el-breadcrumb-item>
          <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="!importFlg">维修情况</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/vehicle/operations/repairs' }" @click="returnList" v-if="importFlg">维修情况</el-breadcrumb-item>
          <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="importFlg">导入</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <div v-if="!importFlg">
          <el-card class="repairsClass" shadow="never">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="黄油" name="butter"><butter @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
              <el-tab-pane label="轮胎" name="tire"><tire @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
              <el-tab-pane label="修理" name="other"><other @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
              <el-tab-pane label="保养" name="upkeep"><upkeep @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
        <div v-if="importFlg">
          <el-card class="procurementClass" shadow="never" style="height:85vh;">
            <importSlot :title="state.title" :apiFn="state.apiFn" :downFn="state.downFn" v-if="importFlg" @returnList="returnList"></importSlot>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import butter from './butter.vue'
import tire from './tire.vue'
import other from './other.vue'
import upkeep from './upkeep.vue'
import importSlot from "@/views/Import/index.vue"
defineOptions({
  name: "repairs",
  inheritAttrs: false,
});
const emit = defineEmits(['paramsFn'])
const importFlg = ref(false);
const state = reactive({
  configData: {},
  title: '',
  apiFn: undefined,
  downFn: undefined
})

const activeName = ref('butter')
const handleClick = (tab: TabsPaneContext, event: Event) => {
}

const paramsFn = (data : any) => {
  state.title = data.title
  state.apiFn = data.importFn
  state.downFn = data.downFn
}

const disableClick = (visible: any) => {
  importFlg.value = visible
}

const returnList = () => {
  importFlg.value = !importFlg.value
}

onMounted(()=>{
})

</script>
<style lang="scss" scoped>
.box-card{
  width: 100%;
  height: 135px;
  background: #FFFFFF;
  border-radius: 2px;
  padding: 20px;
}
.box-card-h{
  width: 100%;
  height: 92px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  height: 34px;
}
:deep(.box-card .el-card__header){
  background-image:linear-gradient(180deg, rgba(205,220,255,0.88) 0%, rgba(205,228,255,0.1) 100%);
  border-bottom: none;
  padding: 0 20px;
}

:deep(.box-card .el-card__body){
  padding: 0 20px;
}

.text-item{
  display: table;
}
.text-fontsize{
  font-size: 12px;
}
.text-label{
  width: 43px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #8C8C8C;
  line-height: 20px;
}
.text-label-blue{
  width: 8px;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #3270FF;
  line-height: 22px;
}
.text-label-red{
  width: 10px;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #FF4D4F;
  line-height: 22px;
}
.text-label-red-12{
  width: 13px;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #FF4D4F;
  line-height: 17px;
}
.text-label-blue-12{
  width: 13px;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #3270FF;
  line-height: 17px;
}

.text-label-black{
  width: 56px;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #303030;
  line-height: 22px;
}
:deep(.repairsClass .el-tabs__item){
  font-size: 16px;
}
:deep(.el-tabs__header){
  margin:  0 0 15px 20px;
}

:deep(.el-breadcrumb__inner){
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #303030 !important;
}

:deep(.el-breadcrumb__inner.is-link){
  color: #8C8C8C !important;
}
</style>

