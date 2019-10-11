<template>
    <v-app id="inspire" class="appColor">
        <v-navigation-drawer
                fixed
                clipped
                app
                v-model="drawer"
                class="appColor"
                v-if="this.$store.state.auth"
        >
            <v-list dense class="appColor" dark>
                <template v-for="item in items">
                    <v-layout row v-if="item.heading" align-center :key="item.heading"
                              class="side-menu">
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-center">
                            <a href="#!" class="body-2 black--text">EDIT</a>
                        </v-flex>
                    </v-layout>

                    <v-list-group
                            v-else-if="item.children"
                            v-model="item.model"
                            :key="item.text"
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
                        <v-list-tile v-for="(child, i) in item.children" :key="i" :to="child.link">
                            <v-list-tile-avatar tile size="32">
                                <img :src="child.avatar" height="24px" width="24px"/>
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title class="side-menu">
                                    {{ child.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-group>

                    <v-list-tile v-else @click="" avatar dark :key="item.text" :to="item.link">
                        <v-list-tile-avatar tile>
                            <img :src="item.avatar" height="32px" width="32px"/>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title class="side-menu">
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar
                color="appColor"
                dark
                app
                :clipped-left="this.$vuetify.breakpoint.lgAndUp"
                fixed
                height="50"
                v-show="$store.state.auth"
        >
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title fixed style="width: 300px" class="ml-0 pl-3">

                <span>{{ title }}</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <!--SM AND UP  FOR BIG SCREENS-->
            <template v-if="$vuetify.breakpoint.smAndUp">

                <v-btn
                        v-if="this.showMainAction"
                        flat
                        @click="toolbarMenu.mainAction.action"
                >
                    <v-icon left>{{toolbarMenu.mainAction.icon}}</v-icon>
                    {{toolbarMenu.mainAction.title }}
                </v-btn>

                <template v-for="act in this.$store.state.app.toolbarMenu.menu">
                    <v-btn flat
                           @click="act.action"
                    >
                        <v-icon left>{{act.icon}}</v-icon>
                        {{act.title}}
                    </v-btn>
                </template>

            </template>
            <!--SM AND UP  FOR BIG SCREENS-->

            <!--SX ONLY  FOR SMALL SCREENS-->
            <template v-if="$vuetify.breakpoint.xsOnly">

                <v-btn
                        v-if="this.showMainAction === true"
                        icon
                        @click="toolbarMenu.mainAction.action"
                >
                    <v-icon>{{toolbarMenu.mainAction.icon}}</v-icon>
                </v-btn>

                <v-bottom-sheet v-model="sheet" v-if="this.showActionsMenu == true">
                    <template v-slot:activator>
                        <v-btn icon>
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <template v-for="act in toolbarMenu.menu">
                            <v-layout row>
                                <v-flex xs12>
                                    <v-btn outline color="grey" block @click="callAction(act)">
                                        <v-icon left>{{act.icon}}</v-icon>
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


    </v-app>
</template>

<script>
    import imgReport from '@/assets/report.png';
    import imgWallet from '@/assets/wallet.png';
    import imgCurrencies from '@/assets/currencies.svg';
    import imgExpensesItems from '@/assets/shopping-bags.svg';
    import imgIncomes from '@/assets/graph_income.svg';
    import imgExpenses from '@/assets/graph_expenses.svg';
    import imgTransfers from '@/assets/exchange.svg';
    import imgSettings from '@/assets/settings.svg';
    import imgLogout from '@/assets/logout.svg';

    export default {
        data: () => ({
            dialog: false,
            drawer: true,
            showMenu: false,
            showActionMenu: false,
            sheet: false,
            tiles: [
                {img: 'keep.png', title: 'Keep'},
                {img: 'inbox.png', title: 'Inbox'},
                {img: 'hangouts.png', title: 'Hangouts'},
                {img: 'messenger.png', title: 'Messenger'},
                {img: 'google.png', title: 'Google+'}
            ],
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
                            text: 'Expenditure items',
                            link: '/itemsexpenditure',
                            avatar: imgExpensesItems,
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
                {icon: 'exit_to_app', text: 'Log out', link: '/login', avatar: imgLogout},
            ],
        }),
        mounted: function () {
            this.$store.state.auth = sessionStorage.getItem('jwt') === null ? false : true;
        },
        computed: {
            title() {
                return this.$store.state.title == undefined ? 'Personal finances' : this.$store.state.title;
            },
            toolbarMenu() {
                return this.$store.state.app.toolbarMenu;
            },
            showMainAction() {
                return this.$store.state.app.toolbarMenu.mainAction && this.$store.state.app.toolbarMenu.mainAction.action
                    ? true
                    : false
            },
            showActionsMenu() {
                return this.$store.state.app.toolbarMenu.menu
                && this.$store.state.app.toolbarMenu.menu instanceof Array
                && this.$store.state.app.toolbarMenu.menu.length > 0
                    ? true
                    : false
            },
        },
        props: {
            source: String,
        },
        methods: {
            callAction(actionProps) {
                this.sheet = false;
                actionProps.action()
            },
            logout() {
                console.log('Log out...');
            },
        },
    };
</script>