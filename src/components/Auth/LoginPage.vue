<template>
  <div class="">
    <form data-testid="login-form" @submit.prevent="onSubmit">
      <vs-dialog blur not-close v-model="active" prevent-close>
        <template #header>
          <h4 class="not-margin">
            Welcome back to <b>Personal finances</b>
          </h4>
        </template>

        <div class="con-form">
          <vs-input
            v-model="email"
            placeholder="Email"
            v-validate.disable="'required|email'"
            data-vv-name="login"
            :danger="errors.has('login')"
            data-testid="input-login"
          >
            <template #icon>
              <i class="fas fa-at"></i>
            </template>
            <template v-if="errors.has('login')" #message-danger>
              <p class="title-error" data-testid="input-login-err">{{ errors.first('login') }}</p>
            </template>
          </vs-input>
          <vs-input
            v-model="password"
            type="password"
            placeholder="Password"
            v-validate.disable="'required'"
            data-vv-name="password"
            data-testid="input-pass"
          >
            <template #icon>
              <i class="fas fa-lock"></i>
            </template>
            <template v-if="errors.has('password')" #message-danger>
              <p class="title-error" data-testid="input-pass-err">{{ errors.first('password') }} </p>
            </template>
          </vs-input>
        </div>

        <template #footer>
          <div class="footer-dialog">
            <vs-button type="submit" block :loading="sending === true">
              Sign In
            </vs-button>

            <div class="new">
              New Here? <router-link to="/register" class="text-blue"><small>Create new account</small></router-link>
            </div>
          </div>
        </template>
      </vs-dialog>
    </form>
  </div>
</template>

<script>
  import ApiClass from '../../api/api_laravel';
  import alert from '../Dialogs/Alert/Alert';
  const api = ApiClass();

  export default {
    name: 'login-page',
    data() {
      return {
        active: true,
        name: '',
        email: '',
        password: '',
        sending: false,
        ErrorMessage: '',
      };
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
        async onSubmit() {

            const result = await this.$validator.validateAll();

            if (!result) {
                return;
            }

            this.ErrorMessage = '';
            this.sending = true; //block the sending button;

            try {
              const res = await api.login(this.email, this.password);

              const { token, settings } = res;

              sessionStorage.setItem('jwt', token);
              this.$store.commit('setSettings', settings);
              this.$store.commit('storeAtLocal');
              this.$store.state.auth = true;
              if (typeof sessionStorage.getItem('jwt') === 'string') {
                this.$router.push({path: '/'});
              }
            }
            catch (err) {
              this.ErrorMessage =
                err.status === 401
                  ? 'Invalid login or password!'
                  : `Error. ${err.data.error}`;


              this.$vs.notification({
                clickClose: true,
                content: alert({
                  alertType: 'failure',
                  msgHeader: 'Auth error!',
                  msgBody: `${this.ErrorMessage}`
                }),
              });
            }
            finally {
              this.sending = false;
            }


        }
    }
  }
</script>

<style>
    .not-margin {
        margin: 0px;
        font-weight: normal;
        padding: 10px;
    }

    .con-form {
        width: 100%;
    }

    .con-form .flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .con-form .flex a {
        font-size: 0.8rem;
        opacity: 0.7;
    }

    .con-form .flex a:hover {
        opacity: 1;
    }

    .con-form .vs-checkbox-label {
        font-size: 0.8rem;
    }

    .con-form .vs-input-content {
        margin: 10px 0px;
        width: calc(100%);
    }

    .con-form .vs-input-content .vs-input {
        width: 100%;
    }

    .footer-dialog {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: calc(100%);
    }

    .footer-dialog .new {
        margin: 0px;
        margin-top: 20px;
        padding: 0px;
        font-size: 0.7rem;
    }

    .footer-dialog .new a {
        color: getColor('primary') !important;
        margin-left: 6px;
    }

    .footer-dialog .new a:hover {
        text-decoration: underline;
    }

    .footer-dialog .vs-button {
        margin: 0px;
    }
</style>