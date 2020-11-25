import Vue from 'vue';

import SidebarPlugin from 'vue-argon-dashboard/src/components/SidebarPlugin/index';

export default {
  install(Vue) {

    Vue.use(SidebarPlugin);

  }
};