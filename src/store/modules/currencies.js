import ApiClass from "../../components/Api";
const Api = new ApiClass();
// initial state
const state = {
    all: [],
    withRates: [],
    classificator: []
  }
  
  // getters
  const getters = {
    allCurrencies: state => state.all,
    allCurrenciesWithRates: state => state.withRates,
    currencyClassificator: state => state.classificator
  }
  
  // actions
  const actions = {
    getAllCurrencies ({ commit }) {
        Api.index({model: "currency"}).then((currencies)=>{
          
            commit('setCurrencies', currencies)   
        }).catch(()=>{
            commit('setCurrencies', [])    
        })
       
    },

    getAllCurrenciesWithRates ({ commit }) {
      Api.index({model: "currency", conditions: {withRates:1}}).then((currencies)=>{  
          commit('setCurrenciesWithRates', currencies)   
      }).catch(()=>{
          commit('setCurrenciesWithRates', [])    
      })
     
    },

    getCurrencyClassificator({ commit }) {
      
      Api.get({model: "settings", action: "currencyclassificator"}).then((classificator)=>{  
        commit('setClassificator', classificator)   
      }).catch(()=>{
        commit('setClassificator', [])    
      });
    }
  }
  
  // mutations
  const mutations = {
    setCurrencies (state, currencies) {
      
      state.all = currencies
    },
    setCurrenciesWithRates (state, currencies) {
      
      state.withRates = currencies
    },

    setClassificator(state, classificator) {
      state.classificator = classificator;
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }