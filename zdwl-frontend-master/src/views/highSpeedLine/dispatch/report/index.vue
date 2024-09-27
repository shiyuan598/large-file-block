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
          ><span class="breadcrumb-color-is">延误报备</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="map-content">
      <div class="set-height" ref="vehi">
        <Form
          class="hide-form"
          :formModel="formModel"
          :fromList="fromList"
          @collapseExpand="collapseExpand"
          @searchInput="searchInput"
          @onSubmit="onSubmit"
          @restFunction="restFunction"
        >
          <template #formSlot> </template>
        </Form>
        <el-row>
          <el-button @click="exportVehicle" size="default">导出</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
            <template #reference>
              <!-- <el-button key="text" type="text">删除</el-button> -->
              <el-button @click.stop key="text" type="primary">批量删除</el-button>
            </template>
          </el-popconfirm>
        </el-row>

        <el-table
          :data="tableData"
          v-loading="state.loading"
          :max-height="setHeight"
          size="default"
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
          <el-table-column width="200" prop="route" label="路线名称">
            <template #default="scope">
              {{ scope.row.route }}({{ scope.row.project || "--" }})
            </template>
          </el-table-column>
          <el-table-column width="160" prop="customerCode" label="客户名称">
            <template #default="scope">
              {{ fileOption(cooperateOptions, scope.row.customerCode) }}
            </template>
          </el-table-column>
          <el-table-column width="110" prop="tractor" label="车牌号码" />
          <el-table-column width="" prop="delayType" label="报备类型">
            <template #default="scope">
              {{ filterType(scope.row.delayType) }}
            </template>
          </el-table-column>
          <el-table-column width="" prop="startTime" label="开始时间" />
          <el-table-column width="" prop="endTime" label="结束时间" />
          <el-table-column width="" prop="driver" label="报备司机">
            <template #default="scope">
              {{ scope.row.driver }}
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.driverPhone"
                placement="right"
              >
                <el-icon><Iphone /></el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="" prop="createTime" label="报备时间" />
          <el-table-column width="" prop="attachmentName" label="报备附件" >
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
          <el-table-column prop="action" fixed="right" label="操作">
            <template #default="scope">
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
    <ImageModel ref="image" :options="options"></ImageModel>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { Iphone } from "@element-plus/icons-vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import ImageModel from "@/views/vehicle/safety/components/imageModel.vue";
import { Options } from "@/api/depreciation/types";
import { useElementSize } from "@vueuse/core";
import { exportFile } from "@/utils";
import { deleteTractor } from "@/api/vehicleInfo";
import {
  cooperateList,
  lineInfoList,
  tractorList,
  driverList,
  projectList,
} from "@/api/depreciation";
import {
  delayPage
} from "@/api/highSpeedLine/report";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 210;
});

const formModel = reactive({
  pageNum: 1,
  pageSize: 10,
  orderStartTime: "",
  orderEndTime: "",
  customerCode: null,
  projectCode: null,
  routeCode: null,
  tractorCode: null,
  driverCode: null,
  delayType: ""
});
// 司机姓名
const driverOptions = ref<Options[]>([]);
// 线路名称
const licenseOptions = ref<Options[]>([]);
// 牵引车牌
const tractorOptions = ref<Options[]>([]);
// 客户名称
const cooperateOptions = ref<Options[]>([]);
// 项目名称
const projectOption = ref<Options[]>([]);
let fromList = reactive([
  {
    type: "selectValue",
    label: "客户名称",
    prop: "customerCode",
    placeholder: "请选择客户名称",
    optionList: cooperateOptions,
  },
  {
    type: "selectValue",
    label: "线路名称",
    prop: "routeCode",
    placeholder: "请选择线路名称",
    optionList: licenseOptions,
  },
  {
    type: "selectValue",
    label: "项目名称",
    prop: "projectCode",
    placeholder: "请选择项目名称",
    optionList: projectOption,
  },
  {
    type: "pickerDate",
    label: "订单日期",
    prop: ["orderStartTime", "orderEndTime"],
    placeholder: "请选择订单日期",
  },
  {
    type: "selectValue",
    label: "报备司机",
    prop: "driverCode",
    placeholder: "请选择司机姓名",
    optionList: driverOptions,
  },
  {
    type: "selectValue",
    label: "车牌号码",
    prop: "tractorCode",
    placeholder: "请选择车牌号码",
    optionList: tractorOptions,
  },
  {
    type: "selectValue",
    label: "报备类型",
    prop: "delayType",
    placeholder: "请选择报备类型",
    optionList: [
      {
        label: "交通事故",
        value: 1,
      },
      {
        label: "交通拥堵",
        value: 2,
      },
    ],
  },
  {
    type: "row",
  },
]);

const state = reactive({
  loading: false,
  total: 0,
});
const options: any = reactive({
  dialogBorder: false,
  fileSrc: "",
  title: "",
});
interface User {
  date: string;
  name: string;
  address: string;
}
const tableData: any = ref([]);
const filterType = (type:any)=>{
  let list = ['交通事故','交通拥堵']
  return list[type]
}
const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const fileOption = (list: any, code: number) => {
  return list.filter((n: any) => n.value === code)[0]?.label;
};
const annexClick = (val: any) => {
  options.dialogBorder = true;
  options.fileSrc = val.attachmentFile;
  options.title = val.attachmentName;
  // window.open(
  //   import.meta.env.VITE_FILE_HOME + import.meta.env.VITE_FILE_API + val.file
  // );
};
const multipleSelection = ref<User[]>([]);
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
const batchVehicle = () => {
  const arr = Array.from(
    multipleSelection.value,
    (item: any) => item.id
  ).join();
  handleDelete(arr);
};
// 批量删除与单个删除
const handleDelete = async (ids: any) => {
  await deleteTractor(ids, "/api/v1/plateOrder/delay/");
  getStatList();
};
// 导出
const exportVehicle = () => {
  exportFile(formModel, "/api/v1/plateOrder/delay/_export");
};
const collapseExpand = (val: boolean) => {
  val ? (height.value = height.value + 50) : (height.value = height.value - 50);
};
const searchInput = () => {
  getStatList();
};
const onSubmit = () => {
  getStatList();
};
const handleUseSizeChange = (value: number) => {
  formModel.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  formModel.pageNum = value;
  getStatList();
};
const restFunction = () => {};
const getStatList = async() => {
  state.loading = true;
  try{
    
    const { data } = await delayPage(formModel);
    state.loading = false;
    tableData.value = data.list;
    state.total = data.total;
  }catch(e:any){
    ElMessage.error(e.message);
    state.loading = false;
  }
};
onMounted(() => {
  Promise.all([
    driverList(),
    tractorList(),
    cooperateList(),
    lineInfoList({}),
    projectList(),
  ]).then((res) => {
    res.map((n, index) => {
      if (index === 0) {
        n.data.map((i: any) => {
          driverOptions.value.push({ value: i.id, label: i.name, ...i });
        });
      } else if (index === 1) {
        n.data.map((i: any) => {
          tractorOptions.value?.push({ value: i.id, label: i.card, ...i });
        });
      } else if (index === 2) {
        n.data.map((i: any) => {
          cooperateOptions.value?.push({ value: i.id, label: i.name });
        });
      } else if (index === 3) {
        n.data.map((i: any) => {
          licenseOptions.value?.push({ value: i.id, label: i.name });
        });
      } else if (index === 4) {
        n.data.map((i: any) => {
          projectOption.value?.push({ value: i.id, label: i.name });
        });
      }
    });
  });
});
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
