## 前言
本文将在上文的基础上，继续介绍ES6核心特性：箭头函数、rest参数、扩展运算符、解构赋值以及模板字符串，希望对大家有些许帮助！

如果你想了解块作用域、promise、class以及ES6环境配置，请猛戳[ES6核心特性（一）](https://juejin.im/post/5b037b536fb9a07aa9260b39)

## 一、箭头函数
ES6 允许使用“箭头”（=>）定义函数。它主要有两个作用：缩减代码和改变this指向，接下来我们详细介绍：

 ### 1. 缩减代码 
 ```
 const double1 = function(number){
    return number * 2;   //ES5写法
 }
 const double2 = (number) => {
  return number * 2;    //ES6写法
 }
 const double4 = number => number * 2; //可以进一步简化
```
**多个参数记得加括号**
```
 const double6 = (number,number2) => number + number2;
 ```
**如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回**。
```
 const double = (number,number2) => {
   sum = number + number2 
   return sum;
 }
```
由于大括号被解释为代码块，所以**如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错**。
```
// 报错
let getTempItem = id => { id: id, name: "Temp" };
// 不报
let getTempItem = id => ({ id: id, name: "Temp" });
```
**此外还有个好处就是简化回调函数**
```
// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});
// 箭头函数写法
[1,2,3].map(x => x * x);//[1, 4, 9]
```
### 2. 改变this指向
长期以来，JavaScript 语言的this对象一直是一个令人头痛的问题，在对象方法中使用this，必须非常小心。箭头函数”绑定”this，很大程度上解决了这个困扰。我们不妨先看一个例子：
```
const team = {
  members:["Henry","Elyse"],
  teamName:"es6",
  teamSummary:function(){
    return this.members.map(function(member){
      return `${member}隶属于${this.teamName}小组`;    // this不知道该指向谁了
    })
  }
}
console.log(team.teamSummary());//["Henry隶属于undefined小组", "Elyse隶属于undefined小组"]
```
teamSummary函数里面又嵌了个函数，这导致内部的this的指向发生了错乱。
**那如何修改：**

方法一、let self = this
```
const team = {
  members:["Henry","Elyse"],
  teamName:"es6",
  teamSummary:function(){
    let self = this;
    return this.members.map(function(member){
      return `${member}隶属于${self.teamName}小组`;
    })
  }
}
console.log(team.teamSummary());//["Henry隶属于es6小组", "Elyse隶属于es6小组"]
```
方法二、bind函数
```
const team = {
  members:["Henry","Elyse"],
  teamName:"es6",
  teamSummary:function(){
    return this.members.map(function(member){
      // this不知道该指向谁了
      return `${member}隶属于${this.teamName}小组`;
    }.bind(this))
  }
}
console.log(team.teamSummary());//["Henry隶属于es6小组", "Elyse隶属于es6小组"]
```
方法三、 箭头函数
```
const team = {
  members:["Henry","Elyse"],
  teamName:"es6",
  teamSummary:function(){
    return this.members.map((member) => {
      // this指向的就是team对象
      return `${member}隶属于${this.teamName}小组`;
    })
  }
}
console.log(team.teamSummary());//["Henry隶属于es6小组", "Elyse隶属于es6小组"]
```
### 3.使用注意点

（1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
## 二、rest 参数 
**ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。**

**rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。**
我们举个例子：如何实现一个求和函数？

**传统写法：**
```
function addNumbers(a,b,c,d,e){
  var numbers = [a,b,c,d,e];
  return numbers.reduce((sum,number) => {
    return sum + number;
  },0)
 }
 console.log(addNumbers(1,2,3,4,5));//15
```
**ES6写法：**
```
 function addNumbers(...numbers){
  return numbers.reduce((sum,number) => {
    return sum + number;
  },0)
 }
 console.log(addNumbers(1,2,3,4,5));//15
 ```
 **也可以与解构赋值组合使用**
```
var array = [1,2,3,4,5,6];
var [a,b,...c] = array;
console.log(a);//1
console.log(b);//2
console.log(c);//[3, 4, 5, 6]
```
**rest 参数还可以与箭头函数结合**
 ```
const numbers = (...nums) => nums;
numbers(1, 2, 3, 4, 5)// [1,2,3,4,5]  
 ```  

**注意：①每个函数最多只能声明一个rest参数，而且 rest参数必须是最后一个参数，否则报错。**

**②rest参数不能用于对象字面量setter之中**
```
let object = {
    set name(...value){   //报错
        //执行一些逻辑
    }
}
```
## 三、展开运算符
与剩余参数关联最密切的就是扩展运算符。剩余参数允许你把多个独立的参数合并到一个数组中；而扩展运算符则允许将一个数组分割，并将各个项作为分离的参数传给函数。

**当用在字符串或数组前面时称为扩展运算符,个人觉得可以理解为rest参数的逆运算，用于将数组或字符串进行拆解**。有些时候，函数不允许传入数组，此时使用展开运算符就很方便，不信的话，咱们看个例子：Math.max()方法，它接受任意数量的参数，并会返回其中的最大值。
```
let value1 = 25,				
let value2 = 50;
console.log(Math.max(value1, value2));	//	50
```
但若想处理数组中的值，此时该如何找到最大值？Math.max()方法并不允许你传入一个数组。其实你可以像使用rest参数那样在该数组前添加...,并直接将其传递给		Math.max()		
```
let values = [25,50,75,	100]
//等价于console.log(Math.max(25,50,75,100));
console.log(Math.max(...values));	//100
```
**扩展运算符还可以与其他参数混用**
```
let values = [-25,-50,-75,-100]
console.log(Math.max(...values,0));	//0
```
**扩展运算符拆解字符串与数组**
```
var array = [1,2,3,4,5];
console.log(...array);//1 2 3 4 5
var str = "String";
console.log(...str);//S t r i n g
```
**还可以实现拼接**
 ```
var defaultColors = ["red","greed"];
var favoriteColors = ["orange","yellow"];
var fallColors = ["fire red","fall orange"];
console.log(["blue","green",...fallColors,...defaultColors,...favoriteColors]
//["blue", "green", "fire red", "fall orange", "red", "greed", "orange", "yellow"]
 ```
## 四、解构赋值----更方便的数据访问
ES6	新增了解构，这是将一个数据结构分解为更小的部分的过程。
### 1.解构为何有用？
在ES5及更早版本中，从对象或数组中获取信息、并将特定数据存入本地变量，需要书写许多并且相似的代码。例如：
```
 var expense = {
   type: "es6",
   amount:"45"
 };
 var type = expense.type;
 var amount = expense.amount;
 console.log(type,amount);
```
此代码提取了expense对象的type与amount值，并将其存在同名的本地变量上。虽然 这段代码看起来简单，但想象一下若有大量变量需要处理，你就必须逐个为其赋值；并且若有一个嵌套的数据结构需要遍历以寻找信息，你可能会为了一点数据而挖掘整个结构。

这就是ES6为何要给对象与数组添加解构。当把数据结构分解为更小的部分时，从中提取你要的数据会变得容易许多。
### 2.对象
上个例子中如果采用对象解构的方法，就很容易获取expense对象的type与amount值。
```
const { type,amount } = expense;
console.log(type,amount);
```
我们再来看个例子：
```
let node = {type:"Identifier",	name:"foo"},	
type = "Literal",name = 5;
({type,name}= node);//	使用解构来分配不同的值 
console.log(type); //	"Identifier" 
console.log(name); //	"foo"
```
**注意:你必须用圆括号包裹解构赋值语句**，这是因为暴露的花括号会被解析为代码块语句，而块语句不允许在赋值操作符（即等号）左侧出现。圆括号标示了里面的花括号并不是块语句、而应该被解释为表达式，从而允许完成赋值操作。

**默认值：**
可以选择性地定义一个默认值，以便在指定属性不存在时使用该值。若要这么做，需要在 属性名后面添加一个等号并指定默认值，就像这样：

```
let node = {
  type: "Identifier",
  name: "foo"
};
let {
  type,
  name,
  value = true
} = node;
console.log(type); //	"Identifier" 
console.log(name); //	"foo" 
console.log(value); //	true
```

**嵌套对象解构：**
使用类似于对象字面量的语法，可以深入到嵌套的对象结构中去提取你想要的数据。
```
let node = {
  type: "Identifier",
  name: "foo",
  loc: {
    start: {
      line: 1,
      column: 1
    },
    end: {
      line: 1,
      column: 4
    }
  }
};
let { loc: { start }} = node;
console.log(start.line); //	1 
console.log(start.column); //	1
```
本例中的解构模式使用了花括号，表示应当下行到node对象的loc属性内部去寻找start属性。

**必须传值的解构参数**
```
function setCookie(name, value, {
  secure,
  path,
  domain,
  expires
}) {
  //	设置cookie的代码 
}
  setCookie("type", "js");//报错
```
在此函数内，name与value参数是必需的，而secure、path、domain与expires则不是。默认情况下调用函数时未给参数解构传值会抛出错误。像上例中如果setCookie不传第三个参数，就会报错。若解构参数是可选的，可以给解构的参数提供默认值来处理这种错误。

```
function setCookie(name, value, {
  secure,
  path,
  domain,
  expires
} = {}) {}
setCookie("type", "js");//不会报错
```
### 3.数组
```
const names = ["Henry","Bucky","Emily"];
const [name1,name2,name3] = names;
console.log(name1,name2,name3);//Henry Bucky Emily
const [name,...rest] = names;//结合展开运算符
console.log(rest);//["Bucky", "Emily"]
```
**用{}解构返回数组个数**
```
const {length} = names;
console.log(length);//3
```
**数组解构也可以用于赋值上下文，但不需要用小括号包裹表达式**。这点跟对象解构的约定不同。
```
let colors = ["red", "green", "blue"],
  firstColor = "black",
  secondColor = "purple";
[firstColor, secondColor] = colors;
console.log(firstColor); //	"red" 
console.log(secondColor);	// "green"
```
**默认值**：数组解构赋值同样允许在数组任意位置指定默认值。当指定位置的项不存在、或其值为undefined，那么该默认值就会被使用。
```
let colors = ["red"];
let [firstColor, secondColor = "green"] = colors;
console.log(firstColor); //	"red" 
console.log(secondColor);//	"green"
```
**与rest参数搭配**

在ES5中常常使用concat()方法来克隆数组，例如：
```
//在ES5中克隆数组 
var colors = ["red", "green", "blue"];
var clonedColors = colors.concat();
console.log(clonedColors); //"[red,green,blue]"
```
在ES6中，你可以使用剩余项的语法来达到同样效果
```
//在ES6中克隆数组 
let colors = ["red", "green", "blue"];
let [...clonedColors] = colors;
console.log(clonedColors); //[red,green,blue]
```
接下我们看个例子：如何将数组转化为对象
```
const points = [
  [4,5],
  [10,1],
  [0,40]
];
//期望得到的数据格式如下，如何实现？
// [
//   {x:4,y:5},
//   {x:10,y:1},
//   {x:0,y:40}
// ]
let newPoints = points.map(pair => {
  const [x,y] = pair;
  return {x,y}
})
//还可以通过以下办法，更为简便
let newPoints = points.map(([x,y]) => {
  return {x,y}
})
console.log(newPoints);
```

**混合解构**
```
const people = [
  {name:"Henry",age:20},
  {name:"Bucky",age:25},
  {name:"Emily",age:30}
];
//es5 写法 
var age = people[0].age;
console.log(age);
//es6 解构
const [age] = people;
console.log(age);//第一次解构数组 {name:"Henry",age:20}
const [{age}] = people;//再一次解构对象
console.log(age);//20
```

### 4.注意点
当使用解构来配合var、let、const来声明变量时，必须提供初始化程序（即等号右边的值）。下面的代码都会因为缺失初始化程序而抛出语法错误：
```
var { type, name };//	语法错误！ 
let { type, name };//	语法错误！
const { type, name };//	语法错误！
```
## 五、模板字符串（template string）
模板字符串是增强版的字符串，用反引号（`）标识。**它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。
模板字符串中嵌入变量和函数，需要将变量名写在${}之中。**
```
let name = "Henry";
function makeUppercase(word){
  return word.toUpperCase();
}
let template = 
  `
  <h1>${makeUppercase('Hello')}, ${name}!</h1>//可以存放函数和变量
  <p>感谢大家收看我们的视频, ES6为我们提供了很多遍历好用的方法和语法!</p>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
  </ul>
  `;
document.getElementById('template').innerHTML = template;
```
![](https://user-gold-cdn.xitu.io/2018/6/24/164323d8966b63a1?w=517&h=215&f=png&s=9741)

再举个例子，工作中常用到ElementUI库，在自定义一个弹出框时，使用模板字符串就很方便:
```
   await this.$alert(
          `<p><strong>确认是否升级${
            this.lectureName
          }</strong><br>(若已存在讲义套件，升级后请重新生成)</p>`,
          {
            dangerouslyUseHTMLString: true
          }
        )
```
## 参考文章
[ECMAScript 6 入门](http://es6.ruanyifeng.com/)

[深入理解ES6](https://book.douban.com/subject/27072230/)

[ES6的rest参数和扩展运算符](https://zhuanlan.zhihu.com/p/32038245)
