import ApiClass from '../../api/api_laravel';

const api = new ApiClass();

// initial state
const state = {
  all: [],
  withRates: [],
  classifier: [],
};

// getters
const getters = {

  allCurrencies: state => state.all,
  allCurrenciesWithRates: state => state.withRates,
  classifier: state => state.classifier,
};

// actions
const actions = {
  getAllCurrencies({commit}) {
    api.index('currencies')
      .then(currencies => {
        commit('setCurrencies', currencies);
      })
      .catch(err => {
        console.dir(err);
        commit('setCurrencies', []);
      });
  },

  getAllCurrenciesWithRates({commit}) {
    api.index('currencies', {withRates: true})
      .then(currencies => {
        commit('setCurrenciesWithRates', currencies);
      })
      .catch(() => {
        commit('setCurrenciesWithRates', []);
      });
  },

  getCurrencyClassifier({commit}) {
    api.get('/currencies.json')
      .then(data => {
        commit('setClassifier', data);
      })
      .catch(() => {
        commit('setClassifier', []);
      });
  },

  async storeCurrency({commit}, currency) {
    try {
      const res = !currency.id
        ? await api.store('currencies', currency)
        : await api.update('currencies', currency.id, currency)

      return true;
    }
    catch (error) {
      console.error(error);
      throw error;
    }

  },

  async deleteCurrency({commit}, currency) {
    try {
      await api.delete('currencies', currency.id);
      return true;
    }
    catch (e) {
      return false;
    }
  }
};

// mutations
const mutations = {
  setCurrencies(state, currencies) {
    state.all = currencies;
  },
  setCurrenciesWithRates(state, currencies) {
    state.withRates = currencies;
  },

  setClassifier(state, data) {

    data.map(item => {
      item.selected = false;
    });

    data.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });

    state.classifier = data;
  },

};

export default {
  state,
  getters,
  actions,
  mutations,
};
