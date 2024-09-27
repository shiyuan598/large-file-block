/*大屏*/
var geoCoordMap = {
    '新疆玛纳斯基地': [86.22, 44.30],
    '九江': [116.00, 29.70],
    '新乡': [116.402217, 35.311657],
    ' ': [79.92, 37.12],
    '  ': [86.85, 47.70],
    '若羌县': [88.17, 39.02],
    '上海': [121.4648, 31.2891],
    '东莞': [113.8953, 22.901],
    '东营': [118.7073, 37.5513],
    '中山': [113.4229, 22.478],
    '临汾': [111.4783, 36.1615],
    '临沂': [118.3118, 35.2936],
    '丹东': [124.541, 40.4242],
    '丽水': [119.5642, 28.1854],
    '乌鲁木齐': [87.9236, 43.5883],
    '佛山': [112.8955, 23.1097],
    '保定': [115.0488, 39.0948],
    '兰州': [103.5901, 36.3043],
    '包头': [110.3467, 41.4899],
    '北京': [116.4551, 40.2539],
    '北海': [109.314, 21.6211],
    '南京': [118.8062, 31.9208],
    '南宁': [108.479, 23.1152],
    '南昌': [116.0046, 28.6633],
    '南通': [121.1023, 32.1625],
    '厦门': [118.1689, 24.6478],
    '台州': [121.1353, 28.6688],
    '合肥': [117.29, 32.0581],
    '呼和浩特': [111.4124, 40.4901],
    '咸阳': [108.4131, 34.8706],
    '哈尔滨': [127.9688, 45.368],
    '唐山': [118.4766, 39.6826],
    '嘉兴': [120.9155, 30.6354],
    '大同': [113.7854, 39.8035],
    '大连': [122.2229, 39.4409],
    '天津': [117.4219, 39.4189],
    '太原': [112.3352, 37.9413],
    '威海': [121.9482, 37.1393],
    '宁波': [121.5967, 29.6466],
    '宝鸡': [107.1826, 34.3433],
    '宿迁': [118.5535, 33.7775],
    '常州': [119.4543, 31.5582],
    '佛山': [113.5107, 23.2196],
    '廊坊': [116.521, 39.0509],
    '延安': [109.1052, 36.4252],
    '张家口': [115.1477, 40.8527],
    '徐州': [117.5208, 34.3268],
    '德州': [116.6858, 37.2107],
    '惠州': [114.6204, 23.1647],
    '成都': [103.9526, 30.7617],
    '扬州': [119.4653, 32.8162],
    '承德': [117.5757, 41.4075],
    '拉萨': [91.1865, 30.1465],
    '无锡': [120.3442, 31.5527],
    '日照': [119.2786, 35.5023],
    '昆明': [102.9199, 25.4663],
    '杭州': [119.5313, 29.8773],
    '枣庄': [117.323, 34.8926],
    '柳州': [109.3799, 24.9774],
    '株洲': [113.5327, 27.0319],
    '武汉': [114.3896, 30.6628],
    '汕头': [117.1692, 23.3405],
    '江门': [112.6318, 22.1484],
    '沈阳': [123.1238, 42.1216],
    '沧州': [116.8286, 38.2104],
    '河源': [114.917, 23.9722],
    '泉州': [118.3228, 25.1147],
    '泰安': [117.0264, 36.0516],
    '泰州': [120.0586, 32.5525],
    '济南': [117.1582, 36.8701],
    '济宁': [116.8286, 35.3375],
    '海口': [110.3893, 19.8516],
    '淄博': [118.0371, 36.6064],
    '淮安': [118.927, 33.4039],
    '深圳': [114.5435, 22.5439],
    '清远': [112.9175, 24.3292],
    '温州': [120.498, 27.8119],
    '渭南': [109.7864, 35.0299],
    '湖州': [119.8608, 30.7782],
    '湘潭': [112.5439, 27.7075],
    '滨州': [117.8174, 37.4963],
    '潍坊': [119.0918, 36.524],
    '烟台': [120.7397, 37.5128],
    '玉溪': [101.9312, 23.8898],
    '珠海': [113.7305, 22.1155],
    '盐城': [120.2234, 33.5577],
    '盘锦': [121.9482, 41.0449],
    '石家庄': [114.4995, 38.1006],
    '福州': [119.4543, 25.9222],
    '秦皇岛': [119.2126, 40.0232],
    '绍兴': [120.564, 29.7565],
    '聊城': [115.9167, 36.4032],
    '肇庆': [112.1265, 23.5822],
    '舟山': [122.2559, 30.2234],
    '苏州': [120.6519, 31.3989],
    '莱芜': [117.6526, 36.2714],
    '菏泽': [115.6201, 35.2057],
    '营口': [122.4316, 40.4297],
    '葫芦岛': [120.1575, 40.578],
    '衡水': [115.8838, 37.7161],
    '衢州': [118.6853, 28.8666],
    '西宁': [101.4038, 36.8207],
    '西安': [109.1162, 34.2004],
    '贵阳': [106.6992, 26.7682],
    '连云港': [119.1248, 34.552],
    '邢台': [114.8071, 37.2821],
    '邯郸': [114.4775, 36.535],
    '郑州': [113.4668, 34.6234],
    '鄂尔多斯': [108.9734, 39.2487],
    '重庆': [107.7539, 30.1904],
    '金华': [120.0037, 29.1028],
    '铜川': [109.0393, 35.1947],
    '银川': [106.3586, 38.1775],
    '镇江': [119.4763, 31.9702],
    '长春': [125.8154, 44.2584],
    '长沙': [113.0823, 28.2568],
    '长治': [112.8625, 36.4746],
    '阳泉': [113.4778, 38.0951],
    '青岛': [120.4651, 36.3373],
    '韶关': [113.7964, 24.7028],
    '晋江': [118.5834, 24.9028],
    '揭阳': [116.35, 23.55],
    '荣成': [122.4169, 37.166],
    '常熟': [120.75, 31.6167],
    '蚌埠': [117.35, 32.92],
    '锦州': [121.1579, 41.1309],
    '芜湖': [118.3841, 31.3894],
    '谢岗': [118.5779, 21.6726],
    '奉贤': [121.4874, 30.908],
    '昆山': [120.9795, 31.3826],
    '漯河': [114.046, 33.576],
    '广州': [113.5107, 23.2196],
};

var VehicleTrackData = [];

var planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';


// // 查询车辆轨迹
// (function () {
//     var url = "/iot-web/jobweb/iotOperationScreenController/queryVehicleTrack"
//     $.ajax({
//         url: url,
//         async: false,
//         dataType: 'json',
//         type: "post",
//         success: function (data) {
//             var listData = data.data;
//             console.log(listData);
//             for (var i = 0; i < listData.length; i++) {
//                 var itemList = listData[i];
//                 for (var j = 0; j < itemList.length; j++) {
//                     if (!geoCoordMap.hasOwnProperty(itemList[j].name)) {
//                         listData.splice(i--, 1);
//                         break;
//                     }
//                 }
//             }
//             console.log(listData);
//             VehicleTrackData = listData;
//         },
//     });
// })();


var line1Data = [
    [{name:'东莞'},{name:'晋江',value:100}],
    // [{name:'无锡'},{name:'深圳',value:100}],
    [{name:'无锡'},{name:'东莞',value:100}],
    [{name:'无锡'},{name:'东莞',value:100}],
    [{name:'无锡'},{name:'福州',value:100}],
    [{name:'福州'},{name:'揭阳',value:100}],
    [{name:'揭阳'},{name:'上海',value:100}],
    [{name:'无锡'},{name:'武汉',value:100}],
    [{name:'武汉'},{name:'常州',value:100}],
    [{name:'常州'},{name:'无锡',value:100}],
    [{name:'无锡'},{name:'晋江',value:100}],
    [{name:'无锡'},{name:'泰州',value:100}],
    [{name:'泰州'},{name:'郑州',value:100}],
    [{name:'东莞'},{name:'上海',value:100}],
    [{name:'上海'},{name:'南通',value:100}],
];
var line2Data = [
    [{name:'泰山'},{name:'东莞',value:10}],
    [{name:'东莞'},{name:'泰州',value:12}],
    [{name:'泰州'},{name:'南通',value:13}],
    [{name:'东莞'},{name:'杭州',value:16}],
    [{name:'杭州'},{name:'东莞',value:17}],
    [{name:'东莞'},{name:'芜湖',value:18}],
    [{name:'芜湖'},{name:'南京',value:19}],
    [{name:'无锡'},{name:'贵阳',value:19}],
    [{name:'贵阳'},{name:'昆明',value:19}],
    [{name:'昆明'},{name:'合肥',value:19}],
    [{name:'合肥'},{name:'无锡',value:19}],
    [{name:'合肥'},{name:'贵阳',value:19}],
    [{name:'贵阳'},{name:'昆明',value:19}],
    [{name:'昆明'},{name:'合肥',value:19}],
    [{name:'东莞'},{name:'芜湖',value:19}],
    [{name:'芜湖'},{name:'蚌埠',value:19}],
    [{name:'蚌埠'},{name:'芜湖',value:19}],
    [{name:'芜湖'},{name:'东莞',value:19}],
    [{name:'大连'},{name:'锦州',value:19}],
    [{name:'锦州'},{name:'东莞',value:19}],
    [{name:'东莞'},{name:'锦州',value:19}],
    [{name:'锦州'},{name:'大连',value:19}],
];
var line3Data = [
    [{name:'东莞'},{name:'宁波',value:20}],
    [{name:'宁波'},{name:'东莞',value:21}],
    // [{name:'谢岗'},{name:'奉贤',value:21}],
    [{name:'宁波'},{name:'东莞',value:21}],
    [{name:'东莞'},{name:'广州',value:21}],
    [{name:'广州'},{name:'沈阳',value:21}],
    [{name:'沈阳'},{name:'东莞',value:21}],
    [{name:'郑州'},{name:'漯河',value:21}],
    [{name:'漯河'},{name:'合肥',value:21}],
    [{name:'合肥'},{name:'漯河',value:21}],
    [{name:'漯河'},{name:'郑州',value:21}],
    [{name:'东莞'},{name:'上海',value:21}],
    [{name:'东莞'},{name:'南京',value:21}],
    [{name:'东莞'},{name:'杭州',value:21}],
];
// var line4Data = [
//     [{name:'成都'},{name:'兰州',value:22}],
//     [{name:'成都'},{name:'合肥',value:23}],
// ];
// var line5Data = [
//     [{name:'东莞'},{name:'台州',value:24}],
//     [{name:'东莞'},{name:'合肥',value:25}],
// ];
// var line6Data = [
//     [{name:'兰州'},{name:'长春',value:26}],
//     [{name:'重庆'},{name:'武汉',value:27}],
// ];


var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};
var lisConfig = [
    ['江苏', line1Data],
    ['佛山', line2Data],
    ['昆明', line3Data],
    // ['成都', line4Data],
    // ['东莞', line5Data],
    // ['重庆', line6Data]
]
var color = ['#1ECCFF', '#FFD356', '#00D0B5'];
var series = [];
lisConfig.forEach(function (item, i) {
    series.push({
        name: item[0],
        type: 'lines',
        zlevel: 1,
        effect: {
            show: true,
            period: 4,
            trailLength: 0.7,
            color: '#fff',
            symbol: 'line',
            symbolSize: 3
        },
        lineStyle: {
            normal: {
                color: color[i],
                width: 0,
                curveness: 0.2
            }
        },
        data: convertData(item[1])
    },
    {
        name: item[0],
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        effect: {
            show: true,
            period: 4,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
            }
        },
        data: convertData(item[1])
    },
    {
        name: item[0],
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                color: '#fff',
                show: true,
                position: 'right',
                formatter: '{b}'
            }
        },
        effectType: false,
        symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAiCAYAAAAKyxrjAAAAAXNSR0IArs4c6QAAEixJREFUWEetmQmUXFWZx/9vre3VXtXV3VW9dzpJZ+3udNJAljYcMCEMIQ5BEMQZRsLgOIoIqECcxhkEV5xRj8BxHB1FNCqMykRiErIIWQgJZCEhnV6T9FJdS9f+6tXb5txb1W3C6CBzqD63llev3n2/7/t/y73N4D0+env7+Gx2nDl69Bn1nT89cPTM9aqePb5n+/Kx225LSHPm+DPv8fLv++nMu11x//5jwebmKiMSiST+3Lnbtm3jmru6pF//YvsjTqcNh44d31tlZW5NTE18rK9vGyfLE3xXVw2TSkHweFBiGKbwbvO+X9+/K+A9n/18V01N3c2RUMB0ewKHBwcHGuvq62rrGxssNqslUBUIWDiOtYkC73I6rMGiXCoNjY3nz5453TC3te3IwMDZ852dSxGpDc9nADvHMSUTGGCBRxiGmXi/QP7cdf4k4DnTtPizhWuLitZtGFp7LJVbk1CYQMAGOZuIWwRRZBsbG2Cz2cCxLApyET63DVxllrhsIB5PojkcQKFQABic3r375WChkA+G6xpRV9843lQXulVgmP2Vnwh993/U27HqJn7jxo3j7yf0nwJk3h4dezDg8f6Lruu8KHA4NjyNWEHBPA+LbCoJu8OOYDAInuNQUlWwLIMqvxc8x6JYVDGa0XDwrSG0u3Q0tzTDZrWCYYHBoWFMxRMAK+43iulfne1/25WKDriL2XGfv2r+gs6uZfbMxIlvLu264aWmBQsm3w/Q/wW48/XB+vqA47DP466WZRksC7xx4gwG+t9GR8di+LweFJUSFKVEvZNKp2EaOpqbGuF2SqipDYMRBJwejgH5KFhWgCDwqIvUwinZIFRmPDcyioOHX4Nkt8AwGciFAnq6lsBU0mYsrYyIomUnz4vPTk5Ovnndddf9v5PVOwDbxXvuu/Guro6O7yhyAalUColEDHt378Tpt06hubUNoiCgWFCQz+YAGHAHQ5BcLtQ1NuPi4Fms27ABy3tWoKamGhbRBpZj4fd5YLWIME1AFFgYpolkIoH9rx6EzWqBrmooFGUs71yCcJUHgtWJVDqDqWgUJphD+ULhpzzL7unu7j71Xr16GWC4bcl9jK5uVTIpj6aqKMgylFIRPM9DEAToug6GMWERLWAZFiZMlEolgBPAW+xgTB1erxfVNdXgOB6h6moqZSLTNatWI1IXgcfrgsjxSCbj2L33FbglO0pKCXk5j+WdS9HY0ADTNMGwDDiWg6ppUBQF0Wh0IpFIHhUF4dnh4eHf3Xzzzem/BJYCtq5fb8mcOhXJTqd+aOjmShgaGJalE5EBkEFOJUigHmAYcoQ8lW3EsBwWLFqKXC6LmuoaXLlyFWwWCzKZNM6PjCCZSsPj8eCRrQ9jbtscZKeT+P2efXDYiERNFAoEsANNTY0wdINOR67PVu6DAOuajslo1Jienh6FaTwbjca219bWnliyZEn+z2ZRv98f5hyux4rZtCgXchtYnneZugnjsl8Qb5EJyTN5Q2Zn6RGWvmeohz+47jqcOXcOkxcvYMmyHqRSSTz26KN4ccfvsfnG6yHZ7QiHayC63RhKxDGwbx9NQIZpIC/LWNHViabGRhiGXjYovTQD05iZ3aSJjXxRLMpIpVPFbDb3+sXxi9vdkvuXPT09594JylTV1GwxdEiFXPoPJZZ73iIKEcZk4FvRC9+iLlzcvR2pMydAsg0FpB4FTKYMR/6IX+12B67bsAH7Dx6CnEmhrmUuRkZH8FjfP+GX23fh7o/djhvWXw2OAcZ1Hc+PjaH+8EGIkgSlVIIsF7BiWReaGpugU8CyByngzJwmsStDBcVxHI1vAp/LZzEVnYrLxeIutaQ+Nzw8/Obp06fH+/r6tNkYtPL8SqEq8BKr6g6SHFruvBe2UDUGnn8O4wf30gvSiagkGToRQZ65AYfTiZtuugkv/PZFKPkMgqEwkpksvvDAZ3H09DksXbQAH7/tFoDhcMpQsWNqEp1HDsIQBSpRkrF7li1Dc3MTdCJReu2yP8i0Fe3Q+cgBEkI0D1TgOZ6jsETq6fT00Xw+9dft7Z2js4AcsHnutWu2TZ4egK5x8C7uRP26jRh44TlEjxwAL4rlSSryYXl+FpQI2mGVcPtHbsFPnv0xDE1HoDqMeDqDB+69FyfODcHjduErWx/El15MQJgvoMtvQNv3MsBz1Hj5fB493d1oaiKAZYmWbVkGKtu2fIwoltReqh4KT3ICjVhYLCKKxWI0mUyuCYfDZ2cB7Vb7lnmbrnl6cN9B5FN58HYXWjbditjx15E+9QZYuwSQQJdlMDxXDn5SJA0dDMfAaXXhb+64HT/4/jMolVRIbi8cHi++cP/9mIjHYbdaceOHNuMHe5IYWCDgkZCIYzu209glgLlcDj3LCWBzBXAmDMu3WE5sM1Amnb+S9yrwZWOIIgFUJgpavjfoCvbPArq97gdZr+crhqKikEzCNABectFXKAVohkFNRw1KJyKvLMgJksOBtvZF+OQ9d+Mn//kjHDp0GMGqIL7+5Ldx1VVXwDAMuCQHTozmsGsog+gCK7Y6BOzY/lu4XS5omkYSBq6ggC2zgGWJVrJ3xYM01ZlGGbCS32fOIgbgeQHFYmFSUbQPBAKBt2cA2YWdnd9mdOMTo6OjVPCk+yCStIhWcDxPrcxxLFi2LCnRYoHNYcfixR245tprsHr1SqTTGUxOTuGZH/4Y0dEBbO37ZyxctIhKTOQZvHI6jeejGbCdDqzWNDD798DpckFVVaQzaaxYtuyPgDNlqBKENI9SiZaTzkz5uDxrkmzOo6gUp0qK1hsIBM7MAn7qkcf7Fi1evDUVj0HgeditFhrIFI7nqWVI8eZ4FlbRAovVAhdpzaqriXLBmComY3EcPHoKeVXHpquvgNfjAy8IMA0DpqHhd2+mYNgFtLa58NqJCYQuHoAkSdB0DYdPjaCzcxlu/MAyKCpZapZVUn4qJxqaYCofKODs8cr3LEP74UIhlchmtTUNDQ1v0V9s7u2Vaq/q3dbVs2a9w2ZHLpuCrpbAchzGxiZRVHU01IUhEEUC8Hk88Pp8sIgCBL5cA2uDPjAcj8Hz4zg/mcSa7oW0ZvE8B01ToRsmfvpKAkvq7ZA1Dt/dNYTbw6dgsTmgaiqmYkksW9aF9rYWaDNZdKbmXgJIBTvjwYpIiSlIjJLEw3EClKKczGTza+rr609RwFtvvSHkqGo90rt2XZ3H7cV0Mg5T13HktYP4wb8/DYcngBVXrsam69dTg3p9fvj8fog8j5qaKsiFIiTJBq+byE3D8FgMjbUBJJNJvPHGMaxatRqqweDBn4wgr5m4IHNY18qiWzgKTrRTwGw6g+Xd3aivr4NuGDP+K0uyAkjjzjSoN0kNNPRyS1cuzzOARKJKJp+XV0cikeMU8M5P3lmrM86TCxf3+FxWAcnpJLX++fOjePFXz9GgXtK1Aj1XraGAJP7cbjc6Ojrg97gQT6ZQH6mmKVrXSFYyYbWKeOqpp/Hynj343veegko8uG8cY9MqDNGBjQttYKaOQBAtdMk1FYuhrW0eGuojtJNhGI7CzUhxJv7I/KSMkOMWixWlkkIVREoHUQsJo5JSzIFRr/L56k5QwC1bttTYQ7VvugKNVVcubcf5C+eRz2UhWqxITychy3lEInXUSkQKwapqOCQnGusjVKbpbA6tTfU0EMjkpEEmY2homC6Gg8EqZAoKvvnCAJbOCeG1uANCKYZrrQeQzBRp51Is5DG3rYU29mQlQecimbsiSSJbEssEnhRzkrndbi/O9feDNBlktZLPy9QooaqAURMJX71580f3UsAPbt7s617e+1Jza1u3CAPDQ+eQz+WolThBoN4kJ5LPAi/AH/CjJlyHuroI9S6phR6XkxbcZCoLpaTAJgpwOx3wSA6ILFDiLPjRK3Fc3xVALDGNf3j0KWxolmHwNqTTKeQyaSxqn4fdu3aj/2w/rblKsUhBJckJycLh3OgFMODg9bnQUl8LVWcQrmuAwHPI5/LweP04fuIkstnk8+tv+ehdT/b1JWfr4Ifv+swnqsPh7zY11mM6HkdJLVFrcJW0PFMiSCBXV4dgtdqRTGeQLxRgs4gI11SjqT6Mpkgt3E47XcSS+IhdHMGbO36B6hXXIS3W4b9+/SKGD2zD/lcPwW630hbNJCWDAd0CKRYVqKUSbJIDakkFacFISDTWReCXJLhdbgSrQyBbJpGmRgT8Xnz1q0/i4tg4racCzxVGhofvSKfTv7okCQN3PfS1L9TXR77ssouInh9BPBZFsVSitY+ptEMkmAl0XWMT6hoaITns8Hs9CAWrMKehBhaBQ6FElloc7SdjsRg+efff4dCr+xCMNOEDH7wBO36/E4JRgN0hoSjLdCVP6mBRLkC0SbDarCgpMux2CTa7A9lUAgJroqW1FZ/91L04fvQgEtNprP+rTZgzfz72/+EVPPHE4yjm87Da7fB7PMpUfOr+k8dPfucywM988fEn1l59zeegq9j10n8jk8nQOLLabBBEkcYG6UZsdjsCfj+uuHIVXE4nXaFraokujgWeGECkNxnyu/H1b/wrvvG1r4DjGCSSSVR53WhpqIctWEOtbbfb0dI2H5MTExgfPofJiXFYHC4UsmkYvAVelwOZ+BSKqor29vnYsuXj+Nlzz8FhteG2O+5AKBTCb367nXZOJLuKooCW5pbU8RNvfGznzj2/uQxw5dp1jzvd7s/fcOOHIOdzSKWmUVIUamUSU+SGiHTI+1CoGuvWr8foxQmMjU8iNZ2EaLWhp3MhOpZ20hW65LTjkYc+j0Ov7qddfzaXo/s3Lm8AteFaLF04H5l0AjJsZWlORzE0MIBQ0AlZVjE6lUM44ITfK2Hvq69jTmsL/vGuLTh65DWauKamk5hKxGjntHLlakxNRaFpOlwu56CilFbs3r2b7uPOxuCmW+58TFXVhzZ++MOIhMMk1Va6F7LuKg+yhUD2ZKyigJHhATz9Hz+G0+mG0+WG3+3Emiu76JqONLyTk5N44L5PYyo6SRUwRbw0GYXD5YU/4MXc1iYocg4aa4NDkpCbTmD4whh8ThvaF7TjpZ17sbKnCwsXL8W3vvkk3RnwOJ0UoqAo0DVtdgVVVR0y87lcydCNuGEYv1AU5WEAdHN5FvDmOz/xpTnz5m9tm9OG7//b1zE02A+rtSxPUm9IoFssFrhcbnzkb7dg7ty56D9zCprOwOP1wE3i0edCMpFEMhbFyVMnsXPHdnx8y93Yd+gNHDu4HyPDgxAsdlQF/ZjX2gBTKyGjshAEEflMEiMXxrFh3bVoaGrFE19+DKtWXYHWlrn4+bafU6BcLqvLclGDaaoMwyiGYcimaaYAjAF4G8ABAIcrn+mquQzY18duSeW+c+WqtffIhTwe+vTf06B3ebx0S5DWtVIJuWyWnr7+xpvxxS99GYxZwtDgAPJyCS6HHa1zmvGjnz0Pv0sCqxXxwi9/hhs23YQDhw4hk05j8Fw/LHYHfG4JfreL9rDJVAa5fB7xeIxm3rVr1yJfkLHv5V2oClUTw2oXL1wosCyrqaVSQdO06QrAEACyRUHGMACyS06+u+xBAXt7e/meazZ+LlwX+QgL0zbcf9ZhmJA6OrvspPEm2wmaoePAK3/A+eFBuN0e3Pe5h+HzeTDQfxapTJYuaDuWLMRb/SMIh4IYPHsajz78AObNn4eCxiGViOHkm8cg2uwgm1qkxhWVckkwDMM0TZMh8vdXhUjsF+OxmMLzvAIgpmnaBQAjAAYqniJAZGOY7Jdq74S69POsRBsbG60Lu7v9bofXl82lFydiiRWp6cQ1PM/OI4WWdC42SSLpXXc53ZrT6WRcHg/pGthwKAS3y8GWNA0TE1GwHM9OTI7hmW9/C9VBD3SWdERpnD8/QvdfSMKia1jD1E3T1EzTJMsH8iqzLDttGAYBOnuJhwjcFACyGVvesPkLH7OApFEBEAJwBYC1AOYCqK4MB0D/9UB6p2JlEqbymFmnVRp9k5QUKy/wtmAgAKdkp5eOJxJGIpkkzlJ1XVdNwyhVEgGR1cWKzPorHiJA0QrQ5Rt8fyHYzGmXAhIAF4BgZTgBkEGOeQC4AUiXHCPvyd0TeCtZGwMQZgbDME5Jclh8Hg+j6boSnYplNU0jHiBJgciLyOw0AAI14yGyv/mePPRuvJcC/l/nEniyy0QARAC2yiCAM9DEAMQYl746OJbldcMgEiRQo5VBJEg8RLLW+wr0Toj/AddzKpsrmxErAAAAAElFTkSuQmCC",
        symbolSize: ['22','16'],
        symbolKeepAspect : true,
        rippleEffect: {
            number: 4,
            brushType: "stroke",
            period: 1,
            scale: 1
          },
        itemStyle: {
            normal: {
                color: color[i]
            }
        },
        data: item[1].map(function (dataItem) {
            return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            };
        })
    });
});

var option = {
    tooltip : {
        trigger: 'item'
    },
    // legend: {
    //     orient: 'vertical',
    //     top: 'bottom',
    //     left: 'right',
    //     data:['北京 Top10', '上海 Top10', '广州 Top10'],
    //     textStyle: {
    //         color: '#fff'
    //     },
    //     selectedMode: 'single'
    // },
    geo: {
        map: 'china',
        label: {
            emphasis: {
                show: false
            }
        },
        zoom : 1.85,
        center: [111.365903, 31.570567],
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#0c2d65c5',// 地图底色
                borderColor: '#819daec4' // 边界色
            },
            emphasis: {
                areaColor: '#0c2d65c5' // 鼠标地图底色
            },
            // shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowColor: '#fff',
            shadowBlur: 10,
            shadowOffsetY: 100,
            shadowOffsetX: 100
        }
    },
    series: series
};

var myecharts = echarts.init($('#geo')[0])
option.series[1].center = [112.336644,34.681585]
option.series[1].layoutCenter = ['50%', '50%'];
option.series[1].layoutSize = '300%';
myecharts.setOption(option)

