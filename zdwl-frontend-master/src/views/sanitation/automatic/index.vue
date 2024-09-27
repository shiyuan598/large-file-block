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
          ><span style="color: #8c8c8c">无人环卫</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span style="color: #303030">无人化调度2</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="flex-height" ref="vehi">

      <Trajectory :key="index+'index'" v-for="(item,index) in 12"></Trajectory>
    </div>
  </div>
</template>
<script setup lang="ts">
import Trajectory from "./trajectory.vue"
</script>
<style scoped lang="scss">
.scope-icon {
  :deep(.el-icon) {
    vertical-align: middle;
  }
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
:deep(.newDialogClass .el-dialog__body) {
  padding: 10px var(--el-dialog-padding-primary);
}
:deep(.el-table thead th) {
  background: #f6f9ff;
  color: #303030;
}
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
.flex-height {
  height: calc(100% - 82px);
  margin: 16px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 286px);
  grid-gap: 16px;
  overflow: auto;
  justify-content: center;
}

</style>
