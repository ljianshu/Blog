<template>
  <div>
    <li class="item">
      <input v-model="checked" type="checkbox" />
      <slot name="item" :checked="checked"></slot>
    </li>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked: false
    };
  }
};
</script>
<style scoped>
.item {
  color: red;
}
</style>
