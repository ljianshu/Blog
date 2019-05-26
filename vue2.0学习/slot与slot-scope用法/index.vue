<template>
  <div class="toList">
    <input v-model="info" type="text" /> <button @click="addItem">添加</button>
    <ul>
      <TodoItem v-for="(item, index) in listData" :key="index">
        <template v-slot:item="itemProps">
          <span
            :style="{
              fontSize: '20px',
              color: itemProps.checked ? 'yellow' : 'blue'
            }"
            >{{ item }}</span
          >
        </template>
      </TodoItem>
    </ul>
  </div>
</template>
<script>
import TodoItem from "./TodoItem";
export default {
  components: {
    TodoItem
  },
  data() {
    return {
      info: "",
      listData: []
    };
  },
  methods: {
    addItem() {
      this.listData.push(this.info);
      this.info = "";
    }
  }
};
</script>
<style scoped>
.toList {
  margin: 20px;
}
</style>
