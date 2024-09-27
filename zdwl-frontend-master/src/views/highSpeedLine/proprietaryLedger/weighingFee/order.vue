<template>
  <el-table
    :data="tableData"
    v-loading="state.loading"
    size="default"
    @sort-change="sortChange"
    tooltip-effect="light"
    style="width: 100%; margin-top: 16px"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column width="144" prop="uuid" fixed label="订单编号" />
    <el-table-column prop="costDriverStatus" width="90" label="结算状态">
      <template #default="scope">
        {{ fileDriverStatus(scope.row.costDriverStatus) }}
      </template>
    </el-table-column>
    <el-table-column prop="" width="90" label="订单状态">
      <template #default="scope">
        <span class="round" :class="'roundColor' + scope.row.status"></span
        >{{ fileStatus(scope.row.status) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="orderDate"
      :show-overflow-tooltip="true"
      sortable="custom"
      width="110"
      label="订单日期"
    >
      <template #default="scope">
        {{ fileTime(scope.row.orderDate) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="route"
      :show-overflow-tooltip="true"
      width="210"
      label="路线名称"
    >
      <template #default="scope">
        {{ scope.row.route }}({{ scope.row.project }})
      </template>
    </el-table-column>
    <el-table-column
      prop="customer"
      :show-overflow-tooltip="true"
      width="110"
      label="客户名称"
    />
    <el-table-column prop="tractor" width="100" label="车牌号码" />
    <el-table-column prop="firstDriver" width="90" label="主驾">
      <template #default="scope">
        {{ scope.row.firstDriver }}
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="scope.row.firstDriverPhone"
          placement="right"
        >
          <el-icon><Iphone /></el-icon>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="secondDriver" width="90" label="副驾">
      <template #default="scope">
        {{ scope.row.secondDriver }}
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="scope.row.secondDriverPhone"
          placement="right"
        >
          <el-icon v-show="scope.row.secondDriverPhone"><Iphone /></el-icon>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="里程（KM）" align="center">
      <el-table-column
        prop="upMileage"
        label="标准"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="gpsMileage"
        label="实际"
        width="100"
        align="center"
      >
      </el-table-column>
    </el-table-column>
    <el-table-column label="油量计算(L)" align="center">
      <el-table-column
        prop="referenceFuelNum"
        label="参考"
        align="center"
      ></el-table-column>
      <el-table-column prop="useFuelNum" label="实际" align="center">
        <!-- <template #default="scope">
                <el-button
                  @Click="numClick(scope.row.uuid)"
                  type="primary"
                  link
                  >{{ scope.row.useFuelNum }}</el-button
                >
              </template> -->
      </el-table-column>
    </el-table-column>

    <el-table-column prop="orderType" width="90" label="订单类型">
      <template #default="scope">
        {{ fileType(scope.row.orderType) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="route"
      :show-overflow-tooltip="true"
      width="82"
      label="运输类型"
    >
      <template #default="scope">
        {{ scope.row.tranType }}
      </template>
    </el-table-column>
    <el-table-column prop="startTime" width="164" label="发车时间" />
    <el-table-column prop="endTime" width="164" label="到达时间" />

    <el-table-column label="时效（分钟）" align="center">
      <el-table-column
        prop="upTime"
        label="标准"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="downTime"
        label="实际"
        align="center"
      ></el-table-column>
    </el-table-column>
    <el-table-column
      label="创建时间"
      width="200"
      align="center"
      prop="createTime"
    ></el-table-column>
  </el-table>
  <el-row class="pagination-style" justify="end">
    <el-pagination
      background
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="handleUseSizeChange"
      @current-change="handleUseCurrentChange"
      :pager-count="5"
      :page-sizes="[10, 20, 30, 40, 100]"
      :total="state.total"
    />
  </el-row>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { dispatchOrder } from "@/api/depreciation";
const props = defineProps(["relationIds"]);
const tableData: any = ref([]);
const state = reactive({
  loading: false,
  total: 0,
});
const form = reactive({
  pageNum: 1,
  pageSize: 10,
  orderDateSort: "",
  orderCodes: props.relationIds.join(","),

});
const sortChange = (column: any) => {
  form.orderDateSort = column.order
    ? column.order === "descending"
      ? "asc"
      : "desc"
    : "";
  getStatList();
};
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await dispatchOrder(form);
    state.total = data.total;
    tableData.value = data.list;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const fileDriverStatus = (val: number) => {
  let status = ["未结算", "已结算"];
  return status[val];
};
const fileStatus = (val: number) => {
  let status = ["已创建", "已下发", "已发车", "已到达"];
  return status[val];
};
const fileType = (val: number) => {
  let status = ["手动", "自动"];
  return status[val];
};
const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const numId = ref("");
const numClick = (id: string) => {
  numId.value = id;
  state.feeOilAppear = true;
};
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
onMounted(() => {
  getStatList();
});
</script>
<style scoped lang="scss"></style>
