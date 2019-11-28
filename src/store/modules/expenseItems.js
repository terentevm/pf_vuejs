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
        items.forEach(item=>{
            if (item.children.length === 0) {
                collection.push(item);
            }
            else {
                collection.push(item);
                perform(item.children)
            }
        }) ;

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
