<template>
  <div class="app-container">
    <div class="fullscreen-container" style="height:100%;width: 100%;">
      <iframe :src="src" frameborder="0" style="width: 100%;" marginwidth="0" scrolling="no"></iframe>
<!--      <div class="viewport">-->
<!--        &lt;!&ndash; 头部 &ndash;&gt;-->
<!--        <div class="head">-->
<!--          &lt;!&ndash;左列&ndash;&gt;-->
<!--          <div class="head-left-column">-->
<!--            <div class="head-left-new">截止2023-6-1，智能驾驶里程突破 <span class>600</span> 公里</div>-->
<!--          </div>-->
<!--          &lt;!&ndash;右列&ndash;&gt;-->
<!--          <div class="head-right-column">-->
<!--            <div class="right-box">-->
<!--              <div class="head-right-weather">-->
<!--                &lt;!&ndash; 天气 &ndash;&gt;-->
<!--                <span class="text">多云</span>-->
<!--                <span class="text">21-29°C</span>-->
<!--              </div>-->
<!--              <div class="head-right-timeBox">-->
<!--                &lt;!&ndash;时间&ndash;&gt;-->
<!--                <span class="time" id="time">18:23:06</span>-->
<!--                <span class="text" id="year">2023-06-08</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 内容 &ndash;&gt;-->
<!--        <div class="content">-->
<!--          &lt;!&ndash;左列&ndash;&gt;-->
<!--          <div class="column">-->
<!--            &lt;!&ndash;车辆信息 &ndash;&gt;-->
<!--            <div class="card-module vehicleInformation">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">车辆信息</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <div class="chart">-->
<!--                  <div class="chartItem chartLeft">-->
<!--                    <div class="chartBox">-->
<!--                      <div id="vehicleInformation"></div>-->
<!--                    </div>-->
<!--                    <div class="chartText">-->
<!--                      <div class="title">智能驾驶率</div>-->
<!--                      <div class="number">96%</div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="chartItem chartRight">-->
<!--                    <div class="chartRightItem">-->
<!--                      <div class="item">-->
<!--                        <div class="text">-->
<!--                          <span class="unit">车人比</span>-->
<!--                          <span class="number" id="vehicleDriverProp">1:1.5</span>-->
<!--                        </div>-->
<!--                        <div class="progress">-->
<!--                          <div class="bar" style="width: 40%;"></div>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                      <div class="item">-->
<!--                        <div class="text" >-->
<!--                          <span class="unit">车挂比</span>-->
<!--                          <span class="number" id="vehicleTrailerProp">1:2</span>-->
<!--                        </div>-->
<!--                        <div class="progress">-->
<!--                          <div class="bar" style="width: 33%;"></div>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="dataBar">-->
<!--                  <div class="item">-->
<!--                    <div class="title">智能车辆</div>-->
<!--                    <div class="number">-->
<!--                      <span id="intelligentVehicle">77</span>-->
<!--                      <span class="unit">台</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  &lt;!&ndash; <div class="item">-->
<!--                      <div class="title">传统车辆</div>-->
<!--                      <div class="number">21<span class="unit">台</span></div>-->
<!--                  </div> &ndash;&gt;-->
<!--                  <div class="item">-->
<!--                    <div class="title">驾驶人员</div>-->
<!--                    <div class="number">-->
<!--                      <span id="driverCount">132</span>-->
<!--                      <span class="unit">人</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="title">挂车数量</div>-->
<!--                    <div class="number">-->
<!--                      <span id="trailerVehicleCount">186</span>-->
<!--                      <span class="unit">台</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash;智能驾驶里程 &ndash;&gt;-->
<!--            <div class="card-module intelligentDrivingRange">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">智能驾驶里程</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <div id="intelligentDrivingRange"></div>-->
<!--              </div>-->
<!--            </div>-->

<!--            &lt;!&ndash;里程变化统计 &ndash;&gt;-->
<!--            <div class="card-module mileageChangeStatistics">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">里程变化统计</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <div id="mileageChangeStatistics"></div>-->
<!--              </div>-->
<!--            </div>-->

<!--            &lt;!&ndash;百公里油耗 TOP10 &ndash;&gt;-->
<!--            <div class="card-module oilConsumption">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">百公里油耗 TOP10</div>-->
<!--                <div class="unit">单位：L/100km</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <div class="swiper oilConsumptionSwiper">-->
<!--                  <div class="swiper-wrapper"></div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash;中列&ndash;&gt;-->
<!--          <div class="column middle-column" >-->
<!--            &lt;!&ndash; 统计 &ndash;&gt;-->
<!--            <div class="map">-->
<!--              <div class="item totalMileage">-->
<!--                <span class="title">运营里程</span>-->
<!--                <div class="text"><span class="number">31066905</span><span class="unit">km</span></div>-->
<!--              </div>-->
<!--              <div class="item autoDrivingMileage">-->
<!--                <span  class="title">智能驾驶里程</span>-->
<!--                <div class="text"><span class="number">6057823</span><span class="unit">km</span></div>-->
<!--              </div>-->
<!--              <div class="item AccumulatedCustomerService">-->
<!--                <span  class="title">累计服务客户</span>-->
<!--                <div class="text"><span class="number">46</span><span class="unit">家</span></div>-->
<!--              </div>-->
<!--              <div class="item cityCount">-->
<!--                <span  class="title">覆盖城市</span>-->
<!--                <div class="text"><span class="number">98</span><span class="unit">座</span></div>-->
<!--              </div>-->
<!--              <div class="item operationRoute" >-->
<!--                <span  class="title">运营线路</span>-->
<!--                <div class="text"><span class="number">68</span><span class="unit">条</span></div>-->
<!--              </div>-->
<!--            </div>-->

<!--            &lt;!&ndash; 地图 &ndash;&gt;-->
<!--            <div class="geoBox">-->
<!--              <div id="geo"></div>-->
<!--              <img id="contentBg" src="./images/contentBg.png" alt="">-->
<!--            </div>-->

<!--            &lt;!&ndash;宣传 publicize&ndash;&gt;-->
<!--            &lt;!&ndash; <div class="card-module publicize">-->
<!--                <div class="card-header">-->
<!--                    <div class="head-font">宣传</div>-->
<!--                </div>-->
<!--                <div class="card-content">-->

<!--                    <video class="publicizeBg" autoplay loop muted>-->
<!--                        <source src="./images/宣传.mp4" type="video/mp4">-->
<!--                    </video>-->
<!--                </div>-->
<!--            </div> &ndash;&gt;-->
<!--            &lt;!&ndash;服务客户 Serving customers&ndash;&gt;-->
<!--            <div class="card-module servingCustomers">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">服务客户</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <img class="servingCustomersBg" src="./images/servingCustomersBg.png">-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash;右列&ndash;&gt;-->
<!--          <div class="column columnRight">-->
<!--            &lt;!&ndash;累计运营订单 order for goods&ndash;&gt;-->
<!--            <div class="card-module orderForGoods">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">累计运营订单</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <div class="chartBox">-->
<!--                  <div id="orderForGoods"></div>-->
<!--                </div>-->
<!--                <div class="chartText">-->
<!--                  <div class="contentBox">-->
<!--                    <div class="item itemA"><span class="title">L2车辆完成订单</span> <span class="number">5572</span></div>-->
<!--                    <div class="item itemB"><span class="title">L3车辆完成订单</span> <span class="number">1499</span></div>-->
<!--                    <div class="item itemC"><span class="title">传统车辆完成订单</span> <span class="number">891</span></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash;订单统计 Order statistics&ndash;&gt;-->
<!--            <div class="card-module statistics">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">订单统计</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <div id="statistics"></div>-->
<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash;订单实时追踪 Real time tracking of orders&ndash;&gt;-->
<!--            <div class="card-module realTimeTrackingOfOrders">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">订单实时追踪</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                <div class="ordersBox">-->
<!--                  <div class="ordersHeader ordersItem">-->
<!--                    <div class="line">线路</div>-->
<!--                    <div class="licensePlate">车牌号</div>-->
<!--                    <div class="state">状态</div>-->
<!--                  </div>-->
<!--                  <div class="swiper ordersSwiper">-->
<!--                    <div class="swiper-wrapper"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            &lt;!&ndash;服务客户 Serving customers&ndash;&gt;-->
<!--            &lt;!&ndash; <div class="card-module servingCustomers">-->
<!--                 <div class="card-header">-->
<!--                     <div class="head-font">服务客户</div>-->
<!--                 </div>-->
<!--                 <div class="card-content">-->
<!--                     <img class="servingCustomersBg" src="./images/servingCustomersBg.png">-->
<!--                 </div>-->
<!--             </div> &ndash;&gt;-->
<!--            &lt;!&ndash;宣传 publicize&ndash;&gt;-->
<!--            <div class="card-module publicize" style="height: 28%;">-->
<!--              <div class="card-header">-->
<!--                <div class="head-font">宣传</div>-->
<!--              </div>-->
<!--              <div class="card-content">-->
<!--                &lt;!&ndash; <img class="publicizeBg" src="./images/publicizeBg.png"> &ndash;&gt;-->
<!--                <video class="publicizeBg" autoplay loop muted>-->
<!--                  <source src="./images/宣传.mp4" type="video/mp4">-->
<!--                </video>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <el-button id="fullscreen-button" @click="toggleFullscreen" class="fullscreen-button" :icon="FullScreen" >
       <!-- 使用你的图标字体或SVG图标 -->
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, h } from 'vue'
import { FullScreen  } from '@element-plus/icons-vue';
// import "@/assets/dataViewNew/js/echarts.min.js"
// import "@/assets/dataViewNew/css/icomoon.css"
// import "@/assets/dataViewNew/css/viewport.css"
// import "@/assets/dataViewNew/css/swiper.min.css"
//
// import "@/assets/dataViewNew/js/jquery.min.js"
// import "@/assets/dataViewNew/js/china.js"
// import "@/assets/dataViewNew/js/swiper.min.js"
// import "@/assets/dataViewNew/js/mymap.js"
// import "@/assets/dataViewNew/js/viewport.js"
const env = import.meta.env.VITE_APP_BASE_API
const location = import.meta.env.VITE_APP_TARGET_URL
const src = ref(`./dataViewNew/viewport.html?env=${env}&location=${location}`)

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
  // loaded()
  // var _self=this;
  // let myFrame = this.$refs['iframe']
  // if (myFrame.attachEvent) { // 兼容浏览器判断
  //   myFrame.attachEvent('onload', function() {
  //     const iframeWin = myFrame.contentWindow
  //     iframeWin.postMessage(_self.params,'*')
  //   })
  // } else {
  //   myFrame.onload = function() {
  //     const iframeWin = myFrame.contentWindow
  //     iframeWin.postMessage(_self.params,'*')
  //   }
  // }

});
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
</style>
