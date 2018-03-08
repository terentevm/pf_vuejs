import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Wallets from '@/components/Wallets'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import Index from '@/components/Index'
import CurrenciesList from '@/components/CurrenciesList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/wallets',
      name: 'Wallets',
      component: Wallets
    }
    ,
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
    ,
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
    ,
    {
      path: '/index',
      name: 'Index',
      component: Index,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/currencies',
      name: 'Currencies',
      component: CurrenciesList,
      meta: { requiresAuth: false }
    }
  ]
  
})
