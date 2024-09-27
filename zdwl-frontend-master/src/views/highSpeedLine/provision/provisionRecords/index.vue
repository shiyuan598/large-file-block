<template>
  <div class="app-container">
    <div class="map-content">
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
            :to="{ path: '/highSpeedLine/proprietaryLedger/overview' }"
            >自营业务台账</el-breadcrumb-item
          >
          <el-breadcrumb-item
            style="
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              color: #323233;
            "
            >计提记录</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-header>
      <div class="set-height" ref="vehi">
        <Form
          class="hide-form"
          :formModel="form"
          :fromList="fromList"
          show-overflow-tooltip="true"
          ref="formList"
          @searchInput="searchInput"
          @onSubmit="onSubmit"
          @restFunction="restFunction"
        >
        </Form>
        <el-row>
          <el-col :span="4">
            <el-popconfirm title="确定要删除吗?" @confirm="batchVehicle">
              <template #reference>
                <!-- <el-button key="text" type="text">删除</el-button> -->
                <el-button size="default">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button @click="exportVehicle" size="default">导出</el-button>
          </el-col>

          <el-col :span="20" class="property">
            <div>
              <span class="span-color">总金额：</span>
              <el-text class="text-span" truncated>
                {{ state.amountTotal }}
              </el-text>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="state.tableData"
          v-loading="state.loading"
          size="default"
          :max-height="setHeight"
          @selection-change="handleSelectionChange"
          style="width: 100%; margin-top: 16px"
        >
          <el-table-column fixed type="selection" width="55" />
          <el-table-column width="" prop="orderUuid" label="订单编号" />
          <el-table-column width="" prop="orderDate" label="订单曰期" />
          <el-table-column width="" prop="billDate" label="费用曰期" />
          <el-table-column width="" prop="billTypeDesc" label="费用类型">
            <!-- <template #default="scope">
              {{ filterType(scope.row.billType) }}
            </template> -->
          </el-table-column>
          <el-table-column width="400" prop="supplier" label="供应商" />
          <el-table-column width="" prop="upTractor" label="车牌号" />
          <el-table-column width="" prop="amount" label="金额" />
        </el-table>
        <el-row class="pagination-style" justify="end">
          <el-pagination
            background
            layout="total, prev, pager, next, sizes, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @pagination="getStatList"
            :pager-count="5"
            :page-sizes="[10, 20, 30, 40, 100]"
            v-model:total="state.total"
          />
        </el-row>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { deleteTractor } from "@/api/vehicleInfo";
import { tractorListQuery } from "@/api/depreciation/index";
import { dispatchAccrual } from "@/api/highSpeedLine/provisionRecords/types";
import {
  getDispatchAccrual,
  billStat,
} from "@/api/highSpeedLine/provisionRecords/index";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import { exportFile } from "@/utils";
import { useElementSize } from "@vueuse/core";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 176;
});
onMounted(() => {
  getVehicleList({});
  getStatList();
});
const state = reactive({
  loading: false,
  tableData: [],
  total: 0,
  amountTotal: 0,
});
const cardOptions = ref([] as any[]);
const form = reactive<dispatchAccrual>({
  pageNum: 1,
  pageSize: 10,
  orderUuid: "",
  billType: null,
  supplier: "",
  tractorCode: "",
  picker: [],
  startTime: "",
  endTime: "",
});
let fromList = reactive([
  {
    type: "input",
    label: "订单编号",
    prop: "orderUuid",
    placeholder: "请输入订单编号",
  },
  {
    type: "selectValue",
    label: "费用类型",
    prop: "billType",
    placeholder: "请选择费用类型",
    optionList: [
      {
        label: "油费",
        value: 1,
      },
      {
        label: "尿素费",
        value: 2,
      },
      {
        label: "高速费",
        value: 3,
      },
    ],
  },
  {
    type: "input",
    label: "供应商",
    prop: "supplier",
    placeholder: "请输入供应商",
  },
  {
    type: "selectValue",
    label: "车牌号码",
    prop: "tractorCode",
    placeholder: "请选择车牌号码",
    optionList: cardOptions,
  },
  {
    type: "pickerDate",
    label: "订单日期",
    prop: ["startTime", "endTime"],
    placeholder: "请选择订单日期",
  },
]);
const searchInput = () => {
  getStatList();
};
const onSubmit = () => {
  getStatList();
};
const handleSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};

const getStatList = async () => {
  state.loading = true;
  try {
    state.loading = false;
    const { data } = await getDispatchAccrual(form).finally(() => {
      getBillStat(form);
    });
    state.tableData = data.list;
    state.total = data.total;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const restFunction = () => {
  form.startTime = "";
  form.endTime = "";
};
const getBillStat = async (parmer: any) => {
  const { data } = await billStat(parmer);
  state.amountTotal = data.amountTotal;
};
// 导出
const exportVehicle = () => {
  exportFile(form, "/api/v1/dispatchAccrual/total/_export");
};
const filterType = (value: string) => {
  const list = [
    {
      label: "油费",
      value: "1",
    },
    {
      label: "尿素费",
      value: "2",
    },
    {
      label: "高速费",
      value: "3",
    },
  ];
  return list.find((n) => n.value == value)?.label;
};
const getVehicleList = (data: any) => {
  tractorListQuery(data).then((res) => {
    const { data } = res;
    data.map((i: any) => {
      cardOptions.value?.push({ value: i.id, label: i.card });
    });
  });
};
const multipleSelection = ref([]);
const handleSelectionChange = (val: never[]) => {
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
  await deleteTractor(ids, "/api/v1/dispatchAccrual/bill/");
  getStatList();
};
</script>
<style lang="scss" scoped>
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
  background: #f6f9ff !important;
  color: #303030;
}
.app-container {
  height: 100%;
  .set-height {
    height: auto;
    min-height: calc(100% - 90px);
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
