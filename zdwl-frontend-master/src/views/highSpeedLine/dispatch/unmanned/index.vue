<template>
  <div class="app-container">
    <el-header
      style="
        background-color: white;
        display: flex;
        justify-content: flex-start;
        height: 56px;
      "
    >
      <span
        style="
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #8c8c8c;
          display: flex;
          align-items: center;
          line-height: 30px;
        "
        >当前位置：</span
      >
      <el-breadcrumb separator="-" style="display: flex; align-items: center">
        <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }"
          ><span style="color: #8c8c8c">高速干线</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="{ path: '/highSpeedLine/dispatch/proprietary' }"
          ><span style="color: #8c8c8c">调度中心</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span @click="clickSwitch" class="breadcrumb-color-is cursor-pointer"
            >无人化调度</span
          ></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span class="breadcrumb-color-is">智能调度</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi">
      <Form
        class="hide-form"
        :formModel="form"
        :fromList="formList"
        @collapseExpand="collapseExpand"
        @searchInput="searchInput"
        @onSubmit="onSubmit"
      >
        <template #formSlot> </template>
      </Form>
      <el-row>
        <el-button @click="newBuilt" type="primary" size="default"
          >新建</el-button
        >
        <!-- <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
          <template #reference>
            <el-button size="default">删除</el-button>
          </template>
        </el-popconfirm> -->
        <el-button
          :disabled="multipleSelection.length === 0"
          @click="clickSwitch"
          type="primary"
          size="default"
          >基础调度</el-button
        >

        <!-- <el-popover placement="top-start" trigger="click" :width="400" :visible="state.visible">
          <div>
            <el-date-picker
              class="ml-12px"
              value-format="YYYY-MM-DD"
              v-model="preOrderDate"
              type="date"
              @change= "intelligent"
              placeholder="选择智能调度订单日期"
            >
            </el-date-picker>
          </div>
          <template #reference>
            <el-button
              class="ml-12px"
              type="primary"
              size="default"
              >智能调度</el-button
            >
          </template>
        </el-popover> -->
      </el-row>
      <el-table
        :data="tableData"
        v-loading="state.loading"
        :max-height="setHeight"
        size="default"
        style="width: 100%; margin-top: 16px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :selectable="callback" type="selection" width="55" />
        <el-table-column width="180" prop="code" label="订单编号" />
        <el-table-column width="" prop="customerName" label="客户名称">
        </el-table-column>
        <el-table-column width="200" prop="routeName" label="路线名称">
          <template #default="scope">
            {{ scope.row.routeName }}({{ scope.row.projectName || "--" }})
          </template>
        </el-table-column>
        <el-table-column prop="tractorName" width="100" label="车牌号码" />
        <el-table-column width="150" prop="driver" label="司机姓名">
          <template #default="scope">
            {{ scope.row.firstDriverName }}

            <el-tooltip
              class="box-item"
              effect="dark"
              :content="
                scope.row.firstDriverName + ':' + scope.row.firstDriverPhone
              "
              placement="right"
            >
              <el-icon><Iphone /></el-icon>
            </el-tooltip>

            {{ scope.row.secondDriverName }}
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="
                scope.row.secondDriverName + ':' + scope.row.secondDriverPhone
              "
              placement="right"
            >
              <el-icon v-if="Number(scope.row.driverType) === 2"
                ><Iphone
              /></el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="shiftOrder"
          v-loading="state.shiftOrderLoading"
          width=""
          label="班次排序"
        />
        <el-table-column prop="shiftPeriod" width="" label="班次周期" />
        <el-table-column prop="shiftType" width="" label="班次类型" />
        <el-table-column prop="" width="" label="状态">
          <template #default="scope">
            <span class="round" :class="'roundColor' + scope.row.status"></span>
            <span
              :class="
                scope.row.status == '0' ? 'disabled-color' : 'active-color'
              "
            >
              {{ fileStatus(scope.row.status) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="right" prop="action" label="操作" width="160">
          <template #default="scope">
            <el-button
              key="text"
              type="text"
              v-if="Number(scope.row.status) === 0"
              @click.stop="editClick(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除吗?"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button
                  v-if="Number(scope.row.status) === 0"
                  @click.stop
                  key="text"
                  type="text"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-button
              key="text"
              type="text"
              v-show="Number(scope.row.status) === 0"
              @click.stop="clickEnable(scope.$index, scope.row)"
              >启用</el-button
            >
            <el-button
              key="text"
              type="text"
              v-show="Number(scope.row.status) === 1"
              @click.stop="clickDisable(scope.$index, scope.row)"
              >禁用</el-button
            >
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
          <div class="my-header">{{ state.dialogTitle }}订单</div>
        </template>
        <div class="dialog-content">
          <el-form
            label-width="90px"
            ref="formRef"
            label-position="left"
            :model="formProjectDialog"
            v-loading="state.dialogLoading"
            :rules="formRules"
          >
            <el-row :gutter="80" :align="'middle'">
              <el-col class="margin-bo" :span="12">
                <el-form-item label="项目名称" prop="projectId">
                  <el-select
                    v-model="formProjectDialog.projectId"
                    style="width: 100%"
                    filterable
                    placeholder="请选择项目名称"
                    @change="changeProject"
                  >
                    <el-option
                      v-for="item in projectOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="margin-bo" :span="12">
                <el-form-item label="线路名称" prop="routeId">
                  <el-select
                    v-model="formProjectDialog.routeId"
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
                <el-form-item label="班次排序" prop="shiftOrder">
                  <el-input
                    placeholder="请输入班次排序"
                    v-model="formProjectDialog.shiftOrder"
                  />
                </el-form-item>
              </el-col>
              <el-col class="margin-bo" :span="12">
                <el-form-item label="&nbsp;&nbsp;班次周期" prop="shiftPeriod">
                  <el-input
                    placeholder="请输入班次周期"
                    v-model="formProjectDialog.shiftPeriod"
                  />
                </el-form-item>
              </el-col>
              <el-col class="margin-bo" :span="12">
                <el-form-item label="班次类型" prop="shiftType">
                  <el-input
                    placeholder="请输入班次类型"
                    v-model="formProjectDialog.shiftType"
                  />
                </el-form-item>
              </el-col>
              <el-col class="margin-bo" :span="12">
                <el-form-item label="车牌号码" prop="tractorId">
                  <el-select
                    v-model="formProjectDialog.tractorId"
                    filterable
                    style="width: 100%"
                    placeholder="请选择车牌号码"
                    @change="
                      changeItem(
                        'tractorId',
                        'tractorName',
                        tractorOptions,
                        null
                      )
                    "
                  >
                    <el-option
                      v-for="item in tractorOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="margin-bo" :span="12">
                <el-form-item label="主驾" prop="firstDriverId">
                  <el-select
                    v-model="formProjectDialog.firstDriverId"
                    style="width: 100%"
                    filterable
                    placeholder="请选择司机姓名"
                    @change="
                      changeItem(
                        'firstDriverId',
                        'firstDriverName',
                        driverOptions,
                        'firstDriverPhone'
                      )
                    "
                  >
                    <el-option
                      v-for="item in driverOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col
                class="margin-bo"
                v-if="formProjectDialog.driverType == '2'"
                :span="12"
              >
                <el-form-item label="副驾" prop="secondDriverId">
                  <el-select
                    v-model="formProjectDialog.secondDriverId"
                    style="width: 100%"
                    filterable
                    placeholder="请选择司机姓名"
                    @change="
                      changeItem(
                        'secondDriverId',
                        'secondDriverName',
                        driverOptions,
                        'secondDriverPhone'
                      )
                    "
                  >
                    <el-option
                      v-for="item in driverOptions"
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
    <!-- <Intelligent @back="emitBack" v-if="state.intelligentSwitch"></Intelligent>
     -->
    <el-dialog
      :close-on-click-modal="false"
      class="newDialogClass"
      v-model="state.intelligentSwitch"
      style="height: 200px"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">日期选择</div>
      </template>
      <el-date-picker
        class="mt-20px"
        value-format="YYYY-MM-DD"
        :disabledDate="dateRangePickerOptions"
        v-model="preOrderDate"
        type="date"
        placeholder="选择订单日期"
      >
      </el-date-picker>
      <div
        class="aline-right"
        style="position: absolute; bottom: 10px; right: 20px"
      >
        <el-button @click="cancellation()" size="default">取消</el-button>
        <el-button @click="dispatch()" type="primary" size="default"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import Intelligent from "./intelligent.vue";
import { Options } from "@/api/depreciation/types";
import { Iphone } from "@element-plus/icons-vue";
import { OrderForm } from "@/api/vehicleInfo/types";
import {
  orderTemplate,
  orderTemplateAdd,
  orderTemplateUpd,
  envDeleteTractor,
  envEnableDisable,
  oneKeySchedule,
  maxShift0rder,
} from "@/api/vehicleInfo";
import { AssemblyForm } from "@/api/vehicleInfo/types";
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance } from "element-plus";
import { useElementSize } from "@vueuse/core";
import { dictionary } from "@/store/modules/dictionary";
import {
  cooperateList,
  lineInfoList,
  tractorList,
  driverList,
  projectList,
} from "@/api/depreciation";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 280;
});

const router = useRouter();
const state = reactive({
  loading: false,
  dialogVisible: false,
  dialogTitle: "新增",
  upDriverType: "1",
  dialogLoading: false,
  shiftOrderLoading: false,
  intelligentSwitch: false,
  total: 0,
});
// const upDriverType= ref<string>("1");
const form = reactive<OrderForm>({
  projectCode: undefined,
  customerCode: undefined,
  routeCode: undefined,
  tractorCode: undefined,
  driverCod: undefined,
  status: null,
  shiftPeriod: "",
  shiftType: "",
  pageNum: 1,
  pageSize: 10,
});
// 客户名称
const cooperateOptions = ref<Options[]>([]);
// 项目名称
const projectOption = ref<Options[]>([]);
// 司机姓名
const driverOptions = ref<Options[]>([]);
// 线路名称
const licenseOptions = ref<Options[]>([]);
// 牵引车牌
const tractorOptions = ref<Options[]>([]);
// 查询form
let formList: AssemblyForm[] = reactive([]);
// 新增时路线
let dialoglicenseOptions: any = ref([]);
// 新增编辑表单
const formProjectDialog = reactive({
  projectId: null,
  projectName: "",
  routeId: null,
  routeName: null,
  customerId: null,
  customerName: null,
  tractorId: null,
  tractorName: null,
  formProjectDialog: null,
  firstDriverId: null,
  firstDriverName: null,
  firstDriverPhone: null,
  secondDriverId: null,
  secondDriverName: null,
  secondDriverPhone: null,
  shiftPeriod: null,
  shiftType: null,
  driverType: "1",
});
// 表单验证
const formRules = {
  projectId: [
    {
      required: true,
      message: "请选择项目名称",
      trigger: "change",
    },
  ],
  routeId: [
    {
      required: true,
      message: "请选择线路名称",
      trigger: "change",
    },
  ],
  shiftOrder: [
    {
      required: true,
      message: "请选择班次排序",
      trigger: "change",
    },
  ],
  shiftType: [
    {
      required: true,
      message: "请选择班次类型",
      trigger: "change",
    },
  ],
  tractorId: [
    {
      required: true,
      message: "请选择牵引车",
      trigger: "change",
    },
  ],
  firstDriverId: [
    {
      required: true,
      message: "请选择主驾",
      trigger: "change",
    },
  ],
  secondDriverId: [
    {
      required: true,
      message: "请选择副驾",
      trigger: "change",
    },
  ],
};
const setDictionary = dictionary();
onMounted(() => {
  Promise.all([
    driverList(),
    tractorList(),
    cooperateList(),
    lineInfoList({}),
    projectList(),
  ]).then((res) => {
    res.map((n, index) => {
      switch (index) {
        case 0:
          n.data.map((i: any) => {
            driverOptions.value.push({ value: i.id, label: i.name, ...i });
          });
          break;
        case 1:
          n.data.map((i: any) => {
            tractorOptions.value?.push({ value: i.id, label: i.card, ...i });
          });
          break;
        case 2:
          n.data.map((i: any) => {
            cooperateOptions.value?.push({ value: i.id, label: i.name });
          });
          break;
        case 3:
          n.data.map((i: any) => {
            licenseOptions.value?.push({ value: i.id, label: i.name });
          });
          break;
        case 4:
          n.data.map((i: any) => {
            projectOption.value?.push({ value: i.id, label: i.name });
          });
          break;
      }
    });
  });
  setDictionary.setDictionaryList("cooperateOptions", cooperateOptions.value);
  setDictionary.setDictionaryList("projectOption", projectOption.value);
  setDictionary.setDictionaryList("driverOptions", driverOptions.value);
  setDictionary.setDictionaryList("licenseOptions", licenseOptions.value);
  setDictionary.setDictionaryList("tractorOptions", tractorOptions.value);
  Object.assign(formList, [
    {
      type: "selectValue",
      label: "客户名称",
      prop: "customerCode",
      placeholder: "请选择客户名称",
      optionList: cooperateOptions,
    },
    {
      type: "selectValue",
      label: "项目名称",
      prop: "projectCode",
      placeholder: "请选择项目名称",
      optionList: projectOption,
    },
    {
      type: "selectValue",
      label: "司机名称",
      prop: "driverCode",
      placeholder: "请选择司机名称",
      optionList: driverOptions,
    },
    {
      type: "selectValue",
      label: "线路名称",
      prop: "routeCode",
      placeholder: "请选择线路",
      optionList: licenseOptions,
    },
    {
      type: "selectValue",
      label: "车牌号码",
      prop: "tractorCode",
      placeholder: "请选择车牌号码",
      optionList: tractorOptions,
    },
    {
      type: "selectValue",
      label: "订单状态",
      prop: "status",
      placeholder: "请选择订单状态",
      optionList: [
        {
          label: "禁用",
          value: 0,
        },
        {
          label: "启用",
          value: 1,
        },
      ],
    },
    {
      type: "input",
      label: "班次周期",
      prop: "",
      placeholder: "请输入班次周期",
    },
    {
      type: "input",
      label: "班次类型",
      prop: "",
      placeholder: "请输入班次类型",
    },
  ]);
  getStatList();
});

interface User {
  date: string;
  name: string;
  address: string;
}
const tableData: any = ref([]);
const multipleSelection = ref<User[]>([]);
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await orderTemplate(form);
    state.loading = false;
    tableData.value = data.list;
    state.total = data.total;
  } catch (e: any) {
    state.loading = false;
    ElMessage.error(e.message);
  }
};

const searchInput = () => {
  getStatList();
};
const onSubmit = () => {
  getStatList();
};
const changeProject = async (value: number) => {
  formProjectDialog.projectName = projectOption.value?.filter(
    (val: any) => val.value === value
  )[0].label;
  getLineInfoList(value);
};
const changeRoute = async (type: string, list: any) => {
  const routerList = list?.filter(
    (val: any) => val.id === formProjectDialog[type + "Id"]
  )[0];
  formProjectDialog[type + "Name"] = routerList.name;
  formProjectDialog.customerId = routerList.customerCode;
  formProjectDialog.customerName = routerList.customer;
  formProjectDialog.driverType = routerList.upDriverType;
  state.shiftOrderLoading = true;
  try {
    state.shiftOrderLoading = false;
    const { data } = await maxShift0rder(formProjectDialog.routeId);
    formProjectDialog.shiftOrder = data.shiftOrder + 1;
  } catch (e: any) {
    state.shiftOrderLoading = false;
    ElMessage.error(e.message);
  }
  // upDriverType.value = routerList.upDriverType;
};
const changeItem = (
  value: string,
  key: string,
  list: any,
  phoneNumber: any
) => {
  const obj = list?.filter(
    (val: any) => val.id === formProjectDialog[value]
  )[0];
  formProjectDialog[key] = obj.label;
  if (phoneNumber) {
    formProjectDialog[phoneNumber] = obj.phone;
  }
};
const formRef = ref();
const sureClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (Number(formProjectDialog.driverType) === 1) {
        formProjectDialog.secondDriverPhone = null;
        formProjectDialog.secondDriverName = null;
        formProjectDialog.secondDriverId = null;
      }
      state.dialogTitle === "新增"
        ? await orderTemplateAdd(formProjectDialog)
        : await orderTemplateUpd(formProjectDialog);
      state.dialogVisible = false;
      getStatList();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const preOrderDate = ref("");
const clickSwitch = () => {
  state.intelligentSwitch = true;
  preOrderDate.value = "";
};

const dispatch = async () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  try {
    const { data } = await oneKeySchedule(
      arr,
      "/api/v1/orderTemplate/oneKeySchedule/",
      {ids:arr,preOrderDate:preOrderDate.value}
    );
    ElMessage.success("调度成功");
    state.intelligentSwitch = false;
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
    console.log(e.message);
  }
};

const editClick = async (index: number, row: any) => {
  state.dialogTitle = "编辑";
  state.dialogVisible = true;
  await getLineInfoList(row.projectId);
  Object.assign(formProjectDialog, row);

  // dialoglicenseOptions.value = [{id:row.routeId,name:row.routeName}]
};
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
const batchVehicle = () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  handleDelete(arr);
};
// 批量删除与单个删除
const handleDelete = async (ids: any) => {
  await envDeleteTractor(ids, "/api/v1/orderTemplate/");
  getStatList();
};

const clickEnable = async (index: number, row: any) => {
  try {
    const { data } = await envEnableDisable(
      row.id,
      "/api/v1/orderTemplate/enable/"
    );
    ElMessage.success("启用成功");
    getStatList();
  } catch (e: any) {
    // ElMessage.error(e.message);
    console.log(e.message);
  }
};
const clickDisable = async (index: number, row: any) => {
  try {
    const { data } = await envEnableDisable(
      row.id,
      "/api/v1/orderTemplate/disable/"
    );
    ElMessage.success("禁用成功");
    getStatList();
  } catch (e: any) {
    // ElMessage.error(e.message);
    console.log(e.message);
  }
};
const callback = (row: any) => {
  return Number(row.status) === 1;
};
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
const closeDialog = () => {
  formRef.value?.resetFields();
  formProjectDialog.driverType = "1";
  formProjectDialog.secondDriverId = null;
  formProjectDialog.secondDriverName = null;
  formProjectDialog.secondDriverPhone = null;
};
const collapseExpand = (val: boolean) => {
  val ? (height.value = height.value + 50) : (height.value = height.value - 50);
};
const fileOption = (list: any, code: number) => {
  return list.filter((n: any) => n.value === code)[0]?.label;
};
const fileStatus = (val: number) => {
  let status = ["禁用", "启用"];
  return status[val];
};
const newBuilt = async () => {
  state.dialogVisible = true;
  state.dialogTitle = "新增";
};
const cancellation = () => {
  state.dialogVisible = false;
  state.intelligentSwitch = false;
};
const dateRangePickerOptions = (time: any) => {
  return time.getTime() < Date.now() - 8.64e7;
};
const emitBack = () => {
  // state.intelligentSwitch = false;
};
</script>
<style scoped lang="scss">
.app-container {
  height: 100%;
}
.scope-icon {
  :deep(.el-icon) {
    vertical-align: middle;
  }
}

:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}

:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
:deep(.el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
:deep(.el-dialog__body) {
  padding: 10px var(--el-dialog-padding-primary);
}
.margin-bo {
  margin-bottom: 10px;
}
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor1 {
  background: #3270ff;
}
.roundColor0 {
  background: #bbbbbb;
}
</style>
