<template>
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
          line-height: 30px;
        "
        >当前位置：</span
      >
      <el-breadcrumb separator="-" style="display: flex; align-items: center">
        <el-breadcrumb-item :to="{ path: '/sanitation/self/configuration' }"
          ><span style="color: #8c8c8c">无人环卫</span></el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/sanitation/driving/statistics' }"
          ><span style="color: #8c8c8c">远程驾驶</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span style="color: #303030">报表统计</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="set-height" ref="vehi">
      <div class="sanitation-left">
        <div class="duration" id="main"></div>
        <div class="applyfor-list">
          <div class="title-text inline-block">远驾调度单列表</div>
          <div class="picker-position inline-block ml-26px">
            <el-date-picker
              v-model="picker"
              type="daterange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="defaultTime"
              style="width: 260px"
              @change="changePicker"
              @calendar-change="changeDate"
              @visible-change="focusDate"
              range-separator="-"
              :disabledDate="dateRangePickerOptions"
              :remote-method="remoteMethod"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </div>
          <span @click="changeMore" class="search-more cursor-pointer"
            >查看更多<el-icon class="align-middle"><ArrowRight /></el-icon
          ></span>
          <el-table
            :data="tableData"
            v-loading="state.dispatchLoading"
            size="default"
            :show-overflow-tooltip="true"
            :max-height="setHeight"
            style="width: 100%; margin-top: 16px"
          >
            <el-table-column width="200" prop="code" label="调度单编号" />
            <el-table-column width="" prop="status" label="单据状态">
              <template #default="scope">
                <span
                  class="round"
                  :class="'roundColor' + scope.row.status"
                ></span
                >{{ filterStatus(scope.row.status) }}
              </template>
            </el-table-column>
            <!-- <el-table-column width="" prop="cockpitCode" label="调度单编号" /> -->
            <el-table-column width="" prop="vehCode" label="车牌号码" />
            <el-table-column width="" prop="driverName" label="安全员" />
            <el-table-column width="" prop="cockpitCode" label="驾驶台编码" />

            <el-table-column width="" prop="rdStartTime" label="开启时间">
              <template #default="scope">
                {{ scope.row.rdStartTime || '--'}}
              </template>
            </el-table-column>
            <el-table-column width="" prop="rdEndTime" label="结束时间"
              ><template #default="scope">
                {{ scope.row.rdEndTime || '--' }}
              </template>
            </el-table-column>
            <!-- <el-table-column width="" prop="runTime" label="运行时长" /> -->
            <el-table-column align="right" label="操作" width="140">
              <template #default="scope">
                <el-button
                  key="text"
                  v-if="scope.row.status == 2"
                  type="text"
                  @click="viewClick(scope.row)"
                  >查看监控</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="sanitation-right">
        <div class="title-text mb-16px px-24px">远驾任务数量(次)</div>
        <div class="sanitation-content" v-loading="state.reportLoading">
          <div class="mb-14px px-24px" v-for="(item, index) in reportData">
            <div>
              <span class="breadcrumb-color-is ft-14px">{{ item.date }}</span>
              <span class="breadcrumb-color-is ft-14px float-right"
                >{{ item.taskCount }}次</span
              >
            </div>
            <div class="overflow-hidden h-10px">
              <div class="progress mt-4px">
                <div
                  class="progress-bar"
                  :style="`width: ${(item.taskCount / 10) * 100}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import * as echarts from "echarts";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  runtimeReport,
  taskCountReport,
  dispatchReport,
} from "@/api/sanitation";
import { Report } from "@/api/sanitation/type";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 400;
});
const router = useRouter();
let xData: any = ref([]);
let vehList: any = ref([]);
let series: any = ref([]);
const option = reactive({
  title: {
    text: "远驾工作时长(h)",
    left: 24,
    size: 14,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  legend: {
    data: vehList,
    right: 24,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  //   toolbox: {
  //     feature: {
  //       saveAsImage: {},
  //     },
  //   },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: xData,
  },
  yAxis: {
    type: "value",
  },
  series: series,
});
const state = reactive({
  loading: false,
  chartsLoding: false,
  reportLoading: false,
  dispatchLoading: false,
  dateRange: [],
  pickerMinDate: null,
});
const tableData: any = ref([]);
const reportData: any = ref([]);
const picker = ref([]);
let myChart = reactive([]);
onMounted(async () => {
  const chartDom = document.getElementById("main");
  myChart = echarts.init(chartDom);
  getReport();
  getDispatchPage();
  await getRunTime();
  option && myChart.setOption(option, true);
});
const getReport = async () => {
  state.reportLoading = true;
  try {
    const { data } = await taskCountReport(pickerParmers);
    reportData.value = data;
    state.reportLoading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.reportLoading = false;
  }
};
const getDispatchPage = async () => {
  state.dispatchLoading = true;
  try {
    const { data } = await dispatchReport(pickerParmers);
    tableData.value = data;
    state.dispatchLoading = false;
  } catch (e: any) {
    state.dispatchLoading = false;
    ElMessage.error(e.message);
  }
};
const pickerParmers: Report = reactive({
  dateFrom: "",
  dateTo: "",
});

const changePicker = async (time: any) => {
  pickerParmers.dateFrom = time && time[0];
  pickerParmers.dateTo = time && time[1];
  xData.value = [];
  vehList.value = [];
  series.value = [];
  getReport();
  getDispatchPage();
  await getRunTime();
  myChart.setOption(option, true);
};
const getRunTime = async () => {
  state.chartsLoding = true;
  try {
    const { data } = await runtimeReport(pickerParmers);

    let vehSeries: any = {};
    for (const key in data) {
      xData.value.push(key as never);
      data[key].map((n: any) => {
        if (!vehList.value.includes(n.vehCode)) {
          vehList.value.push(n.vehCode);
          vehSeries[n.vehCode] = [];
        }
      });
    }
    for (let i in vehSeries) {
      for (const key in data) {
        let list: any = data[key].filter((n: any) => n.vehCode === i);
        let number = list.length > 0 ? list[0].runTime : "0";
        vehSeries[i].push(number);
      }
    }
    for (const se in vehSeries) {
      series.value.push({
        name: se,
        type: "line",
        stack: "Total",
        data: vehSeries[se],
      });
    }
    state.chartsLoding = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.chartsLoding = false;
  }
};
const setDate = ref<any>();
const focusDate = (val: any) => {
  if (val) setDate.value = false;
};
const changeDate = (time: any) => {
  if (time[0]) {
    setDate.value = time[0];
  }
};
const dateRangePickerOptions = (date: any) => {
  if (!setDate.value) {
    return false;
  }
  const after30Days = dayjs(date).isAfter(dayjs(setDate.value).add(30, "day"));
  // 小于30天前禁用
  const before30Days = dayjs(date).isBefore(
    dayjs(setDate.value).subtract(30, "day")
  );
  return after30Days || before30Days;
};
const filterStatus = (val: any) => {
  let status = ["草稿", "已提交", "进行中"];
  return status[val];
};
const viewClick = () => {
  const pathHerf = router.resolve({
    path: "/sanitation/self/configuration",
    query: { active: "state" },
  });
  window.open(pathHerf.href, "_blank");
  // router.push({ path: '/sanitation/self/configuration',query: {active: 'state'} })
};
const changeMore = () => {
  router.push({ path: "/sanitation/driving/applyfor" });
  // window.location.href='/sanitation/driving/applyfor'
};
// return (time:any)=>{
//   if(!setDate.value){
//     return false
//   }
//   else if (time.getTime() > setDate.value) {
//   return time.getTime() >= setDate.value; //时间范围必须是时间戳

// } else {
//   return time.getTime() < setDate.value - 30 * 8.64e7; //8.64e7就是一天的时间戳 24*60*60*1000   两天之内 根据自己需求来定
// }
// }
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);
</script>
<style scoped lang="scss">
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-table:not(.el-table--border) thead .el-table__cell) {
  background: #f6f9ff;
}
.set-height {
  background: transparent;
  display: flex;
  padding: 0;
  margin: 16px;
}
.sanitation-left {
  flex: 1;
  height: 100%;
}
.sanitation-right {
  width: 250px;
  height: 100%;
  background: #ffffff;
  margin-left: 12px;
  padding: 16px 0;
}
.title-text {
  font-weight: 600;
  color: #303030;
}
.progress {
  position: relative;
  height: 4px;
  background: rgba(0, 0, 0, 0.06);
  // overflow: hidden;
}
.progress-bar {
  position: absolute;
  background: #3270ff;
  height: 4px;
}
.progress-bar::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 6px;
  background: #3270ff;
  right: 0;
  top: -1px;
}
.sanitation-content {
  height: calc(100% - 30px);
  overflow: auto;
}
.duration {
  padding: 16px 0;
  height: 308px;
  background: #fff;
}
.search-more {
  color: #606060;
  font-size: 14px;
  float: right;
}
.applyfor-list {
  height: calc(100% - 324px);
  background: #fff;
  margin-top: 16px;
  padding: 16px 24px 0;
}
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor1 {
  background: #3270ff;
}
.roundColor0 {
  background: #ffb608;
}
.roundColor2 {
  background: green;
}
</style>
