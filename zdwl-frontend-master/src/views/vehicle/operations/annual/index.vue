<template>
  <div class="app-container">
    <div>
      <el-container>
        <!-- <el-header style="background-color: white;position: relative;">
          <span style="font-size: 12px;color: rgb(181, 181, 181);position: absolute;top: 35%;">当前位置：智能车管
            <span style="padding: 10px;">-</span>
            <span style="color: rgb(181, 181, 181)">智慧运营</span>
            <span style="padding: 10px;">-</span>
            <span style="color:black;">年检信息</span>
          </span>
        </el-header> -->
        <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
          <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;">当前位置：</span>
          <el-breadcrumb separator="-" style="display: flex;align-items: center;">
            <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }">智能车管</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/vehicle/operations/repairs' }">智慧运营</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="!importFlg">年检信息</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/vehicle/operations/annual' }" @click="returnList" v-if="importFlg">年检信息</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="importFlg">导入</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main>
          <div v-if="!importFlg">
            <el-card shadow="never">
              <div class="annualClass">
                <footer class="header__footer">
                  <el-form :model="queryParams" class="demo-form-inline"  ref="queryFormRef" style="margin-bottom: 0px;" >
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
                        <el-form-item label="年检日期">
                          <el-date-picker
                            v-model="state.time"
                            type="daterange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="YYYY-MM-DD"
                            date-format="YYYY/MM/DD ddd"
                            value-format="YYYY-MM-DD"
                            style="width: 100%;"
                            @change="datePickerChange"
                          />
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
                      <!-- <el-col :span="6">
                        <el-form-item label="检查地点">
                          <el-input v-model="queryParams.checkLocation" placeholder="请输入检查地点" clearable/>
                        </el-form-item>
                      </el-col> -->
                    </el-row>
                    <el-row class="row-bg" justify="space-between">
                      <el-col :span="6">
                        <el-form-item label="检测站">
                          <el-input v-model="queryParams.checkLocation" placeholder="请输入检测站" clearable/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6"></el-col>
                      <el-col :span="6" style="justify-content: flex-end;">
                        <div style="display:flex;">
                          <el-button style="margin-right: 10px" @click="onReset">重置</el-button>
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
                    @sort-change="sortChange"
                  >
                    <el-table-column type="selection" width="55"/>
                    <el-table-column prop="card" label="车牌号码" />
                    <el-table-column prop="checkTime" label="年检日期" sortable>
                      <template #default="scope">
                        {{dayjs(scope.row.checkTime).format('YYYY-MM-DD') }}
                    </template>
                    </el-table-column>
                    <el-table-column prop="checkLocation" label="检测站" />
                    <el-table-column prop="amount" label="金额(元)"  align="right"/>
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
        :before-close="handleClose"
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
                    :value="item"
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
              <el-form-item label="年检日期" prop="checkTime">
                <el-date-picker
                  v-model="newForm.checkTime"
                  type="date"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  placeholder="请选择年检日期"
                  size="default"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检测站" prop="checkLocation">
                <el-input v-model="newForm.checkLocation" placeholder="请输入城市+检测站名称"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="年检金额" prop="amount">
                <el-input v-model="newForm.amount" placeholder="请输入年检金额"  style="width: 100%;">
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="送修人" prop="repairPerson">
                <el-input v-model="newForm.repairPerson" placeholder="请输入送修人"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark" style="padding-left: 30px;">
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
import { AnnualInspectionExaminedForm, AnnualInspectionExaminedQuery, AnnualInspectionExaminedPageVO } from "@/api/operations/annual/types";
import { getExaminedPage, updateExamined, addExamined, deleteExamined, exportExamined, importExamined, getExaminedTemplate, getExaminedStat} from "@/api/operations/annual/index";
import { getDictOptions } from "@/api/dict/index"
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { WarningFilled, Close, } from '@element-plus/icons-vue'
import { getRepair } from "@/api/supplier/index"
import dayjs from "dayjs"
import importSlot from "@/views/Import/index.vue"
import router from "@/router";
const multipleSelection = ref([])
const total = ref(0);
const dialogNewVisible = ref(false)
const dialogDeleteVisible = ref(false)
const queryFormRef = ref(ElForm);
const importFlg = ref(false)
const returnList = () => {
  importFlg.value = !importFlg.value
}
const queryParams = reactive<AnnualInspectionExaminedQuery>({
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
  apiFn: importExamined,
  downFn: getExaminedTemplate,
  title: '智能车管 - 智慧运营 - 年检信息',
  time:''
})
const emit = defineEmits({
  'paramsFn': null,
  'disableClick': null
});
const repairAmount = ref(0);
const repairOptions = ref([] as any []);
const cardOptions = ref([] as any []);
const businessOptions = ref([] as any []);
const newFormRef = ref();
const getDisabled = computed(()=> (newForm.card==='' || newForm.checkTime==='' || newForm.checkLocation==='' || newForm.amount===''))

interface RuleForm {
  id: number,
  card: string,
  checkTime: string,
  checkLocation: string,
  amount: string,
  repairPerson: string,
  remark: string,
  business: string,
  businessCode: string
}
const newForm = reactive<RuleForm>({
  id: 0,
  card: '',
  checkTime: '',
  checkLocation: '',
  amount: '',
  repairPerson: '',
  remark: '',
  business: '',
  businessCode: ''
})
const newRules = reactive<FormRules<RuleForm>>({
  card: [
    { required: true, message: '请选择车牌号', trigger: 'blur' }
  ],
  checkTime: [
    { required: true, message: '请选择年检日期', trigger: 'blur' },
  ],
  checkLocation: [
    { required: true, message: '请输入城市+检测站名称', trigger: 'blur' },
  ],
  amount: [
    { required: true, message: '请输入年检金额', trigger: 'blur' },
  ]
})
const datePickerChange = (val: any) => {
  queryParams.startTime = ''
  queryParams.endTime = ''
  if(val){
    queryParams.startTime = val[0]
    queryParams.endTime = val[1]
  }
}
const loading = ref(false)
const resetForm = () => {
  newForm.id = 0
  newForm.card = ''
  newForm.checkTime = ''
  newForm.checkLocation = ''
  newForm.amount = ''
  newForm.repairPerson = ''
  newForm.remark = ''
  newForm.business = ''
  newForm.businessCode = ''
}
const handleClose = (() => {
  dialogNewVisible.value = false
  resetForm()
})

const handleDeleteClose = (() => {
  dialogDeleteVisible.value = false
})

const onReset = () => {
  queryParams.keywords = ''
  state.time = ''
  queryParams.startTime = ''
  queryParams.examinedTimeSort = 'desc'
  queryParams.endTime = ''
  queryParams.business = ''
  queryParams.checkLocation = ''
  queryParams.pageNum = 1;
  handleQuery();
}

const businessCodeChange = (val : any) => {
  newForm.business = val.label
  newForm.businessCode = val.value
}

const newFormClick = () => {
  if(state.dialogAction == 'new'){
    addExamined(newForm).then((res: any)=>{
      ElMessage.success('添加成功')
    }).catch(()=>{
      ElMessage.error('添加失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }else if(state.dialogAction == 'edit'){
    updateExamined(newForm.id, newForm).then((res: any)=>{
      ElMessage.success('更新成功')
    }).catch(()=>{
      ElMessage.error('更新失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }
}

const sortChange = (val:any) => {
  if(val.order == "ascending"){
    queryParams.examinedTimeSort = 'asc'
  }else {
    queryParams.examinedTimeSort = 'desc'
  }
  handleQuery();
}

const newCancelClick = () => {
  handleClose()
}

const newClick = () => {
  state.dialogAction = "new"
  dialogNewVisible.value = true
}

const importClick = () => {
  importFlg.value = true
}

const exportClick = () => {
  exportExamined(queryParams).then((response)=>{
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

const delClick = () => {
  if(multipleSelection.value.length == 0){
    ElMessage.warning('请先勾选数据')
  }else{
    dialogDeleteVisible.value = true
    let ids = multipleSelection.value.map((item:any) =>item.id);
    state.deleteId = ids.join(',').toString()
  }
}

const deleteFormConfirm = () => {
  dialogDeleteVisible.value = false
  deleteExamined(state.deleteId).then((res: any)=>{
    ElMessage.success('数据删除成功')
  }).catch(()=>{
    ElMessage.error('数据删除失败')
  }).finally(()=>{
    handleDeleteClose();
    handleQuery();
  })
}

const editClick = (val: any, val1: any) => {
  state.dialogAction = "edit"
  dialogNewVisible.value = true
  Object.assign(newForm, val1);
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
  getExaminedPage(queryParams).then((res :any) => {
      state.tableData = []
      Object.assign(state.tableData, res.data.list);
      total.value = res.data.total;
      getExaminedStatInfo();
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

const remoteMethod = (query: string) => {
  getVehicleList({keywords: query})
}

const remoteCheckLocation = (query: string) => {
  //TODO
}

const getRepairList = () => {
  getRepair({status: 1}).then(rs=>{
    Object.assign(repairOptions.value, rs.data)
  })
}

const getBusinessList = (val: string) => {
  getDictOptions(val).then(rs=>{
    Object.assign(businessOptions.value, rs.data)
  })
}

const getExaminedStatInfo = () => {
  getExaminedStat(queryParams).then(rs=>{
    repairAmount.value = rs.data
  })
}

const returnImport = () => {
  importFlg.value = !importFlg.value
}

onMounted(() => {
  importFlg.value = false;
  queryParams.examinedTimeSort = 'desc'
  handleQuery();
  getVehicleList({});
  getRepairList();
  getExaminedStatInfo();
  getBusinessList('business');
});

onUnmounted(()=>{
  importFlg.value = false;
})
</script>
<style lang="scss" scoped>
.app-container{
  .annualClass{
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
}
</style>
