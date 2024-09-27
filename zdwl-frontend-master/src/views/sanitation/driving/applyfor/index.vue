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
        <el-breadcrumb-item :to="{ path: '/sanitation/self/configuration' }"
          ><span style="color: #8c8c8c">无人环卫</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/sanitation/driving/statistics' }"
          ><span style="color: #8c8c8c">远程驾驶</span></el-breadcrumb-item
        >
        <el-breadcrumb-item @click="onClick"
          ><span :style="state.newBuilt ? 'color:#8c8c8c' : 'color:#303030'"
            >调度申请单</span
          ></el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="state.newBuilt"
          ><span style="color: #303030">新增</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi" v-if="!state.newBuilt">
      <el-tabs
        v-model="state.orderType"
        class="demo-tabs"
      >
        <el-tab-pane label="未完成" name="0">
          <Incomplete
            v-if="state.orderType === '0'"
            @newBuiltClick="newBuiltClick"
            @editClickRow="editClickRow"
            :form="form"
            :list="list"
          ></Incomplete>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="1">
          <Completed
            v-if="state.orderType === '1'"
            @newBuiltClick="newBuiltClick"
            :form="form"
            :list="list"
          ></Completed>
        </el-tab-pane>
      </el-tabs>
    </div>
    <NewBuilt
      v-if="state.newBuilt"
      :rowList="rowList"
      @bulitClick="bulitClick"
    ></NewBuilt>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive, provide } from "vue";
import { DispatchForm, NewSate } from "@/api/sanitation/type";
import { listDriver } from "@/api/sanitation";
import Incomplete from "./incomplete.vue";
import Completed from "./completed.vue";
import NewBuilt from "./newBuilt.vue";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 310;
});
provide("height", setHeight);
const form = reactive<DispatchForm>({
  pageNum: 1,
  pageSize: 10,
  vehCode: "",
  cockpitCode: "",
  driverName: "",
  dateFrom: "",
  dateTo: "",
  type: "",
  picker: [],
});
const driverList = ref([]);
const list = reactive([
  {
    type: "input",
    label: "车辆编码",
    prop: "vehCode",
    placeholder: "请输入车辆编码",
  },
  {
    type: "selectValue",
    label: "驾驶员姓名",
    prop: "driverName",
    placeholder: "请选择驾驶员姓名",
    optionList: driverList.value,
  },
  {
    type: "picker",
    label: "创建日期",
    prop: "picker",
    format: "YYYY-MM-DD HH:mm:ss",
    defaultTime: true,
    placeholder: "请选择日志日期",
  },
  {
    type: "selectValue",
    label: "单据类型",
    prop: "type",
    placeholder: "请选择单据类型",
    optionList: [
      {
        label: "草稿",
        value: "0",
      },
      {
        label: "已提交",
        value: "1",
      },
      {
        label: "进行中",
        value: "2",
      },
    ],
  },
  {
    type: "row",
  },
]);
const state = reactive({
  orderType: "0",
  newBuilt: false,
});
onMounted(() => {
  getListDriver();
});

const getListDriver = async () => {
  try {
    const { data } = await listDriver();
    const list: any = [];
    data.map((n: any) => {
      list.push({ label: n.driverName, value: n.id });
    });
    Object.assign(driverList.value, list);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const onClick = () => {
  state.newBuilt = false;
};
let rowList = reactive({} as unknown as NewSate);
const editClickRow = (row: any) => {
  rowList = row;
  state.newBuilt = true;
};
const bulitClick = (val: string) => {
  // if(val==='getList'){

  // }
  state.newBuilt = false;
};
const newBuiltClick = () => {
  rowList = {} as unknown as NewSate;
  state.newBuilt = true;
};
</script>
<style scoped lang="scss">
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
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
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}
:deep(.el-form-item--default) {
  margin-bottom: 32px;
}
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
 
  :deep(.newDialogClass .el-dialog__body){
    padding-top: 0;
    padding-bottom: 0;
  }

</style>
