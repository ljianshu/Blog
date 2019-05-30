<template>
  <div>
    {{ fullName }}

    <div>firstName: <input v-model="firstName" /></div>
    <div>lastName: <input v-model="lastName" /></div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  data: function() {
    return {
      firstName: "浪里行舟",
      lastName: "前端工匠",
      fullName: "浪里行舟 前端工匠"
    };
  },
  watch: {
    firstName: function(val) {
      clearTimeout(this.firstTimeout);
      this.firstTimeOut = setTimeout(() => {
        this.fullName = val + " " + this.lastName;
      }, 1000);
    },
    lastName: function(val) {
      clearTimeout(this.lastTimeout);
      this.lastTimeOut = setTimeout(() => {
        this.fullName = this.firstName + " " + val;
      }, 1000);
    }
  }
};
</script>
