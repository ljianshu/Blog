<template>
  <div v-if="value">
    <p>这是一个Model框</p>
    <div>子组件value：{{ value }}</div>
    <button @click="closeModel">关闭model框</button>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean
    }
  },
  methods: {
    closeModel() {
      this.$emit("input", false);
    }
  }
};
</script>
