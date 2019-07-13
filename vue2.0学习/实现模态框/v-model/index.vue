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
