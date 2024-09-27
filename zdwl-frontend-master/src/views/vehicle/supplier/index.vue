<template>
  <div class="app-container">
    <el-container>
      <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;">当前位置：</span>
        <el-breadcrumb separator="-" style="display: flex;align-items: center;">
          <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }">智能车管</el-breadcrumb-item>
          <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="!importFlg">供应商管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }" @click="returnList" v-if="importFlg">供应商管理</el-breadcrumb-item>
          <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="importFlg">导入</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <div v-if="!importFlg">
          <el-card class="box-card" shadow="never">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card class="box-card-h" shadow="never">
                  <template #header>
                    <div class="card-header">
                      <span>加油站</span>
                      <img src="../../../assets/images/oil.svg" style="width: 20px;height: 20px;"/>
                    </div>
                  </template>
                  <div class="text-item">
                    <span class="text-label">总数量</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;">{{topInfo.fuelCount}}</span>
                    <span class="text-label">个</span>
                  </div>
                  <div class="text-item">
                    <span class="text-label">油量预警</span>
                    <span class="text-label-red" style="padding: 0 5px 0 10px;" v-if="topInfo.fuelAlarmCount>0">{{topInfo.fuelAlarmCount}}</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;" v-if="topInfo.fuelAlarmCount==0">{{topInfo.fuelAlarmCount}}</span>
                    <span class="text-label">个</span>
                    <span class="text-label" style="padding-left: 30px;">尿素预警</span>
                    <span class="text-label-red" style="padding: 0 5px 0 10px;" v-if="topInfo.ureaAlarmCount>0">{{topInfo.ureaAlarmCount}}</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;" v-if="topInfo.ureaAlarmCount==0">{{topInfo.ureaAlarmCount}}</span>
                    <span class="text-label">个</span>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card-h" shadow="never">
                  <template #header>
                    <div class="card-header">
                      <span>ETC供应商</span>
                      <img src="../../../assets/images/ETC.svg" style="width: 20px;height: 20px;"/>
                    </div>
                  </template>
                  <div class="text-item">
                    <span class="text-label">总数量</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;">{{topInfo.etcCount}}</span>
                    <span class="text-label">个</span>
                  </div>
                  <div class="text-item">
                    <span class="text-label">剩余金额</span>
                    <span class="text-label-red" style="padding: 0 5px 0 10px;" v-if="topInfo.etcBalance< 100000">{{topInfo.etcBalance}}</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;" v-if="topInfo.etcBalance>= 100000">{{topInfo.etcBalance}}</span>
                    <span class="text-label">元</span>
                    <span class="text-label-red-12" style="padding: 0 5px 0 10px;" v-if="topInfo.etcBalance< 100000"><el-icon style="color:red;"><Bottom/></el-icon>低</span>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card-h" shadow="never">
                  <template #header>
                    <div class="card-header">
                      <span>修理厂</span>
                      <img src="../../../assets/images/garage.svg" style="width: 20px;height: 20px;"/>
                    </div>
                  </template>
                  <div class="text-item">
                    <span class="text-label">总数量</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;">{{topInfo.repairCount }}</span>
                    <span class="text-label">个</span>
                  </div>
                  <div class="text-item">
                    <span class="text-label">维修金额</span>
                    <span class="text-label-red" style="padding: 0 5px 0 10px;" v-if="topInfo.repairSumMonth> 200000">{{topInfo.repairSumMonth}}</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;" v-if="topInfo.repairSumMonth<= 200000">{{topInfo.repairSumMonth}}</span>
                    <span class="text-label">元</span>
                    <span class="text-label-red-12" style="padding: 0 5px 0 10px;" v-if="topInfo.etcBalance> 200000"><el-icon style="color:red;"><Top/></el-icon>高</span>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card-h" style="padding: 10px;" shadow="never">
                  <div class="text-item">
                    <span class="text-label-black">保险公司</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;">{{ topInfo.insuranceCount }}</span>
                    <span class="text-label">个</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 20px;">{{ topInfo.insuranceSumMonth }}</span>
                    <span class="text-label">元/月</span>
                  </div>
                  <div class="text-item">
                    <span class="text-label-black">挂车租赁公司</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;">{{ topInfo.leaseCount }}</span>
                    <span class="text-label">个</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 20px;">{{ topInfo.leaseSumMonth }}</span>
                    <span class="text-label">元/月</span>
                  </div>
                  <div class="text-item">
                    <span class="text-label-black">固定停车场</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 10px;">{{ topInfo.parkingCount }}</span>
                    <span class="text-label">个</span>
                    <span class="text-label-blue" style="padding: 0 5px 0 20px;">{{ topInfo.parkingSumMonth }}</span>
                    <span class="text-label">元/月</span>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
          <div style="padding-top: 10px;">
            <el-card class="supplierClass" shadow="never">
              <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="加油站" name="gas"><gas @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
                <el-tab-pane label="ETC供应商" name="etc"><etc @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
                <el-tab-pane label="修理厂" name="repair"><repair @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
                <el-tab-pane label="保险公司" name="insurance"><insurance @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
                <el-tab-pane label="挂车租赁公司" name="trailer"><trailer @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
                <el-tab-pane label="固定停车场" name="park"><park @paramsFn="paramsFn" @disableClick="disableClick"/></el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </div>
        <div v-if="importFlg">
            <el-card class="procurementClass" shadow="never" style="height:85vh;">
              <importSlot :title="state.title" :apiFn="state.apiFn" :downFn="state.downFn" :downloadType="state.downloadType" @returnList="returnList"></importSlot>
            </el-card>
          </div>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import gas from './gas.vue'
import etc from './etc.vue'
import repair from './repair.vue'
import insurance from './insurance.vue'
import trailer from './trailer.vue'
import park from './park.vue'
import importSlot from "@/views/Import/index.vue"
import {getSupplierStat} from "@/api/supplier/index"
import { Top, Bottom }  from '@element-plus/icons-vue'
defineOptions({
  name: "supplier",
  inheritAttrs: false,
});
const importFlg = ref(false)
const emit = defineEmits(['paramsFn'])
const state = reactive({
  configData: {},
  title: '',
  apiFn: undefined,
  downFn: undefined,
  downloadType: '',
})

const topInfo = reactive({
  etcBalance:0,
  etcCount: 0,
  fuelAlarmCount:0,
  etcAlarmCount:0,
  fuelCount:0,
  insuranceCount:0,
  insuranceSumMonth:0,
  leaseCount:0,
  leaseSumMonth:0,
  parkingCount:0,
  parkingSumMonth:0,
  repairCount:0,
  repairSumMonth:0,
  repairAlarmCount:0,
  ureaAlarmCount:0,
})
const activeName = ref('gas')

const getSupplierStatInfo = () => {
  getSupplierStat().then(rs=>{
    Object.assign(topInfo, rs.data)
  })
}

const returnList = () => {
  importFlg.value = !importFlg
}

const paramsFn = (data : any) => {
  state.title = data.title
  state.apiFn = data.importFn
  state.downFn = data.downFn
  state.downloadType = data.downloadType
}

const disableClick = (visible: any) => {
  importFlg.value = visible
}

onMounted(()=>{
  getSupplierStatInfo()
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
:deep(.supplierClass .el-tabs__item){
  font-size: 16px;
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
:deep(.el-tabs__header){
  margin:  0 0 15px 20px;
}
</style>

