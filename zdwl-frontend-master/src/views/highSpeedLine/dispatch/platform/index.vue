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
          line-height: 30px;
        "
        >当前位置：</span
      >
      <el-breadcrumb separator="-" style="display: flex; align-items: center">
        <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }"
          ><span style="color: #8c8c8c">高速干线</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="{ path: '/highSpeedLine/dispatch/proprietary' }"
          ><span style="color: #8c8c8c">调度中心</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span
            :class="
              state.import || !state.built
                ? 'breadcrumb-color'
                : 'breadcrumb-color-is'
            "
            @click="returnList"
            >平台业务</span
          ></el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="state.import"
          ><span style="color: #303030">导入</span></el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="!state.built"
          ><span style="color: #303030">新建</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="map-content" v-if="state.built && !state.import">
      <div class="set-height" ref="vehi">
        <Form
          class="hide-form"
          :formModel="form"
          :fromList="list"
          @collapseExpand="collapseExpand"
          @searchInput="searchInput"
          @onSubmit="onSubmit"
          @restFunction="restFunction"
        >
          <template #formSlot> </template>
        </Form>
        <el-row>
          <el-button @click="newBuilt" type="primary" size="default"
            >新建</el-button
          >
          <el-button @click="importVehicle" size="default">导入</el-button>
          <el-button @click="exportVehicle" size="default">导出</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
            <template #reference>
              <!-- <el-button key="text" type="text">删除</el-button> -->
              <el-button size="default">删除</el-button>
            </template>
          </el-popconfirm>
        </el-row>
        <el-table
          :data="tableData"
          v-loading="state.loading"
          :max-height="setHeight"
          size="default"
          @row-click="rowClick"
          style="width: 100%; margin-top: 16px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column width="144" prop="uuid" fixed label="订单编号" />
          <el-table-column width="110" prop="orderDate" label="订单日期">
            <template #default="scope">
              {{ fileTime(scope.row.orderDate) }}
            </template>
          </el-table-column>
          <el-table-column width="160" prop="customerCode" label="客户名称">
            <template #default="scope">
              {{ fileOption(cooperateOptions, scope.row.customerCode) }}
            </template>
          </el-table-column>
          <el-table-column width="200" prop="route" label="路线名称">
            <template #default="scope">
              {{ scope.row.route }}({{ scope.row.project || "--" }})
            </template>
          </el-table-column>

          <el-table-column width="110" prop="tractor" label="牵引车牌" />
          <el-table-column width="90" prop="driver" label="司机姓名" />
          <el-table-column
            width="130"
            prop="income"
            align="right"
            label="收入结算（元）"
          ></el-table-column>
          <el-table-column align="right" width="140" prop="plateCost">
            <template #header="header">
              <span>平台支出（元）</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="含税"
                placement="top"
              >
                <span class="scope-icon">
                  <el-icon><Warning /></el-icon
                ></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            width="110"
            prop="delayCost"
            label="压车费（元）"
          />
          <el-table-column
            align="right"
            width="110"
            prop="emptyCost"
            label="放空费（元）"
          />
          <el-table-column
            align="right"
            width="110"
            prop="parkCost"
            label="经停费（元）"
          />
          <el-table-column
            align="right"
            width="100"
            prop="outCost"
            label="扣款（元）"
          />
          <el-table-column
            width="126"
            align="right"
            prop="driverCost"
            label="司机运费（元）"
          />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="action" fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button
                key="text"
                type="text"
                @click.stop="editClick(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-popconfirm
                title="确定要删除吗?"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button @click.stop key="text" type="text">删除</el-button>
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
    <div class="map-content" v-if="!state.built">
      <div>
        <NewBuilt
          :editForm="editForm"
          :projectOption="projectOption"
          :cooperateOptions="cooperateOptions"
          @cancelBuit="cancelBuit"
        ></NewBuilt>
      </div>
    </div>
    <div class="map-content overflow-hidden" v-if="state.import">
      <div class="importSlot-height">
        <importSlot
          :title="state.title"
          :apiFn="state.apiFn"
          :downFn="state.downFn"
          v-if="state.import"
          :downloadType="state.downloadType"
          @returnList="returnList"
        ></importSlot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Warning } from "@element-plus/icons-vue";
import { AssemblyForm } from "@/api/vehicleInfo/types";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import NewBuilt from "./newBuilt.vue";
import importSlot from "@/views/Import/index.vue";
import { useElementSize } from "@vueuse/core";
import { exportFile } from "@/utils";
import { deleteTractor } from "@/api/vehicleInfo";
import {
  projectList,
  cooperateList,
  lineInfoList,
  tractorList,
  driverList,
  plateOrderPage,
  importPlateOrderOrder,
  plateOrderTemplate,
} from "@/api/depreciation";
import { Options, Platform } from "@/api/depreciation/types";
import { onMounted, reactive, ref } from "vue";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 210;
});

// 司机姓名
const driverOptions = ref<Options[]>([]);
// 项目名称
const projectOption = ref<Options[]>([]);
// 线路名称
const licenseOptions = ref<Options[]>([]);
// 牵引车牌
const tractorOptions = ref<Options[]>([]);
// 客户名称
const cooperateOptions = ref<Options[]>([]);
// 查询form
let list: AssemblyForm[] = reactive([]);
const form = reactive({
  startTime: "",
  endTime: "",
  picker: [],
  pageNum: 1,
  pageSize: 10,
  status: undefined,
  customerCode: undefined,
  routeCode: undefined,
  tractorCode: undefined,
  driverCod: undefined,
});

onMounted(() => {
  Promise.all([
    driverList(),
    tractorList(),
    cooperateList(),
    lineInfoList({}),
    projectList(),
  ]).then((res) => {
    console.log(res);
    res.map((n, index) => {
      switch (index) {
        case 0:
          n.data.map((i: any) => {
            driverOptions.value.push({ value: i.id, label: i.name, ...i });
          });
          break;
        case 1:
          n.data.map((i: any) => {
            tractorOptions.value?.push({ value: i.id, label: i.card, ...i });
          });
          break;
        case 2:
          n.data.map((i: any) => {
            cooperateOptions.value?.push({ value: i.id, label: i.name });
          });
          break;
        case 3:
          n.data.map((i: any) => {
            licenseOptions.value?.push({ value: i.id, label: i.name });
          });
          break;
        case 4:
          n.data.map((i: any) => {
            projectOption.value?.push({ value: i.id, label: i.name });
          });
          break;
      }
    });
  });
  Object.assign(list, [
    // {
    //   type: "input",
    //   label: "订单编号",
    //   prop: "keywords",
    //   placeholder: "请输入订单编号",
    // },强制完成，路线轨迹,改为code编码
    {
      type: "selectValue",
      label: "客户名称",
      prop: "customerCode",
      placeholder: "请选择客户名称",
      optionList: cooperateOptions,
    },
    {
      type: "selectValue",
      label: "项目名称",
      prop: "projectCode",
      placeholder: "请选择项目名称",
      optionList: projectOption,
    },
    {
      type: "input",
      label: "线路名称",
      prop: "route",
      placeholder: "请输入线路名称",
      // optionList: licenseOptions,
    },
    {
      type: "input",
      label: "订单编号",
      prop: "uuid",
      placeholder: "请输入订单编号",
    },
    {
          type: "pickerDate",
          label: "订单日期",
          prop: ["startTime", "endTime"],
          placeholder: "请选择订单日期",
        },
    {
      type: "input",
      label: "司机姓名",
      prop: "driver",
      placeholder: "请输入司机姓名",
    },
    {
      type: "input",
      label: "车牌号码",
      prop: "tractor",
      placeholder: "请输入车牌号码",
    },

    {
      type: "row",
    },
  ]);
  getStatList();
});
const searchInput = () => {
  getStatList();
};
const restFunction = () => {
  form.startTime = "";
  form.endTime = "";
};
const tableData: any = ref([]);
const editClick = (index: number, row: any) => {
  state.built = false;
  editForm.value = row;
};
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
// 列表查询
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await plateOrderPage(form);
    state.total = data.total;
    tableData.value = data.list;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const state = reactive({
  loading: false,
  dialogVisible: false,
  title: "调度中心-平台业务",
  apiFn: importPlateOrderOrder,
  downFn: plateOrderTemplate,
  import: false,
  downloadType: "fuel",
  projectLoading: false,
  step: 0,
  built: true,
  total: 0,
});
const editForm = ref<Platform>();
const newBuilt = () => {
  state.built = false;
};
const cancelBuit = (refresh: boolean) => {
  state.built = true;
  if (refresh) {
    getStatList();
  }
};
const importVehicle = () => {
  state.import = true;
};
// 导出
const exportVehicle = () => {
  exportFile(form, "/api/v1/plateOrder/_export");
};
const onSubmit = () => {
  getStatList();
};
const collapseExpand = (val: boolean) => {
  val ? (height.value = height.value + 50) : (height.value = height.value - 50);
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
  await deleteTractor(ids, "/api/v1/plateOrder/");
  getStatList();
};
const returnList = () => {
  state.import = false;
  state.built = true;
};
const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const fileOption = (list: any, code: number) => {
  return list.filter((n: any) => n.value === code)[0]?.label;
};
// 行内点击事件

const rowClick = (row: any) => {};
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
</script>
<style scoped lang="scss">
.app-container {
  height: 100%;
}
.scope-icon {
  :deep(.el-icon) {
    vertical-align: middle;
  }
}
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}
:deep(.el-form-item--default) {
  margin-bottom: 32px;
}
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
.map-content {
  height: calc(100% - 72px);
}
.set-height {
  height: calc(100% - 16px);
}
</style>
