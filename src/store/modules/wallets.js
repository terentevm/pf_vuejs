

import ApiClass from "../../components/Api";
const Api = new ApiClass();
// initial state
const state = {
    all: [],
    allList: [],
    balanceAll: [],
    loading: false
  }
  
  // getters
  const getters = {
    allWallets: state => state.all,
    allWalletsList: state => state.allList,
    balanceAll: state => state.balanceAll,
    loading: state => state.loading
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
    },

    getBalanceAll({ commit }) {
      const params = {
        model: "wallets",
        action: "BalanceAll"
      };
      state.loading = true;
      Api.post(params).then((wallets)=>{  
        commit('setBalanceAll', wallets.data) 
        state.loading = false; 
      }).catch((error)=>{
        console.log(error);
        commit('setBalanceAll', [])
        state.loading = false;     
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
    },

    setBalanceAll(state, wallets) {
      state.balanceAll = wallets;
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }