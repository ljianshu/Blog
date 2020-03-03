<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div>浪里行舟</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    add() {
      this.$api.vote.voteAdd() // 直接就可以调用api,无需再引入api.js文件
    }
  }
}
</script>
<style></style>
