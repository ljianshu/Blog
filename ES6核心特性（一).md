## 一、前言

 ES6 虽提供了许多新特性，但我们实际工作中用到频率较高并不多，根据二八法则，我们应该用百分之八十的精力和时间，好好专研这百分之二十核心特性，将会收到事半功倍的奇效。接下来将会三篇文章着重介绍这些核心特性。
 
如果你想了解解构赋值，箭头函数以及展开运算符，请猛戳 [ES6核心特性（二）](https://juejin.im/post/5b2fa7fc51882574df1313b6)


![](https://user-gold-cdn.xitu.io/2018/7/1/16455658630e378d?w=1306&h=719&f=png&s=159524)

## 二、开发环境配置

这部分着重介绍：**babel 编译ES6语法，如何用webpack和rollup实现模块化。**
#### 1.babel
#### 为啥需要babel？
ES6 提供了许多新特性，但并不是所有的浏览器都能够完美支持。下图是各个浏览器对ES6兼容性一览表(以export为例)

![export各个浏览器兼容性一览表](https://user-gold-cdn.xitu.io/2018/5/22/1638599b53c8a48d?w=1240&h=330&f=png&s=56299)

由上图可知，有些浏览器对于ES6并不是很友好，针对 ES6 的兼容性问题，很多团队为此开发出了多种语法解析转换工具(比如babel，jsx，traceur 等)，可以把我们写的 ES6 语法转换成 ES5，相当于在 ES6 和浏览器之间做了一个翻译官。其中[Babel](https://babeljs.io/)是一个广泛使用的转码器，可以将ES6代码转为ES5代码，从而在现有环境执行。
#### 如何配置babel？

```
·首先要先安装node.js，运行npm init，然后会生成package.json文件
·npm install --save-dev babel-core babel-preset-es2015 babel-preset-latest
·创建并配置.babelrc文件//存放在项目的根目录下，与node_modules同级
·npm install -g babel-cli
·babel-version
```
Babel的配置文件是.babelrc，存放在项目的根目录下。该文件用来设置转码规则和插件，具体内容如下：
```
//.babelrc文件
{
    "presets": ["es2015", "latest"],
    "plugins": []
}
```
#### 验证配置是否成功
```
·创建./src/index.js
·内容：[1,2,3].map(item=>item+1）；
·运行babel./src/index.js
```
运行后得到以下部分，说明已经成功配置了babel
```
"use strict";
[1, 2, 3].map(function (item) {
  return item + 1;
});
```
#### 2.webpack
#### 为啥要使用WebPack？
现今的很多网页其实可以看做是功能丰富的应用，它们拥有着复杂的JavaScript代码和一大堆依赖包，模快化工具就应运而生了，其中webpack 功能强大深受人们喜爱。
**Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。**

![](https://user-gold-cdn.xitu.io/2018/5/22/1638599b540a14c4?w=1240&h=543&f=png&s=32942)

#### 如何配置webpack？
```
·npm install webpack babel-loader --save-dev
·创建并配置 webpack.config.js//webpack.config.js文件与package.json同级
·配置 package.json中的scripts
·运行 npm start
```
```
//配置 webpack.config.js  针对.js结尾的文件除了node_modules都用babel解析
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: './build/bundle.js'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    }
}
```
```
//配置 package.json中的scripts
"scripts": {
    "start": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```
#### 3.rollup
Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。通过它可以让你的 bundle 最小化，有效减少文件请求大小，与webpack不同的是，rollup功能单一，但没有冗余代码。既然这两者各有千秋，那我们应该如何选择？**对于打包一个项目的整个应用的话，webpack更适合，对于类库的打包，使用 Rollup效率更高。**

#### 如何配置rollup？
```
·npm init
·npm i rollup rollup-plugin-node-resolve rollup-plugin-babel babel-plugin-external-helpers babel-core babel-preset-latest  --save-dev
·配置.babelrc//与src同级
·配置rollup.config.js//与src同级
·修改package.json的scripts
·运行npm start
```
```
//.babelrc文件中
{
    "presets": [
        ["latest", {
            "es2015": {
                "modules": false
            }
        }]
    ],
    "plugins": ["external-helpers", "babel-plugin-transform-regenerator"]
}
```
```
//配置rollup.config.js
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
export default {
    entry: 'src/index.js',
    format: 'umd',
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    dest: 'build/bundle.js'
}
```
```
//修改package.json的scripts
"scripts": {
    "start": "rollup -c rollup.config.js"
  }
```
## 三、块级作用域

ES5 只有全局作用域和函数作用域（例如，我们必须将代码包在函数内来限制作用域），这导致很多问题：

**情况1：内层变量覆盖外层变量**
```
var tmp = new Date();
function f() {
  console.log(tmp); //undefined
  if (false) {   
    var tmp = "hello world";
  }
}
```
**情况2：变量泄露，成为全局变量**
```
var s = 'hello';
for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}
console.log(i); // 5
```
ES6 提供 let 和 const 来代替 var 声明变量，新的声明方式支持用大括号表示的块级作用域，这会带来一些好处：

**1.不再需要立即执行的函数表达式(IIFE)**
在 ES5 中，我们需要构造一个立即执行的函数表达式去保证我们不污染全局作用域。在 ES6中， 我们可以使用更简单的大括号（{}），然后使用 const 或者 let 代替 var 来达到同样的效果。

**2.循环体中的闭包不再有问题**
在 ES5 中，如果循环体内有产生一个闭包，访问闭包外的变量，会产生问题。在 ES6，你可以使用 “let” 来避免问题。
![](https://user-gold-cdn.xitu.io/2018/5/22/1638599b5402848f?w=1240&h=278&f=png&s=191412)

**3.防止重复声明变量**
ES6 不允许在同一个作用域内用 let 或 const 重复声明同名变量。这对于防止在不同的 js 库中存在重复声明的函数表达式十分有帮助。
## 四、Class 和传统构造函数有何区别

从概念上讲，在 ES6 之前的 JS 中并没有和其他面向对象语言那样的“类”的概念。长时间里，人们把使用 new 关键字通过函数（也叫构造器）构造对象当做“类”来使用。
由于 JS 不支持原生的类，而只是通过原型来模拟，各种模拟类的方式相对于传统的面向对象方式来说非常混乱，尤其是处理当子类继承父类、子类要调用父类的方法等等需求时。
ES6提供了更接近传统语言的写法，引入了Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。**但是类只是基于原型的面向对象模式的语法糖**。
#### 对比在传统构造函数和 ES6 中分别如何实现类：
```
//传统构造函数
function MathHandle(x,y){
  this.x=x；
  this.y=y；
}
MathHandle.prototype.add =function（）{
  return this.x+this.y；
}；
var m=new MathHandle(1,2）；
console.log(m.add()）
```
```
//class语法
class MathHandle {
 constructor(x,y){
  this.x=x；
  this.y=y；
}
 add(){
   return this.x+this.y；
  }
}
const m=new MathHandle(1,2);
console.log(m.add()）
```
这两者有什么联系？其实这两者本质是一样的，只不过是语法糖写法上有区别。所谓语法糖是指计算机语言中添加的某种语法，这种语法对语言的功能没有影响，但是更方便程序员使用。比如这里class语法糖让程序更加简洁，有更高的可读性。
```
typeof MathHandle //"function"
MathHandle===MathHandle.prototype.constructor //true
```
#### 对比在传统构造函数和 ES6 中分别如何实现继承：
```
//传统构造函数继承
function Animal() {
    this.eat = function () {
        alert('Animal eat')
    }
}
function Dog() {
    this.bark = function () {
        alert('Dog bark')
    }
}
Dog.prototype = new Animal()// 绑定原型，实现继承
var hashiqi = new Dog()
hashiqi.bark()//Dog bark
hashiqi.eat()//Animal eat
```
```
//ES6继承
class Animal {
    constructor(name) {
        this.name = name
    }
    eat() {
        alert(this.name + ' eat')
    }
}
class Dog extends Animal {
    constructor(name) {
        super(name) // 有extend就必须要有super，它代表父类的构造函数，即Animal中的constructor
        this.name = name
    }
    say() {
        alert(this.name + ' say')
    }
}
const dog = new Dog('哈士奇')
dog.say()//哈士奇 say
dog.eat()//哈士奇 eat
```
Class之间可以通过extends关键字实现继承，这比ES5的通过修改原型链实现继承，要清晰和方便很多。
#### Class 和传统构造函数有何区别
- Class 在语法上更加贴合面向对象的写法
- Class 实现继承更加易读、易理解，对初学者更加友好
- 本质还是语法糖，使用prototype


## 五、Promise的基本使用和原理

**Promise 是异步编程的一种解决方案，比传统的解决方案(回调函数和事件)更合理和更强大。**

![回调地狱](https://user-gold-cdn.xitu.io/2018/5/22/1638599b54398625?w=632&h=393&f=png&s=9521)

ES6中的promise的出现给我们很好的解决了**回调地狱**的问题，所谓的回调地狱是指当太多的异步步骤需要一步一步执行，或者一个函数里有太多的异步操作，这时候就会产生大量嵌套的回调，使代码嵌套太深而难以阅读和维护。ES6认识到了这点问题，现在promise的使用，完美解决了这个问题。
#### Promise原理
**promise 对象初始化状态为 pending ；当调用resolve(成功)，会由pending => fulfilled ；当调用reject(失败)，会由pending => rejected**。具体流程见下图：

![Promise原理](https://user-gold-cdn.xitu.io/2018/5/22/1638599b541da506?w=950&h=532&f=png&s=91906)

#### Promise的使用流程
1. new Promise一个实例，而且要 return
1. new Promise 时要传入函数，函数有resolve reject 两个参数
1. 成功时执行 resolve，失败时执行reject
1. then 监听结果
```
function loadImg(src){
   const promise=new Promise(function(resolve,reject){
     var img=document.createElement（'img'）
     img.onload=function（）{
        resolve(img)
   }
     img.onerror=function（）{
        reject（）
   }
    img.src=src
 })
  return promise//返回一个promise实例
}
var src="http://www.imooc.com/static/img/index/logo_new.png"
var result=loadImg(src)
result.then(function(img){
    console.log(img.width)//resolved(成功)时候的回调函数
},function（）{
    console.log（“failed“）//rejected(失败)时候的回调函数
})
result.then(function(img){
    console.log(img.height)
})
```
promise会让代码变得更容易维护，像写同步代码一样写异步代码,同时业务逻辑也更易懂。

如果想了解更多Promise异步请求方案，请猛戳[异步解决方案----Promise与Await](https://juejin.im/post/5b1962616fb9a01e7c2783a8)
## 六、ES6模块化

ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。**其模块功能主要由两个命令构成：export和import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。**
```
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
    ele.textContent = add(99 + basicNum);
}
```
如上例所示，使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。
```
// export-default.js
export default function () {
  console.log('foo');
}
```
上面代码是一个模块文件export-default.js，它的默认输出是一个函数。
**其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。** 
```
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```
上面代码的import命令，可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名。**需要注意的是，这时import命令后面，不使用大括号。** 

**未完待续
To be continued...**
## 七、参考文章

#### [ES6笔记（一）：ES6所改良的javascript“缺陷”](http://www.cnblogs.com/yzg1/p/5776171.html)
#### [在 ES6 中 改良的 5 个 JavaScript “缺陷”](https://www.h5jun.com/post/5-javascript-%E2%80%9Cbad%E2%80%9D-parts-that-are-fixed-in-es6.html)
#### [ECMAScript 6 入门之模块化](http://es6.ruanyifeng.com/#docs/module)
