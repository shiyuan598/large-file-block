<template>
  <div class="all-height">
    <Form
      :formModel="form"
      :fromList="list"
      @searchInput="searchInput"
      @onSubmit="onSubmit"
    >
      <template #formSlot>

      </template>
    </Form>
    <el-row>
      <el-button @click="exportVehicle" size="default">导出</el-button>
    </el-row>
    <el-table
      :data="tableData"
      :max-height="height"
      @sort-change="sortChange"
      v-loading="state.loading"
      style="width: 100%; margin-top: 16px"
    >
      <!-- <el-table-column type="index" width="80" /> -->
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column prop="driver" label="司机名称" />
      <el-table-column prop="phone" label="司机手机号" />
      <el-table-column prop="business" label="场景" />
      <el-table-column prop="result" label="培训情况">
        <template #default="scope">
          <span>{{ scope.row.result === 0 ? "未学习" : "已学习" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="learnDate" sortable="custom" label="培训日期">
        <template #default="scope">
          <span>{{ scope.row.learnDate || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="action" width="142" label="操作">
        <template #default="scope">
          <el-button
            @click.stop="editClick(scope.$index, scope.row)"
            key="text"
            type="text"
            >编辑</el-button
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
    <el-dialog v-model="state.dialogVisible" width="70%">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          修改项目情况
          <!-- <div>{{ formDialog.id ? "编辑" : "新建" }}配件</div> -->
        </div>
      </template>
      <div class="border"></div>
      <div class="dialog-content">
        <el-form
          :model="editProject"
          :rules="rulesEditProject"
          label-width="90px"
          v-loading="state.loading"
          ref="ruleFormRef"
          size="default"
          label-position="left"
          class="map-content"
        >
          <el-row :gutter="80" :align="'middle'">
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="项目名称" prop="projectName">
                <el-input
                  disabled
                  v-model="editProject.projectName"
                  placeholder="请输入项目名称"
                /> </el-form-item
            ></el-col>
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="司机名称" prop="driver">
                <el-input
                  disabled
                  v-model="editProject.driver"
                  placeholder="请输入司机名称"
                /> </el-form-item
            ></el-col>
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="手机号" prop="phone">
                <el-input
                  disabled
                  v-model="editProject.phone"
                  placeholder="请输入手机号"
                /> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="业务场景" prop="businessList">
                <el-select
                  v-model="editProject.businessList"
                  style="width: 100%"
                  multiple
                  disabled
                  placeholder="请选择业务场景"
                  @change="(val:number|string)=>selectLabel(val,'business')"
                >
                  <el-option
                    v-for="item in setDictionary.state.business"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="学习情况" prop="result">
                <el-select
                  v-model="editProject.result"
                  style="width: 100%"
                  placeholder="请选择学习情况"
                >
                  <el-option label="已学习" :value="1" />
                  <el-option label="未学习" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="margin-bo"
              ><el-form-item label="学习日期" prop="learnDate">
                <el-date-picker
                  v-model="editProject.learnDate"
                  type="date"
                  format="YYYY-MM-DD"
                  placeholder="请选择学习日期"
                /> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
      </div>
      <div class="aline-right">
        <el-button @click="cancellation" size="default">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          size="default"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, toRef, defineExpose, inject } from "vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { State, AssemblyForm, UseParmes } from "@/api/vehicleInfo/types";
import type { FormInstance } from "element-plus";
import { dictionary } from "@/store/modules/dictionary";
import { projectForm, EditProject } from "@/api/secure/types";
import { exportFile } from "@/utils";
import { resultPage, safeResult } from "@/api/secure";

const height: any = inject("height");
const form = reactive<projectForm>({
  keywords: "",
  business: "",
  businessArr: [],
  startTime: "",
  endTime: "",
  picker: [],
  result: null,
  driver:'',
  learnDateSort: "desc",
  pageNum: 1,
  pageSize: 10,
});
const state = reactive<State>({
  button: false,
  optionHideen: true,
  loading: false,
  dialogVisible: false,
  waitVisible: false,
  total: 0,
});
const editProject = reactive<EditProject>({
  projectName: "",
  projectCode: undefined,
  driver: "",
  phone: "",
  business: "",
  result: undefined,
  learnDate: "",
  businessList: [],
  id: undefined,
});
const rulesEditProject = reactive({
  projectName: [
    {
      required: true,
      message: "请输入项目名称",
      trigger: "change",
    },
  ],
  driver: [
    {
      required: true,
      message: "请输入司机名称",
      trigger: "change",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入司机手机号",
      trigger: "change",
    },
  ],
  business: [
    {
      required: true,
      message: "请选择场景",
      trigger: "change",
    },
  ],
  result: [
    {
      required: true,
      message: "选择学习情况",
      trigger: "change",
    },
  ],
});

const tableData = ref([]);
const getStatList = async () => {
  let parmes = {
    startTime: form.picker && form.picker[0],
    endTime: form.picker && form.picker[1],
    keywords: form.keywords,
    business: form.businessArr?.join(","),
    pageNum: form.pageNum,
    pageSize: form.pageSize,
    result: form.result,
    driver: form.driver,
  };
  state.loading = true;
  const { data } = await resultPage(parmes);
  try {
    tableData.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage(e.message);
    state.loading = false;
  }
};

const sortChange = (column: any) => {
  form.learnDateSort = column.order === "descending" ? "asc" : "desc";
  getStatList();
};
const selectLabel = (val: any | string, label: any) => {
  let list: any = [];
  val.map((n: number) => {
    list.push(
      setDictionary.state.business.filter(
        (i: { label: string; value: Number }) => i.value === n
      )[0].label
    );
  });
  editProject.business = list.join(",");
};
const ruleFormRef = ref<FormInstance>();
const editResult = async () => {
  console.log(editProject);
  const { data } = await safeResult(editProject, editProject.id);
  try {
    state.dialogVisible = false;
    getStatList();
  } catch (e: any) {
    state.dialogVisible = false;
    ElMessage.error(e.message);
  }
};
// 修改项目情况
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      editResult();
    } else {
      console.log("error submit!", fields);
    }
  });
};
const cancellation = () => {
  state.dialogVisible = false;
};
// 修改
const editClick = async (index: any, row: any) => {
  state.dialogVisible = true;
  await nextTick();
  Object.assign(editProject, row);
  editProject.businessList = row.business.split(",");
};

// 查询
const onSubmit = () => {
  getStatList();
};
// 导出
const exportVehicle = () => {
  let parmes = {
    startTime: form.picker && form.picker[0],
    endTime: form.picker && form.picker[1],
    keywords: form.keywords,
    business: form.businessArr?.join(","),
    pageNum: form.pageNum,
    pageSize: form.pageSize,
    result: form.result,
    driver: form.driver,
  };
  exportFile(parmes, "/api/v1/safe/result/_export");
};
const setDictionary: any = dictionary();
let list: AssemblyForm[] = reactive([]);
const setList = () => {
  Object.assign(list, [
    {
      type: "input",
      label: "项目名称",
      prop: "keywords",
      placeholder: "请输入项目名称",
    },
    {
      type: "select",
      label: "业务场景",
      prop: "businessArr",
      placeholder: "请输入业务场景",
      optionList: setDictionary.state.business,
      multiple: true,
    },
    {
      type: "picker",
      label: "培训日期",
      prop: "picker",
      placeholder: "请选择培训日期",
    },
    {
      type: "selectValue",
      label: "培训情况",
      prop: "result",
      placeholder: "请选择培训情况",
      optionList: [
        {
          label: "已学习",
          value: 1,
        },
        {
          label: "未学习",
          value: 0,
        },
      ],
    },
    {
      type: "input",
      label: "司机名称",
      prop: "driver",
      placeholder: "请输入司机名称",
    },
  ]);
};
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};

const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
onMounted(() => {
  getStatList();
});
const searchInput = () => {
  getStatList();
};
defineExpose({
  setList,
});
</script>
<style scoped lang="scss">
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
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
.text-color {
  color: #409eff;
  cursor: pointer;
}
.releaseText {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: rgba(48, 48, 48, 0.88);
  background: #fffbe6;
  border: 1px solid #ffe5a8;
  margin-top: 8px;
  overflow: hidden;
}
.video-js {
  width: 100%;
  height: 600px;
  // :deep(.vjs-progress-control){
  //   height: 10px;
  //   width: 100%;
  //   bottom: 0;
  //   position: absolute;
  // }
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
.iconStyle {
  margin: 12px;
  vertical-align: bottom;
}
.record {
  color: #323233;
  font-size: 14px;
  font-weight: 600;
}
.my-header {
  color: #303030;
  font-size: 16px;
  font-weight: 600;
}
</style>
