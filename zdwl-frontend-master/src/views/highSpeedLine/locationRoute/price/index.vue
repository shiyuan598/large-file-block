<template>
  <div class="app-container">
    <el-container>
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
            :to="{ path: '/highSpeedLine/locationRoute/lineInfo' }"
            >地点线路</el-breadcrumb-item
          >
          <el-breadcrumb-item
            style="
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              color: #323233;
            "
            >单价标准</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-card>
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
                    <el-form-item label="查询时间">
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
                  <el-col :span="6"></el-col>
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
            <el-row style="width: calc(100% - 40px)" class="mb-4">
              <el-col :span="14">
                <el-button type="primary" @click="newClick">新建</el-button>
                <el-button @click="exportClick">导出</el-button>
              </el-col>
              <el-col :span="10" class="property">
       
                  <span class="span-color">油费单价平均值(元/升)：</span>
                  <el-text class="w-150px text-span" truncated>
                    {{ state.fuel.fuelAvg }}
                  </el-text>
                  <span class="span-color ml-8">油费单价最大值(元/升)：</span>
                  <el-text class="w-150px text-span" truncated>
                    {{ state.fuel.fuelMax }}
                  </el-text>
                  <span class="span-color ml-8">油费单价最小值(元/升)：</span>
                  <el-text class="w-150px text-span" truncated>
                    {{ state.fuel.fuelMin }}
                  </el-text>
           
              </el-col>
            </el-row>
            <div style="padding: 10px 20px; width: 100%">
              <el-table
                ref="multipleTableRef"
                :data="state.tableData"
                style="width: 100%"
                header-cell-class-name="headclass"
                v-loading="loading"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="priceDate" label="日期">
                  <template #default="scope">
                    <span>{{
                      dayjs(scope.row.priceDate).format("YYYY-MM-DD")
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fuelPrice"
                  label="油费单价(元/升)"
                  align="right"
                />
                <el-table-column
                  prop="ureaPrice"
                  label="尿素单价(元/公斤)"
                  align="right"
                />
                <el-table-column width="100" prop="action" label="操作">
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
          </div>
        </el-card>
      </el-main>
    </el-container>
    <!-- 添加或修改对话框 -->
    <el-dialog
      v-model="dialogNewVisible"
      :title="state.dialogAction == 'new' ? '批量调整' : '单价调整'"
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
            <el-form-item label="油费单价" prop="fuelPrice">
              <el-input
                v-model="newForm.fuelPrice"
                placeholder="请输入数值"
                style="width: 100%"
              >
                <template #append>
                  <span>元/L</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尿素单价" prop="ureaPrice">
              <el-input
                v-model="newForm.ureaPrice"
                placeholder="请输入数值"
                style="width: 100%"
              >
                <template #append>
                  <span>元/KG</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" prop="priceDate">
              <el-date-picker
                      v-model="newForm.priceDate"
                      value-format="YYYY-MM-DD"
                      type="date"
                      placeholder="请选择订单日期"
                    />
            </el-form-item>
          </el-col>
        </el-row>
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
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import { Calendar, Search } from "@element-plus/icons-vue";
import {
  priceinfoForm,
  priceinfoQuery,
  priceinfoPageVO,
} from "@/api/highSpeedLine/locationRoute/price/types";
import {
  getPricePage,
  updatePrice,
  addPrice,
  deletePrice,
  exportPrice,
  getPriceTemplate,
  priceAvg,
} from "@/api/highSpeedLine/locationRoute/price/index";
import { getDictOptions } from "@/api/dict/index";
import { vehicleAllList } from "@/api/operations/repairs/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getRepair, getPark } from "@/api/supplier/index";
import dayjs from "dayjs";
import router from "@/router";
const multipleSelection = ref([]);
const total = ref(0);
const dialogNewVisible = ref(false);
const dialogHandleVisible = ref(false);
const dialogDeleteVisible = ref(false);
const queryFormRef = ref(ElForm);
const queryParams = reactive<priceinfoQuery>({
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
  downFn: getPriceTemplate,
  title: "高速干线 - 地点线路 - 线路信息",
  fuel: {
    fuelAvg: 0,
    fuelMax: 0,
    fuelMin: 0,
  },
});
const newFormRef = ref();
const getDisabled = computed(
  () => newForm.fuelPrice === "" || newForm.ureaPrice === "" || newForm.priceDate === ""
);
interface RuleForm {
  id: number;
  fuelPrice: string;
  ureaPrice: string;
}

const newForm = reactive<RuleForm>({
  id: 0,
  fuelPrice: "",
  ureaPrice: "",
  priceDate: ""
});

const newRules = reactive<FormRules<RuleForm>>({
  fuelPrice: [{ required: true, message: "请输入油费单价", trigger: "blur" }],
  ureaPrice: [{ required: true, message: "请输入尿素单价", trigger: "blur" }],
  priceDate: [{ required: true, message: "请选择日期", trigger: "blur" }],
});

const loading = ref(false);
const resetForm = () => {
  newForm.id = 0;
  newForm.fuelPrice = "";
  newForm.ureaPrice = "";
  newForm.priceDate = "";
};

const datePickerStartChange = (val: any) => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  if (val) {
    queryParams.startTime = val[0];
    queryParams.endTime = val[1];
  }
};

const handleClose = () => {
  dialogNewVisible.value = false;
  resetForm();
};

const handleFormClose = () => {
  dialogHandleVisible.value = false;
  resetForm();
};

const handleDeleteClose = () => {
  dialogDeleteVisible.value = false;
};

const onReset = () => {
  queryParams.startTime = "";
  queryParams.endTime = "";
  state.time = "";
  handleQuery();
};

const newFormClick = () => {
  if (state.dialogAction == "new") {
    addPrice(newForm)
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
    updatePrice(newForm.id, newForm)
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

const newCancelClick = () => {
  handleClose();
};

const newClick = () => {
  state.dialogAction = "new";
  dialogNewVisible.value = true;
};

const exportClick = () => {
  exportPrice(queryParams)
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

const deleteFormConfirm = () => {
  dialogDeleteVisible.value = false;
  deletePrice(state.deleteId)
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
  getPricePage(queryParams)
    .then((rs: any) => {
      state.tableData = [];
      Object.assign(state.tableData, rs.data.list);
      total.value = rs.data.total;
    })
    .finally(() => {
      getPriceAvg();
      loading.value = false;
    });
};
const getPriceAvg = async () => {
  try {
    const { data } = await priceAvg(queryParams);
    state.fuel = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
onMounted(() => {
  handleQuery();
});

onUnmounted(() => {});
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
}
.property {
  text-align: right;
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
</style>
