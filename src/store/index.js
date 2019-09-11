import Vue from 'vue';
import Vuex from 'vuex';
import wallets from './modules/wallets';
import currencies from './modules/currencies';
import expenseItems from './modules/expenseitems';
import incomeItems from './modules/incomeitems';
import reports from './modules/reports';
import settings from './modules/settings';
import expenses from './modules/expenses';
import dashboard from './modules/dashboard';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        auth: false,
        title: '',
        iconTitle: '',
        componentMenu: [],
    },
    modules: {
        wallets,
        currencies,
        expenseItems,
        incomeItems,
        reports,
        settings,
        expenses,
        dashboard
    },
    mutations: {},
});
