<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    header-cell-class-name="headclass"
    v-loading="state.loading"
    border
    show-overflow-tooltip="true"
    tooltip-effect="light"
    @sort-change="sortChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="card" label="车牌号码" />
    <el-table-column prop="accidentTime" label="事故日期" sortable>
      <template #default="scope">
        {{ dayjs(scope.row.accidentTime).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column prop="handleStatus" label="状态">
      <template #default="scope">
        <div v-if="scope.row.handleStatus == '0'" style="display: flex">
          <el-badge is-dot class="processed"></el-badge>未处理
        </div>
        <div v-if="scope.row.handleStatus == '1'" style="display: flex">
          <el-badge is-dot class="untreated"></el-badge>已处理
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="accidentType" label="事故类型" />
    <el-table-column prop="location" label="发生地点" />
    <el-table-column prop="content" label="事故描述" />
    <el-table-column prop="driver" label="驾驶员" />
    <el-table-column prop="result" label="处罚结果" />
    <el-table-column prop="amount" label="自费金额(元)" align="right" />
  </el-table>
  <el-row class="pagination-style" justify="end">
    <el-pagination
      background
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @pagination="handleQuery"
      :pager-count="5"
      :page-sizes="[10, 20, 30, 40, 100]"
      v-model:total="state.total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
    />
  </el-row>
</template>
<script lang="ts" setup>
import { onMounted, computed, reactive, ref } from "vue";
import dayjs from "dayjs";
import {
  getAccidentPage,
} from "@/api/operations/incident/index";
const props = defineProps(["relationIds"]);
const state = reactive({
  loading: false,
  total:0
});
const tableData = ref([]);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  accidentTimeSort: "desc",
  accidentCodes: props.relationIds.join(",")
});
const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.accidentTimeSort = "asc";
  } else {
    queryParams.accidentTimeSort = "desc";
  }
  handleQuery();
};
const handleQuery = () => {
  state.loading = true;
  getAccidentPage(queryParams)
    .then((rs: any) => {
      tableData.value = [];
      Object.assign(tableData.value, rs.data.list);
      state.total = rs.data.total;
    })
    .finally(() => {
      state.loading = false;
    });
};
const handleSizeChange = (value: number) => {
  queryParams.pageSize = value;
  handleQuery();
};
const handleCurrentChange = (value: number) => {
  queryParams.pageNum = value;
  handleQuery();
};
onMounted(()=>{
  handleQuery()
})
</script>
<style scoped lang="scss">
.processed {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: red;
    }
  }
  .untreated {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: lightgray !important;
    }
  }
</style>
