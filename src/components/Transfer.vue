<template>
    <v-form class="expense-from">
        <v-container>
            <v-progress-linear v-show="this.processing == true"
                               :indeterminate="true"></v-progress-linear>

            <v-layout row>
                <v-flex xs12 sm12 md12 lg12>
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

                    <!--Wallet select start-->

                    <v-layout row>
                        <v-flex xs12 sm12 md6 lg6>
                            <v-autocomplete
                                    v-model="walletFrom"
                                    :items="wallets"
                                    :value="walletFrom"
                                    menu-props="auto"
                                    label="From wallet"
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                    append-outer-icon="pageview"
                                    required
                                    v-validate.disable="'required'"
                                    data-vv-name="walletFrom"
                                    :error-messages="errors.collect('walletFrom')"
                                    @click:append-outer="startWalletChoice(1)"
                            ></v-autocomplete>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs12 sm12 md6 lg6>
                            <v-text-field
                                    type="number"
                                    clearable
                                    v-model.number.lazy="sumFrom"
                                    label="Sum of expense"
                                    required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs12 sm12 md6 lg6>
                            <v-autocomplete
                                    v-model="walletTo"
                                    :items="wallets"
                                    :value="walletTo"
                                    menu-props="auto"
                                    label="To Wallet"
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                    append-outer-icon="pageview"
                                    required
                                    v-validate.disable="'required'"
                                    data-vv-name="walletTo"
                                    :error-messages="errors.collect('walletTo')"
                                    @click:append-outer="startWalletChoice(2)"
                            ></v-autocomplete>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm12 md6 lg6>

                            <v-text-field
                                    type="number"
                                    clearable
                                    v-model.number.lazy="sumTo"
                                    label="Sum of income"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>


                </v-flex>
            </v-layout>

            <tm-wallets-select-form
                    v-bind:items="this.wallets"
                    v-bind:showWalletSelection="this.showWalletSelection"
                    @select-wallets-close="completeWalletSelectionHandler"
            ></tm-wallets-select-form>
            <!--Header end-->
        </v-container>
    </v-form>
</template>

<script>
    import {mapGetters} from 'vuex';
    import MyNum from '../helpers/MyNum';

    export default {
        props: ['docId'],
        data: () => ({
            processing: false,
            showWalletSelection: false,
            typeWalletEdit: -1,
            menu: false,
            $_veeValidate: {
                validator: "new"
            },
            dictionary: {
                attributes: {
                    walletFrom: "Wallet from",
                    walletTo: "wallet to"
                },
                custom: {
                    name: {
                        required: () => "Name can not be empty",
                        max: "The name field may not be greater than 10 characters"
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
                }
            },
            walletTo: {
                get() {
                    return this.$store.state.transfers.formData.walletTo;
                },
                set(wallet) {
                    this.$store.commit('setWalletTo', wallet);
                }
            },
            sumFrom: {
                get() {
                    return this.$store.state.transfers.formData.sumFrom;
                },
                set(sum) {
                    this.$store.commit('setSumFrom', MyNum.round2(Number(sum)));
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

                    if (this.typeWalletEdit == 1) {
                        this.walletFrom = wallet;
                    }
                    else if (this.typeWalletEdit == 2) {
                        this.walletTo = wallet;
                    }
                }

                this.showWalletSelection = false;
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