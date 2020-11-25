<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :logo="mylogo"
      :background-color="sidebarBackground"
      short-title="Argon"
      title="Personal finances"
      :main-action="mainAction"
      :menu-top="menuTop"
    >
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'far fa-chart-bar text-secondary',
            path: '/'
          }"
        />
        <hr class="my-2">
        <sidebar-item
          v-for="item in settings.sideNav.references"
          :key="item.key"
          :link="item"
        />
        <hr class="my-2">
        <sidebar-item
          v-for="item in settings.sideNav.transactions"
          :key="item.key"
          :link="item"
        />
        <hr class="my-2">
        <sidebar-item
          :link="{name: 'Settings', icon: 'fas fa-cogs text-secondary', path: '/settings'}"
        />
        <hr class="my-2">
        <sidebar-item
          :link="{name: 'Logout', icon: 'fas fa-sign-out-alt text-secondary', path: '/login'}"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <route-layout
            :main-action="mainAction"
            :menu-top="menuTop"
            :filter="filterBtn"
          />
        </fade-transition>
      </div>
    </div>
  </div>
</template>
<script>
  import RouteLayout from './RouteLayout'
  import { FadeTransition } from 'vue2-transitions';
  import mylogo from '../assets/images/logo_rectangle.png';
  import settings from '../app-settings';

    export default {
      components: {
        RouteLayout,
        FadeTransition
      },
      data() {
        return {
          mylogo: mylogo,
          sidebarBackground: 'vue',
          settings: settings
        };
      },

      computed: {
        mainAction:{
          get(){
            return this.$store.state.app.toolbarMenu.mainAction;
          }
        },
        menuTop:{
          get(){
            return this.$store.state.app.toolbarMenu.menu;
          }
        },
        filterBtn: {
          get() {
            return this.$store.state.app.toolbarMenu.filter;
          }
        }
      },
      methods: {
        toggleSidebar() {
          if (this.$sidebar.showSidebar) {
            this.$sidebar.displaySidebar(false);
          }
        }
      }
    }
</script>