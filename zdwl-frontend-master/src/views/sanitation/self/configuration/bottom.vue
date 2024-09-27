<template>
    <div class="button-flex mt-24px">
      <!-- <el-button class="button" type="primary" plain>前往作业区</el-button>
      <el-button class="button" type="primary" plain>前往休息区</el-button>
      <el-button class="button" type="primary" plain>前往充电区</el-button>
      <el-button class="button" type="primary" plain>前往加水区</el-button>
      <el-button class="button" type="primary" plain>前往污水区</el-button>
      <el-button class="button" type="primary" plain>前往垃圾倾倒区</el-button>
      <el-button class="button" type="primary" plain>一键返回</el-button> -->
      <!-- <el-button class="button" >Default</el-button> -->
      <div class="button" :class="state.index === index ? 'active-button-color' : ''" @click="clickButton(item,index)" v-for="(item,index) in buttonList">{{ item.text }}</div>
      <!-- <el-button type="primary"></el-button> -->
    </div>
</template>
<script setup lang="ts">
import {
  putRouter,
} from "@/api/sanitation/index";
import {ref,reactive,watch} from 'vue';
import { InjectList } from "@/api/sanitation/type";
const buttonList = ref([
{
  url:'/api/v1/ems/vehicleRouteSetting/toGo/',
  text:'自动驻车'
 }
//,{
//   url:'/api/v1/ems/vehicleRouteSetting/toWorkArea/',
//   text:'前往作业区'
// },
// {
//   url:'/api/v1/ems/vehicleRouteSetting/toRestArea/',
//   text:'前往休息区'
// },
// {
//   url:'/api/v1/ems/vehicleRouteSetting/toChargeArea/',
//   text:'前往充电区'
// },
// // {
// //   url:'/api/v1/ems/vehicleRouteSetting/toWaterArea/',
// //   text:'前往加水区'
// // },
// // {
// //   url:'/api/v1/ems/vehicleRouteSetting/toSewageArea/',
// //   text:'前往排污区'
// // },
// // {
// //   url:'/api/v1/ems/vehicleRouteSetting/toGarbageArea/',
// //   text:'前往垃圾倾倒区'
// // },
// {
//   url:'/api/v1/ems/vehicleRouteSetting/autoReturn/',
//   text:'一键日常作业'
// },
]);

const state = reactive({
  index: -1
})
const interList = <InjectList>inject("injectList");
  // console.log(interList)
  // watch(()=>interList,(val)=>{
  //   console.log(val)
  // })
const clickButton = async(item:any,index:number)=>{
  state.index = index;
  try {
    const { data } = await putRouter(
      item.url,
      interList.value.card
    );
    ElMessage.success(
    '正在'+item.text
    );
  } catch (e: any) {
    ElMessage.error(e.message);
  }
}
</script>
<style lang="scss" scoped>
.button-flex {
  display: flex;
  justify-content: right;
  .button{
    margin-left: 50px
  }
  // justify-content: space-around;
}
// :deep(.el-button--primary.is-link, .el-button--primary.is-plain, .el-button--primary.is-text){
//   --el-button-bg-color: #fff;
// }
.button{
  font-size: 14px;
  color: #3270ff;
  padding: 5px 16px;
  border-radius: 2px;
  border: 1px solid #3270ff;
  cursor: pointer;
  display: inline-block;
}
.active-button-color{
  background: #3270FF;
  color: #fff;
}
</style>