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
