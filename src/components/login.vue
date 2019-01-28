<template>

    <v-container d-flex align-center align-content-center>
      <v-flex xs12 sm6 offset-sm-3 md6 offset-md-3 lg6 offset-lg-3 xl6 offset-xl-3>
        <div>
              <div class="mb-4">
                <div class=" font-weight-regular appColor--text text-xs-center"><span class="login-header">PERSONAL FINANSES</span></div>
                <div class="mt-3 grey--text text-xs-center font-weight-light mt-2"><span class="login-subheader">Welcome back! Please login to your account.</span></div>
              </div>
           
        <v-form v-on:submit.prevent="sendData" class="mt-3">

            <v-card-text>
              <v-text-field
                label="E-mail"
                placeholder="example@mail.com"
                v-model="email"
                prepend-icon="email"
                :error-messages="errors.collect('email')"
                v-validate="'required|email'"
                data-vv-name="email"
                data-vv-validate-on="change"
              ></v-text-field>
              <v-text-field
                label="password"
                v-model="password"
                prepend-icon="https"
                :append-icon="e3 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e3 = !e3)"
                :error-messages="errors.collect('password')"
                v-validate="'required|min:3'"
                data-vv-name="password"
                data-vv-validate-on="change"
                :type="e3 ? 'password' : 'text'"
                required
              ></v-text-field>
              <span v-if="success === false" class="body-2 error_text"
                >Login or password are incorrect!</span
              >
            </v-card-text>

            <v-card-actions>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                  <v-flex d-flex xs12 sm6 md6>
                    <v-btn
                      type="submit"
                      color="appColor"
                      block
                      dark
                      :loading="sending"
                      
                      v-on:click.stop.prevent="sendData"
                      >Login</v-btn
                    >
                  </v-flex>
                  <v-flex d-flex xs12 sm6 md6>
                    <v-btn outline color="appColor " block to="/signup">Sign up</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-actions>
          
        </v-form>
        </div>
      </v-flex>
    </v-container>

</template>

<script>

const touchMap = new WeakMap();

import ApiClass from './Api';
const Api = new ApiClass();

export default {
  name: 'Login',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      success: true,

      sending: false,
      showSnack: false,
      resultMessage: '',
      e3: true,

      dictionary: {
        attributes: {
          email: 'E-mail Address',
          // custom attributes
        },
        custom: {
          name: {
            required: () => 'Name can not be empty',
            max: 'The name field may not be greater than 10 characters',
            // custom messages
          },
        },
      },
    };
  },

  computed: {
    btnLoginDisable() {
      const $ok = !(this.email !== '' && this.password !== '') || this.sending;
      return $ok;
    },
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
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }

        this.sending = true; //block the sending button;

        const userData = {
          login: this.email,
          password: this.password,
        };

        const param = {
          model: 'user',
          action: 'login',
          data: userData,
        };

        this.showSnack = false;

        Api.post(param)
          .then(respData => {
            if (respData.success === true) {
              sessionStorage.setItem('jwt', respData.data.jwt);

              this.$store.commit('setSettings', respData.data.settings);
              this.$store.commit('storeAtLocal');

              this.$store.state.auth = true;

              if (typeof sessionStorage.getItem('jwt') == 'string') {
                this.$router.push({ path: 'index' });
              }
            } else {
              this.resultMessage = 'Error. Login or password is incorrect!';
              this.showSnack = true;
              this.success = false;
              this.sending = false;
            }
          })
          .catch(error => {
            this.resultMessage = 'Error. Login or password is incorrect!';
            this.showSnack = true;
            this.success = false;
            this.sending = false;
          });
      });
    },
  },
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
</style>
