<template>
  <div class="app-container">
    <div>
      <el-container>
        <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
          <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;">当前位置：</span>
          <el-breadcrumb separator="-" style="display: flex;align-items: center;">
            <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }">智能调度</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }">客户项目</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="!importFlg">项目信息</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/vehicle/project/info' }" @click="returnList" v-if="importFlg">项目信息</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="importFlg">导入</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main>
          <div v-if="!importFlg">
            <el-card>
              <div class="parkClass">
                <footer class="header__footer">
                  <el-form :model="queryParams" class="demo-form-inline"  ref="queryFormRef" style="margin-bottom: 0px;">
                    <el-row class="row-bg" justify="space-between">
                      <el-col :span="6">
                        <el-form-item label="项目名称">
                          <el-input
                            v-model="queryParams.keywords"
                            style="width:100%;"
                            placeholder="请输入项目名称"
                            :suffix-icon="Search"
                            @change="handleQuery"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6"></el-col>
                      <el-col :span="6"></el-col>
                    </el-row>
                  </el-form>
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
                  >
                    <el-table-column type="selection" width="55"/>
                    <el-table-column prop="name" label="项目名称" />
                    <el-table-column prop="notes" label="项目描述" />
                    <el-table-column prop="status" label="项目状态">
                      <template #default="scope">
                        <div v-if="scope.row.status == '0'" style="display: flex;"><el-badge is-dot class="processed"></el-badge>启用中</div>
                        <div v-if="scope.row.status == '1'" style="display: flex;"><el-badge is-dot class="untreated"></el-badge>禁用中</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="action" label="操作">
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
        :title="state.dialogAction=='new'?'新建项目':'编辑项目'"
        width="50%"
        :before-close="handleClose"
        class="newDialogClass"
      >
        <el-form  :model="newForm" :rules="newRules" label-position="left" label-width="100px" ref="newFormRef" class="newFormClass">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称" prop="project">
                <el-input v-model="newForm.name" placeholder="请输入项目名称" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目状态" prop="status">
                <el-radio-group v-model="newForm.status">
                  <el-radio label="0">启用</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目描述" prop="notes" style="padding-left: 30px;padding-top: 20px;">
            <el-input v-model="newForm.notes" autosize type="textarea" placeholder="请输入项目描述"/>
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
import { Calendar, Search } from '@element-plus/icons-vue'
import { projectInfoForm, projectInfoQuery, projectInfoPageVO } from '@/api/highSpeedLine/project/info/types';
import { getInfoPage, updateInfo, addInfo, deleteInfo, exportInfo, importInfo, getInfoTemplate} from "@/api/highSpeedLine/project/info/index";
import { getDictOptions } from "@/api/dict/index"
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { WarningFilled, Close, } from '@element-plus/icons-vue'
import { getRepair, getPark } from "@/api/supplier/index"
import importSlot from "@/views/Import/index.vue"
import dayjs from "dayjs"
import router from "@/router";
const importFlg = ref(false)
const returnList = () => {
  importFlg.value = !importFlg.value
  handleQuery();
}
const multipleSelection = ref([])
const total = ref(0);
const dialogNewVisible = ref(false)
const dialogHandleVisible = ref(false)
const dialogDeleteVisible = ref(false)
const queryFormRef = ref(ElForm);
const queryParams = reactive<projectInfoQuery>({
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
  time: '',
  startTime:'',
  endTime: '',
  apiFn: importInfo,
  downFn: getInfoTemplate,
  title: '智慧调度 - 客户项目 - 项目信息',
})
const repairAmount = ref(0)
const repairOptions = ref([] as any []);
const cardOptions = ref([] as any []);
const businessOptions = ref([] as any []);
const supplierParkOptions = ref([] as any []);
const accidentTypeOptions = ref([] as any []);
const newFormRef = ref();
const getDisabled = computed(()=> (newForm.name==='' || newForm.notes===''))
interface RuleForm {
  id: number,
  name: string,
  notes: string,
  status: string,
}

const newForm = reactive<RuleForm>({
  id: 0,
  name: '',
  notes: '',
  status: '0',
})

const newRules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  notes: [
    { required: true, message: '请输入项目描述', trigger: 'blur' }
  ]
})

const loading = ref(false)
const resetForm = () => {
  newForm.id = 0
  newForm.name = ''
  newForm.notes = ''
  newForm.status = '0'
}

const handleClose = (() => {
  dialogNewVisible.value = false
  resetForm()
})

const handleHandleClose = (()=>{
  dialogHandleVisible.value = false
  resetForm()
})

const handleFormClose = (()=>{
  dialogHandleVisible.value = false
  resetForm()
})

const handleDeleteClose = (() => {
  dialogDeleteVisible.value = false
})

const onReset = () => {
  state.time = ''
  queryParams.keywords = ''
  handleQuery();
}

const newFormClick = () => {
  if(state.dialogAction == 'new'){
    addInfo(newForm).then((res: any)=>{
      ElMessage.success('添加成功')
    }).catch(()=>{
      ElMessage.error('添加失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }else if(state.dialogAction == 'edit'){
    updateInfo(newForm.id, newForm).then((res: any)=>{
      ElMessage.success('更新成功')
    }).catch(()=>{
      ElMessage.error('更新失败')
    }).finally(()=>{
      handleClose();
      handleQuery();
    })
  }
}

const handleClick = (val: any, val1: any) => {
  dialogHandleVisible.value = true
  Object.assign(newForm, val1)
}

const newCancelClick = () => {
  handleClose()
}

const newHandleCancelClick = () => {
  handleFormClose();
}

const newClick = () => {
  state.dialogAction = "new"
  dialogNewVisible.value = true
}

const importClick = () => {
  importFlg.value = true
}

const exportClick = () => {
  exportInfo(queryParams).then((response)=>{
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
  deleteInfo(state.deleteId).then((res: any)=>{
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
  newForm.status = val1.status.toString()
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
  getInfoPage(queryParams).then((rs :any) => {
      state.tableData = []
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
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

onMounted(() => {
  importFlg.value = false;
  handleQuery();
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

  .untreated{
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content){
      background-color: lightgray !important;
    }
  }
  .processed{
    display: flex;
    align-items: center;
    padding-right: 5px;
    :deep(.el-badge__content){
      background-color: lightgreen;
    }
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
}
</style>
