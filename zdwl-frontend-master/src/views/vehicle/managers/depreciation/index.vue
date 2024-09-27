<template>
  <div class="map-content">
    <el-header style="background-color: white;display: flex;justify-content: flex-start;height:56px;">
        <span style="font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;display: flex;align-items: center;line-height: 30px;">当前位置：</span>
        <el-breadcrumb separator="-" style="display: flex;align-items: center;">
          <el-breadcrumb-item :to="{ path: '/vehicle/supplier/supplierInfo' }"><span style="color: #8C8C8C;">智能车管</span></el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/vehicle/managers/depreciation' }"><span style="color: #8C8C8C;">车辆管理</span></el-breadcrumb-item>
          <el-breadcrumb-item ><span style="color: #303030;">车辆折旧</span></el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
    <div class="set-height" ref="vehi">
      <el-row class="mt-2">
        <el-col :span="10">
          <span class="mr-8 text-color">车牌号码</span>
          <el-input
            v-model="queryParams.keywords"
            size="default"
            style="width: 272px"
            placeholder="请输入车牌号码"
            :suffix-icon="Search"
            @input="inputClick"
          />
        </el-col>
        <el-col :span="14" class="t-right">
          <span class="span-color">资产净值(元)：</span>
          <el-text class="w-150px text-span" truncated>{{
            state.depreciationPriceSum
          }}</el-text>
          <span class="span-color ml-6">折旧成本(元)：</span>
          <el-text class="w-150px text-span" truncated>{{
            state.depreciationCostSum
          }}</el-text>
        </el-col>
      </el-row>
      <el-row class="mt-2">
        <el-button @click="exportClick">导出</el-button>
      </el-row>
      <el-table
        v-loading="state.loading"
        :max-height="height - 150"
        :data="depreciationPageList"
        style="width: 100%; margin-top: 16px"
        size="large"
      >
        <el-table-column prop="card" label="车牌号码" />
        <el-table-column
          prop="vehicleType"
          label="车辆类型"
          :filters="[
            { text: '牵引车', value: '牵引车' },
            { text: '挂车', value: '挂车' },
            { text: '集装箱', value: '集装箱' },
            { text: '环卫车', value: '环卫车' },
            { text: '乘用车', value: '乘用车' },
          ]"
          :filter-method="filterTag"
        >
        </el-table-column>
        <el-table-column prop="startTime" label="启用时间">
          <template #header="header">
            <span>启用时间</span>
            <el-popover placement="top-start" :width="400" :visible="state.visible">
              <el-date-picker
                v-model="state.picker"
                type="daterange"
                range-separator="-"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="changeTime"
              />
              <template #reference>
                <span class="scope-icon"  @click="state.visible = !state.visible">
                  <el-icon><DCaret /></el-icon
                ></span>
              </template>
            </el-popover>
          </template>
          <template #default="scope">
            {{ fileTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="useMonth" label="使用月数" />
        <el-table-column prop="depreciationPeriod" label="折旧年限(月)">
          <template #default="scope">
            {{ scope.row.depreciationPeriod * 12 }}
          </template>
        </el-table-column>
        <el-table-column prop="purAmount" align="right" label="采购金额" />
        <el-table-column prop="purTax" align="right" label="购置税(元)">
          <template #header="header">
            <span>购置税(元)</span>
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
          <template #default="scope">
            {{ scope.row.purTax || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="extraAmount" align="right" label="上牌及其他费用(元)">
          <template #default="scope">
            {{ scope.row.extraAmount || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="depreciationPrice" align="right" label="评估价格(元)" />
        <el-table-column prop="depreciationCost" align="right" label="折旧成本(元)" />
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
          :total="state.total"
        />
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { exportFile } from "@/utils/index";
import { ref, onMounted, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import { debounce } from "lodash-es";
import { getStat, getDepreciationPage } from "@/api/depreciation";
import { Depreciation } from "@/api/depreciation/types";
import { useElementSize } from "@vueuse/core";
import { Warning, DCaret } from "@element-plus/icons-vue";
const vehi = ref();
const { height } = useElementSize(vehi);
console.log(height);
const state = reactive({
  depreciationCostSum: 0,
  depreciationPriceSum: 0,
  total: 0,
  loading: false,
  picker: "",
  visible: false
});
onMounted(() => {
  getStatList();
  getDepreciationPageList();
});
const filterTag = (value: string, row: any) => {
  return row.vehicleType === value;
};
const getStatList = async () => {
  const { data } = await getStat();
  try {
    state.depreciationPriceSum = data.depreciationPriceSum;
    state.depreciationCostSum = data.depreciationCostSum;
  } catch (e: any) {
    ElMessage(e.message);
  }
};
const queryParams = ref<Depreciation>({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  vehicleType: "",
  startTime: "",
  endTime: ""
});
let depreciationPageList = ref([]);
const getDepreciationPageList = async () => {
  state.loading = true;
  const { data } = await getDepreciationPage(queryParams.value);
  try {
    depreciationPageList.value = data.list;
    state.total = data.total;
    state.loading = false;
  } catch (e: any) {
    ElMessage(e.message);
    state.loading = false;
  }
};
const changeTime = (val:any)=>{
  if(val){
    queryParams.value.startTime = val[0];
    queryParams.value.endTime = val[1];
  }else{
    queryParams.value.startTime = '';
    queryParams.value.endTime = '';
  }
  getDepreciationPageList()
}
const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const inputClick = debounce(() => {
  getDepreciationPageList();
}, 1500);
const handleQuery = () => {
  getDepreciationPageList();
};
const handleSizeChange = (value: number) => {
  queryParams.value.pageSize = value;
  getDepreciationPageList();
};
const handleCurrentChange = (value: number) => {
  queryParams.value.pageNum = value;
  getDepreciationPageList();
};

const exportClick = () => {
  exportFile(queryParams.value, "/api/v1/vehicle/depreciation/_export");
};
</script>
<style scoped lang="scss">
.set-height {
  height: calc(100% - 80px);
}
.text-color {
  color: #303030;
  font-size: 14px;
  font-weight: 600;
}
.span-color {
  color: #606060;
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  vertical-align: top;
}
.text-span {
  color: #303030;
  font-size: 16px;
  line-height: 40px;
  font-weight: 600;
  text-align: left;
}
.t-right {
  text-align: right;
}
.scope-icon {
  :deep(.el-icon) {
    vertical-align: middle;
  }
}
:deep(.el-table thead th) {
  background: #f6f9ff;
  color: #303030;
}
:deep(.el-breadcrumb__inner){
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
  }

</style>
