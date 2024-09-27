<template>
  <div class="flex-ev">
    <div class="flex-ev-top">
      <div class="flex-tag tag-green">空闲中</div>
      <el-avatar style="margin: 12px" :size="50" :src="circleUrl" />
      <div>
        <div class="flex-license mt-14px">苏E12345</div>
        <div>
          <el-text class="w-180px flex-types" truncated
            >18T洗扫一体车/解放J6V/纯电22</el-text
          >
        </div>
      </div>
    </div>
    <div class="flex-map-content mt-14px">
        <LineMap></LineMap>
    </div>
    <div class="flex-button mt-14px cursor-pointer">创建任务</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import LineMap from "../self/line/map.vue"
const state = reactive({
  circleUrl:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  type: "",
});

const { circleUrl } = toRefs(state);
</script>
<style scoped lang="scss">
.flex-ev {
  width: 286px;
  height: 378px;
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  border: 1px solid #e4e4e4;
  padding: 14px;
}
.flex-ev-top {
  position: relative;
  height: 78px;
  background: linear-gradient(
    270deg,
    rgba(205, 220, 255, 0.88) 0%,
    rgba(205, 220, 255, 0.57) 13%,
    rgba(205, 228, 255, 0.15) 100%
  );

  border-radius: 4px;
  border: 1px solid rgba(215, 226, 255, 0.32);
  display: flex;
}
.flex-license {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #303030;
  line-height: 22px;
  text-align: left;
}
.flex-types {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #606060;
  line-height: 22px;
  text-align: left;
  width: 100%;
}
.flex-tag {
  width: 52px;
  height: 22px;
  border-radius: 0px 4px 0px 4px;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  text-align: center;
}
.tag-green {
  background: #c7fdca;
  color: #31a90b;
}
.tag-green {
  background: #c7fdca;
  color: #31a90b;
}
.tag-blue {
  background: #d3dffc;
  color: #3270ff;
}
.tag-yellow {
  background: #fff2e6;
  color: #f07f07;
}
.flex-map-content {
  width: 258px;
  height: 206px;
}
.flex-button{
    width: 100%;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background: #3270FF;
}
</style>
