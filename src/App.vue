<template lang="html">
    <v-app :class="{appColor: !$store.state.auth}">
        <v-navigation-drawer
            v-if="this.$store.state.auth"
            v-model="drawer"
            fixed
            clipped
            app
            class="appColor"
        >
            <v-list
                dense
                class="appColor"
                dark
            >
                <template v-for="item in items">
                    <v-layout
                        v-if="item.heading"
                        :key="item.heading"
                        row
                        align-center
                        class="side-menu"
                    >
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                        <v-flex
                            xs6
                            class="text-xs-center"
                        >
                            <a
                                href="#!"
                                class="body-2 black--text"
                            >EDIT</a>
                        </v-flex>
                    </v-layout>

                    <v-list-group
                        v-else-if="item.children"
                        :key="item.text"
                        v-model="item.model"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']"
                        append-icon=""
                    >
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title class="side-menu">
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                            v-for="(child, i) in item.children"
                            :key="i"
                            :to="child.link"
                        >
                            <v-list-tile-avatar
                                tile
                                size="32"
                            >
                                <img
                                    :src="child.avatar"
                                    height="24px"
                                    width="24px"
                                >
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title class="side-menu">
                                    {{ child.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-group>

                    <v-list-tile
                        v-else
                        :key="item.text"
                        avatar
                        dark
                        :to="item.link"
                    >
                        <v-list-tile-avatar tile>
                            <img
                                :src="item.avatar"
                                height="32px"
                                width="32px"
                            >
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title class="side-menu">
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
                <v-divider></v-divider>

                <v-list-tile :to="logoutMenu.link">
                    <v-list-tile-avatar tile>
                        <img
                            :src="logoutMenu.avatar"
                            height="32px"
                            width="32px"
                        >
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title class="side-menu">
                            {{ logoutMenu.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>


            <v-footer
                dark
                height="auto"
                color="appColor"
                inset
                fixed
            >
                <v-divider></v-divider>
                <div class="col-12">
                    <span class="white--text">Icons made by</span>
                    <a
                        href="https://www.flaticon.com/authors/freepik"
                        title="Freepik"
                    >
                        <span class="text-info">Freepik</span>
                    </a>
                    <span class="white--text">from</span>
                    <a
                        class="text-info"
                        href="https://www.flaticon.com/"
                        title="Flaticon"
                    >www.flaticon.com</a>
                </div>
            </v-footer>
        </v-navigation-drawer>

        <v-toolbar
            v-if="this.$store.state.auth"
            color="appColor"
            dark
            app
            :clipped-left="this.$vuetify.breakpoint.lgAndUp"
            fixed
            height="50"
        >
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
        </v-toolbar>

        <v-content>
            <v-container id="main-container">
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-snackbar
            v-model="showMsg"
            :color="msgType"
            auto-height
        >
            <ul>
                <li v-for="(msg,index) in appMessages" :key="index">
                    {{ msg }}
                </li>
            </ul>
            <v-btn
                color="white"
                flat
                @click="showMsg = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import VApp from 'vuetify/lib/components/VApp';
    import VBottomSheet from 'vuetify/lib/components/VBottomSheet';
    import VNavigationDrawer from 'vuetify/lib/components/VNavigationDrawer';
    import VFooter from 'vuetify/lib/components/VFooter';
    import {VContent} from 'vuetify/lib/components/VGrid';
    import imgReport from '@/assets/home.svg';
    import imgWallet from '@/assets/wallet.png';
    import imgCurrencies from '@/assets/currencies.svg';
    import imgExpensesItems from '@/assets/shopping-bags.svg';
    import imgIncomes from '@/assets/graph_income.svg';
    import imgExpenses from '@/assets/graph_expenses.svg';
    import imgTransfers from '@/assets/exchange.svg';
    import imgSettings from '@/assets/settings.svg';
    import imgLogout from '@/assets/logout.svg';
    import imgContacts from '@/assets/contacts.svg';

    export default {

        components: {
            VApp,
            VBottomSheet,
            VContent,
            VNavigationDrawer,
            VFooter
        },

        data: () => ({
            dialog: false,
            drawer: true,
            showMenu: false,
            showActionMenu: false,
            sheet: false,

            isOffline: false,
            items: [
                {icon: 'home', text: 'Dashboard', link: '/', avatar: imgReport},
                {
                    icon: 'keyboard_arrow_up',
                    'icon-alt': 'keyboard_arrow_down',
                    text: 'Catalogs',
                    model: true,
                    children: [
                        {
                            icon: 'euro_symbol',
                            text: 'Currencies',
                            link: '/currencies',
                            avatar: imgCurrencies
                        },
                        {
                            icon: 'account_balance_wallet',
                            text: 'Wallets',
                            link: '/wallets',
                            avatar: imgWallet
                        },
                        {
                            icon: 'local_atm',
                            text: 'Income items',
                            link: '/itemsincome',
                            avatar: imgIncomes
                        },
                        {
                            icon: 'shopping_basket',
                            text: 'Expense items',
                            link: '/itemsexpenditure',
                            avatar: imgExpensesItems,
                        },

                        {
                            icon: 'shopping_basket',
                            text: 'Contacts',
                            link: '/contacts',
                            avatar: imgContacts,
                        },
                    ],
                },
                {
                    icon: 'keyboard_arrow_up',
                    'icon-alt': 'keyboard_arrow_down',
                    text: 'Transactions',
                    model: true,
                    children: [
                        {icon: 'remove', text: 'Expenses', link: '/expends', avatar: imgExpenses},
                        {icon: 'add', text: 'Incomes', link: '/incomes', avatar: imgIncomes},
                        {
                            icon: 'compare_arrows',
                            text: 'Transfers',
                            link: '/transfers',
                            avatar: imgTransfers
                        },
                    ],
                },
                {icon: 'settings', text: 'Settings', link: '/settings', avatar: imgSettings},

            ],
            logoutMenu: {icon: 'exit_to_app', text: 'Log out', link: '/login', avatar: imgLogout},
        }),
        computed: {
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
