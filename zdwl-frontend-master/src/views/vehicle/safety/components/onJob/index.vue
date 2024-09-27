<template>
  <div class="all-height">
    <Form
      :formModel="form"
      :fromList="list"
      :formSate="formSate"
      @searchInput="searchInput"
      @onSubmit="onSubmit"
    >
    </Form>
    <Table
      @editClick="editClick"
      @importVehicle="importVehicle"
      @handleDelete="handleDelete"
      @sortChange="sortChange"
      @exportVehicle="exportVehicle"
      :tableList="tableList"
      :state="state"
      :tableData="tableData"
    >
    </Table>
    <el-row class="pagination-style" justify="end">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="handleUseSizeChange"
        @current-change="handleUseCurrentChange"
        :pager-count="5"
        :page-sizes="[10, 20, 30, 40, 100]"
        :total="state.total"
      />
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref, watch } from "vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import Table from "@/views/vehicle/managers/vehicleInfo/table.vue";
import { jobForm } from "@/api/secure/types";
import { driverPage, importDriver, driverTemplate } from "@/api/secure";
import { State, AssemblyForm, FormSate } from "@/api/vehicleInfo/types";
import { deleteTractor } from "@/api/vehicleInfo";
import { dictionary } from "@/store/modules/dictionary";
import { exportFile } from "@/utils";
const porps = defineProps<{ driverType: any }>();
const form = reactive<jobForm>({
  keywords: "",
  business: "",
  cooperationWay: "",
  phone: "",
  pageNum: 1,
  pageSize: 10,
  driverType: "on",
  firstTimeSort: "desc",
  drivingTimes: [],
  jobTimes: [],
  drivingTimeStart: "",
  drivingTimeEnd: "",
  jobTimeStart: "",
  jobTimeEnd: "",
});
const state = reactive<State>({
  type: "on",
  button: true,
  loading: false,
  apiFn: importDriver,
  downFn: driverTemplate,
});
watch(
  () => porps.driverType,
  (val) => {
    form.driverType = val;
    Object.assign(tableList, form.driverType === "time" ? tiemList : onList);
    getStatList();
  }
);
const tableData = ref([]);
const detailsData = ref([]);

// 分页列表查询
const getStatList = async () => {
  let parmes:any = {};
  if (state.type === "time") {
    form.drivingTimeStart = form.drivingTimes && form.drivingTimes[0];
    form.drivingTimeEnd = form.drivingTimes && form.drivingTimes[1];
    form.jobTimeStart = form.jobTimes && form.jobTimes[0];
    form.jobTimeEnd = form.jobTimes && form.jobTimes[1];
  }else{
    form.drivingTimeStart = '';
    form.drivingTimeEnd = '';
    form.jobTimeStart = '';
    form.jobTimeEnd = '';
  }
  Object.assign(parmes, form);
  parmes.drivingTimes = [];
  parmes.jobTimes = [];
  state.loading = true;
  const { data } = await driverPage(parmes, "/api/v1/driver/page");
  try {
    tableData.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage(e.message);
    state.loading = false;
  }
};
const sortChange = (column: any, prop: any, order: any) => {
  form.firstTimeSort = column.order === "descending" ? "asc" : "desc";
  getStatList();
};
const emit = defineEmits(["newBuilt", "clickImport"]);
// 修改
const editClick = (index: any, row: any) => {
  emit("newBuilt", row, "onJobFrom");
};
// 查询
const onSubmit = () => {
  getStatList();
};
// 删除
const handleDelete = async (index: any, ids: any) => {
  await deleteTractor(ids, "/api/v1/driver/");
  getStatList();
};
// 导入
const importVehicle = () => {
  emit("clickImport", {
    importFn: state.apiFn,
    downFn: state.downFn,
    downloadType: "fuel",
    title: "安全员信息",
  });
};
// 导出
const exportVehicle = () => {
  let parmes:any = {};
  if (state.type === "time") {
    form.drivingTimeStart = form.drivingTimes && form.drivingTimes[0];
    form.drivingTimeEnd = form.drivingTimes && form.drivingTimes[1];
    form.jobTimeStart = form.jobTimes && form.jobTimes[0];
    form.jobTimeEnd = form.jobTimes && form.jobTimes[1];
  }else{
    form.drivingTimeStart = '';
    form.drivingTimeEnd = '';
    form.jobTimeStart = '';
    form.jobTimeEnd = '';
  }
  Object.assign(parmes, form);
  parmes.drivingTimes = [];
  parmes.jobTimes = [];
  exportFile(parmes, "/api/v1/driver/_export");
};
const setDictionary = dictionary();
const setList = () => {
  Object.assign(list, [
    {
      type: "input",
      label: "安全员姓名",
      labelWidth: 96,
      prop: "keywords",
      placeholder: "请输入安全员姓名",
    },
    {
      type: "select",
      label: "业务场景",
      prop: "business",
      labelWidth: 96,
      placeholder: "请选择业务场景",
      optionList: setDictionary.state.business,
    },
    {
      type: "select",
      label: "合作方式",
      labelWidth: 96,
      prop: "cooperationWay",
      placeholder: "请选择合作方式",
      optionList: setDictionary.state.cooperationWay,
    },
    {
      type: "input",
      labelWidth: 96,
      label: "联系方式",
      prop: "phone",
      placeholder: "请输入联系方式",
    },
    {
      type: "row",
    },
  ]);
};
const tabList = (val: string) => {
  state.type = val;
  if (val === "time") {
    list = [
      {
        type: "input",
        label: "安全员姓名",
        labelWidth: 96,
        prop: "keywords",
        placeholder: "请输入安全员姓名",
      },
      {
        type: "select",
        label: "业务场景",
        prop: "business",
        labelWidth: 96,
        placeholder: "请选择业务场景",
        optionList: setDictionary.state.business,
      },
      {
        type: "select",
        label: "合作方式",
        prop: "cooperationWay",
        labelWidth: 96,
        placeholder: "请选择合作方式",
        optionList: setDictionary.state.cooperationWay,
      },
      {
        type: "picker",
        label: "驾驶证有效期",
        prop: "drivingTimes",
        labelWidth: 96,
        placeholder: "请选择驾驶证有效期",
      },
      {
        type: "picker",
        label: "资格证有效期",
        prop: "jobTimes",
        labelWidth: 96,
        placeholder: "请选择资格证有效期",
      },
    ];
  } else {
    list = [
      {
        type: "input",
        label: "安全员姓名",
        prop: "keywords",
        labelWidth: 96,
        placeholder: "请输入安全员姓名",
      },
      {
        type: "select",
        label: "业务场景",
        prop: "business",
        labelWidth: 96,
        placeholder: "请选择业务场景",
        optionList: setDictionary.state.business,
      },
      {
        type: "select",
        label: "合作方式",
        prop: "cooperationWay",
        labelWidth: 96,
        placeholder: "请选择合作方式",
        optionList: setDictionary.state.cooperationWay,
      },
      {
        type: "input",
        label: "联系方式",
        labelWidth: 96,
        prop: "phone",
        placeholder: "请输入联系方式",
      },
      {
        type: "row",
      },
    ];
  }
};
// 查询form
let list: AssemblyForm[] = reactive([]);
// table列表
const onList = [
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
    label: "安全员姓名",
    prop: "name",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "联系号码",
    prop: "phone",
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
    label: "合作方式",
    prop: "cooperationWay",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "初次合作日期",
    prop: "firstTime",
    template: "timeSort",
  },
  {
    width: "",
    type: "",
    label: "协议签署",
    prop: "signStatus",
    template: "signStatus",
  },
];
const tiemList = [
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
    label: "安全员姓名",
    prop: "name",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "联系号码",
    prop: "phone",
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
    label: "合作方式",
    prop: "cooperationWay",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "驾驶证有效期",
    prop: "drivingTime",
    template: "fileDate",
  },
  {
    width: "",
    type: "",
    label: "从业资格证有效期",
    prop: "jobTime",
    template: "fileDate",
  },
];
let tableList: any = [];
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
onMounted(async () => {
  Object.assign(tableList, form.driverType === "time" ? tiemList : onList);
  getStatList();
});
const searchInput = () => {
  getStatList();
};
defineExpose({
  getStatList,
  setList,
  tabList,
});
</script>

<style scoped lang="scss">
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
</style>
