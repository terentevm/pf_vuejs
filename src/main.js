// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import SideMenu from './components/SideMenu'
import Table from '@/components/Table'
import router from './router'
import VueMaterial from 'vue-material'
import Vuetify from 'vuetify'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
import 'vuetify/dist/vuetify.min.css'
Vue.use(VueMaterial)
Vue.use(Vuetify)
Vue.config.productionTip = false;
Vue.component('my-SideMenu',SideMenu);
Vue.component('tm-table',Table);
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
    message: 'Hello Vue!'
  }
    
  },
  template: '<App/>',
  components: { App }
})
