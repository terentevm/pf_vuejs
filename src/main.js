// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'

import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';
import 'vuetify/dist/vuetify.min.css'
import '../src/assets/css/bootstrap-grid.css';

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VeeValidate);
Vue.config.productionTip = false;

/* eslint-disable no-new */

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    
    if (!sessionStorage.getItem("jwt") ) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() 
  }
});
const store = new Vuex.Store({
  state: {
    auth: false,
    title: "",
    iconTitle: ""
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});
var vm = new Vue({
  el: '#app',
  router: router,
  store,
  data:{ 
    
    visible: true,
    message: 'Hello Vue!',
    showMenu: true
  },
  template: '<App/>',
  components: { App }
})
