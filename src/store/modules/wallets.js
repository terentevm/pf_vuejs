import ApiClass from '../../api/api_laravel';

const api = new ApiClass();

const state = {
  all: [],
  allList: [],
  balanceAll: [],
  balanceTotal: 0,
  loading: false,
};

// getters
const getters = {
  allWallets: state => state.all,
  allWalletsList: state => state.allList,
  loading: state => state.loading,
};

// actions
const actions = {
  getAllWallets({commit}) {
    api.index('wallets')
      .then(wallets => {

        wallets.forEach(wallet => {
          wallet.active = true;
        });
        commit('setWallets', wallets);
      })
      .catch(() => {
        commit('setWallets', []);
      });
  },

  getAllWalletsList({commit}) {
    api.index('wallets')
      .then(wallets => {

        wallets.forEach(wallet => {
          wallet.currencyName = wallet.currency.name;
          wallet.active = true;
        });

        commit('setWalletsList', wallets);
      })
      .catch(error => {
        console.log(error);
        commit('setWalletsList', []);
      });
  },

  async storeWallet({commit}, wallet) {
    try {
      const res = !wallet.id
        ? await api.store('wallets', wallet)
        : await api.update('wallets', wallet.id, wallet)

      return true;
    }
    catch (error) {
      console.error(error);
      throw error;
    }

  },

  async deleteWallet({commit}, item) {
    let result = true;
    try {
      await api.delete('wallets', item.id);
    }
    catch (e) {
      console.error(e);
      result = false;
    }

    return result;

  }
};

// mutations
const mutations = {

  setWallets(state, wallets) {
    state.all = wallets;
  },

  setWalletsList(state, wallets) {
    state.allList = wallets;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
