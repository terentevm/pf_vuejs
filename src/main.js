import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex';
import router from './router';

import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';

//my custom list
import RoundedList from './components/Reusable/ListOfAmount.vue';
import TMDataTable from './components/Reusable/TMDataTable/TMDataTable';

import BalanceTotal from './components/IndexDashboard/BalanceTotal.vue';
import BalanceCard from './components/IndexDashboard/BalanceCard.vue'
import ExpenseTotal from './components/IndexDashboard/ExpenseTotal.vue';
import IncomeTotal from './components/IndexDashboard/IncomeTotal.vue';
import ExpensesList from './components/IndexDashboard/ExpensesList.vue';
import IncomesList from './components/IndexDashboard/IncomesList.vue';
import BalanceByWallets from './components/IndexDashboard/BalanceByWallets.vue';
import TM_FormActionPanel from './components/tmFormElements/TM_FormActionPanel.vue';
import TM_WalletsSelectForm from './components/SelectsForms/WalletsSelectForm.vue';

import store from './store';

//style imports
import 'vuetify/dist/vuetify.min.css';
import '../src/assets/css/bootstrap-grid.css';
import "../src/assets/css/sprite.css";
import './style/pf.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// const mainColor = '#43425D';
const mainColor = '#435d7d'
const backgroundColor = '#'

Vue.use(Vuetify, {
  theme: {
    appColor: mainColor,
  },
});
Vue.use(VeeValidate);
Vue.component('tm-table', TMDataTable);
Vue.component('tm-list-rounded', RoundedList);
Vue.component('tm-index-balance-card', BalanceCard);
Vue.component('tm-index-balance-total', BalanceTotal);
Vue.component('tm-index-expense-total', ExpenseTotal);
Vue.component('tm-index-income-total', IncomeTotal);
Vue.component('tm-index-expenses-list', ExpensesList);
Vue.component('tm-index-incomes-list', IncomesList);
Vue.component('tm-index-balance-list', BalanceByWallets);
Vue.component('tm-form-action-panel', TM_FormActionPanel);
Vue.component('tm-wallets-select-form', TM_WalletsSelectForm);

Vue.config.productionTip = false;


Vue.mixin({
    methods: {
        copyObject(objDest, objSource) {
            for (let propName in objDest) {
                if (objSource.hasOwnProperty(propName)) {
                    objDest[propName] = objSource[propName];
                }
            }
        },
    }
});
/* eslint-disable no-new */

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!sessionStorage.getItem('jwt')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

var vm = new Vue({
  el: '#app',
  router: router,
  store,
  data: {
    visible: true,
    message: 'Hello Vue!',
    showMenu: true,
  },
  template: '<App/>',
  components: { App },
});
