<template>
  <div class="h-100">
    <card class="h-100" :header-classes="headerClasses" :footer-classes="footerClasses">
      <div slot="header" class="row align-items-center">
        <div class="col">
          <h4 class="text-default text-uppercase ls-1 mb-1">Item: {{ title }}</h4>
        </div>
        <v-progress-linear
          v-if="processing"
          buffer-value="0"
          color="#4193F2"
          indeterminate
          rounded
        />
      </div>
      <label for="wallet_title">Title</label>
      <base-input
        id="wallet_title"
        tabindex="1"
        placeholder="Title"
        v-model="formData.name"
        class="text-default"
      />
      <div class="form-group">
        <label for="wallet_currency">Currency</label>
        <tm-select
          id="wallet_currency"
          v-model="formData.currency"
          :options="currencies"
          :title="'name'"
          :clearable="true"
          :select-btn="false"
          :placeholder="'Select currency'"
          :read-only="formData.block_currency === true"
        />
      </div>

      <div class="form-group">
        <base-checkbox
          v-model="formData.is_creditcard"
          :checked="formData.is_creditcard"
        >Is credit card</base-checkbox>
      </div>

      <div v-if="formData.is_creditcard" class="row">
        <div class="col">
          <div class="form-group">
            <label for="w_cred_lim">Limit</label>
            <base-input
              id="w_cred_lim"
              v-model.number="formData.credit_limit"
              type="number"
              placeholder="Credit limit"
            />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="w_grace">Grace period</label>
            <base-input
              id="w_grace"
              v-model.number="formData.grace_period"
              type="number"
              placeholder="Crace period"
            />
          </div>
        </div>
      </div>

      <div class="row mx-0">
        <strong>Balance: {{ formData.balance }}</strong>
      </div>
      <div slot="footer" class="row align-items-center">
        <div class="col">
        </div>
        <base-button type="secondary" @click="close">
          Cancel
        </base-button>
        <base-button type="success" @click="store()">
          Store
        </base-button>
      </div>
    </card>
  </div>
</template>

<script>
  import Card from '../../argon/src/components/Card';
  import BaseInput from '../../argon/src/components/BaseInput';
  import BaseButton from '../../argon/src/components/BaseButton';
  import VProgressLinear from 'vuetify/lib/components/VProgressLinear';
  import TMSelect from '../TMComponents/TMSelect/TMSelect';
  import BaseCheckbox from '../../argon/src/components/BaseCheckbox';
  import alert from '../Dialogs/Alert/Alert';
  import {mapGetters} from 'vuex';

  export default {
    name: 'WalletElement',

    components: {
      Card,
      BaseInput,
      VProgressLinear,
      'tm-select': TMSelect,
      BaseCheckbox,
      BaseButton
    },
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
        currency: '',
        is_creditcard: false,
        grace_period: 0,
        credit_limit: 0,
        balance: 0,
        newBalance: 0,
      },
      processing: false,
      headerClasses: ['bg-transparent py-1'],
      footerClasses: ['py-1']
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
        this.$emit('close');
      },

      async store() {

        this.formData.currency_id = this.formData.currency.id

        this.processing = true;

        let success = true;
        let msg = `Item ${this.formData.name} has been stored successfully!`;

        try {
          await this.$store.dispatch('storeWallet', this.formData);
        }
        catch (err) {

          success = false;

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

          msg = `(${status}) ${errorText}`;
        }
        finally {
          this.processing = false;
        }

        this.$vs.notification({
          clickClose: true,
          content: alert({
            alertType: success === true ? 'success' : 'failure',
            msgHeader: 'Result!',
            msgBody: `${msg}`
          }),
        });

        if (success === true) {
          this.$emit('close', true);
        }

      }

    },
  };
</script>

<style scoped></style>
