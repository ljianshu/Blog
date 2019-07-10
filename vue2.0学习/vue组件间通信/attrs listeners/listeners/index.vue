<template>
  <div class="hello">
    {{ firstMsg }}
    <child1 @changeData="changeData" @another="another" @other="other"></child1>
  </div>
</template>

<script>
import Child1 from "./child1.vue";
export default {
  components: {
    Child1
  },
  data() {
    return {
      firstMsg: "祖组件"
    };
  },
  methods: {
    changeData(params) {
      this.firstMsg = params;
    },
    another() {
      alert("another");
    },
    other() {
      alert("other");
    }
  }
};
</script>
