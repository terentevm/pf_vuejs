import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';

import Vuetify, {
    VAlert,
    VApp,
    VAutocomplete,
    VAvatar,
    VBottomSheet,
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VCheckbox,
    VChip,
    VContainer,
    VContent,
    VDatePicker,
    VDialog,
    VDivider,
    VFlex,
    VForm,
    VHover,
    VIcon,
    VInput,
    VItem,
    VItemGroup,
    VLabel,
    VLayout,
    VList,
    VListGroup,
    VListTile,
    VListTileAction,
    VListTileActionText,
    VListTileAvatar,
    VListTileContent,
    VListTileSubTitle,
    VListTileTitle,
    VMenu,
    VMessages,
    VNavigationDrawer,
    VProgressCircular,
    VProgressLinear,
    VSelect,
    VSnackbar,
    VSpacer,
    VSubheader,
    VSystemBar,
    VTextarea,
    VTextField,
    VToolbar,
    VToolbarItems,
    VToolbarSideIcon,
    VToolbarTitle,
} from 'vuetify/lib';

import {install as VeeValidate, Validator} from 'vee-validate/dist/vee-validate.minimal.esm.js';
import {email, max, min, required} from 'vee-validate/dist/rules.esm.js';
import veeEn from 'vee-validate/dist/locale/en';
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

import 'vuetify/src/stylus/app.styl'
import "../src/assets/css/sprite.css";
import './style/pf.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import globalFunctions from './mixins/GlobalFunctions';

Validator.extend('required', required);
Validator.extend('min', min);
Validator.extend('max', max);
Validator.extend('email', email);

// Merge the messages.
Validator.localize('en', veeEn);

// const mainColor = '#43425D';
const mainColor = '#435d7d'

Vue.use(VeeValidate);

Vue.use(Vuetify, {
    theme: {
        appColor: mainColor,
    },
    components: {
        VApp, // required
        VAvatar,
        VContainer,
        VFlex,
        VLayout,
        VContent,
        VAlert,
        VAutocomplete,
        VBtn,
        VBottomSheet,
        VCard,
        VCardTitle,
        VCardText,
        VCardActions,
        VCheckbox,
        VChip,
        VDatePicker,
        VDialog,
        VDivider,
        VForm,
        VHover,
        VIcon,
        VInput,
        VItem,
        VItemGroup,
        VLabel,
        VList,
        VListTile,
        VListTileAction,
        VListTileActionText,
        VListTileAvatar,
        VListGroup,
        VListTileContent,
        VListTileSubTitle,
        VListTileTitle,
        VMenu,
        VMessages,
        VNavigationDrawer,
        VProgressCircular,
        VProgressLinear,
        VSelect,
        VSnackbar,
        VSpacer,
        VSubheader,
        VSystemBar,
        VTextarea,
        VTextField,
        VToolbar,
        VToolbarSideIcon,
        VToolbarTitle,
        VToolbarItems,

    }
});


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


Vue.mixin(globalFunctions);

/* eslint-disable no-new */

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!sessionStorage.getItem('jwt')) {
            next({
                path: '/login',
                query: {redirect: to.fullPath},
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

new Vue({
    el: '#app',
    router: router,
    store,

    data: {
        visible: true,
        message: 'Hello Vue!',
        showMenu: true,
    },

    template: '<App/>',

    components: {App}
});
