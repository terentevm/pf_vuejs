import Vue from 'vue'
import Router from 'vue-router'
import Wallets from '@/components/Wallets'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import Index from '@/components/Index'
import CurrenciesList from '@/components/CurrenciesList'
import ItemsExpenditure from '@/components/ItemsExpenditure'
import DocExpends from '@/components/DocExpends'
import ExpendElement from '@/components/ExpendElement'
Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/wallets',
      name: 'Wallets',
      component: Wallets,
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/itemsexpenditure',
      name: 'ItemsExpenditure',
      component: ItemsExpenditure,
      meta: { requiresAuth: true }
    }
    
    ,
    {
      path: '/expends',
      name: 'DocExpends',
      component: DocExpends,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/expend',
      name: 'ExpendElement',
      component: ExpendElement,
      meta: { requiresAuth: true }
    }
  ]
  
})
