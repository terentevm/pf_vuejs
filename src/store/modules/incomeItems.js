import ApiClass from '../../api/api_laravel';

const api = new ApiClass();

const state = {
  itemsList: [],
  itemsHierarchically: [],
};

// getters
const getters = {
  allIncomeItems: state => state.itemsList,
  allIncomeItemsHierarchically: state => state.itemsHierarchically,
};

// actions
const actions = {
  getAllIncomeItems({commit}) {
    const conditions = {
      list: true,
    };

    api.index('itemsincome', conditions)
      .then(items => {
        commit('setIncomeItems', items);
      })
      .catch(() => {
        commit('setIncomeItems', []);
      });
  },
  getAllIncomeItemsHierarchically({commit}) {
    api.index('itemsincome', {withnested: true})
      .then(items => {
        commit('setIncomeItemsH', items);
        commit('setIncomeItems', performToFlatCollection(items))
      })
      .catch(() => {
        commit('setIncomeItemsH', []);
      });
  },

  async storeIncomeItem({commit}, item) {
    try {
      if (item.id === null) {
        await api.store('itemsincome', item);
      }
      else {
        console.log('updating...');
        await api.update('itemsincome', item.id, item);
      }

    }
    catch (e) {
      throw e;
    }
  },

  async deleteIncomeItem({commit}, item) {
    let result = true;
    try {
      await api.delete('itemsincome', item.id);
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
  setIncomeItems(state, items) {
    state.itemsList = items;
  },
  setIncomeItemsH(state, items) {
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
