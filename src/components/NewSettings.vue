<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step step="1" :complete="e1 > 1">Load currencies</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="e1 > 2">Wallet</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" :complete="e1 > 3">Defaults</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card color="grey lighten-1" class="mb-5">
          <v-flex xs12 sm12 md12 lg12>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="classificator"
              select-all
              class="elevation-1"
              item-key="short_name"
            >
              <template slot="headers" slot-scope="props">
                <tr>
                  <th>
                    <v-checkbox
                      primary
                      hide-details
                      @click.native="toggleAll"
                      :input-value="props.all"
                      :indeterminate="props.indeterminate"
                    ></v-checkbox>
                  </th>
                  <th
                    v-for="header in props.headers"
                    :key="header.text"
                    :class="[
                      'column sortable',
                      pagination.descending ? 'desc' : 'asc',
                      header.value === pagination.sortBy ? 'active' : '',
                    ]"
                    @click="changeSort(header.value)"
                  >
                    <v-icon small>arrow_upward</v-icon>
                    {{ header.text }}
                  </th>
                </tr>
              </template>

              <template slot="items" slot-scope="props">
                <tr :active="props.selected" @click="props.selected = !props.selected">
                  <td>
                    <v-checkbox primary hide-details :input-value="props.selected"></v-checkbox>
                  </td>

                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-center">{{ props.item.short_name }}</td>
                  <td class="text-xs-center hidden-md-and-down">{{ props.item.code }}</td>
                  <td class="text-xs-center hidden-md-and-down">{{ props.item.mult }}</td>
                </tr>
              </template>
              <template slot="no-data">
                <div class="progress">
                  <v-progress-circular
                    indeterminate
                    :size="70"
                    :width="2"
                    color="green"
                  ></v-progress-circular>
                </div>
              </template>
            </v-data-table>
          </v-flex>
        </v-card>
        <v-alert v-if="showAlert" :value="true" color="error" icon="warning">
          {{ msgAlert }}
        </v-alert>
        <v-btn v-show="!sending" color="primary" @click="saveCurrencies" :disabled="currensySaved"
          >Save</v-btn
        >
        <v-progress-circular
          v-show="sending"
          indeterminate
          :size="50"
          color="primary"
        ></v-progress-circular>
        <v-btn color="primary" @click="moveTo2()">Continue</v-btn>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card>
          <v-card-title primary-title>
            <div>
              <div class="headline">Create your first wallet!</div>
            </div>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 d-none>
                  <v-text-field label="id" v-model="editedItem.id"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Name" v-model="editedItem.name"></v-text-field>
                </v-flex>

                <v-flex xs12 sm12 md12>
                  <v-select
                    :items="currencies"
                    v-model="editedItem.Currency"
                    auto
                    label="Currency"
                    single-line
                    item-text="name"
                    item-value="id"
                    return-object
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm4 md4>
                  <v-checkbox
                    :label="`Is credit card`"
                    v-model="editedItem.is_creditcard"
                    true-value="1"
                    false-value="0"
                  ></v-checkbox>
                </v-flex>

                <v-flex xs12 sm4 md4>
                  <v-text-field
                    label="Credit limit"
                    v-model="editedItem.credit_limit"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm4 md4>
                  <v-text-field
                    label="Grace period"
                    v-model="editedItem.grace_period"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="sending" color="success" block @click.native="saveWallet()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-layout align-center>
          <v-btn color="primary" @click.native="e1 = 1">Back</v-btn>

          <v-spacer></v-spacer>
          <v-btn color="primary" @click="moveTo3()">Next</v-btn>
        </v-layout>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card>
          <v-card-title>
            <div class="headline">Set dafaults values!</div>
          </v-card-title>

          <v-select
            :items="currencies"
            v-model="defaults.Currency"
            auto
            class="input-group--focused"
            label="System currency"
            multi-line
            item-text="name"
            item-value="id"
            return-object
          ></v-select>

          <v-select
            :items="wallets"
            v-model="defaults.Wallet"
            auto
            class="input-group--focused"
            label="Main wallet"
            multi-line
            item-text="name"
            item-value="id"
            return-object
          ></v-select>

          <v-alert v-if="showAlert" :value="true" color="error" icon="warning">
            {{ msgAlert }}
          </v-alert>
          <v-card-actions>
            <v-btn :disabled="sending" color="success" block @click="saveSettings()"
              >Complete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ModelClass from './Model';
const Model = new ModelClass();

export default {
  data() {
    return {
      e1: 0,
      pagination: {
        sortBy: 'name',
      },
      classificator: [],
      selected: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Char code', value: 'short_name' },
        { text: 'Number code', value: 'code', class: 'hidden-md-and-down' },
        { text: 'Multiplicator', value: 'mult', class: 'hidden-md-and-down' },
      ],
      editedItem: {
        id: null,
        name: '',
        currency_id: '',
        is_creditcard: false,
        grace_period: 0,
        credit_limit: 0,
      },
      defaults: {
        currency_id: '',
        wallet_id: '',
        Wallet: null,
        Currency: null,
      },
      currencies: [],
      wallets: [],
      curr: null,
      showAlert: false,
      msgAlert: '',
      sending: false,
      currensySaved: false,
      walletSaved: false,
    };
  },

  created() {
    const cl = Model.getCurrClassificator().then(result => {
      console.log(result);
      this.classificator = result;
    });
  },
  methods: {
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.items.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    saveCurrencies() {
      if (this.selected.length == 0) {
        this.msgAlert = 'Выберите хотя бы одну валюту!';
        this.showAlert = true;
        return;
      }
      this.showAlert = false;
      this.sending = true;
      this.sendData();
    },

    async sendData() {
      for (let item of this.selected) {
        console.log(item);
        await Model.saveCurrency(item, false);
      }
      this.sending = false;
      this.currensySaved = true;
    },

    moveTo2() {
      this.e1 = 2;
      Model.getCurrencies(0).then(data => {
        this.currencies = data;
      });
    },

    saveWallet() {
      this.sending = true;
      this.editedItem.currency_id = this.editedItem.Currency.id;
      Model.saveWallet(this.editedItem, false).then(() => {
        this.sending = false;
        this.walletSaved = true;
        this.moveTo3();
      });
    },

    moveTo3() {
      this.e1 = 3;
      Model.getWallets(0).then(data => {
        this.wallets = data;
      });
    },
    saveSettings() {
      if (this.defaults.Currency == null) {
        this.msgAlert = 'Choose system currency!';
        this.showAlert = true;
        return;
      }
      this.showAlert = false;
      this.sending = true;
      this.defaults.currency_id = this.defaults.Currency.id;
      this.defaults.wallet_id = this.defaults.Wallet.id;

      Model.saveSettings(this.defaults, false)
        .then(() => {
          this.sending = false;

          this.$router.push({ path: 'index' });
        })
        .catch(e => {
          this.msgAlert = 'Error. Try again!';
          this.showAlert = true;
          this.sending = false;
        });
    },
  },
};
</script>

<style scoped>
.progress {
  text-align: center;
  margin: 1rem;
}
</style>
