/**
 * 使用exports.xxx = value向外暴露一个对象
 */
"use strict"
exports.foo = function () {
  console.log('module3 foo()')
}

exports.bar = function () {
  console.log('module3 bar()')
}