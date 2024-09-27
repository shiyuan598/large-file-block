<template>
  <div class="app-container">
    <div v-if="!createInfoFlg"> 
      <div>
        <el-container>
          <!-- <el-header style="background-color: white;position: relative;">
            <span style="font-size: 12px;color: rgb(181, 181, 181);position: absolute;top: 35%;">当前位置：高速干线
              <span style="padding: 10px;">-</span>
              <span style="color: rgb(181, 181, 181)">地点线路</span>
              <span style="padding: 10px;">-</span>
              <span style="color:black;">线路信息</span>
            </span>
          </el-header> -->
          <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
            <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;">当前位置：</span>
            <el-breadcrumb separator="-" style="display: flex;align-items: center;">
              <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }">智能调度</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/highSpeedLine/locationRoute/lineInfo' }">地点线路</el-breadcrumb-item>
              <el-breadcrumb-item style="font-size: 14px;font-family: PingFangSC, PingFang SC;color: #323233;" v-if="!importFlg">线路信息</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/highSpeedLine/locationRoute/lineInfo' }" @click="returnList" v-if="importFlg">线路信息</el-breadcrumb-item>
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
                          <el-form-item label="路线名称">
                            <el-input
                              v-model="queryParams.keywords"
                              style="width:100%;"
                              placeholder="请输入路线名称"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="项目名称">
                            <el-select v-model="queryParams.projectCode" size="default" placeholder="请选择项目名称" style="align-items: center;width: 100%;" clearable>
                              <el-option
                                v-for="item in projectNameOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="客户名称">
                            <el-select v-model="queryParams.customerCode" size="default" placeholder="请选择项目名称" style="align-items: center;width: 100%;" clearable>
                              <el-option
                                v-for="item in customerNameOptions"
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
                          <el-form-item label="单双驾驶">
                            <el-select v-model="queryParams.upDriverType" size="default" placeholder="请选择单双驾驶" style="align-items: center;width: 100%;" clearable>
                              <el-option
                                v-for="item in driveTypeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                              />
                            </el-select>
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
                  </el-row>
                  <div style="height:54px;background-color: #FAFAFA;width: 97.5%; margin-left: 20px;border: 1px solid #E4E4E4;border-radius: 2px 2px 0px 0px;">
                    <div style="display: flex; justify-content: space-between;">
                      <div style="line-height:46px;margin-left: 20px;">
                        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 500;color: #303030;">单价标准</span>
                        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #606060;padding-left: 24px;">油费单价：{{fuelPrice}}元/升</span>
                        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #606060;padding-left: 32px;">尿素单价：{{ureaPrice}}元/公斤</span>
                      </div>
                      <!-- <div style="line-height:46px">
                        <el-button type="text" style="margin-right: 20px;" @click="showPriceDialog">调整单价</el-button>
                      </div> -->
                    </div>
                  </div>
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
                      <el-table-column prop="name" label="线路名称" width="180"/>
                      <el-table-column prop="customer" label="客户名称"/>
                      <el-table-column prop="project" label="项目名称"/>
                      <el-table-column prop="upMileage" label="标准里程(KM)" width="120" align="right"/>
                      <el-table-column prop="upTime" label="标准时效(分钟)" width="120" align="right"/>
                      <el-table-column prop="upAmount" label="运费(元)" align="right"/>
                      <el-table-column label="安全员提成(元)" align="center">
                        <el-table-column prop="upFirstDriverAmount" label="主驾" align="right"/>
                        <el-table-column prop="upSecondDriverAmount" label="副驾" align="right"/>
                      </el-table-column>
                      <el-table-column prop="fuelConsumption" width="120" label="百公里油耗(L)" align="right"/>
                      <el-table-column prop="upFuelNum" label="标准油量(L)" align="right"/>
                      <el-table-column prop="upUreaNum" label="尿素量(KG)" align="right"/>
                      <el-table-column prop="upHighAmount" label="高速费(元)" align="right"/>
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
    <div v-if="createInfoFlg"> 
      <createInfo @returnInfo="returnInfo" :data="createData"></createInfo>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from 'vue';
import { Calendar, Search } from '@element-plus/icons-vue'
import { lineinfoForm, lineinfoQuery, lineinfoPageVO } from '@/api/highSpeedLine/locationRoute/lineInfo/types';
import { getLineinfoPage, updateLineinfo, addLineinfo, deleteLineinfo, exportLineinfo, importLineinfo, getLineinfoTemplate} from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { getOneNewPrice } from "@/api/highSpeedLine/locationRoute/price/index"
import { getInfoList } from "@/api/highSpeedLine/project/info/index"
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index"
import { getDictOptions } from "@/api/dict/index"
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { WarningFilled, Close, } from '@element-plus/icons-vue'
import { getRepair, getPark } from "@/api/supplier/index"
import importSlot from "@/views/Import/index.vue"
import createInfo from "./createInfo.vue"
import dayjs from "dayjs"
import router from "@/router";
const importFlg = ref(false)
const returnList = () => {
  importFlg.value = !importFlg.value
  handleQuery();
}
const returnInfo = () => {
  createInfoFlg.value = false
  handleQuery();
}
const multipleSelection = ref([])
const total = ref(0);
const createInfoFlg = ref(false)
const createData = ref()
const dialogHandleVisible = ref(false)
const dialogDeleteVisible = ref(false)
const fuelPrice = ref('0')
const ureaPrice = ref('0')
const queryFormRef = ref(ElForm);
const queryParams = reactive<lineinfoQuery>({
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
  apiFn: importLineinfo,
  downFn: getLineinfoTemplate,
  title: '高速干线 - 地点线路 - 线路信息',
})
const repairAmount = ref(0)
const repairOptions = ref([] as any []);
const cardOptions = ref([] as any []);
const projectNameOptions = ref([] as any []);
const customerNameOptions = ref([] as any []);
const driveTypeOptions = ref([
  {
    id: 1,
    name: '单驾'
  },
  {
    id: 2,
    name: '双驾'
  }
]);
const newFormRef = ref();
interface RuleForm {
  id: number,
  customName: string,
  fullName: string,
  name: string,
  phone: string,
  handleStatus: string,
}

const newForm = reactive<RuleForm>({
  id: 0,
  customName: '',
  fullName: '',
  name: '',
  phone:'',
  handleStatus: '0',
})

const loading = ref(false)

const handleClose = (() => {
  dialogDeleteVisible.value = false
})

const handleDeleteClose = (() => {
  dialogDeleteVisible.value = false
})

const onReset = () => {
  queryParams.keywords = ''
  queryParams.customerCode = ''
  queryParams.projectCode = ''
  queryParams.upDriverType = ''
  handleQuery();
}

const projectList = () => {
  getInfoList({}).then(rs=>{
    Object.assign(projectNameOptions.value, rs.data)
  })
}

const customerList = () => {
  getCooperateList({}).then(rs=>{
    Object.assign(customerNameOptions.value, rs.data)
  })
}

const newClick = () => {
  createInfoFlg.value = true
  state.dialogAction = "new"
  createData.value = {}
}

const editClick = (val: any, val1: any) => {
  state.dialogAction = "edit"
  Object.assign(newForm, val1);
  createInfoFlg.value = true
  createData.value = newForm
}

const importClick = () => {
  importFlg.value = true
}

const exportClick = () => {
  exportLineinfo(queryParams).then((response)=>{
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
  deleteLineinfo(state.deleteId).then((res: any)=>{
    ElMessage.success('数据删除成功')
  }).catch(()=>{
    ElMessage.error('数据删除失败')
  }).finally(()=>{
    handleDeleteClose();
    handleQuery();
  })
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
  getLineinfoPage(queryParams).then((rs :any) => {
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

const getNewPrice = () => {
  getOneNewPrice().then(rs=>{
    fuelPrice.value = rs.data.fuelPrice
    ureaPrice.value = rs.data.ureaPrice
  })
}

onMounted(() => {
  importFlg.value = false;
  handleQuery();
  projectList();
  customerList();
  getNewPrice();
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
      background-color: red;
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
