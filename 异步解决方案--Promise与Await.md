## 前言
异步编程模式在前端开发过程中，显得越来越重要。从最开始的XHR到封装后的Ajax都在试图解决异步编程过程中的问题。随着ES6新标准的到来，处理异步数据流又有了新的方案。我们都知道，在传统的ajax请求中，当异步请求之间的数据存在依赖关系的时候，就可能产生很难看的多层回调，俗称'回调地狱'（callback hell），这却让人望而生畏，**Promise的出现让我们告别回调函数，写出更优雅的异步代码**。在实践过程中，却发现Promise并不完美，Async/Await是近年来JavaScript添加的最革命性的的特性之一，**Async/Await提供了一种使得异步代码看起来像同步代码的替代方法**。接下来我们介绍这两种处理异步编程的方案。
## 一、Promise的原理与基本语法
### 1.Promise的原理
Promise 是一种对异步操作的封装，可以通过独立的接口添加在异步操作执行成功、失败时执行的方法。主流的规范是 Promises/A+。

**Promise中有几个状态**：

- pending: 初始状态, 非 fulfilled 或 rejected；

- fulfilled: 成功的操作，为表述方便，fulfilled 使用 resolved 代替；

- rejected: 失败的操作。

![](https://user-gold-cdn.xitu.io/2018/6/13/163f4ca8f725c942?w=950&h=532&f=webp&s=11688)
**pending可以转化为fulfilled或rejected并且只能转化一次，也就是说如果pending转化到fulfilled状态，那么就不能再转化到rejected。并且fulfilled和rejected状态只能由pending转化而来，两者之间不能互相转换。**

### 2.Promise的基本语法
- Promise实例必须实现then这个方法

- then()必须可以接收两个函数作为参数

- then()返回的必须是一个Promise实例

```
<script src="https://cdn.bootcss.com/bluebird/3.5.1/bluebird.min.js"></script>//如果低版本浏览器不支持Promise，通过cdn这种方式
      <script type="text/javascript">
        function loadImg(src) {
            var promise = new Promise(function (resolve, reject) {
                var img = document.createElement('img')
                img.onload = function () {
                    resolve(img)
                }
                img.onerror = function () {
                    reject('图片加载失败')
                }
                img.src = src
            })
            return promise
        }
        var src = 'https://www.imooc.com/static/img/index/logo_new.png'
        var result = loadImg(src)
        result.then(function (img) {
            console.log(1, img.width)
            return img
        }, function () {
            console.log('error 1')
        }).then(function (img) {
            console.log(2, img.height)
        })
     </script>
```
## 二、Promise多个串联操作
Promise还可以做更多的事情，比如，有若干个异步任务，需要先做任务1，如果成功后再做任务2，任何任务失败则不再继续并执行错误处理函数。要串行执行这样的异步任务，不用Promise需要写一层一层的嵌套代码。

有了Promise，我们只需要简单地写`job1.then(job2).then(job3).catch(handleError);`
其中job1、job2和job3都是Promise对象。

比如我们想实现第一个图片加载完成后，再加载第二个图片，如果其中有一个执行失败，就执行错误函数：
```
       var src1 = 'https://www.imooc.com/static/img/index/logo_new.png'
        var result1 = loadImg(src1) //result1是Promise对象
        var src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg'
        var result2 = loadImg(src2) //result2是Promise对象
        result1.then(function (img1) {
            console.log('第一个图片加载完成', img1.width)
            return result2  // 链式操作
        }).then(function (img2) {
            console.log('第二个图片加载完成', img2.width)
        }).catch(function (ex) {
            console.log(ex)
        })
```
这里需注意的是：**then 方法可以被同一个 promise 调用多次，then 方法必须返回一个 promise 对象**。上例中result1.then如果没有明文返回Promise实例，就默认为本身Promise实例即result1，result1.then返回了result2实例，后面再执行.then实际上执行的是result2.then
## 三、Promise常用方法
**除了串行执行若干异步任务外，Promise还可以并行执行异步任务**。

试想一个页面聊天系统，我们需要从两个不同的URL分别获得用户的个人信息和好友列表，这两个任务是可以并行执行的，用Promise.all()实现如下：
```
var p1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 500, 'P1');
});
var p2 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 600, 'P2');
});
// 同时执行p1和p2，并在它们都完成后执行then:
Promise.all([p1, p2]).then(function (results) {
    console.log(results); // 获得一个Array: ['P1', 'P2']
});
```
有些时候，多个异步任务是为了容错。比如，同时向两个URL读取用户的个人信息，只需要获得先返回的结果即可。这种情况下，用Promise.race()实现：
```
var p1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 500, 'P1');
});
var p2 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 600, 'P2');
});
Promise.race([p1, p2]).then(function (result) {
    console.log(result); // 'P1'
});
```
由于p1执行较快，Promise的then()将获得结果'P1'。p2仍在继续执行，但执行结果将被丢弃。

**总结：Promise.all接受一个promise对象的数组，待全部完成之后，统一执行success**;

**Promise.race接受一个包含多个promise对象的数组，只要有一个完成，就执行success**

接下来我们对上面的例子做下修改，加深对这两者的理解：
```
     var src1 = 'https://www.imooc.com/static/img/index/logo_new.png'
     var result1 = loadImg(src1)
     var src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg'
     var result2 = loadImg(src2)
     Promise.all([result1, result2]).then(function (datas) {
         console.log('all', datas[0])//<img src="https://www.imooc.com/static/img/index/logo_new.png">
         console.log('all', datas[1])//<img src="https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg">
     })
     Promise.race([result1, result2]).then(function (data) {
         console.log('race', data)//<img src="https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg">
     })
```

如果我们组合使用Promise，就可以把很多异步任务以并行和串行的方式组合起来执行
## 四、Async/Await简介与用法
异步操作是 JavaScript 编程的麻烦事，很多人认为async函数是异步操作的终极解决方案。
### 1、Async/Await简介
- async/await是写异步代码的新方式，优于回调函数和Promise。

- async/await是基于Promise实现的，它不能用于普通的回调函数。

- async/await与Promise一样，是非阻塞的。

- async/await使得异步代码看起来像同步代码，再也没有回调函数。但是改变不了JS单线程、异步的本质。
### 2、Async/Await的用法
- 使用await，函数必须用async标识

- await后面跟的是一个Promise实例

- 需要安装babel-polyfill，安装后记得引入   //npm i --save-dev babel-polyfill

```
   function loadImg(src) {
            const promise = new Promise(function (resolve, reject) {
                const img = document.createElement('img')
                img.onload = function () {
                    resolve(img)
                }
                img.onerror = function () {
                    reject('图片加载失败')
                }
                img.src = src
            })
            return promise
        }
     const src1 = 'https://www.imooc.com/static/img/index/logo_new.png'
     const src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg'
     const load = async function(){
        const result1 = await loadImg(src1)
        console.log(result1)
        const result2 = await loadImg(src2)
        console.log(result2) 
     }
     load()
```
**当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。**
## 五、Async/Await错误处理
await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。**try..catch错误处理也比较符合我们平常编写同步代码时候处理的逻辑**。
```
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}
```

## 六、为什么Async/Await更好？
Async/Await较Promise有诸多好处，以下介绍其中三种优势：
### 1. 简洁
使用Async/Await明显节约了不少代码。我们不需要写.then，不需要写匿名函数处理Promise的resolve值，也不需要定义多余的data变量，还避免了嵌套代码。
### 2. 中间值
你很可能遇到过这样的场景，调用promise1，使用promise1返回的结果去调用promise2，然后使用两者的结果去调用promise3。你的代码很可能是这样的:
```
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      return promise2(value1)
        .then(value2 => {        
          return promise3(value1, value2)
        })
    })
}
```
使用async/await的话，代码会变得异常简单和直观
```
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```
### 3.条件语句
下面示例中，需要获取数据，然后根据返回数据决定是直接返回，还是继续获取更多的数据。
```
const makeRequest = () => {
  return getJSON()
    .then(data => {
      if (data.needsAnotherRequest) {
        return makeAnotherRequest(data)
          .then(moreData => {
            console.log(moreData)
            return moreData
          })
      } else {
        console.log(data)
        return data
      }
    })
}
```
代码嵌套（6层）可读性较差，它们传达的意思只是需要将最终结果传递到最外层的Promise。使用async/await编写可以大大地提高可读性:
```
const makeRequest = async () => {
  const data = await getJSON()
  if (data.needsAnotherRequest) {
    const moreData = await makeAnotherRequest(data);
    console.log(moreData)
    return moreData
  } else {
    console.log(data)
    return data    
  }
}
```
## 参考文章
[Async/Await替代Promise的6个理由](https://blog.fundebug.com/2017/04/04/nodejs-async-await/)

[前端的异步解决方案之Promise和Await/Async](https://scq000.github.io/2016/11/05/%E5%89%8D%E7%AB%AF%E7%9A%84%E5%BC%82%E6%AD%A5%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E4%B9%8BPromise%E5%92%8CAwait-Async/)

[廖雪峰的Javascript教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345008539155e93fc16046d4bb7854943814c4f9dc2000)

[[译] Promises/A+ 规范](http://www.ituring.com.cn/article/66566)

[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
