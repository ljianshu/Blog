<template>
  <div class="hello">
    <p>click {{count}} times,count is {{evenOrOdd}}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">increment if odd</button>
    <button @click="incrementAsync">increment async</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  computed: {
    count() {
      return this.$store.state.count;
    },
    evenOrOdd() {
      return this.$store.getters.evenOrOdd;
    }
  },
  methods: {
    increment() {
      this.$store.commit("INCREMENT");
    },
    decrement() {
      this.$store.commit("DECREMENT");
    },
    // 只有是奇数才加1
    incrementIfOdd() {
      this.$store.dispatch("incrementIfOdd"); //触发store中对应的action调用
    },
    // 过两秒才加1
    incrementAsync() {
      this.$store.dispatch("incrementAsync");
    }
  }
};
</script>


<style scoped>
</style>
