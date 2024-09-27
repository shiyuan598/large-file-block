<template>
     <el-table
          ref="multipleTableRef"
          :data="tableData"
          style="width: 100%"
          header-cell-class-name="headclass"
          v-loading="state.loading"
          show-overflow-tooltip="true"
          :max-height="600"
          border
          tooltip-effect="light"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column fixed prop="orderUuid" label="订单编号" />
          <el-table-column fixed prop="status" label="核销状态">
            <template #default="scope">
              <div v-if="scope.row.status == 0" style="display: flex">
                <el-badge is-dot class="warning"></el-badge>未付款
              </div>
              <div v-if="scope.row.status == 1" style="display: flex">
                <el-badge is-dot class="blueS"></el-badge>已付款
              </div>
              <div v-if="scope.row.status == 2" style="display: flex">
                <el-badge is-dot class="untreated"></el-badge>已核销
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="订单日期" sortable>
            <template #default="scope">
              {{ dayjs(scope.row.date).format("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column prop="upDriver" label="司机姓名" />
          <el-table-column label="线路">
            <template #default="scope">
              {{ scope.row.route }}({{ scope.row.project }})
            </template>
          </el-table-column>
          <el-table-column prop="upTractor" label="车牌号" />
          <el-table-column label="司机提成(元)" align="center">
            <el-table-column prop="upAmount" label="标准" align="right" />
            <el-table-column prop="realAmount" label="付款" align="right">
              <template #default="scope">
                <el-tooltip
                  :content="scope.row.remark"
                  placement="top-start"
                  effect="light"
                >
                  {{ scope.row.realAmount }}
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="expandFee" label="补扣款(元)" align="right" />
          <el-table-column prop="plateAmount" align="right">
            <template v-slot:header>
              <span>平台付款</span>
              <el-tooltip
                content="实际付款*1.056"
                placement="top-start"
                effect="light"
              >
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
         
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
import dayjs from "dayjs";
import {
  getDriverPage,
} from "@/api/highSpeedLine/platformLedger/index";
const props = defineProps(["relationIds","driverCode"]);
const state = reactive({
    loading: false,
    total:0
})
const tableData = ref([])
const multipleSelection = ref([]);
const handleSelectionChange = (val: never[]) => {
  multipleSelection.value = val;
};

const queryParams = reactive({
  orderDateSort: "desc",
  orderCodes: props.relationIds,
  pageSize: 10,
  pageNum: 1,
  driverCode: props.driverCode
});
const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.orderDateSort = "asc";
  } else {
    queryParams.orderDateSort = "desc";
  }
  handleQuery();
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
  getDriverPage(queryParams)
    .then((rs: any) => {
      tableData.value = [];
      Object.assign(tableData.value, rs.data.list);
      state.total = rs.data.total;
    })
    .finally(() => {
      state.loading = false;
    });
};
onMounted(()=>{
    handleQuery();
})
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

  .blueS {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: blue !important;
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