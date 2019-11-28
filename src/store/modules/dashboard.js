import ApiClass from '../../api/api_laravel';

import {format} from '../../helpers/date';
import parse from 'date-fns/parse';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';

const api = new ApiClass();
const optionsWeek = {weekStartsOn:1};

function storeDashboardSettingsToLocalStorage(settings) {
    if (window.localStorage) {
        localStorage.setItem('dashboard_settings', JSON.stringify(settings));
    }
}

function getDashboardSettingsFromLocalStorage() {
    if (window.localStorage) {
        return JSON.parse(localStorage.getItem('dashboard_settings'));
    }
}

function getPeriod(periodicity) {


    const period = {
        end: format(new Date)
    };

    switch (periodicity) {
        case 'year':
            period.begin = format(startOfYear(new Date()));
            break;
        case 'month':
            period.begin = format(startOfMonth(new Date()));
            break;
        case 'week':
            period.begin = startOfWeek(new Date(), optionsWeek);
            break;
        default:
            period.begin = format(startOfMonth(new Date()));
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

    expensesIncomeByYear: [],
    expensesIncomeByYearCurrency: null,
    expIncChartData: {},

    dashboardSettings: {
        'periodicity': null,
        'periodicityOptions': [
            {
                period: 'month',
                name: 'Current month',
                begin: format(startOfMonth(new Date())),
                end: format(endOfMonth(new Date()))
            },
            {
                period: 'year',
                name: 'Current year',
                begin: format(startOfYear(new Date())),
                end: format(endOfYear(new Date))
            },
            {
                period: 'week',
                name: 'Current week',
                begin: format(startOfWeek(new Date(), optionsWeek)),
                end: format(endOfWeek(new Date(), optionsWeek))
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

    expensesIncomeByYear: state => state.expensesIncomeByYear,
    expensesIncomeByYearCurrency: state => state.expensesIncomeByYearCurrency,
    expIncChartData: state => state.expIncChartData
};

// actions
const actions = {

    async getBalance({commit}) {
        const params = {
            byWallets: true
        };

        const srvData = await api.post('/api/reports/balance', params);

        commit('setBalanceTotal', srvData.data.total);
        commit('setBalanceTotalCurrency', srvData.reportCurrency);
        commit('setBalanceByWallets', srvData.data.byWallets);

    },

    async getExpensesWithDetails({commit}) {

        let params = {
            'byPeriod': false,
            'details': true
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
            'byPeriod': false,
            'details': true
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
            const res = await api.post('/api/reports/balance-by-periods', params);

            const labels = [];
            const data = [];

            res.data.forEach(balanceData => {
                labels.push(format(parse(balanceData.period, 'yyyy-MM-dd', new Date()), 'MMM yy'));
                data.push(Number(balanceData.sum));
            });

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

    async getExpensesIncomesByYear({commit}) {
        const params = getPeriod('year');

        try {
            const result = await api.post('/api/reports/compare-expenses-incomes', params);

            commit('setExpensesIncomeByYear', result.data);
            commit('setExpensesIncomeByYearCurrency', result.reportCurrency);

            const labels = [];
            const expenses = [];
            const incomes = [];

            result.data.forEach(balanceData => {

                labels.push(format(parse(balanceData.period, 'yyyy-MM-dd', new Date()), 'MMM yy'));

                expenses.push(Number(balanceData.expense));

                incomes.push(Number(balanceData.income));
            });

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'expenses',
                        backgroundColor: '#fdce3e',
                        borderColor: '#fdce3e',
                        fill: false,
                        data: expenses

                    },
                    {
                        label: 'incomes',
                        backgroundColor: '#2fc418',
                        borderColor:'#2fc418',
                        fill: false,
                        data: incomes
                    }]

            };

            commit('setExpIncChartData', chartData);

        }
        catch (e) {
            commit('setExpensesIncomeByYear', []);
            commit('setExpensesIncomeByYearCurrency', {
                short_name: 'NULL',
                code: 0,
                name: 'UNDEFINED'
            });
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
    },

    setExpensesIncomeByYear(state, data) {
        state.expensesIncomeByYear = data;
    },

    setExpensesIncomeByYearCurrency(state, currency) {
        state.expensesIncomeByYearCurrency = currency;
    },

    setExpIncChartData(state, chartData) {
        state.expIncChartData = chartData;
    }

};

export default {
    state,
    getters,
    actions,
    mutations,
};
