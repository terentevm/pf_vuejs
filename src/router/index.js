import Vue from "vue";
import Router from "vue-router";
import Wallets from "@/components/Wallets/WalletsList";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
// import Index from "@/components/Index";
import CurrenciesList from "@/components/Currencies/CurrenciesList";
import ItemsExpenditure from "@/components/ItemsExpenditure";
import ItemsIncome from "@/components/ItemsIncome";
// import ExpendElement from "@/components/ExpencePCForm.vue";
import Settings from "@/components/Settings";
import TransfersList from "@/components/TransfersList";
import Transfer from "@/components/Transfer";
// import DocExpends from "@/components/DocExpends";
// import DocIncomes from "@/components/DocIncomes";
// import Income from "@/components/Income";
// import LoadRates from "@/components/LoadRates";
// import CurrencyClassificator from "@/components/CurrencyClassificator";


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/wallets',
            name: 'Wallets',
            component: Wallets,
            meta: {requiresAuth: true},
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup,
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
        },
        {
            path: '/',
            name: 'Index',
            // component: Index,
            component: () => import(/* webpackChunkName: "dashboard"*/ '../components/Index.vue'),
            meta: {requiresAuth: true},
        },

        {
            path: '/currencies',
            name: 'Currencies',
            component: CurrenciesList,
            meta: {requiresAuth: true},
        },
        {
            path: '/loadcurrency',
            name: 'CurrencyClassificator',
            // component: CurrencyClassificator,
            component: () =>
                import(
                    /* webpackChunkName: "currency-classifier"*/ '../components/CurrencyClassificator.vue'
                    ),
            meta: {requiresAuth: true},
        },
        {
            path: '/itemsexpenditure',
            name: 'ItemsExpenditure',
            component: ItemsExpenditure,
            meta: {requiresAuth: true},
        },
        {
            path: '/itemsincome',
            name: 'ItemsIncome',
            component: ItemsIncome,
            meta: {requiresAuth: true},
        },
        {
            path: '/expends',
            name: 'DocExpends',
            // component: DocExpends,
            component: () =>
                import(/* webpackChunkName: "expenses"*/ '../components/DocExpends.vue'),
            meta: {requiresAuth: true},
        },
        {
            path: '/incomes',
            name: 'DocIncomes',
            // component: DocIncomes,
            component: () =>
                import(/* webpackChunkName: "incomes"*/ '../components/DocIncomes.vue'),
            meta: {requiresAuth: true},
        },
        {
            path: '/transfers',
            name: 'TransfersList',
            component: TransfersList,
            meta: {requiresAuth: true},
        },
        ,
        {
            path: '/transfers/:docId',
            name: 'Transfer',
            component: Transfer,
            props: true,
            meta: {requiresAuth: true},
        },

        {
            path: '/expend/:docId',
            name: 'ExpendElement',
            // component: ExpendElement,
            component: () =>
                import(/* webpackChunkName: "expense-form"*/ '../components/ExpencePCForm.vue'),

            props: true,
            meta: {requiresAuth: true},
        },

        {
            path: '/income/:docId',
            name: 'Income',
            // component: Income,
            component: () =>
                import(/* webpackChunkName: "income-form" */ '../components/Income.vue'),
            props: true,
            meta: {requiresAuth: true},
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings,
            props: true,
            meta: {requiresAuth: true},
        },
        {
            path: '/loadrates',
            name: 'LoadRates',
            component: () =>
                import(
                    /* webpackChunkName: "loadrates" */ /* webpackPrefetch: true*/ '../components/LoadRates.vue'
                    ),
            props: true,
            meta: {requiresAuth: false},
        },
    ],
});
