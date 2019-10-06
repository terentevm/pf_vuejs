<template>
    <v-container d-flex align-center align-content-center class="appColor">
        <v-layout row>
            <v-flex xs12 sm3 md4 lg4 xl4></v-flex>
            <v-flex xs12 sm6 md4 lg4 xl4>
                <div>
                    <div>
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
                                <v-select
                                        v-model="currency"
                                        :items="currencyList"
                                        placeholder="Choose currency"
                                        menu-props="auto"
                                        label="Select"
                                        background-color="#f2f2f2"
                                        hide-details
                                        single-line
                                        outline
                                        color="#f2f2f2"
                                        class="currency-select"

                                        v-validate.disable="'required'"
                                        data-vv-name="currency"
                                ></v-select>
                                <p
                                        v-show="errors.has('currency')"
                                        class="text-sm-left red--text msg-error"
                                >{{ errors.first('currency') }}</p>
                                <v-divider></v-divider>
                                <button>Create account</button>
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
            </v-flex>
            <v-flex xs12 sm3 md4 lg4 xl4></v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import ApiClass from "../api/api_laravel";

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

            };
        },
        beforeMount: function () {
            this.$store.state.title = "Signup";
        },

        mounted() {
            this.$validator.localize("en", this.dictionary);
        },

        methods: {
            sendData() {

                this.$validator.validateAll().then(result => {
                    if (!result) {
                        this.sending = false;
                        return;
                    }

                    this.sending = true;

                    let userData = {
                        name: this.name,
                        login: this.email,
                        password: this.password,
                        currency: this.currency
                    };

                    let res = api.signup(userData)
                        .then(res => {
                            console.log('ok');
                            this.$router.push({path: 'login'});

                        })
                        .catch(err => {

                            if (err.errors instanceof Object) {

                                for (let field in err.errors) {

                                    this.errors.add({
                                        field: field,
                                        msg: err.errors[field][0]
                                    });


                                }
                            }

                            this.sending = false;

                        });
                });
            },
        }
    };
</script>

<style scoped>
    body, html {
        background-color: #43425D;
    }

    .login-header {
        font-size: 2em;
    }

    .login-subheader {
        font-size: 18px;
    }

    .btn-signup {
        background-color: #ffa701;
    }

    .link-login {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .formheader {
        text-align: center;
    }

    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }

    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }


    .form {
        position: relative;
        z-index: 1;
        /* background-color:hsla(0,0%,100%,0.1); */

        max-width: 480px;
        margin: 0 auto 100px;

        text-align: center;
        /* box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24); */
    }

    .form-input {
        font-family: "Roboto", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 0 0 10px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .input-login {
        text-transform: lowercase;
    }

    .input-error {
        border: 2px solid red;
    }

    .msg-error {
        margin-top: -5px;
    }

    .form button {
        font-family: "Roboto", sans-serif;
        text-transform: uppercase;
        outline: 0;
        background: #4caf50;
        width: 100%;
        border: 0;
        padding: 15px;
        color: #ffffff;
        font-size: 14px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
        margin-top: 30px;
    }

    .form button:hover,
    .form button:active,
    .form button:focus {
        background: #43a047;
    }

    .form .message {
        margin: 15px 0 0;
        color: #b3b3b3;
        font-size: 12px;
    }

    .form .message a {
        color: #4caf50;
        text-decoration: none;
    }

    .form .register-form {
        display: none;
    }

    .form button:hover,
    .form button:active,
    .form button:focus {
        background: #43a047;
    }

    .currency-select {
        background: #f2f2f2;
        margin-bottom: 15px;
    }
</style>
