<template>
  <div>
    <v-layout justify-center>
      <v-flex xs12 sm10 md8 lg6>
        <v-card ref="form">
          <!-- <v-toolbar color="green darken-3" dark>
        
        <v-toolbar-title>Signup</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>account_box</v-icon>
        </v-btn>
      </v-toolbar> -->
          <v-divider class="mt-5"></v-divider>
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
            <v-btn
              :loading="sending"
              :disabled="sending"
              outline
              color="success"
              block
              flat
              @click="sendData"
              >Signup</v-btn
            >
          </v-card-actions>
          <div class="row pr-1">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
              <span class="grey--text pl-2">Already have account?</span>
              <a href="/#/login">Login</a>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
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
  </div>
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
.btn-signup {
  background-color: #ffa701;
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
