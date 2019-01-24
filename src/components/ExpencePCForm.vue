<template>
  <v-flex xs12 sm12 md12 lg12>
    <tm-form-action-panel
      v-bind:processing="this.processing"
      v-on:tm-save-form="save"
      v-on:tm-cancel-form="cancel"
    ></tm-form-action-panel>
    <div class="form-layout">
      <v-layout row>
        <v-flex xs12 sm4 md6 lg6>
          <v-menu
            :close-on-content-click="false"
            v-model="menu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              :value="date"
              @change="dateOnChange"
              label="Date"
              type="date"
              dense
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker
              :value="date"
              @change="dateOnChange"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <!-- wallet input -->
      <v-layout row>
        <v-flex xs12 sm4 md6 lg6>
          <v-select
            :items="wallets"
            :value="wallet_id"
            @change="walletOnChange"
            menu-props="auto"
            label="Wallet"
            item-text="name"
            item-value="id"
            return-object
            prepend-icon="account_balance_wallet"
            append-outer-icon="pageview"
            @click:append-outer="startWalletChoice"
          ></v-select>
        </v-flex>
      </v-layout>

      <tm-wallets-select-form
        v-bind:items="this.wallets"
        v-bind:showWalletSelection="this.showWalletSelection"
        @select-wallets-close="completeWalletSelectionHandler"
      ></tm-wallets-select-form>
      <!-- START TABLE OF ITEMS -->
      <v-layout row>
        <v-flex xs12 sm12 md12 lg12>
          <div>
            <v-dialog v-model="dialog" max-width="700px" persistent class="form-dialog-bottom">
              <v-system-bar window color="#43425D" class="form-dialog-top">
                <v-toolbar-title>
                  <span class="title" style="color:white;">New row</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>
                <a @click="close">
                  <v-icon color="white" right>close</v-icon>
                </a>
              </v-system-bar>
              <v-card class="form-dialog-bottom">
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md6 lg6>
                        <v-autocomplete
                          label="Item"
                          :autofocus="true"
                          :items="items"
                          v-model="editRow.item"
                          autocomplete="true"
                          cache-items
                          clearable
                          outline
                          single-line
                          item-text="name"
                          item-value="id"
                          return-object
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm6 md6 lg6>
                        <v-text-field
                          outline
                          type="number"
                          clearable
                          v-model="editRow.sum"
                          label="Amount"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-textarea outline v-model="editRow.comment" label="Comment"></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions class="form-dialog-bottom">
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="saveRow(editRow)">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-flex>
              <v-btn small color="primary" dark @click="addNewLine()">
                <v-icon left dark>add_circle_outline</v-icon>Add
              </v-btn>

              <v-btn
                v-show="this.selected.length > 0"
                small
                dark
                color="red"
                @click="deleteSelected()"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </v-flex>

            <v-data-table
              select-all
              v-model="selected"
              :headers="headers"
              :items="rows"
              item-key="rowId"
              class="elevation-1"
              id="table-of-expenses"
            >
              <template slot="headers" slot-scope="props">
                <th>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click="toggleAll"
                  ></v-checkbox>
                </th>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :align="header.align"
                  :class="header.class"
                >
                  {{ header.text }}
                </th>
              </template>

              <template slot="items" slot-scope="props" class="table-of-expenses">
                <tr>
                  <td class="d-none">{{ props.item.item }}</td>
                  <td>
                    <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                  </td>

                  <td class="text-xs-left" @click="editCurrentRow(props.item)">
                    {{ props.item.item.name }}
                  </td>

                  <td class="text-xs-left" @click="editCurrentRow(props.item)">
                    {{ props.item.sum }}
                  </td>

                  <td class="text-xs-left hidden-sm-and-down" @click="editCurrentRow(props.item)">
                    {{ props.item.comment }}
                  </td>

                  <!-- <td class="justify-center layout px-0 hidden-xs-and-down" style="background-color: #FF6565"> 
                  <v-icon small @click="deleteRow(props.item)">delete</v-icon>
                  </td>-->
                </tr>
              </template>

              <template slot="no-data">
                <v-alert :value="true" type="info" icon="warning"
                  >To add a new expense, click "Add"</v-alert
                >
              </template>
            </v-data-table>
          </div>
        </v-flex>
      </v-layout>

      <!-- END TABLE OF ITEMS -->
      <!-- BEGIN FOOTER WITH TOLAL AND SAVE BUTTON -->
      <v-layout row>
        <v-spacer></v-spacer>
        <h3>Total: {{ totalAmount }} ({{ currencyCharCode }})</h3>
      </v-layout>

      <!-- END FOOTER WITH TOTAL  -->
    </div>
  </v-flex>
</template>

<script>
import ApiClass from './Api';
const Api = new ApiClass();
import Num from '../helpers/Num';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  props: ['docId'],
  data: () => ({
    menu: false,
    toggle_multiple: [0, 1],
    selected: [],
    countRows: 0,
    currentRow: 0,
    editRow: {
      index: null,
      item: null,
      sum: 0,
      comment: '',
    },

    headers: [
      {
        text: 'Category of expence',
        align: 'left',
        sortable: true,
        value: 'item',
      },
      { text: 'Amount', value: 'sum', align: 'left' },
      {
        text: 'Comment',
        value: 'comment',
        align: 'left',
        class: 'hidden-sm-and-down',
      },
    ],
    //wallets: [],
    menu: false,
    modal: false,
    active: null,
    dialog: false,
    showWalletSelection: false,
    sending: false,
  }),

  computed: {
    ...mapState({
      id: state => state.expenses.expenseObj.id,
      date: state => state.expenses.expenseObj.date,
      wallet_id: state => state.expenses.expenseObj.wallet_id,
      currencyCharCode: state => state.expenses.expenseObj.currencyCharCode,
      rows: state => state.expenses.expenseObj.rows,
      processing: state => state.expenses.processing,
      closeForm: state => state.expenses.closeForm,
    }),
    ...mapGetters({
      wallets: 'allWallets',
      items: 'allExpenseItems',
    }),
    totalAmount: function() {
      const reducer = (accumulator, row) => accumulator + Number(row.sum);
      let total = this.rows.reduce(reducer, 0);
      return Num.round2(total);
    },
  },
  beforeMount() {
    this.$store.state.title = 'Expense';
    this.$store.dispatch('getAllWallets');
    this.$store.dispatch('getAllExpenseItems');
    this.$store.dispatch('getExpense', this.docId);
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    closeForm: function(val, oldVal) {
      if (val === true) {
        this.$router.push({ path: '/expends' });
      }
    },
  },
  methods: {
    startWalletChoice() {
      this.showWalletSelection = true;
    },

    completeWalletSelectionHandler(wallet) {
      if (wallet !== undefined && typeof wallet === 'object') {
        this.walletOnChange(wallet);
      }

      this.showWalletSelection = false;
    },

    deleteSelected() {
      this.$store.commit('deleteSelected', this.selected);
    },

    toggleAll() {
      if (this.selected.length) {
        this.selected = [];
      } else {
        this.selected = this.rows.slice();
      }
    },

    dateOnChange(newDate) {
      this.$store.commit('expenseUpdateDate', newDate);
    },

    walletOnChange(wallet) {
      this.$store.commit('expenseUpdateWallet', wallet);
    },

    editCurrentRow(row) {
      this.editRow = Object.assign({}, row);
      this.editRow.index = this.rows.indexOf(row);
      this.dialog = true;
    },

    addNewLine() {
      this.tempRow = null;

      (this.editRow = {
        index: null,
        item: null,
        sum: 0,
        comment: '',
      }),
        (this.dialog = true);
    },

    saveRow(row) {
      if (row.index === null) {
        let maxRowId = this.maxRowId();
        row.rowId = ++maxRowId;

        console.dir(row);
      }

      this.$store.commit('expenseEditRow', row);

      this.editRow = {
        index: null,
        item: null,
        sum: 0,
        comment: '',
      };

      this.dialog = false;
    },

    maxRowId() {
      if (this.rows.length == 0) {
        console.log('fuck');
        return 0;
      }

      const reducer = function(accumulator, row) {
        return Math.max(accumulator, row.rowId);
      };

      let maxRowId = this.rows.reduce(reducer, 0);

      return maxRowId;
    },

    deleteRow(row) {
      this.$store.commit('expenseDeleteRow', row);
    },

    openFormItems() {
      this.dialog = true;
    },
    chooseItem(item) {
      this.editRow.item = item;
      this.dialog = false;
    },
    close() {
      this.dialog = false;

      setTimeout(() => {}, 300);
    },

    save() {
      this.$store.commit('saveExpense');
    },

    cancel() {
      this.$router.push({ path: '/expends' });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-layout {
  margin-left: 20px;
  margin-right: 20px;
}

.select-td {
  width: 20px;
}

.form-dialog-top {
  border-radius: 10px 10px 0 0;
}

.form-dialog-bottom {
  border-radius: 0 0 10px 10px;
}
</style>
