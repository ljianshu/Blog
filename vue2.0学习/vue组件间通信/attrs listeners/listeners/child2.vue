<template>
  <div class="hello">
    <p @click="$listeners.changeData('change')">孙子组件</p>
  </div>
</template>
<script>
export default {
  created() {
    console.log("child2", this.$listeners);
  }
};
</script>
