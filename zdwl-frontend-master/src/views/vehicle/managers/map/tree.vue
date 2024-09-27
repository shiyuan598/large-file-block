<template>
  <el-input
    size="default"
    @keyup.enter="searchAll"
    v-model="state.filterText"
    placeholder="车牌号码/车架号码"
  >
    <template #append>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="点我搜索"
       
        placement="top"
      >
        <el-button
          @click="searchAll"
          class="button"
          size="default"
          type="primary"
          :icon="Search"
        />
      </el-tooltip>
    </template>
  </el-input>
  <div class="treeContent">
    <div v-show="state.type" class="backgroun-color"></div>
    <el-tree
      ref="treeRefs"
      node-key="id"
      default-expand-all
      @check="current"
      @node-click="check"
      class="mt-4"
      :data="prop.treeData"
      :props="defaultProps"
      show-checkbox
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node title-size" v-if="data.children">
          <span>{{ node.label }}{{ "(" + data.number + ")" }}</span>
        </span>
        <span class="custom-tree-node" v-else>
          <span>{{ data.card }}</span>
          <span class="card">
            <el-tag class="ml-2" :type="getType(data.status)" size="small">{{
              fileStatus(data.status)
            }}</el-tag>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive, watch, watchEffect } from "vue";
import { Search } from "@element-plus/icons-vue";
import { TreeData } from "@/api/vehicleInfo/types";
import { debounce } from "lodash-es";
interface State {
  keys: number[];
  treeData: TreeData[];
  filterText: string;
  expanded: number[];
  type: boolean;
}
const state: State = reactive({
  keys: [],
  treeData: [],
  filterText: "",
  expanded: [10001],
  type: false,
});
const emits = defineEmits(["current", "check", "searchAll", "serach"]);
const current = (data: any, value: any) => {
  emits("current", value);
};
const check = (tree: any) => {
  tree.card &&
    (tree.status === 4
      ? ElMessage("暂时无法获取gps位置，请再次尝试搜索")
      : emits("check", tree));
};
const gettreeRefs = () => {
  state.type = true;
};
const prop = defineProps({
  treeData: {
    type: Array,
    default: [],
  },
  keys: {
    type: Array,
    default: [],
  },
});
const defaultProps = {
  children: "children",
  label: "name",
  disabled: "disabled",
};

const setTreeRefs = () => {
  treeRefs.value!.setCheckedKeys(prop.keys);
};
const inputClick = debounce(() => {
  emits("serach", state.filterText);
}, 1000);
const getType = (val: number) => {
  let status = ["", "success", "danger", "warning", "info"];
  return status[val];
};
const fileStatus = (val: number) => {
  let status = ["行驶", "静止", "离线", "异常", "未知"];
  return status[val];
};
const treeRefs = ref<InstanceType<typeof ElTree>>();

const searchAll = () => {
  // emits("searchAll");
  emits("serach", state.filterText);
};
defineExpose({
  setTreeRefs,
});
</script>
<style scoped lang="scss">
.button {
  background: #3270ff !important;
  border-radius: 0;
  :deep(.el-icon) {
    color: #fff !important;
  }
}
.el-tree {
  background: transparent;
}
:deep(.el-tree-node__content) {
  color: #303030;
  font-size: 12px;
  font-weight: 400;
  margin-top: 6px;
}

.backgroun-color {
  width: 242px;
  height: 32px;
  background: rgba(50, 112, 255, 0.09);
  position: absolute;
  top: 12px;
}
.title-size {
  font-size: 13px;
}
.treeContent {
  height: calc(100% - 30px);
  overflow: auto;
  padding-right: 10px;
  position: relative;
}
</style>
