<template lang="html">
    <v-app v-bind:class="{app_auth: this.$store.state.auth, app_not_auth:!this.$store.state.auth}">
        <side-nav
            v-if="this.$store.state.auth"
            v-show="drawer"
        ></side-nav>
        <v-app-bar
            v-if="this.$store.state.auth"
            color="appColor"
            dark
            app
            :clipped-right="this.$vuetify.breakpoint.lgAndUp"
            fixed
            height="50"
        >
            <vs-button
                icon
                class="appColor"
                @click.stop="drawer = !drawer"
            >
                <i class='bx bx-menu'></i>
            </vs-button>
            <v-toolbar-title
                fixed
                style="width: 300px"
                class="ml-0 pl-3"
            >
                <span>{{ title }}</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <!--SM AND UP  FOR BIG SCREENS-->
            <template v-if="$vuetify.breakpoint.smAndUp">
                <v-btn
                    v-if="showMainAction"
                    flat
                    @click="toolbarMenu.mainAction.action"
                >
                    <v-icon left>
                        {{ toolbarMenu.mainAction.icon }}
                    </v-icon>
                    {{ toolbarMenu.mainAction.title }}
                </v-btn>

                <template v-for="(act,index) in this.$store.state.app.toolbarMenu.menu">
                    <v-btn
                        :key="index"
                        flat
                        @click="act.action"
                    >
                        <v-icon left>
                            {{ act.icon }}
                        </v-icon>
                        {{ act.title }}
                    </v-btn>
                </template>
            </template>
            <!--SM AND UP  FOR BIG SCREENS-->

            <!--SX ONLY  FOR SMALL SCREENS-->
            <template v-if="$vuetify.breakpoint.xsOnly">
                <v-btn
                    v-if="showMainAction === true"
                    icon
                    @click="toolbarMenu.mainAction.action"
                >
                    <v-icon>{{ toolbarMenu.mainAction.icon }}</v-icon>
                </v-btn>

                <v-bottom-sheet
                    v-if="showActionsMenu === true"
                    v-model="sheet"
                >
                    <template v-slot:activator>
                        <v-btn icon>
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <template v-for="(act, index) in toolbarMenu.menu">
                            <v-layout :key="index" row>
                                <v-flex xs12>
                                    <v-btn
                                        outline
                                        color="grey"
                                        block
                                        @click="callAction(act)"
                                    >
                                        <v-icon left>
                                            {{ act.icon }}
                                        </v-icon>
                                        {{ act.title }}
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </template>
                    </v-card>
                </v-bottom-sheet>
            </template>
        </v-app-bar>

        <v-content>
            <div class="container h-100" id="main-container">
                <router-view></router-view>
            </div>
        </v-content>
    </v-app>
</template>

<script>
    import VApp from 'vuetify/lib/components/VApp';
    import VBottomSheet from 'vuetify/lib/components/VBottomSheet';

    import {VAppBar, VAppBarNavIcon} from 'vuetify/lib/components/VAppBar';
    import {VToolbarTitle} from 'vuetify/lib/components/VToolbar';
    import {VContent} from 'vuetify/lib/components/VContent';
    import {VSpacer} from 'vuetify/lib/components/VGrid';

    import SideNav from './components/AsideNav/AsideNav';
    export default {

        components: {
            VApp,
            VBottomSheet,
            VContent,
            VAppBar,
            VAppBarNavIcon,
            VToolbarTitle,
            VSpacer,
            'side-nav': SideNav
        },

        data: () => ({
            dialog: false,
            showMenu: false,
            showActionMenu: false,
            sheet: false,

            isOffline: false,

        }),
        computed: {
          drawer: {
            get() {
              return this.$store.state.app.drawer;
            },
            set(val) {
              this.$store.commit('toggleDrawer', val);
            }
          },
          title() {
                return this.$store.state.title === undefined ? 'Personal finances' : this.$store.state.title;
            },
            toolbarMenu() {
                return this.$store.state.app.toolbarMenu;
            },
            showMainAction() {
                return this.$store.state.app.toolbarMenu.mainAction && this.$store.state.app.toolbarMenu.mainAction.action
                    ? true
                    : false;
            },
            showActionsMenu() {
                return !!(this.$store.state.app.toolbarMenu.menu
                    && this.$store.state.app.toolbarMenu.menu instanceof Array
                    && this.$store.state.app.toolbarMenu.menu.length > 0);
            },

            showMsg: {
                get() {
                    return this.$store.state.app.showMsg;
                },

                set() {
                    this.$store.dispatch('destroyAppMsg');
                }

            },

            msgType() {
                return this.$store.state.app.msgType;
            },

            appMessages() {
                return this.$store.state.app.appMessages;
            }
        },

        mounted: function () {

          this.$store.state.auth = sessionStorage.getItem('jwt') != null ? true : false;
        },
        methods: {
            callAction(actionProps) {
                this.sheet = false;
                actionProps.action()
            }
        },
    };
</script>

<style scoped>
    .app_auth {
        background-color: white;
    }

    .app_not_auth {
        background-image: url("./assets/images/login-bg.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
</style>