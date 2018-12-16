'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 统一暴露
function fun1() {
  console.log('fun1() module2');
}
function fun2() {
  console.log('fun2() module2');
}
exports.fun1 = fun1;
exports.fun2 = fun2;