<template>
  <div class="hello">
    <div class="msg">{{ firstMsg }}</div>
    <child1
      @changeData="changeData"
      @another="anotherEvent"
      @other="otherEvent"
    ></child1>
  </div>
</template>

<script>
import Child1 from "./child1.vue";
export default {
  components: {
    Child1
  },
  data() {
    return {
      firstMsg: "祖组件"
    };
  },
  methods: {
    changeData(params) {
      this.firstMsg = params;
    },
    anotherEvent() {
      alert("another");
    },
    otherEvent() {
      alert("other");
    }
  }
};
</script>
<style>
.hello {
  margin: 20px;
}
.msg {
  font-size: 20px;
  font-weight: bold;
}
</style>
