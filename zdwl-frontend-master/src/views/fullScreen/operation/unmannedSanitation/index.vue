<template>
  <div class="app-container">
    <div class="fullscreen-container" style="height:100%;width: 100%;">
      <iframe id="iframe" :src="src" frameborder="0" style="width: 100%;" marginwidth="0" scrolling="no"></iframe>
    </div>
    <el-button id="fullscreen-button" @click="toggleFullscreen" class="fullscreen-button" :icon="FullScreen" >
       <!-- 使用你的图标字体或SVG图标 -->
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, h ,onUnmounted } from 'vue'
import { FullScreen  } from '@element-plus/icons-vue';
const env = import.meta.env.VITE_APP_BASE_API
const location = import.meta.env.VITE_APP_TARGET_URL
const src = ref(`./unmannedSanitation/index.html?env=${env}&location=${location}`)

const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        // 请求全屏，但不包括导航栏
        const mainContent = document.querySelector('.fullscreen-container');
        if (mainContent.requestFullscreen) {
          mainContent.requestFullscreen();
        } else if (mainContent.mozRequestFullScreen) {
          mainContent.mozRequestFullScreen();
        } else if (mainContent.webkitRequestFullscreen) {
          mainContent.webkitRequestFullscreen();
        } else if (mainContent.msRequestFullscreen) {
          mainContent.msRequestFullscreen();
        }
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
onMounted(() => {

});
onUnmounted(()=>{
  clearInterval(localStorage.getItem("tiemInterval"))
  localStorage.removeItem("tiemInterval")
})
</script>
<style scoped lang="scss">
.fullscreen-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999; /* 确保在其他元素之上 */
  padding: 10px 5px 10px 10px;
  color: #3498db;
  border: none;
  cursor: pointer;
  outline: none; /* 移除点击时的轮廓 */
}
.fullscreen-container{
  position: relative;
  padding-bottom: 56%;
  height: 0;
  overflow: hidden;
}
.fullscreen-container iframe,
.fullscreen-container object,
.fullscreen-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mask {
  position: fixed; /* 固定定位 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* 视口高度 */
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  z-index: 9999; /* 提高z-index值以确保遮罩层处于最上层 */
}
.app-container{
  width: 100%;
  height: 100%;
  background: rgb(9,21,42);
}
</style>
