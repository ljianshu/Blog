'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;
exports.bar = bar;
// 分别暴露
function foo() {
  console.log('foo() module1');
}
function bar() {
  console.log('bar() module1');
}