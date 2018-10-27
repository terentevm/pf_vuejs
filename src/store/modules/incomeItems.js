import ApiClass from "../../components/Api";
const Api = new ApiClass();


const state = {
    itemsList: [],
    itemsHierarchically: []
  }
  
  // getters
  const getters = {
    allIncomeItems: state => state.itemsList,
    allIncomeItemsHierarchically: state => state.itemsHierarchically,
  }
  
  // actions
  const actions = {
    getAllIncomeItems ({ commit }) {
        const conditions = {
            list: 1
        };

        Api.index({model: "incomeitems", conditions: conditions}).then((items)=>{
          
            commit('setIncomeItems', items)   
        }).catch(()=>{
            commit('setIncomeItems', [])    
        })
       
    },
    getAllIncomeItemsHierarchically ({ commit }) {
       
        Api.index({model: "incomeitems"}).then((items)=>{
          
            commit('setIncomeItemsH', items)   
        }).catch(()=>{
            commit('setIncomeItemsH', [])    
        })
       
    },
  }
  
  // mutations
  const mutations = {
    setIncomeItems (state, items) { 
      state.itemsList = items
    },
    setIncomeItemsH (state, items) { 
        state.itemsHierarchically = items
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }