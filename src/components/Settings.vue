<template>
    <v-container px-0 mx-0>
        <v-layout row>
            <v-flex xs12>
                <div class="table-wrapper">
                    <v-layout row mx-2>
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-card flat>
                                <h4 class="card-subtitle mt-3 mb-3 text-muted">General</h4>
                                <v-form>
                                    <v-select
                                            :value="currency"
                                            :items="currencies"
                                            label="System currency"
                                            readonly
                                            item-text="name"
                                            item-value="id"
                                            return-object
                                    ></v-select>
                                    <v-autocomplete
                                            v-model="wallet"
                                            :value="wallet"
                                            :items="wallets"
                                            label="Main wallet"
                                            clearable
                                            item-text="name"
                                            item-value="id"
                                            return-object
                                    ></v-autocomplete>
                                    <v-autocomplete
                                            v-model="currencyReports"
                                            :value="currencyReports"
                                            :items="currencies"
                                            label="Currency for reports"
                                            clearable
                                            item-text="name"
                                            item-value="id"
                                            return-object
                                    ></v-autocomplete>
                                </v-form>
                                <v-card-actions>
                                    <v-progress-linear v-show="this.processing"
                                                       :indeterminate="true">
                                        <p>process</p>
                                    </v-progress-linear>
                                    <v-spacer></v-spacer>

                                    <v-btn
                                            type="button"
                                            :disabled="this.processing === true"
                                            v-if="formModified === true"
                                            @click="storeChanges"
                                            color="info">Save changes
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>

                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-card flat mx-2>
                                <h4 class="card-subtitle mt-3 mb-3 text-muted">Dashboard
                                    settings</h4>
                                <v-select
                                        :items="periods"
                                        v-model="periodicity"
                                        item-text="name"
                                        item-value="period"
                                        return-object
                                        label="Periodicity"
                                        prepend-icon="date_range"
                                ></v-select>
                            </v-card>
                        </v-flex>

                    </v-layout>
                </div>
            </v-flex>

        </v-layout>

        <v-snackbar v-model="this.showAlert" vertical :color="this.alertType">
            {{ this.message }}
            <v-btn flat @click="showAlert = false">Close</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        data: () => ({
            formModified: false,

            processing: false,
            showAlert: false,
            alertType: 'success',
            message: '',
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
                    return this.$store.state.settings.currencyReports;
                }
                ,
                set(currency) {
                    this.formModified = true;
                    this.$store.commit('setCurrencyReports', currency);
                }
            },
            wallet: {
                get() {
                    return this.$store.state.settings.wallet;
                },
                set(wallet) {
                    this.formModified = true;
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

            this.$store.dispatch('initializeDashboardSettings');
            this.$store.dispatch('getAllWallets');
            this.$store.dispatch('getAllCurrencies');
            this.$store.dispatch('getSettings');


        },

        methods: {
            storeChanges() {
                this.processing = true;
                this.showAlert = false;
                this.$store.dispatch('storeSettings').then(() => {
                    this.processing = false;
                    this.message = 'Stored successfully';
                    this.alertType = 'success';
                    this.showAlert = true;

                }).catch(err => {
                    this.processing = false;

                    this.message = 'Error';
                    this.alertType = 'error';
                    this.showAlert = true;
                });
            }

        }

    };


</script>
