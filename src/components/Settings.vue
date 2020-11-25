<template>
  <div class="row mx-0">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="row d-block  px-2">
        <div class="form-group">
          <label for="settings_currency_el" class="tm-label">Currency (read only):</label>

          <tm-select
            id="settings_currency_el"
            v-model="currency"
            :options="currencies"
            :title="'name'"
            :clearable="true"
            :select-btn="true"
            :placeholder="'Select main wallet'"
            :read-only="true"
          />
        </div>
      </div>

      <div class="row d-block px-2">
        <div class="form-group">
          <label for="settings_main_wallet_el" class="tm-label">Default wallet<span
            v-show="isDirty('wallet')"> *</span>:</label>

          <tm-select
            id="settings_main_wallet_el"
            v-model="wallet"
            :options="wallets"
            :title="'name'"
            :clearable="true"
            :select-btn="true"
            :placeholder="'Select main wallet'"
            @open="openWalletSelectForm"
          />
        </div>
      </div>

      <div class="row d-block  px-2">
        <div class="form-group">
          <label for="settings_rep_currency_el" class="tm-label">Currency of dashboard<span
            v-show="isDirty('currencyReports')"> *</span>:</label>
          <tm-select
            id="settings_rep_currency_el"
            v-model="currencyReports"
            :options="currencies"
            :title="'name'"
            :clearable="true"
            :select-btn="false"
            :placeholder="'Select currency for reports'"
          />
        </div>
      </div>
    </div>

    <tm-wallets-select-form
      :items="wallets"
      :show-wallet-selection="showWalletSelection"
      @select-wallets-close="completeWalletSelectionHandler"
    />
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="row d-block px-2 mt-0">
        <div class="form-group">
          <label for="settings_dash_period_el" class="tm-label">Periodicity:</label>
          <tm-select
            id="settings_dash_period_el"
            v-model="periodicity"
            :options="periodOptions"
            :title="'period'"
            :clearable="true"
            :select-btn="false"
            :placeholder="'Set periodicity for the app dashboard'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Alert from './Dialogs/Alert/Alert.js';

  export default {
    data: () => ({
      formModified: false,
      showWalletSelection: false,
      processing: false,

      dirtyElements: []
    }),

    computed: {
      ...mapState({
        currencies: state => state.currencies.all,
        wallets: state => state.wallets.all,
        currency: state => state.settings.currency,
      }),

      currencyReports: {
        get() {
          return this.$store.state.settings.reportcurrency;
        }
        ,
        set(currency) {

          this.formModified = true;

          if (!this.dirtyElements.includes('currencyReports')) {
            this.dirtyElements.push('currencyReports');
          }

          this.$store.commit('setCurrencyReports', currency);
        }
      },
      wallet: {
        get() {
          return this.$store.state.settings.wallet;
        },
        set(wallet) {
          this.formModified = true;
          if (!this.dirtyElements.includes('wallet')) {
            this.dirtyElements.push('wallet');
          }
          this.$store.commit('setWallet', wallet);
        }
      },
      periodicity: {
        get() {
          return this.$store.state.settings.periodicity;
        },
        set(periodicity) {
          this.$store.commit('setPeriodicity', periodicity);
        }
      },

      periodOptions: {
        get() {
          return this.$store.state.settings.periodOptions;
        }
      }

    },

    beforeMount() {
      this.$store.commit('setupToolbarMenu', []);
      this.$store.commit('setupToolbarMenu', this.getUpMenu());
      this.$store.state.title = 'Settings';

      this.$store.dispatch('getAllWallets');
      this.$store.dispatch('getAllCurrencies');
      this.$store.dispatch('getSettingsFromApi');
    },

    methods: {
      getUpMenu() {
        return {
          mainAction: {
            title: 'Store',
            icon: 'fas fa-check-double',
            action: async () => {
              this.storeChanges();
            },
          },
          menu: [
            {
              title: 'Update',
              icon: 'fas fa-sync',
              action: async () => {
                this.updateFormData();
              },
            }
          ]
        };
      },

      async updateFormData() {
        this.$store.dispatch('getSettingsFromApi');
      },

      async storeChanges() {

        let success = true;
        let msg = 'Settings has been stored successfully!';

        await this.$store.dispatch('startPending');

        try {
          await this.$store.dispatch('storeSettings');
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
        this.$store.dispatch('finishPending');


        this.$vs.notification({
          sticky: true,
          progress: 'auto',
          color: success === true ? 'success' : 'danger',
          position: 'top-center',
          title: 'Store status',
          text: msg
        });


      },
      openWalletSelectForm() {
        this.showWalletSelection = true;
      },

      completeWalletSelectionHandler(wallet) {
        if (wallet instanceof Object) {
          this.formModified = true;
          this.$store.commit('setWallet', wallet);

        }

        this.showWalletSelection = false;
      },

      isDirty(elemName) {
        return this.dirtyElements.includes(elemName);
      },
    }
  };
</script>
<style>
  .input-select-wrapper {
    display: flex;
    flex-basis: 400px;
    width: 100%;
    flex-grow: 1;
  }
</style>