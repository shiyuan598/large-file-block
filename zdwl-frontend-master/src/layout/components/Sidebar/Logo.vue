<script lang="ts" setup>
import router from "@/router";
import { useSettingsStore } from "@/store/modules/settings";

const settingsStore = useSettingsStore();

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const layout = computed(() => settingsStore.layout);

const logo = ref(new URL(`../../../assets/images/logo-w.png`, import.meta.url).href);

const goDashboard = () => {
  router.push('/')
}
</script>

<template>
  <div
    class="w-full h-[48px] bg-gray-800 dark:bg-[var(--el-bg-color-overlay)] logo-wrap"
    style="background-color: #282E38;width: 250px !important;display: flex;padding-left: 24px;"
  >
    <div class="layout__logo" @click="goDashboard">
      <img
        class="label_1"
        referrerpolicy="no-referrer"
        src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngc28d9152e407cb1854a4d75d274766a0f4829fb9d3d93f830c85ca185d4ad8a0"
      />
      <img
        class="image_1"
        referrerpolicy="no-referrer"
        src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng950a1338f9bec8e29dfd088980b1a9b39bed9bf38c1ea670989ec3c710abe3b8"
      />
    </div>
    <!-- <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="h-full w-full flex items-center justify-center"
        to="/"
      >
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" style="width: 100%;height: 100%;object-fit:cover;"/>
      </router-link>

      <router-link
        v-else
        key="expand"
        class="h-full w-full flex items-center justify-center"
        to="/"
      >
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-5 h-5" style="width: 100%;height: 100%;object-fit:cover;"/>
      </router-link>
    </transition> -->
  </div>
</template>

<style lang="scss" scoped>
// https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component
.layout__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  // height: 60px;
  // width: 150px;

  .label_1 {
    width: 24px;
    height: 24px;
  }

  .image_1 {
    width: 186px;
    height: 17px;
    margin: 3px 0 0 9px;
  }

  .layout__icon {
    width: 135px;
    height: 41.5px;

    position: absolute;
    top: 8px;
    left: 0;
    transform: translateY(-50%);
    transition: all 0.3s;
    backface-visibility: hidden;
  }

  .layout__icon--front {
    transform: rotateX(90deg);
    transform-origin: 50% 50% -16px;
  }
  .layout__icon--end {
    transform: rotateX(0deg);
    transform-origin: 50% 50% -16px;
  }
  &:hover .layout__icon--front {
    transform: rotateX(0deg);
  }
  &:hover .layout__icon--end {
    transform: rotateX(-90deg);
  }
}
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}

.sidebarLogoFade-leave-active,
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
</style>
