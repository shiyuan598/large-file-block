<template>
  <div class="map-content">
    <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;line-height: 30px;">当前位置：</span>
        <el-breadcrumb separator="-" style="display: flex;align-items: center;">
          <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }"><span style="color: #8C8C8C;">智能车管</span></el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/vehicle/managers/depreciation' }"><span style="color: #8C8C8C;">车辆管理</span></el-breadcrumb-item>
          <el-breadcrumb-item ><span :class="imports.import?'breadcrumb-color':'breadcrumb-color-is'"  @click="returnList">车辆配件</span></el-breadcrumb-item>
          <el-breadcrumb-item v-if="imports.import"><span style="color: #303030;">导入</span></el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
    <div class="set-height" v-if="!imports.import" ref="vehi">
      <Form
        class="mt-2"
        :formModel="form"
        :fromList="list"
        @searchInput="searchInput"
        @onSubmit="onSubmit"
      >
        <template #formSlot> </template>
      </Form>
      <Table
        :tableList="tableList"
        :state="state"
        @useClick="useClick"
        @editClick="editClick"
        @handleDelete="handleDelete"
        @importVehicle="importVehicle"
        @exportVehicle="exportVehicle"
        @rowClick="rowClick"
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
    <div v-if="imports.import" class="importSlot-height">
      <importSlot
      :title="imports.title"
      :apiFn="imports.apiFn"
      :downFn="imports.downFn"
      :downloadType="imports.downloadType"
      @returnList="returnList"
    ></importSlot>
    </div>
    <el-dialog v-model="state.dialogVisible" :close-on-click-modal="false" width="70%" @close="closeDialog">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div>{{ formDialog.id ? "编辑" : "新建" }}配件</div>
        </div>
      </template>
      <div class="border"></div>
      <div class="dialog-content">
        <el-form
          :model="formDialog"
          :rules="rulesDialog"
          label-width="90px"
          v-loading="state.loading"
          size="default"
          ref="ruleFormRef"
          label-position="left"
          class="map-content"
        >
          <el-row :gutter="80" :align="'middle'">
            <el-col class="margin-bo" :span="12">
              <el-form-item label="配件类型" prop="partTypeCode">
                <el-select
                  v-model="formDialog.partTypeCode"
                  style="width: 100%"
                  placeholder="请选择配件类型"
                  @change="(val:number|string)=>selectLabel(val,'partVehicle')"
                >
                  <el-option
                    v-for="item in setDictionary.state.partVehicle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item> </el-col
            ><el-col :span="12" class="margin-bo"
              ><el-form-item label="配件名称" prop="partName">
                <el-input
                  v-model="formDialog.partName"
                  placeholder="请输入配件名称"
                /> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="采购金额" prop="purAmount">
                <el-input
                  v-model="formDialog.purAmount"
                  placeholder="请输入采购金额"
                /> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="采购数量" prop="purNum">
                <el-input
                  v-model="formDialog.purNum"
                  placeholder="请输入采购数量"
                /> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
      </div>
      <div class="aline-right">
        <el-button @click="useDialog">取消</el-button>
        <el-button :disabled="submitRecord" type="primary" @click="queryDialog">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="state.useVisible" width="70%" @close="useCloseDialog">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div>领用配件</div>
        </div>
      </template>
      <div class="border"></div>
      <div class="dialog-content">
        <el-form
          :model="useFormDialog"
          :rules="rulesUseDialog"
          label-width="90px"
          v-loading="state.loading"
          ref="useRuleFormRef"
          size="default"
          label-position="left"
          class="map-content"
        >
          <el-row :gutter="80" :align="'middle'">
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="车牌号码" prop="vehicleCard">
                <el-select
                  v-model="useFormDialog.vehicleCard"
                  filterable 
                  placeholder="请输入车牌号码"
                >
                  <el-option
                    v-for="item in state.optionsList"
                    :key="item.card"
                    :label="item.card"
                    :value="item.card"
                  />
                </el-select>
              </el-form-item
            ></el-col>
            <el-col :span="12" class="margin-bo">
              <el-form-item label="领用日期" prop="useTime">
                <el-date-picker
                  v-model="useFormDialog.useTime"
                  type="date"
                  placeholder="请选择领用日期"
                  size="default"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                /> </el-form-item
            ></el-col>
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="领用数量" prop="useNum">
                <el-input
                  v-model="useFormDialog.useNum"
                  placeholder="请输入领用数量"
                /> </el-form-item
            ></el-col>
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="领用人" prop="usePerson">
                <el-input
                  v-model="useFormDialog.usePerson"
                  placeholder="请输入领用人"
                /> </el-form-item
            ></el-col>
            <el-col :span="24" class="margin-bo"
              ><el-form-item label="&nbsp;&nbsp;备注信息" prop="notes">
                <el-input
                  type="textarea"
                  autosize
                  v-model="useFormDialog.notes"
                  placeholder="请输入备注信息"
                /> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
      </div>
      <div class="aline-right">
        <el-button @click="cancellationDialog">取消</el-button>
        <el-button :disabled="useForRecord" type="primary" @click="queryUseDialog">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="state.detailsVisible" width="70%">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div>详情</div>
        </div>
      </template>
      <div class="border"></div>
      <el-descriptions :column="2" class="mt-7">
        <el-descriptions-item label="配件名称：">{{
          detailRrow.partName
        }}</el-descriptions-item>
        <el-descriptions-item label="配件类型：">{{
          detailRrow.partType
        }}</el-descriptions-item>
        <el-descriptions-item label="采购金额：">{{
          detailRrow.purAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="采购数量：">
          {{ detailRrow.purNum }}
        </el-descriptions-item>
        <el-descriptions-item label="已使用数：">
          {{ detailRrow.useNum }}
        </el-descriptions-item>
        <el-descriptions-item label="剩余数量：">
          {{ detailRrow.rnNum }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="record mt-3">领用记录</div>
      <Table
        :tableList="detailsList"
        :state="loading"
        @editClick="editUseClick"
        @handleDelete="handlUseDelete"
        :tableData="detailsData"
      ></Table>
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
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { ref, nextTick, computed } from "vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import Table from "@/views/vehicle/managers/vehicleInfo/table.vue";
import {
  RuleForm,
  AssemblyForm,
  State,
  Import,
  FormDialog,
  UseFormDialog,
  UseParmes,
} from "@/api/vehicleInfo/types";
import {
  getTrailerPage,
  getOptions,
  deleteTractor,
  importPart,
  partTemplate,
  vehiclePart,
  partUse,
  useList,
  putVehiclePart,
  allList,
  vehiclePartUse
} from "@/api/vehicleInfo";
import { dictionary } from "@/store/modules/dictionary";
import { exportFile } from "@/utils";
import importSlot from "@/views/Import/index.vue";
const form = reactive<RuleForm>({
  keywords: "",
  brand: "",
  business: "",
  ownership: "",
  pageNum: 1,
  pageSize: 10,
});
const state = reactive<State>({
  button: true,
  loading: false,
  total: 0,
  business: [],
  ownership: [],
  options: ["use"],
  optionsList: [],
  dialogVisible: false,
  useVisible: false,
  detailsVisible: false,
});
const submitRecord = computed(()=> (formDialog.partTypeCode==""||formDialog.partName==""||formDialog.purAmount==""||formDialog.purNum==""))
const useForRecord = computed(()=> (useFormDialog.vehicleCard==""||useFormDialog.useTime==""||useFormDialog.useNum==""||useFormDialog.usePerson==""))

let formDialog = reactive<FormDialog>({
  partType: "",
  partTypeCode: "",
  partName: "",
  purAmount: "",
  purNum: "",
});

let useFormDialog = reactive<UseFormDialog>({
  vehicleCard: "",
  useTime: "",
  useNum: "",
  usePerson: "",
  notes: "",
  partId: "",
});
const rulesDialog = {
  partTypeCode: [
    {
      required: true,
      message: "请选择配件类型",
      trigger: "change",
    },
  ],
  partName: [
    {
      required: true,
      message: "请输入配件名称",
      trigger: "change",
    },
  ],
  purAmount: [
    {
      required: true,
      message: "请输入采购金额",
      trigger: "change",
    },
  ],
  purNum: [
    {
      required: true,
      message: "请输入采购数量",
      trigger: "change",
    },
  ],
};

const rulesUseDialog = {
  vehicleCard: [
    {
      required: true,
      message: "请输入车牌号码",
      trigger: "change",
    },
  ],
  useTime: [
    {
      required: true,
      message: "请选择领用日期",
      trigger: "change",
    },
  ],
  useNum: [
    {
      required: true,
      message: "请输入领用数量",
      trigger: "change",
    },
  ],
  usePerson: [
    {
      required: true,
      message: "请输入领用人",
      trigger: "change",
    },
  ],
};
const setDictionary: any = dictionary();
let list: AssemblyForm[] = reactive([
  {
    type: "input",
    label: "配件名称",
    prop: "keywords",
    placeholder: "请输入配件名称",
  },
  {
    type: "select",
    label: "配件类型",
    prop: "sanitationType",
    placeholder: "请选择配件类型",
    optionList: setDictionary.state.partVehicle,
  },
]);

const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(()=>{
  return height.value - 150
})
provide('height',setHeight);
const getVehicleTractor = async () => {
  try {
    const { data } = await vehiclePart(formDialog);
    state.dialogVisible = false;
    getStatList();
    ElMessage.success("新增成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const cancellationDialog = () => {
  state.useVisible = false;
};
const useDialog = () => {
  state.dialogVisible = false;
};
const putVehiclePartList = async () => {
  try {
    const { data } = await putVehiclePart(formDialog, formDialog.id);
    state.dialogVisible = false;
    getStatList();
    ElMessage.success("修改成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const queryDialog = () => {
  formDialog.id ? putVehiclePartList() : getVehicleTractor();
};
const queryUseDialog =()=>{
  console.log(useFormDialog.id)
  useFormDialog.id? putVehiclePartUse() : getPartUse();
}
const getPartUse = async () => {
  try {
    const { data } = await partUse(useFormDialog, useFormDialog.partId);
    state.useVisible = false;
    getStatList();
    ElMessage.success("领用成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const putVehiclePartUse = async () => {
  try {
    const { data } = await vehiclePartUse(useFormDialog, useFormDialog.id);
    state.useVisible = false;
    getUseList(detailRrow.value.id);
    ElMessage.success("修改成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
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
    label: "配件名称",
    prop: "partName",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "配件类型",
    prop: "partType",
    template: "",
  },
  
  {
    width: "",
    type: "",
    label: "采购数量",
    prop: "purNum",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "已使用数量",
    prop: "useNum",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "剩余数量",
    prop: "rnNum",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "采购金额",
    prop: "purAmount",
    align: "right",
    template: "",
  },
];
// 领用记录列表
const detailsList = [
  {
    width: "",
    type: "",
    label: "车牌号码",
    prop: "vehicleCard",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "领用日期",
    prop: "useTime",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "领用数量",
    prop: "useNum",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "领用人",
    prop: "usePerson",
    template: "",
  },
  {
    width: "",
    type: "",
    label: "备注信息",
    prop: "notes",
    template: "",
  },
];
const loading = reactive({
  loading: false,
  button: false,
});
const useParmes:UseParmes = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  loading: false,
})
const getUseList = async (id: string | undefined) => {
  useParmes.loading = true;
  const { data } = await useList(useParmes,id);
  try {
    detailsData.value = data.records;
    useParmes.loading = false;
    useParmes.total = data.total;
  } catch (e: any) {
    ElMessage(e.message);
    useParmes.loading = false;
  }
};

// 新增
const ruleFormRef = ref<FormInstance>();
const useRuleFormRef = ref<FormInstance>();
const parentNewBuilt = () => {
  state.dialogVisible = true;
};
provide("parentNewBuiltClick", parentNewBuilt);
let detailRrow = ref();
const rowClick = (row: any) => {
  state.detailsVisible = true;
  detailRrow.value = row;
  getUseList(row.id);
};
// 领用
const useClick = (index: any, row: any) => {
  state.useVisible = true;

  useFormDialog.partId = row.id;
};
// 修改
const editClick = async (index: any, row: any) => {
  state.dialogVisible = true;
  await nextTick();
  Object.assign(formDialog, row);
};
const editUseClick = async (index: any, row: any) =>{
  state.useVisible = true
  await nextTick();
  Object.assign(useFormDialog, row);
  
}
// 删除
const handleDelete = async (index: any, ids: any) => {
  await deleteTractor(ids, "/api/v1/vehicle/part/");
  getStatList();
};
const handlUseDelete = async (index: any, ids: any) => {
  await deleteTractor(index, "/api/v1/vehicle/part/use/");
  getUseList(detailRrow.value.id);
};

// 导入
const importVehicle = () => {
  imports.import = true;
};
const returnList = () => {
  imports.import = false;
};
const imports = reactive<Import>({
  title: "车辆管理 - 车辆配件",
  import: false,
  downloadType: "fuel",
  apiFn: importPart,
  downFn: partTemplate,
});

// 导出
const exportVehicle = () => {
  exportFile(form, "/api/v1/vehicle/part/_export");
};
const tableData = ref([]);
const detailsData = ref([]);
// 分页列表查询
const getStatList = async () => {
  state.loading = true;
  const { data } = await getTrailerPage(form, "/api/v1/vehicle/part/page");
  try {
    tableData.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage(e.message);
    state.loading = false;
  }
};
// 查询
const onSubmit = () => {
  getStatList();
};
const handleSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
const handleUseSizeChange = (value: number) => {
  useParmes.pageSize = value;
  getUseList(detailRrow.value.id);
};
const handleUseCurrentChange = (value: number) => {
  useParmes.pageNum = value;
  getUseList(detailRrow.value.id);
};
const closeDialog = () => {
  ruleFormRef.value?.resetFields();
};

const useCloseDialog = () => {
  useRuleFormRef.value?.resetFields();
};
const getOption = async (type: string) => {
  const { data } = await getOptions(type);
  data.map((n: { label: string; value: Number }) => {
    n.value = Number(n.value);
  });
  switch (type) {
    case "part_vehicle":
      setDictionary.setDictionaryList("partVehicle", data);
      break;
  }
};
const selectLabel = (val: any | string, label: any) => {
  formDialog.partType = setDictionary.state.partVehicle.filter(
    (n: { label: string; value: Number }) => n.value === val
  )[0].label;
};
const getAllList =async ()=>{
  const { data } = await allList()
  try {
    state.optionsList = data
  }catch (e: any) {
    ElMessage.error(e.message)
  }
}
onMounted(async () => {
  getStatList();
  getAllList();
  await getOption("part_vehicle");
  list[1].optionList = setDictionary.state.partVehicle;
});
const searchInput = ()=>{
  getStatList();
}
</script>
<style scoped lang="scss">
.dialog-content {
  // border-top: 1px solid #e4e4e4;
  background: rgba(220, 222, 224, 0.17);
  margin: 16px 0;
  padding: 24px 10px 6px;
}
.border {
  border-width: 0;
  display: block;
  border-top: 1px solid #e4e4e4;
}
:deep(.el-dialog__body) {
  padding-top: 0;
  padding-bottom: 50px;
}
.aline-right {
  text-align: right;
  float: right;
  padding-bottom: 16px;
}
.my-header {
  color: #303030;
  font-size: 16px;
  font-weight: 600;
}
:deep(.el-descriptions__label:not(.is-bordered-label)) {
  color: #8c8c8c;
}
:deep(.el-descriptions__content:not(.is-bordered-label)) {
  color: #303030;
}
:deep(
    .el-descriptions__body
      .el-descriptions__table:not(.is-bordered)
      .el-descriptions__cell
  ) {
  padding-bottom: 24px;
}
.record {
  color: #323233;
  font-size: 14px;
  font-weight: 600;
}
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-breadcrumb__inner){
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
  }

</style>
