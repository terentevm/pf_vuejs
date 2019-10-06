<template>
    <v-container mx-0>
        <v-layout row>
            <v-flex xs12 sm12 md12 lg12>
                <div class="table-wrapper">

                    <ul class="list-group list-group-flush">
                        <li
                                class="list-group-item list-header"
                        >
                            <v-layout row ml-3>
                                <v-flex xs10 sm10 md10 lg11 class="cell">
                                    <v-layout row>
                                        <v-flex xs8 sm8md10 lg10 class="cell">
                                            <v-layout row d-flex class="flex-column flex-md-row">
                                                <v-flex xs4>
                                                    <span>Date</span>
                                                </v-flex>
                                                <v-flex xs8>
                                                    <span>Wallets (sum)</span>
                                                </v-flex>

                                            </v-layout>
                                        </v-flex>

                                    </v-layout>
                                </v-flex>

                                <v-flex xs2 sm2 md2 lg1>
                                    <div class="cell-actions justify-content-end">
                                        <span>Act.</span>
                                    </div>

                                </v-flex>

                            </v-layout>


                        </li>
                        <li v-for="item in items"
                            class="list-group-item list-item"
                            @click="editItem(item)"
                        >
                            <v-layout row ml-3>
                                <v-flex xs10 sm10 md10 lg11 class="cell">
                                    <v-layout row class="flex-column flex-md-row">


                                        <v-flex xs12 sm12 md2 lg2>
                                            <span>{{ item.date}}</span>
                                        </v-flex>

                                        <v-flex xs12 sm12 md10 lg10>
                                            <v-flex xs10>
                                                <span>from: {{ item.wallet_from.name}} ( - {{item.sum_from}})</span>
                                            </v-flex>
                                            <v-flex xs10>
                                                <span>to: {{ item.wallet_to.name}} (+ {{item.sum_to}})</span>
                                            </v-flex>

                                        </v-flex>


                                    </v-layout>
                                </v-flex>

                                <v-flex xs2 sm2 md2 lg1>
                                    <div class="cell-actions justify-content-end">
                                        <a class="delete" data-toggle="modal">
                                            del
                                            <!--<v-icon color="#F44336">delete</v-icon>-->
                                        </a>
                                    </div>

                                </v-flex>

                            </v-layout>


                        </li>

                    </ul>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style scoped>

    li:nth-of-type(odd) {
        background-color: #fcfcfc;
    }

    li:first-child {
        background: #435d7d;
    }

    .list-header {

        background: #435d7d;
        color: #fff;
        font-family: 'Varela Round', sans-serif;
        font-size: 15px;
        font-weight: bold;

    }

    .list-item {
        color: rgb(86, 103, 135);;
        font-family: 'Varela Round', sans-serif;
        font-size: 15px;

    }

    .list-item:hover {
        cursor: pointer;
        background-color: rgb(245, 245, 245);

    }

    list-item:nth-of-type(odd) {
        background-color: #fcfcfc;
    }

    list-item:hover {
        background: #f5f5f5;
    }

    .cell-actions {
        display: flex;
        flex-direction: row;
        justify-items: center;
        max-width: 60px;
    }
</style>

<script>
    import ApiClass from '../api/api_laravel';
    import {mapGetters} from 'vuex';

    const api = new ApiClass();
    const moment = require('moment');
    export default {
        data: () => ({
            title: "Transfers",
            processing: false,
            offsetTop: 0,
            offset: 0,
            page: 0,
            updating: false,
            showDel: false,
            currentPage: 1,

            headers: [
                {text: 'id', value: 'id', classList: ['d-none']},
                {text: 'Date', value: 'date', classList: ["col-xs-2 col-sm-2 col-lg-2"]},
                {text: 'Wallet', value: 'walletName', classList: ["col-xs-2 col-sm-4 col-lg-4"]},
                {text: 'Sum', value: 'sum', classList: ["col-xs-2 col-sm-4 col-lg-5"]},
            ],
        }),
        computed: {
            ...mapGetters({
                items: 'items',
            }),
        },

        beforeMount: function () {
            this.$store.state.title = 'Transfers';
            this.$store.commit('setupToolbarMenu', this.getUpMenu());
            this.$store.dispatch('getTransfers', this.currentPage);
        },

        methods: {
            getUpMenu() {
                return {
                    mainAction: {
                        title: 'add',
                        icon: 'add',
                        action: () => {
                            this.add();
                        },
                    },
                    menu: [
                        {
                            title: 'update',
                            icon: 'update',
                            action: () => {
                                this.update();
                            },
                        }
                    ]
                };

            },

            editItem(item) {
                let id = item.id;

                console.log(`edit transfer by id ${id}`);

                this.$router.push({path: `transfers/${id}`});
            },

            add() {
                this.$router.push({path: `transfers/new`});
            },

            addDocs() {
                if (this.updating == true) {
                    return;
                }

                this.offset += 50;
                this.updating = true;

            },
            showDelBtn() {
                this.showDel = !this.showDel;
            },
            deleteItem(item) {
                alert("Action doesn't support yet");
            },
        },
    };
</script>


