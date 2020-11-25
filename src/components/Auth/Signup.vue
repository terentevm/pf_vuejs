<template>
  <div class="">
    <form data-testid="signup-form" @submit.prevent="onSubmit">
      <vs-dialog blur not-close v-model="active" prevent-close>
        <template #header>
          <h4 class="not-margin">
            Welcome to <b>Personal finances</b>
          </h4>
        </template>

        <div class="con-form">
          <vs-input
            v-model="name"
            placeholder="Your name"
            v-validate.disable="'required'"
            data-vv-name="name"
            :danger="errors.has('name')"
            data-testid="input-name"
          >
            <template #icon>
              <i class='far fa-user'></i>
            </template>
            <template v-if="errors.has('name')" #message-danger>
              <p class="title-error" data-testid="input-name-err">{{ errors.first('name') }}</p>
            </template>
          </vs-input>
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
          <div class="signup-currency-select">
            <currency-select
              :id="'signup_currency_selection'"
              @change="currencyOnChange"
            />
          </div>
        </div>

        <template #footer>
          <div class="footer-dialog">
            <vs-button type="submit" block :loading="sending === true">
              Create user
            </vs-button>

            <div class="new">
              Already registered? <router-link to="/login" class="text-blue"><small>Login</small></router-link>
            </div>
          </div>
        </template>
      </vs-dialog>
    </form>
  </div>
</template>

<script>
  import ApiClass from '../../api/api_laravel';
  import CurrencySelect from '../TMComponents/CurrencySelect/CurencySelect';
  import Error422 from '../../api/errors/Error422';
  import alert from '../Dialogs/Alert/Alert';
  const api = ApiClass();
  export default {
    name: 'Signup',
    $_veeValidate: {
      validator: 'new'
    },


    components: {
      'currency-select': CurrencySelect
    },
    data() {
      return {
        active: true,
        name: '',
        email: '',
        password: '',
        currency: '',
        currencyList: ['RUB', 'CZK', 'EUR'],
        sending: false,
      };
    },

    beforeMount: function () {
      this.$store.state.title = 'Signup';
    },

    mounted() {
      this.$validator.localize('en', this.dictionary);
    },

    methods: {
      currencyOnChange(currency) {
        this.currency = currency;
      },

      async onSubmit() {

        const validated = await this.$validator.validateAll();

        if (!validated) {
          return;
        }

        this.sending = true;

        try {
          await api.signup({
            name: this.name.trim(),
            login: this.email.trim().toLowerCase(),
            password: this.password,
            currency: this.currency
          });

          this.showSuccessMsg();

          setTimeout(()=>{
            this.$router.push({path: 'login'});
          }, 1500)

        } catch (err) {

          let title = !err.status ? 'Connection error' : `Error ${err.status}`;
          let msg = err instanceof Error422 ? err.getDescription() : err.data.error;

          this.$vs.notification({
            clickClose: true,
            content: alert({
              alertType: 'failure',
              msgHeader: title,
              msgBody: msg
            }),
          });
        }
        finally {
          this.sending = false;
        }

      },
      showSuccessMsg() {
        this.$vs.notification({
          clickClose: true,
          content: alert({
            alertType: 'success',
            msgHeader: 'User created',
            msgBody: `User ${this.name} has been created successfully!`
          }),
        });
      }
    }
  };
</script>
<style>
  .signup-currency-select {
    position: relative;
    z-index: 1000;
  }

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