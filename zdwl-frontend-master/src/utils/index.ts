/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string): boolean {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */

export function isExternal(path: string): boolean {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

import { exportFileApi } from "@/api/vehicleInfo";
export function exportFile(params: unknown, url: string) {
  exportFileApi(params, url).then(response => {
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });
    const a = document.createElement("a");
    const href = window.URL.createObjectURL(blob); // 下载的链接
    a.href = href;
    a.download = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    ); // 获取后台设置的文件名称
    document.body.appendChild(a);
    a.click(); // 点击导出
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
    ElMessage.success('导出成功')
  }).catch(() => {
    ElMessage.error('导出失败')
  })
}
/**
 * string 转 arraybuffer
 * @param {string} str
 * @returns {ArrayBuffer}
 */
export function stringToArrayBuffer(str: string): ArrayBuffer {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  var array = new Int8Array(bytes.length);
  for (var i = 0; i <= bytes.length; i++) {
    array[i] = bytes[i];
  }
  return array.buffer;
}

export function arrayBufferToString(buffer: ArrayBuffer) {
  return String.fromCharCode.apply(null, [...new Uint8Array(buffer)])
}

export function calculate(num1: any, num2: any, operator: any) {

  // 判断类型和值是否正确
  if (typeof num1 !== 'number' || typeof num2 !== 'number' || isNaN(num1) || isNaN(num2)) {
    return null;
  }

  // 判断运算符是否正确
  if (operator !== '+' && operator !== '-' && operator !== '*' && operator !== '/') {
    return null;
  }

  // 正则验证
  if (!/^-?\d+(\.\d+)?$/.test(num1) || !/^-?\d+(\.\d+)?$/.test(num2)) {
    return NaN;
  }

  // 将两个数扩大相应倍数
  const multiplier = Math.pow(10, Math.max(getDecimalDigits(num1), getDecimalDigits(num2)));
  const int1 = Math.round(num1 * multiplier);
  const int2 = Math.round(num2 * multiplier);

  // 进行数值运算
  let result;

  switch (operator) {
    case "+":
      result = (int1 + int2) / multiplier;
      break;
    case "-":
      result = (int1 - int2) / multiplier;
      break;
    case "*":
      result = (int1 * int2) / Math.pow(multiplier, 2);
      break;
    case "/":
      result = (int1 / int2) * (multiplier / Math.pow(10, getDecimalDigits(num2)));
      break;
    default:
      result = NaN;
  }

  return result;
}

const getDecimalDigits = (num: any) => {
  if (Number.isInteger(num)) {
    return 0;
  }

  return num.toString().split(".")[1].length;
}