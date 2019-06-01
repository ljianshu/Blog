<template>
  <div>
    <Props
      name="Hello Vue！"
      :type="type"
      :is-visible="false"
      :on-change="handlePropChange" // 通过一般属性实现父向子通信；通过函数属性实现子向父通信
      title="属性Demo"
      class="test1"
      :class="['test2']"
      :style="{ marginTop: '20px' }"
      style="margin-top: 10px"
    />
  </div>
</template>
<script>
import Props from "./Props";
export default {
  components: {
    Props
  },
  data: () => {
    return {
      name: "",
      type: "success",
      bigPropsName: "Hello world!"
    };
  },
  methods: {
    handlePropChange(val) {
      this.type = val;
    }
  }
};
</script>
