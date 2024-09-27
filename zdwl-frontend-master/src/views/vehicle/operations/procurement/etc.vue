<template>
  <div class="etcClass">
    <footer class="header__footer">
      <el-form
        :model="queryParams"
        class="demo-form-inline"
        ref="queryFormRef"
        style="margin-bottom: 0px"
      >
        <el-row class="row-bg" justify="space-between">
          <el-col :span="6">
            <el-form-item label="ETC供应商">
              <el-select
                v-model="queryParams.supplierCode"
                size="default"
                placeholder="请选择ETC供应商"
                style="align-items: center; width: 100%"
                clearable
              >
                <el-option
                  v-for="item in etcOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购日期">
              <el-date-picker
                v-model="state.time"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD"
                date-format="YYYY/MM/DD ddd"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                @change="datePickerChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购金额">
              <div style="display: flex">
                <el-input
                  v-model="queryParams.min"
                  placeholder="最低采购金额"
                  style="display: flex; align-items: center"
                />
                <span style="padding: 5px">-</span>
                <el-input
                  v-model="queryParams.max"
                  placeholder="最高采购金额"
                  style="display: flex; align-items: center"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-bg" justify="space-between">
          <el-col :span="6">
            <el-form-item label="采购人姓名">
              <el-input
                v-model="queryParams.purPerson"
                placeholder="请输入采购人姓名"
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
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-select
                v-model="queryParams.projectCode"
                size="default"
                placeholder="请选择项目名称"
                style="align-items: center; width: 100%"
                clearable
              >
                <el-option
                  v-for="item in props.projectOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-bg" justify="space-between">
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6" style="justify-content: flex-end">
            <div style="display: flex">
              <el-button style="margin-right: 10px" @click="onReset"
                >重置</el-button
              >
              <el-button type="primary" @click="handleQuery">查询</el-button>
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
        ><span style="padding: 5px" class="text-span">{{ total }}</span
        ><span class="span-color">条</span>
        <span style="padding: 0 20px">|</span>
        <span class="span-color">采购金额</span
        ><span style="padding: 5px" class="text-span">{{ repairAmount }}</span
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
        <el-table-column prop="purTime" label="采购日期" sortable>
          <template #default="scope">
            {{ dayjs(scope.row.purTime).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column prop="supplierEtc" label="ETC供应商" />
        <el-table-column prop="project" label="项目名称" />
        <el-table-column prop="purAmount" label="采购金额(元)" align="right" />
        <el-table-column prop="purPerson" label="采购人" />
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
    <!-- 添加或修改对话框 -->
    <el-dialog
      v-model="dialogNewVisible"
      :title="state.dialogAction == 'new' ? '新建' : '编辑'"
      width="60%"
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
        <el-row :gutter="50" justify="space-evenly">
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="ETC供应商" prop="supplierEtcCode">
              <el-select
                v-model="newForm.supplierEtcCode"
                size="default"
                placeholder="请选择ETC供应商"
                style="align-items: center; width: 100%"
                @change="supplierETCChange"
                clearable
              >
                <el-option
                  v-for="item in etcOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购日期" prop="purTime">
              <el-date-picker
                v-model="newForm.purTime"
                type="date"
                placeholder="请选择采购日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                date-format="YYYY/MM/DD ddd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-evenly" :gutter="50">
          <el-col :span="8">
            <el-form-item label="采购金额" prop="purAmount">
              <div style="display: flex; flex-wrap: nowrap">
                <el-input
                  v-model="newForm.purAmount"
                  placeholder="请输入采购金额"
                  style="width: 100%"
                >
                  <template #append>元</template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购人" prop="purPerson">
              <el-input
                v-model="newForm.purPerson"
                placeholder="请输入采购人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectCode">
              <el-select
                @change="changeProject"
                v-model="newForm.projectCode"
                size="default"
                placeholder="请选择项目名称"
                style="align-items: center; width: 100%"
                clearable
              >
                <el-option
                  v-for="item in props.projectOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-bg" justify="space-between" :gutter="50">
          <el-col :span="8">
            <el-form-item label="采购有无协议" prop="agreement">
              <el-radio-group v-model="newForm.agreement">
                <el-radio-button label="1">无</el-radio-button>
                <el-radio-button label="0">有</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="协议附件"
              prop="file"
              v-if="newForm.agreement == 0"
              style="
                padding-top: 1px;
                display: flex;
                text-align: center;
                align-items: center;
              "
            >
              <el-upload
                ref="upload"
                class="upload-demo"
                v-model:file-list="fileList"
                action=""
                :http-request="uploadBpmn"
                :limit="1"
                :on-exceed="handleExceed"
                :on-change="handleExcelChange"
                :before-upload="handleBeforeUpload"
                :auto-upload="true"
              >
                <template #trigger>
                  <el-button>上传</el-button>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="newForm.remark"
            type="textarea"
            placeholder="请输入备注"
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
      :before-close="handleDeleteClose"
    >
      <template #header>
        <div class="my-header">
          <div>
            <el-icon style="color: orange; top: 2px"><WarningFilled /></el-icon>
            <span style="padding-left: 10px">确定要删除这条数据吗？</span>
          </div>
        </div>
      </template>
      <span>此条数据删除后将不可恢复，确定要删除吗</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDeleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteFormConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted } from "vue";
import {
  PurchaseETCForm,
  PurchaseETCQuery,
  PurchaseETCPageVO,
} from "@/api/operations/procurement/types";
import {
  getETCPage,
  updateETC,
  addETC,
  deleteETC,
  exportETC,
  getETCStat,
  importETC,
  getETCTemplate,
} from "@/api/operations/procurement/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { getDictOptions } from "@/api/dict/index";
import type { FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getRepair, getFuelInfo, getETC } from "@/api/supplier/index";
import {
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  genFileId,
  UploadUserFile,
  UploadRequestOptions,
} from "element-plus";
import router from "@/router";
import { uploadFileApi, deleteFileApi } from "@/api/file";
import dayjs from "dayjs";
const fileList = ref<UploadUserFile[]>([]);
const upload = ref<UploadInstance>();
const excelFile = ref<File>();
const excelFilelist = ref<File[]>([]);
const fileName = ref("");
const multipleSelection = ref([]);
const total = ref(0);
const repairAmount = ref(0);
const dialogNewVisible = ref(false);
const dialogDeleteVisible = ref(false);
const queryFormRef = ref(ElForm);
const queryParams = reactive<PurchaseETCQuery>({
  pageNum: 1,
  pageSize: 10,
});
const emit = defineEmits({
  paramsFn: null,
  disableClick: null,
});
const state = reactive({
  showData: false,
  componentList: [],
  tableData: [],
  dialogTitle: "",
  dialogAction: "",
  deleteId: "",
  time: "",
  apiFn: importETC,
  downFn: getETCTemplate,
});
const numSum = ref(0);
const amountSum = ref(0);
const gasOptions = ref([] as any[]);
const cardOptions = ref([] as any[]);
const businessOptions = ref([] as any[]);
const fuelOptions = ref([] as any[]);
const etcOptions = ref([] as any[]);
const newFormRef = ref();
const getDisabled = computed(
  () =>
    newForm.business === "" ||
    newForm.supplierEtcCode === "" ||
    newForm.purTime === "" ||
    newForm.purPerson === "" ||
    newForm.purAmount === "" || 
    newForm.projectCode===''
);

interface RuleForm {
  id: number;
  supplierEtcCode: string;
  supplierEtc: string;
  purTime: string;
  purAmount: string;
  purPerson: string;
  remark: string;
  agreement: number;
  file: string;
  fileName: string;
  business: string;
  businessCode: number;
  projectCode: string;
  project: string;
}
const newForm = reactive<RuleForm>({
  id: 0,
  supplierEtcCode: "",
  supplierEtc: "",
  purTime: "",
  purAmount: "",
  purPerson: "",
  remark: "",
  agreement: 1,
  file: "",
  fileName: "",
  business: "",
  businessCode: 0,
  projectCode: "",
  project: "",
});
const props = defineProps(["projectOption"]);
const newRules = reactive<FormRules<RuleForm>>({
  business: [{ required: true, message: "请选择业务场景", trigger: "blur" }],
  supplierEtcCode: [
    { required: true, message: "请选择ETC供应商", trigger: "blur" },
  ],
  purTime: [{ required: true, message: "请选择采购日期", trigger: "blur" }],
  purAmount: [{ required: true, message: "请输入采购金额", trigger: "blur" }],
  purPerson: [{ required: true, message: "请输入采购人", trigger: "blur" }],
  projectCode: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
});

const loading = ref(false);
const resetForm = () => {
  newForm.id = 0;
  newForm.supplierEtcCode = "";
  newForm.supplierEtc = "";
  newForm.purTime = "";
  newForm.purAmount = "";
  newForm.purPerson = "";
  newForm.remark = "";
  newForm.agreement = 1;
  newForm.file = "";
  newForm.fileName = "";
  newForm.business = "";
  newForm.projectCode = "";
  newForm.project = "";
  newForm.businessCode = 0;
  fileList.value = [];
};
const changeProject = (val: string) => {
  newForm.project = props.projectOption.filter(
    (n: any) => n.value == val
  )[0]?.label;
};
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  fileName.value = file.name;
};

/**
 * Excel文件change事件
 *
 * @param file
 */
const handleExcelChange = (file: UploadFile) => {
  excelFile.value = file.raw;
  fileName.value = file.name;
};

const handleClose = () => {
  dialogNewVisible.value = false;
  if (newForm.file != "" && state.dialogAction == "new") {
    delBpmn(newForm.file);
  }
  resetForm();
};

const handleDeleteClose = () => {
  dialogDeleteVisible.value = false;
};

const datePickerChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const businessCodeChange = (obj: any) => {
  newForm.businessCode = businessOptions.value.find(
    (item) => item.label === obj
  ).value;
};

const supplierETCChange = (obj: any) => {
  newForm.supplierEtc = etcOptions.value.find((item) => item.id === obj).name;
};

const onReset = () => {
  state.time = "";
  queryParams.max = "";
  queryParams.min = "";
  queryParams.supplierFuel = "";
  queryParams.supplierFuelCode = "";
  queryParams.supplierCode = "";
  queryParams.purPerson = "";
  queryParams.keywords = "";
  queryParams.startTime = "";
  queryParams.endTime = "";
  queryParams.pageNum = 1;
  queryParams.business = "";
  queryParams.businessCode = "";
  queryParams.purTimeSort = "desc";
  queryParams.projectCode = "";
  handleQuery();
};

const handleStatusChange = (val: any) => {
  updateETC(val.id, val)
    .then((res) => {
      ElMessage.success("修改成功");
    })
    .catch(() => {
      ElMessage.error("修改失败");
    })
    .finally(() => {
      handleClose();
      handleQuery();
    });
};

const newFormClick = () => {
  if (state.dialogAction == "new") {
    addETC(newForm)
      .then((res) => {
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
    updateETC(newForm.id, newForm)
      .then((res) => {
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

/**
 * 限制用户上传文件的格式和大小
 */
const handleBeforeUpload = (file: UploadRawFile) => {
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning("上传文件不能大于2M");
    return false;
  }
  return true;
};

/**
 * 自定义上传附件
 * @param options
 */
async function uploadBpmn(options: UploadRequestOptions): Promise<any> {
  uploadFileApi(options.file).then((rs) => {
    newForm.file = rs.data.url;
    newForm.fileName = rs.data.name;
  });
}

const delBpmn = (filePath: string) => {
  deleteFileApi(filePath).then((rs) => {});
};

const newCancelClick = () => {
  handleClose();
};

const newClick = () => {
  state.dialogAction = "new";
  dialogNewVisible.value = true;
};

const importClick = () => {
  emit("disableClick", true);
  emit("paramsFn", {
    importFn: state.apiFn,
    downFn: state.downFn,
    downloadType: "",
    title: "智能车管 - 采购管理 - ETC采购",
  });
};

const exportClick = () => {
  exportETC(queryParams)
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
  deleteETC(state.deleteId)
    .then((res) => {
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

const deleteFormCancel = () => {
  dialogDeleteVisible.value = false;
};

const editClick = (val: any, val1: any) => {
  state.dialogAction = "edit";
  dialogNewVisible.value = true;
  Object.assign(newForm, val1);
  fileList.value.push({
    name: newForm.fileName.replaceAll("/", ""),
    url: newForm.file,
  });
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
  getETCPage(queryParams)
    .then(({ data }) => {
      state.tableData = [];
      Object.assign(state.tableData, data.list);
      total.value = data.total;
      getETCStatInfo();
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

// const remoteMethod = (query: string) => {
//   getVehicleList({keywords: query})
// }

const getRepairList = () => {
  getRepair({ status: 1 }).then((rs) => {
    Object.assign(gasOptions.value, rs.data);
  });
};

const getBusinessList = (val: string) => {
  getDictOptions(val).then((rs) => {
    Object.assign(businessOptions.value, rs.data);
  });
};

const getFuelList = () => {
  getFuelInfo().then((rs) => {
    Object.assign(fuelOptions.value, rs.data);
  });
};

const getETCList = () => {
  getETC().then((rs) => {
    Object.assign(etcOptions.value, rs.data);
  });
};

const getETCStatInfo = () => {
  getETCStat(queryParams).then((rs) => {
    repairAmount.value = rs.data;
  });
};

const sortChange = (val: any) => {
  if (val.order == "ascending") {
    queryParams.purTimeSort = "asc";
  } else {
    queryParams.purTimeSort = "desc";
  }
  handleQuery();
};

onMounted(() => {
  queryParams.purTimeSort = "desc";
  handleQuery();
  getVehicleList({});
  getRepairList();
  getETCStatInfo();
  getETCList();
  getFuelList();
  getBusinessList("business");
});
</script>
<style lang="scss" scoped>
.etcClass {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

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

  .header__footer .el-row {
    margin-left: 20px !important;
    margin-top: 20px;
  }

  .mb-4 {
    margin-left: 20px !important;
    margin-top: 20px;
  }

  .newDialogClass .el-row {
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

  :deep(.referenceClass .el-form-item__label) {
    width: 130px !important;
  }

  :deep(.referenceClass .dfClass .el-form-item__label) {
    width: 180px !important;
  }
  .newFormClass .el-col-6 {
    max-width: 33%;
    flex: 1 0 25%;
  }

  :deep(.upload-demo) {
    display: flex;
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
