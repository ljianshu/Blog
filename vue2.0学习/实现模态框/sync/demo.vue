<template>
  <div v-if="show" class="border">
    <div>子组件msg：{{ msg }}</div>
    <div>子组件数组：{{ arr }}</div>
    <p>子组件对象：{{ obj.name }}</p>
    <button @click="closeModel">关闭model框</button>
    <button @click="$emit('update:msg', '浪里行舟')">
      改变文字
    </button>
    <button @click="arr.push('前端工匠')">改变数组</button>
    <button @click="changeText">改变对象</button>
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
      type: Array //在子组件中改变传递过来数组将会影响到父组件的状态
    },
    obj: {
      type: Object
    }
  },
  methods: {
    closeModel() {
      this.$emit("update:show", false);
    },
    changeText() {
      this.obj.name === "前端"
        ? (this.obj.name = "浪里行舟")
        : (this.obj.name = "前端");
    }
  }
};
</script>
