import ApiClass from '../../components/Api';
const Api = new ApiClass();

const state = {
  currency: null,
  wallet: null,
  currencyReports: null,
  newUser: false,
  hasCurrencies: true,

  showMessage: false,
  messageType: 'success',
  message: '',
};

const getters = {
  currency: state => state.currency,
  wallet: state => state.wallet,
  currencyReports: state => state.currencyReports,
  showMessgae: state => state.hasError,
  message: state => state.message,
  messageType: state => state.messageType,
};

const actions = {
  getSettings({ commit }) {
    this.commit('unsetMessage');
    const cachedSettings_JSON = sessionStorage.getItem('settings');

    if (cachedSettings_JSON) {
      commit('setSettings', JSON.parse(cachedSettings_JSON));
      return;
    }

    Api.get({
      model: 'user',
      action: 'settings',
    }).then(settings => {
      console.log(settings);
    });
  },
};

const mutations = {
  saveSettings(store, settings) {
    this.commit('unsetMessage');
    this.commit('setCurrency', settings.currency);
    this.commit('setWallet', settings.wallet);
    this.commit('setCurrencyReports', settings.currencyReports);
    this.commit('storeAtServer');
  },

  storeAtLocal(store) {
    sessionStorage.setItem('settings', JSON.stringify(store));
  },

  storeAtServer(store) {
    const postData = {
      currency_id: store.currency === null ? null : store.currency.id,
      wallet_id: store.wallet === null ? null : store.wallet.id,
      reportCurrency: store.currencyReports === null ? null : store.currencyReports.id,
    };

    Api.post({
      model: 'user',
      action: 'settings',
      data: postData,
    }).then(result => {
      if (result.success === true) {
        this.commit('storeAtLocal');
        this.commit('setSuccessMessage', 'Settings have been saved successfully!');
      } else {
        //in error case - restore current settings and show error message

        const msg =
          "Error. Settings haven't been saved at the server! Current values have been restored";

        this.commit('setErrorMessage', msg);
        this.dispatch('getSettings');
      }
      console.dir(res);
    });
  },

  setSettings(store, settings) {
    this.commit('setCurrency', settings.currency);
    this.commit('setWallet', settings.wallet);
    this.commit('setCurrencyReports', settings.currencyReports);

    //this settings setup only after getting data from server
    store.newUser = settings.newUser;
    store.hasCurrencies = settings.hasCurrencies;
  },

  setCurrency(store, currency) {
    store.currency = currency;
  },

  setWallet(store, wallet) {
    store.wallet = wallet;
  },

  setCurrencyReports(store, currency) {
    store.currencyReports = currency;
  },

  setErrorMessage(store, msg) {
    store.messageType = 'error';
    store.message = msg;
    store.showMessage = true;
  },

  setSuccessMessage(store, msg) {
    store.messageType = 'success';
    store.message = msg;
    store.showMessage = true;
  },

  unsetMessage(store) {
    store.showMessage = false;
    store.message = '';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
