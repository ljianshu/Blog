<template>
  <div class="attr">
    <h1>watch属性</h1>
    <h2>{{ $data }}</h2>
    <button @click="() => (a += 1)">修改a的值</button>
    <br />
    <br />
    <Watch />
  </div>
</template>
<script>
import Watch from "./watch";
export default {
  components: {
    Watch
  },
  data() {
    return {
      a: 1,
      b: { c: 2, d: 3 },
      e: {
        f: {
          g: 4
        }
      },
      h: []
    };
  },
  watch: {
    a: function(val, oldVal) {
      this.b.c += 1;
      console.log("new: %s, old: %s", val, oldVal);
    },
    "b.c": function(val, oldVal) {
      this.b.d += 1;
      console.log("new: %s, old: %s", val, oldVal);
    },
    "b.d": function(val, oldVal) {
      this.e.f.g += 1;
      console.log("new: %s, old: %s", val, oldVal);
    },
    e: {
      handler: function(val, oldVal) {
        this.h.push("浪里行舟");
        console.log("new: %s, old: %s", val, oldVal);
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.attr {
  margin: 20px;
}
</style>
