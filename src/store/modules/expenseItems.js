import ApiClass from "../../components/Api";
const Api = new ApiClass();


const state = {
    itemsList: [],
    itemsHierarchically: []
  }
  
  // getters
  const getters = {
    allExpenseItems: state => state.itemsList,
    allExpenseItemsHierarchically: state => state.itemsHierarchically,
  }
  
  // actions
  const actions = {
    getAllExpenseItems ({ commit }) {
        const conditions = {
            list: 1
        };

        Api.index({model: "expenditureitems", conditions: conditions}).then((items)=>{
          
            commit('setExpenseItems', items)   
        }).catch(()=>{
            commit('setExpenseItems', [])    
        })
       
    },
    getAllExpenseItemsHierarchically ({ commit }) {
       
        Api.index({model: "expenditureitems"}).then((items)=>{
          
            commit('setExpenseItemsH', items)   
        }).catch(()=>{
            commit('setExpenseItemsH', [])    
        })
       
    },
  }
  
  // mutations
  const mutations = {
    setExpenseItems (state, items) { 
      state.itemsList = items
    },
    setExpenseItemsH (state, items) { 
        state.itemsHierarchically = items
    }
  }
  
  export default {
    state,
    getters,
    actions,
    mutations
  }