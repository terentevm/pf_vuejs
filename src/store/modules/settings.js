import ApiClass from '../../api/api_laravel';

const api = new ApiClass();

const state = {
    currency: null,
    wallet: null,
    reportcurrency: null,
    newUser: false,
    hasCurrencies: true,
    periodicity: 'year',
    periodOptions: ['year', 'quarter', 'month', 'week', 'day']
};

const getters = {
    currency: state => state.currency,
    wallet: state => state.wallet,
    reportcurrency: state => state.reportcurrency,
    sysCurrency: state => state.currency,
    dashboardSettings: state => state.dashboardSettings,
    periodicity: state => state.periodicity,
    periodOptions: state => state.periodOptions
};

const actions = {
    getSettings({ commit }) {
        const cachedSettings_JSON = sessionStorage.getItem('settings');

        if (cachedSettings_JSON) {
            commit('setSettings', JSON.parse(cachedSettings_JSON));
            return;
        }

        this.getSettingsFromApi({ commit });
    },

    async getSettingsFromApi({ commit }) {
        const settings = await api.index('settings');

        commit('setSettings', settings);
        commit('storeAtLocal');
    },

    storeSettings({ commit }) {
        commit('storeAtLocal');
        
        const body = {
            currency_id: null,
            wallet_id: null,
            report_currency: null,
            periodicity: state.periodicity
        };

        if (state.currency instanceof Object && state.currency.hasOwnProperty('id')) {
            body.currency_id = state.currency.id;
        }

        if (state.reportcurrency instanceof Object && state.reportcurrency.hasOwnProperty('id')) {
            body.report_currency = state.reportcurrency.id;
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
        console.log('set settings');
        console.dir(settings);
        this.commit('setCurrency', settings.currency);
        this.commit('setWallet', settings.wallet);
        this.commit('setCurrencyReports', settings.reportcurrency);
        this.commit('setPeriodicity', settings.periodicity);

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
        state.reportcurrency = currency;
    },

    setPeriodicity(state, periodicity) {
        console.log(`set periodicity = ${periodicity}`);
        state.periodicity = periodicity;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
