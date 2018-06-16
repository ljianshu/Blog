## 一、前言

在搭建下面页面时，你可能会对 vue 组件之间的通信感到崩溃 ，特别是非父子组件之间通信。此时就应该使用vuex，轻松可以搞定组件间通信问题。

![组件间通信](https://user-gold-cdn.xitu.io/2018/5/23/1638b38a08088b12?w=1194&h=486&f=png&s=133255)

## 二、什么是Vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化

## 三、什么时候使用Vuex

虽然 Vuex 可以帮助我们管理共享状态，但也附带了更多的概念和框架。这需要对短期和长期效益进行权衡。
如果您的应用够简单，您最好不要使用 Vuex,因为使用 Vuex 可能是繁琐冗余的。一个简单的 [global event bus](https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E%E7%88%B6%E5%AD%90%E7%BB%84%E4%BB%B6%E9%80%9A%E4%BF%A1) 就足够您所需了。但是，**如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。**

## 四、Vuex安装(限定开发环境为 vue-cli)

首先要安装vue-cli脚手架，对于大陆用户，建议将npm的注册表源设置为国内的镜像(淘宝镜像），可以大幅提升安装速度。
```
npm config set registry https://[registry.npm.taobao.org](http://registry.npm.taobao.org/)
npm config get registry//配置后可通过下面方式来验证是否成功
npm install -g cnpm --registry=[https://registry](https://registry/).npm.taobao.org
//cnpm安装脚手架
cnpm install -g vue-cli
vue init webpack my-vue
cd my-vue
cnpm install
cnpm run dev
```
脚手架安装好后，再安装vuex
```
cnpm install vuex --save
```
## 五、如何使用Vuex
 ### 1.如何通过Vuex来实现如下效果？

![](https://user-gold-cdn.xitu.io/2018/6/16/164077deffe09a2b?w=622&h=475&f=gif&s=21943)
#### ①创建一个store.js文件
```
import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {  //这里的state必须是JSON，是一个对象
    count: 1 //这是初始值
  },
  mutations: {//突变，罗列所有可能改变state的方法
    add(state) {
      state.count++; //直接改变了state中的值，而并不是返回了一个新的state
    },
    reduce(state){
        state.count--;
    }
  }
});
export default store;//用export default 封装代码，让外部可以引用
```
#### ②在main.js文件中引入store.js文件
```
import store from "./vuex/store"
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
```
#### ③新建一个模板count.vue
```
<template>
    <div>
       <h2>{{msg}}</h2><hr/>
       <h2>{{$store.state.count}}-{{count}}</h2>//这两种写法都可以
       <button @click="addNumber">+</button>
       <button @click="reduceNumber">-</button>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      msg: "Hello Vuex"
    };
  },
  methods: {
    addNumber() {
      return this.$store.commit("add");
    },
    reduceNumber() {
      return this.$store.commit("reduce");
    }
  },
  computed: mapState(['count'])// 映射 this.count 到 this.$store.state.count
                                 mapState 函数可以接受一个对象，也可以接收一个数组
};
</script>

```
由于 store 中的状态是响应式的，当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。**在组件中调用 store 中的状态简单到仅需要在计算属性中返回即可。改变store 中的状态的唯一途径就是显式地提交 (commit) mutations。**

这样，我们就可以实现自增1或是自减1，那假如我们想要点击一次实现自增2，这该如何实现，也就是如何向Mutations传值？

### 2.如何在Mutations里传递参数

先store.js文件里给add方法加上一个参数n
```
  mutations: {
    add(state,n) {
      state.count+=n;
    },
    reduce(state){
        state.count--;
    }
  }
```
然后在Count.vue里修改按钮的commit( )方法传递的参数
```
 addNumber() {
      return this.$store.commit("add",2);
    },
 reduceNumber() {
      return this.$store.commit("reduce");
    }
```
### 3.getters如何实现计算过滤操作
**getters从表面是获得的意思，可以把他看作在获取数据之前进行的一种再编辑,相当于对数据的一个过滤和加工**。你可以把它看作store.js的计算属性。

例如：要对store.js文件中的count进行操作，在它输出前，给它加上100。

首先要在store.js里Vuex.Store()里引入getters
```
getters:{
     count:state=>state.count+=100
  }
```
然后在Count.vue中对computed进行配置，在vue 的构造器里边只能有一个computed属性，如果你写多个，只有最后一个computed属性可用，所以要用展开运算符”…”对上节写的computed属性进行一个改造。
```
computed: {
    ...mapState(["count"]),
    count() {
      return this.$store.getters.count;
    }
  }
```
需要注意的是，此时如果点击'+'，就会增加102，如果点击'-',就会增加99，最后的结果是mutations和getters共同作用的。
### 4.actions如何实现异步修改状态
actions和上面的Mutations功能基本一样，不同点是，**actions是异步的改变state状态，而Mutations是同步改变状态**。

**①在store.js中声明actions**
```
  actions: {
    addAction(context) {
      context.commit('add', 2);//一开始执行add,并传递参数2
      setTimeout(() => {
        context.commit('reduce')
      }, 2000);//两秒后会执行reduce
      console.log('我比reduce提前执行');
    },
    reduceAction({
      commit
    }) {
      commit('reduce')
    }
  }
```
actions是可以调用Mutations里的方法的,调用add和reduce两个方法。在addAction里使用setTimeOut进行延迟执行。在actions里写了两个方法addAction和reduceAction，两个方法传递的参数也不一样。

**context：上下文对象，这里你可以理解称store本身**。

**{commit}：直接把commit对象传递过来，可以让方法体逻辑和代码更清晰明了**

**②模板中的使用**
```
<p>
   <button @click="addNumber">+</button>
   <button @click="reduceNumber">-</button>
</p>
<p>       
   <button @click="addAction">+</button>//新增
   <button @click="reduceAction">-</button>//新增
</p>
```
```
import { mapState, mapGetters, mapActions } from "vuex";
methods:{
    ...mapMutations([  
        'add','reduce'
    ]),
    ...mapActions(['addAction','reduceAction'])
}
```
最后得到如下效果：点击addAction按钮事件时，先累加2，两秒后再减去1，而addNumber事件则不能实现异步效果。
![](https://user-gold-cdn.xitu.io/2018/6/16/16408bb642baece4?w=668&h=534&f=gif&s=26388)

ps:如果想访问源代码，请猛戳[git地址](https://github.com/ljianshu/Blog/tree/master/vuex-demo)

如果觉得本文对您有用，请给本文的github加个star,万分感谢
## 参考文章
[vuex官方文档](https://vuex.vuejs.org/zh/guide/)

[Vuex 2.0 源码分析](http://www.imooc.com/article/14741)

[技术胖的vuex视频教程](http://jspang.com/2017/05/03/vuex/)
