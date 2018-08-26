import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {// 包含了多个直接更新state函数的对象
        INCREMENT(state) {
            state.count = state.count + 1;
        },
        DECREMENT(state) {
            state.count = state.count - 1;
        }
    },
    getters: {   // 当读取属性值时自动调用并返回属性值
        evenOrOdd(state) {
            return state.count % 2 === 0 ? "偶数" : "奇数";
        }
    },
    actions: { // 包含了多个对应事件回调函数的对象
        incrementIfOdd({ commit, state }) { // 带条件的action
            if (state.count % 2 === 1) {
                commit('INCREMENT')
            }
        },
        incrementAsync({ commit }) { //异步的action
            setInterval(() => {
                commit('INCREMENT')
            }, 2000);
        }

    }
})
export default store //用export default 封装代码，让外部可以引用
