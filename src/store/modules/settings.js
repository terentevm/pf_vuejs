import ApiClass from '../../api/api_laravel';

import moment from 'moment';

const api = new ApiClass();

const state = {
    currency: null,
    wallet: null,
    currencyReports: null,
    newUser: false,
    hasCurrencies: true,
};

const getters = {
    currency: state => state.currency,
    wallet: state => state.wallet,
    currencyReports: state => state.currencyReports,
    sysCurrency: state => state.currency,
    dashboardSettings: state => state.dashboardSettings
};

const actions = {

    getSettings({commit}) {

        const cachedSettings_JSON = sessionStorage.getItem('settings');

        if (cachedSettings_JSON) {
            commit('setSettings', JSON.parse(cachedSettings_JSON));
            return;
        }

        api.index('settings').then(settings => {
            commit('setSettings', settings);
            commit('storeAtLocal');
        });
    },

    storeSettings({commit}) {

        commit('storeAtLocal');

        const body = {
            currency_id: null,
            wallet_id: null,
            report_currency: null
        };

        if (state.currency instanceof Object && state.currency.hasOwnProperty('id')) {
            body.currency_id = state.currency.id;
        }

        if (state.currencyReports instanceof Object && state.currencyReports.hasOwnProperty('id')) {
            body.report_currency = state.currencyReports.id;
        }

        if (state.wallet instanceof Object && state.wallet.hasOwnProperty('id')) {
            body.wallet_id = state.wallet.id;
        }

        return api.store('settings', body);

    }
};

const mutations = {

    storeAtLocal(state) {
        sessionStorage.setItem('settings', JSON.stringify(state));
    },

    setSettings(state, settings) {
        this.commit('setCurrency', settings.currency);
        this.commit('setWallet', settings.wallet);
        this.commit('setCurrencyReports', settings.currencyReports);

        //this settings setup only after getting data from server
        state.newUser = settings.newUser;
        state.hasCurrencies = settings.hasCurrencies;
    },

    setCurrency(state, currency) {
        state.currency = currency;
    },

    setWallet(state, wallet) {
        state.wallet = wallet;
    },

    setCurrencyReports(state, currency) {
        state.currencyReports = currency;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
