/*大屏*/
//自调用函数
(function () {
    // 1、页面一加载就要知道页面宽度计算
    var setFont = function () {
        // 因为要定义变量可能和别的变量相互冲突，污染，所有用自调用函数
        var html = document.documentElement;// 获取html
        // 获取宽度
        var width = html.clientWidth;

        // 判断
        if (width < 1024) width = 1024
        if (width > 1920) width = 1920
        // 设置html的基准值
        var fontSize = width / 80 + 'px';
        // 设置给html
        html.style.fontSize = fontSize;
    };
    setFont();
    // 2、页面改变的时候也需要设置
    // 尺寸改变事件
    window.onresize = function () {
        setFont();
    }
})();

(function () {
    //事件委托
    $('.monitor').on('click', ' a', function () {
        //点击当前的a 加类名 active  他的兄弟删除类名
        $(this).addClass('active').siblings().removeClass('active');
        //获取一一对应的下标
        var index = $(this).index();
        //选取content 然后狗日对应下标的 显示   当前的兄弟.content隐藏
        $('.content').eq(index).show().siblings('.content').hide();
    });
    //滚动
    //原理：把marquee下面的子盒子都复制一遍 加入到marquee中
    //      然后动画向上滚动，滚动到一半重新开始滚动
    //因为选取的是两个marquee  所以要遍历
    $('.monitor .marquee').each(function (index, dom) {
        //将每个 的所有子级都复制一遍
        var rows = $(dom).children().clone();
        //再将新的到的加入原来的
        $(dom).append(rows);
    });

})();

//车型分布图表
(function () {
    // var myechart = echarts.init($('.pie')[0]);
    var myechart = echarts.init(document.getElementById("VehicleTypeDistribution"));
    var url = "/iot-web/jobweb/iotOperationScreenController/queryVehicleTypeDistribution";
    var res = [];
    $.ajax({
        url: url,
        async: false,
        dataType: 'json',
        type: "post",
        success: function (data) {
            if (data.success) {
                $.each(data.data, function (index, obj) {
                    if (null != obj) {
                        res.push({
                            name: obj.etveType,
                            value: obj.etveCount
                        })
                    }
                })
            }
        },
    });

    option = {
        // 控制提示
        tooltip: {
            // 非轴图形，使用item的意思是放到数据对应图形上触发提示
            trigger: 'item',
            // 格式化提示内容：
            // a 代表图表名称 b 代表数据名称 c 代表数据  d代表  当前数据/总数据的比例
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        //图例控制
        legend: {
            textStyle: {
                color: '#f9f7fd' // 图例文字颜色
            },
            top: '10%',
            left: '75%',
            right: '1%',
        },
        // 控制图表
        series: [
            {
                // 图表名称
                name: '车型分布',
                // 图表类型
                type: 'pie',
                // 南丁格尔玫瑰图 有两个圆  内圆半径10%  外圆半径70%
                // 百分比基于  图表DOM容器的半径
                radius: '48%',
                // radius: ['10%', '70%'],
                // 图表中心位置 left 50%  top 50% 距离图表DOM容器
                center: ['35%', '50%'],
                // 半径模式，另外一种是 area 面积模式
                // roseType: 'area',
                // 数据集 value 数据的值 name 数据的名称
                data: res,
                //文字调整
                label: {
                    fontSize: 10
                },
                //引导线
                labelLine: {
                    length: 8,
                    length2: 10
                }
            }
        ],
        color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff']
    };

    myechart.setOption(option);


})();

//智能车数量、运营里程、自动驾驶里程、安全行驶时间、覆盖城市接口
(function () {
    // var myechart = echarts.init($('.pie')[0]);
    var url = "/iot-web/jobweb/iotOperationScreenController/queryAutoDrivingManage"
    var res = [];
    $.ajax({
        url: url,
        async: false,
        dataType: 'json',
        type: "post",
        success: function (data) {
            res = data.data;
        },
    });
    document.getElementById("cardCount").innerHTML = res.cardCount;
    document.getElementById("totalMileage").innerHTML = res.totalMileage;
    document.getElementById("autoDrivingMileage").innerHTML = res.autoDrivingMileage;
    document.getElementById("operateTime").innerHTML = res.operateTime;
    document.getElementById("cityCount").innerHTML = res.cityCount;
})();

var days = 30;
//节油百分比
// (function () {
//     // var myechart = echarts.init($('.pie')[0]);
//     var myechart = echarts.init(document.getElementById("overviewOilReduce"));
//     var xData = [];
//     var yData = [];
//     $.ajax({
//         url: "/iot-web/locweb/largeScreenController/getOilSaving?days="+days,
//         contentType: "application/x-www-form-urlencoded",
//         type: "POST",
//         dataType : 'json',
//         success: function (data) {
//             if (data.success) {
//                 $.each(data.data,function (index,obj){
//                     xData.push(obj.etveType);
//                     yData.push(obj.oilSavingRate);
//                 });
//                 var option = {
//                     // 工具提示
//                     tooltip: {
//                         // 触发类型  经过轴触发axis  经过轴触发item
//                         trigger: 'item',
//                         // 轴触发提示才有效
//                         axisPointer: {
//                             // 默认为直线，可选为：'line' 线效果 | 'shadow' 阴影效果
//                             type: 'shadow'
//                         }
//                     },
//                     // 图表边界控制
//                     grid: {
//                         // 距离 上右下左 的距离
//                         left: '0',
//                         right: '0',
//                         bottom: '3%',
//                         top: '5%',
//                         // 大小是否包含文本【类似于boxsizing】
//                         containLabel: true,
//                         //显示边框
//                         show: false,
//                         //边框颜色
//                         borderColor: 'rgba(0, 240, 255, 0.3)'
//                     },
//                     // 控制x轴
//                     xAxis: [
//                         {
//                             // 使用类目，必须有data属性
//                             type: 'category',
//                             // 使用 data 中的数据设为刻度文字
//                             data: xData,
//                             // 刻度设置
//                             axisTick: {
//                                 // true意思：图形在刻度中间
//                                 // false意思：图形在刻度之间
//                                 alignWithLabel: false,
//                                 show: false
//                             },
//                             //文字
//                             axisLabel: {
//                                 color: '#f9f7fd'
//                             }
//                         }
//                     ],
//                     // 控制y轴
//                     yAxis: [
//                         {
//                             type: 'value',
//                             name: '节油百分比',
//                             position: 'right',
//                             alignTicks: true,
//                             axisLine: {
//                                 show: true,
//                             },
//                             axisLabel: {
//                                 color: '#f9f7fd',
//                                 formatter: '{value} %'
//                             },
//                             splitLine: {
//                                 lineStyle: {
//                                     type: 'dashed',
//                                     color: 'rgba(0, 240, 255, 0.3)'
//                                 }
//                             },
//                         }
//                     ],
//                     // 控制x轴
//                     series: [
//                         {
//                             itemStyle: {
//                                 // 提供的工具函数生成渐变颜色
//                                 color: new echarts.graphic.LinearGradient(
//                                     // (x1,y2) 点到点 (x2,y2) 之间进行渐变
//                                     0, 0, 0, 1,
//                                     [
//                                         { offset: 0, color: '#00fffb' }, // 0 起始颜色
//                                         { offset: 1, color: '#0061ce' }  // 1 结束颜色
//                                     ]
//                                 )
//                             },
//                             name: '节油百分比',
//                             type: 'bar',
//                             // 柱子宽度
//                             barWidth: '50%',
//                             data: yData
//                         }
//                     ]
//                 };
//                 myechart.setOption(option);
//             }
//         },
//     });
//
//     //仪表盘，因为数据量未知，便于开发就用了柱状图
//     // option = {
//     //     series: [
//     //         {
//     //             name: 'Pressure',
//     //             type: 'gauge',
//     //             detail: {
//     //                 formatter: '{value}'
//     //             },
//     //             data: [
//     //                 {
//     //                     value: data,
//     //                     name: 'SCORE'
//     //                 }
//     //             ]
//     //         },
//     //         {
//     //             name: 'Pressure',
//     //             type: 'gauge',
//     //             detail: {
//     //                 formatter: '{value}'
//     //             },
//     //             data: [
//     //                 {
//     //                     value: data,
//     //                     name: '11'
//     //                 }
//     //             ]
//     //         }
//     //     ]
//     // };
// })();
// 平均油耗 和 节油百分比图表
(function () {
    // if (true){
    //     // TODO 平均油耗和节油百分比合并显示，切换成此效果请先注释旧的图表，并注释掉 return
    //     return;
    // }
    var myechart = echarts.init(document.getElementById("overviewOilReduce"));
    var xData = [];
    var yData = [];
    var yData2 = [];
    var avgFuelConsumptionMap = [];

    //测试使用数据（正式使用请注释）
    var yDataTemp = [];
    var yData2Temp = [];

    $.ajax({
        url: "/iot-web/locweb/largeScreenController/getOilSaving?days=" + days,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                $.each(data.data, function (index, obj) {
                    xData.push(obj.etveType);
                    yData.push(obj.oilSavingRate);

                    //测试数据
                    yDataTemp.push(Math.round(Math.random() * 99));
                });
                //测试使用数据
                if (yData.every(item => item === 0)) {
                    yData = yDataTemp;
                }

                var url2 = "/iot-web/jobweb/iotOperationScreenController/queryAverageFuelConsumption";
                $.ajax({
                    url: url2,
                    async: false,
                    dataType: 'json',
                    type: "post",
                    success: function (data) {
                        if (data.success) {
                            var xResArr = [];
                            var yResArr = [];
                            $.each(data.data, function (index, obj) {
                                xResArr.push(obj.vehicleType);
                                yResArr.push(obj.aveHundredOilCast);
                            });

                            yData2 = [];
                            avgFuelConsumptionMap = {};
                            if (xResArr.length > 0) {
                                for (var i = 0; i < xResArr.length; i++) {
                                    var sdf = xResArr[i];
                                    avgFuelConsumptionMap[xResArr[i]] = yResArr[i];
                                }
                            }
                            if (xData.length > 0) {
                                for (var i = 0; i < xData.length; i++) {
                                    var xresname = xData[i];
                                    if (avgFuelConsumptionMap[xresname]) {
                                        yData2.push(avgFuelConsumptionMap[xresname]);
                                    } else {
                                        yData2.push("");
                                    }

                                    //测试数据
                                    yData2Temp.push(Math.round(Math.random() * 99));
                                }

                                //测试使用数据
                                if (yData2.length == 0 || yData2.every(item => item == "")) {
                                    yData2 = yData2Temp;
                                }
                            }

                            var option = {
                                legend: {
                                    data: ['油耗', '节油百分比'],
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                // 图表边界控制
                                grid: {
                                    // 是否显示直角坐标系网格
                                    show: false,
                                    // 图表边界
                                    left: '0',
                                    right: '3%',
                                    bottom: '3%',
                                    top: '20%',
                                    // grid 区域是否包含坐标轴的刻度标签
                                    containLabel: true,
                                    // 边框颜色
                                    borderColor: '#a7ebe2'
                                },
                                //图例组件
                                legend: {
                                    textStyle: {
                                        color: '#f9f7fd' // 图例文字颜色
                                    },
                                    right: '26%'    // 右边距离
                                },
                                xAxis: [{
                                    type: 'category',
                                    data: xData,
                                    // 刻度设置
                                    axisTick: {
                                        // true意思：图形在刻度中间
                                        // false意思：图形在刻度之间
                                        alignWithLabel: false,
                                        show: false
                                    },
                                    // 文字属性
                                    axisLabel: {
                                        interval: 0, // 使x轴文字显示全
                                        color: '#f9f7fd',
                                        formatter: function (params) {
                                            let newParamsName = '';
                                            const paramsNameNumber = params.length; // 文字总长度
                                            const provideNumber = 4; //一行显示几个字
                                            const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                            if (paramsNameNumber > provideNumber) {
                                                for (let p = 0; p < rowNumber; p++) {
                                                    const start = p * provideNumber;
                                                    const end = start + provideNumber;
                                                    const tempStr = p === rowNumber - 1 ? params.substring(start, paramsNameNumber) : params.substring(start, end) + '\n';
                                                    newParamsName += tempStr;
                                                }
                                            } else {
                                                newParamsName = params;
                                            }
                                            return newParamsName;
                                        },
                                    },
                                }],
                                yAxis: [{
                                    type: 'value',
                                    name: '油耗',
                                    nameTextStyle: {
                                        color: "#ffffff",
                                        fontSize: 10,
                                        padding: [0, 0, 0, -20], // name文字位置 对应 上右下左
                                    },
                                    // 文字属性
                                    axisLabel: {
                                        formatter: '{value} L',
                                        color: '#f9f7fd',
                                    },
                                    axisTick: {
                                        // 是否显示坐标轴刻度
                                        show: false,
                                        // true = 图形在刻度中间， false = 图形在刻度之间
                                        alignWithLabel: false
                                    },
                                    splitLine: {
                                        lineStyle: {
                                            type: 'dashed',
                                            color: 'rgba(0, 240, 255, 0.3)'
                                        }
                                    },
                                },
                                    {
                                        type: 'value',
                                        name: '节油百分比',
                                        nameTextStyle: {
                                            color: "#ffffff",
                                            fontSize: 10,
                                            padding: [0, 0, 0, 20], // name文字位置 对应 上右下左
                                        },
                                        axisLabel: {
                                            formatter: '{value} %',
                                            color: '#f9f7fd'
                                        },
                                        axisTick: {
                                            // true意思：图形在刻度中间
                                            // false意思：图形在刻度之间
                                            alignWithLabel: false,
                                            show: false
                                        },
                                        splitLine: {
                                            lineStyle: {
                                                type: 'dashed',
                                                color: 'rgba(0, 240, 255, 0.3)'
                                            }
                                        },
                                    }
                                ],
                                series: [
                                    {
                                        name: '油耗',
                                        type: 'bar',
                                        yAxisIndex: 0,
                                        data: yData2,
                                        // 颜色
                                        itemStyle: {
                                            // 提供的工具函数生成渐变颜色
                                            color: new echarts.graphic.LinearGradient(
                                                // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#00fffb'}, // 0 起始颜色
                                                    {offset: 1, color: '#0061ce'}  // 1 结束颜色
                                                ]
                                            )
                                        },
                                    },
                                    {
                                        name: '节油百分比',
                                        yAxisIndex: 1,
                                        type: 'bar',
                                        data: yData,
                                        // 颜色
                                        itemStyle: {
                                            // 提供的工具函数生成渐变颜色
                                            color: new echarts.graphic.LinearGradient(
                                                // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#ffffff'}, // 0 起始颜色
                                                    {offset: 1, color: '#8e31ff'}  // 1 结束颜色
                                                ]
                                            )
                                        },
                                    }
                                ]
                            };
                            myechart.setOption(option);
                        }
                    },
                });
            }
        },
    });
})();

//自动驾驶平均速度
(function () {
    var dataDay = {
        day365: {days: 365},
        day90: {days: 90},
        day30: {days: 30},
        day1: {days: 1}
    };
    debugger
    // var myechart = echarts.init($('.pie')[0]);
    var myechart = echarts.init(document.getElementById("autoDrive"));
    var myechart2 = echarts.init(document.getElementById("manDrive"));
    var autoSpeed = 70, manSpeed = 70, days = [1, 30, 90, 365];
    var data;
    $.ajax({
        url: '/iot-web/locweb/largeScreenController/getAvgAutoSpeed?days=' + days,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        data: 12,
        success: function (data) {
            if (data.success) {
                data = data.data;
                autoSpeed = data[365].avgAutoSpeed;
                manSpeed = data[365].avgSpeed;
            }
            option = {
                series: [
                    {
                        type: 'gauge',
                        radius: '90%',
                        min: 0,
                        max: 300,
                        splitNumber: 10,
                        //框线宽度覆盖
                        progress: {
                            show: true,
                            width: 10
                        },
                        //框线宽度背景
                        axisLine: {
                            lineStyle: {
                                width: 8
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        //格线
                        splitLine: {
                            length: 0,
                            lineStyle: {
                                width: 0,
                                color: '#fff'
                            }
                        },
                        //格字
                        axisLabel: {
                            distance: 10,
                            color: '#fff',
                            fontSize: 5
                        },
                        pointer: {
                            length: '70%',
                            width: 5,
                        },
                        //指针中心点
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 15,
                            itemStyle: {
                                borderWidth: 7
                            }
                        },
                        title: {
                            show: false
                        },
                        //下面速度
                        detail: {
                            valueAnimation: true,
                            fontSize: 15,
                            offsetCenter: [0, '90%']
                        },
                        data: [
                            {
                                value: autoSpeed
                            }
                        ]
                    }
                ]
            };
            option2 = {
                series: [
                    {
                        type: 'gauge',
                        radius: '90%',
                        min: 0,
                        max: 300,
                        splitNumber: 10,
                        //框线宽度覆盖
                        progress: {
                            show: true,
                            width: 10
                        },
                        //框线宽度背景
                        axisLine: {
                            lineStyle: {
                                width: 8
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        //格线
                        splitLine: {
                            length: 0,
                            lineStyle: {
                                width: 0,
                                color: '#fff'
                            }
                        },
                        //格字
                        axisLabel: {
                            distance: 10,
                            color: '#fff',
                            fontSize: 5
                        },
                        //指针
                        pointer: {
                            length: '70%',
                            width: 5,
                        },
                        //中心点
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 15,
                            itemStyle: {
                                borderWidth: 7
                            }
                        },
                        title: {
                            show: false
                        },
                        //下面速度
                        detail: {
                            valueAnimation: true,
                            fontSize: 15,
                            offsetCenter: [0, '90%']
                        },
                        data: [
                            {
                                value: manSpeed
                            }
                        ]
                    }
                ]
            };
            myechart.setOption(option);
            myechart2.setOption(option2);
            $('.order').on('click', '.filter a', function () {
                //点击之后加类名
                $(this).addClass('active').siblings().removeClass('active');
                // 先获取点击a的 data-key自定义属性
                var key = $(this).attr('data-key');
                //获取自定义属性
                // data{}==>data.shuxing data['shuxing]
                // key = data[key];//
                days = dataDay[key];
                autoSpeed = data[days.days].avgAutoSpeed;
                manSpeed = data[days.days].avgSpeed;
                if (!(data == null || data == '' || data == undefined)) {
                    option.series[0].data[0].value = data[days.days].avgAutoSpeed;
                    option2.series[0].data[0].value = data[days.days].avgSpeed;
                    myechart.setOption(option);
                    myechart2.setOption(option2);
                }
            });
            //定时器
            var index = 0;
            var aclick = $('.order a');
            setInterval(function () {
                index++;
                if (index > 3) {
                    index = 0;
                }
                //每san秒调用点击事件
                aclick.eq(index).click();
            }, 60000);
        }
    });
})();

// 车辆平均油耗
(function () {
    var myechart = echarts.init(document.getElementById("AverageFuelConsumption"));
    // 中间省略的数据  准备三项
    var url = "/iot-web/jobweb/iotOperationScreenController/queryAverageFuelConsumption";
    var xRes = [];
    var yRes = [];

    //测试使用数据（正式使用请注释）
    var xResTemp = ["L1", "L2", "L3", "L4", "L5", "L6", "L7"];

    $.ajax({
        url: url,
        async: false,
        dataType: 'json',
        type: "post",
        success: function (data) {
            if (data.success) {
                $.each(data.data, function (index, obj) {
                    xRes.push(obj.vehicleType);
                    yRes.push(obj.aveHundredOilCast)
                });

                //测试数据
                if (xRes.length == 0) {
                    xRes = xResTemp;
                    $.each(xRes, function (index, obj) {
                        yRes.push(Math.round(Math.random() * 99));
                    });
                }
            }
        },
    });

    var item = {
        name: '',
        value: 1200,
        // 柱子颜色
        itemStyle: {
            color: '#254065'
        },
        // 鼠标经过柱子颜色
        emphasis: {
            itemStyle: {
                color: '#254065'
            }
        },
        // 工具提示隐藏
        tooltip: {
            extraCssText: 'opacity:0'
        }
    };
    var option = {
        // 工具提示
        tooltip: {
            // 触发类型  经过轴触发axis  经过轴触发item
            trigger: 'item',
            // 轴触发提示才有效
            axisPointer: {
                // 默认为直线，可选为：'line' 线效果 | 'shadow' 阴影效果
                type: 'shadow'
            }
        },
        // 图表边界控制
        grid: {
            // 距离 上右下左 的距离
            left: '0',
            right: '3%',
            bottom: '3%',
            top: '5%',
            // 大小是否包含文本【类似于boxsizing】
            containLabel: true,
            //显示边框
            show: false,
            //边框颜色
            borderColor: 'rgba(0, 240, 255, 0.3)'
        },
        // 控制x轴
        xAxis: [
            {
                // 使用类目，必须有data属性
                type: 'category',
                // 使用 data 中的数据设为刻度文字
                data: xRes,
                // 刻度设置
                axisTick: {
                    // true意思：图形在刻度中间
                    // false意思：图形在刻度之间
                    alignWithLabel: false,
                    show: false
                },
                //文字
                axisLabel: {
                    color: '#f9f7fd'
                }
            }
        ],
        // 控制y轴
        yAxis: [
            {
                // 使用数据的值设为刻度文字
                type: 'value',
                axisTick: {
                    // true意思：图形在刻度中间
                    // false意思：图形在刻度之间
                    alignWithLabel: false,
                    show: false
                },
                //文字
                axisLabel: {
                    color: '#f9f7fd'
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(0, 240, 255, 0.3)'
                    }
                },
            }
        ],
        // 控制x轴
        series: [
            {
                // series配置
                // 颜色
                itemStyle: {
                    // 提供的工具函数生成渐变颜色
                    color: new echarts.graphic.LinearGradient(
                        // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#00fffb'}, // 0 起始颜色
                            {offset: 1, color: '#0061ce'}  // 1 结束颜色
                        ]
                    )
                },
                // 图表数据名称
                name: '车辆平均油耗',
                // 图表类型
                type: 'bar',
                // 柱子宽度
                barWidth: '40%',
                // 数据
                data: yRes
            }
        ]
    };
    myechart.setOption(option);
})();

// (function () {
//     // var myechart = echarts.init($('.pie')[0]);
//     var myechart = echarts.init(document.getElementById("pie"));
//     option = {
//         // 控制提示
//         tooltip: {
//             // 非轴图形，使用item的意思是放到数据对应图形上触发提示
//             trigger: 'item',
//             // 格式化提示内容：
//             // a 代表图表名称 b 代表数据名称 c 代表数据  d代表  当前数据/总数据的比例
//             formatter: "{a} <br/>{b} : {c} ({d}%)"
//         },
//         // 控制图表
//         series: [
//             {
//                 // 图表名称
//                 name: '地区',
//                 // 图表类型
//                 type: 'pie',
//                 // 南丁格尔玫瑰图 有两个圆  内圆半径10%  外圆半径70%
//                 // 百分比基于  图表DOM容器的半径
//                 radius: ['10%', '70%'],
//                 // 图表中心位置 left 50%  top 50% 距离图表DOM容器
//                 center: ['50%', '50%'],
//                 // 半径模式，另外一种是 area 面积模式
//                 roseType: 'radius',
//                 // 数据集 value 数据的值 name 数据的名称
//                 data: [
//                     { value: 20, name: '云南' },
//                     { value: 5, name: '北京' },
//                     { value: 15, name: '山东' },
//                     { value: 25, name: '河北' },
//                     { value: 20, name: '江苏' },
//                     { value: 35, name: '浙江' },
//                     { value: 30, name: '四川' },
//                     { value: 40, name: '湖北' }
//                 ],
//                 //文字调整
//                 label: {
//                     fontSize: 10
//                 },
//                 //引导线
//                 labelLine: {
//                     length: 8,
//                     length2: 10
//                 }
//             }
//         ],
//         color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff']
//     };
//     myechart.setOption(option);
//     myechart.on('click',  function(param) {
//         alert("来了老弟！")
//         // setTimeout(function(){
//         //     location.href = "https://baidu.com";
//         // },20000);
//     });
//
// })();

// 自动驾驶里程及油耗趋势
(function () {
    var xDataAMAMO = [];
    var yDataAMAMO = [];
    var yData2AMAMO = [];

    //测试使用数据（正式使用请注释）
    var yDataAMAMOTemp = [];
    var yData2AMAMOTemp = [];
    $.ajax({
        //按月统计
        url: "/iot-web/jobweb/iotOperationScreenController/getAutoMileageAndOil?month=12",

        //按天统计
        // url: "/iot-web/locweb/largeScreenController/getAutoMileageAndOil?days=12",
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        success: function (data) {
            if (data.success) {
                $.each(data.data, function (index, obj) {
                    if (null != obj) {
                        xDataAMAMO.push(obj.dayTime + "月");
                        yDataAMAMO.push(obj.autoDrivingMileage);
                        yData2AMAMO.push(obj.autoOilCast);

                        //测试数据
                        yDataAMAMOTemp.push(Math.round(Math.random() * 500) + 100);
                        yData2AMAMOTemp.push(Math.round(Math.random() * 500));
                    }
                });

                //测试使用数据
                if (yDataAMAMO.every(item => item == null)) {
                    yDataAMAMO = yDataAMAMOTemp;
                }
                if (yData2AMAMO.every(item => item == null)) {
                    yData2AMAMO = yData2AMAMOTemp;
                }


                // 中间省略的数据  准备三项
                var item = {
                    name: '',
                    value: 1200,
                    // 柱子颜色
                    itemStyle: {
                        color: '#254065'
                    },
                    // 鼠标经过柱子颜色
                    emphasis: {
                        itemStyle: {
                            color: '#254065'
                        }
                    },
                    // 工具提示隐藏
                    tooltip: {
                        extraCssText: 'opacity:0'
                    }
                };
                const colors = ['#842AE6', '#0061ce'];
                var option = {
                    color: colors,
                    // 工具提示
                    tooltip: {
                        // 触发类型  经过轴触发axis  经过轴触发item
                        trigger: 'item',
                        // 轴触发提示才有效
                        axisPointer: {
                            // 默认为直线，可选为：'line' 线效果 | 'shadow' 阴影效果
                            type: 'shadow'
                        }
                    },
                    // 图表边界控制
                    grid: {
                        // 距离 上右下左 的距离
                        left: '0',
                        right: '3%',
                        bottom: '3%',
                        top: '20%',
                        // 大小是否包含文本【类似于boxsizing】
                        containLabel: true,
                        //显示边框
                        show: false,
                        //边框颜色
                        borderColor: 'rgba(0, 240, 255, 0.3)'
                    },

                    // 控制x轴
                    xAxis: [
                        {
                            // 使用类目，必须有data属性
                            type: 'category',
                            // 使用 data 中的数据设为刻度文字
                            data: xDataAMAMO,
                            // 刻度设置
                            axisTick: {
                                // true意思：图形在刻度中间
                                // false意思：图形在刻度之间
                                alignWithLabel: false,
                                show: false
                            },
                            //文字
                            axisLabel: {
                                color: '#f9f7fd'
                            }
                        }
                    ],
                    // 控制y轴
                    yAxis: [
                        {
                            type: 'value',
                            name: '油耗',
                            position: 'right',
                            alignTicks: true,
                            nameTextStyle: {
                                color: "#ffffff",
                                fontSize: 10,
                                padding: [0, 0, 0, 20], // name文字位置 对应 上右下左
                            },
                            axisLine: {
                                show: true,
                            },
                            axisLabel: {
                                color: '#f9f7fd',
                                formatter: '{value}L'
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed',
                                    color: 'rgba(0, 240, 255, 0.3)'
                                }
                            },
                        },
                        {
                            // 使用数据的值设为刻度文字
                            type: 'value',
                            name: '里程',
                            nameTextStyle: {
                                color: "#ffffff",
                                fontSize: 10,
                                padding: [0, 0, 0, 20], // name文字位置 对应 上右下左
                            },
                            axisTick: {
                                // true意思：图形在刻度中间
                                // false意思：图形在刻度之间
                                alignWithLabel: false,
                                show: false
                            },
                            //文字
                            axisLabel: {
                                color: '#f9f7fd',
                                formatter: '{value}W'
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    type: 'dashed',
                                    color: 'rgba(0, 240, 255, 0.3)'
                                }
                            },
                        }
                    ],
                    //图例组件
                    legend: {
                        textStyle: {
                            color: '#f9f7fd' // 图例文字颜色
                        },
                        right: '40%'//距离右边10%
                    },
                    // 控制x轴
                    series: [
                        {
                            name: '油耗',
                            type: 'line',
                            data: yData2AMAMO
                        },
                        {
                            name: '里程',
                            type: 'bar',
                            yAxisIndex: 1,
                            itemStyle: {
                                // 提供的工具函数生成渐变颜色
                                color: new echarts.graphic.LinearGradient(
                                    // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#00fffb'}, // 0 起始颜色
                                        {offset: 1, color: '#0061ce'}  // 1 结束颜色
                                    ]
                                )
                            },
                            data: yDataAMAMO,
                            // 柱子宽度
                            barWidth: '50%',
                        }
                    ]
                };
                // var myechart = echarts.init($('.users .bar')[0]);
                var myechart = echarts.init(document.getElementById("bar"));
                myechart.setOption(option);
            }
        },
    });
})();

// 百公里接管次数
(function () {
    var xData = [];
    var yData = [];
    var yData2 = [];

    //测试使用数据（正式使用请注释）
    var yDataTemp = [];
    var yData2Temp = [];

    $.ajax({
        url: '/iot-web/locweb/largeScreenController/getTakeOverNum?days=' + days,
        contentType: "application/x-www-form-urlencoded",
        type: "POST",
        success: function (data) {
            if (data.success) {
                $.each(data.data, function (index, obj) {
                    if (null != obj) {
                        xData.push(obj.etveType);
                        yData.push(obj.takeOverByMileNum);
                        yData2.push(obj.upDownLastMonthRate);

                        //测试数据
                        yDataTemp.push(Math.round(Math.random() * 100) + 50);
                        yData2Temp.push(Math.round(Math.random() * 100));
                    }
                });

                //测试使用数据
                if (yData.every(item => item == null)) {
                    yData = yDataTemp;
                }
                if (yData2.every(item => item == null)) {
                    yData2 = yData2Temp;
                }

                const colors = ['#842AE6', '#eacf19'];
                var option = {
                    color: colors,
                    // 工具提示
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    toolbox: {
                        feature: {
                            magicType: {
                                type: ['stack']
                            },
                            dataView: {}
                        }
                    },
                    // 图表边界控制
                    grid: {
                        // 距离 上右下左 的距离
                        left: '0',
                        right: '3%',
                        bottom: '3%',
                        top: '20%',
                        // 大小是否包含文本【类似于boxsizing】
                        containLabel: true,
                        //显示边框
                        show: true,
                        //边框颜色
                        borderColor: 'rgba(0, 240, 255, 0.3)'
                    },
                    // 控制x轴
                    xAxis: [
                        {
                            // 使用类目，必须有data属性
                            // 使用 data 中的数据设为刻度文字
                            type: 'category',
                            data: xData,
                            // 刻度设置
                            axisTick: {
                                // true意思：图形在刻度中间
                                // false意思：图形在刻度之间
                                alignWithLabel: false,
                                show: false
                            },
                            //文字
                            axisLabel: {
                                color: '#f9f7fd'
                            }
                        }
                    ],
                    // 控制y轴
                    yAxis: [
                        {
                            type: 'value',
                            //name: '同比趋势',
                            nameTextStyle: {
                                color: "#ffffff",
                                fontSize: 12,
                                padding: [0, 100, 0, 20], // name文字位置 对应 上右下左
                            },
                            position: 'right',
                            alignTicks: true,
                            axisLine: {
                                show: true,
                            },
                            axisLabel: {
                                color: '#f9f7fd',
                                formatter: '{value}'
                            },
                            splitLine: {show: false}
                        },
                        {
                            // 使用数据的值设为刻度文字
                            type: 'value',
                            name: '次数',
                            nameTextStyle: {
                                color: "#ffffff",
                                fontSize: 12,
                                padding: [0, 0, 0, 10], // name文字位置 对应 上右下左
                            },
                            axisTick: {
                                // true意思：图形在刻度中间
                                // false意思：图形在刻度之间
                                alignWithLabel: false,
                                show: false
                            },
                            //文字
                            axisLine: {
                                show: true,
                            },
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed',
                                    color: 'rgba(0, 240, 255, 0.3)'
                                }
                            },
                            axisLabel: {
                                color: '#f9f7fd',
                                formatter: '{value}'
                            }
                        }
                    ],
                    //图例组件
                    legend: {
                        textStyle: {
                            color: '#f9f7fd' // 图例文字颜色
                        },
                        right: '26%'//距离右边10%
                    },
                    // 控制x轴
                    series: [
                        {
                            name: '次数',
                            type: 'bar',
                            yAxisIndex: 1,
                            itemStyle: {
                                color: '#eacf19',
                            },
                            data: yData
                        },
                        {
                            name: '同比趋势',
                            type: 'bar',
                            data: yData2
                        }
                    ]
                };
                // var myechart = echarts.init($('.users .bar')[0]);
                var myechart = echarts.init(document.getElementById("overviewAutoNum"));
                myechart.setOption(option);
            }
        },
    });
})();

//订单
(function () {
    var dataDay = {
        day365: {days: '365'},
        day90: {days: '90'},
        day30: {days: '30'},
        day1: {days: '1'}
    };
    var data = {
        day365: {orders: '20,301,987', amount: '99834'},
        day90: {orders: '301,987', amount: '9834'},
        day30: {orders: '1,987', amount: '3834'},
        day1: {orders: '987', amount: '834'}
    };
    //点击事件
    $('.order').on('click', '.filter a', function () {
        //点击之后加类名
        $(this).addClass('active').siblings().removeClass('active');
        // 先获取点击a的 data-key自定义属性
        var key = $(this).attr('data-key');
        //获取自定义属性
        // data{}==>data.shuxing data['shuxing]
        key = data[key];//
        days = dataDay[key];
        $('.order .item h4:eq(0)').text(key.orders);
        $('.order .item h4:eq(1)').text(key.amount);
    });
    //定时器
    var index = 0;
    var aclick = $('.order a');
    setInterval(function () {
        index++;
        if (index > 3) {
            index = 0;
        }
        //每san秒调用点击事件
        aclick.eq(index).click();
    }, 60000);
})();

// 营业额统计图表
/*(function () {
    var option = {
        //鼠标提示工具
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            // 类目类型
            type: 'category',
            // x轴刻度文字
            data: ['2023'],
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#f9f7fd'//文本颜色
            },
            axisLine: {
                show: false//去除轴线
            },
            boundaryGap: true//去除轴内间距
        },
        yAxis: {
            // 数据作为刻度文字
            type: 'value',
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#f9f7fd'//文本颜色
            },
            axisLine: {
                show: true//去除轴线
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(0, 240, 255, 0.3)'
                }
            },
            boundaryGap: false//去除轴内间距
        },
        //图例组件
        legend: {
            textStyle: {
                color: '#f9f7fd' // 图例文字颜色
            },
            right: '10%'//距离右边10%
        },
        // 设置网格样式
        grid: {
            show: true,// 显示边框
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            borderColor: '#012f4a',// 边框颜色
            containLabel: true // 包含刻度文字在内
        },
        series: [{
            name: '预期营业额',
            // 数据
            data: [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
            // 图表类型
            type: 'line',
            // 圆滑连接
            smooth: true,
            itemStyle: {
                color: '#00f2f1'  // 线颜色
            }
        },
        {
            name: '实际营业额',
            // 数据
            data: [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
            // 图表类型
            type: 'line',
            // 圆滑连接
            smooth: true,
            itemStyle: {
                color: '#8e31ff'  // 线颜色
            }
        }]
    };
    var myechart = echarts.init($('.line')[0]);
    myechart.setOption(option);

    let date = new Date();
    let startYear = date.getFullYear()-4;//起始年份
    let endYear = date.getFullYear();//结束年份
    let yearList = [];
    for (var i=startYear;i<=endYear;i++) {
        let obj = {
            name: i,
            value: i+"年",
        }
        yearList.push(obj);
    }
    // x轴刻度文字
    var xAxisData =  {
        year: yearList,
        month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        quarter: ['第一季度', '第二季度', '第三季度', '第四季度']
    }
    //点击效果
    var url = "/iot-web/jobweb/iotOperationScreenController/statsTurnoverByPeriod"
    $.ajax({
        url: url,
        async: false,
        dataType: 'json',
        type: "post",
        success: function (data) {
            var data = data.data;
            if(data == null || data == ''|| data ==undefined){
                data = {year: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
                    month: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
                    quarter: [[0, 0, 0, 0], [0, 0, 0, 0]]}}
            // 初始化显示干线物流数据
            //取出对应的值
            var initXAxisData = xAxisData['year'];
            //将值设置到 图表中
            option.xAxis.data = initXAxisData;
            var yeardata = data['year'];
            option.series[0].data = yeardata[0];
            option.series[1].data = yeardata[1];

            // 再次调用才能在页面显示
            myechart.setOption(option);
            $('.sales ').on('click', '.caption a', function () {
                $(this).addClass('active').siblings('a').removeClass('active');
                //option series   data
                //获取自定义属性值
                var key = $(this).attr('data-type');
                var xdata = xAxisData[key];
                //取出对应的值
                var ydata = data[key];
                //将值设置到 图表中
                option.xAxis.data = xdata;
                option.series[0].data = ydata[0];
                option.series[1].data = ydata[1];
                //再次调用才能在页面显示
                myechart.setOption(option);
            });
            //定时器
            var index = 0;
            var timer = setInterval(function () {
                index++;
                if (index > 4) {
                    index = 0;
                };
                $('.sales .caption a').eq(index).click();
            }, 60000);
        },
    });
})();*/

// 订单状态图表
(function () {
    var xRes = [];
    var yRes = [];
    var yRes1 = [];

    var option = {
        // 工具提示
        tooltip: {
            // 触发类型  经过轴触发axis  经过轴触发item
            trigger: 'item',
            // 轴触发提示才有效
            axisPointer: {
                // 默认为直线，可选为：'line' 线效果 | 'shadow' 阴影效果
                type: 'shadow'
            },
        },
        legend: {
            textStyle: {
                color: '#f9f7fd' // 图例文字颜色
            },
            right: '10%'//距离右边10%
        },
        // 图表边界控制
        grid: {
            // 距离 上右下左 的距离
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '10 %',
            // 大小是否包含文本【类似于boxsizing】
            containLabel: true,
            //显示边框
            show: false,
            //边框颜色
            borderColor: 'rgba(0, 240, 255, 0.3)'
        },
        // 控制x轴
        xAxis: [
            {
                // 使用类目，必须有data属性
                type: 'category',
                // 使用 data 中的数据设为刻度文字
                data: ["所有", "待确认", "执行中", "已完成"],
                // 刻度设置
                axisTick: {
                    // true意思：图形在刻度中间
                    // false意思：图形在刻度之间
                    alignWithLabel: false,
                    show: false
                },
                //文字
                axisLabel: {
                    color: '#f9f7fd'
                }
            }
        ],
        // 控制y轴
        yAxis: [
            {
                // 使用数据的值设为刻度文字
                type: 'value',
                nameTextStyle: {
                    color: "#fff",
                    fontSize: 10,
                    padding: [-20, 0, 0, -10], //name文字位置 对应
                },
                axisTick: {
                    // true意思：图形在刻度中间
                    // false意思：图形在刻度之间
                    alignWithLabel: false,
                    show: false
                },
                //文字
                axisLabel: {
                    color: '#f9f7fd'
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(0, 240, 255, 0.3)'
                    }
                },
            },
            {
                // 使用数据的值设为刻度文字
                type: 'value',
                name: '',
                axisTick: {
                    // true意思：图形在刻度中间
                    // false意思：图形在刻度之间
                    alignWithLabel: false,
                    show: false
                },
                //文字
                axisLabel: {
                    color: '#f9f7fd',
                    formatter: '{value}%'
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(0, 240, 255, 0.3)'
                    }
                },
            }
        ],
        // 控制x轴
        series: [
            {
                // series配置
                // 颜色
                itemStyle: {
                    // 提供的工具函数生成渐变颜色
                    color: new echarts.graphic.LinearGradient(
                        // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#00fffb'}, // 0 起始颜色
                            {offset: 1, color: '#0061ce'}  // 1 结束颜色
                        ]
                    )
                },
                // 图表数据名称
                name: '订单数',
                // 图表类型
                type: 'bar',
                // 柱子宽度
                barWidth: '40%',
                yAxisIndex: 0,
                // 数据
                data: yRes
            }
        ]
    };
    var myechart = echarts.init($('.line')[0]);
    myechart.setOption(option);
    let date = new Date();
    let startYear = date.getFullYear() - 4;//起始年份
    let endYear = date.getFullYear();//结束年份
    let yearList = [];
    for (var i = startYear; i <= endYear; i++) {
        let obj = {
            name: i,
            value: i + "年",
        }
        yearList.push(obj);
    }

    //点击效果
    var activityurl = "/iot-web/jobweb/iotOperationScreenController/getOrderChartStatisData";
    $.ajax({
        url: activityurl,
        async: false,
        dataType: 'json',
        data: {
            operateType: "1"
        },
        type: "post",
        success: function (data) {
            var data = data.data;
            var ydatas = {
                year: [0, 0, 0, 0],
                month: [0, 0, 0, 0],
                quarter: [0, 0, 0, 0]
            }
            if (data != null && data != '' && data != undefined) {
                option.xAxis[0].data = data.xAxisData;
                ydatas.year = data.yearDatas;
                ydatas.month = data.quarterDatas;
                ydatas.quarter = data.monthDatas;
            }
            // 初始化显示年度运营里程数据
            var ydata = ydatas['year'];
            option.series[0].data = ydata;
            // 再次调用才能在页面显示
            myechart.setOption(option);
            $('.sales').on('click', '.caption a', function () {
                $(this).addClass('active').siblings('a').removeClass('active');
                //获取自定义属性值
                var key = $(this).attr('data-type');
                //取出对应的值
                var ydata = ydatas[key];

                option.series[0].data = ydata;
                myechart.setOption(option);
            });
            //定时器
            var index = 0;
            var timer = setInterval(function () {
                index++;
                if (index > 2) {
                    index = 0;
                }
                ;
                $('.sales .caption a').eq(index).click();
            }, 60000);

        },
    });
})();

// 车辆活跃度
(function () {
    var option = {
        //鼠标提示工具
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var htmlStr = params[0].seriesName + '：' + params[0].data + '%';
                return htmlStr;
            }
        },
        xAxis: {
            // 类目类型
            type: 'category',
            // x轴刻度文字
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#f9f7fd'//文本颜色
            },
            axisLine: {
                show: false//去除轴线
            },
            boundaryGap: false//去除轴内间距
        },
        yAxis: {
            // 数据作为刻度文字
            type: 'value',
            axisTick: {
                show: false//去除刻度线
            },
            axisLabel: {
                color: '#f9f7fd',//文本颜色
                formatter: '{value}%'
            },
            axisLine: {
                show: false//去除轴线
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(0, 240, 255, 0.3)'
                }
            },
            boundaryGap: false//去除轴内间距
        },
        //图例组件
        legend: {
            textStyle: {
                color: '#f9f7fd' // 图例文字颜色
            },
            right: '10%'//距离右边10%
        },
        // 设置网格样式
        grid: {
            show: true,// 显示边框
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            borderColor: '#012f4a',// 边框颜色
            containLabel: true // 包含刻度文字在内
        },
        series: [{
            name: '车辆活跃度',
            // 数据
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            // 图表类型
            type: 'line',
            // 圆滑连接
            smooth: true,
            itemStyle: {
                color: '#8e31ff'  // 线颜色
            }
        }]
    };
    var myechart = echarts.init(document.getElementById("activity-chart"));
    myechart.setOption(option);

    //点击效果
    var activityurl = "/iot-web/jobweb/iotOperationScreenController/queryVehicleActivity"
    $.ajax({
        url: activityurl,
        async: false,
        dataType: 'json',
        type: "post",
        success: function (data) {
            var data = data.data;
            if (data == null || data == '' || data == undefined) {
                data = {
                    gxwl: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
                    znhw: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
                    znhw: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
                }
            }
            let monthArr = data['months'].map(function(month){
                return month + "月";
            })
            option.xAxis.data = monthArr;
            // 初始化显示干线物流数据
            var gxwldata = data['gxwl'];
            option.series[0].data = gxwldata;
            // 再次调用才能在页面显示
            myechart.setOption(option);
            $('.sales-activity').on('click', '.caption-activity a', function () {
                $(this).addClass('active-activity').siblings('a').removeClass('active-activity');
                //获取自定义属性值
                var key = $(this).attr('data-type');
                key = data[key];
                option.series[0].data = key;
                myechart.setOption(option);
            });
            //定时器
            var index = 0;
            var timer = setInterval(function () {
                index++;
                if (index > 2) {
                    index = 0;
                }
                ;
                $('.sales-activity .caption-activity a').eq(index).click();
            }, 60000);
        },
    });

})();

// 车辆平均油耗
// (function () {
//     var myechart = echarts.init(document.getElementById("AverageFuelConsumption"));
//     // 中间省略的数据  准备三项
//     var url = "/iot-web/jobweb/iotOperationScreenController/getAvgOilByModelType";
//     var xRes = [];
//     var yRes = [];
//
//     var option = {
//         // 工具提示
//         tooltip: {
//             // 触发类型  经过轴触发axis  经过轴触发item
//             trigger: 'item',
//             // 轴触发提示才有效
//             axisPointer: {
//                 // 默认为直线，可选为：'line' 线效果 | 'shadow' 阴影效果
//                 type: 'shadow'
//             },
//         },
//         legend: {
//             textStyle: {
//                 color: '#f9f7fd' // 图例文字颜色
//             },
//             // 颜色
//             itemStyle: {
//                 color: {
//                     x: 0,
//                     y: 0,
//                     x2: 0,
//                     y2: 1,
//                     colorStops: [{
//                         offset: 0, color: '#4ee5f4'    // 0% 处的颜色
//                     }, {
//                         offset: 1, color: '#d3b2ff'   // 100% 处的颜色
//                     }],
//                 }
//             },
//             right: '4%'//距离右边10%
//         },
//         // 图表边界控制
//         grid: {
//             // 距离 上右下左 的距离
//             top: '20%',
//             left: '3%',
//             right: '4%',
//             bottom: '10 %',
//             // 大小是否包含文本【类似于boxsizing】
//             containLabel: true,
//             //显示边框
//             show: false,
//             //边框颜色
//             borderColor: 'rgba(0, 240, 255, 0.3)'
//         },
//         // 控制x轴
//         xAxis: [
//             {
//                 // 使用类目，必须有data属性
//                 type: 'category',
//                 // 使用 data 中的数据设为刻度文字
//                 data: [],
//                 // 刻度设置
//                 axisTick: {
//                     // true意思：图形在刻度中间
//                     // false意思：图形在刻度之间
//                     alignWithLabel: false,
//                     show: false
//                 },
//                 //文字
//                 axisLabel: {
//                     color: '#f9f7fd',
//                     interval: 0, // 使x轴文字显示全
//                 }
//             }
//         ],
//         // 控制y轴
//         yAxis: [
//             {
//                 // 使用数据的值设为刻度文字
//                 type: 'value',
//                 name: 'L/km',
//                 nameTextStyle: {
//                     color: "#fff",
//                     fontSize: 10,
//                     padding: [-20, 0, 0, -10], //name文字位置 对应
//                 },
//                 axisTick: {
//                     // true意思：图形在刻度中间
//                     // false意思：图形在刻度之间
//                     alignWithLabel: false,
//                     show: false
//                 },
//                 //文字
//                 axisLabel: {
//                     color: '#f9f7fd'
//                 },
//                 splitLine: {
//                     lineStyle: {
//                         type: 'dashed',
//                         color: 'rgba(0, 240, 255, 0.3)'
//                     }
//                 },
//             }
//         ],
//         // 控制x轴
//         series: [
//
//             {
//                 // series配置
//                 // 颜色
//                 itemStyle: {
//                     // 提供的工具函数生成渐变颜色
//                     color: new echarts.graphic.LinearGradient(
//                         // (x1,y2) 点到点 (x2,y2) 之间进行渐变
//                         0, 0, 0, 1,
//                         [
//                             {offset: 0, color: '#00fffb'}, // 0 起始颜色
//                             {offset: 1, color: '#0061ce'}  // 1 结束颜色
//                         ]
//                     )
//                 },
//                 // 图表数据名称
//                 name: '平均油耗',
//                 // 图表类型
//                 type: 'bar',
//                 // 柱子宽度
//                 barWidth: '40%',
//                 yAxisIndex: 0,
//                 // 数据
//                 data: []
//             }
//         ]
//     };
//     $.ajax({
//         url: url,
//         async: false,
//         dataType: 'json',
//         type: "post",
//         success: function (data) {
//             if (data.success) {
//                 var xAxisData = data.data.xAxisData;
//                 var yAxisData = data.data.yAxisData;
//                 var subsetIndexs = data.data.subsetIndexs;
//
//                 if (subsetIndexs != undefined && subsetIndexs != null) {
//                     for (let i = 0; i < subsetIndexs.length; i++) {
//                         var itemData =
//                             {
//                                 value: 0,
//                                 itemStyle: {
//                                     color: new echarts.graphic.LinearGradient(
//                                         // (x1,y2) 点到点 (x2,y2) 之间进行渐变
//                                         0, 0, 0, 1,
//                                         [
//                                             {offset: 0, color: '#ffffff'}, // 0 起始颜色
//                                             {offset: 1, color: '#8e31ff'}  // 1 结束颜色
//                                         ]
//                                     )
//                                 }
//                             }
//                         var itemindex = subsetIndexs[i];
//                         var srcitem = yAxisData[itemindex];
//                         itemData.value = srcitem;
//                         yAxisData[itemindex] = itemData;
//                     }
//                 }
//                 if (xAxisData != undefined && xAxisData != null) {
//                     option.xAxis[0].data = xAxisData;
//                 }
//                 if (yAxisData != undefined && yAxisData != null) {
//                     option.series[0].data = yAxisData;
//                 }
//                 myechart.setOption(option);
//             }
//         },
//     });
// })();
