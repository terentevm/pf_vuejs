<template>
    <v-container>
        <v-layout>
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
                                                <span>Wallet</span>
                                            </v-flex>

                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs4 sm4 md2 lg2>

                                        <div class="d-flex justify-content-end">
                                            <span >Sum</span>
                                        </div>



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
                                <v-layout row>
                                    <v-flex xs8 sm8md10 lg10 class="cell">
                                        <v-layout row d-flex class="flex-column flex-md-row">
                                            <v-flex xs4>
                                                <span>{{ item.date}}</span>
                                            </v-flex>
                                            <v-flex xs8>
                                                <span>{{ item.walletName}}</span>
                                            </v-flex>

                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs4 sm4 md2 lg2>

                                            <div class="d-flex justify-content-end">
                                                <span >{{ item.sum }}</span>
                                            </div>



                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs2 sm2 md2 lg1>
                                <div class="cell-actions justify-content-end">
                                    <a class="delete" data-toggle="modal">

                                        <v-icon color="#F44336">delete</v-icon>
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

    const api = new ApiClass();

    var moment = require('moment');
    export default {
        data: () => ({
            items: [],
            title: "Expenses",
            processing: false,
            offsetTop: 0,
            offset: 0,
            page: 0,
            updating: false,
            showDel: false,
            pagination: {
                sortBy: 'date',
                descending: true,
                rowsPerPage: -1,
            },

            headers: [
                {text: 'id', value: 'id', classList: ['d-none']},
                {text: 'Date', value: 'date', classList: ["col-xs-2 col-sm-2 col-lg-2"]},
                {text: 'Wallet', value: 'walletName', classList: ["col-xs-2 col-sm-4 col-lg-4"]},
                {text: 'Sum', value: 'sum', classList: ["col-xs-2 col-sm-4 col-lg-5"]},
            ],
        }),

        beforeMount: function () {
            this.$store.state.title = 'Expenses';
            this.$store.state.componentMenu = this.getUpMenu();
        },

        created() {
            this.getDocs();
        },

        methods: {
            initialize() {
                var scrollHeight = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight,
                    document.body.clientHeight,
                    document.documentElement.clientHeight,
                );

                //console.log( 'Высота с учетом прокрутки: ' + scrollHeight );
                this.updating = true;
                this.getDocs();
            },

            getUpMenu() {
                    let menu = [];

                    const action1 = {
                        title: 'add',
                        icon: 'add',
                        action: () => {
                            this.add();
                        },
                    };
                    const action2 = {
                        title: 'update',
                        icon: 'update',
                        action: () => {
                            this.update();
                        },
                    };

                    menu.push(action1);
                    menu.push(action2);

                    return menu;
            },

            getDocs() {
                api.index('expenses', {page: this.page})
                    .then(paginationInfo => {
                        console.dir(paginationInfo.data);
                        paginationInfo.data.forEach(doc => {
                            doc.walletName = doc.wallet.name;
                            if (this.items.indexOf(doc) === -1) {
                                this.items.push(doc);
                            }
                        })
                    })
            },

            editItem(item) {
                let id = item.id;
                this.$router.push({path: `expend/${id}`});
            },

            add() {
                this.$router.push({path: `expend/new`});
            },

            addDocs() {
                if (this.updating == true) {
                    return;
                }

                this.offset += 50;
                this.updating = true;
                this.getDocs(this.offset);
            },
            showDelBtn() {
                this.showDel = !this.showDel;
            },
            deleteItem(item) {
                alert("Action doesn't support yet");
            },

            edit(doc) {
                this.$router.push({ path: `income/${doc.id}` })
            }
        },
    };
</script>


