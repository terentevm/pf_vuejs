const state = {
    toolbarMenu: [],
    withRates: [],
    classificator: [],
};

// getters
const getters = {
    toolbarMenu: state => state.toolbarMenu
};

// actions
const actions = {};

// mutations
const mutations = {
    setupToolbarMenu(state, menu) {
        state.toolbarMenu = menu;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
