(function () {
  window.onload = async function () {

  getDataCenter();
  getVehicleCenter();
  getVehiclePosition();
    if (localStorage.getItem("tiemInterval")) {
      clearInterval(localStorage.getItem("tiemInterval"));
      localStorage.removeItem("tiemInterval")
    }
    const tiemInterval = setInterval(() => {
      getVehiclePosition();
    }, 1000)
    localStorage.setItem("tiemInterval", tiemInterval);

  }
  var chartDom = document.getElementById('stateChart');
  var myChart = echarts.init(chartDom);
  function getNowFormatDate() {
    let date = new Date(),
      year = date.getFullYear(), //获取完整的年份(4位)
      month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
      strDate = date.getDate() // 获取当前日(1-31)
    if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0

    return `${year}-${month}-${strDate}`
  }
  var map = new AMap.Map('wrapper', {
    resizeEnable: true,
    center: [120.646682, 31.425851],
    pitch: 90,
    zoom: 16,
    zooms: [11, 16],
    mapStyle: 'amap://styles/darkblue', // 加载自定义样式

    // features: ['bg', 'road','point'],
  });
  let positionList = []
  let markers = []
  function setMarker() {
   if(markers.length>0){
    map.remove(markers);
    markers = [];
   }
    positionList.forEach((item, index) => {
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      let str = ''
      const colorStyle = item.vehOnlineStat == 0 ? '#A9A9A9' : '#fff';
      if (reg.test(item.carNo)) {
        var strIndex = item.carNo.lastIndexOf("\/");
        str = '<span class="text_991">' + item.carNo.charAt(0) + '</span>' +
          '<span class="text_99" style="color:' + colorStyle + '">' + item.carNo.substring(1, item.carNo.length) + '</span>'
      } else {
        str = '<span class="text_99" style="color:' + colorStyle + ';font-weight:600;font-size: 18px;">' + item.carNo + '</span>'
      }
      const img = item.vehOnlineStat == 0 ? './img/greyCar.png' : './img/车@3x.png';
      var markerContent = '' +
        '<img class="image_27" referrerPolicy="no-referrer" src="' + img + '" style="z-index:4"/>' +
        '<div class="text_100" style="z-index: 3"><div style="display: flex;margin-left: 1.7vw;">' +
        str +
        '</div></div>'
      var position = new AMap.LngLat(item.lng, item.lat);
      var marker = new AMap.Marker({
        position: position,
        map:map,
        // 将 html 传给 content
        content: markerContent,
        // 以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-20, -60)
      });
      // 将 markers 添加到地图
      markers.push(marker)
    })
  }
  let date = getNowFormatDate()
  document.getElementById("timeDate").innerHTML = date

  function mytime() {
    var a = new Date();
    var b = a.toLocaleTimeString();
    var c = a.toLocaleDateString();
    document.getElementById("time").innerHTML = c + "&nbsp" + b;
  }
  setInterval(function () { mytime() }, 1000);

  var week = new Date().getDay();
  if (week == 0) {
    str = "星期日";
  } else if (week == 1) {
    str = "星期一";
  } else if (week == 2) {
    str = "星期二";
  } else if (week == 3) {
    str = "星期三";
  } else if (week == 4) {
    str = "星期四";
  } else if (week == 5) {
    str = "星期五";
  } else if (week == 6) {
    str = "星期六";
  }
  document.getElementById("week").innerHTML = str;
  window.addEventListener("resize", () => {
    updateChartHeight();
    myChart.resize();//改变图表尺寸
  })
  let charHeight = 0
  function updateChartHeight() {
    chartHeight = window.innerHeight * 0.9;
  }
  function getDataCenter() {
    var url = "/api/v1/fullScreen/unmannedSanitation/dataCenter";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      // alert("油耗排名数据，请求连接异常，请联系管理员！");
      return;
    } else {
      if (result.code == '00000') {
        //避免出现数据为空的情况
        if (result.data != null) {
          $("#assignmentDuration").html(result.data.dataInfo.assignmentDuration == null ? 0 : result.data.dataInfo.assignmentDuration)
          $("#cleaningArea").html(result.data.dataInfo.cleaningArea == null ? 0 : result.data.dataInfo.cleaningArea)
          $("#consumptionPer10Kilo").html(result.data.dataInfo.consumptionPer10Kilo == null ? 0 : result.data.dataInfo.consumptionPer10Kilo)
          $("#lineCount").html(result.data.dataInfo.lineCount == null ? 0 : result.data.dataInfo.lineCount)
          $("#scanningEfficiency").html(result.data.dataInfo.scanningEfficiency == null ? 0 : Math.ceil(result.data.dataInfo.scanningEfficiency))
          $("#sceneScope").html(result.data.dataInfo.sceneScope == null ? 0 : result.data.dataInfo.sceneScope)
          $("#totalMileage").html(result.data.dataInfo.totalMileage == null ? 0 : result.data.dataInfo.totalMileage)
          initStateCharts(result.data.vehicleStatus)
          routeLine(result.data.routeList)
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
    // $(".lastMounthConsumption .swiper-wrapper").html(lastMounthConsumptionHtml);
  }
  //获取数据指标
  function getVehicleCenter() {
    var url = "/api/v1/fullScreen/unmannedSanitation/vehicleCenter";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      // alert("油耗排名数据，请求连接异常，请联系管理员！");

      return;
    } else {
      if (result.code == '00000') {
        //避免出现数据为空的情况
        if (result.data != null) {
          data = result.data
          $("#carTotal").html(data.vehicleTotal == null ? 0 : data.vehicleTotal)
          $("#carOnline").html(data.onlineCount == null ? 0 : data.onlineCount)
          $("#carOnlinePercent").html(data.onlineRate == null ? '0%' : data.onlineRate + '%')
          $("#cleanMachine8T").html(data.cleanMachine8T == null ? 0 : data.cleanMachine8T)
          $("#cleanMachine18T").html(data.cleanMachine18T == null ? 0 : data.cleanMachine18T)
          $("#smallSweeper").html(data.smallSweeper == null ? 0 : data.smallSweeper)
          $("#sprinklerTruck18T").html(data.sprinklerTruck18T == null ? 0 : data.sprinklerTruck18T)
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
    // $(".lastMounthConsumption .swiper-wrapper").html(lastMounthConsumptionHtml);
  }

  //获取车辆位置
  function getVehiclePosition() {
    positionList= [];
    var url = "/api/v1/fullScreen/unmannedSanitation/vehiclePosition";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      // alert("油耗排名数据，请求连接异常，请联系管理员！");
      return;
    } else {
      if (result.code == '00000') {
        //避免出现数据为空的情况
        if (result.data != null) {
          data = result.data
          data.forEach(item => {
            if (item.lng02 != null) {
              positionList.push({ lng: item.lng02, lat: item.lat02, carNo: item.card, vehOnlineStat: item.vehOnlineStat })
            }
          })
          setMarker();
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
    // $(".lastMounthConsumption .swiper-wrapper").html(lastMounthConsumptionHtml);

  }

  function initStateCharts(ary) {
    // var stateCharts = echarts.init($("#stateChart")[0]);
    var option = {
      tooltip: {
        trigger: 'item'
      },
      // legend: {
      //   show: false
      // },
      legend: {
        orient: 'vertical',
        right: 40,
        top: 'center',
        bottom: 20,
        itemWidth: 10,//图例的宽度
        itemHeight: 10,//图例的高度
        onHover: false,
        hoverable: false,
        selectedMode: false,
        icon: 'rect',
        textStyle: {
          color: '#A6A6AB',
          fontSize: '0.72vw',
          lineHeight: 12,
        },

        // data:[1,2,3,4,5,6,7]
        // data:['人工驾驶   ' + ary[0] ,'自动驾驶   ' + ary[1],'远程驾驶   ' + ary[2],
        //   '遥控驾驶   ' + ary[3], '紧急停车   ' + ary[4], '车辆故障   ' + ary[5], '车辆离线   ' + ary[6]]
      },
      graphic: {       //图形中间图片
        elements: [{
          type: 'image',
          style: {
            image: "img/car.png",//你的图片地址
            width: 50,
            height: 40
          },
          left: '25%',
          top: 'center'
        }]
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['80%', '90%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            normal: {
              color: function (colors) {
                var colorList = [
                  '#3ABBFA',
                  '#3173F4',
                  '#0EC6A5',
                  '#6898EE',
                  '#FF516E',
                  '#D37C49',
                  '#787E89'
                ];
                return colorList[colors.dataIndex];
              }
            }
          },
          label: {
            show: false,
            position: 'center'
          },
          center: ['30%', '50%'],
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: 40,
          //     fontWeight: 'bold'
          //   }
          // },
          labelLine: {
            show: false
          },
          data: [
            { value: ary[0], name: '人工驾驶  ' + ary[0] },
            { value: ary[1], name: '自动驾驶  ' + ary[1] },
            { value: ary[2], name: '远程驾驶  ' + ary[2] },
            { value: ary[3], name: '遥控驾驶  ' + ary[3] },
            { value: ary[4], name: '紧急停车  ' + ary[4] },
            { value: ary[5], name: '车辆故障  ' + ary[5] },
            { value: ary[6], name: '车辆离线  ' + ary[6] },
          ]
        }
      ]
    };
    option && myChart.setOption(option);
  }

  function routeLine(ary) {
    var routeLineHtml = '';
    $.each(ary, function (number, item) {
      var index = number + 1;
      var status = ''
      if (item.status == 0) {
        status = '离线'
      } else {
        status = '在线'
      }
      var evenClass = index % 2 == 0 ? '' : 'even';
      routeLineHtml = routeLineHtml +
        ' <div class="swiper-slide heighImp ' + evenClass + '">' +
        '<div class="section_1 flex-row">' +
        '<div class="text_41">' + index + '</div>' +
        '<div class="text_42" style="width:7.5vw">' + item.routeName + '</div>' +
        '<div class="text_44">' + item.vehicleCard + '</div>' +
        // '<div class="text_43">' + item.time + 'h</div>' +
        '<div class="text_45" style="display: flex; align-items: center;margin-right: 5px;">'

      if (status == "在线") {
        routeLineHtml = routeLineHtml + '<div style="width: 6px;height: 6px;background: #3ABBFA;border-radius: 50%;" ></div>' +
          '<span style="margin-left: 5px;">' + status + '</span></div>' +
          ' </div>' +
          ' </div></div>';
      } else if (status == '离线') {
        routeLineHtml = routeLineHtml + '<div style="width: 6px;height: 6px;background: #787E89;border-radius: 50%;" ></div>' +
          '<span style="margin-left: 5px;">' + status + '</span></div>' +
          ' </div>' +
          ' </div></div>';
      }


      // routeLineHtml = routeLineHtml + '<div >' +
      //   '<div className="box_11 flex-col justify-end">' +
      //     '<div class="section_1 flex-row">' +
      //       '<span class="text_41">' + index  + '</span>' +
      //       '<span class="text_42">' + item.routeName + '</span>' +
      //       '<span class="text_44">' + item.vehicleCard + '</span>' +
      //       '<span class="text_43">' + item.time + 'h</span>' +
      //       '<span class="text_45">' + status + '</span>' +
      //     '</div></div>'
    });
    $(".routeLineSwiper .swiper-wrapper").html(routeLineHtml);

    new Swiper(".routeLineSwiper", {
      direction: 'vertical',
      slidesPerView: 6,
      autoplay: true,//可选选项，自动滑动
    });
  }

  function baseRequest(postType, url, data) {
    const urlParams = new URLSearchParams(window.location.search);
    const location = 'http://123.60.179.96:9911'
    // const location = 'http://123.60.179.96:9999'
    // const env = location.indexOf("localhost")!= -1?'':urlParams.get('env');
    let result = undefined;
    $.ajax({
      url: location + url,
      async: false,
      dataType: 'json',
      type: postType,
      headers: {
        'Authorization': localStorage.getItem('accessToken')
      },
      data: data,
      success: function (data) {
        result = data;
      },
    });
    return result;
  }

})();
