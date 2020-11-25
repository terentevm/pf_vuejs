<template>
  <base-nav
    class="navbar-top navbar-dark fixed-top"
    id="navbar-main"
    :show-toggle-button="false"
    :type="'default'"
    expand
  />
</template>
<script>
  import BaseNav from '../argon/src/components/BaseNav';
  import BaseInput from '../argon/src/components/BaseInput';
  import BaseDropdown from '../argon/src/components/BaseDropdown';

  export default {
    components: {
      BaseNav,
      BaseInput,
      BaseDropdown,
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchQuery: ''
      };
    },
    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      }
    }
  };
</script>
