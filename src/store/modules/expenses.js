import ApiClass from '../../components/Api';
import moment from 'moment';

const Api = new ApiClass();

const state = {
  expenseObj: {
    id: null,
    date: '',
    wallet_id: null,
    currencyCharCode: '-',
    rows: [],
  },

  processing: false,
  showMessage: false,
  typeMessage: 'success',
  closeForm: false,
};

const getters = {
  expenseObj: state => state.expenseObj,
};

/////////////////////////////////////////////////////////////////////////

function fillNewExpense(state) {
  this.dispatch('getSettings');

  state.expenseObj.id = null;

  let day = moment();

  state.expenseObj.date = day.format('YYYY-MM-DD');

  const defaultWallet = this.state.settings.wallet;

  if (defaultWallet) {
    state.expenseObj.wallet_id = defaultWallet.id;
    console.log(defaultWallet);
    //state.expenseObj.currencyCharCode = defaultWallet.Currency.short_name;
  }

  state.expenseObj.rows = [];
}

////////////////////////////////////////////////////////////////////////
const actions = {
  getExpense: function({ state }, id) {
    state.closeForm = false;
    state.showMessage = false;

    if (id === 'new' || id === null || id === undefined) {
      const fillNew = fillNewExpense.bind(this);
      fillNew(state);
      return;
    }

    Api.show({
      model: 'expenditure',
      conditions: { id: id },
    }).then(data => {
      state.expenseObj.id = id;

      let day = moment(data.date);
      state.expenseObj.date = day.format('YYYY-MM-DD');
      state.expenseObj.wallet_id = data.wallet_id;

      //fill rows
      state.expenseObj.rows = [];

      let rowId = 0;

      for (let row of data.rows.storage) {
        state.expenseObj.rows.push({
          rowId: rowId,
          selected: false,
          item: row.ItemExpenditure,
          sum: row.sum,
          comment: row.comment,
        });

        rowId++;
      }
    });
  },
};

const mutations = {
  expenseUpdateDate(state, newDate) {
    state.expenseObj.date = newDate;
  },

  expenseUpdateWallet(state, wallet) {
    state.expenseObj.wallet_id = wallet.id;
    state.expenseObj.currencyCharCode = wallet.Currency.short_name;
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

  saveExpense(state) {
    let rows = [];

    for (let row of state.expenseObj.rows) {
      rows.push({
        item_id: row.item.id,
        sum: row.sum,
        comment: row.comment,
      });
    }

    let postData = {
      id: state.expenseObj.id,
      date: state.expenseObj.date,
      wallet_id: state.expenseObj.wallet_id,
      rows: rows,
    };

    const params = {
      isUpdate: state.expenseObj.id !== null,
      model: 'expenditure',
      data: postData,
    };
    state.processing = true;

    const successFunc = function(success) {
      if (success === true) {
        state.closeForm = true;
      } else {
        // this.sending = false;
      }
    };

    const afterSave = function() {
      state.processing = false;
    };

    Api.save(params)
      .then(successFunc)
      .finally(afterSave);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
