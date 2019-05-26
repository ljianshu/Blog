<template>
  <div v-if="show" class="border">
    <div>子组件msg：{{ msg }}</div>
    <div>子组件数组：{{ arr }}</div>
    <button @click="closeModel">关闭model框</button>
    <button @click="$emit('update:msg', '浪里行舟')">
      改变文字
    </button>
    <button @click="arr.push('前端工匠')">改变数组</button>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String
    },
    show: {
      type: Boolean
    },
    arr: {
      type: Array
    }
  },
  methods: {
    closeModel() {
      this.$emit("update:show", false);
    }
  }
};
</script>
<style scoped>
.border {
  border: 1px solid red;
  margin-top: 10px;
  padding: 10px;
}
</style>
