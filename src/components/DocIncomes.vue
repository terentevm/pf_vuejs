<template>
    <div class="row">
        <div class="table-wrapper">
            <ul class="list-group list-group-flush mb-5">
                <li class="list-group-item list-header">
                    <v-layout row ml-4>
                        <v-flex xs10 sm10 md10 lg11 class="cell">
                            <v-layout row>
                                <v-flex xs8 sm8 md10 lg10 class="cell">
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
                                        <span>Sum</span>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex xs2 sm2 md2 lg1>
                            <div class="cell-actions justify-content-center">
                                <span>Act.</span>
                            </div>
                        </v-flex>
                    </v-layout>
                </li>
                <li v-for="item in transactionsList" :key="item.id" class="list-group-item list-item" @click="editItem(item)">
                    <v-layout row ml-4>
                        <v-flex xs10 sm10 md10 lg11 class="cell">
                            <v-layout row>
                                <v-flex xs8 sm8 md10 lg10 class="cell">
                                    <v-layout row d-flex class="flex-column flex-md-row">
                                        <v-flex xs8 sm4>
                                            <span>{{ item.date }}</span>
                                        </v-flex>
                                        <v-flex xs8>
                                            <span>{{ item.walletName }}</span>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs4 sm4 md2 lg2>
                                    <div class="d-flex justify-content-end">
                                        <span>{{ item.sum }}</span>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex xs2 sm2 md2 lg1>
                            <div class="cell-actions justify-content-center">
                                <a class="delete" data-toggle="modal" @click.stop="showDeleteQuestion(item)">
                                    <v-icon color="#F44336">delete</v-icon>
                                </a>
                            </div>
                        </v-flex>
                    </v-layout>
                </li>
            </ul>
            <v-footer
                fixed
                inset
                height="50"
            >
                <v-layout
                    justify-center
                    row
                    wrap
                >
                    <div class="text-center">
                        <v-pagination
                            v-model="page"
                            :length="15"
                            :total-visible="6"
                        ></v-pagination>
                    </div>
                </v-layout>
            </v-footer>
        </div>
        <tm-modal-del
            v-show="showDeleteConfirmation"
            :dialog="showDeleteConfirmation"
            :model-name="modelName"
            @close="closeDeleteConfirmation"
            @confirm="deleteItem"
        ></tm-modal-del>
    </div>
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
    import VFooter from 'vuetify/lib/components/VFooter';
    import VPagination from 'vuetify/lib/components/VPagination';
    import TMTableModalDelete from './TMComponents/TMDataTable/TMTableModalDelete';
    export default {
        components: {
            VFooter,
            VPagination,
            'tm-modal-del': TMTableModalDelete,
        },
        data: () => ({
            items: [],
            title: 'Incomes',
            processing: false,
            offsetTop: 0,
            offset: 0,
            updating: false,
            showDel: false,
            showDeleteConfirmation: false,
            modelName: 'income',
            itemForDelete: null,
            pagination: {
                sortBy: 'date',
                descending: true,
                rowsPerPage: -1,
            },

            headers: [
                {text: 'id', value: 'id', classList: ['d-none']},
                {text: 'Date', value: 'date', classList: ['col-xs-2 col-sm-2 col-lg-2']},
                {text: 'Wallet', value: 'walletName', classList: ['col-xs-2 col-sm-4 col-lg-4']},
                {text: 'Sum', value: 'sum', classList: ['col-xs-2 col-sm-4 col-lg-5']},
            ],
        }),
        computed: {
            transactionsList() {
                return this.$store.state.incomes.incomesList;
            },

            page: {
                get() {
                    return this.$store.state.incomes.page;
                },

                set(page) {
                    console.dir(this.$route);
                    this.$route.query.page = page;
                    this.$store.commit('setPageForIncomes', page);
                    this.$store.dispatch('getIncomesList');
                }
            }
        },
        beforeMount: function () {
            this.$store.state.title = 'Incomes';
            this.$store.commit('setupToolbarMenu', this.getUpMenu());
            this.update();
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
                this.$router.push({path: `income/${id}`});
            },

            add() {
                this.$router.push({path: 'income/new'});
            },

            update() {
                this.$store.dispatch('getIncomesList');
            },

            showDelBtn() {
                this.showDel = !this.showDel;
            },

            showDeleteQuestion(item) {
                this.itemForDelete = item;
                this.showDeleteConfirmation = true;
            },

            closeDeleteConfirmation() {
                this.showDeleteConfirmation = false;
                this.itemForDelete = null;
            },

            deleteItem() {
                this.showDeleteConfirmation = false;

                this.$store.dispatch('deleteIncome', this.itemForDelete).then(res => {
                    this.update();
                });
            },

            edit(doc) {
                this.$router.push({path: `income/${doc.id}`})
            }
        },
    };
</script>


