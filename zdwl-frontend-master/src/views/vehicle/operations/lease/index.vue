<template>
  <div class="app-container">
    <div>
      <el-container>
        <!-- <el-header style="background-color: white;position: relative;">
          <span style="font-size: 12px;color: rgb(181, 181, 181);position: absolute;top: 35%;">当前位置：智能车管
            <span style="padding: 10px;">-</span>
            <span style="color: rgb(181, 181, 181)">智慧运营</span>
            <span style="padding: 10px;">-</span>
            <span style="color:black;">租赁公司</span>
          </span>
        </el-header> -->
        <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
          <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;">当前位置：</span>
          <el-breadcrumb separator="-" style="display: flex;align-items: center;">
            <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }">智能车管</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/vehicle/operations/repairs' }">智慧运营</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="!importFlg">租赁公司</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/vehicle/operations/lease' }" @click="returnList" v-if="importFlg">租赁公司</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="importFlg">导入</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main>
          <div v-if="!importFlg">
            <el-card shadow="never">
              <div class="parkClass">
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
                        <el-form-item label="开始时间">
                          <el-date-picker
                            v-model="state.startTime"
                            type="daterange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            date-format="YYYY/MM/DD ddd"
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
                            value-format="YYYY-MM-DD"
                            date-format="YYYY/MM/DD ddd"
                            style="width: 100%;"
                            @change="datePickerEndChange"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row class="row-bg" justify="space-between">
                      <el-col :span="6">
                        <el-form-item label="租赁公司">
                          <el-select v-model="queryParams.supplierCode" size="default" placeholder="请选择租赁公司" style="align-items: center;width: 100%;" clearable>
                            <el-option
                              v-for="item in supplierLeaseOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
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
                  >
                    <el-table-column type="selection" width="55"/>
                    <el-table-column prop="card" label="车牌号码" />
                    <el-table-column prop="supplierLease" label="租赁公司" />
                    <el-table-column prop="amount" label="金额(元)" align="right"/>
                    <el-table-column prop="avgAmount" label="每月金额(元)" align="right"/>
                    <el-table-column prop="time" label="租赁时间" >
                      <template #default="scope">
                        <span>{{ dayjs(scope.row.startTime).format('YYYY-MM-DD') }}</span>
                        <span style="padding: 20px;">-</span>
                        <span>{{ dayjs(scope.row.endTime).format('YYYY-MM-DD') }}</span>
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
              <el-form-item label="开始日期" prop="startTime">
                <el-date-picker v-model="newForm.startTime" type="date" placeholder="请选择开始日期" style="width: 100%;"  value-format="YYYY-MM-DD" date-format="YYYY/MM/DD ddd"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期" prop="endTime">
                <el-date-picker v-model="newForm.endTime" type="date" placeholder="请选择结束日期" style="width: 100%;"  value-format="YYYY-MM-DD" date-format="YYYY/MM/DD ddd"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="金额" prop="amount">
                <el-input v-model="newForm.amount" placeholder="请输入金额" style="width:100%;" >
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁公司" prop="supplierLease">
                <el-select v-model="newForm.supplierLease" size="default" placeholder="请选择租赁公司" style="align-items: center;width: 100%;" @change="supplierLeaseClick" clearable>
                  <el-option
                    v-for="item in supplierLeaseOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark" style="padding-left: 30px;padding-top: 20px;">
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
import { LeaseForm, LeaseQuery, LeasePageVO } from '@/api/operations/lease/types';
import { getLeasePage, updateLease, addLease, deleteLease, exportLease, getLeaseStat, importLease, getLeaseTemplate} from "@/api/operations/lease/index";
import { getDictOptions } from "@/api/dict/index"
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { WarningFilled, Close, } from '@element-plus/icons-vue'
import { getRepair, getLease } from "@/api/supplier/index"
import importSlot from "@/views/Import/index.vue"
import dayjs from "dayjs"
import router from "@/router";
const multipleSelection = ref([])
const total = ref(0);
const dialogNewVisible = ref(false)
const dialogDeleteVisible = ref(false)
const queryFormRef = ref(ElForm);
const queryParams = reactive<LeaseQuery>({
  pageNum: 1,
  pageSize: 10,
});
const importFlg = ref(false)
const returnList = () => {
  importFlg.value = !importFlg.value
}
const state = reactive({
  showData: false,
  componentList: [],
  tableData:[],
  dialogTitle: '',
  dialogAction: '',
  deleteId: '',
  startTime:'',
  endTime: '',
  apiFn: importLease,
  downFn: getLeaseTemplate,
  title: '智能车管 - 智慧运营 - 租赁管理',
})
const repairAmount = ref(0)
const repairOptions = ref([] as any []);
const cardOptions = ref([] as any []);
const businessOptions = ref([] as any []);
const supplierLeaseOptions = ref([] as any []);
const newFormRef = ref();
const getDisabled = computed(()=> (newForm.card==='' || newForm.startTime==='' || newForm.endTime==='' || newForm.amount==='' || newForm.supplierLease===''))

interface RuleForm {
  id: number,
  card: string,
  business: string,
  businessCode: string,
  amount: string,
  startTime: string,
  endTime: string,
  supplierLeaseCode: string,
  supplierLease: string,
  remark: string,
}
const newForm = reactive<RuleForm>({
  id: 0,
  card: '',
  business: '',
  businessCode: '',
  supplierLeaseCode:'',
  supplierLease:'',
  amount: '',
  startTime: '',
  endTime:'',
  remark: ''
})
const newRules = reactive<FormRules<RuleForm>>({
  business: [
    { required: true, message: '请选择业务场景', trigger: 'blur' }
  ],
  card: [
    { required: true, message: '请选择车牌号', trigger: 'blur' }
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
  supplierLease: [
    { required: true, message: '请选择租赁公司', trigger: 'blur' },
  ]
})

const loading = ref(false)
const resetForm = () => {
  newForm.id = 0
  newForm.card = ''
  newForm.startTime = ''
  newForm.endTime = ''
  newForm.amount = ''
  newForm.supplierLease = ''
  newForm.supplierLeaseCode = ''
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

const businessCodeChange = (obj : any) => {
  newForm.businessCode = businessOptions.value.find(item=>item.label === obj).value
}

const onReset = () => {
  queryParams.keywords = ''
  state.startTime = ''
  state.endTime = ''
  queryParams.business = ''
  queryParams.pageNum = 1;
  queryParams.startTimeS = ''
  queryParams.startTimeE = ''
  queryParams.endTimeS = ''
  queryParams.endTimeE = ''
  queryParams.supplierCode = ''
  handleQuery();
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

const newFormClick = () => {
  if(state.dialogAction == 'new'){
    addLease(newForm).then((res: any)=>{
      ElMessage.success('添加成功')
    }).catch(()=>{
      ElMessage.error('添加失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }else if(state.dialogAction == 'edit'){
    updateLease(newForm.id, newForm).then((res: any)=>{
      ElMessage.success('更新成功')
    }).catch(()=>{
      ElMessage.error('更新失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }
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
  exportLease(queryParams).then((response)=>{
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
  deleteLease(state.deleteId).then((res: any)=>{
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
  getLeasePage(queryParams).then((rs :any) => {
      state.tableData = []
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
      getLeaseStatInfo();
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

const supplierLeaseList = () => {
  getLease().then((rs: { data: any; })=>{
    Object.assign(supplierLeaseOptions.value, rs.data)
  })
  
}

const supplierLeaseClick = (obj: any) => {
  newForm.supplierLeaseCode = supplierLeaseOptions.value.find(item=> item.name === obj).id
}

const getLeaseStatInfo = () => {
  getLeaseStat(queryParams).then(rs=>{
    repairAmount.value = rs.data
  })
}

onMounted(() => {
  importFlg.value = false;
  handleQuery();
  getVehicleList({});
  getRepairList();
  getLeaseStatInfo();
  supplierLeaseList();
  getBusinessList('business');
});

onUnmounted(()=>{
  importFlg.value = false;
})
</script>
<style lang="scss" scoped>
.app-container{
  .parkClass{
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
