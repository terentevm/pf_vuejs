

import ApiClass from "../../components/Api";
const Api = new ApiClass();
// initial state
const state = {
    all: [],
    allList: [],
    balanceAll: [],
    balanceTotal: 0,
    loading: false
  }
  
  // getters
  const getters = {
    allWallets: state => state.all,
    allWalletsList: state => state.allList,
    balanceAll: state => state.balanceAll,
    balanceTotal: state => state.balanceTotal,
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
        console.log(wallets);
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
      let total = 0;

      for (let balanceData of wallets) {
        total += balanceData.convertedAmount;
      }
      
      state.balanceAll = wallets;
      state.balanceTotal = total;
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }