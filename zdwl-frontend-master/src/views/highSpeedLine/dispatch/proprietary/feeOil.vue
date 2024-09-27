<template>
  <el-table
    ref="multipleTableRef"
    :data="state.tableData"
    style="width: 100%"
    header-cell-class-name="headclass"
    v-loading="state.loading"
    border
    :show-overflow-tooltip="true"
    tooltip-effect="light"
    @sort-change="sortChange"
  >
    <el-table-column fixed prop="orderUuid" label="订单编号" width="170">
      <template #default="scope">
        <el-input
          @change="(value:number )=>gpsMileageInput(value,scope.row)"
          @keyup.enter="handleEnter"
          v-model="scope.row.orderUuid"
          placeholder="里程"
        />
      </template>
    </el-table-column>
    <el-table-column prop="status" label="核销状态" width="100">
      <template #default="scope">
        <span class="round" :class="'roundColor' + scope.row.status"></span
        >{{ fileStatus(scope.row.status) }}
      </template>
    </el-table-column>
    <el-table-column prop="orderDate" label="订单日期" width="120" sortable>
      <template #default="scope">
        {{ dayjs(scope.row.orderDate).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column prop="upTractor" label="车牌号" width="100" />
    <el-table-column label="核销金额(元)" align="center">
      <el-table-column prop="upAmount" label="标准" align="right" width="100" />
      <el-table-column prop="amount" label="核销" align="right" width="100" />
    </el-table-column>
    <el-table-column prop="route" label="路线名称" width="300">
      <template #default="scope">
        <span v-if="scope.row.route != ''"
          >{{ scope.row.route }}({{ scope.row.project }})</span
        >
      </template>
    </el-table-column>
    <el-table-column prop="date" label="加油日期" width="110">
      <template #default="scope">
        {{ dayjs(scope.row.date).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column prop="location" label="加油点" width="120" />
    <el-table-column prop="supplierFuel" label="供应商" width="300" />
    <el-table-column label="加油单价(元/L)" align="center">
      <el-table-column prop="upPrice" label="标准" align="right" width="100" />
      <el-table-column prop="usePrice" label="核销" align="right" width="100" />
    </el-table-column>
    <el-table-column label="加油量(L)" align="center">
      <el-table-column prop="upNum" label="标准" align="right" width="100" />
      <el-table-column prop="useNum" label="核销" align="right" width="100" />
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
    <el-table-column prop="updateTime" label="更新时间" width="170" />
    <!-- <el-table-column prop="action" label="操作">
            <template #default="scope">
              <el-button key="text" type="text" @click="editClick(scope.$index, scope.row)">编辑</el-button>
              <el-button key="text" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button key="text" type="text" @click="handleClick(scope.$index, scope.row)" v-if="scope.row.handleStatus == '0'">处理</el-button>
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
<script setup lang="ts">
import { toRefs, defineProps, onMounted, computed, reactive, ref, defineEmits } from "vue";
import dayjs from "dayjs";
import {
  getFuelPage,
  getFuelStat,
  fuelUpdate
} from "@/api/highSpeedLine/platformLedger/index";
import { fuelQuery } from "@/api/highSpeedLine/platformLedger/types";
const props = defineProps(["numId"]);
const emit = defineEmits(["upload"])
const state = reactive({
  loading: false,
  total: 0,
  tableData: [],
});
const queryParams = reactive<fuelQuery>({
  pageNum: 1,
  pageSize: 10,
  orderUuid: props.numId,
});
const totalInfo = ref({
  amount: 0,
  upAmount: 0,
  upNum: 0,
  useNum: 0,
});
const getFuelStatInfo = () => {
  getFuelStat(queryParams).then((rs) => {
    Object.assign(totalInfo.value, rs.data);
  });
};
const handleQuery = () => {
  state.loading = true;
  getFuelPage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      state.total = rs.data.total;
      //   getFuelStatInfo();
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
const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.orderDateSort = "asc";
  } else {
    queryParams.orderDateSort = "desc";
  }
  handleQuery();
};
const fileStatus = (val: number) => {
  let status = ["未对账", "已核销", "已对账"];
  return status[val];
};
const handleEnter = (val: any) => {
  val.target.blur();
};
const gpsMileageInput = async (value: number, row: any) => {
  let parmers = {
    orderUuid: row.orderUuid,
    id: row.id,
  };
  try {
    const { data } = await fuelUpdate(parmers);
    emit('upload');
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

onMounted(() => {
  queryParams.orderDateSort = "desc";
  // queryParams.fuelType = "0";
  handleQuery();
});
</script>
<style scoped lang="scss">
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor0 {
  background: #bbbbbb;
}
.roundColor3 {
  background: #3270ff;
}
.roundColor1 {
  background: #ffb608;
}
.roundColor2 {
  background: green;
}
</style>
