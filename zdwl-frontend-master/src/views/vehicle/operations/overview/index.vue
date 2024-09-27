<template>
  <div class="app-container">
    <el-container>
      <el-header style="background-color: white;position: relative;">
        <span style="font-size: 12px;color: rgb(181, 181, 181);position: absolute;top: 35%;">当前位置：智能车管
          <span style="padding: 10px;">-</span>
          <span style="color: rgb(181, 181, 181)">智慧运营</span>
          <span style="padding: 10px;">-</span>
          <span style="color:black;">智慧运营</span>
        </span>
      </el-header>
      <el-main>
        <div style="padding-top: 10px;">
          <el-card class="repairsClass">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="黄油" name="butter"></el-tab-pane>
              <el-tab-pane label="轮胎" name="etc"></el-tab-pane>
              <el-tab-pane label="杂项" name="repair"></el-tab-pane>
              <el-tab-pane label="保养" name="insurance"></el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import { Top, Bottom }  from '@element-plus/icons-vue'
defineOptions({
  name: "repairs",
  inheritAttrs: false,
});

const state = reactive({
  configData: {}
})

const activeName = ref('gas')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // switch (tab.props.name) {
  //   case 'gas':
  //     getJsonConfig('./gas.config.json');
  //     break;
  //   case 'etc':
  //     getJsonConfig('./etc.config.json');
  //     break;
  //   case 'repair':
  //     getJsonConfig('./repair.config.json');
  //     break;
  //   case 'insurance':
  //     getJsonConfig('./insurance.config.json');
  //     break;
  //   case 'trailer':
  //     getJsonConfig('./trailer.config.json');
  //     break;
  //   case 'park':
  //     getJsonConfig('./park.config.json');
  //     break;
  //   default:
  //     break;
  // }
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
</style>

