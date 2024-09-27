<template>
  <div class="swiper-content mt-14px" v-loading="state.driverLoading">
    <swiper
      :breakpoints="{
        320: {
          // 当屏幕宽度大于等于320
          slidesPerView: 2,
        },
        780: {
          slidesPerView: 4,
        },
        1080: {
          slidesPerView: 7,
        },
        1360: {
          slidesPerView: 8,
        },
        1600: {
          slidesPerView: 10,
        },
        1920: {
          slidesPerView: 11,
        },
        2000: {
          slidesPerView: 15,
        },
      }"
      spaceBetween="16"
      :modules="modules"
      :navigation="{
        nextEl: '.driver-swiper-right',
        prevEl: '.driver-swiper-left',
      }"
      :pagination="{
        clickable: true,
      }"
      class="mySwiper mt-10px"
    >
      <swiper-slide
        class="mySwiper-ev"
        @click="driverClick(item, index)"
        :class="item.status === '忙碌' ? 'disabled' : ''"
        v-for="(item, index) in driverList"
        :key="item.id"
      >
        <div class="filled-icon">
          <el-icon
            v-if="prop.newSate.driverId === item.id"
            class="icon-span"
            color="#3270FF"
            ><SuccessFilled /></el-icon
          ><span v-else class="button-icon"></span>
        </div>
        <div
          class="driver-ev text-center"
          :class="prop.newSate.driverId === item.id ? 'active-driver' : ''"
        >
          <div class="driver-img">
            <div class="driver-busy" v-if="item.status === '忙碌'">忙碌</div>
          </div>
          <div class="driver-name">{{ item.name }}</div>
          <span class="bridge-label">{{ item.phone }}</span>
        </div>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev driver-swiper-left"></div>
    <div class="swiper-button-next driver-swiper-right"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { SuccessFilled } from "@element-plus/icons-vue";
import { Grid, Navigation } from "swiper/modules";
import { listDriver } from "@/api/sanitation";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

type Item = {
  id: string,
  status: string;
  name: string;
  phone: string;
};
const prop = defineProps(['newSate']);
const state = reactive({
  driverIndex: -1,
  driverLoading: false,
});
onMounted(() => {
  getListDriver();
});
const driverList = ref<Item[]>([]);
const getListDriver = async () => {
  state.driverLoading = true;
  try {
    const { data } = await listDriver();
    state.driverLoading = false;
    data.map((n: any) => {
      let list = n.driverName.split(" ");
      n.name = list[0];
      n.phone = list[1] || "";
    });
    driverList.value = data;
  } catch (e: any) {
    state.driverLoading = false;
    ElMessage.error(e.message);
  }
};

const driverClick = (item: any, index: number) => {
  if (item.status === "忙碌") return;
  // state.driverIndex = index;
  prop.newSate.driverId = item.id;
  prop.newSate.driverName = item.driverName;
};
const modules = [Grid, Navigation];
</script>
<style scoped lang="scss">
.swiper {
  width: 100%;
  height: 144px;
  margin-left: auto;
  margin-right: auto;
}
.slide-ev {
  width: 134px;
  height: 144px !important;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0 !important;
}
.swiper-content {
  width: 100%;
  height: 144px;
  position: relative;
}
.driver-swiper-right::before {
  content: "";
  width: 60px;
  height: 146px;
  background: #fff;
  position: absolute;
  top: -52px;
  right: -15px;
}
.driver-swiper-left::before {
  content: "";
  width: 60px;
  height: 146px;
  background: #fff;
  position: absolute;
  top: -52px;
  left: -15px;
}
.driver-swiper-left::after,
.driver-swiper-right::after {
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
.driver-swiper-left {
  left: 10px;
  width: 38px;
  height: 38px;
}
.driver-swiper-right {
  right: 10px;
  width: 38px;
  height: 38px;
}
:deep(.swiper-pagination) {
  bottom: -6px;
}
.driver-ev {
  height: 142px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #f0f0f1;
}

.driver-img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin: 16px auto;
  background: url("@/assets/images/头像.png") no-repeat center;
  background-size: contain;
  position: relative;
}
.driver-name {
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  color: #313233;
}
.bridge-label {
  font-size: 14px;
  color: #8c8c8c;
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0;
}
.filled-icon {
  position: absolute;
  right: 14px;
  top: 12px;
}
.button-icon {
  width: 14px;
  height: 14px;
  display: inline-block;
  float: right;
  border-radius: 50%;
  border: 1px solid #d0d0d1;
}
.mySwiper-ev {
  cursor: pointer;
}
.disabled {
  cursor: text;
  .button-icon {
    background: #f4f4f5;
  }
}
.active-driver {
  // background: rgba(50, 112, 255, 0.07);
  border: 1px solid rgba(50, 112, 255, 0.5);
  .button-icon {
    // background: #3270FF;
  }
}
.driver-busy {
  width: 44px;
  height: 20px;
  background: #fee6e4;
  border-radius: 9px;
  border: 1px solid #fec1bd;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #ff4d4f;
  position: absolute;
  bottom: -10px;
  left: 4px;
}
</style>
