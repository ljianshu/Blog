如果有需要源代码，请猛戳[源代码](https://github.com/ljianshu/Blog/tree/master/vue2.0%E5%AD%A6%E4%B9%A0)

希望文章给大家些许帮助和启发，麻烦大家在GitHub上面点个赞！！！十分感谢
## 一、前言
组件是 vue.js最强大的功能之一，而组件实例的作用域是相互独立的，这就意味着不同组件之间的数据无法相互引用。组件间如何传递数据就显得至关重要。本文尽可能罗列出一些常见的数据传递方式，如props、`$emit`/`$on`和vuex以及新出的`$attrs`/`$listeners`和provide/inject，以通俗易懂的实例讲述这其中的差别，希望对小伙伴有些许帮助。
## 二、props
父组件A通过props的方式向子组件B传递，B to A 通过在 B 组件中 $emit, A 组件中 v-on 的方式实现。具体实现方式请点击[Vue2.0学习(一)----父子组件间通信](https://juejin.im/post/5b117044e51d454e907bb812)

prop是单向绑定的，当父组件的属性变化时，将传导给子组件，反之则不行，
而且不允许直接在一个子组件内部改变 prop，否则就会报错。那有时候如果我们想修改传递过来的prop,有以下办法：
#### 方式1：如果子组件想把它作为局部数据来使用，可以将数据存入另一个变量中再操作，不影响父组件中的数据。
```
  <div id="itany">
    <h2>父组件:{{name}}</h2>
    <input type="text" v-model="name">
    <my-hello :name="name"></my-hello>
  </div>
  <template id="hello">
    <div>
      <h3>子组件{{username}}</h3>
      <button @click="change">修改数据</button>
    </div>
  </template>
  <script>
    var vm = new Vue({ //父组件
      el: '#itany',
      data: {
        name: "tom"
      },
      components: {
        'my-hello': { //子组件
          props: ["name"],
          template: '#hello',
          data() {
            return {
              username: this.name
            }
          },
          //   computed: {
          //     changeName() { //如果要实时监测父组件数据的变化，还必须用到计算属性，
                                 然而计算属性不能直接被更改
          //       return this.name
          //     }
          //   },
          methods: {
            change() {
              this.username = "alice";
              // this.changeName = "alice";该方法无效，不能直接更改计算属性
            }
          },
        }
      }
    });
  </script>
```
这种方法虽然可通过操作另一个变量，影响父组件传递过来的数据，但有一个很大弊端就是从此后子组件不能随着父组件的数据变化而变化。此时如果借助计算属性，虽然可以同步变化，但子组件却不能更改传递过来的数据。所以该方法比较少用。
#### 方式2：如果子组件想修改数据并且同步更新到父组件，两个方法：
**a.使用.sync（1.0版本中支持，2.0版本中不支持，2.3版本又开始支持）需要显式地触发一个更新事件。**
```
<div id="itany">
  <h2>父组件：{{name}}</h2>
  <input type="text" v-model="name">
  <hr>
  <my-hello :name.sync="name" :user="user"></my-hello>
</div>
<template id="hello">
  <div> 
    <h3>子组件：{{name}}</h3>
    <button @click="change">修改数据</button>
  </div>
</template>
<script>
  var vm = new Vue({ //父组件
	  el: '#itany',
	  data: {
		name: 'tom'
	  },
	  components: {
		'my-hello': { //子组件
		   template: '#hello',
		   props: ['name'],
		   methods: {
		     change() {
		      // this.name='alice';这种写法不行
		         this.$emit('update:name', 'alice123');
			//方式2：a.使用.sync，需要显式地触发一个更新事件
		     }
		   }
	       }
	    }
	});
</script>
```

![](https://user-gold-cdn.xitu.io/2018/8/2/164f680d17991472?w=280&h=195&f=gif&s=48485)
**b.可以将父组件中的数据包装成对象，然后在子组件中修改对象的属性(因为对象是引用类型，指向同一个内存空间)，推荐**
```
<div id="itany">
    <h2>父组件：{{name}}</h2>
    <input type="text" v-model="name">
    <h2>父组件：{{user.age}}</h2>
    <hr>
    <my-hello :name.sync="name" :user="user"></my-hello>
</div>

<template id="hello">
    <div>
        <h3>子组件：{{name}}</h3>
        <h3>子组件：{{user.age}}</h3>
        <button @click="change">修改数据</button>
    </div>
</template>
<script>
    var vm = new Vue({ //父组件
        el: '#itany',
        data: {
            name: 'tom',
            user: { //父组件中的数据包装成对象
                name: 'zhangsan',
                age: 24
            }
        },
        components: {
            'my-hello': { //子组件
                template: '#hello',
                props: ['name', 'user'],
                methods: {
                    change() {
                        this.user.age = 18;
                    }
                }
            }
        }
    });
</script>
```

![](https://user-gold-cdn.xitu.io/2018/8/5/16505d8453f30bda?w=661&h=349&f=gif&s=33451)
**这是因为在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态**。

## 三、`$emit`/`$on`
**非父子组件间的通信，可以通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件**。
#### 1.具体实现方式：
```
    var Event=new Vue();
    Event.$emit(事件名,数据);
    Event.$on(事件名,data => {});
```    
#### 2.举个例子：兄弟组件有三个，分别是A、B、C，C组件如何获取A或者B组件的数据
```
<div id="itany">
	<my-a></my-a>
	<my-b></my-b>
	<my-c></my-c>
</div>
<template id="a">
  <div>
    <h3>A组件：{{name}}</h3>
    <button @click="send">将数据发送给C组件</button>
  </div>
</template>
<template id="b">
  <div>
    <h3>B组件：{{age}}</h3>
    <button @click="send">将数组发送给C组件</button>
  </div>
</template>
<template id="c">
  <div>
    <h3>C组件：{{name}}，{{age}}</h3>
  </div>
</template>
<script>
var Event = new Vue();//定义一个空的Vue实例
var A = {
	template: '#a',
	data() {
	  return {
	    name: 'tom'
	  }
	},
	methods: {
	  send() {
	    Event.$emit('data-a', this.name);
	  }
	}
}
var B = {
	template: '#b',
	data() {
	  return {
	    age: 20
	  }
	},
	methods: {
	  send() {
	    Event.$emit('data-a', this.age);
	  }
	}
}
var C = {
	template: '#c',
	data() {
	  return {
	    name: '',
	    age: ""
	  }
	},
	mounted() {//在模板编译完成后执行
	 Event.$on('data-a',name => {
	     this.name = name;//箭头函数内部不会产生新的this，这边如果不用=>,this指代Event
	 })
	 Event.$on('data-b',age => {
	     this.age = age;
	 })
	}
}
var vm = new Vue({
	el: '#itany',
	components: {
	  'my-a': A,
	  'my-b': B,
	  'my-c': C
	}
});	
</script>
```

![](https://user-gold-cdn.xitu.io/2018/8/5/165099933b6a8363?w=626&h=242&f=gif&s=46298)

## 四、vuex

![](https://user-gold-cdn.xitu.io/2018/8/6/1650b05c4be180af?w=701&h=551&f=png&s=8112)

#### 1.简要介绍Vuex原理
Vuex实现了一个单向数据流，在全局拥有一个State存放数据，当组件要更改state的数据时，必须通过Mutation进行，Mutation的同时提供了订阅者模式供外部插件调用获取State数据的更新。而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走Action，但Action也是无法直接修改State的，还是需要通过Mutation来修改State的数据。最后，根据State的变化，渲染到视图上。
#### 2.简要介绍各模块在流程中的主要功能：
- Vue Components：Vue组件。HTML页面上，负责接收用户操作等交互行为，执行dispatch方法触发对应action进行回应。
- dispatch：操作行为触发方法，是唯一能执行action的方法。
- actions：操作行为处理模块。负责处理Vue Components接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以支持action的链式触发。
- commit：状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。
- mutations：状态改变操作方法。是Vuex修改state的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些hook暴露出来，以进行state的监控等。
- state：页面状态管理容器对象。集中存储Vue components中data对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用Vue的细粒度数据响应机制来进行高效的状态更新。
- getters：state对象读取方法。图中没有单独列出该模块，应该被包含在了render中，Vue Components通过该方法读取全局state对象。

如果你想深入了解，请点击[Vuex入门到上手](https://juejin.im/post/5b04ebaf6fb9a07aa926145c)这篇文章

## 五、localStorage
#### 1.简介
HTML5中新增了本地存储的解决方案----WebStorage，它分成两类：sessionStorage和localStorage。**localStorage保存的数据长期存在，除非被清除，下一次访问该网站的时候，网页可以直接读取以前保存的数据**。

localStorage保存的数据，以“键值对”的形式存在。也就是说，每一项数据都有一个键名和对应的值。所有的数据都是以文本格式保存。
存入数据使用setItem方法。它接受两个参数，第一个是键名，第二个是保存的数据。
`localStorage.setItem("key","value");`
读取数据使用getItem方法。它只有一个参数，就是键名。
`var valueLocal = localStorage.getItem("key");`

如果想深入了解，请点击[浏览器存储](https://juejin.im/post/5aff7da35188256709617790)这篇文章
#### 2.localStorage与Vuex区别
vuex 是 vue 的状态管理器，存储的数据是响应式的。但是并不会保存起来，刷新之后就回到了初始状态，**具体做法应该在vuex里数据改变的时候把数据拷贝一份保存到localStorage里面，刷新之后，如果localStorage里有保存的数据，取出来再替换store里的state。**
```
let defaultCity = "上海"
try {   // 用户关闭了本地存储功能，此时在外层加个try...catch
  if (!defaultCity){
    defaultCity = JSON.parse(window.localStorage.getItem('defaultCity'))
  }
}catch(e){}
export default new Vuex.Store({
  state: {
    city: defaultCity
  },
  mutations: {
    changeCity(state, city) {
      state.city = city
      try {
      window.localStorage.setItem('defaultCity', JSON.stringify(state.city));
      // 数据改变的时候把数据拷贝一份保存到localStorage里面
      } catch (e) {}
    }
  }
})
```
#### 3.注意点
由于vuex里，我们保存的状态，都是数组，而localStorage只支持字符串，所以需要用JSON转换：
```
JSON.stringify(state.subscribeList);   // array -> string
JSON.parse(window.localStorage.getItem("subscribeList"));    // string -> array 
```

## 六、`$attrs`/`$listeners`
#### 1.简介
多级组件嵌套需要传递数据时，通常使用的方法是通过vuex。但如果仅仅是传递数据，而不做中间处理，使用 vuex 处理，未免有点大材小用。为此Vue2.4 版本提供了另一种方法，**当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 interitAttrs 选项一起使用**。
```
// demo.vue
  <template>
    <div>
      <child-com:foo="foo":boo="boo":coo="coo":doo="doo"></child-com>
    </div>
  </tempalte>
  <script>
  const childCom = ()=> import('./childCom1.vue')
  export default {
    data () {
      return {
        foo: 'Hello World!',
        boo: 'Hello Javascript!',
        coo: 'Hello Vue',
        doo: 'Last'
      }
    },
    components: { childCom }
  }
  </script>
```
```
// childCom1.vue
<template>
  <div>
    <p>foo: {{ foo }}</p>
    <p>attrs: {{ $attrs }}</p>
    <child-com2 v-bind="$attrs"></child-com2>
  </div>
</template>
<script>
const childCom2 = ()=> import('./childCom2.vue')
export default {
  props: ['foo'],  // foo作为props属性绑定
  inheritAttrs: false,
  created () {
    console.log(this.$attrs) // { boo: 'Hello Javascript!', coo: 'Hello Vue', doo: 'Last' }
  }
}
</script>
```
```
// childCom2.vue
<template>
  <div>
   <p>boo: {{ boo }}</p>
   <p>attrs: {{ $attrs }}</p>
   <child-com3 v-bind="$attrs"></child-com3>
  </div>
</template>
<script>
const childCom3 = ()=> import('./childCom3.vue')
export default {
  props: ['boo'] // boo作为props属性绑定
  inheritAttrs: false,
  created () {
    console.log(this.$attrs) // { coo: 'Hello Vue', doo: 'Last' }
  }
}
</script>
```
`$attrs`表示没有继承数据的对象，格式为{属性名：属性值}。Vue2.4提供了`$attrs` , `$listeners` 来传递数据与事件，跨级组件之间的通讯变得更简单
## 七、provide/inject
#### 1.简介
Vue2.2.0新增API,这对选项需要一起使用，**以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效**。一言而蔽之：**祖先组件中通过provider来提供变量，然后在子孙组件中通过inject来注入变量。**
#### 2.举个例子
```
// 父组件
  export default {
    name: "Parent",
    provide: {
      parent: "父组件的值"
    }
  }
```
```
// 子组件
 export default {
    name: "",
    inject: ['parent'],
    data() {
      return {
        demo: this.parent //"父组件的值"
      }
    }
  }
```
上例中子组件中inject注入了父组件provide提供的变量parent，并将它提供给了data属性
## 参考文章
### 1.[Vuex数据本地储存](https://webcache.googleusercontent.com/search?q=cache:GCLcuCsGrVIJ:https://bingzhe.github.io/2017/08/27/vuex%25E6%2595%25B0%25E6%258D%25AE%25E6%259C%25AC%25E5%259C%25B0%25E5%2582%25A8%25E5%25AD%2598/+&cd=12&hl=zh-CN&ct=clnk&gl=us)
### 2.[Vuex框架原理与源码分析](https://tech.meituan.com/vuex_code_analysis.html)
### 3.[vue中的provide/inject的学习](https://segmentfault.com/a/1190000014095107)
### 4.[Vue v2.4中新增的`$attrs`及`$listeners`属性使用教程](https://www.jb51.net/article/132371.htm)
### 5.[Vue2.4组件间通信新姿势](https://blog.csdn.net/sinat_17775997/article/details/76889647)
### 6.[vue官方文档](https://cn.vuejs.org/v2/api/#vm-attrs)
