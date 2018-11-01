import Vue from 'vue'
import Vuex from 'vuex'
import wallets from './modules/wallets'
import currencies from './modules/currencies'
import expenseItems from './modules/expenseitems'
import incomeItems from './modules/incomeitems'
import reports from './modules/reports'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      auth: false,
      title: "",
      iconTitle: "",
      componentMenu: []
    },
    modules: {
        wallets,
        currencies,
        expenseItems,
        incomeItems,
        reports
    },
    mutations: {
      increment (state) {
        state.count++
      }
    }
  });