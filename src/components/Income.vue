<template>
    <div id="income-form-root" class="row mx-0">
        <v-progress-linear
            v-show="processing === true"
            :indeterminate="true"
        ></v-progress-linear>
        <!--Header start-->
        <form style="min-width: 100%">
            <div class="edit_from_header">
                <div class="row">
                    <div class="col-xs-12 col-sm-6 px-0">
                        <div class="form-group">
                            <label
                                for="expense_date_el"
                                class="tm-input-label"
                            >Date</label>
                            <v-date-control
                                :date="date"
                                @change="dateOnChange"
                            ></v-date-control>
                        </div>
                    </div>
                </div>

                <div class="row d-flex">
                    <div class="col-xs-12 col-sm-6 px-0">
                        <div class="d-flex flex-wrap">
                            <div class="form-group">
                                <label for="wallet_sel" class="tm-lable">Wallet:</label>

                                <tm-select
                                    id="wallet_sel"
                                    v-model="wallet"
                                    :options="wallets"
                                    :title="'name'"
                                    :clearable="true"
                                    :select-btn="true"
                                    :placeholder="'Select wallet'"
                                    @open="startWalletChoice"
                                ></tm-select>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Wallet select start-->

                <tm-wallets-select-form
                    :items="wallets"
                    :show-wallet-selection="showWalletSelection"
                    @select-wallets-close="completeWalletSelectionHandler"
                ></tm-wallets-select-form>
                <!--Wallet select end-->
            </div>

            <!--Header end-->
            <div class="row">
                <div class="col-12 px-0">
                    <tm-editRow
                        :items="items"
                        :edit-row="editRow"
                        :dialog="dialog"

                        @close="closeEditRowDialog"
                        @done="saveRow"
                    >
                    </tm-editRow>

                    <div class="from-table-wrapper">
                        <v-toolbar
                            color="appColor"
                            dense
                            dark
                        >
                            <v-toolbar-items>
                                <v-btn flat dark @click="addNewLine()">
                                    <v-icon left dark>
                                        add
                                    </v-icon>
                                    Add
                                </v-btn>

                                <v-btn
                                    v-show="selected.length > 0"
                                    flat
                                    dark
                                    @click="deleteSelected()"
                                >
                                    <v-icon>delete</v-icon>
                                    Delete
                                </v-btn>
                            </v-toolbar-items>
                            <v-spacer></v-spacer>

                            <v-toolbar-title color="white">
                                Total: {{ totalAmount }} ({{
                                    currency.short_name }})
                            </v-toolbar-title>
                        </v-toolbar>

                        <v-data-table
                            id="table-of-expenses"
                            v-model="selected"
                            select-all
                            :headers="headers"
                            :items="rows"
                            item-key="rowId"
                            class="elevation-1"
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

                            <template
                                slot="items"
                                slot-scope="props"
                                class="table-of-expenses"
                            >
                                <tr>
                                    <td class="d-none">
                                        {{ props.item.item }}
                                    </td>
                                    <td>
                                        <v-checkbox
                                            v-model="props.selected"
                                            primary
                                            hide-details
                                        ></v-checkbox>
                                    </td>

                                    <td
                                        class="text-xs-left"
                                        @click="editCurrentRow(props.item)"
                                    >
                                        {{ props.item.item.name }}
                                    </td>

                                    <td
                                        class="text-xs-left"
                                        @click="editCurrentRow(props.item)"
                                    >
                                        {{ props.item.sum }}
                                    </td>

                                    <td
                                        class="text-xs-left hidden-sm-and-down"
                                        @click="editCurrentRow(props.item)"
                                    >
                                        {{ props.item.comment }}
                                    </td>
                                </tr>
                            </template>

                            <template slot="no-data">
                                <v-alert
                                    :value="true"
                                    type="info"
                                    icon="warning"
                                >
                                    To add a new income, click "Add"
                                </v-alert>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>

    import TMDateControl from './TMComponents/TMDateControl/TMDateControl';
    import TMSelect from './TMComponents/TMSelect/TMSelect';
    import {VDataTable} from 'vuetify/lib/components/VDataTable';
    import VAlert from 'vuetify/lib/components/VAlert';

    import EditRowDialog from './SelectsForms/EditRowForm';
    import MyNum from '../helpers/MyNum';
    import {mapGetters, mapState} from 'vuex';
    import '../style/myselect.scss';
    export default {
        components: {
            VAlert,
            VDataTable,
            'tm-editRow': EditRowDialog,
            'tm-select': TMSelect,
            'v-date-control': TMDateControl,
        },
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
                    text: 'Category',
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
            modal: false,
            active: null,
            dialog: false,
            showWalletSelection: false,
            processing: false
        }),
        computed: {
            wallet: {
                get() {
                    return this.$store.state.incomes.incomeObj.wallet
                },
                set(wallet) {
                    this.$store.commit('incomeUpdateWallet', wallet);
                }
            },
            ...mapState({
                id: state => state.incomes.incomeObj.id,
                date: state => state.incomes.incomeObj.date,
                currency: state => state.incomes.incomeObj.currency,
                rows: state => state.incomes.incomeObj.rows,
                closeForm: state => state.incomes.closeForm,
            }),
            ...mapGetters({
                wallets: 'allWallets',
                items: 'allIncomeItems',
            }),
            totalAmount: function () {
                const reducer = (accumulator, row) => accumulator + Number(row.sum);
                let total = this.rows.reduce(reducer, 0);
                return MyNum.round2(total);
            },
        },

        watch: {

            closeForm: function (val, oldVal) {
                if (val === true) {
                    this.$router.push({path: '/expends'});
                }
            },
        },
        beforeMount() {
            this.$store.state.title = 'Income';
            this.$store.commit('setupToolbarMenu', []);
            this.$store.commit('setupToolbarMenu', this.getUpMenu());

            this.$store.dispatch('getSettings');
            this.$store.dispatch('getAllWallets');
            this.$store.dispatch('getAllIncomeItems');
            this.$store.dispatch('getIncome', this.docId);
        },
        methods: {
            getUpMenu() {
                return {
                    mainAction: {
                        title: 'Save',
                        icon: 'done',
                        action: () => {
                            this.save();
                        },
                    },
                    menu: [
                        {
                            title: 'Cancel',
                            icon: 'exit_to_app',
                            action: () => {
                                this.cancel();
                            },
                        }
                    ]
                };

            },
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
                this.$store.commit('incomeUpdateDate', newDate);
            },

            walletOnChange(wallet) {
                this.$store.commit('incomeUpdateWallet', wallet);
            },

            editCurrentRow(row) {
                this.editRow = Object.assign({}, row);
                this.editRow.index = this.rows.indexOf(row);
                this.dialog = true;
            },

            addNewLine() {

                this.editRow = {
                    index: null,
                    item: null,
                    sum: 0,
                    comment: '',
                };

                this.dialog = true;
            },

            closeEditRowDialog() {
                this.dialog = false;
            },

            saveRow(row) {
                this.dialog = false;

                if (!row.item) return;

                if (row.index === null) {
                    let maxRowId = this.maxRowId();
                    row.rowId = ++maxRowId;

                }

                this.$store.commit('incomeEditRow', row);

                this.editRow = {
                    index: null,
                    item: null,
                    sum: 0,
                    comment: '',
                };


            },

            maxRowId() {
                if (this.rows.length === 0) {
                    return 0;
                }

                const reducer = function (accumulator, row) {
                    return Math.max(accumulator, row.rowId);
                };

                return this.rows.reduce(reducer, 0);

            },

            deleteRow(row) {
                this.$store.commit('incomeDeleteRow', row);
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
                this.$store.dispatch('saveIncome').then(() => {
                    this.processing = false;
                    this.$router.push({path: '/incomes'});
                }).catch(() => {
                    //ToDo write error handle and show message
                    this.processing = false;
                });
            },

            cancel() {
                this.$router.push({path: '/incomes'});
            },
        },
    };
</script>

<style lang="scss" scoped>

    .tm-input-label {
        color: #566787;
        font-family: 'Varela Round', sans-serif;
        font-size: 15px;
        font-weight: 700;
    }

    .date-input {
        height: 36px;
        min-width: 100%;
        border: 1px solid #566787;
        background: #dfe5fb;
        text-transform: lowercase;
        font-variant: small-caps;
        border-radius: 4px;
        line-height: 1.4;
        font-size: 1em;

        margin: 4px 0 0 0;
        padding: 0 7px;

    }

    .select_with_icon {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .input-select-wrapper {
        display: flex;
        flex-basis: 400px;
    }

    .btn-open-selection {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: 40px;
        width: 36px;
        border: 1px solid #566787;
        background: #dfe5fb;
        border-radius: 4px;
        margin-left: 3px;
        margin-right: 3px;
        fill: #394066;
    }

    .select-td {
        width: 20px;
    }
</style>
