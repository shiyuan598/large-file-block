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
            >线路信息</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-card>
          <div class="parkClass">
            <el-form
              ref="newFormRef"
              :model="newForm"
              label-width="120px"
              style="width: 100%"
              :rules="newRules"
            >
              <h4>基本信息</h4>
              <el-divider style="margin: 0"></el-divider>
              <el-row justify="space-between">
                <el-col :span="7">
                  <el-form-item
                    label="路线名称"
                    prop="name"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.name"
                      placeholder="请选择路线名称"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="客户名称"
                    prop="customer"
                    style="width: 100%"
                  >
                    <el-select
                      v-model="newForm.customer"
                      size="default"
                      placeholder="请选择项目名称"
                      style="align-items: center; width: 100%"
                      @change="customerChange"
                      clearable
                    >
                      <el-option
                        v-for="item in customerNameOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="项目名称"
                    prop="project"
                    style="width: 100%"
                  >
                    <el-select
                      v-model="newForm.project"
                      size="default"
                      placeholder="请选择项目名称"
                      style="align-items: center; width: 100%"
                      @change="projectChange"
                      clearable
                    >
                      <el-option
                        v-for="item in projectNameOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row justify="space-between">
                <el-col :span="7">
                  <el-form-item
                    label="标准里程"
                    prop="upMileage"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.upMileage"
                      placeholder="请输入标准里程"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>KM</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="标准时效"
                    prop="upTime"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.upTime"
                      placeholder="请输入标准时效"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>分钟</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="路线运费"
                    prop="upAmount"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.upAmount"
                      placeholder="请输入路线运费"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>元</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row justify="space-between">
                <el-col :span="7">
                  <el-form-item
                    label="高速费用"
                    prop="upHighAmount"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.upHighAmount"
                      placeholder="请输入高速费用"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>元</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="标准油量"
                    prop="upFuelNum"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.upFuelNum"
                      placeholder="请输入标准油量"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>L</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="百公里油耗"
                    prop="fuelConsumption"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.fuelConsumption"
                      placeholder="请输入百公里油耗"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>L</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row justify="space-between">
                <el-col :span="7">
                  <el-form-item
                    label="尿素数量"
                    prop="upUreaNum"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.upUreaNum"
                      placeholder="请输入尿素数量"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>KG</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="单双驾驶"
                    prop="upDriverType"
                    style="width: 100%"
                  >
                    <el-radio-group v-model="newForm.upDriverType" class="ml-4">
                      <el-radio label="1">单驾</el-radio>
                      <el-radio label="2">双驾</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="主驾标准费用"
                    prop="upFirstDriverAmount"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="newForm.upFirstDriverAmount"
                      placeholder="请输入主驾标准费用"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>元</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="副驾标准费用"
                    prop="upSecondDriverAmount"
                    style="width: 100%"
                    v-if="newForm.upDriverType == 2"
                  >
                    <el-input
                      v-model="newForm.upSecondDriverAmount"
                      placeholder="请输入副驾标准费用"
                      style="width: 100%"
                    >
                      <template #append>
                        <span>元</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <h4>路线信息</h4>
              <el-divider style="margin: 0"></el-divider>
              <el-row justify="space-between">
                <el-col :span="7">
                  <el-form-item
                    label="起运地点"
                    prop="startStation"
                    style="width: 100%"
                  >
                    <el-select
                      v-model="newForm.startStation"
                      size="default"
                      placeholder="请选择起运地点"
                      style="align-items: center; width: 100%"
                      @change="startStationChange"
                      clearable
                    >
                      <el-option
                        v-for="item in startLocationOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    label="目的地点"
                    prop="endStation"
                    style="width: 100%"
                  >
                    <el-select
                      v-model="newForm.endStation"
                      size="default"
                      placeholder="请选择目的地点"
                      style="align-items: center; width: 100%"
                      @change="endStationChange"
                      clearable
                    >
                      <el-option
                        v-for="item in endLocationOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7"></el-col>
              </el-row>
              <el-row justify="space-between">
                <div style="max-width: 32.4%; flex: 0 0 32.4%">
                  <el-form-item label="经停地点" style="width: 100%">
                    <div
                      v-for="(domain, index) in state.waypoints"
                      style="width: 100%; display: flex"
                    >
                      <el-select
                        v-model="domain.name"
                        size="default"
                        placeholder="请选择经停地点"
                        style="
                          align-items: center;
                          margin-bottom: 20px;
                          width: 100%;
                        "
                        @change="waypointsChange"
                        clearable
                      >
                        <el-option
                          v-for="item in stoppingPlaceOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                      <el-button
                        key="plain"
                        text
                        :icon="SortDown"
                        style="padding: 0; margin-left: 10px"
                        @click="sortDown(domain)"
                      ></el-button>
                      <el-button
                        key="plain"
                        text
                        :icon="SortUp"
                        style="padding: 0; margin-left: 0px !important"
                        @click="sortUp(domain)"
                      ></el-button>
                      <el-button
                        key="plain"
                        text
                        :icon="Delete"
                        style="padding: 0; margin-left: 0px !important"
                        @click="delDomain(domain)"
                      ></el-button>
                    </div>
                    <el-button
                      link
                      key="plain"
                      style="border: 1px dashed gray; width: 87%; height: 30px"
                      :icon="Plus"
                      @click="addDomain"
                      >添加途经点</el-button
                    >
                    <span
                      style="
                        height: 20px;
                        font-size: 14px;
                        font-family: PingFangSC, PingFang SC;
                        font-weight: 400;
                        color: #8c8c8c;
                        line-height: 20px;
                        padding-top: 8px;
                      "
                      >请按经停顺序从上往下添加，最多添加5个</span
                    >
                  </el-form-item>
                </div>
              </el-row>
            </el-form>
          </div>
          <el-divider />
          <div class="aline-right">
            <el-button @click="cancelInfo">取消</el-button>
            <el-button
              type="primary"
              @click="confirmInfo"
              :disabled="getDisabled"
              >确定</el-button
            >
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineProps, onMounted, computed, reactive, ref } from "vue";
import {
  Calendar,
  Plus,
  Search,
  SortDown,
  SortUp,
  Delete,
} from "@element-plus/icons-vue";
import { getStationList } from "@/api/highSpeedLine/locationRoute/station/index";
import {
  addLineinfo,
  updateLineinfo,
} from "@/api/highSpeedLine/locationRoute/lineInfo/index";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { WarningFilled, Close } from "@element-plus/icons-vue";
import { getInfoList } from "@/api/highSpeedLine/project/info/index";
import { getCooperateList } from "@/api/highSpeedLine/project/cooperate/index";
import dayjs from "dayjs";
import router from "@/router";
const props = defineProps({
  data: {},
});
const emit = defineEmits({
  returnInfo: null,
});
const total = ref(0);
const queryFormRef = ref(ElForm);

const state = reactive({
  showData: false,
  componentList: [],
  tableData: [],
  waypoints: [] as any,
  dialogTitle: "",
  dialogAction: "",
  deleteId: "",
  time: "",
  startTime: "",
  endTime: "",
  title: "高速干线 - 地点线路 - 线路信息",
});
const startLocationOptions = ref([] as any[]);
const endLocationOptions = ref([] as any[]);
const stoppingPlaceOptions = ref([] as any[]);
const cardOptions = ref([] as any[]);
const projectNameOptions = ref([] as any[]);
const customerNameOptions = ref([] as any[]);
const newFormRef = ref();
const getDisabled = computed(
  () =>
    !hasNonEmptyValues(newForm, [
      "waypointCodes",
      "waypoints",
      "upSecondDriverAmount",
    ])
);
interface RuleForm {
  id: number;
  name: string;
  customer: string;
  customerCode: string;
  project: string;
  projectCode: string;
  upAmount: string;
  upMileage: string;
  upTime: string;
  upDriverType: string;
  upFirstDriverAmount: string;
  upSecondDriverAmount: string;
  upFuelNum: string;
  upUreaNum: string;
  upHighAmount: string;
  startStation: string;
  startCode: string;
  endStation: string;
  endCode: string;
  waypoints: string;
  waypointCodes: string;
  fuelConsumption: string;
}

const newForm = reactive<RuleForm>({
  id: 0,
  name: "",
  customer: "",
  customerCode: "",
  project: "",
  projectCode: "",
  upAmount: "",
  upMileage: "",
  upTime: "",
  upDriverType: "1",
  upFirstDriverAmount: "",
  upSecondDriverAmount: "",
  upFuelNum: "",
  upUreaNum: "",
  upHighAmount: "",
  startStation: "",
  startCode: "",
  endStation: "",
  endCode: "",
  waypoints: "",
  waypointCodes: "",
  fuelConsumption: "",
});

const newRules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入线路名称", trigger: "blur" }],
  customer: [{ required: true, message: "请输入客户全称", trigger: "blur" }],
  project: [{ required: true, message: "请输入项目", trigger: "blur" }],
  upAmount: [{ required: true, message: "请输入标准运费", trigger: "blur" }],
  upMileage: [{ required: true, message: "请输入标准里程", trigger: "blur" }],
  upTime: [
    { required: true, message: "请输入标准时效(小时)", trigger: "blur" },
  ],
  upDriverType: [{ required: true, message: "请选择单双驾", trigger: "blur" }],
  upFirstDriverAmount: [
    { required: true, message: "请输入标准主驾费用", trigger: "blur" },
  ],
  upSecondDriverAmount: [
    { required: true, message: "请输入标准副驾费用", trigger: "blur" },
  ],
  upFuelNum: [{ required: true, message: "请输入标准油量", trigger: "blur" }],
  fuelConsumption: [
    { required: true, message: "请输入百公里油耗", trigger: "blur" },
  ],
  upUreaNum: [{ required: true, message: "请输入标准尿素量", trigger: "blur" }],
  upHighAmount: [
    { required: true, message: "请输入标准高速费", trigger: "blur" },
  ],
  startStation: [{ required: true, message: "请输入出发地", trigger: "blur" }],
  endStation: [{ required: true, message: "请输入目的地", trigger: "blur" }],
  waypoints: [{ required: true, message: "请输入途经点", trigger: "blur" }],
});

const loading = ref(false);

const resetForm = () => {
  newFormRef.value.resetFields();
};

const cancelInfo = () => {
  emit("returnInfo");
};

const addDomain = () => {
  if (state.waypoints.length < 5) {
    state.waypoints.push({
      id: "",
      key: Date.now(),
      name: "",
    });
  } else {
    ElMessage.warning("最多只能添加五个途经点");
  }
};

const delDomain = (item: any) => {
  const index = state.waypoints.indexOf(item);
  if (index !== -1) {
    state.waypoints.splice(index, 1);
  }
};

const sortDown = (item: any) => {
  const index = state.waypoints.indexOf(item);
  if (index !== -1) {
    if (index < state.waypoints.length - 1) {
      const temp = state.waypoints[index];
      state.waypoints[index] = state.waypoints[index + 1];
      state.waypoints[index + 1] = temp;
    }
  }
};

const sortUp = (item: any) => {
  const index = state.waypoints.indexOf(item);
  if (index !== -1) {
    if (index > 0) {
      const temp = state.waypoints[index];
      state.waypoints[index] = state.waypoints[index - 1];
      state.waypoints[index - 1] = temp;
    }
  }
};

const customerChange = (e: any) => {
  let o = customerNameOptions.value.find((item) => item.name == e);
  newForm.customer = o.name;
  newForm.customerCode = o.id;
};

const startStationChange = (e: any) => {
  let o = startLocationOptions.value.find((item) => item.name == e);
  newForm.startStation = o.name;
  newForm.startCode = o.id;
};

const endStationChange = (e: any) => {
  let o = endLocationOptions.value.find((item) => item.name == e);
  newForm.endStation = o.name;
  newForm.endCode = o.id;
};

const waypointsChange = (e: any) => {
  let o = stoppingPlaceOptions.value.find((item) => item.name == e);
  for (let i: number = 0; i < state.waypoints.length; i++) {
    if (state.waypoints[i].name === o.name) {
      state.waypoints[i].id = o.id;
      break;
    }
  }
};

const hasNonEmptyValues = (objList: any, excludeColumn: any[]) => {
  let obj = {...objList}
  if (obj.hasOwnProperty(excludeColumn[0])) {
    excludeColumn.forEach((item: string) => {
      delete obj[item];
    });
  }
  for (let key in obj) {
    if (!obj.hasOwnProperty(key) || obj[key] === "") {
      return false;
    }
  }
  return true;
};

const confirmInfo = () => {
  newForm.waypointCodes = "";
  newForm.waypoints = "";
  state.waypoints.forEach((item: any) => {
    newForm.waypointCodes += item.id + ",";
    newForm.waypoints += item.name + ",";
  });
  newForm.waypoints = newForm.waypoints.slice(0, -1);
  newForm.waypointCodes = newForm.waypointCodes.slice(0, -1);
  newForm.upSecondDriverAmount =
    newForm.upDriverType == "1" ? null : newForm.upSecondDriverAmount;
  if (props.data.name) {
    updateLineinfo(newForm.id, newForm)
      .then((res: any) => {
        ElMessage.success("修改成功");
      })
      .catch(() => {
        ElMessage.error("修改失败");
      })
      .finally(() => {
        cancelInfo();
      });
  } else {
    addLineinfo(newForm)
      .then((res: any) => {
        ElMessage.success("添加成功");
      })
      .catch(() => {
        ElMessage.error("添加失败");
      })
      .finally(() => {
        cancelInfo();
      });
  }
};

const projectChange = (e: any) => {
  let p = projectNameOptions.value.find((item) => item.name == e);
  newForm.project = p.name;
  newForm.projectCode = p.id.toString();
  newForm.startCode = "";
  newForm.startStation = "";
  newForm.endCode = "";
  newForm.endStation = "";
  newForm.waypointCodes = "";
  newForm.waypoints = "";
  state.waypoints = [];
  getStationList({ projectCode: newForm.projectCode }).then((rs) => {
    startLocationOptions.value = [];
    Object.assign(startLocationOptions.value, rs.data);
    endLocationOptions.value = [];
    Object.assign(endLocationOptions.value, rs.data);
    stoppingPlaceOptions.value = [];
    Object.assign(stoppingPlaceOptions.value, rs.data);
  });
};

const projectList = async () => {
  await getInfoList({}).then((rs) => {
    Object.assign(projectNameOptions.value, rs.data);
  });
};

const customerList = async () => {
  await getCooperateList({}).then((rs) => {
    Object.assign(customerNameOptions.value, rs.data);
  });
};

const deepCopy = (obj: any) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const newObj: any = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (newForm.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }
  return newObj;
};

onMounted(async () => {
  resetForm();
  await projectList();
  await customerList();
  if (props.data.name) {
    projectChange(props.data.project);
    customerChange(props.data.customer);
    console.log(props.data);
    Object.assign(newForm, deepCopy(props.data));
    newForm.upDriverType = newForm.upDriverType.toString();
    let s = props.data.waypoints.split(",");
    let ids = props.data.waypointCodes.split(",");
    state.waypoints = [];
    s.forEach((item: any, index: string | number) => {
      state.waypoints.push({
        id: ids[index],
        name: item,
      });
    });
  }
});
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
  .aline-right {
    text-align: right;
    float: right;
    padding-bottom: 16px;
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
}
</style>
