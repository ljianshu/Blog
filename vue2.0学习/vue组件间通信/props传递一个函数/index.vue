<template>
  <div>
    <Props
      name="Hello Vue！"
      :type="type"
      :is-visible="false"
      :on-change="handlePropChange"
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
