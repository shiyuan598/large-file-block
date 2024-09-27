(function () {
    function initPage() {
        setInterval(() => {
            initHead();
        }, 1000);
        setHeight('.vehicleInformation .chartText .number');
        var numberHeight = $('.vehicleInformation .chartText .number').height() * 0.5;
        $('.vehicleInformation .chartText .number').css({
            fontSize: numberHeight
        });
        initRealTimeTrackingOfOrders();
        initOilConsumption();
        initVehicleInformation();
        //智能车辆总数
        vehicleInformation();
        //驾驶人员
        driversNumber();
        //挂车数量
      trailerNumber();
      //里程变化统计
      // mileageChangeStatistics();
    }

    function setHeight(name) {
        var heightNumber = $(name).height();
        $(name).css({
            'height': heightNumber + 'px'
        })
    }

    // 初始 订单实时追踪
    var ordersArray = [
        {
            line: '佛山-石家庄',
            licensePlate: '苏ETZ093',
            state: '待调度'
        },
        {
            line: '合肥-深圳',
            licensePlate: '苏ESZ354',
            state: '待调度'
        },
        {
            line: '合肥-佛山',
            licensePlate: '苏EHW475',
            state: '待调度'
        },
        {
            line: '苏州-佛山',
            licensePlate: '苏ERB664',
            state: '待调度'
        },
        {
            line: '苏州-东莞',
            licensePlate: '苏EVG487',
            state: '已调度'
        },
        {
            line: '苏州-深圳',
            licensePlate: '苏EHJ962',
            state: '已调度'
        },
        {
            line: '佛山-天津',
            licensePlate: '苏ERE215',
            state: '已调度'
        },
        {
            line: '东莞-常州',
            licensePlate: '苏ENL580',
            state: '已调度'
        },
        {
            line: '东莞-昆山',
            licensePlate: '苏ERE215',
            state: '已完成'
        },
        {
            line: '东莞-无锡',
            licensePlate: '苏ENY137',
            state: '已完成'
        },
    ];

    function initRealTimeTrackingOfOrders() {
      //TODO
      var url = "/api/v1/fullScreen/operate/queryOrderTrack";
      let ordersArray = [];
      let data = {}
      var result = baseRequest("GET", url, data);
      if (undefined === result) {
        // alert("油耗排名数据，请求连接异常，请联系管理员！");
        return;
      } else {
        if (result.code == '00000') {
          //避免出现数据为空的情况
          if (result.data != null) {
            ordersArray = result.data
          }
        } else {
          phoenix.msg.fail(result.message);
        }
      }

        setHeight('.ordersSwiper');
        var ordersHtml = '';
        $.each(ordersArray, function (index, item) {
            var stateClass = item.state === '待调度' ? 'toDeDispatched' : 'dispatched';
            var evenClass = index % 2 == 0 ? 'even' : '';
            let state = ''
            switch (item.status){
              case 3:
                state = '已到达';
                break;
              case 2:
                state = '已发车';
                break;
              case 1:
                state = '已下发';
                break;
              default:
                break;
            }
            ordersHtml = ordersHtml + ' <div class="swiper-slide">' +
                ' <div class="ordersItem ' + stateClass + ' ' + evenClass + '">' +
                ' <div class="line">' + item.route + '</div>' +
                ' <div class="licensePlate">' + item.tractor + '</div>' +
                ' <div class="state">' + state + '</div> ' +
                ' </div>' +
                ' </div>';
        });
        $(".realTimeTrackingOfOrders .swiper-wrapper").html(ordersHtml);

        new Swiper(".ordersSwiper", {
            direction: 'vertical',
            slidesPerView: 5,
            autoplay: true,//可选选项，自动滑动
        });
    }

    var oilConsumptionArray = [
        {
            licensePlate: '苏EHJ962',
            oilConsumption: '27.01'
        },
        {
            licensePlate: '苏ERE215',
            oilConsumption: '27.26'
        },
        {
            licensePlate: '苏ENY137',
            oilConsumption: '27.42'
        },
        {
            licensePlate: '苏EVG487',
            oilConsumption: '28.96'
        },
        {
            licensePlate: '苏EVG475',
            oilConsumption: '28.95'
        },
        {
            licensePlate: '苏EHB987',
            oilConsumption: '28.96'
        },
        {
            licensePlate: '苏EYR808',
            oilConsumption: '29.4'
        },
        {
            licensePlate: '苏ELM994',
            oilConsumption: '29.83'
        },
        {
            licensePlate: '苏ERB664',
            oilConsumption: '30.71'
        },
        {
            licensePlate: '测ENL580',
            oilConsumption: '30.75'
        },
    ];

    //左上车辆信息
    function vehicleInformation(){
        var url = "/api/v1/fullScreen/operate/intelligentVehicles";
        let data = {};
        var result = baseRequest("GET", url, data);
        if (undefined === result) {
            phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
        } else {
            if (result.code == "00000") {
                //避免出现数据为空的情况
                if (result.data != null) {
                    $('#intelligentVehicle').html(result.data);
                }
            } else {
                phoenix.msg.fail(result.message);
            }
        }
    }

    //驾驶人员
    function driversNumber(){
      var url = "/api/v1/fullScreen/operate/driversNumber";
      let data = {};
      var result = baseRequest("GET", url, data);
      if (undefined === result) {
        phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
      } else {
        if (result.code == "00000") {
          //避免出现数据为空的情况
          if (result.data != null) {
            $('#driverCount').html(result.data);
          }
        } else {
          phoenix.msg.fail(result.message);
        }
      }
    }

  //挂车数量
  function trailerNumber(){
    var url = "/api/v1/fullScreen/operate/trailerNumber";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
    } else {
      if (result.code == "00000") {
        //避免出现数据为空的情况
        if (result.data != null) {
          $('#trailerVehicleCount').html(result.data);
          $('#vehicleDriverProp').html("1:" + ($('#driverCount')[0].innerText/$('#intelligentVehicle')[0].innerText).toFixed(2).toString());
          $('#vehicleTrailerProp').html("1:" + (result.data/$('#intelligentVehicle')[0].innerText).toFixed(2).toString());
          $('#vehicleDriverPropBar').css("width", (1/$('#vehicleDriverProp')[0].innerText.split(':')[1] * 100).toFixed(2).toString()+'%');
          $('#vehicleTrailerPropBar').css("width", (1/$('#vehicleTrailerProp')[0].innerText.split(':')[1] * 100).toFixed(2).toString() + '%');
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
  }

  //智驾里程
  function dispatchMileage(){
    var url = "/api/v1/fullScreen/operate/dispatchMileage";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
    } else {
      if (result.code == "00000") {
        //避免出现数据为空的情况
        if (result.data != null) {
          // $('#vehicleDriverProp').html(result.data);
          // $('#vehicleTrailerProp').html(result.data.vehicleTrailerProp);
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
  }

    // 百公里油耗排名
    function initOilConsumption() {
        //百公里油耗排名
        var url = "/api/v1/fullScreen/operate/fuelConsumption";
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
                  oilConsumptionArray = result.data;
                }
            } else {
                phoenix.msg.fail(result.message);
            }
        }

        // setHeight('.oilConsumptionSwiper');
        var oilConsumptionHtml = '';
        $.each(oilConsumptionArray, function (number, item) {
            var index = number + 1;
            var frontRowClass = index <= 3 ? 'frontRow' : '';
            var percentage = Number(item.oil);
            if(percentage > 100){
              percentage = 100
            }
            oilConsumptionHtml = oilConsumptionHtml + '<div class="swiper-slide"><div class="oilConsumptionItem ' + frontRowClass + '">' +
                '<div class="number"><span>' + index + '</span></div>' +
                '<div class="licensePlate">' + item.tractor + '</div>' +
                '<div class="progressBox">' +
                '<div class="progress">' +
                '<div class="bar" style="width: ' + percentage + '%;"></div>' +
                '</div>' +
                '</div>' +
                '<div class="oilConsumption">' + item.oil + '</div>' +
                '</div></div>'
        });
        $(".oilConsumption .swiper-wrapper").html(oilConsumptionHtml);

        new Swiper(".oilConsumptionSwiper", {
            direction: 'vertical',
            slidesPerView: 4,
            autoplay: true,//可选选项，自动滑动
        });
    }

    // 初始化
    function initVehicleInformation() {
        var vehicleInformationChart = echarts.init($("#vehicleInformation")[0]);
        var option = {
            color: [{
                type: 'linear',
                colorStops: [{
                    offset: 0,
                    color: 'rgba(21, 134, 255, 1)'
                }, {
                    offset: 1,
                    color: 'rgba(54, 186, 244, 1)'
                }],
                x: 0.0,
                y: 0,
                x2: 0.49999999999999994,
                y2: 1
            }, 'rgba(0, 0, 0, 0.0)'],
            tooltip: {
                trigger: 'item'
            },
            legend: {
                show: false
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: 96,
                            name: '值'
                        },
                        {
                            value: 4,
                            name: '总数'
                        }
                    ]
                }
            ]
        };
        vehicleInformationChart.setOption(option);
    }

    function getMonths() {
      var monthArr = [];
      var data = new Date();
      var year = data.getFullYear();
      data.setMonth(data.getMonth(), 1); //获取到当前月份,设置月份
      for (var i = 0; i < 6; i++) {
        data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
        var m = data.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        monthArr.push(m + '月');
      }
      console.log(monthArr);
      return monthArr.reverse();
    }

    // 智能驾驶里程
    function initIntelligentDrivingRange() {
      var dataKey= getMonths();   //前6个月份（带单位）
      var dataValue = [0, 0, 0, 0, 0, 0];
      var dataAutoValue = [0, 0, 0, 0, 0, 0];

      //最近半年运营里程信息
      var url = "/api/v1/fullScreen/operate/dispatchMileage";
      let data = {};
      var result = baseRequest("GET", url, data);
      if (undefined === result) {
          alert("里程数据，请求连接异常，请联系管理员！");
          return;
      } else {
          if (result.code == "00000") {
              //避免出现数据为空的情况
              if (result.data != null ) {
                data = result.data
                dataKey.forEach((item,m)=> {
                  data.xaxisData.forEach((i, index) => {
                    if(item == (i.substring(4,6) + '月')){
                      dataValue[m] = data.y1AxisData[index]
                      dataAutoValue[m] = data.y2AxisData[index]
                    }
                  })
                })
              }
          } else {
              alert("result.message222！");
              return;
          }
      }
        var chartDom = document.getElementById('intelligentDrivingRange');
        var myChart = echarts.init(chartDom);
        option = {
            color: [
                {
                    type: 'linear',
                    colorStops: [
                        {
                            offset: 0,
                            color: '#35FFF2'
                        }, {
                            offset: 1,
                            color: 'rgba(0,214,185,0.4)'
                        }
                    ],
                    x: 0.0,
                    y: 0,
                    x2: 0.49999999999999994,
                    y2: 1
                },
                {
                    type: 'linear',
                    colorStops: [{
                        offset: 0,
                        color: '#78B5FF'
                    }, {
                        offset: 1,
                        color: 'rgba(50,112,255,0.4)'
                    }],
                    x: 0.0,
                    y: 0,
                    x2: 0.49999999999999994,
                    y2: 1
                }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                right: 0,
                top: '10px',
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color: "#fff"
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    color: '#F4F4FA',
                    data: dataKey,
                }
            ],

            yAxis: [
              {
                name: '单位：Wkm',
                type: 'value',
                splitNumber: 3,
                axisLabel: {
                  color: '#F4F4FA'
                },
                splitLine: {
                  lineStyle: {
                    color: "rgba(90, 90, 137, 0.40)"
                  }
                }
              }
            ],
            series: [
              {
                name: data.legendData[0] + '(WKM)',
                type: 'bar',
                barWidth: "25%",
                data: dataValue,

              },
              {
                name: data.legendData[1] + '(WKM)',
                type: 'bar',
                data: dataAutoValue
              }
            ]
        };
        option && myChart.setOption(option);
    }

    // 里程变化统计
    function initMileageChangeStatistics() {

        var dataKey = getMonths();
        var dataLastRatio = ['0', '0', '0', '0', '0', '0'];
        var dataCircleRatio = ['0', '0', '0', '0', '0', '0'];

        //最近半年运营里程信息
        var url = "/api/v1/fullScreen/operate/mileageChangeStatistics";
        let data = {};
        var result = baseRequest("GET", url, data);
        if (undefined === result) {
            alert("里程数据，请求连接异常，请联系管理员！");
            return;
        } else {
            if (result.code === '00000') {
                //避免出现数据为空的情况
                if (result.data != null) {
                  data = result.data
                  dataKey.forEach((item,m)=> {
                    data.xaxisData.forEach((i, index) => {
                      if(item == (i.substring(4,6) + '月')){
                        dataLastRatio[m] = data.y1AxisData[index]
                      }
                    })
                  })
                }
            } else {
                alert("result.message11111！");
                return;
            }
        }
        var chartDom = document.getElementById('mileageChangeStatistics');
        var myChart = echarts.init(chartDom);
        var option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            color: [
                '#7AB0FF',
                '#FFA300',
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                right: 0,
                top: '10px',
                textStyle: {
                    color: "#fff"
                }
            },
            xAxis: {
                type: 'category',
                color: '#F4F4FA',
                data: dataKey,
            },
            yAxis: [
                {
                    name: '单位：L',
                    type: 'value',
                    splitNumber: 3,
                    axisLabel: {
                        color: '#F4F4FA',
                        formatter: '{value} '
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(90, 90, 137, 0.40)"
                        }
                    }
                },
            ],
            series: [
                {
                    name: data.legendData[0],
                    data: dataLastRatio,
                    type: 'bar',
                    barWidth: "25%",
                }
            ]
        };
        option && myChart.setOption(option);
    }

    // 累计运营订单
    function initOrderForGoods() {
      //最近半年运营里程信息
      var url = "/api/v1/fullScreen/operate/queryOperateOrder";
      let data = {};
      var result = baseRequest("GET", url, data);
      if (undefined === result) {
        alert("里程数据，请求连接异常，请联系管理员！");
        return;
      } else {
        if (result.code === '00000') {
          //避免出现数据为空的情况
          if (result.data != null) {
            data = result.data
          }
        } else {
          alert("result.message！");
          return;
        }
      }

        var orderForGoodsDom = document.getElementById('orderForGoods');

        orderForGoodsDom.style.display = 'inline-block'
        orderForGoodsDom.style.verticalAlign = 'middle'
        var myChart = echarts.init(orderForGoodsDom);
        option = {
            grid: {
                insideLeft: 0,
                containLabel: true
            },
            color: [
                {
                    type: 'linear',
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(21, 134, 255, 0.6)'
                    }, {
                        offset: 1,
                        color: 'rgba(54, 186, 244, 0.6)'
                    }],
                    x: 1,
                    y: 1,
                    x2: 0,
                    y2: 0
                },
                '#FFD356',
                '#00D6B9',
                '#3270FF'

            ],
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                right: 0,
                top: '30%',
                textStyle: {
                    color: "#fff"
                },
                data: ['L2车辆完成订单', 'L3车辆完成订单', '传统车辆完成订单'],
                formatter: function (name) {
                    var number = '';
                    switch (name) {
                        case 'L2车辆完成订单':
                            number = data.l2num;
                            break;
                        case 'L3车辆完成订单':
                            number = data.l3num;
                            break;
                        case '传统车辆完成订单':
                            number = data.num;
                            break;
                    }
                    return name + '     ' + number;
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    right: '55%',
                    radius: [0, '55%'],
                    label: {
                        formatter: '{b}\n\n{c}',
                        color: '#F4F4FA',
                        position: 'center',
                        fontSize: 16,
                    },
                    itemStyle: {
                        shadowBlur: 12,
                        shadowColor: "rgba(199, 216, 255, 0.6)"
                    },
                    data: [{value: (data.l2num + data.l3num+ data.num), name: '总订单'}]
                },
                {
                    name: '',
                    type: 'pie',
                    right: '55%',
                    radius: ['65%', '75%'],
                    label: {
                        show: false,
                        position: 'inside'
                    },
                    data: [
                        {value: data.l2num, name: 'L2车辆完成订单'},
                        {value: data.l3num, name: 'L3车辆完成订单'},
                        {value: data.num, name: '传统车辆完成订单'}
                    ]
                }
            ]
        };
        option && myChart.setOption(option);
    }

    // 订单统计
    function initStatistics() {
        //TODO
      var dataKey= getMonths();   //前6个月份（带单位）
      var dataValue = [0, 0, 0, 0, 0, 0];
      var dataAutoValue = [0, 0, 0, 0, 0, 0];

      //最近半年运营里程信息
      var url = "/api/v1/fullScreen/operate/queryOrderTotal";
      let data = {};
      var result = baseRequest("GET", url, data);
      if (undefined === result) {
        alert("里程数据，请求连接异常，请联系管理员！");
        return;
      } else {
        if (result.code == "00000") {
          //避免出现数据为空的情况
          if (result.data != null ) {
            data = result.data
            dataKey.forEach((item,m)=> {
              data.forEach((i, index) => {
                if(i.plateMounth != null && item == (i.plateMounth.substring(4,6) + '月')){
                  dataAutoValue[m] = data[index].plateNum
                }
                if(i.dispatchMounth != null && item == (i.dispatchMounth.substring(4,6) + '月')){
                  dataValue[m] = data[index].dispatchNum
                }
              })
            })
          }
        } else {
          alert("result.message222！");
          return;
        }
      }

        var orderForGoodsDom = document.getElementById('statistics');
        var myChart = echarts.init(orderForGoodsDom);
        var option = {
            color: [
                {
                    type: 'linear',
                    colorStops: [{
                        offset: 0,
                        color: '#78B5FF'
                    }, {
                        offset: 1,
                        color: 'rgba(50,112,255,0.4)'
                    }],
                    x: 0.0,
                    y: 0,
                    x2: 0.49999999999999994,
                    y2: 1
                }, {
                    type: 'linear',
                    colorStops: [{
                        offset: 0,
                        color: '#35FFF2'
                    }, {
                        offset: 1,
                        color: 'rgba(0,214,185,0.4)'
                    }],
                    x: 0.0,
                    y: 0,
                    x2: 0.49999999999999994,
                    y2: 1
                }, '#FFD356'
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                left: 0,
                top: '10px',
                itemWidth: 10,
                itemHeight: 10,
                itemH: 10,
                data: ['自营', '平台', '环比'],
                textStyle: {
                    color: "#fff"
                }
            },
            xAxis: {
                type: 'category',
                data: dataKey
            },
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 3,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "#fff"
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(90, 90, 137, 0.40)"
                        }
                    }
                },
                {
                    type: 'value',
                    splitNumber: 3,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "#fff",
                        formatter: '{value} %'
                    }
                }
            ],
            series: [
                {
                    name: '自营',
                    type: 'bar',
                    barWidth: "25%",
                    data: dataValue
                },
                {
                    name: '平台',
                    type: 'bar',
                    barWidth: "25%",
                    data: dataAutoValue
                }
            ]
        };

        option && myChart.setOption(option);
    }

    var widthNumber = $('.realTimeTrackingOfOrders').width();
    setHeight('.realTimeTrackingOfOrders .card-content');
    $('.realTimeTrackingOfOrders').css({
        'width': widthNumber + 'px'
    });

    function initHead() {
        let date = new Date(); //当前的时间戳
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        hour = hour.toString().padStart(2, '0')
        minute = minute.toString().padStart(2, '0')
        second = second.toString().padStart(2, '0')
        $('#time').html(hour + ':' + minute + ':' + second);
        $('#year').html(year + '-' + month + '-' + day);
    }

    function queryOperateMileage(){
      var url = "/api/v1/fullScreen/operate/queryOperateMileage";
      let data = {};
      var result = baseRequest("GET", url, data);
      if (undefined === result) {
        phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
      } else {
        if (result.code == "00000") {
          //避免出现数据为空的情况
          if (result.data != null) {
            $('#queryOperateMileage').html(result.data);
          }
        } else {
          phoenix.msg.fail(result.message);
        }
      }
    }

  function getNowFormatDate() {
    let date = new Date(),
      year = date.getFullYear(), //获取完整的年份(4位)
      month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
      strDate = date.getDate() // 获取当前日(1-31)
    if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0

    return `${year}-${month}-${strDate}`
  }

  function queryIntelligentMileage(){
    var url = "/api/v1/fullScreen/operate/queryIntelligentMileage";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
    } else {
      if (result.code == "00000") {
        //避免出现数据为空的情况
        if (result.data != null) {
          $('#queryIntelligentMileage').html(result.data);
          let date = getNowFormatDate()
          $('#headLefNew').html(`截止${date},智能驾驶里程突破${Math.ceil(result.data/10000)}万公里` );
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
  }

  function queryCustom(){
    var url = "/api/v1/fullScreen/operate/queryCustom";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
    } else {
      if (result.code == "00000") {
        //避免出现数据为空的情况
        if (result.data != null) {
          $('#queryCustom').html(result.data);
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
  }

  function queryCity(){
    var url = "/api/v1/fullScreen/operate/queryCity";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
    } else {
      if (result.code == "00000") {
        //避免出现数据为空的情况
        if (result.data != null) {
          $('#queryCity').html(result.data);
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
  }

  function queryRoute(){
    var url = "/api/v1/fullScreen/operate/queryRoute";
    let data = {};
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      phoenix.msg.fail($.phx.i18n.prop('Common_Ajax_error'));
    } else {
      if (result.code == "00000") {
        //避免出现数据为空的情况
        if (result.data != null) {
          $('#queryRoute').html(result.data);
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
  }

  function lastMounthConsumption() {
    var url = "/api/v1/fullScreen/operate/queryLastMonthTop";
    let data = {};
    let lastMounthConsumptionArray = []
    var result = baseRequest("GET", url, data);
    if (undefined === result) {
      // alert("油耗排名数据，请求连接异常，请联系管理员！");
      return;
    } else {
      if (result.code == '00000') {
        //避免出现数据为空的情况
        if (result.data != null) {
          data = result.data
          lastMounthConsumptionArray = result.data;
        }
      } else {
        phoenix.msg.fail(result.message);
      }
    }
    total = lastMounthConsumptionArray[0]?.mileage
    var lastMounthConsumptionHtml = '';
    $.each(lastMounthConsumptionArray, function (number, item) {
      var index = number + 1;
      var frontRowClass = index <= 3 ? 'frontRow' : '';
      var percentage = Number(item.mileage/total) * 100;
      // if(percentage > 100){
        percentage = 100
      // }
      lastMounthConsumptionHtml = lastMounthConsumptionHtml + '<div class="swiper-slide"><div class="lastMounthConsumptionItem ' + frontRowClass + '">' +
        '<div class="number"><span>' + index + '</span></div>' +
        '<div class="licensePlate">' + item.tractor + '</div>' +
        '<div class="progressBox">' +
        '<div class="progress">' +
        '<div class="bar" style="width: ' + percentage + '%;"></div>' +
        '</div>' +
        '</div>' +
        '<div class="lastMounthConsumption">' + item.mileage + '</div>' +
        '</div></div>'
    });
    $(".lastMounthConsumption .swiper-wrapper").html(lastMounthConsumptionHtml);

    new Swiper(".lastMounthConsumptionSwiper", {
      direction: 'vertical',
      slidesPerView: 4,
      autoplay: true,//可选选项，自动滑动
    });
  }



    //基础请求
    function baseRequest(postType, url, data) {
        const urlParams = new URLSearchParams(window.location.search);
        const location = urlParams.get('location')
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

    initPage();
    initIntelligentDrivingRange();
    initOrderForGoods();
    initMileageChangeStatistics();
    initStatistics();
  queryOperateMileage();
  queryIntelligentMileage();
  queryCustom();
  queryCity();
  queryRoute();
  lastMounthConsumption();
})();
