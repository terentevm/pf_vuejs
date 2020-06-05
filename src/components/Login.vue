<template>
    <div class="row h-100 align-items-center">
        <div class="col-xs-12 col-sm-3 col-lg-4"></div>
        <div class="col-xs-12 col-sm-6 col-lg-4">
            <div class="mx-2 mx-sm-0 pt-5">
                <div class="mb-4">
                    <div class="mt-3 grey--text text-xs-center font-weight-light mt-2">
                        <span class="login-subheader">Welcome back! Please login to your account.</span>
                    </div>
                </div>

                <form class="form" @submit.prevent="sendData">
                    <v-alert
                        v-if="success === false"
                        :value="true"
                        color="error"
                        icon="warning"
                        outline
                    >
                        {{ ErrorMessage }}
                    </v-alert>

                    <input
                        v-model="email"
                        v-validate.disable="'required|email'"
                        autofocus
                        type="text"
                        placeholder="email"
                        class="form-input input-login"
                        :error-messages="errors.has('login')"
                        data-vv-name="login"
                        :class="{ 'input-error': errors.has('login') }"
                    />
                    <p v-show="errors.has('login')" class="text-sm-left red--text msg-error">
                        {{ errors.first('login') }}
                    </p>
                    <input
                        v-model="password"
                        v-validate.disable="'required|min:3'"
                        type="password"
                        placeholder="password"
                        class="form-input"
                        :error-messages="errors.has('password')"
                        data-vv-name="password"
                        :class="{ 'input-error': errors.has('password') }"
                    >
                    <p v-show="errors.has('password')" class="text-sm-left red--text msg-error">
                        {{ errors.first('password') }}
                    </p>

                    <button type="submit" class="submit-button">
                        login
                    </button>
                    <vs-button
                        block
                        color="success"
                    >
                        Test
                    </vs-button>
                    <v-progress-linear v-show="sending" :indeterminate="true"></v-progress-linear>
                    <p class="message">
                        Not registered?
                        <a href="#/signup">Create an account</a>
                    </p>
                </form>
            </div>
        </div>
        <div class="col-xs-12 col-sm-3 col-lg-4"></div>
    </div>
</template>

<script>
import VAlert from 'vuetify/lib/components/VAlert';
import ApiClass from '../api/api_laravel';
import '@/style/auth.scss';

const api = ApiClass();

export default {
    name: 'Login',
    components: {
        VAlert
    },
    data() {
        return {
            name: '',
            email: '',
            password: '',
            success: true,
            sending: false,
            showSnack: false,
            ErrorMessage: '',

            dictionary: {
                attributes: {
                    email: 'E-mail Address'
                },
                custom: {
                    name: {
                        required: () => 'Name can not be empty',
                        max: 'The name field may not be greater than 10 characters'
                        // custom messages
                    }
                }
            }
        };
    },
    computed: {
        btnLoginDisable() {
            return !(this.email !== '' && this.password !== '') || this.sending;
        }
    },

    beforeMount: function() {
        this.$store.state.title = 'Login';
        sessionStorage.removeItem('jwt');
        this.$store.state.auth = false;
    },
    mounted() {
        this.$validator.localize('en', this.dictionary);
    },
    methods: {
        sendData() {
          console.dir(this.$vs);
          this.$validator.validateAll().then(result => {
                if (!result) {
                    return;
                }
                this.success = true;
                this.ErrorMessage = '';
                this.sending = true; //block the sending button;

                api.login(this.email, this.password)
                    .then(res => {
                        this.sending = false;

                        sessionStorage.setItem('jwt', res.token);
                        this.$store.commit('setSettings', res.settings);
                        this.$store.commit('storeAtLocal');
                        this.$store.state.auth = true;
                        if (typeof sessionStorage.getItem('jwt') == 'string') {
                            this.$router.push({ path: '/' });
                        }
                    })
                    .catch(err => {
                        this.sending = false;
                        this.success = false;

                        if (err.status === 401) {
                            console.error(err);
                            this.ErrorMessage = 'Invalid login or password!';
                        } else {
                            console.error(err);
                            this.ErrorMessage = `Error. ${err.data.error}`;
                        }
                    });
            });
        }
    }
};
</script>
