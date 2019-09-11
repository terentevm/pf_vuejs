<template>
    <v-container fluid mt-0>
        <v-card>
            <v-toolbar dense flat color="white">
                <v-btn flat color="appColor" @click="save">Save</v-btn>
                <v-btn flat color="orange darken-2" @click="cancel">Cancel</v-btn>
            </v-toolbar>
            <v-progress-linear v-show="this.processing == true"
                               :indeterminate="true"></v-progress-linear>
            <div class="form-layout">
                <v-layout row>
                    <v-flex xs12 sm12 md6 lg6>
                        <v-menu
                                :close-on-content-click="false"
                                v-model="menu"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                        >
                            <v-text-field
                                    slot="activator"
                                    :value="date"
                                    @change="dateOnChange"
                                    label="Date"
                                    type="date"
                                    dense
                                    prepend-icon="event"
                                    readonly
                            ></v-text-field>
                            <v-date-picker
                                    :value="date"
                                    @change="dateOnChange"
                                    @input="menu = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-flex>
                </v-layout>
                <!-- wallet input -->
                <v-layout row>
                    <v-flex xs12 sm12 md6 lg6>
                        <v-select
                                v-model="wallet"
                                :items="wallets"
                                :value="wallet"
                                menu-props="auto"
                                label="Wallet"
                                item-text="name"
                                item-value="id"
                                return-object
                                prepend-icon="account_balance_wallet"
                                append-outer-icon="pageview"
                                @click:append-outer="startWalletChoice"
                        ></v-select>
                    </v-flex>
                </v-layout>

                <tm-wallets-select-form
                        v-bind:items="this.wallets"
                        v-bind:showWalletSelection="this.showWalletSelection"
                        @select-wallets-close="completeWalletSelectionHandler"
                ></tm-wallets-select-form>
                <!-- START TABLE OF ITEMS -->
                <tm-editRow
                        v-bind:items="items"
                        v-bind:editRow="editRow"
                        v-bind:dialog="dialog"

                        @close="closeEditRowDialog"
                        @done="saveRow"
                >

                </tm-editRow>
                <v-layout row>
                    <v-flex xs12 sm12 md12 lg12>
                        <v-toolbar
                                color="appColor"
                                dense
                                dark
                        >
                            <v-toolbar-items>
                                <v-btn flat dark @click="addNewLine()">
                                    <v-icon left dark>add</v-icon>
                                    Add
                                </v-btn>

                                <v-btn
                                        v-show="this.selected.length > 0"
                                        flat
                                        dark
                                        @click="deleteSelected()"
                                >
                                    <v-icon>delete</v-icon>
                                    Delete
                                </v-btn>

                            </v-toolbar-items>
                            <v-spacer></v-spacer>

                            <v-toolbar-title color="white">Total: {{ totalAmount }} ({{
                                currency.short_name }})
                            </v-toolbar-title>
                        </v-toolbar>

                        <v-data-table
                                select-all
                                v-model="selected"
                                :headers="headers"
                                :items="rows"
                                item-key="rowId"
                                class="elevation-1"
                                id="table-of-expenses"
                        >
                            <template slot="headers" slot-scope="props">
                                <th>
                                    <v-checkbox
                                            :input-value="props.all"
                                            :indeterminate="props.indeterminate"
                                            primary
                                            hide-details
                                            @click="toggleAll"
                                    ></v-checkbox>
                                </th>
                                <th
                                        v-for="header in props.headers"
                                        :key="header.text"
                                        :align="header.align"
                                        :class="header.class"
                                >
                                    {{ header.text }}
                                </th>
                            </template>

                            <template slot="items" slot-scope="props" class="table-of-expenses">
                                <tr>
                                    <td class="d-none">{{ props.item.item }}</td>
                                    <td>
                                        <v-checkbox v-model="props.selected" primary
                                                    hide-details></v-checkbox>
                                    </td>

                                    <td class="text-xs-left"
                                        @click="editCurrentRow(props.item)">
                                        {{ props.item.item.name }}
                                    </td>

                                    <td class="text-xs-left"
                                        @click="editCurrentRow(props.item)">
                                        {{ props.item.sum }}
                                    </td>

                                    <td class="text-xs-left hidden-sm-and-down"
                                        @click="editCurrentRow(props.item)">
                                        {{ props.item.comment }}
                                    </td>

                                    <!-- <td class="justify-center layout px-0 hidden-xs-and-down" style="background-color: #FF6565">
                                    <v-icon small @click="deleteRow(props.item)">delete</v-icon>
                                    </td>-->
                                </tr>
                            </template>

                            <template slot="no-data">
                                <v-alert :value="true" type="info" icon="warning"
                                >To add a new expense, click "Add"
                                </v-alert
                                >
                            </template>
                        </v-data-table>

                    </v-flex>
                </v-layout>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import ApiClass from './Api';

    const Api = new ApiClass();
    import EditRowDialog from './SelectsForms/EditRowFrom';
    import Num from '../helpers/Num';
    import {mapGetters, mapState, mapActions} from 'vuex';

    export default {
        props: ['docId'],
        data: () => ({
            menu: false,
            toggle_multiple: [0, 1],
            selected: [],
            countRows: 0,
            currentRow: 0,
            editRow: {
                index: null,
                item: null,
                sum: 0,
                comment: '',
            },

            headers: [
                {
                    text: 'Category of expence',
                    align: 'left',
                    sortable: true,
                    value: 'item',
                },
                {text: 'Amount', value: 'sum', align: 'left'},
                {
                    text: 'Comment',
                    value: 'comment',
                    align: 'left',
                    class: 'hidden-sm-and-down',
                },
            ],
            //wallets: [],
            menu: false,
            modal: false,
            active: null,
            dialog: false,
            showWalletSelection: false,
            processing: false
        }),
        components: {
            'tm-editRow': EditRowDialog
        },
        computed: {
            wallet: {
                get() {
                    return this.$store.state.expenses.expenseObj.wallet
                },
                set(wallet) {
                    this.$store.commit('expenseUpdateWallet', wallet);
                }
            },
            ...mapState({
                id: state => state.expenses.expenseObj.id,
                date: state => state.expenses.expenseObj.date,
                currency: state => state.expenses.expenseObj.currency,
                rows: state => state.expenses.expenseObj.rows,
                closeForm: state => state.expenses.closeForm,
            }),
            ...mapGetters({
                wallets: 'allWallets',
                items: 'allExpenseItems',
            }),
            totalAmount: function () {
                const reducer = (accumulator, row) => accumulator + Number(row.sum);
                let total = this.rows.reduce(reducer, 0);
                return Num.round2(total);
            },
        },
        beforeMount() {
            this.$store.state.title = 'Expense';
            this.$store.dispatch('getSettings');
            this.$store.dispatch('getAllWallets');
            this.$store.dispatch('getAllExpenseItems');
            this.$store.dispatch('getExpense', this.docId);
        },

        watch: {

            closeForm: function (val, oldVal) {
                if (val === true) {
                    this.$router.push({path: '/expends'});
                }
            },
        },
        methods: {
            startWalletChoice() {
                this.showWalletSelection = true;
            },

            completeWalletSelectionHandler(wallet) {
                if (wallet !== undefined && typeof wallet === 'object') {
                    this.walletOnChange(wallet);
                }

                this.showWalletSelection = false;
            },

            deleteSelected() {
                this.$store.commit('deleteSelected', this.selected);
            },

            toggleAll() {
                if (this.selected.length) {
                    this.selected = [];
                } else {
                    this.selected = this.rows.slice();
                }
            },

            dateOnChange(newDate) {
                this.$store.commit('expenseUpdateDate', newDate);
            },

            walletOnChange(wallet) {
                this.$store.commit('expenseUpdateWallet', wallet);
            },

            editCurrentRow(row) {
                this.editRow = Object.assign({}, row);
                this.editRow.index = this.rows.indexOf(row);
                this.dialog = true;
            },

            addNewLine() {
                this.tempRow = null;

                (this.editRow = {
                    index: null,
                    item: null,
                    sum: 0,
                    comment: '',
                }),
                    (this.dialog = true);
            },

            closeEditRowDialog() {
                this.dialog = false;
            },

            saveRow(row) {
                this.dialog = false;
                if (row.index === null) {
                    let maxRowId = this.maxRowId();
                    row.rowId = ++maxRowId;

                }

                this.$store.commit('expenseEditRow', row);

                this.editRow = {
                    index: null,
                    item: null,
                    sum: 0,
                    comment: '',
                };


            },

            maxRowId() {
                if (this.rows.length == 0) {
                    return 0;
                }

                const reducer = function (accumulator, row) {
                    return Math.max(accumulator, row.rowId);
                };

                let maxRowId = this.rows.reduce(reducer, 0);

                return maxRowId;
            },

            deleteRow(row) {
                this.$store.commit('expenseDeleteRow', row);
            },

            openFormItems() {
                this.dialog = true;
            },

            chooseItem(item) {
                this.editRow.item = item;
                this.dialog = false;
            },

            save() {
                this.processing = true;
                this.$store.dispatch('saveExpense').then(() => {
                    this.processing = false;
                    this.$router.push({path: '/expends'});
                }).catch(err => {
                    this.processing = false;
                });
            },

            cancel() {
                this.$router.push({path: '/expends'});
            },
        },
    };
</script>

<style lang="scss" scoped>
    .form-layout {
        margin-left: 20px;
        margin-right: 20px;
    }

    .select-td {
        width: 20px;
    }


</style>
