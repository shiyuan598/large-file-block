<template>
  <div class="set-height">
    <el-row>
      <el-button type="primary" size="default" @click="dispatchPreOrderClick"
        >批量生成订单</el-button
      >
      <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
        <template #reference>
          <!-- <el-button key="text" type="text">删除</el-button> -->
          <el-button size="default">批量删除</el-button>
        </template>
      </el-popconfirm>
      <el-button size="default" @click="clickBack"
        >返回</el-button
      >
    </el-row>

    <el-table
      :data="tableData"
      v-loading="state.loading"
      @selection-change="handleSelectionChange"
      size="default"
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column width="" prop="customer" label="客户名称">
      </el-table-column>
      <el-table-column prop="route" label="路线名称">
        <template #default="scope">
          {{ scope.row.route }}({{ scope.row.project || "--" }})
        </template>
      </el-table-column>
      <el-table-column prop="tractor" label="车牌号码" />
      <el-table-column prop="driver" label="司机姓名">
        <template #default="scope">
          {{ scope.row.firstDriver }}

          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.firstDriver + ':' + scope.row.firstDriverPhone"
            placement="right"
          >
            <el-icon><Iphone /></el-icon>
          </el-tooltip>

          {{ scope.row.secondDriver }}
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="
              scope.row.secondDriver + ':' + scope.row.secondDriverPhone
            "
            placement="right"
          >
            <el-icon v-if="scope.row.secondDriver"><Iphone /></el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="action" label="操作">
        <template #default="scope">
          <!-- <el-button
            key="text"
            type="text"
            @click.stop="editClick(scope.$index, scope.row)"
            >编辑</el-button
          > -->
          <el-popconfirm
            title="确定要删除吗?"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button @click.stop key="text" type="text">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog
      v-model="state.dialogVisible"
      :close-on-click-modal="false"
      class="newDialogClass"
      @close="closeDialog"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">编辑订单</div>
      </template>
      <div class="dialog-content">
        <el-form
          label-width="90px"
          ref="formRef"
          label-position="left"
          :model="tmsDispatchPreOrderForm"
          v-loading="state.dialogLoading"
          :rules="formRules"
        >
          <el-row :gutter="80" :align="'middle'">
            <el-col class="margin-bo" :span="12">
              <el-form-item label="项目名称" prop="projectCode">
                <el-select
                  v-model="tmsDispatchPreOrderForm.projectCode"
                  style="width: 100%"
                  filterable
                  placeholder="请选择项目名称"
                  @change="changeProject"
                >
                  <el-option
                    v-for="item in setDictionary.state.projectOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col class="margin-bo" :span="12">
              <el-form-item label="线路名称" prop="routeCode">
                <el-select
                  v-model="tmsDispatchPreOrderForm.routeCode"
                  filterable
                  style="width: 100%"
                  placeholder="请选择路线名称"
                  @change="changeRoute('route', dialoglicenseOptions)"
                >
                  <el-option
                    v-for="item in dialoglicenseOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="margin-bo" :span="12">
              <el-form-item label="车牌号码" prop="tractorCode">
                <el-select
                  v-model="tmsDispatchPreOrderForm.tractorCode"
                  filterable
                  style="width: 100%"
                  placeholder="请选择车牌号码"
                  @change="
                    changeItem(
                      'tractorCode',
                      'tractor',
                      setDictionary.state.tractorOptions,
                      null
                    )
                  "
                >
                  <el-option
                    v-for="item in setDictionary.state.tractorOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="margin-bo" :span="12">
              <el-form-item label="主驾" prop="firstDriverCode">
                <el-select
                  v-model="tmsDispatchPreOrderForm.firstDriverCode"
                  style="width: 100%"
                  filterable
                  placeholder="请选择司机姓名"
                  @change="
                    changeItem(
                      'firstDriverCode',
                      'firstDriver',
                      setDictionary.state.driverOptions,
                      'firstDriverPhone'
                    )
                  "
                >
                  <el-option
                    v-for="item in setDictionary.state.driverOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              class="margin-bo"
              v-if="tmsDispatchPreOrderForm.driverType == '2'"
              :span="12"
            >
              <el-form-item label="副驾" prop="secondDriverCode">
                <el-select
                  v-model="tmsDispatchPreOrderForm.secondDriverCode"
                  style="width: 100%"
                  filterable
                  placeholder="请选择司机姓名"
                  @change="
                    changeItem(
                      'secondDriverCode',
                      'secondDriver',
                      setDictionary.state.driverOptions,
                      'secondDriverPhone'
                    )
                  "
                >
                  <el-option
                    v-for="item in setDictionary.state.driverOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="aline-right">
        <el-button @click="cancellation()" size="default">取消</el-button>
        <el-button @click="sureClick(formRef)" type="primary" size="default"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, defineExpose, defineEmits } from "vue";
import { Iphone } from "@element-plus/icons-vue";
import {
  dispatchPreOrderPage,
  dispatchPreOrder,
  dispatchPreOrderDelete,
} from "@/api/vehicleInfo";
import { TmsDispatchPreOrderForm } from "@/api/vehicleInfo/types";
import { dictionary } from "@/store/modules/dictionary";
import { lineInfoList } from "@/api/depreciation";
import type { FormInstance } from "element-plus";
const emit = defineEmits(['back']);
const setDictionary: any = dictionary();
const state = reactive({
  loading: false,
  dialogVisible: false,
  dialogLoading: false,
  total: 0,
});
onMounted(() => {
  getStatList();
});
const parmer = reactive({
  pageNum: 1,
  pageSize: 10,
});
const tableData = ref([]);
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await dispatchPreOrderPage(parmer);
    state.loading = false;
    tableData.value = data.list;
    state.total = data.total;
  } catch (e: any) {
    state.loading = false;
    ElMessage.error(e.message);
  }
};
const changeProject = async (value: number) => {
  tmsDispatchPreOrderForm.project = setDictionary.state.projectOption?.filter(
    (val: any) => val.value === value
  )[0].label;
  tmsDispatchPreOrderForm.routeCode = null;
  getLineInfoList(value);
};

// 新增时路线
let dialoglicenseOptions: any = ref([]);
const getLineInfoList = async (parmer: any) => {
  state.dialogLoading = true;
  try {
    const { data } = await lineInfoList({ projectCode: parmer });
    dialoglicenseOptions.value = data;
    state.dialogLoading = false;
  } catch (e: any) {
    state.dialogLoading = false;
    ElMessage.error(e.message);
  }
};
const changeRoute = async (type: string, list: any) => {
  const routerList = list?.filter(
    (val: any) => val.id === tmsDispatchPreOrderForm.routeCode
  )[0];
  tmsDispatchPreOrderForm.route = routerList.name;
  tmsDispatchPreOrderForm.customerCode = routerList.customerCode;
  tmsDispatchPreOrderForm.customer = routerList.customer;
  tmsDispatchPreOrderForm.driverType = routerList.upDriverType;
  // upDriverType.value = routerList.upDriverType;
};
const formRef = ref();
const closeDialog = () => {
  formRef.value?.resetFields();
  tmsDispatchPreOrderForm.driverType = "1";
  tmsDispatchPreOrderForm.secondDriverCode = null;
  tmsDispatchPreOrderForm.secondDriver = "";
  tmsDispatchPreOrderForm.secondDriverPhone = "";
};
const formRules = {
  projectCode: [
    {
      required: true,
      message: "请选择项目名称",
      trigger: "change",
    },
  ],
  routeCode: [
    {
      required: true,
      message: "请选择线路名称",
      trigger: "change",
    },
  ],
  tractorCode: [
    {
      required: true,
      message: "请选择车牌号码",
      trigger: "change",
    },
  ],
  firstDriverCode: [
    {
      required: true,
      message: "请选择主驾",
      trigger: "change",
    },
  ],
  secondDriverCode: [
    {
      required: true,
      message: "请选择副驾",
      trigger: "change",
    },
  ],
};
const handleUseSizeChange = (value: number) => {
  parmer.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  parmer.pageNum = value;
  getStatList();
};
const editClick = async (index: number, row: any) => {
  state.dialogVisible = true;
  await getLineInfoList(row.projectId);
  Object.assign(tmsDispatchPreOrderForm, row);
};
const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
const dispatchPreOrderClick = async () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  try {
    await dispatchPreOrderDelete(arr);
    ElMessage.success('生成订单成功');
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const batchVehicle = () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  handleDelete(arr);
};
const handleDelete = async (ids: string) => {
  await dispatchPreOrderDelete(ids);
  getStatList();
};

const changeItem = (
  value: string,
  key: string,
  list: any,
  phoneNumber: any
) => {
  const obj = list?.filter(
    (val: any) => val.id === tmsDispatchPreOrderForm[value]
  )[0];
  tmsDispatchPreOrderForm[key] = obj.label;
  if (phoneNumber) {
    tmsDispatchPreOrderForm[phoneNumber] = obj.phone;
  }
};
const cancellation = () => {
  state.dialogVisible = false;
};
const sureClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (Number(tmsDispatchPreOrderForm.driverType) === 1) {
        tmsDispatchPreOrderForm.secondDriverPhone = "";
        tmsDispatchPreOrderForm.secondDriver = "";
        tmsDispatchPreOrderForm.secondDriverCode = null;
      }
      try {
        await dispatchPreOrder(
          tmsDispatchPreOrderForm.id,
          tmsDispatchPreOrderForm
        );
        state.dialogVisible = false;
        getStatList();
      } catch (e: any) {
        ElMessage.error(e.message);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const tmsDispatchPreOrderForm = reactive({
  id: null,
  project: "",
  projectCode: null,
  orderDate: "",
  customer: "",
  customerCode: null,
  route: "",
  routeCode: null,
  tractor: "",
  tractorCode: null,
  firstDriver: "",
  firstDriverCode: null,
  firstDriverPhone: "",
  secondDriver: "",
  secondDriverCode: null,
  secondDriverPhone: "",
  driverType: "1",
});
const clickBack = ()=>{
  emit('back');
}

</script>
<style scoped lang="scss"></style>
