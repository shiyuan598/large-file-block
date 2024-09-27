<template>
  <div class="gasClass">
    <footer class="header__footer">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline"  ref="queryFormRef" >
        <el-form-item label="加油站名称">
          <el-input v-model="queryParams.keywords" placeholder="请输入加油站名称" clearable />
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择使用状态"
            clearable
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <span style="display:flex;">
        <el-button style="margin-right: 10px" @click="onReset">重置</el-button>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </span>
    </footer>
    <el-row class="mb-4">
      <el-button type="primary" @click="newClick">新建</el-button>
      <el-button @click="importClick">导入</el-button>
      <el-button @click="exportClick">导出</el-button>
      <el-button @click="delClick">删除</el-button>
    </el-row>
    <div style="padding: 10px 20px; width: 100%;">
      <el-table
        ref="multipleTableRef"
        :data="state.tableData"
        style="width: 100%"
        header-cell-class-name="headclass"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :show-overflow-tooltip="true"
      >
        <el-table-column type="selection" width="55" :selectable="selectable"/>
        <el-table-column prop="name" label="加油站名称" width="300">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.name"
              placement="top-start"
            >
            <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.name }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="purCompany" label="加油点" />
        <el-table-column prop="balanceFuel" label="柴油剩余金额(元)" align="right">
          <template #default="scope">
            <div v-if="scope.row.balanceFuel < 100000">
              <span style="color:rgba(255, 77, 79, 1);">{{ scope.row.balanceFuel }}</span>
            </div>
            <div v-else>
              <span>{{ scope.row.balanceFuel }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="balanceUrea" label="尿素剩余金额(元)" width="160" align="right">
          <template #default="scope">
            <div v-if="scope.row.balanceUrea < 10000">
                <span style="color:rgba(255, 77, 79, 1);">{{ scope.row.balanceUrea }}</span>
              </div>
              <div v-else>
                <span>{{ scope.row.balanceUrea }}</span>
              </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactPerson" label="联系人" />
        <el-table-column prop="phone" label="联系方式" />
        <el-table-column prop="status" label="合同归档" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.contractStatus" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="使用状态" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="180">
          <template #default="scope">
            <el-button key="text" type="text" @click="editClick(scope.$index, scope.row)">编辑</el-button>
            <el-button key="text" type="text" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.status == 0">删除</el-button>
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
      :title="state.dialogAction=='new'?'新建加油站':'编辑加油站'"
      width="50%"
      :before-close="handleClose"
      class="newDialogClass"
    >
      <el-form :model="newForm" :rules="newRules" label-position="left" label-width="100px" ref="newFormRef" class="newFormClass">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="newForm.name" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人姓名" prop="contactPerson">
              <el-input v-model="newForm.contactPerson" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="newForm.phone" placeholder="请输入联系方式"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加油点" prop="purCompany">
              <el-input v-model="newForm.purCompany" placeholder="请输入加油点"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="使用状态" prop="status">
              <el-radio-group v-model="newForm.status" class="ml-4">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同归档" prop="contractStatus">
              <el-radio-group v-model="newForm.contractStatus" class="ml-4">
                <el-radio :label="0">不归档</el-radio>
                <el-radio :label="1">归档</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
import { SupplierGasForm, SupplierGasQuery, SupplierGasPageVO } from "@/api/supplier/types";
import { getFuelPage, updateFuel, addFuel, deleteFuel, exportSupplier, getTemplate, importSupplier} from "@/api/supplier/index";
import type { FormInstance, FormRules } from 'element-plus'
import { WarningFilled, Close, } from '@element-plus/icons-vue'
import router from "@/router";
const multipleSelection = ref([])
const total = ref(0);
const dialogNewVisible = ref(false)
const dialogDeleteVisible = ref(false)
const queryFormRef = ref(ElForm);
const queryParams = reactive<SupplierGasQuery>({
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
  apiFn: importSupplier,
  downFn: getTemplate,
})
const emit = defineEmits({
  'paramsFn': null,
  'disableClick': null
});
const newFormRef = ref();
const getDisabled = computed(()=> (newForm.name==='' || newForm.contactPerson==='' || newForm.phone===''))
const selectable = (row: any, index: any) => {
  return row.status == 0
}

interface RuleForm {
  id: number,
  name: string,
  balanceFuel: string,
  balanceUrea: string,
  contractStatus: string,
  contactPerson: string,
  purCompany: string,
  phone: string,
  status: string
}
const newForm = reactive<RuleForm>({
  id: 0,
  name: '',
  balanceFuel: '',
  balanceUrea: '',
  contactPerson: '',
  contractStatus: '0',
  purCompany:'',
  phone: '',
  status: '0'
})
const newRules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' }
  ],
  purCompany: [
    { required: true, message: '请输入加油点', trigger: 'blur' }
  ],
  contactPerson: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择使用状态', trigger: 'blur' },
  ],
  contractStatus: [
    { required: true, message: '请选择合同归档', trigger: 'blur' },
  ]
})

const loading = ref(false)
const resetForm = () => {
  newForm.id = 0
  newForm.name = ''
  newForm.balanceFuel = ''
  newForm.balanceUrea = ''
  newForm.contactPerson = ''
  newForm.purCompany = ''
  newForm.phone = ''
  newForm.status = '0'
  newForm.contractStatus = '0'
}
const handleClose = (() => {
  dialogNewVisible.value = false
  resetForm()
})

const handleDeleteClose = (() => {
  dialogDeleteVisible.value = false
})

const onReset = () => {
  queryParams.status = undefined
  queryParams.keywords = ''
  queryParams.pageNum = 1;
  handleQuery();
}

const handleStatusChange = (val:any) => {
  updateFuel(val.id, val).then(res=>{
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
    addFuel(newForm).then(res=>{
      ElMessage.success('添加成功')
    }).catch(()=>{
      ElMessage.error('添加失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }else if(state.dialogAction == 'edit'){
    updateFuel(newForm.id, newForm).then(res=>{
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
  emit('paramsFn', {importFn: state.apiFn, downFn: state.downFn, downloadType: "fuel", title:"智能车管 - 供应商信息"})
}

const exportClick = () => {
  queryParams.supplierType = 'fuel'
  exportSupplier(queryParams).then(response=>{
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
  deleteFuel(state.deleteId).then(res=>{
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
  getFuelPage(queryParams).then(({ data }) => {
      state.tableData = []
      Object.assign(state.tableData, data.list);
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  handleQuery();
});
</script>
<style lang="scss" scoped>
.gasClass{
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
    margin-top: 22px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .demo-form-inline{
    width: 90%;
    margin-left: 20px;
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

  :deep(.deleteDialogClass .el-dialog__body) {
      padding: 0px var(--el-dialog-padding-primary);
  }

  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  :deep(.el-form-item){
    align-items: center;
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
}
</style>
