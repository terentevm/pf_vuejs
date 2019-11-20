import ApiClass from '../../api/api_laravel';
import moment from 'moment'

const api = new ApiClass();

const state = {
    formData: {
        id: null,
        date: moment().format('YYYY-MM-DD'),
        walletFrom: null,
        walletTo: null,
        sumFrom: 0,
        sumTo: 0
    },

    items: []
};

const getters = {
    formData: state => state.formData,
    items: state => state.items
};

const actions = {

    getTransfers({commit}, page = 1) {
        api.index('transfers', {page: page}).then(paginationInfo => {
            paginationInfo.data.forEach(doc => {
                commit('addTransferToItems', doc);
            })
        })
            .catch(err => {
                console.dir(err);
            });
    },

    getTransfer({commit}, id) {

        if (id === 'new' || id === null || id === undefined) {
            commit('setFormData', {
                id: null,
                date: moment().format('YYYY-MM-DD'),
                walletFrom: null,
                walletTo: null,
                sumFrom: 0,
                sumTo: 0
            });

            return;
        }

        api.show('transfers', id).then(transfer => {
            commit('setFormData', transfer);
        })
    },

    saveTransfer({commit}) {

        const formData = {};

        formData.id = state.formData.id == null ? null : state.formData.id;
        formData.date = state.formData.date;
        formData.wallet_id_from = state.formData.walletFrom.id;
        formData.wallet_id_to = state.formData.walletTo.id;
        formData.sum_from = state.formData.sumFrom;
        formData.sum_to = state.formData.sumTo;
        formData.comment = '';

        return state.formData.id == null
            ? api.store('transfers', formData)
            : api.update('transfers', state.formData.id, formData);
    },

    resetFormData({commit}) {
        commit('setFormData', {
            id: null,
            date: moment().format('YYYY-MM-DD'),
            walletFrom: null,
            walletTo: null,
            sumFrom: 0,
            sumTo: 0
        });
    }

};

const mutations = {

    setFormData(state, formData) {
        state.formData = formData;
    },

    addTransferToItems(state, transfer) {

        if (state.items.find(current => current.id === transfer.id) == undefined) {
            state.items.push(transfer);
        }

    },

    setTransferDate(state, date) {
        state.formData.date = date;
    },

    setWalletFrom(state, wallet) {
        state.formData.walletFrom = wallet;
    },

    setWalletTo(state, wallet) {
        state.formData.walletTo = wallet;
    },

    setSumFrom(state, sum) {
        state.formData.sumFrom = Number(sum);
    },

    setSumTo(state, sum) {
        state.formData.sumTo = Number(sum);
    }

};

export default {
    state,
    getters,
    actions,
    mutations,
};