//v-model 毕竟不是给组件与组件之间通信而设计的双向绑定，无论从语意上和代码写法上都没有 .sync 直观和方便。
<template>
  <div class="hello">
    <div>
      <p>父组件msg：{{ msg }}</p>
      <p>父组件数组：{{ arr }}</p>
      <p>父组件对象：{{ obj.name }}</p>
    </div>
    <button @click="show = true">打开model框</button>
    <br />
    <demo :show.sync="show" :msg.sync="msg" :arr="arr" :obj="obj"></demo>
  </div>
</template>

<script>
import Demo from "./demo.vue";
export default {
  name: "Hello",
  components: {
    Demo
  },
  data() {
    return {
      show: false,
      msg: "模拟一个model框",
      arr: [1, 2, 3],
      obj: {
        name: "厦门"
      }
    };
  }
};
</script>
