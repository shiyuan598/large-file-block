<template>
  <div class="pane-content">
    <span class="pane-number">司机</span>
    <el-date-picker
      v-model="formParams.startTime"
      format="YYYY-MM-DD"
      style="width: 130px"
      value-format="YYYY-MM-DD"
      date-format="YYYY/MM/DD"
      type="date"
      placeholder="开始时间"
    />
    <span class="text-center"> - </span>
    <el-date-picker
      v-model="formParams.endTime"
      format="YYYY-MM-DD"
      style="width: 130px"
      value-format="YYYY-MM-DD"
      date-format="YYYY/MM/DD"
      type="date"
      placeholder="结束时间"
    />
    <el-button class="ml-32px" type="primary" @click="searchTime"
      >查询</el-button
    >

    <div class="pagination-re float-right w-600px" v-if="state.pagination">
      <el-pagination
        class="pagination"
        size="small"
        background
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @pagination="handleQuery"
        :page-sizes="[20, 30, 40, 100]"
        v-model:total="tableData.length"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
      />
    </div>
    <el-button
      v-if="!state.pagination"
      circle
      class="pagination-button"
      @click="paging"
      :icon="Files"
    ></el-button>
    <el-button
    v-else
      circle
      class="pagination-close"
      @click="paging"
      :icon="Close"
    ></el-button>

    <div class="record">
      <div class="record-le"><TrajectoryMap></TrajectoryMap></div>
      <div class="record-ri">
        <el-table
          :data="tableData"
          border
          show-overflow-tooltip
          height="100%"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="name" label="事件" />
          <el-table-column prop="data" width="160px" label="时间" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import TrajectoryMap from "./components/trajectoryMap.vue";
import { vehEvents } from "@/api/sanitation";
import { Files,Close } from "@element-plus/icons-vue";
const formParams = reactive({
  startTime: "",
  endTime: "",
});
const state = reactive({
  total: 0,
  pagination: false,
});
const queryParams = reactive({
  pageSize: 20,
  pageNum: 1,
});
const tableData = reactive([
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道",
    data: "2024-9-24 13：00",
  },
  {
    name: "变道2",
    data: "2024-9-24 13：00",
  },
]);

const handleSizeChange = (value: number) => {
  queryParams.pageSize = value;
  handleQuery();
};
const handleCurrentChange = (value: number) => {
  queryParams.pageNum = value;
  handleQuery();
};

const handleQuery = () => {};

const paging = () => {
  state.pagination = !state.pagination;
};
onMounted(() => {
  // vehEvents(formParams);
});
const searchTime = () => {};
</script>
<style lang="scss" scoped>
.pane-number {
  color: #303030;
  font-size: 14px;
  margin-right: 8px;
}
.pane-content {
  height: 100%;
}
.record {
  margin-top: 12px;
  height: calc(100% - 32px);

  display: flex;
  justify-content: space-between;
  .record-le {
    flex: 1;
  }
  .record-ri {
    width: 260px;
    margin-left: 10px;
  }
}
.pagination-re {
  position: absolute;
  top: 0;
  right: 20px;
  width: 30px;
  border: 1px solid #cdd0d6;
  height: 46px;
  padding: 6px 20px;
  border-radius: 50px;
  animation: showWidth 0.4s ease forwards;
  .pagination {
    position: absolute;
  }
}
.pagination-button,.pagination-close {
  position: absolute;
  right: 26px;
  top: 7px;
}
@keyframes showWidth {
  0% {
    width: 30px;
    opacity: 0;
  }
  50% {
    width: 330px;
    opacity: 0;
  }
  100% {
    width: 600px;
    opacity: 1;
  }
}
.pagination-close {
  animation: rotate 0.4s ease forwards;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
    opacity: 1;
    visibility: visible;
  }
  100% {
    transform: rotate(270deg) ;
    opacity: 1;
    visibility: visible;
  }
}

</style>
