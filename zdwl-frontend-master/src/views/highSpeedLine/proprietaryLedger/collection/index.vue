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
        "
        >当前位置：</span
      >
      <el-breadcrumb separator="-" style="display: flex; align-items: center">
        <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }"
          >智能调度</el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="{ path: '/highSpeedLine/proprietaryLedger/overview' }"
          >自营业务台账</el-breadcrumb-item
        >
        <el-breadcrumb-item
          @click="returnList"
          :class="state.import ? 'breadcrumb-color' : 'breadcrumb-color-is'"
          style="
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            color: #323233;
          "
          >回款</el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="state.import"
          ><span style="color: #303030">导入</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="map-content" ref="vehi" v-if="!state.import">
      <div class="set-height">
        <Form
          class="hide-form"
          :formModel="formModel"
          :fromList="fromList"
          ref="formList"
          @searchInput="searchInput"
          @onSubmit="onSubmit"
          @restFunction="restFunction"
        >
          <template #formSlot> </template>
        </Form>
        <el-row
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-right: 20px;
          "
        >
          <div>
            <el-button @click="newBuilt" type="primary" size="default"
              >新建</el-button
            >
            <el-button @click="importVehicle" size="default">导入</el-button>
            <!-- <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
              <template #reference>
                <el-button size="default">删除</el-button>
              </template>
            </el-popconfirm> -->
          </div>
          <div
            class="indexClass"
            style="display: flex; align-items: center; height: 30px"
          >
            <span class="span-color">开票金额(元)：</span
            ><span class="text-span">{{ state.invoiceAmountTotal }}</span>
            <span style="padding-left: 24px" class="span-color"
              >回款金额(元)：</span
            ><span class="text-span">{{ state.refundAmountTotal }}</span>
            <span style="padding-left: 24px" class="span-color"
              >未回款金额(元)：</span
            ><span class="text-span">{{ calculate(state.invoiceAmountTotal,state.refundAmountTotal,"-")  }}</span>
          </div>
        </el-row>
        <el-table
          :data="tableData"
          v-loading="state.loading"
          :max-height="setHeight"
          size="default"
          tooltip-effect="light"
          highlight-current-row
          style="width: 100%; margin-top: 16px"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column prop="invoiceDate" label="开票日期" />
          <el-table-column prop="customer" label="客户" />
          <el-table-column prop="invoiceAmount" label="开票金额">
            <template @click="collectionClick(scope.row)" #default="scope">
              {{ scope.row.invoiceAmount }}
            </template>
          </el-table-column>
          <el-table-column prop="refundAmount" label="回款金额">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="refundAmountClick(scope.row)"
                >{{ scope.row.refundAmount }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="" label="未回款金额">
            <template #default="scope">
              {{ calculate(scope.row.invoiceAmount,scope.row.refundAmount,"-")   }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="开票对账单附件">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="annexClick(scope.row)"
                v-if="scope.row.attachmentFile != null"
                >{{ scope.row.attachmentName }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="" label="状态">
            <template #default="scope">
              {{ filterSatus(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
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
                @click="collection(scope.$index, scope.row)"
                >回款</el-button
              >
              <el-popconfirm
                title="确定要删除吗?"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button  key="text" type="text">删除</el-button>
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
      </div>
    </div>
    <div class="map-content overflow-hidden" v-if="state.import">
      <div class="importSlot-height">
        <importSlot
          :apiFn="state.apiFn"
          :downFn="state.downFn"
          v-if="state.import"
          :downloadType="state.downloadType"
          @returnList="returnList"
        ></importSlot>
      </div>
    </div>
    <el-dialog
      v-model="state.dialogVisible"
      :title="state.type"
      class="newDialogClass"
   
      @close="closeDialog"
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
            <el-form-item label="开票日期" prop="invoiceDate">
              <el-date-picker
                v-model="newForm.invoiceDate"
                placeholder="请选择开票日期"
                size="default"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerCode">
              <el-select
                clearable
                filterable
                v-model="newForm.customerCode"
                size="default"
                placeholder="请选择客户名称"
                @change="changeDriver"
                style="align-items: center; width: 100%"
              >
                <el-option
                  v-for="item in cooperateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票金额" prop="invoiceAmount">
              <el-input
                v-model="newForm.invoiceAmount"
                placeholder="请输入开票金额"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                style="align-items: center; width: 100%"
                v-model="newForm.status"
              >
                <el-option label="未回款" value="0"></el-option>
                <el-option label="回款中" value="1"></el-option>
                <el-option label="已回款" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;&nbsp;附件" prop="attachmentFile">
              <el-upload
                ref="upload"
                v-model:file-list="fileList"
                v-model="newForm.attachmentFile"
                :headers="setHeaders"
                class="upload-demo"
                :action="API + '/api/v1/files'"
                multiple
                :limit="1"
                :on-preview="(uploadFile:UploadFile)=>{
                    filePreview(uploadFile)
                  }"
                :on-remove="(uploadFile:UploadFile)=>{
                    fileRemove(uploadFile,upload)
                  }"
                :on-error="(response: any)=>{fileSError(response)}"
                :on-exceed="
                (files :any, uploadFiles:any) => {
                  handleExceed(files, uploadFiles, 'upload');
                }
              "
                :on-success="(files :any, uploadFiles:any) => {
                  fileSuccess(files, uploadFiles, 'drivingCardFile');
                }"
              >
                <el-button
                  :disabled="fileList.length > 0"
                  :icon="Upload"
                  size="default"
                  >上传图片</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="&nbsp;&nbsp;&nbsp;备注" prop="">
              <el-input
                v-model="newForm.remark"
                placeholder="请输入开票金额"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelClick">取 消</el-button>
          <el-button type="primary" @click="newFormClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer size="20%" v-model="state.drawerVisible" title="回款记录">
      <el-table :data="invoiceDataList" border style="width: 100%">
        <el-table-column prop="refundDate" label="回款日期" />
        <el-table-column prop="refundAmount" label="回款金额" />
      </el-table>
    </el-drawer>
    <el-dialog
      v-model="state.invoiceVisible"
      title="回款"
      class="newDialogClass"
      @close="closeInvoiceDialog"
    >
      <el-form
        :model="invoiceForm"
        :rules="invoiceRules"
        label-position="left"
        label-width="100px"
        ref="invoiceRef"
        class="newFormClass"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="回款日期" prop="refundDate">
              <el-date-picker
                v-model="invoiceForm.refundDate"
                placeholder="请选择回款日期"
                size="default"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回款金额" prop="refundAmount">
              <el-input
                v-model="invoiceForm.refundAmount"
                placeholder="请输入回款金额"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelInvoice">取 消</el-button>
          <el-button type="primary" @click="invoiceClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <ImageModel ref="image" :options="options"></ImageModel>
  </div>
</template>
<script setup lang="ts">
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { ref, onMounted, reactive, computed } from "vue";
import { Options, Stat, Platform, Payment } from "@/api/depreciation/types";
import { cooperateList } from "@/api/depreciation";
import importSlot from "@/views/Import/index.vue";
import { deleteTractor } from "@/api/vehicleInfo";
import { useElementSize } from "@vueuse/core";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, genFileId } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { calculate } from "@/utils";
import ImageModel from "@/views/vehicle/safety/components/imageModel.vue";
import type {
  UploadUserFile,
  UploadFile,
  UploadInstance,
  UploadRawFile,
  UploadProps,
} from "element-plus";
import {
  dispatchFeeInvoice,
  dispatchFeeInvoicePost,
  dispatchFeeInvoiceStat,
  dispatchFeeInvoicePut,
  importInvoice,
  invoiceTemplate,
} from "@/api/highSpeedLine/collection";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 280;
});
const state = reactive({
  dialogVisible: false,
  import: false,
  loading: false,
  total: 0,
  drawerVisible: false,
  apiFn: importInvoice,
  downFn: invoiceTemplate,
  downloadType: "fuel",
  refundAmountTotal: 0,
  invoiceAmountTotal: 0,
  didNotInvoiceAmountTotal: 0,
  type: "新增",
  invoiceVisible: false,
});
const formModel = reactive({
  startTime: "",
  endTime: "",
  customerCode: "",
  status: "",
  pageSize: 10,
  pageNum: 1,
  id: null,
});
// 客户名称
const cooperateOptions = ref<Options[]>([]);
const fromList = reactive([
  {
    type: "selectValue",
    label: "客户名称",
    prop: "customerCode",
    placeholder: "请选择客户名称",
    optionList: cooperateOptions,
  },
  {
    type: "pickerDate",
    label: "订单日期",
    prop: ["startTime", "endTime"],
    placeholder: "请选择订单日期",
  },
  {
    type: "selectValue",
    label: "回款状态",
    prop: "status",
    placeholder: "请选择付款状态",
    optionList: [
      {
        label: "已回款",
        value: "2",
      },
      {
        label: "回款中",
        value: "1",
      },
      {
        label: "未回款",
        value: "0",
      },
    ],
  },
  {
    type: "row",
  },
  {
    type: "row",
  },
]);

const newForm = reactive({
  customer: "",
  customerCode: "",
  invoiceDate: "",
  invoiceAmount: "",
  status: "",
  attachmentFile: "",
  attachmentName: "",
  refundRecord: [],
  remark: "",
});
const newRules = reactive({
  invoiceDate: [{ required: true, message: "请选择开票日期", trigger: "blur" }],
  customerCode: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
  ],
  invoiceAmount: [
    { required: true, message: "请输入开票金额", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  // attachmentFile: [{ required: true, message: "请选择附件", trigger: "blur" }],
});
const getCooperateList = async () => {
  try {
    const { data } = await cooperateList();
    data.map((i: any) => {
      i.value = i.id;
      i.label = i.name;
    });
    cooperateOptions.value = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
interface User {
  date: string;
  name: string;
  address: string;
}
const multipleSelection = ref<User[]>([]);
const batchVehicle = () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  handleDelete(arr);
};
// 批量删除与单个删除
const handleDelete = async (ids: any) => {
  await deleteTractor(ids, "/api/v1/dispatchFee/invoice/");
  getStatList();
};

const handleSelectionChange = (val: never[]) => {
  multipleSelection.value = val;
};
const annexClick = (val: any) => {
  options.dialogBorder = true;
  options.fileSrc = val.attachmentFile;
  options.title = val.attachmentName;
  // window.open(
  //   import.meta.env.VITE_FILE_HOME + import.meta.env.VITE_FILE_API + val.file
  // );
};
const changeDriver = (val: number) => {
  newForm.customer = cooperateOptions.value.find((p) => p.id === val).name;
};
const API = ref(import.meta.env.VITE_APP_BASE_API);
const userStore = useUserStoreHook();
const upload = ref<UploadInstance>();
const setHeaders = ref({
  Authorization: userStore.token,
});
const options: any = reactive({
  dialogBorder: false,
  fileSrc: "",
  title: "",
});
const image = ref();
const fileRemove = (file: UploadFile, ref: any) => {
  // row.file = null;
  // row.fileName = null;
  options.fileSrc="";
  options.title="";
  newForm.attachmentFile = '';
  newForm.attachmentName = '';
  image.value?.setDeleteFilesUrl(file.url);
};

const fileSError = (response: any) => {
  ElMessage.error(response);
};
const fileList = ref<UploadUserFile[]>([]);
const filePreview = (fileList: UploadFile) => {
  options.dialogBorder = true;
  options.fileSrc = fileList.url;
  options.title = fileList.name;
};

const handleExceed: UploadProps["onExceed"] = (
  files: any,
  uploadFiles: any,
  val: string
) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  upload.value!.submit();
};
const fileSuccess = (file: any, uploadFiles: any) => {
  newForm.attachmentName = uploadFiles.name;
  newForm.attachmentFile = file.data.url;
};
const cancelClick = () => {
  state.dialogVisible = false;
};
const newFormClick = async () => {
    
  try {
    state.type === "新增" ?await dispatchFeeInvoicePost(newForm) :await putDispatch();
    state.dialogVisible = false;
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const filterSatus = (status: number) => {
  let arr = ["未回款", "回款中", "已回款"];
  return arr[status];
};
const collectionClick = () => {};

const restFunction = () => {
  formModel.startTime = "";
  formModel.endTime = "";
};
const searchInput = () => {
  getStatList();
};
const onSubmit = () => {
  getStatList();
};
const importVehicle = () => {
  state.import = true;
};
const newBuilt = () => {
  state.dialogVisible = true;
  state.type = "新增";
  Object.assign(newForm, {
  customer: "",
  customerCode: "",
  invoiceDate: "",
  invoiceAmount: "",
  status: "",
  attachmentFile: "",
  attachmentName: "",
  refundRecord: [],
  remark: "",
})
};
const returnList = () => {
  state.import = false;
};
const editClick = async (index: number, row: any) => {
  state.dialogVisible = true;
  state.type = "编辑";
  await nextTick();
  Object.assign(newForm, row);
  newForm.status = newForm.status.toString();
  fileList.value =row.attachmentFile? [
    {
      name: row.attachmentName,
      url: row.attachmentFile,
    },
  ]:[];
};
// 回款
let invoiceForm = reactive({
  refundDate: "",
  refundAmount: 0,
});
const invoiceRules = reactive({
  refundDate: [{ required: true, message: "请选择回款日期", trigger: "blur" }],
  refundAmount: [
    { required: true, message: "请输入回款金额", trigger: "blur" },
  ],
});
const collection = (index: number, row: any) => {
  state.invoiceVisible = true;
  Object.assign(newForm, row);
  newForm.status = newForm.status.toString();
};
const invoiceDataList = ref([]);
const refundAmountClick = (val:any)=>{
  invoiceDataList.value = [];
  state.drawerVisible = true;
  Object.assign(invoiceDataList.value,val.refundRecord)
}
const invoiceClick = () => {
  newForm.refundRecord = newForm.refundRecord? newForm.refundRecord : [];
  newForm.refundRecord.push(invoiceForm);
  dispatchFeeInvoicePut(newForm.id,newForm).finally(() => {
    state.invoiceVisible = false;
    getStatList();
  });
};
const cancelInvoice = ()=>{
  state.invoiceVisible = false;
}
const getStateNum = async () => {
  const { data } = await dispatchFeeInvoiceStat(formModel);
  state.refundAmountTotal = data.refundAmountTotal;
  state.invoiceAmountTotal = data.invoiceAmountTotal;
};

const putDispatch = async () => {
  const { data } = await dispatchFeeInvoicePut(newForm.id, newForm);
};
const tableData: any = ref([]);
const newFormRef = ref();
const getStatList = async () => {
  state.loading = true;
  try {
    console.log(formModel);
    const { data } = await dispatchFeeInvoice(formModel);
    tableData.value = data.list;
    state.total = data.total;
    getStateNum();
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const invoiceRef = ref();
const closeDialog = () => {
  newFormRef.value.resetFields();
  fileList.value = [];
};
const closeInvoiceDialog = ()=>{
  invoiceRef.value.resetFields();
}
const handleUseSizeChange = (value: number) => {
  formModel.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  formModel.pageNum = value;
  getStatList();
};

onMounted(() => {
  getCooperateList();
  getStatList();
});
</script>
<style scoped lang="scss">
.app-container {
  height: 100%;
}
.map-content {
  height: calc(100% - 72px);
}
.set-height {
  height: calc(100% - 16px);
}
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
.property {
  text-align: right;
}
.indexClass {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #606060;
  margin-right: 40px;
}
.span-color {
  color: #606060;
  font-size: 14px;
  line-height: 32px;
  display: inline-block;
  vertical-align: top;
}
.text-span {
  color: #303030;
  font-size: 16px;
  line-height: 32px;
  font-weight: 600;
  text-align: left;
  display: inline;
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
:deep(.el-dialog__body) {
  padding: 10px 20px;
}
.upload-demo {
  width: 100%;
  position: relative;
  height: 32px;
}
.upload-demo {
  :deep(.el-upload-list) {
    display: inline-block;
    vertical-align: text-top;
    position: absolute;
    margin-top: 0;
    line-height: 32px;
    width: calc(100% - 108px);
  }
}
.upload-demo {
  :deep(.el-upload-list__item.is-success:focus:not(:hover)) {
    display: none !important;
  }
  :deep(.el-upload-list__item-name .el-icon) {
    display: none;
  }
}
</style>
