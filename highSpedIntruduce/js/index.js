(function () {
  function getNowFormatDate() {
    let date = new Date(),
      year = date.getFullYear(), //获取完整的年份(4位)
      month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
      strDate = date.getDate(); // 获取当前日(1-31)
    if (month < 10) month = `0${month}`; // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}`; // 如果日是个位数，在前面补0

    return `${year}-${month}-${strDate}`;
  }

  let date = getNowFormatDate();
  document.getElementById("timeDate").innerHTML = date;

  function mytime() {
    var a = new Date();
    var b = a.toLocaleTimeString();
    document.getElementById("time").innerHTML = b;
  }
  setInterval(function () {
    mytime();
  }, 1000);

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
})();
