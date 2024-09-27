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
        <el-breadcrumb-item :to="{ path: '/sanitation/line' }"
          ><span style="color: #8c8c8c">无人环卫</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/sanitation/driving/statistics/' }"
          ><span style="color: #8c8c8c">远程驾驶</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span style="color: #303030">车辆远驾日志</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi">
      <Form
        class="hide-form"
        :formModel="queryParames"
        :fromList="fromList"
        @searchInput="searchInput"
        @onSubmit="onSubmit"
      >
      </Form>
      <el-table
        :data="tableData"
        v-loading="state.loading"
        :max-height="setHeight"
        size="default"
        style="width: 100%; margin-top: 16px"
      >
        <el-table-column width="" prop="vehVin" label="车辆vin" />
        <el-table-column width="" prop="vehEvent" label="事件" />
        <el-table-column width="" prop="eventTime" label="事件时间" />
        <el-table-column width="" prop="createTime" label="创建时间" />
      </el-table>
      <el-row class="pagination-style" justify="end">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes, jumper"
          @size-change="handleUseSizeChange"
          @current-change="handleUseCurrentChange"
          :pager-count="5"
          :page-sizes="[10, 20, 30, 40]"
          :total="state.total"
        />
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { LogParmes } from "@/api/sanitation/type";
import { rdLog } from "@/api/sanitation/index";
import { useElementSize } from "@vueuse/core";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 210;
});
const state = reactive({
  dialogVisible: false,
  title: "",
  loading: false,
  total: 0,
  
});
const queryParames = ref<LogParmes>({
  pageNum: 1,
  pageSize: 10,
  picker: [],
  // 车辆win码
  vehVin: "",
  event: "",
  dateFrom: "",
  dateTo: "",
});

onMounted(() => {
  getStatList();
});
const tableData: any = ref([]);
// 列表查询
const getStatList = async () => {
  state.loading = true;
  let parmers  = {} as unknown as LogParmes;
  Object.assign(parmers,queryParames.value);
  parmers.dateFrom = queryParames.value.picker[0];
  parmers.dateTo = queryParames.value.picker[1];
  parmers.picker = [];
  try{
    const { data } = await rdLog(parmers);
    tableData.value = data.records;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    state.loading = false;
    ElMessage(e.message);
  }
};
const searchInput = () => {
  getStatList();
};

const onSubmit = () => {
  getStatList();
};
const fromList = reactive([
  {
    type: "input",
    label: "车辆vin",
    prop: "vehVin",
    placeholder: "请输入车辆vin",
  },
  {
    type: "input",
    label: "事件名称",
    prop: "event",
    placeholder: "请输入事件名称",
  },
  {
    type: "picker",
    label: "创建日期",
    prop: "picker",
    format:'YYYY-MM-DD HH:mm:ss',
    placeholder: "请选择日志日期",
  },
  {
    type: "row",
  },
  {
    type: "row",
  },
]);

const handleUseSizeChange = (value: number) => {
  queryParames.value.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  queryParames.value.pageNum = value;
  getStatList();
};
</script>
<style scoped lang="scss">
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
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
</style>
