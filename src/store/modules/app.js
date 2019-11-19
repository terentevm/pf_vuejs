const state = {
    toolbarMenu: [],
    withRates: [],
    classificator: [],

    showMsg: false,
    msgType: 'warning',
    appMessages: [] //contains error strings

};

// getters
const getters = {
    toolbarMenu: state => state.toolbarMenu,
    showMsg: state => state.showMsg,
    msgType: state => state.msgType,
    appMessages: state => state.appMessages
};

// actions
const actions = {

    showAppMsg({ commit }, message) {
        commit('setMessage', message)
    },

    destroyAppMsg({ commit }) {
        commit('unsetAppMsg') ;
    }

};

// mutations
const mutations = {
    setupToolbarMenu(state, menu) {
        state.toolbarMenu = menu;
    },

    setMessage(state, message) {
        state.showMsg = true;
        state.msgType = message.type || 'warning';
        state.appMessages = message.messages;

        setTimeout(state =>{
            state.showMsg = false;
            state.msgType = 'warning';
            state.appMessages = [];
        }, 5500, state);
    },

    unsetAppMsg(state) {
        state.showMsg = false;
        state.msgType = 'warning';
        state.appMessages = [];


    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};
