<template>

    <v-card>
        <v-toolbar color="appColor" dark>
            <v-toolbar-title>Wallet: {{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>account_balance_wallet</v-icon>
            </v-btn>
        </v-toolbar>

        <v-card-text>
            <v-container grid-list-md>
                <v-flex xs12 sm12 md12 d-none>
                    <v-text-field label="id" v-model="formData.id"></v-text-field>
                </v-flex>

                <div class="row">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                        <v-text-field
                                label="Name"
                                v-model="formData.name"
                                row-height="15"
                        ></v-text-field>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                        <v-select
                                :items="currencies"
                                v-model="formData.currency"
                                max-height="15"
                                auto
                                label="Currency"
                                single-line
                                item-text="name"
                                item-value="id"
                                return-object
                        ></v-select>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                        <v-checkbox
                                :label="`Is credit card`"
                                v-model="formData.is_creditcard"
                                true-value="1"
                                false-value="0"
                        ></v-checkbox>
                    </div>
                </div>

                <div class="row">
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                        <v-text-field
                                label="Credit limit"
                                v-model="formData.credit_limit"
                                row-height="15"
                                v-show="formData.is_creditcard == 1"
                        ></v-text-field>
                    </div>

                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                        <v-text-field
                                label="Grace period"
                                v-model="formData.grace_period"
                                row-height="15"
                                v-show="formData.is_creditcard == 1"
                        ></v-text-field>
                    </div>
                </div>
                <div class="row">
                    <div class="text-xs-center">
                        <v-chip color="green" text-color="white">
                            <v-avatar class="green darken-4">
                                <v-icon>edit</v-icon>
                            </v-avatar>
                            Balance: {{formData.balance}}
                        </v-chip>
                    </div>
                </div>

            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-btn color="blue darken-1" flat @click="close()">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn :disabled="this.processing == true" color="green darken-3" flat @click="store()">
                Save
            </v-btn>
        </v-card-actions>
        <v-progress-linear v-show="this.processing" :indeterminate="true">
            <p>process</p>
        </v-progress-linear>
    </v-card>


</template>

<script>

    import {mapGetters} from 'vuex';
    import ApiClass from '../../api/api_laravel';

    const api = new ApiClass();
    export default {
        name: 'WalletElement',
        props: {
            item: {
                type: Object,
                required: true,
            },

        },
        data: () => ({
            title: 'New',

            formData: {
                id: null,
                name: '',
                currency_id: '',
                is_creditcard: false,
                grace_period: 0,
                credit_limit: 0,
                balance: 0,
                newBalance: 0,
            },
            serverData: {
                id: null,
                name: '',
                currency_id: '',
                is_creditcard: false,
                grace_period: 0,
                credit_limit: 0
            },

            processing: false,
        }),
        computed: {
            ...mapGetters({
                currencies: 'allCurrencies',
            }),
        },
        created: function () {

            this.$store.dispatch('getAllCurrencies');
            this.formData = Object.assign({}, this.item);
            this.title = this.item.id ? this.item.name : 'new';

        },

        methods: {
            close() {
                this.$emit('cancel');
            },

            store() {

                this.processing = true;
                this.copyObject(this.serverData, this.formData);
                this.serverData.currency_id = this.formData.currency.id;


                let promise = null;

                if (!this.formData.id) {
                    promise = api.store('wallets', this.serverData);
                } else {
                    promise = api.update('wallets', this.serverData.id, this.serverData);
                }

                promise
                    .then(result => {
                        this.processing = false;
                        this.$emit('stored');
                    })
                    .catch(err => {
                        this.processing = false;
                    });
            },

        },
    };
</script>

<style scoped></style>
