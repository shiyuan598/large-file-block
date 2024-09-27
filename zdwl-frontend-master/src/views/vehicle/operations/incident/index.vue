<template>
  <div class="app-container">
    <div>
      <el-container>
        <!-- <el-header style="background-color: white;position: relative;">
          <span style="font-size: 12px;color: rgb(181, 181, 181);position: absolute;top: 35%;">当前位置：智能车管
            <span style="padding: 10px;">-</span>
            <span style="color: rgb(181, 181, 181)">智慧运营</span>
            <span style="padding: 10px;">-</span>
            <span style="color:black;">事故管理</span>
          </span>
        </el-header> -->
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
            "
            >当前位置：</span
          >
          <el-breadcrumb
            separator="-"
            style="display: flex; align-items: center"
          >
            <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }"
              >智能车管</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/vehicle/operations/repairs' }"
              >智慧运营</el-breadcrumb-item
            >
            <el-breadcrumb-item
              style="
                font-size: 14px;
                font-family: PingFangSC, PingFang SC;
                color: #323233;
              "
              v-if="!importFlg"
              >事故管理</el-breadcrumb-item
            >
            <el-breadcrumb-item
              :to="{ path: '/vehicle/operations/incident' }"
              @click="returnList"
              v-if="importFlg"
              >事故管理</el-breadcrumb-item
            >
            <el-breadcrumb-item
              style="
                font-size: 14px;
                font-family: PingFangSC, PingFang SC;
                color: #323233;
              "
              v-if="importFlg"
              >导入</el-breadcrumb-item
            >
          </el-breadcrumb>
        </el-header>
        <el-main>
          <div v-if="!importFlg">
            <el-card shadow="never">
              <div class="parkClass">
                <footer class="header__footer">
                  <el-form
                    :model="queryParams"
                    class="demo-form-inline"
                    ref="queryFormRef"
                    style="margin-bottom: 0px"
                  >
                    <el-row class="row-bg" justify="space-between">
                      <el-col :span="6">
                        <el-form-item label="车牌号">
                          <el-select
                            v-model="queryParams.keywords"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请选择车牌号码"
                            style="width: 100%"
                            :remote-method="remoteMethod"
                            clearable
                          >
                            <el-option
                              v-for="item in cardOptions"
                              :key="item.card"
                              :label="item.card"
                              :value="item.card"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="事故日期">
                          <el-date-picker
                            v-model="state.time"
                            type="daterange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            date-format="YYYY/MM/DD ddd"
                            style="width: 100%"
                            @change="datePickerStartChange"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="事故类型">
                          <el-input
                            v-model="queryParams.accidentType"
                            placeholder="请输入事故类型"
                            clearable
                          />
                          <!-- <el-select v-model="queryParams.accidentType" size="default" placeholder="请选择事故类型" style="align-items: center;width: 100%;">
                            <el-option
                              v-for="item in accidentTypeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select> -->
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row class="row-bg" justify="space-between">
                      <el-col :span="6">
                        <el-form-item label="驾驶员">
                          <el-input
                            v-model="queryParams.driver"
                            placeholder="请输入驾驶员"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="业务场景">
                          <el-select
                            v-model="queryParams.business"
                            size="default"
                            placeholder="请选择业务场景"
                            style="align-items: center; width: 100%"
                            clearable
                          >
                            <el-option
                              v-for="item in businessOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.label"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="justify-content: flex-end">
                        <div style="display: flex">
                          <el-button style="margin-right: 10px" @click="onReset"
                            >重置</el-button
                          >
                          <el-button type="primary" @click="handleQuery"
                            >查询</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </footer>
                <el-row class="mb-4">
                  <el-button type="primary" @click="newClick">新建</el-button>
                  <el-button @click="importClick">导入</el-button>
                  <el-button @click="exportClick">导出</el-button>
                  <el-button @click="delClick">删除</el-button>
                  <div
                    class="indexClass"
                    style="display: flex; align-items: center; height: 30px"
                  >
                    <span class="span-color">共</span
                    ><span style="padding: 5px" class="text-span">{{
                      total
                    }}</span
                    ><span class="span-color">条</span>
                    <span style="padding: 0 20px">|</span>
                    <span class="span-color">维修金额</span
                    ><span style="padding: 5px" class="text-span">{{
                      repairAmount
                    }}</span
                    ><span class="span-color">元</span>
                  </div>
                </el-row>
                <div style="padding: 10px 20px; width: 100%">
                  <el-table
                    ref="multipleTableRef"
                    :data="state.tableData"
                    style="width: 100%"
                    header-cell-class-name="headclass"
                    v-loading="loading"
                    @selection-change="handleSelectionChange"
                    border
                    show-overflow-tooltip="true"
                    tooltip-effect="light"
                    @sort-change="sortChange"
                  >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="card" label="车牌号码" />
                    <el-table-column
                      prop="accidentTime"
                      label="事故日期"
                      sortable
                    >
                      <template #default="scope">
                        {{ dayjs(scope.row.accidentTime).format("YYYY-MM-DD") }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="handleStatus" label="状态">
                      <template #default="scope">
                        <div
                          v-if="scope.row.handleStatus == '0'"
                          style="display: flex"
                        >
                          <el-badge is-dot class="processed"></el-badge>未处理
                        </div>
                        <div
                          v-if="scope.row.handleStatus == '1'"
                          style="display: flex"
                        >
                          <el-badge is-dot class="untreated"></el-badge>已处理
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="accidentType" label="事故类型" />
                    <el-table-column prop="location" label="发生地点" />
                    <el-table-column prop="content" label="事故描述" />
                    <el-table-column prop="driver" label="驾驶员" />
                    <el-table-column prop="result" label="处罚结果" />
                    <el-table-column
                      prop="amount"
                      label="自费金额(元)"
                      align="right"
                    />
                    <el-table-column prop="action" label="操作" width="180">
                      <template #default="scope">
                        <el-button
                          key="text"
                          type="text"
                          @click="editClick(scope.$index, scope.row)"
                          >编辑</el-button
                        >
                        <el-button
                          key="text"
                          type="text"
                          @click="handleDelete(scope.$index, scope.row)"
                          >删除</el-button
                        >
                        <el-button
                          key="text"
                          type="text"
                          @click="handleClick(scope.$index, scope.row)"
                          >处理</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-row class="pagination-style" justify="end">
                    <el-pagination
                      background
                      layout="total, prev, pager, next, sizes, jumper"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      @pagination="handleQuery"
                      :pager-count="5"
                      :page-sizes="[10, 20, 30, 40, 100]"
                      v-model:total="total"
                      v-model:page="queryParams.pageNum"
                      v-model:limit="queryParams.pageSize"
                    />
                  </el-row>
                </div>
              </div>
            </el-card>
          </div>
          <div v-if="importFlg">
            <el-card
              class="procurementClass"
              shadow="never"
              style="height: 85vh"
            >
              <importSlot
                :title="state.title"
                :apiFn="state.apiFn"
                :downFn="state.downFn"
                @returnList="returnList"
              ></importSlot>
            </el-card>
          </div>
        </el-main>
      </el-container>
      <!-- 添加或修改对话框 -->
      <el-dialog
        v-model="dialogNewVisible"
        :title="state.dialogAction == 'new' ? '新建' : '编辑'"
        width="50%"
        :before-close="handleClose"
        class="newDialogClass"
      >
        <el-form
          :model="newForm"
          :rules="newRules"
          label-position="left"
          label-width="100px"
          ref="newFormRef"
          class="newFormClass"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="业务场景" prop="business">
                <el-select
                  v-model="newForm.business"
                  size="default"
                  placeholder="请选择业务场景"
                  style="align-items: center; width: 100%"
                  @change="businessCodeChange"
                  clearable
                >
                  <el-option
                    v-for="item in businessOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车牌号码" prop="card">
                <el-select
                  v-model="newForm.card"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择车牌号码"
                  style="width: 100%"
                  :remote-method="remoteMethod"
                  clearable
                >
                  <el-option
                    v-for="item in cardOptions"
                    :key="item.card"
                    :label="item.card"
                    :value="item.card"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="事故日期" prop="accidentTime">
                <el-date-picker
                  v-model="newForm.accidentTime"
                  type="date"
                  placeholder="请选择事故日期"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                  date-format="YYYY/MM/DD ddd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故类型" prop="accidentType">
                <el-input
                  v-model="newForm.accidentType"
                  placeholder="请输入事故类型"
                  style="width: 100%"
                />
                <!-- <el-select v-model="newForm.accidentType" size="default" placeholder="请选择事故类型" style="align-items: center;width: 100%;">
                  <el-option
                    v-for="item in accidentTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发生地" prop="location">
                <el-input
                  v-model="newForm.location"
                  placeholder="请输入发生地"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驾驶员" prop="driver">
                <el-select
                  v-model="newForm.driver"
                  style="width: 100%"
                  filterable
                  placeholder="请选择驾驶员"
                >
                  <el-option
                    v-for="item in driverOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="事故描述"
            prop="content"
            style="padding-left: 30px; padding-top: 20px"
          >
            <el-input
              v-model="newForm.content"
              type="textarea"
              placeholder="请输入事故描述"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="newCancelClick">取 消</el-button>
            <el-button
              type="primary"
              @click="newFormClick"
              :disabled="getDisabled"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-model="dialogDeleteVisible"
        class="deleteDialogClass"
        width="25%"
        :before-close="handleClose"
      >
        <template #header>
          <div class="my-header">
            <div>
              <el-icon style="color: orange; top: 2px"
                ><WarningFilled
              /></el-icon>
              <span style="padding-left: 10px">确定要删除这条数据吗？</span>
            </div>
          </div>
        </template>
        <span>此条数据删除后将不可恢复，确定要删除吗</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogDeleteVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteFormConfirm"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <!-- 处理对话框 -->
      <el-dialog
        v-model="dialogHandleVisible"
        title="处理"
        width="40%"
        :before-close="handleHandleClose"
        class="newDialogClass"
      >
        <el-form
          :model="newHandleForm"
          :rules="newHandleRules"
          label-position="left"
          label-width="100px"
          ref="newHandleFormRef"
          class="newFormClass"
        >
          <el-form-item label="自费金额" prop="amount">
            <el-input
              v-model="newHandleForm.amount"
              placeholder="请输入自费金额"
              style="width: 100%"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="处罚结果" prop="result">
            <el-input
              v-model="newHandleForm.result"
              type="textarea"
              placeholder="请输入处罚结果"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="newHandleCancelClick">取 消</el-button>
            <el-button
              type="primary"
              @click="newHandleFormClick"
              :disabled="getHandleDisabled"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import {
  AccidentForm,
  AccidentQuery,
  AccidentPageVO,
} from "@/api/operations/incident/types";
import {
  getAccidentPage,
  updateAccident,
  addAccident,
  deleteAccident,
  exportAccident,
  getAccidentStat,
  importAccident,
  getAccidentTemplate,
} from "@/api/operations/incident/index";
import { getDictOptions } from "@/api/dict/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getRepair, getPark } from "@/api/supplier/index";
import importSlot from "@/views/Import/index.vue";
import dayjs from "dayjs";
import { driverList } from "@/api/depreciation";
const importFlg = ref(false);
const returnList = () => {
  importFlg.value = !importFlg.value;
};
const multipleSelection = ref([]);
const total = ref(0);
const dialogNewVisible = ref(false);
const dialogHandleVisible = ref(false);
const dialogDeleteVisible = ref(false);
const queryFormRef = ref(ElForm);
const queryParams = reactive<AccidentQuery>({
  pageNum: 1,
  pageSize: 10,
});
const state = reactive({
  showData: false,
  componentList: [],
  tableData: [],
  dialogTitle: "",
  dialogAction: "",
  deleteId: "",
  time: "",
  startTime: "",
  endTime: "",
  apiFn: importAccident,
  downFn: getAccidentTemplate,
  title: "智能车管 - 智慧运营 - 事故管理",
});
const repairAmount = ref(0);
const repairOptions = ref([] as any[]);
const cardOptions = ref([] as any[]);
const businessOptions = ref([] as any[]);
const supplierParkOptions = ref([] as any[]);
const accidentTypeOptions = ref([] as any[]);
const newFormRef = ref();
const getDisabled = computed(
  () =>
    newForm.card === "" ||
    newForm.accidentTime === "" ||
    newForm.accidentType === "" ||
    newForm.location === "" ||
    newForm.driver === "" ||
    newForm.content === ""
);
const getHandleDisabled = computed(
  () => newHandleForm.result === "" || newHandleForm.amount === ""
);
interface RuleForm {
  id: number;
  card: string;
  accidentTime: string;
  accidentType: string;
  location: string;
  driver: string;
  content: string;
  business: string;
  businessCode: string;
  handleStatus: number;
  result: string;
  amount: string;
}

interface RuleHandleForm {
  result: string;
  amount: string;
}

const newForm = reactive<RuleForm>({
  id: 0,
  card: "",
  accidentTime: "",
  accidentType: "",
  location: "",
  driver: "",
  content: "",
  business: "",
  businessCode: "",
  handleStatus: 0,
  result: "",
  amount: "",
});

const newHandleForm = reactive<RuleHandleForm>({
  result: "",
  amount: "",
});

const newRules = reactive<FormRules<RuleForm>>({
  business: [{ required: true, message: "请选择业务场景", trigger: "blur" }],
  card: [{ required: true, message: "请选择车牌号", trigger: "blur" }],
  accidentTime: [
    { required: true, message: "请选择事故日期", trigger: "blur" },
  ],
  accidentType: [
    { required: true, message: "请输入事故类型", trigger: "blur" },
  ],
  location: [{ required: true, message: "请输入发生地", trigger: "blur" }],
  driver: [{ required: true, message: "请输入驾驶员", trigger: "blur" }],
  content: [{ required: true, message: "请输入事故描述", trigger: "blur" }],
});

const newHandleRules = reactive<FormRules<RuleHandleForm>>({
  result: [{ required: true, message: "请输入处罚结果", trigger: "blur" }],
  amount: [{ required: true, message: "请输入自费金额", trigger: "blur" }],
});
// 司机姓名
const driverOptions = ref([]);
const getDriverList = async () => {
  try {
    const { data } = await driverList();
    driverOptions.value = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};

const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.accidentTimeSort = "asc";
  } else {
    queryParams.accidentTimeSort = "desc";
  }
  handleQuery();
};

const loading = ref(false);
const resetForm = () => {
  newForm.id = 0;
  newForm.card = "";
  newForm.accidentTime = "";
  newForm.accidentType = "";
  newForm.location = "";
  newForm.driver = "";
  newForm.content = "";
  newForm.business = "";
  newForm.businessCode = "";
  newForm.result = "";
  newForm.amount = "";
};

const resetHandleForm = () => {
  newHandleForm.result = "";
  newHandleForm.amount = "";
};

const handleClose = () => {
  dialogNewVisible.value = false;
  resetForm();
  resetHandleForm();
};

const handleHandleClose = () => {
  dialogHandleVisible.value = false;
  resetForm();
  resetHandleForm();
};
const handleFormClose = () => {
  dialogHandleVisible.value = false;
  resetForm();
  resetHandleForm();
};

const handleDeleteClose = () => {
  dialogDeleteVisible.value = false;
};

const businessCodeChange = (obj: any) => {
  newForm.businessCode = businessOptions.value.find(
    (item) => item.label === obj
  ).value;
};

const onReset = () => {
  state.time = "";
  queryParams.keywords = "";
  queryParams.time = "";
  queryParams.startTime = "";
  queryParams.endTime = "";
  queryParams.accidentType = "";
  queryParams.driver = "";
  queryParams.businessCode = "";
  queryParams.business = "";
  queryParams.pageNum = 1;
  handleQuery();
};

const datePickerStartChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const newFormClick = () => {
  if (state.dialogAction == "new") {
    addAccident(newForm)
      .then((res: any) => {
        ElMessage.success("添加成功");
      })
      .catch(() => {
        ElMessage.error("添加失败");
      })
      .finally(() => {
        handleClose();
        handleQuery();
      });
  } else if (state.dialogAction == "edit") {
    updateAccident(newForm.id, newForm)
      .then((res: any) => {
        ElMessage.success("更新成功");
      })
      .catch(() => {
        ElMessage.error("更新失败");
      })
      .finally(() => {
        handleClose();
        handleQuery();
      });
  }
};

const newHandleFormClick = (obj: any) => {
  newForm.amount = newHandleForm.amount;
  newForm.result = newHandleForm.result;
  newForm.handleStatus = 1;
  updateAccident(newForm.id, newForm)
    .then((res: any) => {
      ElMessage.success("更新成功");
      resetForm();
      resetHandleForm();
    })
    .catch(() => {
      ElMessage.error("更新失败");
    })
    .finally(() => {
      handleFormClose();
      handleQuery();
    });
};

const handleClick = (val: any, val1: any) => {
  dialogHandleVisible.value = true;
  newHandleForm.amount = val1.amount;
  newHandleForm.result = val1.result;
  Object.assign(newForm, val1);
};

const newCancelClick = () => {
  handleClose();
};

const newHandleCancelClick = () => {
  handleFormClose();
};

const newClick = () => {
  state.dialogAction = "new";
  dialogNewVisible.value = true;
};

const importClick = () => {
  importFlg.value = true;
};

const exportClick = () => {
  exportAccident(queryParams)
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      });
      const a = document.createElement("a");
      const href = window.URL.createObjectURL(blob); // 下载的链接
      a.href = href;
      a.download = decodeURI(
        response.headers["content-disposition"].split(";")[1].split("=")[1]
      ); // 获取后台设置的文件名称
      document.body.appendChild(a);
      a.click(); // 点击导出
      document.body.removeChild(a); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
      ElMessage.success("导出成功");
    })
    .catch(() => {
      ElMessage.error("导出失败");
    });
};

const delClick = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("请先勾选数据");
  } else {
    dialogDeleteVisible.value = true;
    let ids = multipleSelection.value.map((item: any) => item.id);
    state.deleteId = ids.join(",").toString();
  }
};

const deleteFormConfirm = () => {
  dialogDeleteVisible.value = false;
  deleteAccident(state.deleteId)
    .then((res: any) => {
      ElMessage.success("数据删除成功");
    })
    .catch(() => {
      ElMessage.error("数据删除失败");
    })
    .finally(() => {
      handleDeleteClose();
      handleQuery();
    });
};

const editClick = (val: any, val1: any) => {
  state.dialogAction = "edit";
  dialogNewVisible.value = true;
  Object.assign(newForm, val1);
};

const handleDelete = (val: any, val1: any) => {
  dialogDeleteVisible.value = true;
  state.deleteId = val1.id.toString();
};
const handleSelectionChange = (val: never[]) => {
  multipleSelection.value = val;
};

const handleSizeChange = (value: number) => {
  queryParams.pageSize = value;
  handleQuery();
};
const handleCurrentChange = (value: number) => {
  queryParams.pageNum = value;
  handleQuery();
};

const handleQuery = () => {
  loading.value = true;
  getAccidentPage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getAccidentStatInfo();
    })
    .finally(() => {
      loading.value = false;
    });
};

const getVehicleList = (data: any) => {
  vehicleAllList(data).then((res) => {
    cardOptions.value = res.data;
  });
};

const remoteMethod = (query: string) => {
  getVehicleList({ keywords: query });
};

const getRepairList = () => {
  getRepair({ status: 1 }).then((rs) => {
    Object.assign(repairOptions.value, rs.data);
  });
};

const getBusinessList = (val: string) => {
  getDictOptions(val).then((rs) => {
    Object.assign(businessOptions.value, rs.data);
  });
};

const supplierParkList = () => {
  getPark().then((rs: { data: any }) => {
    Object.assign(supplierParkOptions.value, rs.data);
  });
};

const getAccidentStatInfo = () => {
  getAccidentStat(queryParams).then((rs) => {
    repairAmount.value = rs.data;
  });
};

onMounted(() => {
  importFlg.value = false;
  queryParams.accidentTimeSort = "desc";
  handleQuery();
  getVehicleList({});
  getRepairList();
  getAccidentStatInfo();
  supplierParkList();
  getDriverList();
  getBusinessList("business");
});

onUnmounted(() => {
  importFlg.value = false;
});
</script>
<style lang="scss" scoped>
.app-container {
  .parkClass {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .header__footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .demo-form-inline {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .el-row {
    margin-left: 20px !important;
    margin-top: 20px;
  }

  :deep(.el-table th) {
    background-color: #f6f9ff;
  }

  :deep(.newDialogClass .el-dialog__header) {
    border-bottom: 1px solid lightgray;
    margin: 0 10px;
  }
  :deep(.newDialogClass .el-dialog__body) {
    padding: 10px var(--el-dialog-padding-primary);
  }

  .newFormClass {
    background-color: rgba(220, 222, 224, 0.17);
    padding: 20px;
  }

  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .el-col-6 {
    display: flex;
    align-items: center;
  }

  .indexClass {
    padding-left: 20px;
    font-size: 12px;
    color: gray;
  }
  :deep(.demo-form-inline .el-form-item) {
    margin: 0px !important;
    align-items: center;
    width: 100%;
  }

  .untreated {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: lightgray !important;
    }
  }
  .processed {
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content) {
      background-color: red;
    }
  }
  :deep(.el-breadcrumb__inner) {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #303030 !important;
  }

  :deep(.el-breadcrumb__inner.is-link) {
    color: #8c8c8c !important;
  }

  :deep(.el-table thead th) {
    background: #f6f9ff;
    color: #303030;
  }

  .text-span {
    color: #303030;
    font-size: 16px;
    line-height: 40px;
    font-weight: 600;
    text-align: left;
  }

  .span-color {
    color: #606060;
    font-size: 14px;
    line-height: 40px;
    display: inline-block;
    vertical-align: top;
  }
}
</style>
