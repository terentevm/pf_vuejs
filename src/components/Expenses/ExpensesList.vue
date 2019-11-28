<template>
    <div class="row">
        <div class="table-wrapper">
            <v-dialog
                v-if="showPeriodDialog"
                v-model="showPeriodDialog"
                max-width="500px"
            >
                <tm-period></tm-period>
            </v-dialog>
<!--            <div class="row">-->
<!--                <a href="">period</a>-->
<!--            </div>-->
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
                <li v-for="item in expensesList" :key="item.id" class="list-group-item list-item" @click="editItem(item)">
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

<script>
import VFooter from 'vuetify/lib/components/VFooter';
import VPagination from 'vuetify/lib/components/VPagination';
import TMTableModalDelete from '../TMComponents/TMDataTable/TMTableModalDelete';
import TMPeriodDialog from "@/components/TMComponents/TMPeriodDialog/TMPeriodDialog";
import VDialog from 'vuetify/lib/components/VDialog';
export default {
    components: {
        VFooter,
        VPagination,
        VDialog,
        'tm-modal-del': TMTableModalDelete,
        'tm-period': TMPeriodDialog
    },
    data: () => ({
        title: 'Expenses',
        processing: false,
        offsetTop: 0,
        offset: 0,
        updating: false,
        showDel: false,
        pagination: {
            sortBy: 'date',
            descending: true,
            rowsPerPage: -1
        },

        headers: [
            { text: 'id', value: 'id', classList: ['d-none'] },
            { text: 'Date', value: 'date', classList: ['col-xs-2 col-sm-2 col-lg-2'] },
            { text: 'Wallet', value: 'walletName', classList: ['col-xs-2 col-sm-4 col-lg-4'] },
            { text: 'Sum', value: 'sum', classList: ['col-xs-2 col-sm-4 col-lg-5'] }
        ],
        showDeleteConfirmation: false,
        modelName: 'expense',
        itemForDelete: null,
        showPeriodDialog: false
    }),

    computed: {
        expensesList() {
            return this.$store.state.expenses.expensesList;
        },

        page: {
            get() {
                return this.$store.state.expenses.page;
            },

            set(page) {
                console.dir(this.$route);
                this.$route.query.page = page;
                this.$store.commit('setPageForExpenses', page);
                this.$store.dispatch('getExpensesList');
            }
        }
    },

    beforeMount: function() {
        this.$store.state.title = 'Expenses';
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
                    }
                },
                menu: [
                    {
                        title: 'update',
                        icon: 'update',
                        action: () => {
                            this.update();
                        }
                    },
                    {
                        title: 'Set period',
                        icon: 'date_range',
                        action: () => {
                            this.showPeriodDialog = true;
                        }
                    }
                ]
            };
        },

        update() {
            this.$store.dispatch('getExpensesList');
        },

        editItem(item) {
            let id = item.id;
            this.$router.push({ path: `expend/${id}` });
        },

        add() {
            this.$router.push({ path: 'expend/new' });
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

            this.$store.dispatch('deleteExpense', this.itemForDelete).then(res => {
                this.update();
            });
        },

        nextPage() {
            this.$store.dispatch('nextPage');
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';
@import '~bootstrap/scss/_list-group.scss';

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
    color: rgb(86, 103, 135);
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
    .pagination-wrapper {
        position: relative;
    }
</style>
