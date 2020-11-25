import Vue from 'vue';
import Router from 'vue-router';

import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';

Vue.use(Router);

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/auth',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          props: { default: true},
          component: () => import(/* webpackChunkName: "login" */ '@/components/Auth/LoginPage.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import(/* webpackChunkName: "signup" */ '@/components/Auth/Signup.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'app',
      component: AppLayout,
      children: [
        {
          path: '/wallets',
          name: 'Wallets',
          component: () => import(
            /* webpackChunkName: "wallets" */
            '../components/Wallets/ListForm'
            ),
          meta: {requiresAuth: true},
        },
        {
          path: '/',
          name: 'Dashboard',
          component: () => import(
            /* webpackChunkName: "dashboard"*/
            /* webpackPrefetch: true*/
            '../components/Index.vue'),
          meta: {requiresAuth: true},
        },

        {
          path: '/currencies',
          name: 'Currencies',
          component: () => import(
            /* webpackChunkName: "currencies" */
            '../components/Currencies/ListForm'),
          meta: {requiresAuth: true},
        },
        {
          path: '/loadcurrency',
          name: 'CurrencyClassificator',
          component: () =>
            import(
              /* webpackChunkName: "currency-classifier"*/
              '../components/CurrencyClassifier.vue'
              ),
          meta: {requiresAuth: true},
        },
        {
          path: '/itemsexpenditure',
          name: 'ItemsExpenditure',
          component: () => import(
            /* webpackChunkName: "items-of-expenses" */
            '../components/ExpensesItems/ListForm'),
          meta: {requiresAuth: true},
        },
        {
          path: '/itemsincome',
          name: 'ItemsIncome',
          component: () => import(
            /* webpackChunkName: "items-of-incomes" */
            '../components/IncomeItems/ListForm'),
          meta: {requiresAuth: true},
        },
        {
          path: '/expends',
          name: 'DocExpends',
          // component: DocExpends,
          component: () =>
            import(/* webpackChunkName: "expenses-list"*/ '../components/Expenses/ExpensesList.vue'),
          meta: {requiresAuth: true},
        },
        {
          path: '/incomes',
          name: 'DocIncomes',
          // component: DocIncomes,
          component: () =>
            import(/* webpackChunkName: "incomes-list"*/ '../components/DocIncomes.vue'),
          meta: {requiresAuth: true},
        },
        {
          path: '/transfers',
          name: 'TransfersList',
          component: () => import(
            /* webpackChunkName: "transfers-list" */
            '../components/TransfersList'),
          meta: {requiresAuth: true},
        },
        {
          path: '/transfers/:docId',
          name: 'Transfer',
          component: () => import(
            /* webpackChunkName: "transfers-edit" */
            '../components/Transfer'),
          props: true,
          meta: {requiresAuth: true},
        },

        {
          path: '/expend/:docId',
          name: 'Expense',
          // component: ExpendElement,
          component: () =>
            import(/* webpackChunkName: "expense-edit"*/ '../components/Expenses/ExpenseEdit.vue'),

          props: true,
          meta: {requiresAuth: true},
        },

        {
          path: '/income/:docId',
          name: 'Income',
          // component: Income,
          component: () =>
            import(/* webpackChunkName: "income-edit" */
              '../components/Income.vue'),
          props: true,
          meta: {requiresAuth: true},
        },
        {
          path: '/settings',
          name: 'Settings',
          component: () => import(
            /* webpackChunkName: "settings" */
            '../components/Settings'),
          props: true,
          meta: {requiresAuth: true},
        },
        {
          path: '/loadrates',
          name: 'LoadRates',
          component: () =>
            import(
              /* webpackChunkName: "loadrates" */
              /* webpackPrefetch: true*/
              '../components/LoadRates.vue'),
          props: true,
          meta: {requiresAuth: false},
        },
        {
          path: '/contacts',
          name: 'Contacts',
          component: () => import(
            /* webpackChunkName: "contacts" */
            '../components/Contacts/ListForm'
            ),
          meta: {requiresAuth: true},
        },
        {
          path: '/budget',
          name: 'Budget',
          component: () => import(
            /* webpackChunkName: "budget" */
            '../components/Budget/Budget'
            ),
          meta: {requiresAuth: true},
        },
      ]
    }
    ],
});
