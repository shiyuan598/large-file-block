<template>
  <div class="all-height">
    <Form :formModel="form" :fromList="list" @searchInput="searchInput" @onSubmit="onSubmit">
      <template #formSlot>
        <el-col :span="8"></el-col>
      </template>
    </Form>

    <Table
      :tableList="tableList"
      :state="state"
      @editClick="editClick"
      @handleDelete="handleDelete"
      @importVehicle="importVehicle"
      @exportVehicle="exportVehicle"
      :tableData="tableData"
    ></Table>
    <el-row class="pagination-style" justify="end">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager-count="5"
        :page-sizes="[10, 20, 30, 40, 100]"
        :total="state.total"
      />
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { getTrailerPage, deleteTractor ,importTrailer,trailerTemplate} from "@/api/vehicleInfo";
import { RuleForm, State, AssemblyForm } from "@/api/vehicleInfo/types";
import { exportFile } from "@/utils";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import Table from "@/views/vehicle/managers/vehicleInfo/table.vue";
import { dictionary } from "@/store/modules/dictionary";

const setDictionary = dictionary();

// 查询form
let list: AssemblyForm[] = reactive([]);
// table列表
const tableList = [
  {
    width: "55",
    type: "selection",
    label: "",
    prop: "",
    template: ''
  },
  {
    width: "",
    type: "",
    label: "车牌号码",
    prop: "card",
    template: ''
  },
  {
    width: "",
    type: "",
    label: "车辆品牌",
    prop: "brand",
    template: ''
  },
  {
    width: "",
    type: "",
    label: "车型",
    prop: "model",
    template: ''
  },
  {
    width: "",
    type: "",
    label: "业务场景",
    prop: "business",
    template: ''
  },
  {
    width: "",
    type: "",
    label: "所有权",
    prop: "ownership",
    template: ''
  },
  {
    width: "180",
    type: "",
    label: "车架号码",
    prop: "vin",
    template: ''
  },
];
const state = reactive<State>({
  button: true,
  loading: false,
  total: 0,
  business: [],
  ownership: [],
  apiFn: importTrailer,
  downFn: trailerTemplate,
});
const form = reactive<RuleForm>({
  keywords: "",
  brand: "",
  business: "",
  ownership: "",
  pageNum: 1,
  pageSize: 10,
});
const listOptions = ref([
  {
    type: "input",
    label: "车牌号码",
    labelWidth: 86,
    prop: "keywords",
    placeholder: "请输入车牌号码/车架号码",
  },
  {
    type: "input",
    label: "车辆品牌",
    prop: "brand",
    placeholder: "请输入车辆品牌",
  },
  {
    type: "select",
    label: "业务场景",
    prop: "business",
    placeholder: "请选择业务场景",
    optionList: setDictionary.state.business,
  },
  {
    type: "select",
    label: "车辆所有权",
    labelWidth: 86,
    prop: "ownership",
    placeholder: "请选择车辆所有权",
    optionList: setDictionary.state.ownership,
  },
])
const setList = () => {
  Object.assign(list,listOptions.value)
}
onMounted(() => {
  getStatList();
  list = listOptions.value
});
const searchInput = ()=>{
  getStatList();
}
const tableData = ref([]);
// 分页列表查询
const getStatList = async () => {
  state.loading = true;
  const { data } = await getTrailerPage(form, "/api/v1/vehicle/trailer/page");
  try {
    tableData.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage(e.message);
    state.loading = false;
  }
};
const handleSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};

const emit = defineEmits(["newBuilt","clickImport"]);
// 修改
const editClick = (index: any, row: any) => {
  emit("newBuilt", row, "editTractorFrom");
};

// 删除
const handleDelete = async (index: any, ids: any) => {
  await deleteTractor(ids, "/api/v1/vehicle/trailer/");
  getStatList();
};
// 查询
const onSubmit = () => {
  getStatList();
};
// 导入
const importVehicle = () => {
  emit('clickImport', {importFn: state.apiFn, downFn: state.downFn, downloadType: "fuel", title:"车辆管理 - 车辆信息"})
};
// 导出
const exportVehicle = () => {
  exportFile(form, "/api/v1/vehicle/trailer/_export");
};
defineExpose({
  getStatList,
  setList
});
</script>
<style lang="scss" scoped>
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor3 {
  background: #bbbbbb;
}
.roundColor0 {
  background: #3270ff;
}
.roundColor1 {
  background: #ffb608;
}
.rroundColor2 {
  background: #ff4d4f;
}
.color-yellow {
  background: "yellow";
}
</style>
