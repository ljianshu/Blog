(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 1. 定义暴露模块:
    module.exports = value;
    exports.xxx = value;
 2. 引入模块:
    var module = require(模块名或模块路径);
 */
"use strict"
//引用模块
let module1 = require('./module1')
let module2 = require('./module2')
let module3 = require('./module3')

let uniq = require('uniq')

//使用模块
module1.foo()
module2()
module3.foo()
module3.bar()

console.log(uniq([1,3,1,4,3]))

},{"./module1":2,"./module2":3,"./module3":4,"uniq":5}],2:[function(require,module,exports){
/**
 * 使用module.exports = value向外暴露一个对象
 */
"use strict"
module.exports = {
    foo() {
        console.log('moudle1 foo()')
    }
}
},{}],3:[function(require,module,exports){
/**
 * 使用module.exports = value向外暴露一个函数
 */
"use strict"
module.exports = function () {
    console.log('module2()')
}
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict"

function unique_pred(list, compare) {
  var ptr = 1
    , len = list.length
    , a=list[0], b=list[0]
  for(var i=1; i<len; ++i) {
    b = a
    a = list[i]
    if(compare(a, b)) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique_eq(list) {
  var ptr = 1
    , len = list.length
    , a=list[0], b = list[0]
  for(var i=1; i<len; ++i, b=a) {
    b = a
    a = list[i]
    if(a !== b) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique(list, compare, sorted) {
  if(list.length === 0) {
    return list
  }
  if(compare) {
    if(!sorted) {
      list.sort(compare)
    }
    return unique_pred(list, compare)
  }
  if(!sorted) {
    list.sort()
  }
  return unique_eq(list)
}

module.exports = unique

},{}]},{},[1]);
