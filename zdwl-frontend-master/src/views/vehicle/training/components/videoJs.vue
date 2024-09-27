<template>
  <video class="video-js" id="videoIds"></video>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from "vue";
import videojs from "video.js";
const props = defineProps({
  options: {
    type: Object,
    default: {},
  },
});
const player = ref();
const play = async() => {
    await nextTick();
    player.value = videojs("videoIds", { autoplay: false, controls: true });
    // player.value.pause();
    // player.value.reset();
    player.value.src(props.options.fileSrc);
    player.value.load();
    player.value.play();
  //   player.value.load(props.options.fileSrc);
  //   player.value.posterImage.setSrc(props.options.fileSrc);
  //   player.value.play();
};
onMounted(async()=>{
    
    
})
onBeforeUnmount(() => {
  player.value?.dispose();
});
defineExpose({
  play,
});
</script>
<style scoped lang="scss">
.video-js {
  width: 100%;
  height: 500px;
  // :deep(.vjs-progress-control){
  //   height: 10px;
  //   width: 100%;
  //   bottom: 0;
  //   position: absolute;
  // }
}
</style>
