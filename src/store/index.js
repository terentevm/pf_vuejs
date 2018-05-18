import Vue from 'vue'
import Vuex from 'vuex'
import wallets from './modules/wallets'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      auth: false,
      title: "",
      iconTitle: ""
    },
    modules: {
        wallets
    },
    mutations: {
      increment (state) {
        state.count++
      }
    }
  });