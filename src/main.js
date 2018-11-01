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

//my custom list
import RoundedList from './components/Reusable/ListOfAmount.vue';

import indexBalance from './components/IndexBalance.vue';

import ExpenseTotal from './components/IndexDashboard/ExpenseTotal.vue'
import ExpensesList from './components/IndexDashboard/ExpensesList.vue'


import store from './store'
import 'babel-polyfill'
Vue.use(Vuetify)
Vue.use(VeeValidate);
Vue.component("tm-list-rounded", RoundedList);

Vue.component("tm-index-balance", indexBalance);
Vue.component("tm-index-expense-total", ExpenseTotal);
Vue.component("tm-index-expenses-list", ExpensesList);

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
