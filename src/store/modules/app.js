const state = {
  pending: false,
  toolbarMenu: [],
  withRates: [],
  classificator: [],

  showMsg: false,
  msgType: 'warning',
  appMessages: [], //contains error strings
  drawer: true,
  filterIsActive: false
};

// getters
const getters = {
  pending: state => state.pending,
  toolbarMenu: state => state.toolbarMenu,
  showMsg: state => state.showMsg,
  msgType: state => state.msgType,
  appMessages: state => state.appMessages,
  drawer: state => state.drawer,
  filterIsActive: state => state.filterIsActive
};

// actions
const actions = {

  startPending({commit}) {
    commit('togglePending', true)
  },

  finishPending({commit}) {
    commit('togglePending', false)
  },

  showAppMsg({commit}, message) {
    commit('setMessage', message)
  },

  destroyAppMsg({commit}) {
    commit('unsetAppMsg');
  },

  toggleFilterActivity({commit}, isActive) {
    commit('toggleFilterActivity', isActive);
  }
};

// mutations
const mutations = {

  togglePending(state, pending) {
    state.pending = pending;
  },

  toggleDrawer(state, val) {
    state.drawer = val;
  },

  setupToolbarMenu(state, menu) {
    state.toolbarMenu = menu;
  },

  setMessage(state, message) {
    state.showMsg = true;
    state.msgType = message.type || 'warning';
    state.appMessages = message.messages;

    setTimeout(state => {
      state.showMsg = false;
      state.msgType = 'warning';
      state.appMessages = [];
    }, 5500, state);
  },

  unsetAppMsg(state) {
    state.showMsg = false;
    state.msgType = 'warning';
    state.appMessages = [];
  },

  toggleFilterActivity(state, isActive) {
    state.filterIsActive = isActive;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
