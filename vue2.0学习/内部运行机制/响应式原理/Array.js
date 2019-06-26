// Object.defineProperty 只能适用于对象
// 如果是数组，通过重写函数的方式解决了这个问题

function render() {
  console.log('模拟视图渲染')
}

let obj = [1, 2, 3]

let methods = ['pop', 'shift', 'unshift', 'sort', 'reverse', 'splice', 'push']
// 先获取到原来的原型上的方法
let arrayProto = Array.prototype
// 创建一个自己的原型 并且重写methods这些方法
let proto = Object.create(arrayProto)

methods.forEach(method => {
  proto[method] = function() {
    // AOP
    arrayProto[method].call(this, ...arguments)
    render()
  }
})

function observer(obj) {
  // 把所有的属性定义成set/get的方式
  if (Array.isArray(obj)) {
    obj.__proto__ = proto
    return
  }
  if (typeof obj == 'object') {
    for (let key in obj) {
      defineReactive(obj, key, obj[key])
    }
  }
}
function defineReactive(data, key, value) {
  observer(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      observer(newValue)
      if (newValue !== value) {
        render()
        value = newValue
      }
    }
  })
}
observer(obj)
function $set(data, key, value) {
  defineReactive(data, key, value)
}
obj.push(123, 55)
console.log(obj)

// 一些注意点
// $set如何更新数组
// function $set(data, key, value) {
//   if (Array.isArray(data)) {
//     return data.splice(key, 1, value) // 当前用户调用了splice方法
//   }
//   defineReactive(data, key, value)
// }
// $set(obj, 0, 100) // 不支持数组的长度变化 也不支持数组的内容发生变化 必须通过上面的方法来触发更新 或者替换成一个新的数组比如obj.length--或者 obj[1]=2都是无效的
