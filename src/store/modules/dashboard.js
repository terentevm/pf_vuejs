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

function getPeriod(periodicity) {

    const period = {
        end: moment().format('YYYY-MM-DD')
    };

    switch (periodicity) {
        case 'year':
            period.begin = moment().startOf('year').format('YYYY-MM-DD');
            break;
        case 'month':
            period.begin = moment().startOf('month').format('YYYY-MM-DD');
            break;
        case 'week':
            period.begin = moment().startOf('week').format('YYYY-MM-DD');
            break;
        default:
            period.begin = moment().startOf('month').format('YYYY-MM-DD');
    }

    return period;
}

const state = {
    balanceTotal: 0,
    balanceTotalCurrency: '',
    balanceByWallets: [],

    balanceByPeriodsData: [],
    balanceByPeriodsCurrency: null,
    balanceByPeriodsChartData: {},

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
    balanceByPeriodsChartData: state => state.balanceByPeriodsChartData,
    balanceByPeriodsCurrency: state => state.balanceByPeriodsCurrency,

    expensesTotal: state => state.expensesTotal,
    expensesTotalCurrency: state => state.expensesTotalCurrency,
    expensesDetails: state => state.expensesDetails,

    incomesTotal: state => state.incomesTotal,
    incomesTotalCurrency: state => state.incomesTotalCurrency,
    incomesDetails: state => state.incomesDetails,


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
        commit('setBalanceByWallets', srvData.data.byWallets);

    },

    async getExpensesWithDetails({commit}) {

        let params = {
            "byPeriod": false,
            "details": true
        };

        if (!state.dashboardSettings.periodicity) {
            this.dispatch('initializeDashboardSettings');
        }

        params = state.dashboardSettings.periodicity
            ? Object.assign(params, getPeriod(state.dashboardSettings.periodicity.period))
            : Object.assign(params, getPeriod('year'));


        try {
            const report = await api.post('/api/reports/expenses', params);
            commit('setExpensesCurrency', report.reportCurrency);
            commit('setExpensesTotal', report.data.total);
            commit('setExpensesDetails', report.data.rows);

        } catch (e) {
            console.log('Request expenses error');
            console.log(e);
        }

    },

    async getIncomesWithDetails({commit}) {

        let params = {
            "byPeriod": false,
            "details": true
        };

        if (!state.dashboardSettings.periodicity) {
            this.dispatch('initializeDashboardSettings');
        }

        params = state.dashboardSettings.periodicity
            ? Object.assign(params, getPeriod(state.dashboardSettings.periodicity.period))
            : Object.assign(params, getPeriod('year'));


        try {
            const report = await api.post('/api/reports/incomes', params);
            commit('setIncomesCurrency', report.reportCurrency);
            commit('setIncomesTotal', report.data.total);
            commit('setIncomesDetails', report.data.rows);

        } catch (e) {
            console.log('Request incomes error');
            console.log(e);
        }

    },

    async getBalanceByPeriods({commit}) {

        if (!state.dashboardSettings.periodicity) {
            this.dispatch('initializeDashboardSettings');
        }

        let params = {};

        if (state.dashboardSettings instanceof Object) {
            params = state.dashboardSettings.periodicity instanceof Object
                ? Object.assign({}, getPeriod(state.dashboardSettings.periodicity.period))
                : Object.assign({}, getPeriod('year'));
        }
        else {
            params = Object.assign({}, getPeriod('year'));
        }


        try {
            const res = await api.post("/api/reports/balance-by-periods", params);

            const labels = [];
            const data = [];

            res.data.forEach(balanceData => {
                labels.push(moment(balanceData.period).format('MMM YY'));
                data.push(Number(balanceData.sum));
            })

            const chartData = {
                labels: labels,
                datasets: [{
                    label: 'Balance by months',
                    backgroundColor: '#2fc418',
                    data: data
                }]
            };

            commit('setBalanceByPeriodsCurrency', res.reportCurrency);
            commit('setBalanceByPeriodsData', res.data);
            commit('setBalanceByPeriodsChartData', chartData);
        }
        catch (err) {
            commit('setBalanceByPeriodsData', []);

            console.log('error occurred during request to /api/reports/balance-by-periods');
            console.dir(err);
        }

    },

    initializeDashboardSettings({commit}) {
        const storedSettings = getDashboardSettingsFromLocalStorage();

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
    },

    setBalanceByPeriodsCurrency(state, currency) {
        state.balanceByPeriodsCurrency = currency;
    },

    setBalanceByPeriodsData(state, data) {
        state.balanceByPeriodsData = data;
    },

    setBalanceByPeriodsChartData(state, chartData) {
        state.balanceByPeriodsChartData = chartData;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
