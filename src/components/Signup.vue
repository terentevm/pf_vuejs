<template>

    <v-container d-flex align-center align-content-center>
      <v-flex xs12 sm6 offset-sm-3 md6 offset-md-3 lg6 offset-lg-3 xl6 offset-xl-3>
        <div>
          <div class="mb-4">
              <div class=" font-weight-regular appColor--text text-xs-center"><span class="login-header">PERSONAL FINANSES</span></div>
              <div class="mt-3 grey--text text-xs-center font-weight-light mt-2"><span class="login-subheader">Please complete to create your account.</span></div>
          </div>

          <v-card-text>
            <v-text-field
              label="Name"
              placeholder="Ivan Ivanov"
              v-model="name"
              prepend-icon="face"
              required
              :error-messages="errors.collect('name')"
              v-validate="'required|min:2'"
              data-vv-name="name"
              data-vv-validate-on="change"
            ></v-text-field>
            <v-text-field
              label="E-mail"
              placeholder="example@mail.com"
              v-model="email"
              prepend-icon="email"
              required
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
              :type="e3 ? 'password' : 'text'"
              required
              :error-messages="errors.collect('password')"
              v-validate="'required|min:3'"
              data-vv-name="password"
              data-vv-validate-on="change"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-container fluid grid-list-md>
              <v-layout row wrap>
                <v-flex xs2 sm4 lg4 xl4></v-flex>
                <v-flex xs8 sm4 lg4 xl4>
                  <v-btn
                    :loading="sending"
                    :disabled="sending"
                    color="appColor"
                    dark
                    block
                    @click="sendData"
                    >Signup</v-btn
                  >
                </v-flex>
                <v-flex xs2 sm4 lg4 xl4></v-flex>
              </v-layout>
              
              <v-layout row wrap d-flex justify-center>
                
                <v-flex xs2 sm2 lg2 xl2></v-flex>
                <v-flex xs8 sm8 lg8 xl8>
                <div class="link-login mt-2">
                  <span><a class="appColor--text" href="/#/login">Already have account? Login</a></span>
                </div>
                </v-flex>
                <v-flex xs2 sm2 lg2 xl2></v-flex>
              </v-layout>
            </v-container>
          </v-card-actions>

        </div>
      </v-flex>
          <v-snackbar
      :timeout="msgSettings.timeout"
      :color="msgSettings.color"
      :multi-line="msgSettings.mode === 'multi-line'"
      :vertical="msgSettings.mode === 'vertical'"
      v-model="msgSettings.show"
    >
      {{ msgSettings.msg }}
      <v-btn dark flat @click.native="msgSettings.show = false">Close</v-btn>
    </v-snackbar>
    </v-container>

 
</template>

<script>
import ModelClass from './Model';
const Model = new ModelClass();

export default {
  name: 'Signup',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      success: false,

      sending: false,
      showSnack: false,
      resultMessage: '',
      e3: true,
      msgSettings: {
        show: false,
        color: 'light-green darken-3',
        mode: 'vertical',
        timeout: 6000,
        msg: '',
      },
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
  beforeMount: function() {
    this.$store.state.title = 'Signup';
  },

  mounted() {
    this.$validator.localize('en', this.dictionary);
  },

  methods: {
    sendData() {
      this.sending = true; //block the sending button;

      this.$validator.validateAll().then(result => {
        if (!result) {
          this.sending = false;
          return;
        }

        let userData = {
          name: this.name,
          login: this.email,
          password: this.password,
        };

        this.showSnack = false;

        Model.signUp(userData)
          .then(response => {
            this.$router.push({ path: 'login' });
          })
          .catch(e => {
            let msg = this.getErrorMsg(e);
            this.sending = false;
            this.msgSettings.color = 'orange darken-4';
            this.msgSettings.msg = msg;
            this.msgSettings.show = true;
          });
      });
    },

    getErrorMsg(e) {
      let res = e.response.data;

      if (res.code == -1) {
        return 'Server error. Please try again';
      } else if (res.code == 2) {
        return 'Inputed data is invalid!';
      } else if (res.code == 3) {
        return `User with e-mail ${this.email} is exists!`;
      }
    },
  },
};
</script>

<style scoped>
.login-header {
  font-size: 36px;
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
</style>
