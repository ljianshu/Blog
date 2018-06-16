import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    add(state, n) {
      state.count += n;
    },
    reduce(state) {
      state.count--;
    }
  },
//   getters: {
//     count: state => state.count += 100
//   },
  actions: {
    addAction(context) {
      context.commit('add', 2);
      setTimeout(() => {
        context.commit('reduce')
      }, 2000);
      console.log('我比reduce提前执行');
    },
    reduceAction({
      commit
    }) {
      commit('reduce')
    }
  }
});

export default store;
