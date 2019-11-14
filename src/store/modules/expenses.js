import ApiClass from '../../api/api_laravel';

const api = new ApiClass();
import moment from 'moment'

const state = {
    expenseObj: {
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
};

const getters = {
    expenseObj: state => state.expenseObj,
};


////////////////////////////////////////////////////////////////////////
const actions = {
    getExpense: function ({commit}, id) {
        state.closeForm = false;
        state.showMessage = false;

        if (id === 'new' || id === null || id === undefined) {
            commit('prepareNewDocument');
            return;
        }

        api.show('expenses', id).then(expense => {

            commit('setDocumentData', expense);


        });
    },

    saveExpense({commit}) {

        const formData = {};

        formData.id = state.expenseObj.id == null ? null : state.expenseObj.id;
        formData.date = state.expenseObj.date;
        formData.wallet_id = state.expenseObj.wallet.id;
        formData.comment = '';

        formData.rows = [];

        let total = 0;

        for (let row of state.expenseObj.rows) {
            formData.rows.push({
                item_id: row.item.id,
                sum: row.sum,
                comment: row.comment,
            });

            total += Number(row.sum);
        }

        formData.sum = total;

        return state.expenseObj.id == null
            ? api.store('expenses', formData)
            : api.update('expenses', state.expenseObj.id, formData);

    },

    async deleteExpense({commti}, expense) {

        try {
            const res = api.delete('expenses', expense.id);
        }
        catch (e) {
            throw e;
        }

    }
};

const mutations = {

    prepareNewDocument(state) {
        state.expenseObj.id = null;
        state.expenseObj.date = moment().format('YYYY-MM-DD');
        state.expenseObj.wallet = this.state.settings.wallet;


        if (this.state.settings.wallet instanceof Object
            && this.state.settings.wallet.hasOwnProperty('currency')) {
            state.expenseObj.currency = this.state.settings.wallet.currency;
        }

        state.expenseObj.sum = 0;
        state.expenseObj.rows = [];


    },

    setDocumentData(state, expense) {

        state.expenseObj.id = expense.id;

        state.expenseObj.date = moment(expense.date).format('YYYY-MM-DD');
        state.expenseObj.wallet = expense.wallet;
        state.expenseObj.currency = expense.currency;
        //fill rows
        state.expenseObj.rows = [];

        let rowId = 0;

        for (let row of expense.rows) {
            state.expenseObj.rows.push({
                rowId: rowId,
                selected: false,
                item: row.item,
                sum: row.sum,
                comment: row.comment,
            });

            rowId++;
        }
    },

    expenseUpdateDate(state, newDate) {
        state.expenseObj.date = newDate;
    },

    expenseUpdateWallet(state, wallet) {
        state.expenseObj.wallet = wallet;
        state.expenseObj.currency = wallet.currency;
    },

    expenseEditRow(state, row) {
        if (row.index === null) {
            state.expenseObj.rows.push({
                rowId: row.rowId,
                selected: false,
                item: row.item,
                sum: row.sum,
                comment: row.comment,
            });
        } else {
            const obj = state.expenseObj.rows[row.index];
            obj.item = row.item;
            obj.sum = row.sum;
            obj.comment = row.comment;
        }
    },

    deleteSelected(state, selectedRows) {
        for (let row of selectedRows) {
            this.commit('expenseDeleteRow', row);
        }
    },

    expenseDeleteRow(state, row) {
        const index = state.expenseObj.rows.indexOf(row);
        delete state.expenseObj.rows.splice(index, 1);
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
