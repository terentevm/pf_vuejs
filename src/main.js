// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'

import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
import '../src/assets/css/bootstrap-grid.css';

Vue.use(Vuetify)
Vue.config.productionTip = false;

/* eslint-disable no-new */

router.beforeEach((to, from, next) => {
  console.log('test');
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

new Vue({
  el: '#app',
  router,
  data:function() { 
    return {
    visible: true,
    message: 'Hello Vue!',
    settings:{jwt:sessionStorage.getItem("jwt")}
  }
    
  },
  template: '<App/>',
  components: { App }
})
