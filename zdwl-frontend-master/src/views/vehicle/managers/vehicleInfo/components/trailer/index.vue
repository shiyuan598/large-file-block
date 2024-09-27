<template>
  <div class="all-height">
    <Form :formModel="form" @searchInput="searchInput" :fromList="list" @onSubmit="onSubmit"> </Form>
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
import { useRouter } from "vue-router";
import {
  getTrailerPage,
  deleteTractor,
  importTractor,
  tractorTemplate,
} from "@/api/vehicleInfo";
import { RuleForm, State, AssemblyForm } from "@/api/vehicleInfo/types";
import { exportFile } from "@/utils";
import { dictionary } from "@/store/modules/dictionary";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import Table from "@/views/vehicle/managers/vehicleInfo/table.vue";
const setDictionary = dictionary();

// table列表
const tableList = [
  {
    width: "55",
    type: "selection",
    label: "",
    prop: "",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "车牌号码",
    prop: "card",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "车辆品牌",
    prop: "brand",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "业务场景",
    prop: "business",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "通讯来源",
    prop: "gpsSource",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "所有权",
    prop: "ownership",
    template: "",
  },
  {
    width: "180",
    type: "",
    label: "车架号码",
    prop: "vin",
    template: "",
  },
  {
    width: "190",
    type: "",
    label: "油卡卡号",
    prop: "fuelCode",
    template: "",
  },
  {
    width: "180",
    type: "",
    label: "ETC卡号",
    prop: "etcCode",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "状态",
    prop: "status",
    template: "status",
    // template: `<span class="round" :class="'roundColor'+scope.row.status"></span>{{ fileStatus(scope.row.status) }}`
  },
];
let list: AssemblyForm[] = reactive([]);
const state = reactive<State>({
  button: true,
  loading: false,
  total: 0,
  business: [],
  ownership: [],
  gpsSource: [],
  apiFn: importTractor,
  downFn: tractorTemplate,
});
const form = reactive<RuleForm>({
  keywords: "",
  brand: "",
  business: "",
  ownership: "",
  gpsSource: "",
  pageNum: 1,
  pageSize: 10,
});
const listOptions = ref([
  {
    type: "input",
    labelWidth: 86,
    label: "车牌号码",
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
    labelWidth: 86,
    label: "车辆所有权",
    prop: "ownership",
    placeholder: "请选择车辆所有权",
    optionList: setDictionary.state.ownership,
  },
  {
    type: "select",
    label: "通讯来源",
    prop: "gpsSource",
    placeholder: "请选择通讯来源",
    optionList: setDictionary.state.gpsSource,
  },
]);
const setList = () => {
  console.log(listOptions.value);
  Object.assign(list, [
    {
      type: "input",
      label: "车牌号码",
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
      prop: "ownership",
      placeholder: "请选择车辆所有权",
      optionList: setDictionary.state.ownership,
    },
    {
      type: "select",
      label: "通讯来源",
      prop: "gpsSource",
      placeholder: "请选择通讯来源",
      optionList: setDictionary.state.gpsSource,
    },
  ]);
};
onMounted(() => {
  getStatList();
  list = listOptions.value;
  // 查询form
});
const searchInput = ()=>{
  getStatList();
}
const tableData = ref([]);
const getStatList = async () => {
  state.loading = true;
  const { data } = await getTrailerPage(form, "/api/v1/vehicle/tractor/page");
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

const editClick = (index: any, row: any) => {
  emit("newBuilt", row, "editFrom");
};
const handleDelete = async (index: any, ids: any) => {
  await deleteTractor(ids, "/api/v1/vehicle/tractor/");
  getStatList();
};
interface User {
  date: string;
  name: string;
  address: string;
}
// 查询
const onSubmit = () => {
  getStatList();
};
const emit = defineEmits(["newBuilt", "clickImport"]);
// 导入
const importVehicle = () => {
  emit("clickImport", {
    importFn: state.apiFn,
    downFn: state.downFn,
    downloadType: "fuel",
    title: "车辆管理 - 车辆信息",
  });
};
// 导出
const exportVehicle = () => {
  exportFile(form, "/api/v1/vehicle/tractor/_export");
};
defineExpose({
  getStatList,
  setList,
});
</script>
<style lang="scss" scoped>
.aline-right {
  text-align: right;
  float: right;
}
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
</style>
