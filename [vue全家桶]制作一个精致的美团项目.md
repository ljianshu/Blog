## 一、项目展示：

![美团](https://user-gold-cdn.xitu.io/2018/5/18/1637183ad14a696a?w=372&h=791&f=gif&s=2408442)

**注意：如果gif动态图看不了，麻烦大家点击[github美团项目](https://github.com/ljianshu/mt-app)中mt-app/src/assets/美团.gif便可以观看！**

本项目很适合vue初学者，如果业务逻辑看不懂，很欢迎一起讨论！

源码地址：[mt-app](https://github.com/ljianshu/mt-app)，欢迎 star 和 fork

如果对你有些许帮助，不妨点赞、关注我一下啊

## 二、项目涉及到技术栈：
- vue全家桶：Vue、Vue-router、Vue-cli等
- 组件化：单Vue文件
- 模块化：ES6 Module
- 第三方模块：better-scroll axios等
- 基础开发环境和包管理：Node、npm
- 构建工具：webpack
- 编辑器：webstrom

## 三、项目主要功能
一言而蔽之：一款集点菜、用户评价和商家信息为一体的移动端点餐APP
1. 点餐页面
点选商品后自动添加到购物车，并计算好总价，在商品列表、购物车列表和商品详情页都可以随意增减数目，此外左侧商品分类和右侧的商品相互关联，通过better-scroll插件滑动商品列表时，相应的商品分类也会跟着跳转。
2. 用户评价页面
主要包括一个TAB栏，包括三部分：全部、有图和评价三个模块
3. 商家信息页面
主要介绍一些商家基本信息，可以通过better-scroll插件，进行左右滑动图片

## 四、项目难点
该项目业务逻辑主要集中在点餐模块，而点餐模块中难点便是如何实现商品列表滑动，以及右侧商品分类和左侧商品列表如何联动？

![](https://user-gold-cdn.xitu.io/2018/5/18/1637183ad1532dfb?w=361&h=529&f=png&s=87211)

首先要实现商品列表的滑动，就需要用到一个better-scroll插件，better-scroll 是一款重点解决移动端（已支持 PC）各种滚动场景需求的插件。
- 安装better-scroll `npm install better-scroll --save`
- 在Good.vue文件中script引入`import BScroll from 'better-scroll'`

这些准备工作做好后，实现左右两边列表联动，总结起来有以下四个步骤：
**1. 计算商品分类的区间高度**
```
//template部分
  <!--商品列表-->
    <div class="foods-wrapper" ref="foodScroll">
      <ul>
        <!--专场-->
        <li class="container-list food-list-hook">
          <div v-for="(item,index) in container.operation_source_list" :key="index">
            <img :src="item.pic_url">
          </div>
        </li>
        <!-- 具体分类 -->
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h3 class="title">{{item.name}}</h3>
          <!-- 具体的商品列表 -->
          <ul>
            <li v-for="(food,index) in item.spus" :key="index" @click="showDetail(food)" class="food-item">
            ......
```
```
//JS部分
methods:{
  calculateHeight() {   // 计算分类的区间总高度(包括专场和所有具体分类的总高)
        let foodlist = this.$refs.foodScroll.getElementsByClassName("food-list-hook")
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodlist.length; i++) {
          let item = foodlist[i]
          height += item.clientHeight    // 累加
          this.listHeight.push(height)
        }
        console.log(this.listHeight)//[0, 43, 1231, 2401, 3589, 4451, 6121, 7656, 8497, 9344, 10080]
      }，
   initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuScroll, {  //实例化
          click: true  //点击事件才能生效
        })
        this.foodScroll = new BScroll(this.$refs.foodScroll, {
          probeType: 3,
          click: true
        })
},
   created() {
      fetch("/api/goods")
        .then(res => res.json())
        .then(response => {
          if (response.code == 0) {
           this.container = response.data.container_operation_source
           this.goods = response.data.food_spu_tags
           this.poiInfo = response.data.poi_info 
           this.$nextTick(() => {  //在created中数据虽已初始化，但dom未生成，页面还没显示，要使用回调函数，确保DOM已经更新
           this.initScroll()        // 执行滚动方法
           this.calculateHeight() //调用计算分类区间高度的方法
            })
          }
        })
    }
```
**2. 监听滚动的位置**
```
initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuScroll)
        this.foodScroll = new BScroll(this.$refs.foodScroll, {
          probeType: 3，//在屏幕滑动的过程中实时派发 scroll 事件
         click:true//点击事件才能生效
        })
        //foodScroll监听事件
        this.foodScroll.on("scroll", (pos) => {
          this.scrollY = Math.abs(pos.y)
          console.log(this.scrollY)
        })
      }
```
**3. 根据滚动位置确认下标，与左侧对应**
```
computed:{
    currentIndex(){
      for(let i = 0; i < this.listHeight.length; i++){
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i+1] // 获取商品区间的范围
        if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
          return i;    // 是否在上述区间中
        }
      }
      return 0
    }
```
```
        <li class="menu-item"
          :class="{'current':currentIndex === 0}"//动态绑定一个样式，.current设置样式
          @click="selectMenu(0)">
          <p class="text">
            <img class="icon" :src="container.tag_icon" v-if="container.tag_icon">
            {{container.tag_name}}
          </p>
        </li>
        <li class="menu-item"
            :class="{'current':currentIndex === index + 1}"
            v-for="(item,index) in goods" :key="index"
            @click="selectMenu(index+1)"
            >
```
**4. 通过下标实现点击左侧，滚动右侧**
```
<li class="menu-item" :class="{'current':currentIndex===0}" @click="selectMenu(0)">
<li class="menu-item" :class="{'current':currentIndex===index+1}" 
v-for="(item,index) in goods" :key="index" @click="selectMenu(index+1)">//同一个函数传值不一样
```
```
 selectMenu(index) {
        let foodlist = this.$refs.foodScroll.getElementsByClassName("food-list-hook")
        let element = foodlist[index]
        this.foodScroll.scrollToElement(element, 250)
      }
```
## 五、项目总结
- vue数据和视图的分离,以数据驱动视图，只关心数据变化，DOM操作被封装，在实际开发过程中大大提高了效率。
- Vue的组件化功能可谓是它的一大亮点，通过将页面上某一组件的html、CSS、JS代码放入一个.vue的文件中进行管理可以大大提高代码的维护性。
- 项目中未做移动端适配，在不同屏幕手机上打开，可能用户体验会差些




