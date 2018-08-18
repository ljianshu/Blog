如果有需要源代码，请猛戳[源代码](https://github.com/ljianshu/Blog/tree/master/vue2.0%E5%AD%A6%E4%B9%A0)

希望文章给大家些许帮助和启发，麻烦大家在GitHub上面点个赞！！！十分感谢
## 前言
本文将介绍vue2.0中的组件的继承与扩展，主要分享slot、mixins/extends和extend的用法。
## 一、slot
### 1.默认插槽和匿名插槽
**`slot`用来获取组件中的原内容**。有的时候为插槽提供默认的内容是很有用的,例如，一个`<my-hello>` 组件可能希望这个按钮的默认内容是“如果没有原内容，则显示该内容”，但是同时允许用户覆写为别的内容。
```
<body>
  <div id="itany">
    <my-hello>180812/my-hello>
  </div>
<template id="hello">
  <div>
    <h3>welcome to xiamen</h3>
    <slot>如果没有原内容，则显示该内容</slot>// 默认插槽
  </div>
</template>
<script>
  var vm=new Vue({
      el:'#itany',
      components:{
      'my-hello':{
	  template:'#hello'
	}
     }
 });	
</script>
```

![](https://user-gold-cdn.xitu.io/2018/8/12/1652e758b0e7d395?w=350&h=92&f=png&s=5133)
### 2.具名插槽
有些时候我们需要多个插槽,`<slot>` 元素有一个特殊的特性：name。这个特性可以用来定义额外的插槽：
```
<div id="itany">
    <my-hello>
      <ul slot="s1">
	<li>aaa</li>
	<li>bbb</li>
	<li>ccc</li>
      </ul>
      <ol slot="s2">
	<li>111</li>
	<li>222</li>
	<li>333</li>
      </ol>
    </my-hello>
</div>
<template id="hello">
    <div>
      <slot name="s2"></slot>
      <h3>welcome to xiamen</h3>
      <slot name="s1"></slot>
    </div>
</template>
<script>
  var vm=new Vue({
	el:'#itany',
	components:{
	  'my-hello':{
	     template:'#hello'
	   }
	}
 });	
</script>
```

![](https://user-gold-cdn.xitu.io/2018/8/12/1652e7707519363b?w=331&h=227&f=png&s=8292)
## 二、mixins
### 1.mixins简介
**混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项**。mixins 选项接受一个混合对象的数组。
### 2.mixins用途
一般有两种用途：

1、在你已经写好了构造器后，需要增加方法或者临时的活动时使用的方法，这时用混入会减少源代码的污染。

2、很多地方都会用到的公用方法，用混入的方法可以减少代码量，实现代码重用。

例如下面的例子：实现每次数据变化时都能够在控制台打印出提示："数据发生变化"
```
    <h1>Mixins</h1>
    <hr>
    <div id="app">
        <p>num:{{ num }}</p>
        <P>
            <button @click="add">增加数量<tton>
        </P>
    </div>
    <script type="text/javascript">
        var addLog = { //额外临时加入时，用于显示日志
            updated: function () {
                console.log("数据发生变化,变化成" + this.num + ".");
            }
        }
        Vue.mixin({// 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例
            updated: function () {
                console.log("我是全局的混入")
            }
        })
        var app = new Vue({
            el: '#app',
            data: {
                num: 1
            },
            methods: {
                add: function () {
                    this.num++;
                }
            },
            updated() {
                console.log("我是原生的update")
            },
            mixins: [addLog]//混入
        })
```

![](https://user-gold-cdn.xitu.io/2018/8/18/1654c0eddb6459d5?w=1382&h=244&f=gif&s=43127)

### 3.mixins的调用顺序
上例说明了：**从执行的先后顺序来说，混入对象的钩子将在组件自身钩子之前调用，如果遇到全局混入(`Vue.mixin`)，全局混入的执行顺序要前于混入和组件里的方法。**

## 三、extends
### 1.extends用法
extends选项允许声明扩展另一个组件，而无需使用 `Vue.extend`。
通过外部增加对象的形式，对构造器进行扩展。它和混入mixins非常的类似。**只不过接收的参数是简单的选项对象或构造函数,所以extends只能单次扩展一个组件。**
```
    <h1>Extends</h1>
    <hr>
    <div id="app">
        num:{{ num }}
        <p>
            <button @click="add">add</button>
        </p>
    </div>
    <script type="text/javascript">
        var bbb = {
            updated() {
                console.log("我是被扩展出来的");
            },
            methods: {
                add: function () {  //跟原生的方法冲突，取原生的方法，这点跟混入一样
                    console.log('我是被扩展出来的add方法！');
                    this.num++;
                }
            }
        };
        var app = new Vue({
            el: '#app',
            data: {
                num: 1
            },
            methods: {
                add: function () {
                    console.log('我是原生add方法');
                    this.num++;
                }
            },
            updated() {
                console.log("我是扩展出来的");
            },
            extends: bbb// 接收对象和函数
        })
```
![](https://user-gold-cdn.xitu.io/2018/8/18/1654c5e34d83b8b0?w=1382&h=244&f=gif&s=43623)
从上面的例子也可看出，执行的先后顺序和mixins一样，另外扩展的方法与原生的冲突时，扩展的方法不生效，这点跟混入一样。
### 2.extends和mixins优先级比较
```
 var extend={
    data:{extendData:'我是extend的data'},
    created:function(){
      console.log('这是extend的created');
    }
  }
  var mixin={
    data:{mixinData:'我是mixin的data'},
    created:function(){
      console.log('这是mixin的created');
    }
  }
  var vm=new Vue({
    el:'#app',
    data:{mixinData:'我是vue实例的data'},
    created:function(){
      console.log('这是vue实例的created');
    },
    methods:{
      getSum:function(){
        console.log('这是vue实例里面getSum的方法');
      }
    },
    mixins:[mixin],
    extends:extend
  })
```

![](https://user-gold-cdn.xitu.io/2018/8/18/1654c8847068e44f?w=532&h=65&f=png&s=10088)
由此可以得出，**相对于mixins,extends触发的优先级更高**
## 四、extend
Vue.extend只是创建一个构造器,它是为了创建可复用的组件。其主要用来服务于Vue.component，用来生成组件
```
        <div id="itany">
		<hello></hello>
		<my-world></my-world>
	</div>
	<script>
		/**
		 * 方式1：先创建组件构造器，然后由组件构造器创建组件
		 */
		//1.使用Vue.extend()创建一个组件构造器
		var MyComponent = Vue.extend({
			template: '<h3>Hello World</h3>'
		});
		//2.使用Vue.component(标签名,组件构造器)，根据组件构造器来创建组件
		Vue.component('hello', MyComponent);
		/**
		 * 方式2：直接创建组件(推荐)
		 */
		// Vue.component('world',{
		Vue.component('my-world', {
			template: '<h1>你好，世界</h1>'
		});
		var vm = new Vue({ //这里的vm也是一个组件，称为根组件Root
			el: '#itany',
			data: {}
		});	
	</script>
```

## 参考文章
### [Vue官方文档](https://cn.vuejs.org/v2/api/#extends)
### [技术胖vue2.0视频教程](http://jspang.com/2017/03/26/vue3/5/)

