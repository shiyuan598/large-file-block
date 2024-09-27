<template>
  <div class="swiper-content mt-14px" v-loading="state.vehLoading">
    <swiper
      :breakpoints="{
        320: {
          // 当屏幕宽度大于等于320
          slidesPerView: 1,
          spaceBetween: 22,
        },
        780: {
          slidesPerView: 2,
          spaceBetween: 22,
          grid: {
            rows: 2,
            fill: 'row',
          },
        },
        1080: {
          slidesPerView: 3,
          spaceBetween: 22,
          grid: {
            rows: 2,
            fill: 'row',
          },
        },
        1360: {
          slidesPerView: 4,
          spaceBetween: 22,
          grid: {
            rows: 2,
            fill: 'row',
          },
        },
        1600: {
          slidesPerView: 5,
          spaceBetween: 22,
          grid: {
            rows: 2,
            fill: 'row',
          },
        },
        2000: {
          slidesPerView: 8,
          spaceBetween: 22,
          grid: {
            rows: 2,
            fill: 'row',
          },
        },
      }"
      :spaceBetween="16"
      :modules="modules"
      :navigation="{
        nextEl: '.car-swiper-right',
        prevEl: '.car-swiper-left',
      }"
      class="mt-10px"
      :pagination="{
        clickable: true,
      }"
    >
      <swiper-slide
        class="slide-ev"
        v-for="(item, index) in carList"
        :key="item.id"
      >
        <div
          class="flex-ev-top"
          @click="carClick(item, index)"
          :class="
            item.status === '忙碌'
              ? 'disabled-status'
              : prop.newSate.vehId === item.id
              ? 'active-car'
              : ''
          "
        >
          <div v-if="item.status === '忙碌'" class="by-busy">忙碌</div>
          <div class="picture"></div>
          <div class="mt-2px flex-right">
            <div class="flex-license mt-15px">
              {{ item.vehName }}
              <el-icon
                  v-if="prop.newSate.vehId === item.id"
                  class="icon-span"
                  color="#3270FF"
                  ><SuccessFilled /></el-icon
                ><span v-else class="button-icon"></span>
            </div>
            <div>
              <span class="bridge-label">车牌号码：</span
              ><span class="bridge-label">{{ item.vehCode }}</span>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev car-swiper-left"></div>
    <div class="swiper-button-next car-swiper-right"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { listVeh } from "@/api/sanitation";
import { Swiper, SwiperSlide } from "swiper/vue";
import { SuccessFilled } from "@element-plus/icons-vue";
import { Grid, Pagination, Navigation } from "swiper/modules";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
type Item = {
  id: string,
  status: string,
  vehCode: string,
  vehName: string,
}
const prop = defineProps(['newSate']);
const state = reactive({
  carIndex: -1,
  vehLoading: false,
});
onMounted(() => {
  getListVeh();
});
const carList = ref<Item[]>([]);
const getListVeh = async () => {
  state.vehLoading = true;
  try {
    const { data } = await listVeh();
    carList.value = data;
    state.vehLoading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.vehLoading = false;
  }
};

const carClick = (item: any, index: number) => {
  if(item.status==='忙碌') return;
  // state.carIndex = index;
  prop.newSate.vehId = item.id;
  prop.newSate.vehCode = item.vehCode;
  prop.newSate.vehVin = item.vehVin;
};
const modules = [Grid, Navigation];
</script>
<style scoped lang="scss">
.flex-license {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #303030;
  line-height: 22px;
  text-align: left;
}
.flex-types {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #606060;
  line-height: 22px;
  text-align: left;
  margin-top: 6px;
  width: 100%;
}
.flex-ev-top {
  position: relative;
  overflow: hidden;
  height: 84px;
  border-radius: 4px;
  border: 1px solid #e4e4e4;
  cursor: pointer;
  display: flex;
}
.picture {
  width: 56px;
  height: 56px;
  background: url("@/assets/images/车02.png") no-repeat center;
  background-size: contain;
  margin: 14px 12px 0 24px;
}
.button-icon {
  width: 14px;
  height: 14px;
  display: inline-block;
  float: right;
  border-radius: 50%;
  border: 1px solid #d0d0d1;
}
.flex-right {
  flex: 1;
  padding-right: 18px;
}
.swiper {
  width: 100%;
  height: 204px;
  margin-left: auto;
  margin-right: auto;
}
.slide-ev {
  width: 268px;
  height: 84px !important;
  border-radius: 4px;

  margin-top: 0 !important;
}
.swiper-content {
  width: 100%;
  height: 204px;
  position: relative;
}
.car-swiper-right::before {
  content: "";
  width: 60px;
  height: 188px;
  background: #fff;
  position: absolute;
  top: -80px;
  right: -15px;
}
.car-swiper-left::before {
  content: "";
  width: 60px;
  height: 188px;
  background: #fff;
  position: absolute;
  top: -80px;
  left: -15px;
}
.car-swiper-left::after,
.car-swiper-right::after {
  font-size: 20px;
  z-index: 2;
  color: #8c8c8c;
  width: 38px;
  height: 38px;
  background: #ffffff;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
  border-radius: 19px;
  border: 1px solid #e4e4e4;
  top: 72px;
  z-index: 2;
  text-align: center;
  line-height: 38px;
}
.car-swiper-left {
  left: 10px;
  width: 38px;
  height: 38px;
}
.car-swiper-right {
  right: 10px;
  width: 38px;
  height: 38px;
}
:deep(.swiper-pagination) {
  bottom: -6px;
}
.active-car {
  background: rgba(50, 112, 255, 0.07);
  border: 1px solid rgba(50, 112, 255, 0.5);
  .button-icon {
    // background: #3270FF;
  }
}
.icon-span {
  float: right;
}
.mySwiper {
  height: 146px;
}
.bridge-label {
  font-size: 14px;
  color: #8c8c8c;
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
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0;
}
.disabled-status {
  cursor: text;
  .button-icon{
    background: #f4f4f5;
  }
}
</style>
