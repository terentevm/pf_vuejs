<template>
    <div class="row h-100 align-items-center">

        <div class="col-xs-12 col-sm-3 col-lg-4"></div>
        <div class="col-xs-12 col-sm-6 col-lg-4">

            <div class="mx-2 mx-sm-0">
                <div class="mb-4">
                    <div class="font-weight-regular appColor--text text-xs-center">
                        <span class="login-header">PERSONAL FINANSES</span>
                    </div>
                    <div class="mt-3 grey--text text-xs-center font-weight-light mt-2">
                        <span class="login-subheader">Welcome! Please create your account.</span>
                    </div>
                </div>

                <div class="form" v-on:submit.prevent="sendData">

                    <form class="login-form">
                        <input
                                v-model="name"
                                type="text"
                                placeholder="name"
                                :error-messages="errors.has('name')"
                                v-validate.disable="'required'"
                                data-vv-name="name"
                                class="form-input"
                                v-bind:class="{ 'input-error': errors.has('name')}"
                        />
                        <p
                                v-show="errors.has('name')"
                                class="text-sm-left red--text msg-error"
                        >{{ errors.first('name') }}</p>

                        <input
                                v-model="email"
                                type="text"
                                placeholder="email"
                                class="form-input input-login"
                                :error-messages="errors.has('login')"
                                v-validate.disable="'required|email'"
                                data-vv-name="login"
                                v-bind:class="{ 'input-error': errors.has('login')}"
                        />
                        <p
                                v-show="errors.has('login')"
                                class="text-sm-left red--text msg-error"
                        >{{ errors.first('login') }}</p>

                        <input
                                v-model="password"
                                type="password"
                                placeholder="password"
                                class="form-input"
                                :error-messages="errors.has('password')"
                                v-validate.disable="'required|min:3'"
                                data-vv-name="password"
                                v-bind:class="{ 'input-error': errors.has('password')}"
                        />
                        <p
                                v-show="errors.has('password')"
                                class="text-sm-left red--text msg-error"
                        >{{ errors.first('password') }}</p>

                        <currency-select :id="'signup_currency_selection'"
                                         @change="currencyOnChange"></currency-select>


                        <v-divider></v-divider>

                        <button class="submit-button">Create account</button>
                        <v-progress-linear v-show="this.sending"
                                           :indeterminate="true"></v-progress-linear>
                        <p class="message">
                            Already registered?
                            <a href="#/login">Login</a>
                        </p>
                    </form>
                </div>
            </div>

        </div>
        <div class="col-xs-12 col-sm-3 col-lg-4"></div>
        <v-snackbar
                v-model="showAlert"
                :color="'error'"

        >
            {{ messageError }}
            <v-btn color="white" flat @click="showAlert = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>


<script>
    import ApiClass from "../api/api_laravel";
    import CurrencySelect from './TMComponents/CurrencySelect/CurencySelect';
    import Error422 from './../api/errors/Error422';
    import '@/style/auth.scss';

    const api = ApiClass();
    export default {
        name: "Signup",
        $_veeValidate: {
            validator: "new"
        },
        data() {
            return {
                name: "",
                email: "",
                password: "",
                currency: "",
                success: false,
                dialog: false,
                currencyList: ["RUB", "CZK", "EUR"],
                sending: false,
                showAlert: false,
                messageError: ''
            };
        },


        components: {
            'currency-select': CurrencySelect
        },

        beforeMount: function () {
            this.$store.state.title = "Signup";
        },

        mounted() {
            this.$validator.localize("en", this.dictionary);
        },

        methods: {
            currencyOnChange(currency) {
                this.currency = currency;
            },

            sendData() {

                this.$validator.validateAll().then(result => {
                    if (!result) {
                        this.sending = false;
                        return;
                    }

                    this.sending = true;

                    let userData = {
                        name: this.name,
                        login: this.email.toLowerCase(),
                        password: this.password,
                        currency: this.currency
                    };

                    let res = api.signup(userData)
                        .then(res => {
                            this.sending = false;
                            this.$router.push({path: 'login'});

                        })
                        .catch(err => {

                            this.sending = false;

                            if (err instanceof Error422) {
                                for (let error of err.errors) {

                                    this.errors.add({
                                        field: error.field,
                                        msg: error.message
                                    });


                                }
                            }
                            else {
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

                                this.$store.dispatch('showAppMsg', {
                                    type: 'error',
                                    messages: [`(${status}) ${errorText}`]
                                });

                            }


                        });
                });
            },
        }
    };
</script>