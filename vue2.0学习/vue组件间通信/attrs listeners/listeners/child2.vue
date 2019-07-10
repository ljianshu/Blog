<template>
  <div class="hello">
    <p @click="$listeners.changeData('change')">孙子组件</p>
    <p @click="$listeners.another()">触发祖组件的another事件</p>
    <p @click="$listeners.other()">触发祖组件的other事件</p>
  </div>
</template>
<script>
export default {
  created() {
    console.log("child2", this.$listeners); // {changeData: ƒ, another: ƒ, other: ƒ}
  }
};
</script>
