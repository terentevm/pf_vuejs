<template>
    <div id="transfer-form-root" class="container">
        <v-progress-linear v-if="processing === true" :indeterminate="true">
        </v-progress-linear>

        <div class="row">
            <div class="col-xs-12 col-sm-6">
                <div class="row d-flex">
                    <div class="form-group mx-1">
                        <label for="expense_date_el" class="tm-lable">Date:</label>
                        <v-date-control
                            :date="date"
                            @change="dateOnChange"
                        ></v-date-control>
                    </div>
                </div>
            </div>
        </div>


        <div class="row d-flex">
            <div class="col-xs-12">
                <div class="d-flex flex-wrap">
                    <div class="form-group mx-1">
                        <label for="wallet_from_el" class="tm-lable">From wallet:</label>

                        <tm-select
                            id="wallet_from_el"
                            v-model="walletFrom"
                            :options="wallets"
                            :title="'name'"
                            :clearable="true"
                            :select-btn="true"
                            :placeholder="'Select wallet'"
                            @open="startWalletChoice(1)"
                        ></tm-select>
                    </div>
                    <div class="form-group mx-1">
                        <label for="sum_from_el" class="tm-lable">Sum:</label>
                        <tm-input
                            :id="'sum_from_el'"
                            v-model="sumFrom"
                            :input-type="'number'"
                            :clearable="true"
                            :text-color="'#fc0303'"
                        ></tm-input>
                    </div>
                </div>
            </div>
        </div>

        <div class="row d-flex">
            <div class="tm_divider mx-1"></div>
        </div>

        <div class="row d-flex">
            <div class="col-xs-12">
                <div class="d-flex flex-wrap">
                    <div class="form-group mx-1">
                        <label for="wallet_to_input" class="tm-lable">To wallet:</label>

                        <tm-select
                            id="wallet_to_input"
                            v-model="walletTo"
                            :options="wallets"
                            :title="'name'"
                            :clearable="true"
                            :select-btn="true"
                            :placeholder="'Select wallet'"
                            @open="startWalletChoice(2)"
                        ></tm-select>
                    </div>
                    <div class="form-group mx-1">
                        <label for="sum_to_input" class="tm-lable">Sum:</label>
                        <tm-input
                            :id="'sum_to_input'"
                            v-model="sumTo"
                            :input-type="'number'"
                            :clearable="true"
                            :read-only="sumToReadOnly"
                            :text-color="'#08a816'"
                        ></tm-input>
                    </div>
                </div>
            </div>
        </div>

        <tm-wallets-select-form
            :items="wallets"
            :show-wallet-selection="showWalletSelection"
            @select-wallets-close="completeWalletSelectionHandler"
        ></tm-wallets-select-form>
    </div>
</template>

<script>
    import TMSelect from './TMComponents/TMSelect/TMSelect';
    import TMInput from './TMComponents/TMInput/TMInput';
    import TMDateControl from './TMComponents/TMDateControl/TMDateControl';

    import {mapGetters} from 'vuex';
    import MyNum from '../helpers/MyNum';

    export default {

        components: {
            'v-date-control': TMDateControl,
            'tm-input': TMInput,
            'tm-select': TMSelect,

        },
        props: ['docId'],
        data: () => ({
            processing: false,
            showWalletSelection: false,
            typeWalletEdit: -1,
            menu: false,
            sumToReadOnly: false,
            dictionary: {
                attributes: {
                    walletFrom: 'Wallet from',
                    walletTo: 'wallet to'
                },
                custom: {
                    name: {
                        required: () => 'Name can not be empty',
                        max: 'The name field may not be greater than 10 characters'
                        // custom messages
                    }
                }
            }
        }),

        computed: {
            date: {
                get() {
                    return this.$store.state.transfers.formData.date;
                },

                set(date) {
                    this.$store.commit('setTransferDate', date);
                }
            },

            walletFrom: {
                get() {
                    return this.$store.state.transfers.formData.walletFrom;
                },
                set(wallet) {
                    this.$store.commit('setWalletFrom', wallet);
                    this.walletsOnChange();
                }
            },
            walletTo: {
                get() {
                    return this.$store.state.transfers.formData.walletTo;
                },
                set(wallet) {
                    this.$store.commit('setWalletTo', wallet);
                    this.walletsOnChange();
                }
            },
            sumFrom: {
                get() {
                    return this.$store.state.transfers.formData.sumFrom;
                },
                set(sum) {
                    this.$store.commit('setSumFrom', MyNum.round2(Number(sum)));
                    this.walletsOnChange();
                }
            },
            sumTo: {
                get() {
                    return this.$store.state.transfers.formData.sumTo;
                },
                set(sum) {
                    this.$store.commit('setSumTo', MyNum.round2(Number(sum)));
                }
            },
            ...mapGetters({
                wallets: 'allWallets'
            }),
        },

        beforeMount() {

            this.$store.state.title = 'Transfer';
            this.$store.commit('setupToolbarMenu', {});
            this.$store.commit('setupToolbarMenu', this.getUpMenu());
            this.$store.dispatch('getAllWallets');
            this.$store.dispatch('getTransfer', this.docId);
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
                }
            },

            dateOnChange(newDate) {
                this.$store.commit('setTransferDate', newDate);
            },

            startWalletChoice(walletType) {
                this.typeWalletEdit = walletType;
                this.showWalletSelection = true;
            },

            completeWalletSelectionHandler(wallet) {

                if (wallet !== undefined && typeof wallet === 'object') {

                    if (this.typeWalletEdit === 1) {
                        this.walletFrom = wallet;
                    }
                    else if (this.typeWalletEdit === 2) {
                        this.walletTo = wallet;
                    }
                }

                this.showWalletSelection = false;
            },

            walletsOnChange() {

                if ((this.walletFrom instanceof Object && this.walletFrom.hasOwnProperty('currency'))
                    && (this.walletTo instanceof Object && this.walletTo.hasOwnProperty('currency'))) {

                    if (this.walletFrom.currency.id === this.walletTo.currency.id) {

                        this.sumToReadOnly = true;
                        this.sumTo = this.sumFrom;
                    }
                    else {
                        this.sumToReadOnly = false;
                    }

                }

            },

            save() {
                this.$validator.validateAll().then(result => {
                    if (!result) {
                        return;
                    }

                    this.processing = true;

                    this.$store.dispatch('saveTransfer').then(() => {
                        this.processing = false;
                        this.$router.push({path: '/transfers'});
                    }).catch(err => {
                        this.processing = false;
                    });
                });

            },

            cancel() {
                this.$router.push({path: '/transfers'});
            }
        }
    }

</script>