<template>
  <div>
    <slot />
    <slot name="title" />
    <slot name="item" :propData="propData" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      propData: {
        value: "浪里行舟"
      }
    };
  }
};
</script>
