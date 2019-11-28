import 'babel-polyfill';
import Vue from 'vue';
import App from './App';

import router from './router';
import store from './store';

// Import Vuetify components ++
import Vuetify from 'vuetify/lib/components/Vuetify';

import VAvatar from 'vuetify/lib/components/VAvatar';
import VBtn from 'vuetify/lib/components/VBtn';
import VCard from 'vuetify/lib/components/VCard';
import VCardActions from 'vuetify/lib/components/VCard';
import VCardText from 'vuetify/lib/components/VCard';
import VCardTitle from 'vuetify/lib/components/VCard';
import VCheckbox from 'vuetify/lib/components/VCheckbox';
import VContainer from 'vuetify/lib/components/VGrid';
import VDialog from 'vuetify/lib/components/VDialog';
import VDivider from 'vuetify/lib/components/VDivider';
import VFlex from 'vuetify/lib/components/VGrid';
import VIcon from 'vuetify/lib/components/VIcon';
import VItem from 'vuetify/lib/components/VItemGroup';
import VItemGroup from 'vuetify/lib/components/VItemGroup';
import VLabel from 'vuetify/lib/components/VLabel';
import VLayout from 'vuetify/lib/components/VGrid';
import VList from 'vuetify/lib/components/VList';
import VListGroup from 'vuetify/lib/components/VList';
import VListTile from 'vuetify/lib/components/VList';
import VListTileAction from 'vuetify/lib/components/VList';
import VListTileActionText from 'vuetify/lib/components/VList';
import VListTileAvatar from 'vuetify/lib/components/VList';
import VListTileContent from 'vuetify/lib/components/VList';
import VListTileSubTitle from 'vuetify/lib/components/VList';
import VListTileTitle from 'vuetify/lib/components/VList';
import VMessages from 'vuetify/lib/components/VMessages';
import VProgressLinear from 'vuetify/lib/components/VProgressLinear'; //Global
import VSnackbar from 'vuetify/lib/components/VSnackbar';
import VSpacer from 'vuetify/lib/components/VGrid';
import VSubheader from 'vuetify/lib/components/VSubheader';
import VToolbar from 'vuetify/lib/components/VToolbar';
import VToolbarItems from 'vuetify/lib/components/VToolbar';
import VToolbarSideIcon from 'vuetify/lib/components/VToolbar';
import VToolbarTitle from 'vuetify/lib/components/VToolbar';

// Import Vuetify components --

//Import own components ++
import TM_WalletsSelectForm from './components/SelectsForms/WalletsSelectForm.vue';
import TMSelect from './components/TMComponents/TMSelect/TMSelect';
//Import own components --

import {
    install as VeeValidate,
    Validator
} from 'vee-validate/dist/vee-validate.minimal.esm.js';
import { email, max, min, required } from 'vee-validate/dist/rules.esm.js';
import veeEn from 'vee-validate/dist/locale/en';

//Import styles ++
import 'bootstrap/dist/css/bootstrap.min.css';
import 'vuetify/src/stylus/app.styl';
import '../src/assets/css/sprite.css';
import './style/pf.css';
//Import styles --

import globalFunctions from './mixins/GlobalFunctions';

Validator.extend('required', required);
Validator.extend('min', min);
Validator.extend('max', max);
Validator.extend('email', email);

// Merge the messages.
Validator.localize('en', veeEn);

// const mainColor = '#43425D';
const mainColor = '#435d7d';

Vue.use(VeeValidate);

Vue.use(Vuetify, {
    theme: {
        appColor: mainColor
    },
    components: {
        VAvatar,
        VContainer,
        VFlex,
        VLayout,
        VBtn,
        VCard,
        VCardTitle,
        VCardText,
        VCardActions,
        VCheckbox,
        VDialog,
        VDivider,
        VIcon,
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
        VMessages,
        VProgressLinear,
        VSnackbar,
        VSpacer,
        VSubheader,
        VToolbar,
        VToolbarSideIcon,
        VToolbarTitle,
        VToolbarItems
    }
});

Vue.component('tm-wallets-select-form', TM_WalletsSelectForm);
Vue.component('tm-select', TMSelect);

Vue.config.productionTip = false;

Vue.mixin(globalFunctions);

/* eslint-disable no-new */

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!sessionStorage.getItem('jwt')) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
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
    components: { App },
    data: {
        visible: true,
        showMenu: true
    },
    template: '<App/>'
});
