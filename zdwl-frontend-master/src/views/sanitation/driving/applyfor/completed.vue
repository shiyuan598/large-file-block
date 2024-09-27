<template>
  <Form
    class="hide-form"
    :formModel="props.form"
    :fromList="props.list"
    ref="formList"
    @searchInput="searchInput"
    @onSubmit="onSubmit"
  >
    <template #formSlot> </template>
  </Form>
  <el-row>
    <el-button @click="newBuilt" type="primary" size="default">新建</el-button>
  </el-row>
  <el-table
    :data="tableData"
    v-loading="state.loading"
    size="default"
    row-key="id"
    :show-overflow-tooltip="true"
    :max-height="height"
    style="width: 100%; margin-top: 16px"
  >
    <el-table-column width="200" prop="code" label="调度单编号" />
    <el-table-column width="" prop="dispatchType" label="单据类型" ><template #default="scope">
        {{ filterDispatchType(scope.row.dispatchType) }}
      </template>
    </el-table-column>
    <el-table-column width="" prop="cockpitCode" label="台架编码" />
    <el-table-column width="" prop="vehCode" label="车辆编号" />
    <el-table-column width="" prop="driverName" label="安全员姓名" />
    <el-table-column width="330" prop="" label="运行时间" >
      <template #default="scope">
        {{ scope.row.rdStartTime }} -- {{ scope.row.rdEndTime }}
      </template>
    </el-table-column>

    <el-table-column width="" prop="runTime" label="运行时长" />
    <el-table-column width="180" prop="createTime" label="创建时间" />
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
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive, inject } from "vue";
import { StatusForm, DispatchForm } from "@/api/sanitation/type";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { dispatchPageFinish } from "@/api/sanitation";
const height: any = inject("height");
const state = reactive({
  loading: false,
  total: 0,
});
const emit = defineEmits(["newBuiltClick"]);
onMounted(() => {
  getStatList();
});
const props = defineProps<{ form: DispatchForm; list: any[] }>();
const tableData: any = ref([]);
// 列表查询
const getStatList = async () => {
  state.loading = true;
  let parmers = {} as unknown as DispatchForm;
  Object.assign(parmers, props.form);
  parmers.dateFrom = props.form.picker[0];
  parmers.dateTo = props.form.picker[1];
  parmers.picker = [];
  try {
    const { data } = await dispatchPageFinish(parmers);
    tableData.value = data.records;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const searchInput = () => {
  getStatList();
};

const onSubmit = () => {
  getStatList();
};
const handleUseSizeChange = (value: number) => {
  props.form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  props.form.pageNum = value;
  getStatList();
};
const filterDispatchType = (val: any) => {
  let list = [
    {
      key: "手工建单",
      value: "1",
    },
    {
      key: "自动建单",
      value: "2",
    },
  ];
  return list.filter((n) => n.value === val)[0].key;
};
const newBuilt = () => {
  emit("newBuiltClick");
};
</script>
