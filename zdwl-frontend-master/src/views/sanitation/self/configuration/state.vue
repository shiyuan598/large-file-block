<template>
  <div class="pane-content h-full" v-loading="state.loading">
    <!-- <Top></Top> -->
    <div class="map-content mt-24px">
      <div class="state-ev state4">
        <div class="pt-24px">
          <img src="@/assets/images/驱动.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >基础</span
          >
          <!-- <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px">车牌号</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              stateList.card
            }}</span>
          </div> -->
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px">VIN</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              stateList.vin
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >在线状态</span
            ><span
              :class="stateList.vehOnlineStat == 1 ? 'car-color' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterState(stateList.vehOnlineStat, ["离线", "在线"])
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px">时间戳</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              dayjs(stateList.ts_recvFromMqtt).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px">位置</span
            ><span class="breadcrumb-color-is text-14px font-bold">
              {{ stateList.longitude + "," + stateList.latitude }}
            </span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px">车速</span
            ><span class="breadcrumb-color-is text-14px font-bold"
              >{{ stateList.vehSpd }} km/h</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px">里程</span
            ><span class="breadcrumb-color-is text-14px font-bold"
              >{{ stateList.vehDistance }} km</span
            >
          </div>
        </div>
      </div>
      <div class="state-ev state1">
        <div class="pt-24px">
          <img src="@/assets/images/远控icon.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >设备</span
          >
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >作业状态</span
            ><span
              :class="stateList.oneKeyOperateStat != 0 ? 'car-green' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterState(stateList.oneKeyOperateStat, [
                  "关闭",
                  "启动过程中",
                  "作业中",
                  "结束过程中",
                ])
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >前扫刷状态</span
            ><span class="breadcrumb-color-is text-14px font-bold">
              {{ filterState(stateList.ftBrushDrop, ["升起", "降下"]) }}
            </span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >扫盘边刷水阀</span
            ><span class="text-14px font-bold">{{
              filterState(stateList.brushSwpWtrVal, ["关闭", "开启"])
            }}</span>
          </div>
          <div class="mt-10px">
            <span
              :class="stateList.vehStatRsv4 != 0 ? 'car-color' : ''"
              class="label-color w-100px inline-block text-14px"
              >垃圾倾倒</span
            ><span class="text-14px font-bold">{{
              filterState(stateList.vehStatRsv4, [
                "关闭",
                "垃圾箱举起",
                "垃圾门打开",
                "垃圾门关闭",
                "垃圾箱落下",
              ])
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >剩余电量</span
            ><span
              :class="stateList.powerBattSoc < 20 ? 'activation' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{ stateList.powerBattSoc }} %</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >剩余水量</span
            ><span
              :class="stateList.vehStatRsv9 < 20 ? 'activation' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{ stateList.vehStatRsv9 }} %</span
            >
          </div>
        </div>
      </div>
      <div class="state-ev state2">
        <div class="pt-24px">
          <img src="@/assets/images/路径.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >驾驶</span
          >

          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >控制状态</span
            ><span
              :class="stateList.vehCtrlStat != 0 ? 'car-color' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterState(stateList.vehCtrlStat, [
                  "未控制",
                  "自动驾驶",
                  "远程驾驶",
                  "遥控驾驶",
                  "紧急停车",
                  "车辆故障",
                ])
              }}</span
            >
          </div>

          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >紧急制动</span
            ><span
              :class="stateList.stopStat == 1 ? 'activation' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{ filterState(stateList.stopStat, ["关闭", "开启"]) }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >EBS制动</span
            ><span
              :class="stateList.xbrActiveCtrlMode != 0 ? 'activation' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterState(stateList.xbrActiveCtrlMode, [
                  "无制动",
                  "人工制动",
                  "RDU制动",
                  "ADU制动",
                  "未知",
                ])
              }}</span
            >
          </div>

          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >油门开度</span
            ><span class="breadcrumb-color-is text-14px font-bold">
              {{ stateList.accelPedal }} %
            </span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >制动开度</span
            ><span class="breadcrumb-color-is text-14px font-bold">
              {{ stateList.brakePedal }} %
            </span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >车轮转角</span
            ><span class="breadcrumb-color-is text-14px font-bold">
              {{ ((stateList.steerAngle * 38) / 900).toFixed(2) }} deg
            </span>
          </div>
        </div>
      </div>
      <div class="state-ev state3">
        <div class="pt-24px">
          <img src="@/assets/images/远驾控制器.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >远驾控制器(RDU)</span
          >
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >当前RDU信息</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              (stateList.rduTs &&
                dayjs(stateList.rduTs).format("YYYY-MM-DD HH:mm:ss")) ||
              "--"
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >RDU运行状态</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              stateList.rduRmtCtrlStat
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >RDU故障状态</span
            ><span class="activationbreadcrumb-color-is text-14px font-bold">{{
              stateList.rduErrorStat
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >RDU使能反馈</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              stateList.rduRmtEnableResp
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >远驾接管请求</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              stateList.aduRmtCtrlReq
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-100px inline-block text-14px"
              >整车ready状态</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              stateList.readyStat
            }}</span>
          </div>
        </div>
      </div>
      <div class="state-ev state4">
        <div class="pt-24px">
          <img src="@/assets/images/驱动.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >驱动</span
          >
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >上电状态</span
            ><span class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterKey(stateList.igStat, {
                  0: "OFF",
                  1: "ACC",
                  2: "ON",
                  3: "Start",
                  6: "ERR",
                  7: "无效值",
                })
              }}
            </span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >电机转速</span
            ><span class="breadcrumb-color-is text-14px font-bold"
              >{{ stateList.engineSpd }} rpm</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >电机扭矩</span
            ><span class="breadcrumb-color-is text-14px font-bold"
              >{{ stateList.engineTrq }} %</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >驱动线控</span
            ><span class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterKey(stateList.vcuStat, {
                  0: "手动",
                  1: "自动",
                  14: "异常",
                  15: "未知",
                })
              }}
            </span>
          </div>

          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >实时档位</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              stateList.currentGear > 0
                ? "D"
                : stateList.currentGear < 0
                ? "R"
                : "N"
            }}</span>
          </div>
          <div class="mt-10px">
            <span class="label-color w-80px inline-block text-14px"
              >MCU电机</span
            ><span class="breadcrumb-color-is text-14px font-bold">{{
              filterKey(stateList.mcuSysStat, {
                0: "未激活",
                1: "上电状态",
                2: "随动状态",
                3: "正常状态",
                4: "限制状态",
                5: "故障状态",
                6: "下电状态",
                15: "未知状态",
              })
            }}</span>
          </div>
        </div>
      </div>
      <div class="state-ev state5">
        <div class="pt-24px">
          <img src="@/assets/images/制动.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >车灯</span
          >
          <div class="mt-10px">
            <span class="label-color w-128px inline-block text-14px"
              >左转灯</span
            ><span
              :class="stateList.leftTurnLight != 0 ? 'car-color' : ''"
              class="text-14px font-bold"
              >{{
                filterKey(stateList.leftTurnLight, {
                  0: "关闭",
                  1: "开启",
                  2: "预留",
                  3: "未知",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-128px inline-block text-14px"
              >右转灯</span
            ><span
              :class="stateList.rightTurnLight != 0 ? 'car-color' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterKey(stateList.rightTurnLight, {
                  0: "关闭",
                  1: "开启",
                  2: "预留",
                  3: "未知",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-128px inline-block text-14px"
              >制动灯状态</span
            ><span
              class="breadcrumb-color-is text-14px font-bold"
              :class="stateList.brakeLight == 1 ? 'activation' : ''"
              >{{
                filterKey(stateList.brakeLight, {
                  0: "关闭",
                  1: "开启",
                  2: "预留",
                  3: "未知",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-128px inline-block text-14px"
              >近光灯状态</span
            ><span
              :class="stateList.lowBeam != 0 ? 'car-color' : ''"
              class="text-14px font-bold"
              >{{
                filterKey(stateList.lowBeam, {
                  0: "关闭",
                  1: "开启",
                  2: "预留",
                  3: "未知",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-128px inline-block text-14px"
              >倒车灯状态</span
            ><span
              :class="stateList.backLight != 0 ? 'car-color' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterKey(stateList.backLight, {
                  0: "关闭",
                  1: "开启",
                  2: "预留",
                  3: "未知",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-128px inline-block text-14px"
              >危险警报灯</span
            ><span
              class="breadcrumb-color-is text-14px font-bold"
              :class="stateList.hazardLight == 1 ? 'activation' : ''"
              >{{
                filterKey(stateList.hazardLight, {
                  0: "关闭",
                  1: "开启",
                  2: "预留",
                  3: "未知",
                })
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="state-ev state6">
        <div class="pt-24px">
          <img src="@/assets/images/转向.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >状态监控</span
          >
          <div class="mt-10px">
            <span class="label-color w-140px inline-block text-14px"
              >接管请求</span
            ><span
              :class="stateList.takeoverReq != 0 ? 'activation' : ''"
              class="breadcrumb-color-is text-14px font-bold"
              >{{
                filterKey(stateList.takeoverReq, {
                  0: "关闭",
                  1: "常规请求",
                  2: "紧急请求",
                  3: "未知",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-140px inline-block text-14px"
              >MCU故障状态</span
            ><span
              :class="stateList.mcuFailureStat != 0 ? 'activation' : ''"
              class="text-14px font-bold"
              >{{
                filterKey(stateList.mcuFailureStat, {
                  0: "正常",
                  1: "一级故障",
                  2: "二级故障",
                  3: "三级故障",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-140px inline-block text-14px"
              >HCU系统状态</span
            ><span
              :class="stateList.hcuSysStat != 0 ? 'activation' : ''"
              class="text-14px font-bold"
              >{{
                filterKey(stateList.hcuSysStat, {
                  0: "正常",
                  1: "一级故障",
                  2: "二级故障",
                  3: "三级故障",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-140px inline-block text-14px"
              >高压系统状态</span
            ><span
              :class="stateList.highVoltSysStat != 0 ? 'activation' : ''"
              class="text-14px font-bold"
              >{{
                filterKey(stateList.highVoltSysStat, {
                  0: "正常",
                  1: "一级故障",
                  2: "二级故障",
                  3: "三级故障",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-140px inline-block text-14px"
              >EBS故障灯</span
            ><span
              :class="stateList.ebsWarnSignal != 0 ? 'activation' : ''"
              class="text-14px font-bold"
              >{{
                filterKey(stateList.ebsWarnSignal, {
                  0: "正常",
                  1: "故障",
                  2: "无状态",
                })
              }}</span
            >
          </div>
          <div class="mt-10px">
            <span class="label-color w-140px inline-block text-14px"
              >EPB驻车故障</span
            ><span
              :class="stateList.epbWarnSignal != 0 ? 'activation' : ''"
              class="text-14px font-bold"
              >{{
                filterKey(stateList.epbWarnSignal, {
                  0: "正常",
                  1: "故障",
                  2: "无状态",
                })
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="state-ev version">
        <img  class="mt-24px" src="@/assets/images/软件版本.svg" /><span
            class="align-text-bottom breadcrumb-color-is font-bold text-18px ml-10px"
            >软件版本</span
          >
        <div class="version-content">
         
          <div>
            <div class="mt-14px version-color font-bold w-100px inline-block text-14px"
              >当前版本</div
            ><div class="version-color text-12px mt-5px">{{
              stateList.vehStatRsv26
            }}</div>
          </div>
          <div class="">
            <span class="mt-14px version-color font-bold w-100px inline-block text-14px"
              >升级版本</span
            ><div v-loading="state.otaLoding" class="version-color text-12px mt-5px">
              <el-select
                placeholder="选择升级版本"
                style="width: 100%;"
                :title="state.curVersion"
                v-model="state.curVersion"
                size="small"
              >
                <el-option v-for="item in otaListData" :key="item" :label="item" :value="item" />
              </el-select>
              <span class="renew ml-4px"></span>
            </div>
          </div>
          <div>
            <div class="mt-14px version-color font-bold w-100px inline-block text-14px"
              >最新进度</div
            ><div class="version-color text-12px mt-5px">{{
              stateList.otaResp
            }}</div>
          </div>
          <el-button class="w-100% mt-4px" type="primary" @click="renewClick">立即更新</el-button>
        </div>
      </div>
    </div>
    <!-- <Bottom></Bottom> -->
  </div>
</template>
<script setup lang="ts">
// import Top from "./top.vue";
import Bottom from "./bottom.vue";
import { defineExpose, onMounted, inject, watch } from "vue";
import { InjectList, StateCar, RDU_type } from "@/api/sanitation/type";
import { putRouter, postRdu, getRouter, otaList, otaUpdate } from "@/api/sanitation/index";
import dayjs from "dayjs";
const interList = <InjectList>inject("injectList");
const stateList = ref<StateCar>({
  // VIN
  vin: "",
  // 在线状态
  vehOnlineStat: "",
  // 时间戳
  ts_recvFromMqtt: "",
  // 经度
  longitude: 0,
  // 纬度
  latitude: 0,
  // 车速
  vehSpd: 0,
  // 里程
  vehDistance: 0,
  // 作业状态
  oneKeyOperateStat: null,
  // 前边刷状态
  ftBrushDrop: null,
  // 扫盘边刷水阀
  brushSwpWtrVal: null,
  // 垃圾倾倒
  vehStatRsv4: null,
  // 剩余电量
  powerBattSoc: null,
  // 剩余水量
  vehStatRsv9: null,
  // 控制状态
  vehCtrlStat: null,
  // 紧急制动
  stopStat: null,
  // EBS制动
  xbrActiveCtrlMode: null,
  // 油门开度
  accelPedal: null,
  // brakePedal
  brakePedal: null,
  // 车轮转角
  steerAngle: null,

  // RDU连接状态
  rduConnect: null,
  // 整车上电状态
  igStat: null,
  // 电机转速
  engineSpd: null,
  // 电机扭矩
  engineTrq: null,
  // 驱动线控
  vcuStat: null,

  // 实时档位
  currentGear: null,
  // MCU电机
  mcuSysStat: null,
  // 左转灯
  leftTurnLight: null,
  // 右转灯
  rightTurnLight: null,
  // 制动灯状态
  brakeLight: null,
  // 近光灯状态
  lowBeam: null,
  // 倒车灯状态
  backLight: null,
  // 危险警报灯
  hazardLight: null,
  // takeoverReq
  takeoverReq: null,
  // MCU故障状态
  mcuFailureStat: null,
  // HCU系统状态
  hcuSysStat: null,
  // 高压系统状态
  highVoltSysStat: null,
  // EBS故障灯
  ebsWarnSignal: null,
  // EPB驻车故障
  epbWarnSignal: null,
  // RDU运行状态
  rduRmtCtrlStat: null,
  // RDU故障状态
  rduErrorStat: null,
  // RDU使能反馈
  rduRmtEnableResp: null,
  // 远驾接管请求
  aduRmtCtrlReq: null,
  // 整车ready状态
  readyStat: null,
  // 当前RDU信息时间戳
  rduTs: null,
  //  当前版本
  vehStatRsv26: null,
  // 最新进度
  otaResp: null,
});
const injectStateList = <InjectList>inject("stateList");
watch(
  () => injectStateList.value,
  (newVal: any, oldVal: undefined) => {
    stateList.value = newVal;
  },

  { deep: true }
);
const state = reactive({
  loading: true,
  curVersion: null,
  otaLoding: false,
});
onMounted(async () => {
  //  getStatus();
  getOtaList(injectStateList.value.card);
  state.loading = false;
});
const filterState = (data: number, Arr: [string]) => {
  return Arr[data];
};
const filterKey = (data: number, obj: [string]) => {
  return obj[data];
};
const otaListData = ref([]);
const getOtaList = async (id: string) => {
  state.otaLoding = true;
  try{
    const { data } = await otaList(id);
    otaListData.value = data;
    state.otaLoding = false;
  }catch(e:any){
    ElMessage.error(e.message);
    state.otaLoding = false;
  }
  
};
const renewClick = async()=>{
  let params = {
    vehicleCard: stateList.value.card,
    updVersion: state.curVersion,
    curVersion: stateList.value.vehStatRsv26,
  }
 
  try{
    const { data} = await otaUpdate(params);
    ElMessage.success('操作成功')
  }catch(e:any){
    ElMessage.error(e.message);
  }
}
const getStatus = async () => {
  try {
    const { data } = await getRouter(
      "/api/v1/ems/vehicleRouteSetting/status/",
      interList.value.card
    );
    stateList.value = data;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
const getRdu = async () => {
  try {
    const { data } = await postRdu({ vehVin: interList.value.vin });
    RDU_list = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
defineExpose({
  getOtaList,
});
onUnmounted(() => {
  // clearInterval(setTime);
});
</script>
<style lang="scss" scoped>
.map-content {
  height: calc(100% - 56px);
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fill, 300px);
  justify-content: space-between;
  overflow: auto;
}
.state-ev {
  width: 300px;
  height: 302px;
  padding-left: 24px;
}
.state1 {
  background: url("@/assets/images/远驾背景.png");
  background-size: cover;
}
.state2 {
  background: url("@/assets/images/驾驶背景.png");
  background-size: cover;
}
.state3 {
  background: url("@/assets/images/控制器背景.png");
  background-size: cover;
}
.state4 {
  background: url("@/assets/images/驱动背景.png");
  background-size: cover;
}
.state5 {
  background: url("@/assets/images/制动背景.png");
  background-size: cover;
}
.state6 {
  background: url("@/assets/images/转向背景.png");
  background-size: cover;
}
.version{
  background: url("@/assets/images/软件版本背景.png") top right no-repeat,rgba(50,112,255,0.1);
  position: relative;
}
.car-color {
  color: #fd8f1a;
}
.activation {
  color: #ff4d4f;
}
.car-green {
  color: #32cd32;
}
.renew{
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
}
.version-content{
  width: 278px;
  height: 228px;
  position: absolute;
  padding: 0 10px;
  bottom: 12px;
  left: 10px;
  border-radius: 3px;
  background: linear-gradient( 224deg, rgba(255,255,255,0.49) 0%, rgba(255,255,255,0.56) 26%, rgba(255,255,255,0.59) 73%, rgba(255,255,255,0.42) 100%);
}
.version-color{
  color: #303030;
}
</style>
