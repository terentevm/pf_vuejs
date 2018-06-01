import Vue from 'vue'
import Router from 'vue-router'
import Wallets from '@/components/Wallets'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import Index from '@/components/Index'
import CurrenciesList from '@/components/CurrenciesList'
import ItemsExpenditure from '@/components/ItemsExpenditure'
import ItemsIncome from '@/components/ItemsIncome'
import DocExpends from '@/components/DocExpends'
import DocIncomes from '@/components/DocIncomes'
import Income from '@/components/Income'
import ExpendElement from '@/components/ExpendElement'
import NewSettings from '@/components/NewSettings'
import TransfersList from '@/components/TransfersList'
import Transfer from '@/components/Transfer'
import LoadRates from '@/components/LoadRates'

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
      path: '/',
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
      path: '/itemsincome',
      name: 'ItemsIncome',
      component: ItemsIncome,
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
      path: '/incomes',
      name: 'DocIncomes',
      component: DocIncomes,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/transfers',
      name: 'TransfersList',
      component: TransfersList,
      meta: { requiresAuth: true }
    },
    ,
    {
      path: '/transfer/:docId',
      name: 'Transfer',
      component: Transfer,
      props: true ,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/transfer',
      name: 'Transfer',
      component: Transfer,
      props: true ,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/expend/:docId',
      name: 'ExpendElement',
      component: ExpendElement,
      props: true ,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/expend',
      name: 'ExpendElement',
      component: ExpendElement,
      props: true ,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/income/:docId',
      name: 'Income',
      component: Income,
      props: true ,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/income',
      name: 'Income',
      component: Income,
      props: true ,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/newsettings',
      name: 'NewSettings',
      component: NewSettings,
      props: true ,
      meta: { requiresAuth: false }
    }
    ,
    {
      path: '/loadrates',
      name: 'LoadRates',
      component: LoadRates,
      props: true ,
      meta: { requiresAuth: false }
    }
  ]
  
})
