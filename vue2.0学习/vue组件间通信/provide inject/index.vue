<template>
  <div>
    <ChildrenA />
    <!-- <ChildrenA1 /> -->
  </div>
</template>
<script>
import ChildrenA from "./ChildrenA";
// import ChildrenA1 from "./ChildrenA_a";
export default {
  components: {
    ChildrenA
    // ChildrenA1
  }
};
</script>
<style>
.border,
.border1,
.border2 {
  border: 1px solid #000;
  padding: 10px 0;
  margin: 10px 10px 0;
}
.border1 {
  border-color: #ccc;
}
.border2 {
  border-color: #eee;
}
</style>
