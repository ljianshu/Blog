<template>
  <div class="helloSlot">
    <h2>2.6 新语法</h2>
    <SlotDemo>
      <p>默认插槽：default slot</p>
      <template v-slot:title>
        <p>具名插槽：title slot1</p>
        <p>具名插槽：title slot2</p>
      </template>
      <template v-slot:title>
        <p>new具名插槽：title slot1</p>
        <p>new具名插槽：title slot2</p>
      </template>
      <template v-slot:item="props">
        <p>作用域插槽：item slot-scope {{ props }}</p>
      </template>
    </SlotDemo>
  </div>
</template>
<script>
import Slot from "./slot";
export default {
  components: {
    SlotDemo: Slot
  }
};
</script>
<style>
.helloSlot {
  margin: 20px;
}
</style>
