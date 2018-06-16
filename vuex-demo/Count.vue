<template>
    <div>
       <h2>{{msg}}</h2><hr/>
       <h2>{{$store.state.count}}-{{count}}</h2>
       <p>
       <button @click="addNumber">+</button>
       <button @click="reduceNumber">-</button>
       </p>
       <p>
       <button @click="addAction">+</button>
       <button @click="reduceAction">-</button>
       </p>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      msg: "Hello Vuex"
    };
  },
  methods: {
    addNumber() {
      return this.$store.commit("add", 2);
    },
    reduceNumber() {
      return this.$store.commit("reduce");
    },
    ...mapActions(["addAction", "reduceAction"])
  },
  computed: {
    ...mapState(["count"]),
    // ...mapGetters(["count"])
    // count() {
    //   return this.$store.getters.count;
    // }
  }
};
</script>

