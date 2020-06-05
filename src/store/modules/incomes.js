import ApiClass from '../../api/api_laravel';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

const api = new ApiClass();

const state = {
    incomesList: [],
    incomeObj: {
        id: null,
        date: '',
        wallet: null,
        currency: {
            name: 'default',
            short_name: '',
            code: ''
        },
        rows: [],
    },

    showMessage: false,
    typeMessage: 'success',
    closeForm: false,
    page: 1
};

const getters = {
    incomesList: state => state.incomesList,
    incomeObj: state => state.incomeObj,
    page: state => state.page
};

////////////////////////////////////////////////////////////////////////
const actions = {
    nextPage({ commit }) {
        commit('pageIncrement');
        this.dispatch('getIncomesList');
    },

    async getIncomesList({ commit, state }) {
        try {
            let paginationInfo = await api.index('incomes', { page: state.page });

            paginationInfo.data.forEach(income => {
                income.walletName = income.wallet.name;
            });

            commit('setIncomesList', paginationInfo.data);
        } catch (e) {
            this.dispatch('showAppMsg', {
                type: 'error',
                messages: [`status: ${e.status}`, e.data.error]
            });
        }
    },

    getIncome: function({ commit }, id) {
        state.closeForm = false;
        state.showMessage = false;

        if (id === 'new' || id === null || id === undefined) {
            commit('prepareNewDocument');
            return;
        }

        api.show('incomes', id).then(income => {
            commit('setDocumentData', income);
        });
    },

    saveIncome({ commit }) {
        const formData = {};

        formData.id = state.incomeObj.id == null ? null : state.incomeObj.id;
        formData.date = state.incomeObj.date;
        formData.wallet_id = state.incomeObj.wallet.id;
        formData.comment = '';

        formData.rows = [];

        let total = 0;

        for (let row of state.incomeObj.rows) {
            formData.rows.push({
                item_id: row.item.id,
                sum: row.sum,
                comment: row.comment
            });

            total += Number(row.sum);
        }

        formData.sum = total;

        return state.incomeObj.id == null ? api.store('incomes', formData) : api.update('incomes', state.incomeObj.id, formData);
    },

    async deleteIncome({ commit }, income) {
        try {
            const res = api.delete('incomes', income.id);
        } catch (e) {
            throw e;
        }
    }
};

const mutations = {
    setIncomesList(state, incomes) {
        state.incomesList = incomes;
    },

    prepareNewDocument(state) {
        state.incomeObj.id = null;
        state.incomeObj.date = format(new Date(), 'yyyy-MM-dd');
        state.incomeObj.wallet = this.state.settings.wallet;

        if (this.state.settings.wallet instanceof Object && this.state.settings.wallet.hasOwnProperty('currency')) {
            state.incomeObj.currency = this.state.settings.wallet.currency;
        }

        state.incomeObj.sum = 0;
        state.incomeObj.rows = [];
    },

    setDocumentData(state, income) {
        state.incomeObj.id = income.id;
        state.incomeObj.date = format(parse(income.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd');
        state.incomeObj.wallet = income.wallet;
        state.incomeObj.currency = income.currency;
        //fill rows
        state.incomeObj.rows = [];

        let rowId = 0;

        for (let row of income.rows) {
            state.incomeObj.rows.push({
                rowId: rowId,
                selected: false,
                item: row.item,
                sum: row.sum,
                comment: row.comment
            });

            rowId++;
        }
    },

    incomeUpdateDate(state, newDate) {
        state.incomeObj.date = newDate;
    },

    incomeUpdateWallet(state, wallet) {
        state.incomeObj.wallet = wallet;
        state.incomeObj.currency = wallet.currency;
    },

    incomeEditRow(state, row) {
        if (row.index === null) {
            state.incomeObj.rows.push({
                rowId: row.rowId,
                selected: false,
                item: row.item,
                sum: row.sum,
                comment: row.comment
            });
        } else {
            const obj = state.incomeObj.rows[row.index];
            obj.item = row.item;
            obj.sum = row.sum;
            obj.comment = row.comment;
        }
    },

    deleteSelected(state, selectedRows) {
        for (let row of selectedRows) {
            this.commit('incomeDeleteRow', row);
        }
    },

    incomeDeleteRow(state, row) {
        const index = state.incomeObj.rows.indexOf(row);
        delete state.incomeObj.rows.splice(index, 1);
    },

    pageIncrement(state) {
        state.page++;
    },

    setPageForIncomes(state, page) {
        state.page = page;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
