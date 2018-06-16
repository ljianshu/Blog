import Vue from 'vue'
import App from './App.vue'
import store from "./vuex/store"
import Count from "./components/Count"
import HelloWorld from "./components/HelloWorld"
import VueRouter from "vue-router"

const router = new VueRouter({
  routes: [{
      path: "/",
      component: HelloWorld
    },
    {
      path: "/count",
      component: Count
    }
  ]
})
Vue.use(VueRouter)
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
