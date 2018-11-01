import ApiClass from "../../components/Api";
const API = new ApiClass();

const state = {
    expenseTotalAmount: 0,
    expenses:[],
    incomeTotal: 0,
    incomes: []
};

const getters = {
    expenseTotalAmount: state => state.expenseTotalAmount,
    expenses: state => state.expenses
};

const actions = {
    getExpenses: ({ commit }, settings) => {
        console.dir(settings);

        const params = {
            model: "reports",
            action: "expenses",
            data: settings
        };
        
        API.post(params)
        .then((response)=>{
            
            commit("setExpenses", response.data);

        })
        .catch(error => {
            console.error(error);
        });

    } 
};

const mutations = {
    setExpenses: (state, expenses) => {
        
        let total = 0;

        for (let row of expenses) {
            total += Number(row.sumConverted);
        }

        state.expenseTotalAmount = total.toFixed(2);
        state.expenses = expenses;
        
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};