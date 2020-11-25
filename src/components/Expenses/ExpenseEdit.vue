<template>
  <div id="expense-form-root" class="container-fluid px-0">
    <div class="edit_from_header">
      <div class="row d-flex mx-0">
        <div class="col-xs-12 col-sm-6 px-0">
          <label
            for="'expense_date_el'"
            class="tm-input-label"
          >Date</label>
          <v-date-control
            :id="'expense_date_el'"
            :date="date"
            @change="dateOnChange"
          />
        </div>
      </div>

      <div class="row mx-0">
        <div class="col-xs-12 col-sm-6 px-0">
          <label for="wallet_sel" class="tm-label">Wallet:</label>
          <tm-select
            id="wallet_sel"
            v-model="wallet"
            :options="wallets"
            :title="'name'"
            :clearable="true"
            :select-btn="true"
            :placeholder="'Select wallet'"
            @open="startWalletChoice"
          />
        </div>
      </div>
    </div>
    <tm-wallets-select-form
      :items="wallets"
      :show-wallet-selection="showWalletSelection"
      @select-wallets-close="completeWalletSelectionHandler"
    />
    <tm-editRow
      :dialog="editActive"
      :edit-row="editRow"
      :items="items"
      @close="closeEditRowDialog"
      @done="saveRow"
    />
    <card :bodyClasses="['px-0 py-0 mx-0']" :header-classes="['bg-transparent py-1']">
      <div slot="header" class="row align-items-center">
        <table-panel
          @new="addRow"
          @copy="copyRows"
          @del="deleteSelRows"
        />
      </div>

      <div class="table-responsive table-striped table-hover">
        <base-table
          class="table align-items-center table-flush"
          :thead-classes="'thead-light'"
          :data="rows"
          @tr-click="editCurrentRow"
        >
          <template slot="columns">
            <th style="max-width: 40px;">
              <base-checkbox @input="checkAll"/>
            </th>
            <th >Item</th>
            <th class="text-right">Amount</th>
          </template>

          <template slot-scope="{row}">
            <td style="max-width: 40px;" @click.stop="">
              <base-checkbox
                :checked="!!selected.includes(row)"
                @input="toggleRowSelection(row)"
              />
            </td>
            <td class="text-wrap align-baseline text-justify">
              {{row.item.name}}
            </td>

            <td class="text-right">
              {{row.sum}}
            </td>

          </template>

        </base-table>
      </div>
      <div slot="footer" class="row align-items-center">
        <h4 class="w-100 text-right">Total: {{ totalAmount }}</h4>
      </div>
    </card>
  </div>
</template>

<script>
  import TransactionMixin from '../../mixins/TransactionMixin';
  import BaseTable from '../../argon/src/components/BaseTable';
  import TablePanel from '../Panels/TablePanel';
  import Card from '../../argon/src/components/Card';
  import BaseCheckbox from '../../argon/src/components/BaseCheckbox';

  import TMDateControl from '../TMComponents/TMDateControl/TMDateControl';
  import TMSelect from './../TMComponents/TMSelect/TMSelect';

  import EditRowDialog from '../SelectsForms/EditRowForm';
  import MyNum from '../../helpers/MyNum';
  import {mapGetters, mapState} from 'vuex';

  import '../../style/myselect.scss';
  import '../../style/tables.scss';

  export default {
    mixins:[TransactionMixin],
    components: {
      BaseTable,
      Card,
      BaseCheckbox,
      'table-panel': TablePanel,
      'v-date-control': TMDateControl,
      'tm-select': TMSelect,
      'tm-editRow': EditRowDialog,
    },
    props: ['docId'],
    data: () => ({
      editActive: false,
      edit: null,
      editProp: {},
      allCheck: false,
      countRows: 0,
      currentRow: 0,
      editRow: {
        index: null,
        item: null,
        sum: 0,
        comment: '',
      },

      modal: false,
      active: null,
      dialog: false,
      showWalletSelection: false,
      processing: false,

      insListener: null,

    }),
    computed: {
      date: {
        get() {
          return this.$store.state.expenses.expenseObj.date;
        },

        set(fDate) {
          this.setFormModified(true);
          this.$store.commit('expenseUpdateDate', fDate);
        }
      },
      wallet: {
        get() {
          return this.$store.state.expenses.expenseObj.wallet
        },
        set(wallet) {
          this.setFormModified(true);
          this.$store.commit('expenseUpdateWallet', wallet);
        }
      },
      ...mapState({
        id: state => state.expenses.expenseObj.id,
        currency: state => state.expenses.expenseObj.currency,
        rows: state => state.expenses.expenseObj.rows,
        closeForm: state => state.expenses.closeForm,
      }),
      ...mapGetters({
        wallets: 'allWallets',
        items: 'allExpenseItems',
      }),
      totalAmount: function () {
        const reducer = (accumulator, row) => accumulator + Number(row.sum);
        let total = this.rows.reduce(reducer, 0);
        return MyNum.round2(total);
      },
    },

    watch: {
      closeForm: function (val) {
        if (val === true) {
          this.$router.push({path: '/expends'});
        }
      },

    },
    beforeMount() {
      this.$store.state.title = 'Expense';
      this.$store.commit('setupToolbarMenu', []);
      this.$store.commit('setupToolbarMenu', this.getUpMenu());

      this.$store.dispatch('getSettings');
      this.$store.dispatch('getAllWallets');
      this.$store.dispatch('getAllExpenseItems');
      this.$store.dispatch('getExpense', this.docId);

      this.insListener = (event) => {
        if (event.key === 'Insert') {
          this.addNewLine();
        }
      };

      document.addEventListener('keyup', this.insListener);
    },

    beforeDestroy() {
      document.removeEventListener('keyup', this.insListener);
    },

    methods: {
      getUpMenu() {

        return {
          mainAction: {
            title: 'Save',
            icon: 'done',
            action: () => {
              this.save();
            },
          },

          menu: [
            {
              title: 'Cancel',
              icon: 'exit_to_app',
              action: () => {
                this.cancel();
              },
            }
          ]
        };
      },

      startWalletChoice() {
        this.showWalletSelection = true;
      },

      completeWalletSelectionHandler(wallet) {
        if (wallet !== undefined && typeof wallet === 'object') {
          this.walletOnChange(wallet);
        }

        this.showWalletSelection = false;
      },



      dateOnChange(newDate) {
        this.$store.commit('expenseUpdateDate', newDate);
        this.setFormModified(true);
      },

      walletOnChange(wallet) {
        this.$store.commit('expenseUpdateWallet', wallet);
        this.setFormModified(true);
      },

      editCurrentRow(row) {

        this.editRow = Object.assign({}, row);
        this.editRow.index = this.rows.indexOf(row);
        this.editActive = true;
      },

      addRow() {

        this.editRow = {
          index: null,
          item: null,
          sum: 0,
          comment: '',
        };

        this.editActive = true;
      },


      closeEditRowDialog() {
        this.editActive = false;
      },

      saveRow(row) {
        this.editActive = false;

        if (!row.item) return;

        if (row.index === null) {
          let maxRowId = this.maxRowId();
          row.rowId = ++maxRowId;

        }

        this.$store.commit('expenseEditRow', row);

        this.editRow = {
          index: null,
          item: null,
          sum: 0,
          comment: '',
        };

        this.setFormModified(true);
      },

      maxRowId() {
        if (this.rows.length === 0) {
          return 0;
        }

        const reducer = function (accumulator, row) {
          return Math.max(accumulator, row.rowId);
        };

        return this.rows.reduce(reducer, 0);

      },

      openFormItems() {
        this.dialog = true;
      },

      chooseItem(item) {
        this.editRow.item = item;
        this.dialog = false;
      },

      save() {
        this.processing = true;
        this.$store.dispatch('saveExpense').then(() => {
          this.processing = false;
          this.setFormModified(false);
          this.$router.push({path: '/expends'});
        }).catch(err => {
          this.processing = false;
          console.error(err);
        });
      },

      cancel() {
        if (this.formModified === true) {
          if (!confirm('Data has been changed. Changes will be lost. Continue?')) {
            return;
          }
        }
        this.$router.push({path: '/expends'});
      },

      checkAll() {
        if (this.selected.length) {
          this.selected = [];
        } else {
          this.selected = this.rows.slice();
        }
      },

      toggleRowSelection(row) {
        const indexRow = this.selected.indexOf(row);
        if ( indexRow == -1) {
          this.selected.push(row);
        }
        else {
          this.selected.splice(indexRow, 1);
        }

      },

      async search(searchStr) {

        if (typeof searchStr === 'string' && searchStr.length >= 3) {
          console.log('making request');
          this.items_options = await this.$store.dispatch('searchItemsOfExpenses', searchStr);
        }
      }
    },
  };
</script>

<style lang="scss">
  .tm-input-label {
    color: #566787;
    font-family: 'Varela Round', sans-serif;
    font-size: 15px;
    font-weight: 700;
  }

  .date-input {
    height: 36px;
    min-width: 100%;
    border: 1px solid #566787;
    background: #dfe5fb;
    text-transform: lowercase;
    font-variant: small-caps;
    border-radius: 4px;
    line-height: 1.4;
    font-size: 1em;

    margin: 4px 0 0 0;
    padding: 0 7px;

  }

  .select_with_icon {
    display: flex;
    flex-direction: row;
    align-items: center;

  }

  .input-select-wrapper {
    display: flex;
    flex-basis: 400px;
  }

  .select-td {
    width: 20px;
  }

  .vs-table table {
    margin: 0px;
    border-collapse: collapse;
    width: 100%;
    min-width: 5px;
  }

  .total-header {
    display: flex;
    flex-direction: row;
    justify-content: end;
    justify-items: end;
    font-size: 1.4rem;
  }
</style>
