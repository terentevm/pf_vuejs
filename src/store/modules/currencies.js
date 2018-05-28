import ApiClass from "../../components/Api";
const Api = new ApiClass();
// initial state
const state = {
    all: []
  }
  
  // getters
  const getters = {
    allCurrencies: state => state.all
  }
  
  // actions
  const actions = {
    getAllCurrencies ({ commit }) {
        Api.index({model: "currency"}).then((currencies)=>{
          
            commit('setCurrencies', currencies)   
        }).catch(()=>{
            commit('setCurrencies', [])    
        })
       
    }
  }
  
  // mutations
  const mutations = {
    setCurrencies (state, currencies) {
      
      state.all = currencies
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }