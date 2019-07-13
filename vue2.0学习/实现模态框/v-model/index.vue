//这是一个模态框的基本雏形，可以在父组件通过 v-model 来进行 model 框和父组件之间的显示交互。
//通过子组件看出通过props接收了value值，当点击关闭的时候还是通过$emit事件触发input事件，然后通过传入 false 参数。
<template>
  <div class="hello">
    <div>
      <p>父组件msg：{{ msg }}</p>
    </div>
    <button @click="show = true">打开model框</button>
    <br />
    <demo v-model="show"></demo>
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
      msg: "模拟一个model框"
    };
  }
};
</script>
