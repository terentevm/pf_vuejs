import ApiClass from '../../api/api_laravel';
import moment from "moment";

const api = new ApiClass();

function storeDashboardSettingsToLocalStorage(settings) {
    if (window.localStorage) {
        localStorage.setItem('dashboard_settings', JSON.stringify(settings));
    }
}

function getDashboardSettingsFromLocalStorage(settings) {
    if (window.localStorage) {
        return JSON.parse(localStorage.getItem('dashboard_settings'));
    }
}

const state = {
    balanceTotal: 0,
    balanceTotalCurrency: '',
    balanceByWallets: [],
    expensesTotal: 0,
    expensesTotalCurrency: '',
    expensesDetails: [],
    incomesTotal: 0,
    incomesTotalCurrency: '',
    incomesDetails: [],

    dashboardSettings: {
        'periodicity': null,
        'periodicityOptions': [
            {
                period: 'month',
                name: "Current month",
                begin: moment().startOf('month').format('Y-MM-DD'),
                end: moment().endOf('month').format('Y-MM-DD')
            },
            {
                period: 'year',
                name: "Current year",
                begin: moment().startOf('year').format('Y-MM-DD'),
                end: moment().endOf('year').format('Y-MM-DD')
            },
            {
                period: 'week',
                name: "Current week",
                begin: moment().startOf('week').format('Y-MM-DD'),
                end: moment().endOf('week').format('Y-MM-DD')
            },
        ]
    },

};

// getters
const getters = {
    balanceTotal: state => state.balanceTotal,
    balanceTotalCurrency: state => state.balanceTotalCurrency,
    balanceByWallets: state => state.balanceByWallets,

    expensesTotal: state => state.expensesTotal,
    expensesTotalCurrency: state => state.expensesTotalCurrency,
    expensesDetails: state => state.expensesDetails,

    incomesTotal: state => state.incomesTotal,
    incomesTotalCurrency: state => state.incomesTotalCurrency,
    incomesDetails: state => state.incomesDetails
};

// actions
const actions = {

    async getBalance({commit}) {
        const params = {
            byWallets: true
        };

        const srvData = await api.post('/api/reports/balance', params)

        commit('setBalanceTotal', srvData.data.total);
        commit('setBalanceTotalCurrency', srvData.reportCurrency);
        commit('setBalanceByWallets', srvData.data.byWallets)
        console.dir(srvData);

    },

    async getExpensesWithDetails({commit}) {

        const params = {
            "byPeriod": false,
            "details": true
        };

        try {
            const report = await api.post('/api/reports/expenses', params);
            console.dir(report);
            commit('setExpensesCurrency', report.reportCurrency);
            commit('setExpensesTotal', report.data.total);
            commit('setExpensesDetails', report.data.rows);

        } catch (e) {
            console.log('Request expenses error');
            console.log(e);
        }

    },

    async getIncomesWithDetails({commit}) {

        const params = {
            "byPeriod": false,
            "details": true
        };

        try {
            const report = await api.post('/api/reports/incomes', params);
            console.dir(report);
            commit('setIncomesCurrency', report.reportCurrency);
            commit('setIncomesTotal', report.data.total);
            commit('setIncomesDetails', report.data.rows);

        } catch (e) {
            console.log('Request incomes error');
            console.log(e);
        }

    },

    initializeDashboardSettings({ commit }) {
        const storedSettings = getDashboardSettingsFromLocalStorage();
        console.dir(storedSettings);
        if (storedSettings) {
            commit('setPeriodicity', storedSettings.periodicity)
        }
    }

};

// mutations
const mutations = {

    setBalanceTotal(state, total) {

        state.balanceTotal = total;
    },

    setBalanceTotalCurrency(state, currency) {

        state.balanceTotalCurrency = currency;
    },

    setBalanceByWallets(state, byWallets) {

        state.balanceByWallets = byWallets;
    },

    setExpensesTotal(state, total) {
        state.expensesTotal = total;
    },

    setExpensesCurrency(state, currency) {
        state.expensesTotalCurrency = currency;
    },

    setExpensesDetails(state, details) {
        state.expensesDetails = details;
    },

    setIncomesTotal(state, total) {
        state.incomesTotal = total;
    },

    setIncomesCurrency(state, currency) {
        state.incomesTotalCurrency = currency;
    },

    setIncomesDetails(state, details) {
        state.incomesDetails = details;
    },

    //mutations for dashboard settings

    setPeriodicity(state, periodicity) {
        state.dashboardSettings.periodicity = periodicity;
        storeDashboardSettingsToLocalStorage(state.dashboardSettings);
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
