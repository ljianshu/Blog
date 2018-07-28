如果有需要源代码，请猛戳[源代码](https://github.com/ljianshu/Blog/tree/master/vue2.0%E5%AD%A6%E4%B9%A0)

希望文章给大家些许帮助和启发，麻烦大家在GitHub上面点个赞！！！十分感谢
## 一、自定义指令
Vue自定义指令和组件一样存在着全局注册和局部注册两种方式。先来看看注册全局指令的方式，**通过 Vue.directive( id, [definition] ) 方式注册全局指令**，第二个参数可以是对象数据，也可以是一个指令函数。

注：使用指令时必须在指名名称前加前缀v-，即v-指令名称
### 1.钩子函数
一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

- update：被绑定元素所在模板更新时调用，但是可能发生在其子 VNode 更新之前。

- componentUpdated：被绑定元素所在模板完成一次更新周期时调用。

- unbind：只调用一次，指令与元素解绑时调用。
### 2.钩子函数参数
指令钩子函数会被传入以下参数：

el：指令所绑定的元素，可以用来直接操作 DOM

binding：一个对象，包含以下属性：

    name：指令名，不包括 v- 前缀。
    value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
    expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"
    arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
    modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }
```
<div id="itany">
   <h3 v-world:wbs17022.hehe.haha="username">{{msg}}</h3>//username此处是个变量
</div>
...
// 钩子函数的参数
Vue.directive('world', {
  bind(el, binding) {
    console.log(el);//指令所绑定的元素，DOM对象
    el.style.color = 'yellow';
    console.log(binding); 
  }
});
var vm=new Vue({
	el:'#itany',
	data:{
		msg:'welcome to beijing',
		username:'alice'
	}
})		
```   
得到如下结果：

![](https://user-gold-cdn.xitu.io/2018/7/8/1647a6419a73e790?w=582&h=200&f=png&s=21246)

有时候需要给标签加权限，标签根据不同角色决定是否存在，我们也可定义一个指令v-power
```
<div v-power="'DOUBLE_TEACHER_ADMIN,ADMIN'">
......
Vue.directive("power", {
  bind(el,binding) {
    const accessRoles = binding.value;
    const role = store.state.user.userAccount.type //获取当前登入系统的角色
    if(accessRoles.split(',').indexOf(role)=== -1){
      Vue.nextTick(()=>{
        el.parentNode.removeChild(el)
      })
    }
    }
})
```
### 3.函数简写  
在很多时候，你可能想在 bind 和 update 时触发相同行为，而不关心其它的钩子
```
//传入一个简单的函数，bind和update时调用
 Vue.directive('wbs',function(){
   alert('wbs17022');
 });
```
### 4.局部注册
如果想注册局部指令，组件中也接受一个 directives 的选项
```
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```
### 5.自定义拖拽元素的指令
```
Vue.directive('drag', function (el) {
  el.onmousedown = function (e) {
    //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
    var disX = e.clientX - el.offsetLeft;
    var disY = e.clientY - el.offsetTop;
    console.log(disX, disY);
    //包含在onmousedown里面，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
    document.onmousemove = function (e) {
      //获取移动后div的位置：鼠标位置-disX/disY
      var l = e.clientX - disX;
      var t = e.clientY - disY;
      el.style.left = l + 'px';
      el.style.top = t + 'px';
    }
    //停止移动
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
});
```
## 二、生命周期
beforeCreate():组件实例刚刚创建，**还未进行数据观测和事件配置**//这里不要被beforeCreate误导，实际上组件实例已经创建了

created():实例已经创建完成，并且**已经完成数据观测，属性和方法的运算，watch/event 事件回调。//常用！！！**

beforeMount():模板编译之前，还没挂载，页面仍未展示，但**虚拟Dom已经配置**//先把坑占住了，到后面mounted挂载的时候再把值渲染进去

mounted():模板编译之后，已经挂载，**此时才会渲染页面，才能看到页面上数据的展示//常用！！！**

**注意:** mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 **vm.$nextTick 替换掉 mounted**

beforeUpdate():组件更新之前

updated():组件更新之后

beforeDestroy():组件销毁之前

destroyed():组件销毁之后

![](https://user-gold-cdn.xitu.io/2018/7/8/164757d0a02dac43?w=343&h=800&f=png&s=72666)
## 三、计算属性
### 1. 基本用法
计算属性也是用来存储数据，但具有以下几个特点：

**a.数据可以进行逻辑处理操作
b.对计算属性中的数据进行监视**
### 2.计算属性 vs 普通属性
可以像绑定普通属性一样在模板中绑定计算属性，在定义上有区别：**计算属性的属性值必须是一个函数**
```
data:{ //普通属性
  msg:'welcome to beijing',
},
computed:{ //计算属性
  msg2:function(){ //该函数必须有返回值，用来获取属性，称为get函数
    return '欢迎来到北京';
  },
  reverseMsg:function(){
  //可以包含逻辑处理操作，同时reverseMsg依赖于msg,一旦msg发生变化，reverseMsg也会跟着变化
    return this.msg.split(' ').reverse().join(' ');
 }
}  
```


### 3.计算属性 vs 方法
将计算属性的get函数定义为一个方法也可以实现类似的功能

区别：

**a.计算属性是基于它的依赖进行更新的，只有在相关依赖发生改变时才能更新变化**

**b.计算属性是缓存的，只要相关依赖没有改变，多次访问计算属性得到的值是之前缓存的计算结果，不会多次执行**

### 4. get和set
计算属性由两部分组成：get和set，分别用来获取计算属性和设置计算属性

默认只有get，如果需要set，要自己添加。另外set设置属性，并不是直接修改计算属性，而是修改它的依赖
```
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      //this.fullName = newValue 这种写法会报错
      var names = newValue.split(' ')
      this.firstName = names[0]//对它的依赖进行赋值
      this.lastName = names[names.length - 1]
    }
  }
}
```
现在再运行 vm.fullName = 'John Doe' 时，setter 会被调用，vm.firstName 和 vm.lastName 也会相应地被更新。
## 四、实例的属性和方法
### 1. 属性
    vm.$el:Vue实例使用的根 DOM 元素
    vm.$data:获取数据对象data
    vm.$options:获取自定义属性
    vm.$refs:一个对象，持有注册过 ref 特性的所有 DOM 元素和组件实例
接下来看个例子就可以明白这些属性：
```
<div id="itany">
   {{msg}}
   <h2 ref="hello">你好</h2>
   <p ref="world">世界</p>	<hr>
   <h1 ref="title">标题：{{name}}</h1>
</div>
...
var vm=new Vue({
	el:'#itany',
	data:{
	     msg:'welcome to beijing'
	},
	name:'tom',
	show:function(){
	     console.log('show');
	}
});
// vm.属性名 获取data中的属性
   console.log(vm.msg);//welcome to beijing
// vm.$el 获取vue实例关联的元素
   console.log(vm.$el); //DOM对象
   vm.$el.style.color='red';
// vm.$data //获取数据对象data
   console.log(vm.$data);
   console.log(vm.$data.msg);
// vm.$options //获取自定义属性
   console.log(vm.$options.name);
   vm.$options.show();
// vm.$refs 获取所有添加ref属性的元素
   console.log(vm.$refs);
   console.log(vm.$refs.hello); //DOM对象
   vm.$refs.hello.style.color='blue';
```
最后得到结果如下图：
![](https://user-gold-cdn.xitu.io/2018/7/8/16478cf39301eda3?w=463&h=307&f=png&s=30157)


### 2. 方法
    vm.$mount():手动挂载vue实例//vm.$mount('#itany');
    vm.$destroy():销毁实例
    vm.$nextTick(callback):在DOM更新完成后再执行回调函数，一般在修改数据之后使用该方法，以便获取更新后的DOM
    vm.$set(target, key, value)与Vue.set用法相同
    vm.$delete(target, key)与Vue.delete用法相同
    vm.$watch(data,callback[,options])数据监视
**vm.$mount()使用场景**    
```
var vm=new Vue({
   data:{
	msg:'欢迎来到南京网博',
	name:'tom'
    }
}).$mount('#itany');
```
**vm.$nextTick()使用场景**
```
<div id="itany">
   <h1 ref="title">标题：{{name}}</h1>
</div>
...
var vm = new Vue({
  el: '#itany',
  data: {
    msg: 'welcome to beijing',
    name: 'tom'
  }
});
vm.name='汤姆';//虽然页面展示已经更改过来了，但DOM还没更新完
//Vue实现响应式并不是数据发生改变之后DOM立即变化，需要按一定的策略进行DOM更新，需要时间！！
console.log(vm.$refs.title.textContent);//标题：tom 取到的值还是旧的
vm.$nextTick(function () {
//DOM更新完成，更新完成后再执行此代码
  console.log(vm.$refs.title.textContent);标题：汤姆
});
```
**vm.$set(target, key, value)使用场景**

参数：

{Object | Array} target

{string | number} key

{any} value

用法：**向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为Vue 无法探测普通的新增属性**,比如下面例子中的this.user.age=25，页面并不能展示{{this.age}}的数据
```
<div id="itany">
  <button @click="doAdd">添加属性</button>
<hr>
  <h2>{{user.name}}</h2>
  <h2>{{user.age}}</h2>
</div>
...
var vm = new Vue({
  el: '#itany',
  data: {
    user: {
      id: 1001,
      name: 'tom'
    }
  },
  methods: {
    doAdd() {
      // this.user.age=25; //通过普通方式为对象添加属性时vue无法实时监视到
      // this.$set(this.user,'age',18); //通过vue实例的$set方法为对象添加属性，可以实时监视
      // Vue.set(this.user,'age',18);
      if (this.user.age) {
        this.user.age++;
      } else {
        Vue.set(this.user, 'age', 1);
      }
    }
  }
})
```
**vm.$delete(target, key)使用场景**

参数：

{Object | Array} target

{string | number} key

用途：删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。

```
doDelete() {
  if (this.user.age) {
    // delete this.user.age; 此方法无效
    Vue.delete(this.user, 'age');
  }
}
```
**vm.$watch( expOrFn, callback, [options] )使用场景**

参数：

{string | Function} expOrFn

{Function | Object} callback

{Object} [options]

  - {boolean} deep：为了发现对象内部值的变化，可以在选项参数中指定 deep: true 。注意监听数组的变动不需要这么做。

 -  {boolean} immediate
 
用途:**观察 Vue 实例变化的一个表达式或计算属性函数**。回调函数得到的参数为新值和旧值。
```
<div id="itany">
  <input type="text" v-model="name">
	<h3>{{name}}</h3>
	<hr>
  <input type="text" v-model="age">
	<h3>{{age}}</h3>
	<hr>
  <input type="text" v-model="user.name">
	<h3>{{user.name}}</h3>
</div>
...
var vm = new Vue({
  el: '#itany',
  data: {
    name: 'tom',
    age: 23,
    user: {
      id: 1001,
      name: 'alice'
    }
  },
  watch: { //方式2：使用vue实例提供的watch选项
    age: (newValue, oldValue) => {
      console.log('age被修改啦，原值：' + oldValue + '，新值：' + newValue);
    },
    user: {
      handler: (newValue, oldValue) => {
        console.log('user被修改啦，原值：' + oldValue.name + '，新值：' + newValue.name);
      },
      deep: true //深度监视，当对象中的属性发生变化时也会监视
    }
  }
});

//方式1：使用vue实例提供的$watch()方法
vm.$watch('name', function (newValue, oldValue) {
  console.log('name被修改啦，原值：' + oldValue + '，新值：' + newValue);
});
当对象中的属性发生变化时,也可以采用这种办法
vm.$watch（"user",function(newValue,oldValue){
  console.log('user被修改啦，原值：'+oldValue.name+'，新值：'+newValue.name);
},true)
```	
![](https://user-gold-cdn.xitu.io/2018/7/8/16479969b00d11ab?w=870&h=460&f=gif&s=117947)



## 参考文章
[Vue2.0 探索之路——生命周期和钩子函数的一些理解](https://segmentfault.com/a/1190000008010666)

[vue官方文档](https://cn.vuejs.org/v2/guide/custom-directive.html)
