<template>
  <div class="hello">
    <div>
      <h2>显示格式化的日期时间</h2>
      <p>{{ date }}</p>
      <p>{{ date | filterDate }}</p>
      <p>年月日: {{ date | filterDate("YYYY-MM-DD") }}</p>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  filters: {
    filterDate(value, format = "YYYY-MM-DD HH:mm:ss") {
      return moment(value).format(format);
    }
  },
  data() {
    return {
      date: new Date()
    };
  }
};
</script>
<style>
.hello {
  margin: 30px;
}
</style>
