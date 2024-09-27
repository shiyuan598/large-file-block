<template>
  <el-table
    ref="multipleTableRef"
    :data="state.tableData"
    style="width: 100%"
    header-cell-class-name="headclass"
    v-loading="state.loading"
    @selection-change="handleSelectionChange"
    border
    :show-overflow-tooltip="true"
    tooltip-effect="light"
    @sort-change="sortChange"
  >
    <el-table-column fixed type="selection" width="55" />
    <el-table-column fixed prop="orderUuid" label="订单编号" width="150" />
    <el-table-column prop="status" label="状态">
      <template #default="scope">
        <div v-if="scope.row.status == '0'" style="display: flex">
          <el-badge is-dot class="untreated"></el-badge>未通过
        </div>
        <div v-if="scope.row.status == '1'" style="display: flex">
          <el-badge is-dot class="greenS"></el-badge>已通过
        </div>
        <div v-if="scope.row.status == '2'" style="display: flex">
          <el-badge is-dot class="processed"></el-badge>已驳回
        </div>
        <div v-if="scope.row.status == '3'" style="display: flex">
          <el-badge is-dot class="warning"></el-badge>已付款
        </div>
        <div v-if="scope.row.status == '4'" style="display: flex">
          <el-badge is-dot class="untreated"></el-badge>已核销
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="orderDate" label="订单日期" width="110" sortable>
      <template #default="scope">
        {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column prop="upTractor" label="车牌号码" />
    <el-table-column prop="upDriver" label="司机名称" />
    <el-table-column
      prop="amount"
      label="垫付费用（元）"
      align="right"
      width="130"
    />
    <el-table-column prop="type" label="费用类型" />
    <el-table-column prop="date" label="费用日期">
      <template #default="scope">
        {{ dayjs(scope.row.date).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column prop="location" label="地点" />
    <el-table-column prop="fileName" label="费用附件">
      <template #default="scope">
        <div v-if="scope.row.fileName != '-'">
          <button @click="showImg(scope.row.file)">附件</button>
        </div>
        <div v-else>{{ scope.row.fileName }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="route" label="路线名称" width="300">
      <template #default="scope">
        <span v-if="scope.row.route != ''"
          >{{ scope.row.route }}({{ scope.row.project }})</span
        >
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="备注" />
    <!-- <el-table-column prop="action" label="操作">
                    <template #default="scope">
                      <el-button
                        key="text"
                        type="text"
                        @click="handleClick(scope.$index, scope.row)"
                        :disabled="scope.row.handleStatus != '0'"
                        >审批</el-button
                      >
                    </template>
                  </el-table-column> -->
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
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { getExpensePage } from "@/api/highSpeedLine/platformLedger/index";
import { preview, vPreview, Vue3ImagePreview } from "vue3-image-preview";
import dayjs from "dayjs";
const props = defineProps(["expenseIds"]);
const state = reactive({
  dialogDeleteVisible: false,
  tableData: [],
  loading: false,
  total: 0,
});
const multipleSelection = ref([]);
const handleSelectionChange = (val: never[]) => {
  multipleSelection.value = val;
};
const queryParams = reactive({
  orderDateSort: "",
  expenseIds: props.expenseIds,
  pageSize: 10,
  pageNum: 1,
});
const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.orderDateSort = "asc";
  } else {
    queryParams.orderDateSort = "desc";
  }
  handleQuery();
};
const showImg = (val: any) => {
  preview({
    images: val,
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

const handleQuery = () => {
  state.loading = true;
  getExpensePage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      state.total = rs.data.total;
    })
    .finally(() => {
      state.loading = false;
    });
};
onMounted(() => {
  queryParams.orderDateSort = "desc";
  handleQuery();
});
</script>
<style lang="scss" scoped>

.untreated {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: lightgray !important;
    }
  }
  .warning {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: #ffb608 !important;
    }
  }

  .greenS {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: #6eeb4f !important;
    }
  }
  .blues {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: lightgray !important;
    }
  }
  .processed {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: red;
    }
  }
</style>