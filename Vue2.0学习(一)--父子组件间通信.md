![vue2.0](https://user-gold-cdn.xitu.io/2018/6/2/163bc1e738639502?w=628&h=214&f=png&s=18260)

Vue.js是一套构建用户界面的**渐进式框架**。本文将介绍一些重要入门的知识点，比如：运行环境的搭建、定义组件的方式、引用模板、动态组件和父子组件间数据通信等等，希望对你们有些许帮助！

## 一、运行环境搭建

Vue引入方式一般有三种：

**第一种CDN引入**
```
<script src="[https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue)"></script>
```
**第二种使用 NPM 安装**
```
$ npm install vue//安装最新稳定版
```
**第三种搭建脚手架CLI**
**所谓脚手架是通过webpack搭建的开发环境**，用于快速搭建大型单页面应用程序。能够为现代前端开发的工作流程，带来持久强力的基础架构。只需几分钟，就可以建立并运行一个带有“热重载、保存时代码检查以及可直接用于生产环境的构建配置”的项目。

首先必须先[安装node.js](https://nodejs.org/zh-cn/),Node.js 在 0.6.3 版本开始内建npm，所以安装好node.js后,npm也就装好。然后在通过git bash 操作以下命令行：
```
$ node -v//检查是否已经装好了node
$ npm -v//检查是否已经装好了npm
$ npm install --global vue-cli //安装 vue-cli
$ vue init webpack project//进入目标文件夹创建一个新项目
$ cd project//进入新项目
$ npm install//安装package.json中依赖的node_modules
$ npm run dev//运行该项目
```
**对于大陆用户，建议将npm的注册表源设置为国内的镜像，可以大幅提升安装速度**。推荐使用这种安装脚手架。
```
npm config set registry https://registry.npm.taobao.org//配置淘宝镜像
npm config get registry//验证是否成功
npm install -g cnpm --registry=https://registry.npm.taobao.org//安装cnpm
cnpm install -g vue-cli//cnpm安装脚手架
vue init webpack my-project
cd my-project
cnpm install
cnpm run dev
```
最后打开http://localhost:8080，就出现下面的页面，标志着脚手架搭建完成了。
![](https://user-gold-cdn.xitu.io/2018/6/2/163bc1e7388cbfe8?w=826&h=571&f=png&s=48626)

## 二、介绍SRC文件流程及根组件App

脚手架搭建完成后，project里面各个文件夹及文件，如下图：
![脚手架各个文件和文件夹](https://user-gold-cdn.xitu.io/2018/6/2/163bc1e738dfd600?w=367&h=598&f=png&s=37057)
#### 1.src文件流程介绍
**index.html(入口文件)=>main.js=>App.vue（根组件）**，根组件中模板内容就直接插入到入口文件中#app处，然后再将页面呈现出来。
#### 2.根组件App介绍
**主要由三部分组成，分别为模板（html结构），行为（处理逻辑）和样式（解决样式）**

## 三、定义组件的方式

**通常可以分为组件全局定义和组件局部定义，后者比较常见。**

#### 1.组件全局定义
一般以下两个步骤：

①main.js引入子组件

②App.vue组件中template调用
```
//main.js
import Vue from 'vue'
import App from './App'
import Users from "./components/Users";//引入子组件Users
Vue.config.productionTip = false
Vue.component("users",Users);//自定义名字便于App.vue组件调用，后者为组件名
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```
```
//App.vue组件
<template>
  <div id="app">
   <users></users>//在这里调用，自定义名字是小写的
  </div>
</template>
```
还可以**先创建组件构造器，然后由组件构造器创建组件**，不过这种比较少用：
```
<div id="itany">
   <hello></hello>
</div>
...
//使用Vue.extend()创建一个组件构造器
var MyComponent=Vue.extend({
	template:'<h3>Hello World</h3>'
});
//使用Vue.component(标签名,组件构造器)，根据组件构造器来创建组件
Vue.component('hello',MyComponent);
var vm=new Vue({ //这里的vm也是一个组件，称为根组件Root
	el:'#itany',
	data:{
	  msg:'前端'
	}
});
```
#### 2.组件局部定义
一般以下三个步骤：

①import引入子组件

②export default注册子组件

③template模板中加入子组件

![根组件App](https://user-gold-cdn.xitu.io/2018/6/2/163bc1e738f3f29a?w=652&h=604&f=png&s=246746)

## 四、引用模板和动态组件
#### 1.引用模板
通过标签`<template></template>`包裹起来来创建一个组件模板，示例如下:
```
<template id="app">
<!-- <template>必须有且只有一个根元素 -->
    <h1>hello</h1>
</template>
Vue.component("component-name",{
    template:'#app'//在此引入
})   
```
#### 2.动态组件
**多个组件使用同一个挂载点，然后动态的在它们之间切换**。根据 v-bind:is="组件名" 中的组件名去自动匹配组件，如果匹配不到则不显示。

动态切换掉的组件（非当前显示的组件）是被移除掉了，如果想把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染，可以添加一个**keep-alive** 指令参数。
```
<div id="itany">
    <button @click="flag='my-hello'">显示hello组件</button>
    <button @click="flag='my-world'">显示world组件</button>
    <div>
      <!-- 使用keep-alive组件缓存非活动组件，可以保留状态，避免重新渲染，默认每次都会销毁非活动组件并重新创建 -->
      <keep-alive>
        <component :is="flag"></component>
      </keep-alive>
    </div>
</div>

  <script>
    var vm = new Vue({
      el: '#itany',
      data: {
        flag: 'my-hello'
      },
      components: {
        'my-hello': {
          template: '<h3>我是hello组件：{{x}}</h3>',
          data() {
            return {
              x: Math.random()
            }
          }
        },
        'my-world': {
          template: '<h3>我是world组件：{{y}}</h3>',
          data() {
            return {
              y: Math.random()
            }
          }
        }
      }
    });
  </script>
```

## 五、父组件向子组件传值
在一个组件内部定义另一个组件，称为父子组件。子组件只能在父组件内部使用。
**默认情况下，子组件无法访问父组件中的数据，每个组件实例的作用域是独立的。**

 接下来我们通过一个例子，说明父组件如何向子组件传递值：在子组件Users.vue中如何获取父组件App.vue中的数据 users:["Henry","Bucky","Emily"]
#### 1.创建子组件，在src/components/文件夹下新建一个Users.vue子组件
#### 2.在App.vue中注册Users.vue组件，并在template中加入users标签

```
//App.vue父组件
<template>
  <div id="app">
    <users v-bind:users="users"></users>//前者自定义名称便于子组件调用，后者要传递数据名
  </div>
</template>
<script>
import Users from "./components/Users"
export default {
  name: 'App',
  data(){
    return{
      users:["Henry","Bucky","Emily"]
    }
  },
  components:{
    "users":Users
  }
}
```
#### 3.Users.vue的中创建props，然后创建一个users的属性
```
//users子组件
<template>
  <div class="hello">
    <ul>
      <li v-for="user in users">{{user}}</li>//遍历传递过来的值，然后呈现到页面
    </ul>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props:{
    users:{           //这个就是父组件中子标签自定义名字
      type:Array,
      required:true
    }
  }
}
</script>
```
**总结：父组件通过props向下传递数据给子组件。注：组件中的数据共有三种形式：data、props、computed**
## 六、子组件向父组件传值（通过事件形式）

接下来我们通过一个例子，说明子组件如何向父组件传递值：
当我们点击“Vue.js Demo”后，子组件向父组件传递值，文字由原来的“传递的是一个值”变成“子向父组件传值”，实现子组件向父组件值的传递。

![子组件向父组件传值之前](https://user-gold-cdn.xitu.io/2018/6/2/163bc1e738fb6edf)


#### 1.在子组件（header组件）中文字部分绑定一个点击事件
```
<template>
  <header>
    <h1 @click="changeTitle">{{title}}</h1>//绑定一个点击事件
  </header>
</template>
<script>
```
#### 2.子组件中响应该点击事件的函数中使用$emit来触发一个自定义事件，并传递一个参数
```
<script>
export default {
  name: 'app-header',
  data() {
    return {
      title:"Vue.js Demo"
    }
  },
  methods:{
    changeTitle() {
      this.$emit("titleChanged","子向父组件传值");//自定义事件  传递值“子向父组件传值”
    }
  }
}
</script>
```
#### 3.在父组件（App根组件）中的子标签中监听该自定义事件并添加一个响应该事件的处理方法
```
<template>
  <div id="app">
    <app-header v-on:titleChanged="updateTitle" ></app-header>//与子组件titleChanged自定义事件保持一致，updateTitle($event)接受传递过来的文字
    <h2>{{title}}</h2>
  </div>
</template>
<script>
import Header from "./components/Header"
export default {
  name: 'App',
  data(){
    return{
      title:"传递的是一个值"
    }
  },
  methods:{
    updateTitle(e){   //声明这个函数
      this.title = e;
    }
  },
  components:{
   "app-header":Header,
  }
}
</script>
```
**总结：子组件通过events给父组件发送消息，实际上就是子组件把自己的数据发送到父组件。**
## 七、总结

**在通信中，无论是子组件向父组件传值还是父组件向子组件传值，他们都有一个共同点就是都有中间介质，子向父的介质是自定义事件，父向子的介质是props中的属性。**
