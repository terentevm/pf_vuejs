import ApiClass from '../../api/api_laravel';

const api = new ApiClass();

const state = {
  itemsList: [],
  itemsHierarchically: [],
};

// getters
const getters = {
  allExpenseItems: state => state.itemsList,
  allExpenseItemsHierarchically: state => state.itemsHierarchically,
};

// actions
const actions = {
  getAllExpenseItems({commit}) {
    const conditions = {
      list: true,
    };

    api.index('itemsexpense', conditions)
      .then(items => {
        commit('setExpenseItems', items);
      })
      .catch(() => {
        commit('setExpenseItems', []);
      });
  },

  getAllExpenseItemsHierarchically({commit}) {
    api.index('itemsexpense', {withnested: true})
      .then(items => {
        commit('setExpenseItemsH', items);
        commit('setExpenseItems', performToFlatCollection(items))
      })
      .catch(() => {
        commit('setExpenseItemsH', []);
      });
  },

  async storeExpenseItem({commit}, item) {
    try {
      if (item.id === null) {
        await api.store('itemsexpense', item);
      }
      else {
        console.log('updating...');
        await api.update('itemsexpense', item.id, item);
      }

    }
    catch (e) {
      throw e;
    }
  },

  async searchItemsOfExpenses({commit}, searchStr) {
    const conditions = {
      list: true,
      name: searchStr.trim()
    };

    let items = [];
    try {
        items = api.index('itemsexpense', conditions);
    }
    catch (e) {
      console.error(e);

    }

    return items;
  },

  async deleteExpenseItem({commit}, item) {
    let result = true;
    try {
      await api.delete('itemsexpense', item.id);
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
  setExpenseItems(state, items) {
    state.itemsList = items;
  },
  setExpenseItemsH(state, items) {
    state.itemsHierarchically = items;
  },
};

function performToFlatCollection(items) {
  let collection = [];

  let perform = function (items) {
    items.forEach(item => {
      if (item.children.length === 0) {
        collection.push(item);
      }
      else {
        collection.push(item);
        perform(item.children)
      }
    });

  };

  perform(items);

  return collection;
}

export default {
  state,
  getters,
  actions,
  mutations,
};
