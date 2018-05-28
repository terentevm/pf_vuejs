import Vue from 'vue'
import Vuex from 'vuex'
import wallets from './modules/wallets'
import currencies from './modules/currencies'
import expenseItems from './modules/expenseitems'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      auth: false,
      title: "",
      iconTitle: ""
    },
    modules: {
        wallets,
        currencies,
        expenseItems
    },
    mutations: {
      increment (state) {
        state.count++
      }
    }
  });