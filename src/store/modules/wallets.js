

import ApiClass from "../../components/Api";
const Api = new ApiClass();
// initial state
const state = {
    all: []
  }
  
  // getters
  const getters = {
    allWallets: state => state.all
  }
  
  // actions
  const actions = {
    getAllWallets ({ commit }) {
        Api.index({model: "wallets"}).then((wallets)=>{
            commit('setWallets', wallets)   
        }).catch(()=>{
            commit('setWallets', [])    
        })
       
    }
  }
  
  // mutations
  const mutations = {
    setWallets (state, wallets) {
      state.all = wallets
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }