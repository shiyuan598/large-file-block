<template>
  <div class="app-container">
    <div>
      <el-container>
        <!-- <el-header style="background-color: white;position: relative;">
          <span style="font-size: 12px;color: rgb(181, 181, 181);position: absolute;top: 35%;">当前位置：智能车管
            <span style="padding: 10px;">-</span>
            <span style="color: rgb(181, 181, 181)">智慧运营</span>
            <span style="padding: 10px;">-</span>
            <span style="color:black;">保险管理</span>
          </span>
        </el-header> -->
        <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
          <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;">当前位置：</span>
          <el-breadcrumb separator="-" style="display: flex;align-items: center;">
            <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }">智能车管</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/vehicle/operations/repairs' }">智慧运营</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="!importFlg">保险管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/vehicle/operations/insurance' }" @click="returnList" v-if="importFlg">保险管理</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="importFlg">导入</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main>
          <div v-if="!importFlg">
            <el-card shadow="never">
              <div class="insuranceClass">
                <footer class="header__footer">
                  <el-form :model="queryParams" class="demo-form-inline"  ref="queryFormRef" style="margin-bottom: 0px;">
                    <el-row class="row-bg" justify="space-between">
                      <el-col :span="6">
                        <el-form-item label="车牌号码">
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
                        <el-form-item label="开始时间">
                          <el-date-picker
                            v-model="state.startTime"
                            type="daterange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="YYYY-MM-DD"
                            date-format="YYYY/MM/DD ddd"
                            value-format="YYYY-MM-DD"
                            style="width: 100%;"
                            @change="datePickerStartChange"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="结束时间">
                          <el-date-picker
                            v-model="state.endTime"
                            type="daterange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="YYYY-MM-DD"
                            date-format="YYYY/MM/DD ddd"
                            value-format="YYYY-MM-DD"
                            style="width: 100%;"
                            @change="datePickerEndChange"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row class="row-bg" justify="space-between">
                      <el-col :span="6">
                        <el-form-item label="保险公司">
                          <el-select v-model="queryParams.supplierCode" size="default" placeholder="请选择保险公司" style="align-items: center;width: 100%;" clearable>
                            <el-option
                              v-for="item in supplierInsuranceOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="保险项目">
                          <el-select v-model="queryParams.insuranceType" size="default" placeholder="请选择保险项目" style="align-items: center;width: 100%;" clearable>
                            <el-option
                              v-for="item in insuranceOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.label"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="业务场景">
                          <el-select v-model="queryParams.business" size="default" placeholder="请选择业务场景" style="align-items: center;width: 100%;" clearable>
                            <el-option
                              v-for="item in businessOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.label"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div style="display:flex;justify-content: flex-end;padding-top: 20px;">
                      <el-button style="margin-right: 10px" @click="onReset">重置</el-button>
                      <el-button type="primary" @click="handleQuery">查询</el-button>
                    </div>
                  </el-form>
                </footer>
                <el-row class="mb-4">
                  <el-button type="primary" @click="newClick">新建</el-button>
                  <el-button @click="importClick">导入</el-button>
                  <el-button @click="exportClick">导出</el-button>
                  <el-button @click="delClick">删除</el-button>
                  <div class="indexClass" style="display: flex;align-items: center; height:30px">
                    <span class="span-color">共</span><span style="padding: 5px;" class="text-span">{{ total }}</span><span class="span-color">条</span>
                    <span style="padding: 0 20px;">|</span>
                    <span class="span-color">维修金额</span><span style="padding: 5px;" class="text-span">{{repairAmount}}</span><span class="span-color">元</span>
                  </div>
                </el-row>
                <div style="padding: 10px 20px; width: 100%;">
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
                  >
                    <el-table-column type="selection" width="55"/>
                    <el-table-column prop="card" label="车牌号码" />
                    <el-table-column prop="supplierInsurance" label="保险公司" />
                    <el-table-column prop="insuranceType" label="保险项目" />
                    <el-table-column prop="fileName" label="保单附件" width="100">
                      <template #default="scope">
                        <el-button type="primary" link @click="annexClick(scope.row)" v-if="scope.row.file != null">附件</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="保险费用(元)" align="right"/>
                    <el-table-column prop="avgAmount" label="每月保险费用(元)" align="right"/>
                    <el-table-column prop="time" label="保险时间" width="250">
                      <template #default="scope">
                        <span>{{ dayjs(scope.row.startTime).format("YYYY-MM-DD") }}</span>
                        <span style="padding: 20px;">-</span>
                        <span>{{ dayjs(scope.row.endTime).format("YYYY-MM-DD") }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="action" label="操作" width="180">
                      <template #default="scope">
                        <el-button key="text" type="text" @click="editClick(scope.$index, scope.row)">编辑</el-button>
                        <el-button key="text" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            <el-card class="procurementClass" shadow="never" style="height:85vh;">
              <importSlot :title="state.title" :apiFn="state.apiFn" :downFn="state.downFn" @returnList="returnList"></importSlot>
            </el-card>
          </div>
        </el-main>
      </el-container>
      <!-- 添加或修改对话框 -->
      <el-dialog
        v-model="dialogNewVisible"
        :title="state.dialogAction=='new'?'新建':'编辑'"
        width="50%"
        :before-close="handleEditClose"
        class="newDialogClass"
      >
        <el-form  :model="newForm" :rules="newRules" label-position="left" label-width="100px" ref="newFormRef" class="newFormClass">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="业务场景" prop="business">
                <el-select v-model="newForm.business" size="default" placeholder="请选择业务场景" style="align-items: center;width: 100%;" @change="businessCodeChange" clearable>
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
                  style="width: 100%;"
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
              <el-form-item label="保险公司" prop="supplierInsuranceCode">
                <el-select v-model="newForm.supplierInsuranceCode" size="default" placeholder="请选择保险公司" style="align-items: center;width: 100%;" @change="insuranceCmpClick" clearable>
                  <el-option
                    v-for="item in supplierInsuranceOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保险项目" prop="insuranceTypeCode">
                <el-select v-model="newForm.insuranceTypeCode" size="default" placeholder="请选择保险项目" style="align-items: center;width: 100%;" @change="insurancePrdClick" clearable>
                  <el-option
                    v-for="item in insuranceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="保险费用" prop="amount">
                <el-input v-model="newForm.amount" placeholder="请输入保险费用" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始日期" prop="startTime">
                <el-date-picker v-model="newForm.startTime" type="date" placeholder="请选择开始日期" style="width: 100%;" format="YYYY-MM-DD"
                                date-format="YYYY/MM/DD ddd"
                                value-format="YYYY-MM-DD"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="结束日期" prop="endTime">
                <el-date-picker v-model="newForm.endTime" type="date" placeholder="请选择结束日期" style="width: 100%;" format="YYYY-MM-DD"
                                date-format="YYYY/MM/DD ddd"
                                value-format="YYYY-MM-DD"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保单附件" prop="fileName">
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
          </el-row>
          
          <el-form-item label="备注" prop="remark" style="padding-left: 30px; padding-top: 20px;">
            <el-input v-model="newForm.remark"  type="textarea" placeholder="请输入备注"  />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="newCancelClick">取 消</el-button>
            <el-button type="primary" @click="newFormClick" :disabled="getDisabled">确 定</el-button>
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
              <el-icon style="color:orange;top:2px;"><WarningFilled /></el-icon>
              <span style="padding-left: 10px;">确定要删除这条数据吗？</span>
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
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from 'vue';
import { InsuranceForm, InsuranceQuery, InsurancePageVO } from '@/api/operations/insurance/types';
import { getInsurancePage, updateInsurance, addInsurance, deleteInsurance, exportInsurance, importInsurance, getInsuranceTemplate, getInsuranceStat} from "@/api/operations/insurance/index";
import { getDictOptions } from "@/api/dict/index"
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules, UploadRequestHandler } from 'element-plus'
import { WarningFilled, Close, } from '@element-plus/icons-vue'
import { getRepair, getInsurance } from "@/api/supplier/index"
import { UploadFile, UploadInstance, UploadProps, UploadRawFile,genFileId, UploadRequestOptions, UploadUserFile } from "element-plus";
import router from "@/router";
import importSlot from "@/views/Import/index.vue"
import SingleUpload from "@/components/Upload/SingleUpload.vue"
import dayjs from "dayjs"
import { uploadFileApi, deleteFileApi } from "@/api/file";
const importFlg = ref(false)
const returnList = () => {
  importFlg.value = !importFlg.value
}
const fileList = ref<UploadUserFile[]>([])
const excelFile = ref<File>();
const excelFilelist = ref<File[]>([]);
const multipleSelection = ref([])
const total = ref(0);
const dialogNewVisible = ref(false)
const dialogDeleteVisible = ref(false)
const repairAmount = ref(0)
const queryFormRef = ref(ElForm);
const queryParams = reactive<InsuranceQuery>({
  pageNum: 1,
  pageSize: 10,
});
const state = reactive({
  showData: false,
  componentList: [],
  tableData:[],
  dialogTitle: '',
  dialogAction: '',
  deleteId: '',
  apiFn: importInsurance,
  downFn: getInsuranceTemplate,
  title: '智能车管 - 智慧运营 - 保险管理',
  startTime:'',
  endTime:''
})
const fileName = ref('')
const repairOptions = ref([] as any []);
const cardOptions = ref([] as any []);
const businessOptions = ref([] as any []);
const insuranceOptions = ref([] as any []);
const supplierInsuranceOptions = ref([] as any []);
const newFormRef = ref();
const upload =ref<UploadInstance>()
const getDisabled = computed(()=> (newForm.business === '' || newForm.card==='' || newForm.startTime==='' || newForm.endTime==='' || newForm.amount==='' || newForm.supplierInsuranceCode ==='' || newForm.insuranceTypeCode === ''))
const businessObj = ref(null)
const insuranceObj = ref(null)

interface RuleForm {
  id: number,
  card: string,
  business: string,
  businessCode: string,
  supplierInsurance: string,
  supplierInsuranceCode: string,
  insuranceTypeCode:string,
  insuranceType:string,
  amount: string,
  fileName: string,
  file: string,
  startTime: string,
  endTime: string,
  remark: string,
}
const newForm = reactive<RuleForm>({
  id: 0,
  card: '',
  business: '',
  businessCode: '',
  supplierInsurance: '',
  supplierInsuranceCode: '',
  insuranceTypeCode:'',
  insuranceType:'',
  file: '',
  fileName: '',
  amount: '',
  startTime: '',
  endTime:'',
  remark: ''
})
const newRules = reactive<FormRules<RuleForm>>({
  business: [
    { required: true, message: '请选择业务场景', trigger: 'blur' }
  ],card: [
    { required: true, message: '请选择车牌号', trigger: 'blur' }
  ],
  supplierInsuranceCode: [
    { required: true, message: '请输入保险公司', trigger: 'blur' }
  ],
  insuranceTypeCode: [
    { required: true, message: '请输入保险项目', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始日期', trigger: 'blur' },
  ],
  endTime: [
    { required: true, message: '请选择结束日期', trigger: 'blur' },
  ],
  amount: [
    { required: true, message: '请输入年检金额', trigger: 'blur' },
  ],
  fileName: [
    { required: true, message: '请上传保单', trigger: 'blur' },
  ]
})

const loading = ref(false)
const resetForm = () => {
  newForm.id = 0
  newForm.card = ''
  newForm.startTime = ''
  newForm.endTime = ''
  newForm.amount = ''
  newForm.insuranceTypeCode = ''
  newForm.insuranceType = ''
  newForm.supplierInsurance = ''
  newForm.supplierInsuranceCode = ''
  newForm.file = ''
  newForm.fileName = ''
  newForm.remark = ''
  newForm.business = ''
  newForm.businessCode = ''
  fileList.value = []
}
const handleClose = (() => {
  dialogNewVisible.value = false
  if(newForm.file != '' &&  state.dialogAction=='new'){
    delBpmn(newForm.file)
  }
  resetForm()
})

const handleEditClose = (()=> {
  dialogNewVisible.value = false
  if(newForm.file != ''){
    delBpmn(newForm.file)
  }
  resetForm()
})

const handleDeleteClose = (() => {
  dialogDeleteVisible.value = false
})

const onReset = () => {
  state.startTime = ''
  state.endTime = ''
  queryParams.keywords = ''
  queryParams.startTimeS = ''
  queryParams.startTimeE = ''
  queryParams.endTimeS = ''
  queryParams.endTimeE = ''
  queryParams.businessCode = ''
  queryParams.business = ''
  queryParams.supplierCode = ''
  queryParams.insuranceType = ''
  queryParams.insuranceTypeCode = ''
  queryParams.pageNum = 1;
  handleQuery();
}

const newFormClick = () => {
  if(state.dialogAction == 'new'){
    addInsurance(newForm).then((res: any)=>{
      ElMessage.success('添加成功')
    }).catch(()=>{
      ElMessage.error('添加失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }else if(state.dialogAction == 'edit'){
    updateInsurance(newForm.id, newForm).then((res: any)=>{
      ElMessage.success('更新成功')
    }).catch(()=>{
      ElMessage.error('更新失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }
}

const datePickerStartChange = (val: any) => {
  queryParams.startTimeS = ''
  queryParams.startTimeE = ''
  if(val){
    queryParams.startTimeS = val[0]
    queryParams.startTimeE = val[1]
  }
}
const datePickerEndChange = (val: any) => {
  queryParams.endTimeS = ''
  queryParams.endTimeE = ''
  if(val){
    queryParams.endTimeS = val[0]
    queryParams.endTimeE = val[1]
  }
}

const newCancelClick = () => {
  handleClose()
}

const newClick = () => {
  state.dialogAction = "new"
  dialogNewVisible.value = true
}

/**
 * 限制用户上传文件的格式和大小
 */
 const handleBeforeUpload = (file: UploadRawFile) => {
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning("上传文件不能大于2M");
    return false;
  }
  return true;
}

/**
 * 自定义上传附件
 * @param options 
 */
async function uploadBpmn(options: UploadRequestOptions): Promise<any> { 
  uploadFileApi(options.file).then(rs=>{
    newForm.file = rs.data.url
    newForm.fileName = rs.data.name
  })
}

const delBpmn = (filePath: string) => {
  deleteFileApi(filePath).then(rs=>{
  })
}
/**
 * 导入功能按钮
 */
const importClick = () => {
  importFlg.value = true
}

/**
 * 附件下载
 * @param val 
 */
const annexClick = (val: any) => {
  window.open(import.meta.env.VITE_FILE_HOME + import.meta.env.VITE_FILE_API + val.file)
}

/**
 * 导出功能按钮
 */
const exportClick = () => {
  exportInsurance(queryParams).then((response)=>{
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
    ElMessage.success('导出成功')
  }).catch(()=>{
    ElMessage.error('导出失败')
  })
}
/**
 * 业务场景切换方法，赋值业务场景code
 * @param obj 
 */
const businessCodeChange = (obj : any) => {
  newForm.businessCode = businessOptions.value.find(item=>item.label === obj).value
}

/**
 * 删除功能按钮-弹窗
 */
const delClick = () => {
  if(multipleSelection.value.length == 0){
    ElMessage.warning('请先勾选数据')
  }else{
    dialogDeleteVisible.value = true
    let ids = multipleSelection.value.map((item:any) =>item.id);
    state.deleteId = ids.join(',').toString()
  }
}

/**
 * 删除窗体中删除功能实现
 */
const deleteFormConfirm = () => {
  dialogDeleteVisible.value = false
  deleteInsurance(state.deleteId).then((res: any)=>{
    ElMessage.success('数据删除成功')
  }).catch(()=>{
    ElMessage.error('数据删除失败')
  }).finally(()=>{
    handleDeleteClose();
    handleQuery();
  })
}

/**
 * 编辑功能按钮
 * @param val 
 * @param val1 
 */
const editClick = (val: any, val1: any) => {
  state.dialogAction = "edit"
  dialogNewVisible.value = true
  Object.assign(newForm, val1);
  fileList.value.push({
    name: newForm.fileName.replaceAll('/',''),
    url: newForm.file
  })
}

/**
 * 当超出限制时，执行的钩子函数
 * @param files 
 */
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  fileName.value = file.name
}

/**
 * Excel文件change事件
 *
 * @param file
 */
const handleExcelChange = (file: UploadFile) => {
  excelFile.value = file.raw;
  fileName.value = file.name
}

const handleDelete = (val: any, val1: any) => {
  dialogDeleteVisible.value = true
  state.deleteId = val1.id.toString()
}
const handleSelectionChange = (val: never[]) => {
  multipleSelection.value = val
}

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
  getInsurancePage(queryParams).then((rs :any) => {
      state.tableData = []
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getInsuranceStatInfo();
    })
    .finally(() => {
      loading.value = false;
    });
}

const getVehicleList = (data: any) => {
  vehicleAllList(data).then(res=>{
    cardOptions.value = res.data;
  })
}

const insuranceCmpClick = (val:any) => {
  newForm.supplierInsurance = supplierInsuranceOptions.value.find(item=>item.id===val)?.name
}

const insurancePrdClick = (val: any) => {
  newForm.insuranceType = insuranceOptions.value.find(item=>item.value===val)?.label
}

const getInsuranceStatInfo = () => {
  getInsuranceStat(queryParams).then((rs: { data: number; })=>{
    repairAmount.value = rs.data
  })
}

const remoteMethod = (query: string) => {
  getVehicleList({keywords: query})
}

const getRepairList = () => {
  getRepair({status: 1}).then(rs=>{
    Object.assign(repairOptions.value, rs.data)
  })
}

const getBusinessList = async (val: string, obj: Object) => {
  await getDictOptions(val).then(rs=>{
    Object.assign(obj, rs.data)
  })
}

const supplierInsurance = () => {
  getInsurance().then((rs: { data: any; })=>{
    Object.assign(supplierInsuranceOptions.value, rs.data)
  })
}

onMounted(async () => {
  handleQuery();
  getVehicleList({});
  getRepairList();
  supplierInsurance();
  getInsuranceStatInfo();
  await getBusinessList('business', businessObj);
  Object.assign(businessOptions.value, businessObj)
  await getBusinessList('insurance_type', insuranceObj);
  Object.assign(insuranceOptions.value, insuranceObj)
});
</script>
<style lang="scss" scoped>
.app-container{
  .insuranceClass{
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

  .demo-form-inline{
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .el-row{
    margin-left: 20px !important;
    margin-top: 20px;
  }

  :deep(.el-table th){
    background-color: #F6F9FF;
  }

  :deep(.newDialogClass .el-dialog__header){
    border-bottom: 1px solid lightgray;
      margin: 0 10px;
  }
  :deep(.newDialogClass .el-dialog__body){
    padding: 10px var(--el-dialog-padding-primary);
  }

  .newFormClass{
    background-color: rgba(220, 222, 224, 0.17);
    padding: 20px;
  }

  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .el-col-6{
    display: flex;
    align-items: center;
  }

  .indexClass{
    padding-left: 20px;
    font-size: 12px;
    color: gray;
  }
  :deep(.demo-form-inline .el-form-item){
    margin: 0px !important;
    align-items: center;
    width: 100%;
  }
  :deep(.el-breadcrumb__inner){
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #303030 !important;
  }

  :deep(.el-breadcrumb__inner.is-link){
    color: #8C8C8C !important;
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

  .upload-demo{
    display: flex;
    align-items: flex-start;
  }

  :deep(.el-upload-list){
    margin: 0;
  }
}
</style>
