import ApiClass from '../../components/Api';
const API = new ApiClass();

const state = {
  expenseTotalAmount: 0,
  expenses: [],
  incomeTotal: 0,
  incomes: [],
};

const getters = {
  expenseTotalAmount: state => state.expenseTotalAmount,
  incomeTotal: state => state.incomeTotal,
  expenses: state => state.expenses,
  incomes: state => state.incomes,
};

const actions = {
  getExpenses: ({ commit }, settings) => {
    const params = {
      model: 'reports',
      action: 'expenses',
      data: settings,
    };

    API.post(params)
      .then(response => {
        commit('setExpenses', response.data);
      })
      .catch(error => {
        console.error(error);
      });
  },

  getIncomes: ({ commit }, settings) => {
    const params = {
      model: 'reports',
      action: 'incomes',
      data: settings,
    };

    API.post(params)
      .then(response => {
        commit('setIncomes', response.data);
      })
      .catch(error => {
        console.error(error);
      });
  },
};

const mutations = {
  setExpenses: (state, expenses) => {
    let total = 0;

    for (let row of expenses) {
      total += Number(row.sumConverted);
    }

    state.expenseTotalAmount = total.toFixed(2);
    state.expenses = expenses;
  },

  setIncomes: (state, incomes) => {
    let total = 0;

    for (let row of incomes) {
      total += Number(row.sumConverted);
    }

    state.incomeTotal = total.toFixed(2);
    state.incomes = incomes;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
