<template>
  <div class="map-content">
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
        <el-breadcrumb-item :to="{ path: '/sanitation/line' }"
          ><span style="color: #8c8c8c">无人环卫</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/sanitation/driving/statistics/' }"
          ><span style="color: #8c8c8c">远程驾驶</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span style="color: #303030">驾驶台管理</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi">
      <Form
        class="hide-form"
        :formModel="queryParames"
        :fromList="fromList"
        @searchInput="searchInput"
        @onSubmit="onSubmit"
      >
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
      </el-row>
      <el-table
        :data="tableData"
        v-loading="state.loading"
        :max-height="setHeight"
        size="default"
        style="width: 100%; margin-top: 16px"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column width="" prop="cockpitCode" label="驾驶台编码" />
        <el-table-column width="" prop="cockpitName" label="驾驶台名称" />
        <el-table-column width="" prop="cockpitIp" label="驾驶台ip" />
        <el-table-column width="" prop="cockpitConfig" label="驾驶台配置" />
        <el-table-column width="" prop="keeper" label="驾驶台保管人" />
        <el-table-column width="" prop="status" label="状态">
          <template #default="scope">
            <span
              class="round"
              :class="scope.row.status === '已禁用'?'roundColor0':'roundColor1'"
            ></span>  <span :class= "scope.row.status === '已禁用' ?'disabled-color':'active-color'"> {{ scope.row.status === '已禁用' ? "禁用" : "启用" }} </span>
          </template>
        </el-table-column>
        <el-table-column width="" prop="priority" label="使用优先级" />
        <el-table-column  align="right" label="操作" width="140">
          <template #default="scope">
            <el-button
              key="text"
              type="text"
              v-show="scope.row.status==='已禁用'"
              @click.stop="editClick(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除吗?"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button @click.stop key="text" v-show="scope.row.status==='已禁用'" type="text">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button
              key="text"
              type="text"
              v-show="scope.row.status==='已禁用'"
              @click.stop="clickEnable(scope.$index, scope.row)"
              >启用</el-button
            >
            <el-button
              key="text"
              type="text"
              v-show="scope.row.status==='已启用'"
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
          :page-sizes="[10, 20, 30, 40]"
          :total="state.total"
        />
      </el-row>
    </div>
    <el-dialog
      width="784"
      v-model="state.dialogVisible"
      :close-on-click-modal="false"
      @close="cancelClick"
      class="newDialogClass"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">{{ state.title }}驾驶台</div>
      </template>
      <el-form
        :model="newForm"
        :rules="newRules"
        label-position="left"
        label-width="100px"
        ref="newFormRef"
        class="newFormClass"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="驾驶台名称" prop="cockpitName">
              <el-input
                v-model="newForm.cockpitName"
                placeholder="请输入驾驶台名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="&nbsp;&nbsp;驾驶台ip" prop="cockpitIp">
              <el-input
                v-model="newForm.cockpitIp"
                placeholder="请输入驾驶台ip"
              /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;保管人" prop="keeper">
              <el-input
                v-model="newForm.keeper"
                placeholder="请输入保管人"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="使用优先级" prop="priority">
              <el-input
                v-model="newForm.priority"
                type="number"
                placeholder="请输入使用优先级"
                max="5"
                min="1"
              /> </el-form-item
          ></el-col>
          <el-col :span="24"
            ><el-form-item label="&nbsp;&nbsp;驾驶台配置" prop="cockpitConfig">
              <el-input
                v-model="newForm.cockpitConfig"
                type="textarea"
                placeholder="请输入驾驶台配置"
              /> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelClick">取 消</el-button>
          <el-button
            type="primary"
            @click="newFormClick(newFormRef)"
            :disabled="state.getDisabled"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import type { FormInstance } from "element-plus";
import { RouterParmes, BoxParmes, BoxAdd } from "@/api/sanitation/type";
import { boxPage, genCode, boxAdd, boxUpd, deleteBox, enableDisable } from "@/api/sanitation/index";
import { useElementSize } from "@vueuse/core";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 210;
});
const state = reactive({
  dialogVisible: false,
  title: "",
  loading: false,
  total: 0,
});

const newForm = ref<BoxAdd>({
  cockpitName: "",
  cockpitIp: "",
  keeper: "",
  priority: 5,
  cockpitConfig: "",
  cockpitCode: null,
});
const newRules = {
  priority: [{ required: true, message: "优先级", trigger: "blur" }],
  cockpitName: [{ required: true, message: "驾驶台名称", trigger: "blur" }],
  // cockpitIp: [{ required: true, message: "驾驶台ip", trigger: "blur" }],
  // cockpitConfig: [{ required: true, message: "驾驶台配置", trigger: "blur" }],
  // keeper: [{ required: true, message: "驾驶台保管人", trigger: "blur" }],
};
const queryParames = ref<BoxParmes>({
  pageNum: 1,
  pageSize: 10,
  name: "",
  keeper: "",
  status: undefined,
});
onMounted(() => {
  getStatList();
});
const tableData: any = ref([]);
// 列表查询
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await boxPage(queryParames.value);
    state.total = data.total;
    tableData.value = data.records;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const newFormRef = ref<FormInstance>();
// 确定
const newFormClick = async (formEl: FormInstance | undefined) => {
  // state.title === "新建" ? await postNewOrder() : await putNewOrder();
  if (!formEl) return;
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      state.title === "新建" ? await postBoxAdd() : await putBoxUpd();
    } else {
      console.log('error submit!', fields)
    }
    
  });
};
const postBoxAdd = async () => {
  try {
    const code = await getGenCode();
    newForm.value.cockpitCode = code;
    const { data } = await boxAdd(newForm.value);
    state.dialogVisible = false;
    getStatList();
    ElMessage.success(data);
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const putBoxUpd = async () => {
  try {
    const { data } = await boxUpd(newForm.value);
    debugger
    state.dialogVisible = false;
    getStatList();
    ElMessage.success(data);
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const getGenCode = async () => {
  try {
    const { data } = await genCode();
    return data
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const editClick = async(index: number, row: any) => {
  state.dialogVisible = true;
  state.title = '编辑';
  await nextTick();
  Object.assign(newForm.value,row)
  // newForm.value = row;
};

const clickEnable = async (index: number, row: any)=>{
  try{
    const { data } = await enableDisable(row.id,'/envSrv/rd/box/enable/');
    ElMessage.success(data);
    getStatList();
  }catch (e: any) {
    // ElMessage.error(e.message);
    console.log(e.message)
  }
}
const clickDisable = async (index: number, row: any)=>{
  try{
    const { data } = await enableDisable(row.id,'/envSrv/rd/box/disable/');
    ElMessage.success(data);
    getStatList();
  }catch (e: any) {
    // ElMessage.error(e.message);
    console.log(e.message)
  }
}

const searchInput = () => {
  getStatList();
};

const onSubmit = () => {
  getStatList();
};
const fromList = reactive([
  {
    type: "input",
    label: "驾驶台名称",
    prop: "name",
    placeholder: "请输入驾驶台名称",
  },
  {
    type: "selectValue",
    label: "启用状态",
    prop: "status",
    placeholder: "请选择启用状态",
    optionList: [
      {
        label: "启用",
        value: "1",
      },
      {
        label: "禁用",
        value: "0",
      },
    ],
  },
  {
    type: "input",
    label: "保管人姓名",
    prop: "keeper",
    placeholder: "请输入保管人姓名",
  },
  {
    type: "row",
  },
  {
    type: "row",
  },
]);
const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
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
  await deleteBox(ids, "/envSrv/rd/box/");
  getStatList();
};
const handleUseSizeChange = (value: number) => {
  queryParames.value.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  queryParames.value.pageNum = value;
  getStatList();
};
// 新增
const newBuilt = () => {
  state.dialogVisible = true;
  state.title = "新建";
};
// 取消
const cancelClick = () => {
  state.dialogVisible = false;
  newFormRef.value?.resetFields();
};
</script>
<style scoped lang="scss">
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}
:deep(.el-form-item--default) {
  margin-bottom: 32px;
}
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
:deep(.el-button--text.is-disabled) {
  color: var(--el-color-primary);
  opacity: 0.5;
}
.newFormClass {
  padding-bottom: 0;
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
  background: #3270FF;
}
.roundColor0 {
  background: #bbbbbb;
}
</style>
