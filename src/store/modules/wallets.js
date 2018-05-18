
import ModelClass from "../../components/Model";
const Model = new ModelClass();

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
        Model.getWallets(0).then((wallets)=>{
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