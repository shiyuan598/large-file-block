<template>
  <video
    muted
    autoplay
    id="jswebrtc"
    class="jswebrtc"
    ref="jswebrtc"
    controls
  ></video>
</template>
<script setup>
import Srs from "@/assets/js/srs.sdk";
import { defineProps, ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps(["videoSrc"]);
const jswebrtc = ref(null);
const rtcPlayer = ref(null);
onMounted(() => {
  play();
});
const play = () => {
  rtcPlayer.value = new Srs.SrsRtcPlayerAsync();
  rtcPlayer.value.play(props.videoSrc);
  // video标签
  jswebrtc.value.srcObject = rtcPlayer.value.stream;
};
const initVideo = (url) => {
  if (jswebrtc.value) {
    jswebrtc.value.destroy();
    jswebrtc.value = null;
  }

  // let url = 'webrtc://192.168.50.188/01/0001/aivision/stream'
  jswebrtc.value = new JSWebrtc.Player(url, {
    video: jswebrtc.value,
    autoplay: true,
    onplay: (obj) => {
      console.log(obj);
      jswebrtc.value.addEventListener("canplay", function (e) {
        jswebrtc.value.play();
      });
    },
  });
};
onBeforeUnmount((e) => {
    rtcPlayer.value.close()
})
</script>
<style lang="scss" scoped>
 .jswebrtc{
  width: 100%;
  height: 100%;
  object-fit: fill;
 }
</style>