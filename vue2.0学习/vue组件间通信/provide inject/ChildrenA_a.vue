<template>
  <div>
    <div>
      <h1>A 结点</h1>
      <button @click="() => changeColor()">改变color</button>
      <ChildrenB />
      <ChildrenC />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import ChildrenB from "./ChildrenB";
import ChildrenC from "./ChildrenC";
export default {
  components: {
    ChildrenB,
    ChildrenC
  },
  // provide() {
  //   return {
  //     theme: {
  //       color: this.color //绑定并不是可响应的
  //     }
  //   };
  // },
  // 使用2.6最新API Vue.observable 优化响应式 provide
  provide() {
    this.theme = Vue.observable({
      color: "blue"
    });
    return {
      theme: this.theme
    };
  },
  methods: {
    changeColor(color) {
      if (color) {
        this.theme.color = color;
      } else {
        this.theme.color = this.theme.color === "blue" ? "red" : "blue";
      }
    }
  }
};
</script>
<style scoped></style>
