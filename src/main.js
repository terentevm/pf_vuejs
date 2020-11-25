import 'babel-polyfill';
import Vue from 'vue';
import App from './AppV2';
import Vuesax from 'vuesax';
import router from './router';
import store from './store';
import './assets/opensans/css/opensans.css';

import 'vuesax/dist/vuesax.css'; //Vuesax styles
// Import Vuetify components ++
import vuetify from '@/plugins/vuetify';
import SidebarPlugin from './argon/src/components/SidebarPlugin/index';
import globalDirectives from './argon/src/plugins/globalDirectives';
//Import own components ++
import TM_WalletsSelectForm from './components/SelectsForms/WalletsSelectForm.vue';
import TMSelect from './components/TMComponents/TMSelect/TMSelect';
import TMInput from './components/TMComponents/TMInput/Input';
import {install as VeeValidate, Validator} from 'vee-validate/dist/vee-validate.minimal.esm.js';
import {email, max, min, required} from 'vee-validate/dist/rules.esm.js';
import veeEn from 'vee-validate/dist/locale/en';
//Import styles ++
import './style/index.scss';
import './argon/src/assets/scss/argon.scss';

import '../src/assets/css/sprite.css';
import './style/pf.css';

import './style/application.scss';

import globalFunctions from './mixins/GlobalFunctions';
import VuejsDialog from 'vuejs-dialog';
// include the default style
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import PeriodSelection from './components/PeriodSelection';
import DeleteConfirmation from './components/Dialogs/DeleteConfirmation/Delete';
//Import own components --

//Import styles --

Validator.extend('required', required);
Validator.extend('min', min);
Validator.extend('max', max);
Validator.extend('email', email);

// Merge the messages.
Validator.localize('en', veeEn);

// const mainColor = '#43425D';
const mainColor = '#435d7d';

Vue.use(SidebarPlugin);
Vue.use(globalDirectives);

Vue.use(Vuesax, {
  appColor: mainColor
});

// Tell Vue to install the plugin.
Vue.use(VuejsDialog);

Vue.dialog.registerComponent('period-selection', PeriodSelection);
Vue.dialog.registerComponent('delete-confirmation', DeleteConfirmation);

//Vue.use(SidebarPlugin);
Vue.use(VeeValidate);

Vue.component('tm-wallets-select-form', TM_WalletsSelectForm);
Vue.component('tm-select', TMSelect);
Vue.component('tm-input', TMInput);

Vue.config.productionTip = false;

Vue.mixin(globalFunctions);

/* eslint-disable no-new */

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!sessionStorage.getItem('jwt')) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
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
  vuetify,
  components: {App},
  data: {
    visible: true,
    showMenu: true
  },
  template: '<App/>'
});
