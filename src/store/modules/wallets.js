

import ApiClass from "../../components/Api";
const Api = new ApiClass();
// initial state
const state = {
    all: [],
    allList: []
  }
  
  // getters
  const getters = {
    allWallets: state => state.all,
    allWalletsList: state => state.allList,
  }
  
  // actions
  const actions = {
    getAllWallets ({ commit }) {
        Api.index({model: "wallets"}).then((wallets)=>{
            commit('setWallets', wallets)   
        }).catch(()=>{
            commit('setWallets', [])    
        })
       
    },

    getAllWalletsList({commit}) {
      
      Api.index({model: "wallets"}).then((wallets)=>{
        for (let wallet of wallets) {  
          wallet.currencyName = wallet.Currency.name;  
        }
      
        commit('setWalletsList', wallets)   
      }).catch((error)=>{
        console.log(error);
        commit('setWalletsList', [])    
      }) 
    }
  }
  
  // mutations
  const mutations = {
    setWallets (state, wallets) {
      state.all = wallets
    }
    ,
    setWalletsList (state, wallets) {
      state.allList = wallets
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }