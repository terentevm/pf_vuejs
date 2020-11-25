import ApiClass from '../../api/api_laravel';
import {format} from '../../helpers/date';
import parse from 'date-fns/parse';

const api = new ApiClass();

const state = {
  expensesList: [],
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
  pagination: {
    current_page: 1,
    last_page: 116,
    per_page: 20
  }
};

const getters = {
  expensesList: state => state.expensesList,
  expenseObj: state => state.expenseObj,
  pagination: state => state.pagination
};


////////////////////////////////////////////////////////////////////////
const actions = {

  nextPage({commit}) {
    commit('pageIncrement');
    this.dispatch('getExpensesList');
  },

  async getExpensesList({commit, state}, options) {

    const filter = {};

    if (options.page && typeof options.page === 'number') {
      filter.page = options.page;
    }

    if (options.begin && typeof options.begin === 'string') {
      filter.begin = options.begin;
    }

    if (options.end && typeof options.end === 'string') {
      filter.end = options.end;
    }

    if (options.wallet && typeof options.wallet === 'object' && typeof options.wallet.id === 'string') {
      filter.wallet = options.wallet.id;
    }


    try {
      let paginationInfo = await api.index('expenses', filter);

      paginationInfo.data.forEach(expense => {
        expense.walletName = expense.wallet.name;
      });

      commit('addExpenseToExpensesList', paginationInfo.data);
      commit('setPagination', paginationInfo);

    } catch (e) {
      this.dispatch('showAppMsg', {
        type: 'error',
        messages: [
          `status: ${e.status}`,
          e.data.error
        ]

      });
      console.dir(e.data);
    }


  },

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

  saveExpense() {

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

  async deleteExpense({commit}, expense) {

    try {
      const res = api.delete('expenses', expense.id);
    }
    catch (e) {
      throw e;
    }

  }
};

const mutations = {

  addExpenseToExpensesList(state, expenses) {

    state.expensesList = expenses;

  },

  prepareNewDocument(state) {
    state.expenseObj.id = null;
    state.expenseObj.date = format(new Date());
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

    state.expenseObj.date = format(parse(expense.date, 'yyyy-MM-dd', new Date()));
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
  },

  pageIncrement(state) {
    state.page++;
  },

  setPageForExpenses(state, page) {
    state.page = page;
  },

  setPagination(state, resBody) {

    state.pagination.current_page = resBody.current_page;
    state.pagination.last_page = resBody.last_page;
    state.pagination.per_page = resBody.per_page;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
