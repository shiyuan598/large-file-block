<template>
  <div class="butterClass">
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
            <el-form-item label="维修日期">
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
            <el-form-item label="维修厂名称">
              <el-select 
                v-model="queryParams.supplierRepairCode" 
                size="default" 
                placeholder="请选择维修厂名称" 
                style="align-items: center;width: 100%;"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteRepairQueryMethod"
                clearable
                >
                <el-option
                  v-for="item in repairOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-bg" justify="space-between">
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
          <el-col :span="6">
            <el-form-item label="维修项目">
              <el-input v-model="queryParams.content" size="default" placeholder="请输入维修项目"></el-input>
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
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="card" label="车牌号码"/>
        <el-table-column prop="repairTime" label="维修日期" sortable>
          <template #default="scope">
              {{dayjs(scope.row.repairTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="supplierRepair" label="维修厂名称" />
        <el-table-column prop="amount" label="维修金额（元）" align="right"/>
        <el-table-column prop="content" label="维修项目"/>
        <el-table-column prop="repairPerson" label="送修人"/>
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
            <el-form-item label="维修日期" prop="repairTime">
              <el-date-picker v-model="newForm.repairTime" type="date" placeholder="请选择维修日期" style="width: 100%;" value-format="YYYY-MM-DD" date-format="YYYY/MM/DD ddd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修厂" prop="supplierRepairCode">
              <el-select 
                v-model="newForm.supplierRepairCode" 
                size="default" 
                placeholder="请选择维修厂名称" 
                style="align-items: center;width: 100%;"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteRepairMethod"
                clearable
                >
                <el-option
                  v-for="item in repairOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="维修金额" prop="amount">
              <el-input v-model="newForm.amount" placeholder="请输入维修金额" style="width: 100%;">
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送修人" prop="repairPerson">
              <el-input v-model="newForm.repairPerson" placeholder="请输入送修人" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-left: 30px;">
          <el-form-item label="维修项目" prop="content">
            <el-input v-model="newForm.content" placeholder="请输入维修项目" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="newForm.remark"  type="textarea" placeholder="请输入备注"  />
          </el-form-item>
        </div>
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
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted } from 'vue';
import { RepairOtherForm, RepairOtherQuery, RepairOtherPageVO } from "@/api/operations/repairs/types";
import { getOtherPage, updateOther, addOther, deleteOther, exportOther, getOtherStat} from "@/api/operations/repairs/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { getDictOptions } from "@/api/dict/index"
import type { FormInstance, FormRules } from 'element-plus'
import { WarningFilled, Close, } from '@element-plus/icons-vue'
import { getRepair } from "@/api/supplier/index"
import router from "@/router";
import dayjs from "dayjs"
import { getOtherTemplate, importOther} from "@/api/operations/repairs/index";
const multipleSelection = ref([])
const total = ref(0);
const dialogNewVisible = ref(false)
const dialogDeleteVisible = ref(false)
const queryFormRef = ref(ElForm);
const queryParams = reactive<RepairOtherQuery>({
  pageNum: 1,
  pageSize: 10,
});

const emit = defineEmits({
  'paramsFn': null,
  'disableClick': null
});
const state = reactive({
  showData: false,
  componentList: [],
  tableData:[],
  dialogTitle: '',
  dialogAction: '',
  deleteId: '',
  apiFn: importOther,
  downFn: getOtherTemplate,
  time: ''
})
const repairAmount = ref(0);
const repairOptions = ref([] as any []);
const repairTypeOptions = ref([
  {
    id: 1,
    label: '更换',
  },
  {
    id: 2,
    label: '维修'
  }
]);
const cardOptions = ref([] as any []);
const businessOptions = ref([] as any []);
const newFormRef = ref();
const getDisabled = computed(()=> (newForm.business==='' || newForm.card==='' || newForm.repairTime==='' || newForm.supplierRepairCode==='' || newForm.content==='' || newForm.amount===''))

interface RuleForm {
  id: number,
  card: string,
  repairTime: string,
  content: string,
  supplierRepair: string,
  supplierRepairCode: string,
  amount: string,
  repairPerson: string,
  remark: string,
  business: string,
  businessCode: string
}
const newForm = reactive<RuleForm>({
  id: 0,
  card: '',
  repairTime: '',
  content:'',
  supplierRepair: '',
  supplierRepairCode: '',
  amount: '',
  repairPerson: '',
  remark: '',
  business: '',
  businessCode: ''
})
const newRules = reactive<FormRules<RuleForm>>({
  business:[
    { required: true, message: '请选择业务场景', trigger: 'blur' }
  ],
  card: [
    { required: true, message: '请选择车牌号', trigger: 'blur' }
  ],
  repairTime: [
    { required: true, message: '请选择维修日期', trigger: 'blur' },
  ],
  supplierRepairCode: [
    { required: true, message: '请选择维修厂', trigger: 'blur' },
  ],
  amount: [
    { required: true, message: '请输入维修金额', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入维修项目', trigger: 'blur' },
  ],
})

const loading = ref(false)
const resetForm = () => {
  newForm.id = 0
  newForm.card = ''
  newForm.repairTime = ''
  newForm.content = ''
  newForm.supplierRepair = ''
  newForm.supplierRepairCode = ''
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
  state.time = ''
  queryParams.repairTimeSort = 'desc'
  queryParams.supplierRepairCode = ''
  queryParams.businessCode = ''
  queryParams.business = ''
  queryParams.repairPerson = ''
  queryParams.keywords = ''
  queryParams.startTime = ''
  queryParams.endTime = ''
  queryParams.content = ''
  queryParams.pageNum = 1;
  handleQuery();
}

const handleStatusChange = (val:any) => {
  updateOther(val.id, val).then(_res=>{
    ElMessage.success('修改成功')
  }).catch(()=>{
    ElMessage.error('修改失败')
  }).finally(()=>{
    handleClose();
    handleQuery();
  })
}

const newFormClick = () => {
  if(state.dialogAction == 'new'){
    addOther(newForm).then(_res=>{
      ElMessage.success('添加成功')
    }).catch(()=>{
      ElMessage.error('添加失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }else if(state.dialogAction == 'edit'){
    updateOther(newForm.id, newForm).then(_res=>{
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
  emit('disableClick', true);
  emit('paramsFn', {importFn: state.apiFn, downFn: state.downFn, title:"智能车管 - 智慧运营 - 维修情况"})
}

const exportClick = () => {
  exportOther(queryParams).then(response=>{
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
  deleteOther(state.deleteId).then(_res=>{
    ElMessage.success('数据删除成功')
  }).catch(()=>{
    ElMessage.error('数据删除失败')
  }).finally(()=>{
    handleDeleteClose();
    handleQuery();
  })
}

const deleteFormCancel = () => {
  dialogDeleteVisible.value = false
}

const editClick = (_val: any, val1: any) => {
  state.dialogAction = "edit"
  dialogNewVisible.value = true
  Object.assign(newForm, val1);
}

const handleDelete = (_val: any, val1: any) => {
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
  getOtherPage(queryParams).then(({ data }) => {
      state.tableData = []
      Object.assign(state.tableData, data.list);
      total.value = data.total;
      getOtherStatInfo();
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

const remoteRepairMethod = (query: string) => {
  getRepair({status: 1, keywords: query}).then(rs=>{
    repairOptions.value = []
    Object.assign(repairOptions.value, rs.data)
  })
}

const remoteRepairQueryMethod = (query: string) => {
  getRepair({keywords: query}).then(rs=>{
    repairOptions.value = []
    Object.assign(repairOptions.value, rs.data)
  })
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

const businessCodeChange = (val : any) => {
  newForm.business = val.label
  newForm.businessCode = val.value
}

const datePickerChange = (val: any) => {
  queryParams.startTime = ''
  queryParams.endTime = ''
  if(val) {
    queryParams.startTime = val[0]
    queryParams.endTime = val[1]
  }
}

const getOtherStatInfo = () => {
  getOtherStat(queryParams).then(rs=>{
    repairAmount.value =rs.data
  })
}

const sortChange = (val:any) => {
  if(val.order == "ascending"){
    queryParams.repairTimeSort = 'asc'
  }else {
    queryParams.repairTimeSort = 'desc'
  }
  handleQuery();
}

onMounted(() => {
  queryParams.repairTimeSort = 'desc'
  handleQuery();
  getVehicleList({});
  getRepairList();
  getOtherStatInfo();
  getBusinessList('business');
});

</script>
<style lang="scss" scoped>
.butterClass{
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
