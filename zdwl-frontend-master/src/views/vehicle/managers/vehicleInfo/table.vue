<template>
  <el-row v-if="state.button">
    <el-button @click="newBuilt" type="primary" size="default">新建</el-button>
    <el-button @click="importVehicle" size="default">导入</el-button>
    <el-button @click="exportVehicle" size="default">导出</el-button>
    <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
      <template #reference>
        <!-- <el-button key="text" type="text">删除</el-button> -->
        <el-button size="default">删除</el-button>
      </template>
    </el-popconfirm>
  </el-row>
  <el-table
    :data="props.tableData"
    v-loading="state.loading"
    :max-height="height"
    @row-click="rowClick"
    @sort-change="sortChange"
    style="width: 100%; margin-top: 16px"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      v-for="item in table"
      :key="item.prop"
      :type="item.type"
      :width="item.width"
      :prop="item.prop"
      :sortable="item.template === 'timeSort' ? 'custom' : false"
      :align="item.align"
      :label="item.label"
    >
      <template #default="scope" v-if="item.template === 'signStatus'">
        <span
          class="round"
          :class="'signStatusColor' + scope.row.signStatus"
        ></span>
        {{ fileSign(scope.row.signStatus) }}
      </template>
      <template #default="scope" v-if="item.template === 'time'">
        {{ fileTime(scope.row[item.prop]) }}
      </template>
      <template #default="scope" v-if="item.template === 'timeSort'">
        {{ fileTime(scope.row[item.prop]) }}
      </template>
      <template #default="scope" v-if="item.template === 'status'">
        <span class="round" :class="'roundColor' + scope.row.status"></span
        >{{ fileStatus(scope.row.status) }}
      </template>
      <template #default="scope" v-if="item.template === 'powerTypeCode'">
        {{ filespowerType(scope.row.powerTypeCode) }}
      </template>
      <template #default="scope" v-if="item.template === 'fileDate'">
        <span :class="fileDate(scope.row[item.prop])">{{
          fileTime(scope.row[item.prop])
        }}</span>
      </template>
      <template #default="scope" v-if="item.template === 'statu'">
        <span
          class="round"
          :class="scope.row[item.prop] == 0 ? 'roundColor0' : 'roundColor1'"
        ></span>
        <span
          :class="
            scope.row[item.prop] == 0 ? 'disabled-color' : 'active-color'
          "
        >
          {{ scope.row[item.prop] == 0 ? "禁用" : "启用" }}
        </span>
      </template>
    </el-table-column>
    <slot></slot>
    <el-table-column prop="action" label="操作" v-if="!state.optionHideen">
      <template #default="scope">
        <el-button
          v-if="state.options && state.options.includes('use')"
          key="text"
          type="text"
          @click.stop="useClick(scope.$index, scope.row)"
          >领用</el-button
        >
        <el-button
          key="text"
          type="text"
          @click.stop="editClick(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-popconfirm
          title="确定要删除吗?"
          @confirm="handleDelete(scope.$index, scope.row)"
        >
          <template #reference>
            <el-button @click.stop key="text" type="text">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { ref, reactive, computed, nextTick } from "vue";
import { inject, defineProps, onBeforeMount } from "vue";
import { dictionary } from "@/store/modules/dictionary";
const height: any = inject("height");
interface Table {
  width: string;
  type: string;
  label: string;
  prop: string;
  template: any;
}

const props = defineProps<{ tableData: any; state: any; tableList: Table[] }>();
const table = props.tableList;
const emit = defineEmits([
  "editClick",
  "handleDelete",
  "importVehicle",
  "exportVehicle",
  "useClick",
  "rowClick",
  "sortChange",
]);
// 排序
const sortChange = (column: any, prop: any, order: any) => {
  emit("sortChange", column, prop, order);
};
// 领用
const useClick = (index: number, row: unknown) => {
  emit("useClick", index, row);
};
// 修改
const editClick = (index: number, row: unknown) => {
  emit("editClick", index, row);
};
// 删除
const handleDelete = (index: number, row: any) => {
  let partId = row.partId ? row.id : null;
  emit("handleDelete", partId, row.id);
};
// 导入
const importVehicle = () => {
  emit("importVehicle");
};
// 导出
const exportVehicle = () => {
  emit("exportVehicle");
};
const rowClick = (row: unknown) => {
  emit("rowClick", row);
};
// 批量删除
interface User {
  date: string;
  name: string;
  address: string;
}

const multipleSelection = ref<User[]>([]);
const batchVehicle = () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  emit("handleDelete", null, arr);
};
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
// 新增
const newBuilt = inject("parentNewBuiltClick");
const fileSign = (sign: string | number) => {
  let signArray = ["未签署", "已签署"];
  return signArray[sign];
};
const fileTime = (time: string) => {
  console.log(time);
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const fileStatus = (val: number) => {
  let status = ["行驶", "静止", "离线", "异常", "未知"];
  return status[val];
};
const fileDate = (time: string) => {
  let data: Date = new Date(time);
  let data2: Date = new Date();
  return Math.round(((data - data2) / (1000 * 60 * 60 * 24)) * 10) / 10 > 9
    ? ""
    : "textClass";
};
const setDictionary = dictionary();
const filespowerType = (val: string) => {
  let status = setDictionary.state.powerType;
  return status[val].label;
};
</script>
<style lang="scss" scoped>
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor3 {
  background: #ff4d4f;
}
.roundColor4 {
  background: #bbbbbb;
}
.roundColor0 {
  background: #3270ff;
}
.roundColor1 {
  background: lightgreen;
}
.roundColor2 {
  background: #ffb608;
}
.color-yellow {
  background: "yellow";
}
.signStatusColor0 {
  background: #ff4d4f;
}
.signStatusColor1 {
  background: #bbbbbb;
}
.textClass {
  color: #ff4d4f;
}

.roundColor1 {
  background: #3270FF;
}
.roundColor0 {
  background: #bbbbbb;
}
</style>
