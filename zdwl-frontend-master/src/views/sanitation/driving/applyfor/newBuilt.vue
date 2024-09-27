<template>
  <div class="set-height" :v-loading="state.boxLoading">
    <div class="car-contetn">
      <div class="title-text pt-24px text-16px">选择驾驶台</div>
      <el-radio-group v-model="newSate.cockpitId" class="w-full">
        <div class="mt-14px bridge-content">
          <div
            class="bridge-ev mb-20px"
            :class="newSate.cockpitId === item.id ? 'active-box' : ''"
            @click="changeRadio(item, index)"
            :key="item.id"
            v-for="(item, index) in boxList"
          >
            <div class="">
              <el-tooltip :content="item.cockpitName" placement="top-start">
                <el-text class="w-290px" truncated>
                  <span
                    class="title-text text-15px"
                    style="line-height: 40px"
                    >{{ item.cockpitName }}</span
                  >
                  <div v-if="item.status === '忙碌'" class="busy ml-8px">
                    忙碌
                  </div>
                </el-text>
              </el-tooltip>
              <el-radio
                class="float-right"
                :disabled="item.status === '忙碌'"
                :label="item.id"
                size="large"
                >&nbsp;
              </el-radio>
            </div>
            <div>
              <span class="bridge-label">保管人名：</span>
              <span class="bridge-value">{{ item.keeper }}</span>
            </div>
            <div class="mt-8px">
              <span class="bridge-label align-bottom">备注信息：</span>
              <el-tooltip :content="item.cockpitConfig" placement="top">
                <el-text class="w-240px" truncated>
                  <span class="bridge-value">{{ item.cockpitConfig }}</span>
                </el-text>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-radio-group>
      <div class="title-text pt-10px text-16px">选择车辆</div>
      <carSwiper :newSate="newSate"></carSwiper>
      <div class="title-text pt-10px text-16px">选择安全调度员</div>
      <driverSwiper :newSate="newSate"></driverSwiper>
    </div>
  </div>
  <div class="operate">
    <el-button @click="cancellation" size="default">取消</el-button>
    <el-button
      :disabled="disable"
      type="primary"
      @click="submitForm"
      size="default"
      >确定</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import carSwiper from "./swiper/carSwiper.vue";
import driverSwiper from "./swiper/driverSwiper.vue";
import { getBoxList, dispatchAdd, dispatchUpd } from "@/api/sanitation";
import { NewSate } from "@/api/sanitation/type";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
type Item = {
  id: string;
  status: string;
  cockpitName: string;
  keeper: string;
  cockpitConfig: string;
};
const state = reactive({
  boxLoading: false,
  boxIndex: -1,
});
const newSate = reactive<NewSate>({
  driverId: "",
  driverName: "",
  vehId: "",
  vehCode: "",
  vehVin: "",
  cockpitCode: "",
  cockpitId: "",
  createBy: userStore.user.username,
});
const props = defineProps(["rowList"]);

const emit = defineEmits(["bulitClick"]);
const disable = computed(
  () =>
    newSate.driverId === "" || newSate.vehId === "" || newSate.cockpitId === ""
);
onMounted(() => {
  getStatList();
  Object.assign(newSate, props.rowList);
});

const boxList = ref<Item[]>([]);
// 列表查询
const getStatList = async () => {
  state.boxLoading = true;
  try {
    const { data } = await getBoxList();
    boxList.value = data;
    state.boxLoading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.boxLoading = false;
  }
};
const changeRadio = (val: any, index: number) => {
  if (val.status === "忙碌") return;
  // state.boxIndex = index;
  newSate.cockpitId = val.id;
  newSate.cockpitCode = val.cockpitCode;
};
const submitForm = async () => {
  try {
      newSate.id
      ? await dispatchUpd(newSate)
      : await dispatchAdd(newSate);
    ElMessage.success(newSate.id?'编辑成功':'新增成功');
    cancellation("getList");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const cancellation = (val: string) => {
  emit("bulitClick", val);
};
</script>
<style scoped lang="scss">
.set-height {
  overflow: auto;
  height: calc(100% - 144px);
  padding: 0;
}
.operate {
  position: absolute;
  width: calc(100% - 32px);
}
.title-text {
  font-weight: 600;
  color: #303030;
}
.car-contetn {
  margin: 0 36px 0;
  position: relative;
  height: 100%;
}
.bridge-ev {
  width: 362px;
  height: 114px;
  border-radius: 4px;
  border: 1px solid #e4e4e4;
  cursor: pointer;
  padding: 8px 24px;
  padding-right: 14px;
}
.bridge-label {
  font-size: 14px;
  color: #8c8c8c;
}
.bridge-value {
  font-size: 14px;
  color: #303030;
}
.bridge-content {
  display: grid;
  width: 100%;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, 362px);
}
.busy {
  width: 40px;
  height: 20px;
  background: #fee6e4;
  border-radius: 2px;
  border: 1px solid #fec1bd;
  display: inline-block;
  font-size: 12px;
  text-align: center;
  color: #ff4d4f;
}
.driver-content {
  width: 100%;
  height: 144px;
  position: relative;
}
.by-busy {
  width: 70px;
  height: 46px;
  background: #fee6e4;
  color: #ff4d4f;
  line-height: 67px;
  text-align: center;
  position: absolute;
  transform: rotateZ(-38deg);
  font-size: 12px;
  top: -20px;
  left: -26px;
}
.mySwiper-ev {
  //  height: 146px!important;
}
.active-box {
  border: 1px solid rgba(50, 112, 255, 0.5);
}
</style>
