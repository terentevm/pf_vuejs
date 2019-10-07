<template>
    <v-container d-flex align-center align-content-center>
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
                                    <span class="login-subheader">Welcome back! Please login to your account.</span>
                                </div>
                            </div>

                            <form class="form" v-on:submit.prevent="sendData">
                                <v-alert
                                        :value="true"
                                        color="error"
                                        icon="warning"
                                        outline
                                        v-if="success === false"
                                >{{ ErrorMessage }}
                                </v-alert>


                                <input
                                        autofocus
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
                                <button type="submit">login</button>
                                <v-progress-linear v-show="this.sending"
                                                   :indeterminate="true"></v-progress-linear>
                                <p class="message">
                                    Not registered?
                                    <a href="#/signup">Create an account</a>
                                </p>

                            </form>
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
        name: "Login",
        $_veeValidate: {
            validator: "new"
        },
        data() {
            return {
                name: "",
                email: "",
                password: "",
                success: true,

                sending: false,
                showSnack: false,
                ErrorMessage: "",

                dictionary: {
                    attributes: {
                        email: "E-mail Address"
                        // custom attributes
                    },
                    custom: {
                        name: {
                            required: () => "Name can not be empty",
                            max: "The name field may not be greater than 10 characters"
                            // custom messages
                        }
                    }
                }
            };
        },

        computed: {
            btnLoginDisable() {
                const $ok = !(this.email !== "" && this.password !== "") || this.sending;
                return $ok;
            }
        },

        beforeMount: function () {
            this.$store.state.title = "Login";
            sessionStorage.removeItem("jwt");
            this.$store.state.auth = false;
        },
        mounted() {
            this.$validator.localize("en", this.dictionary);
        },
        methods: {
            sendData() {
                this.$validator.validateAll().then(result => {
                    if (!result) {
                        return;
                    }
                    this.success = true;
                    this.ErrorMessage = "";
                    this.sending = true; //block the sending button;

                    const userData = {
                        login: this.email,
                        password: this.password
                    };

                    let res = api
                        .login(this.email, this.password)
                        .then(res => {
                            this.sending = false;

                            sessionStorage.setItem("jwt", res.token);
                            this.$store.commit("setSettings", res.settings);
                            this.$store.commit("storeAtLocal");
                            this.$store.state.auth = true;
                            if (typeof sessionStorage.getItem("jwt") == "string") {
                                this.$router.push({path: "/"});
                            }
                        })
                        .catch(err => {
                            this.sending = false;
                            this.success = false;

                            if (err.status === 401) {
                                console.error(err);
                                this.ErrorMessage = 'Invalid login or password!';
                            }
                            else {
                                console.error(err);
                                this.ErrorMessage = `Error. ${err.data.error}`;
                            }

                        });
                });
            }
        }
    };
</script>

<style scoped>
    .login-header {
        font-size: 2em;
    }

    .login-subheader {
        font-size: 18px;
    }

    .error_text {
        color: red;
    }

    .formheader {
        text-align: center;
    }

    .question {
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

    @import url(https://fonts.googleapis.com/css?family=Roboto:300);

    .form {
        position: relative;
        z-index: 1;
        margin: 0 auto 100px;

        text-align: center;

    }

    .form-input {
        font-family: "Roboto", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 0 0 15px;
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

    .msg-error {
        margin-top: -5px;
    }
</style>
