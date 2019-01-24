<template>
  <v-container grid-list-xl>
    <v-layout row ml-1>
      <v-flex xs12 sm12 md12 lg12>
        <h3 class="headline font-weight-regular">Program settings</h3>
      </v-flex>
    </v-layout>
    <v-layout row ml-1>
      <v-flex xs12 sm12 md6 lg6>
        <form>
          <v-select
            :value="currency"
            :items="currencies"
            label="System currency"
            disabled
            item-text="name"
            item-value="id"
            return-object
          ></v-select>
          <v-select
            :value="wallet"
            :items="wallets"
            label="Wallet"
            @change="changeWallet"
            clearable
            item-text="name"
            item-value="id"
            return-object
          ></v-select>
          <v-select
            :value="currencyReports"
            :items="currencies"
            label="Currency for reports"
            @change="changeCurrencyReport"
            clearable
            item-text="name"
            item-value="id"
            return-object
          ></v-select>
        </form>
      </v-flex>
    </v-layout>

    <v-layout row ml-1>
      <v-flex xs12 sm12 md6 lg6>
        <v-btn block color="success" dark :disabled="!formModified" @click="saveChanges"
          >Save</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout row ml-1>
      <v-flex xs12 sm12 md6 lg6>
        <v-alert v-model="showMessage" dismissible :type="messageType">
          {{ message }}
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';

export default {
  data: () => ({
    formModified: false,
    mutatedData: {
      currency: {
        mutated: false,
        value: null,
      },
      wallet: {
        mutated: false,
        value: null,
      },
      currencyReports: {
        mutated: false,
        value: null,
      },
    },
  }),

  computed: {
    ...mapState({
      currencies: state => state.currencies.all,
      wallets: state => state.wallets.all,
      wallet: state => state.settings.wallet,
      currency: state => state.settings.currency,
      currencyReports: state => state.settings.currencyReports,
      showMessage: state => state.settings.showMessage,
      message: state => state.settings.message,
      messageType: state => state.settings.messageType,
    }),
  },

  beforeMount() {
    this.$store.state.title = 'Settings';
    this.$store.dispatch('getAllWallets');
    this.$store.dispatch('getAllCurrencies');
    this.$store.dispatch('getSettings');
  },

  methods: {
    changeWallet(newValue) {
      this.registerMutation('wallet', newValue);
    },

    changeCurrencyReport(newValue) {
      this.registerMutation('currencyReports', newValue);
    },

    registerMutation(field, newValue) {
      this.formModified = true;
      this.mutatedData[field].mutated = true;
      this.mutatedData[field].value = newValue === undefined ? null : newValue;
    },

    saveChanges(e) {
      if (!this.formModified) {
        return;
      }

      const formData = {
        currency: this.currency,
        wallet: this.wallet,
        currencyReports: this.currencyReports,
      };

      if (this.mutatedData.wallet.mutated) {
        formData.wallet = this.mutatedData.wallet.value;
      }

      if (this.mutatedData.currencyReports.mutated) {
        formData.currencyReports = this.mutatedData.currencyReports.value;
      }

      this.$store.commit('saveSettings', formData);
    },
  },
};
</script>
