<template>
  <div class="form-wrapper">
    <div class="area-work">
      <v-flex xs12 sm12 md8 lg8>
        <v-layout d-flex row align-center justify-space-between>
          <v-dialog
            ref="dialog"
            persistent
            v-model="modal"
            lazy
            full-width
            :return-value.sync="date"
          >
            <v-text-field
              slot="activator"
              label="Date"
              v-model="date"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="date" scrollable color="green darken-3">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>

              <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
          <button class="dateChangeBtn" @click="subDay()">&lt;</button>
          <button class="dateChangeBtn" @click="addDay()">&gt;</button>
        </v-layout>
      </v-flex>

      <!-- wallet input -->
      <v-layout row>
        <v-flex xs12 sm12 md12 lg12>
          <v-select
            :items="wallets"
            v-model="wallet"
            auto
            outline
            label="Wallet"
            single-line
            item-text="name"
            item-value="id"
            return-object
          ></v-select>
        </v-flex>
      </v-layout>

      <!-- tabs -->

      <v-layout row>
        <v-flex xs12 sm12 md12 lg12>
          <v-tabs v-model="active" color="#43425D" dark slider-color="yellow">
            <v-tab :key="1">Edit expense</v-tab>
            <v-tab :key="2">All rows</v-tab>

            <v-tab-item :key="1">
              <v-card flat>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div class="row myinputRow">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                      <v-text-field
                        label="Sum"
                        v-model="editRow.sum"
                        class="text-right"
                        clearable
                        type="number"
                        prepend-icon="functions"
                      ></v-text-field>
                    </div>
                  </div>

                  <div class="row mySmallRow">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                      <v-autocomplete
                        label="Item"
                        prepend-icon="add_shopping_cart"
                        :items="items"
                        v-model="editRow.item"
                        autocomplete
                        cache-items
                        clearable
                        auto
                        single-line
                        item-text="name"
                        item-value="id"
                        return-object
                      >
                      </v-autocomplete>
                    </div>
                  </div>
                  <div class="row mySmallRow">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                      <v-btn block outline small @click="openFormItems()">Show all items</v-btn>
                    </div>
                  </div>

                  <div class="row myinputRow">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                      <v-text-field
                        label="Comment"
                        v-model="editRow.comment"
                        class="text-right"
                        clearable
                        type="text"
                        prepend-icon="insert_comment"
                      ></v-text-field>
                    </div>
                  </div>
                </div>

                <div class="row myDevider"></div>

                <v-toolbar dense height="40">
                  <v-btn icon class="mx-2" @click="addRow()">
                    <v-icon large color="green darken-3">add</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-2" :disabled="this.currentRow == 0" @click="prevRow()">
                    <v-icon large color="green darken-3">arrow_back</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    class="mx-2"
                    :disabled="this.currentRow == this.rows.length - 1"
                    @click="nextRow()"
                  >
                    <v-icon large color="green darken-3">arrow_forward</v-icon>
                  </v-btn>

                  <v-btn icon class="mx-2" @click="delRow()">
                    <v-icon large color="green darken-3">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <span>row {{ currentRow + 1 }} of {{ rows.length }}</span>
                </v-toolbar>
              </v-card>
            </v-tab-item>

            <v-tab-item :key="2">
              <v-card flat>
                <v-data-table :headers="headers" :items="rows" hide-actions class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td class="d-none">{{ props.item.item }}</td>
                    <td v-if="props.item.item !== null">{{ props.item.item.name }}</td>
                    <td v-if="props.item.item == null">empty</td>
                    <td>{{ props.item.sum }}</td>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </div>

    <div class="area-actions">
      <v-layout d-flex row>
        <v-flex xs12 sm12 md12 lg12>
          <v-btn block :disabled="sending" color="green darken-3" @click="save">Save</v-btn>
        </v-flex>
      </v-layout>

      <v-btn :disabled="sending" color="blue darken-1" flat to="/expends">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-progress-circular
        v-show="sending"
        indeterminate
        :width="3"
        color="green"
      ></v-progress-circular>
      <v-spacer></v-spacer>
    </div>

    <v-dialog v-model="dialog" max-width="500px" scrollable persistent>
      <v-card>
        <v-toolbar color="green darken-3" dark>
          <v-icon>add_shopping_cart</v-icon>
          <v-toolbar-title>Choose item</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-list>
            <template v-for="(item, index) in items">
              <v-list-tile v-model="item.active" :key="item.id" @click="chooseItem(item)">
                <v-list-tile-avatar>
                  <v-icon color="teal">beenhere</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.name"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ApiClass from './Api';
const Api = new ApiClass();

import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['docId'],
  data: () => ({
    id: null,
    date: null,
    wallet: null,
    toggle_multiple: [0, 1],
    headers: [{ text: 'item', value: 'item' }, { text: 'Sum', value: 'sum' }],
    rows: [],
    countRows: 0,
    currentRow: 0,
    editRow: {
      item: null,
      sum: 0,
      comment: '',
    },

    //wallets: [],
    menu: false,
    modal: false,
    active: null,
    dialog: false,
    sending: false,
  }),

  computed: mapGetters({
    wallets: 'allWallets',
    items: 'allExpenseItems',
  }),

  beforeMount() {
    this.$store.state.title = 'Expense';
    this.$store.dispatch('getAllWallets');
    this.$store.dispatch('getAllExpenseItems');

    this.id = this.docId;
    if (this.id == null) {
      let moment = require('moment');
      let day = moment();

      this.date = day.format('YYYY-MM-DD');

      this.setDefaultWallet();

      this.rows.push({
        item: null,
        sum: 0,
        comment: '',
      });

      this.editRow = this.rows[this.rows.length - 1];
      this.currentRow = 0;
    } else {
      this.getData(this.id);
    }
  },
  created() {
    this.initialize();
    //this.editRow = this.rows[this.rows.lenght - 1];
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    initialize() {},

    setDefaultWallet() {
      this.$store.dispatch('getSettings');
      const defaultWallet = this.$store.state.settings.wallet;

      if (defaultWallet) {
        this.wallet = defaultWallet;
      }
    },

    addRow() {
      this.rows.push({
        item: null,
        sum: 0,
        comment: '',
      });

      this.editRow = this.rows[this.rows.length - 1];
      this.currentRow = this.rows.length - 1;
    },
    prevRow() {
      if (this.currentRow == 0) {
        return;
      }

      let newNum = --this.currentRow;
      this.currentRow = newNum >= 0 ? newNum : 0;
      this.editRow = this.rows[newNum];
    },
    nextRow() {
      let newNum = ++this.currentRow;
      this.currentRow = newNum >= this.rows.length - 1 ? this.rows.length - 1 : newNum;
      this.editRow = this.rows[newNum];
    },
    delRow() {
      delete this.rows.splice(this.currentRow, 1);

      if (this.rows.length > 0) {
        this.currentRow = 0;
        this.editRow = this.rows[this.currentRow];
      } else {
        this.rows.push({
          item: null,
          sum: 0,
          comment: '',
        });

        this.editRow = this.rows[this.rows.length - 1];
        this.currentRow = 0;
      }
    },
    addDay() {
      let moment = require('moment');
      let day = moment(this.date);
      day.add(1, 'days');
      this.date = day.format('YYYY-MM-DD');
    },
    subDay() {
      let moment = require('moment');
      let day = moment(this.date);
      day.add(-1, 'days');
      this.date = day.format('YYYY-MM-DD');
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

    getData(id) {
      const params = {
        model: 'expenditure',
        conditions: { id: this.id },
      };
      Api.show(params).then(data => {
        let moment = require('moment');
        let day = moment(data.date);
        this.date = day.format('YYYY-MM-DD');

        this.wallet = data.wallet_id;
        let storage = data.rows.storage;
        let temp_rows = [];
        for (let line of storage) {
          let lineObj = {
            item: line.ItemExpenditure,
            sum: line.sum,
          };

          temp_rows.push(lineObj);
        }

        this.rows = temp_rows;
        if (this.rows.length > 0) {
          this.editRow = this.rows[0];
        }
      });
    },
    getItems() {
      if (this.items.length > 0) {
        return true;
      }

      if (!sessionStorage.getItem('jwt')) {
        this.$router.push({ path: 'login' });
        return false;
      }
      const conditions = { list: 1 };

      Api.index({ model: 'expenditureitems', conditions: conditions }).then(items => {
        this.items = items;
      });
    },

    getItem(id) {
      for (let item of this.items) {
        if (item.id == id) {
          return item;
        }
      }
    },

    getWallets() {
      Api.index({ model: 'wallets' }).then(data => {
        this.wallets = data;
      });
    },

    save() {
      this.sending = true;

      let rows = this.getRowsUpload();

      console.dir(this.wallet.id);

      let doc = {
        id: this.id,
        date: this.date,
        wallet_id: this.wallet,
        rows: rows,
      };

      const params = {
        isUpdate: this.id !== null,
        model: 'expenditure',
        data: doc,
      };

      Api.save(params).then(success => {
        if (success === true) {
          this.$router.push({ path: '/expends' });
        } else {
          this.sending = false;
        }
      });
    },

    getRowsUpload() {
      let arr_rows = [];
      for (let row of this.rows) {
        if (row.item === null) {
          continue;
        }
        arr_rows.push({
          item_id: row.item.id,
          sum: row.sum,
          comment: row.comment,
        });
      }

      return arr_rows;
    },
  },
};
</script>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 20px;
  margin-right: 20px;
}

.area-work {
  display: flex;
  flex-direction: column;
}

.area-actions {
  display: flex;
  flex-direction: column;
}
.editField {
  height: calc(100% - 45px);
}

.rowDate {
  margin: 5px;
  align-content: center;
}

.dateChangeBtn {
  border: 1px solid white;
  display: flex;
  justify-content: space-around;
  font-size: 1.5rem;
  width: 30px;
  max-width: 50px;
  margin-left: 10px;
}
.dateChangeBtn:hover {
  background-color: azure;
  opacity: 0.5;
  color: black;
}

.actions_toolbar {
  height: 45px;
}
.line {
  margin: 0px;
}

.myinput {
  height: 40px;
  margin: 0 auto;
}

.myinputRow {
  height: 50px;
}

.mySmallRow {
  height: 6%;
}

.myDevider {
  height: 10px;
}
</style>
