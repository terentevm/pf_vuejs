<template>
    <nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-default text-white" id="sidenav-main">
        <div class="container-fluid">
            <!--Toggler-->
            <navbar-toggle-button @click.native="showSidebar">

                <i class="fas fa-bars text-white"></i>
            </navbar-toggle-button>
            <router-link class="navbar-brand" to="/">
                <img :src="logo" class="navbar-brand-img" alt="...">
            </router-link>

            <slot name="mobile-right">

                <ul class="nav align-items-center d-md-none bg-default">
                    <base-button
                      v-if="mainAction"
                      class="d-md-none"
                      type="secondary"
                      :icon="mainAction.icon"
                      @click.stop="mainAction.action"
                    >{{ mainAction.title}}</base-button>
                    <base-dropdown v-if="menuTop.length > 0" class="nav-item" position="right">
                        <a slot="title" class="nav-link nav-link-icon" href="#" role="button" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v text-white"></i>
                        </a>

                        <div
                          v-for="act in menuTop"
                          class="dropdown-item"
                          @click="act.action"
                        >
                            {{ act.title }}
                        </div>

                    </base-dropdown>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show bg-default" id="sidenav-collapse-main">

                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav bg-default">
                    <slot name="links">
                    </slot>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
  import NavbarToggleButton from '../../components/NavbarToggleButton';
  import BaseDropdown from '../../components/BaseDropdown';
  import BaseButton from '../../components/BaseButton';
  export default {
    name: 'SideBar',
    components: {
      NavbarToggleButton,
      BaseDropdown,
      BaseButton
    },
    props: {
      logo: {
        type: String,
        default: 'img/brand/green.png',
        description: 'Sidebar app logo'
      },
      autoClose: {
        type: Boolean,
        default: true,
        description: 'Whether sidebar should autoclose on mobile when clicking an item'
      },
      mainAction: {
        type: Object
      },
      menuTop: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    methods: {
      closeSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true)
      }
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    }
  };
</script>
