<template>
  <div class="hello">
    <div>
      <input v-model.lazy="value" type="text" />
      <span style="font-size:20px;margin-left:10px;">{{ value }}</span>
      <p style="margin-top:10px;">父组件msg：{{ msg }}</p>
      <p>父组件数组：{{ arr }}</p>
    </div>
    <button @click="show = true">打开model框</button>
    <br />
    <demo :show.sync="show" :msg.sync="msg" :arr="arr"></demo>
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
      value: "",
      show: false,
      msg: "模拟一个model框",
      arr: [1, 2, 3]
    };
  }
};
</script>
<style>
.hello {
  margin: 20px;
}
</style>
