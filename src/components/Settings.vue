<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-5 ">
                <div class="row d-block">
                    <div class="form-group">
                        <label for="settings_currency_el" class="tm-label">Currency (read only):</label>

                        <tm-select
                            id="settings_currency_el"
                            v-model="currency"
                            :options="currencies"
                            :title="'name'"
                            :clearable="true"
                            :select-btn="true"
                            :placeholder="'Select main wallet'"
                            :read-only="true"
                        ></tm-select>
                    </div>
                </div>

                <div class="row d-block">
                    <div class="form-group">
                        <label for="settings_main_wallet_el" class="tm-label">Default wallet<span v-show="isDirty('wallet')"> *</span>:</label>

                        <tm-select
                            id="settings_main_wallet_el"
                            v-model="wallet"
                            :options="wallets"
                            :title="'name'"
                            :clearable="true"
                            :select-btn="true"
                            :placeholder="'Select main wallet'"
                            @open="openWalletSelectForm"
                        ></tm-select>
                    </div>
                </div>

                <div class="row d-block ">
                    <div class="form-group">
                        <label for="settings_rep_currency_el" class="tm-label">Currency of dashboard<span v-show="isDirty('currencyReports')"> *</span>:</label>
                        <tm-select
                            id="settings_rep_currency_el"
                            v-model="currencyReports"
                            :options="currencies"
                            :title="'name'"
                            :clearable="true"
                            :select-btn="true"
                            :placeholder="'Select currency for reports'"
                        ></tm-select>
                    </div>
                </div>

                <div class="row d-flex px-0 px-sm-3">
                    <button
                        v-if="formModified"
                        type="button"
                        :disabled="processing"
                        class="btn btn-success"
                        @click="storeChanges"
                    >
                        Store changes
                    </button>
                </div>
                <v-progress-linear v-show="processing" :indeterminate="true">
                </v-progress-linear>
            </div>

            <div class="col-xs-0 col-sm-0 col-md-2 "></div>

            <tm-wallets-select-form
                :items="wallets"
                :show-wallet-selection="this.showWalletSelection"
                @select-wallets-close="completeWalletSelectionHandler"
            ></tm-wallets-select-form>
            <div class="col-xs-12 col-sm-12 col-md-5">
                <div class="row d-block">
                    <div class="form-group">
                        <label for="settings_dash_period_el" class="tm-label">Periodicity:</label>
                        <tm-select
                            id="settings_dash_period_el"
                            v-model="periodicity"
                            :options="periods"
                            :title="'period'"
                            :clearable="true"
                            :select-btn="false"
                            :placeholder="'Set periodicity for the app dashboard'"
                        ></tm-select>
                    </div>
                </div>
            </div>
        </div>

        <v-snackbar
            v-model="showAlert"
            :color="snackBarColor()"
        >
            {{ message }}
            <v-btn color="white" flat @click="showAlert = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {VProgressLinear} from 'vuetify/lib/components/VProgressLinear';
    import {VSnackbar} from 'vuetify/lib/components/VSnackbar';
    export default {

        components: {
            VProgressLinear,
            VSnackbar
        },
        data: () => ({
            formModified: false,
            showWalletSelection: false,
            processing: false,
            showAlert: false,
            alertType: 'success',
            message: '',

            dirtyElements: []
        }),

        computed: {
            ...mapState({
                currencies: state => state.currencies.all,
                wallets: state => state.wallets.all,
                currency: state => state.settings.currency,
                periods: state => state.dashboard.dashboardSettings.periodicityOptions
            }),

            currencyReports: {
                get() {
                    return this.$store.state.settings.reportcurrency;
                }
                ,
                set(currency) {

                    this.formModified = true;

                    if (!this.dirtyElements.includes('currencyReports')) {
                        this.dirtyElements.push('currencyReports');
                    }

                    this.$store.commit('setCurrencyReports', currency);
                }
            },
            wallet: {
                get() {
                    return this.$store.state.settings.wallet;
                },
                set(wallet) {
                    this.formModified = true;
                    if (!this.dirtyElements.includes('wallet')) {
                        this.dirtyElements.push('wallet');
                    }
                    this.$store.commit('setWallet', wallet);
                }
            },
            periodicity: {
                get() {
                    return this.$store.state.dashboard.dashboardSettings.periodicity;
                },
                set(periodicity) {
                    this.$store.commit('setPeriodicity', periodicity);
                }
            }

        },

        beforeMount() {
            this.$store.state.title = 'Settings';
            this.$store.commit('setupToolbarMenu', {});
            this.$store.dispatch('initializeDashboardSettings');
            this.$store.dispatch('getAllWallets');
            this.$store.dispatch('getAllCurrencies');
            this.$store.dispatch('getSettings');


        },

        methods: {
            openWalletSelectForm() {
                this.showWalletSelection = true;
            },

            completeWalletSelectionHandler(wallet) {
                if (wallet instanceof Object) {
                    this.formModified = true;
                    this.$store.commit('setWallet', wallet);

                }

                this.showWalletSelection = false;
            },

            isDirty(elemName) {
                return this.dirtyElements.includes(elemName);
            },

            snackBarColor() {
                return this.alertType === 'success' ? 'success' : 'error';
            },

            storeChanges() {
                this.processing = true;
                this.showAlert = false;
                this.$store.dispatch('storeSettings').then(() => {
                    this.processing = false;
                    this.formModified = false;
                    this.dirtyElements = [];
                    this.message = 'Stored successfully';
                    this.alertType = 'success';
                    this.showAlert = true;

                }).catch(err => {

                    let status = 'n/a';
                    let errorText = 'Error';

                    if (err instanceof Object && err.hasOwnProperty('status')) {
                        status = err.status;
                    }

                    if (err instanceof Object && err.hasOwnProperty('data')) {
                        if (err.data.hasOwnProperty('error')) {
                            errorText = err.data.error;
                        }

                    }

                    this.processing = false;

                    this.message = `(${status}) ${errorText}`;
                    this.alertType = 'error';
                    this.showAlert = true;
                });
            }

        }

    };


</script>
<style>
    .input-select-wrapper {
        display: flex;
        flex-basis: 400px;
        width: 100%;
        flex-grow: 1;
    }
</style>