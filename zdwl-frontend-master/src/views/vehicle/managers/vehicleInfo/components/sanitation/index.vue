<template>
  <div class="all-height">
    <Form
      :formModel="form"
      :fromList="list"
      @searchInput="searchInput"
      @onSubmit="onSubmit"
    >
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
    >
      <el-table-column width="100" prop="enabled" label="启用/禁用">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="(val: string | number | boolean)=>changeSwitch(val,scope.row)"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </template>
      </el-table-column>
    </Table>
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
  importSanitation,
  sanitationTemplate,
  putSanitation
} from "@/api/vehicleInfo";
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
    label: "所有权",
    prop: "ownership",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "环卫车辆类型",
    prop: "sanitationType",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "动力类型",
    prop: "powerType",
    template: "",
  },
  {
    width: "220",
    type: "",
    label: "车架号码",
    prop: "vin",
    template: "",
  },
  {
    width: "90",
    type: "",
    label: "状态",
    prop: "enabled",
    template: "statu",
  },
  // {
  //   width: "",
  //   type: "",
  //   label: "启用/禁用",
  //   prop: "enabled",
  //   template: "statu",
  // },
];
const state = reactive<State>({
  button: true,
  loading: false,
  total: 0,
  business: [],
  ownership: [],
  apiFn: importSanitation,
  downFn: sanitationTemplate,
});
const form = reactive<RuleForm>({
  keywords: "",
  brand: "",
  business: "",
  ownership: "",
  sanitationType: "",
  pageNum: 1,
  pageSize: 10,
});
const listOptions = ref([
  {
    type: "input",
    label: "车牌号",
    prop: "keywords",
    placeholder: "请输入车牌号",
  },
  {
    type: "input",
    label: "车辆品牌",
    prop: "brand",
    placeholder: "请输入车辆品牌",
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
    label: "环卫车辆类型",
    prop: "sanitationType",
    placeholder: "请选择环卫车辆类型",
    labelWidth: 100,
    optionList: setDictionary.state.sanitationType,
  },
]);
const setList = () => {
  Object.assign(list, listOptions.value);
};
onMounted(() => {
  getStatList();
  list = listOptions.value;
});
const searchInput = () => {
  getStatList();
};
const tableData = ref([]);
// 分页列表查询
const getStatList = async () => {
  state.loading = true;
  const { data } = await getTrailerPage(
    form,
    "/api/v1/vehicle/sanitation/page"
  );
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
const editPuttractor = async (val:number,row:any) => {
  try {
    const { data } = await putSanitation({card:row.card,enabled:val}, row.id);
    ElMessage.success("操作成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const changeSwitch =async (value:number,row:any)=>{
  await editPuttractor(value,row);
  getStatList();
}
const emit = defineEmits(["newBuilt", "clickImport"]);
// 修改
const editClick = (index: any, row: any) => {
  emit("newBuilt", row, "sanitationFrom");
};

// 删除
const handleDelete = async (index: any, ids: any) => {
  await deleteTractor(ids, "/api/v1/vehicle/sanitation/");
  getStatList();
};
// 查询
const onSubmit = () => {
  getStatList();
};
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
  exportFile(form, "/api/v1/vehicle/sanitation/_export");
};
defineExpose({
  getStatList,
  setList,
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
