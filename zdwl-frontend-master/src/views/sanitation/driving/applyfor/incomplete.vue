<template>
  <Form
    class="hide-form"
    :formModel="props.form"
    :fromList="props.list"
    ref="formList"
    @searchInput="searchInput"
    @onSubmit="onSubmit"
  >
    <template #formSlot> </template>
  </Form>
  <el-row>
    <el-button @click="newBuilt" type="primary" size="default">新建</el-button>
  </el-row>
  <el-table
    :data="tableData"
    v-loading="state.loading"
    :show-overflow-tooltip="true"
    :max-height="height"
    row-key="id"
    size="default"
    style="width: 100%; margin-top: 16px"
  >
    <!-- <el-table-column type="selection" width="55" /> -->
    <el-table-column width="200" prop="code" label="调度单编号" />
    <el-table-column width="" prop="status" label="单据状态">
      <template #default="scope">
        <span class="round" :class="'roundColor' + scope.row.status"></span
        >{{ filterStatus(scope.row.status) }}
      </template>
    </el-table-column>
    <el-table-column width="" prop="dispatchType" label="单据类型">
      <template #default="scope">
        {{ filterDispatchType(scope.row.dispatchType) }}
      </template>
    </el-table-column>
    <el-table-column width="170" prop="createTime" label="创建时间" />
    <el-table-column width="" prop="cockpitCode" label="台架编码" />
    <el-table-column width="" prop="vehCode" label="车辆编号" />
    <el-table-column width="180" prop="driverName" label="安全员姓名" />
    <el-table-column width="" prop="vehState" label="车辆状态" />
    <el-table-column width="" prop="rdStartTime" label="开启时间" />
    <el-table-column align="right" label="操作" width="160">
      <template #default="scope">
        <el-button
          key="text"
          v-show="scope.row.status == 0"
          type="text"
          @click="submitClick(scope.row)"
          >提交</el-button
        >
        <el-button
          key="text"
          v-show="scope.row.status == 0"
          type="text"
          @click="editClick(scope.row)"
          >编辑</el-button
        >
        <el-popconfirm title="确定要删除吗?" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button v-show="scope.row.status == 0" key="text" type="text"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          key="text"
          v-show="scope.row.status == 1"
          type="text"
          @click="cancelClick(scope.row)"
          >取消</el-button
        >
        <el-button
          key="text"
          v-show="scope.row.status == 1"
          type="text"
          @click="transfer3dtiles(scope.row)"
          >开始</el-button
        >
        <el-popconfirm title="确定要结束吗?" @confirm="finishClick(scope.row)">
          <template #reference>
            <el-button key="text" v-show="scope.row.status == 2" type="text"
              >结束</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          key="text"
          v-show="scope.row.status == 1 || scope.row.status == 2"
          type="text"
          @click="configuration(scope.row)"
          >配置</el-button
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
      :page-sizes="[10, 20, 30, 40]"
      :total="state.total"
    />
  </el-row>
  <el-dialog
    width="1000"
    v-model="state.configurationState"
    class="newDialogClass"
    @close="cancellation"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">参数设置({{ state.title }})</div>
    </template>
    <div class="dialog-content">
      <el-form
        :model="formProjectDialog"
        label-width="150px"
        v-loading="state.configurationLoading"
        :show-message="false"
        size="default"
        ref="projectFormRef"
        label-position="left"
        class="map-content"
      >
        <el-row :gutter="80" :align="'middle'">
          <el-col class="margin-bo" :span="8">
            <el-form-item label="最大车速限制(km/h)" prop="vehSpdLimit">
              <el-input-number
                v-model="formProjectDialog.vehSpdLimit"
                :precision="0"
                :min="0"
                :max="60"
              />
            </el-form-item>
          </el-col>
          <el-col class="margin-bo" :span="8">
            <el-form-item label="驱动扭矩限制等级" prop="tranTypeCode">
              <el-input-number
                v-model="formProjectDialog.driveTorqueLimit"
                :precision="0"
                :min="0"
                :max="4"
              />
            </el-form-item>
          </el-col>
          <el-col class="margin-bo" :span="8">
            <el-form-item label="制动减速限制等级" prop="tranTypeCode">
              <el-input-number
                v-model="formProjectDialog.brakeDeceleLimit"
                :precision="0"
                :min="0"
                :max="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="text-center text-16px">摄像头开关设置</div>
        <el-row class="row-flex">
          <el-col v-for="item in formProjectDialog.cameraSetList" :span="6">
            <el-form-item
              :key="item.index"
              :label="filterLabel(item.index)"
              label-width="100px"
            >
              <el-switch
                :disabled="filterDisbled(item.index)"
                v-model="item.on"
                size="large"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="operate">
      <el-button @click="cancellation" size="default">取消</el-button>
      <el-button type="primary" @click="submitForm()" size="default"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, inject } from "vue";
import { StatusForm, DispatchForm } from "@/api/sanitation/type";
import {
  dispatchPage,
  deleteBox,
  dispatchPut,
  configQuery,
  configSet,
} from "@/api/sanitation";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { useUserStore } from "@/store/modules/user";

import { openUriWithTimeoutHack } from "./js/protocolcheck";
const height: any = inject("height");
const state = reactive({
  loading: false,
  total: 0,
  configurationState: false,
  configurationLoading: false,
  vehVin: "",
  title: "",
});

const emit = defineEmits(["newBuiltClick", "editClickRow"]);
onMounted(() => {
  getStatList();
});
const props = defineProps<{ form: DispatchForm; list: any[] }>();

const tableData: any = ref([]);
// 列表查询
const getStatList = async () => {
  state.loading = true;
  let parmers = {} as unknown as DispatchForm;
  Object.assign(parmers, props.form);
  parmers.dateFrom = props.form.picker[0];
  parmers.dateTo = props.form.picker[1];
  parmers.picker = [];
  try {
    const { data } = await dispatchPage(parmers);
    tableData.value = data.records;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const filterStatus = (val: any) => {
  let status = ["草稿", "已提交", "进行中"];
  return status[val];
};
const filterDispatchType = (val: any) => {
  let list = [
    {
      key: "手工建单",
      value: "1",
    },
    {
      key: "自动建单",
      value: "2",
    },
  ];
  return list.filter((n) => n.value === val)[0].key;
};
const arr = [
  { index: "0", value: "正前摄像", disbale: false },
  { index: "1", value: "左侧摄像", disbale: false },
  { index: "2", value: "右侧摄像", disbale: false },
  { index: "3", value: "左后摄像", disbale: true },
  { index: "4", value: "右后摄像", disbale: true },
  { index: "5", value: "驾驶室内摄像", disbale: true },
  { index: "6", value: "前补摄像", disbale: true },
  { index: "7", value: "后视摄像", disbale: false },
];
const filterLabel = (val: string) => {
  return arr.filter((n) => n.index == val)[0].value;
};
const filterDisbled = (val: string) => {
  return arr.filter((n) => n.index == val)[0].disbale;
};
const projectFormRef = ref();
const resetForm = () => {
  projectFormRef.value.resetFields();
};
const formProjectDialog = reactive({});

// 配置
const configuration = async (row: any) => {
  state.configurationState = true;
  state.title = row.code;
  await nextTick();
  resetForm();
  state.configurationLoading = true;
  try {
    const { data } = await configQuery({ vehVin: row.vehVin }).finally(
      () => (state.configurationLoading = false)
    );
    Object.assign(formProjectDialog, data);
    // formProjectDialog.vehVin = row.vehVin;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.configurationLoading = false;
  }
};
const cancellation = () => {
  state.configurationState = false;
};
const submitForm = async () => {
  try {
    const { data } = await configSet(formProjectDialog);
    ElMessage.success("配置成功");
    state.configurationState = false;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
// 编辑
const editClick = (row: any) => {
  emit("editClickRow", row);
};

// 提交
const userStore = useUserStore();
const submitClick = async (row: any) => {
  let parmers = {
    updateBy: userStore.user.username,
    id: row.id,
  };
  try {
    await dispatchPut(parmers, "/envSrv/rd/dispatch/submit");

    ElMessage.success("提交成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
  getStatList();
};
// 取消
const cancelClick = async (row: any) => {
  let parmers = {
    updateBy: userStore.user.username,
    id: row.id,
  };
  try {
    await dispatchPut(parmers, "/envSrv/rd/dispatch/cancel");

    ElMessage.success("取消成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
  getStatList();
};
const transfer3dtiles = (row: any) => {
  openUriWithTimeoutHack(
    "myApp://",
    () => {
      ElMessage.error("请先安装远驾客户端到指定目录！");
    },
    () => {
      startClick(row);
    }
  );
};
// 开始
const startClick = async (row: any) => {
  let parmers = {
    updateBy: userStore.user.username,
    id: row.id,
  };
  try {
    await dispatchPut(parmers, "/envSrv/rd/dispatch/start");
    getStatList();
    ElMessage.success("开始成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
// 结束
const finishClick = async (row: any) => {
  let parmers = {
    updateBy: userStore.user.username,
    id: row.id,
  };
  try {
    await dispatchPut(parmers, "/envSrv/rd/dispatch/finish");

    ElMessage.success("结束成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
  getStatList();
};
// 删除
const deleteClick = (row: any) => {
  handleDelete(row.id);
};
const handleDelete = async (ids: any) => {
  try {
    await deleteBox(ids, "/envSrv/rd/dispatch/");
    ElMessage.success("删除成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }

  getStatList();
};
const searchInput = () => {
  getStatList();
};

const onSubmit = () => {
  getStatList();
};
const handleUseSizeChange = (value: number) => {
  props.form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  props.form.pageNum = value;
  getStatList();
};
const newBuilt = () => {
  emit("newBuiltClick");
};
</script>
<style scoped lang="scss">
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
  background: #ffb608;
}
.roundColor2 {
  background: green;
}

.row-flex {
  display: flex;
  justify-content: space-between;
  width: 800px;
  margin: 20px auto 0;
  :deep(.el-form-item__label) {
    line-height: 40px;
  }
}
</style>
