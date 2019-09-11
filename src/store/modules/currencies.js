import ApiClass from '../../api/api_laravel';
const api = new ApiClass();

// initial state
const state = {
    all: [],
    withRates: [],
    classificator: [],
};

// getters
const getters = {

    allCurrencies: state => state.all,
    allCurrenciesWithRates: state => state.withRates,
    currencyClassificator: state => state.classificator,
};

// actions
const actions = {
    getAllCurrencies({ commit }) {
        api.index('currencies')
            .then(currencies => {
                commit('setCurrencies', currencies);
            })
            .catch(err => {
                console.dir(err);
                commit('setCurrencies', []);
            });
    },

    getAllCurrenciesWithRates({ commit }) {
        api.index('currencies', { withRates: 1 } )
            .then(currencies => {
                commit('setCurrenciesWithRates', currencies);
            })
            .catch(() => {
                commit('setCurrenciesWithRates', []);
            });
    },

    getCurrencyClassificator({ commit }) {
        api.get('/static/data/eur_currencies.json')
            .then(classificator => {
                commit('setClassificator', classificator);
            })
            .catch(() => {
                commit('setClassificator', []);
            });
    },
};

// mutations
const mutations = {
    setCurrencies(state, currencies) {
        state.all = currencies;
    },
    setCurrenciesWithRates(state, currencies) {
        state.withRates = currencies;
    },

    setClassificator(state, classificator) {
        state.classificator = classificator;
    },

};

export default {
    state,
    getters,
    actions,
    mutations,
};
