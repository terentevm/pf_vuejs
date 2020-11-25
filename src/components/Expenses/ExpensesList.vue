<template>
  <div class="card shadow mx-0">
    <div v-show="showFilters" class="card-header border-0 py-0 bg-yellow-light">
      <div class="row align-items-center">
        <div class="col">
          <filter-panel
            @period-change="periodFilterOnChange"
            @wallet-change="walletFilterOnChange"
          />
        </div>
      </div>
    </div>
    <div class="table-responsive table-striped table-hover">
      <base-table
        class="table align-items-center table-flush"
        :table-classes="'mobile'"
        :thead-classes="'thead-bg'"
        :data="transactionsList">
        <template slot="columns">
          <th>Date</th>
          <th >Description</th>
          <th>Amount</th>
          <th class="d-none d-sm-block">Act</th>
        </template>

        <template slot-scope="{row}" @tr-click="editItem">
          <td class="budget">
            {{row.date}}
          </td>
          <td class="text-wrap align-baseline text-justify" @click="editItem(row)">
            {{row.description}}
          </td>

          <td class="budget">
            {{row.sum}}
          </td>


          <td class="text-right d-none d-sm-block">
            <base-dropdown class="dropdown bg-transparent"
                           position="right">
              <a slot="title" class="btn btn-sm btn-secondary btn-icon-only " role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-ellipsis-v"></i>
              </a>

              <template>
                <a class="dropdown-item" href="#" @click.prevent="deleteDoc(row)">Delete</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </template>
            </base-dropdown>
          </td>

        </template>

      </base-table>
    </div>
    <div class="card-footer d-flex justify-content-end"
         :class="type === 'dark' ? 'bg-transparent': ''">
      <base-pagination :value="page" :total="pagination.last_page" @input="pageChange"></base-pagination>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import BasePagination from '../../argon/src/components/BasePagination';
  import BaseDropdown from '../../argon/src/components/BaseDropdown';
  import BaseTable from '../../argon/src/components/BaseTable';
  import FilterPanel from '../Panels/FilterPanel';
  import Delete from '../Dialogs/DeleteConfirmation/Delete';
  export default {
    components: {
      BaseDropdown,
      BasePagination,
      BaseTable,
      'filter-panel': FilterPanel,
    },
    data: () => ({
      title: 'Expenses',
      showFilters: false,
      processing: false,
      offsetTop: 0,
      offset: 0,
      updating: false,
      showDel: false,
      page: 1,
      headers: [
        {text: 'id', value: 'id', classList: ['d-none']},
        {text: 'Date', value: 'date', classList: ['col-xs-2 col-sm-2 col-lg-2']},
        {text: 'Wallet', value: 'walletName', classList: ['col-xs-2 col-sm-4 col-lg-4']},
        {text: 'Sum', value: 'sum', classList: ['col-xs-2 col-sm-4 col-lg-5']}
      ],
      showDeleteConfirmation: false,
      modelName: 'expense',
      itemForDelete: null,
      showPeriodDialog: false,
      type: 'light',
      walletFilter: null,
      periodFilter: null
    }),

    computed: {
      transactionsList() {
        return this.$store.state.expenses.expensesList;
      },
      pagination() {
        return this.$store.state.expenses.pagination;
      }
    },

    beforeMount: function () {
      this.$store.state.title = 'Expenses';
      this.$store.commit('setupToolbarMenu', this.getUpMenu());
      this.update();
    },

    methods: {
      getUpMenu() {
        return {
          mainAction: {
            title: 'add',
            icon: 'add',
            action: () => {
              this.add();
            }
          },
          menu: [
            {
              title: 'update',
              icon: 'update',
              action: () => {
                this.update();
              }
            }
          ],
          filter: {
            toggle: ()=>{
              this.showFilters = !this.showFilters;
              this.$store.dispatch('toggleFilterActivity', this.showFilters);
            }
          }
        };
      },

      async update() {
        await this.$store.dispatch('startPending');
        await this.$store.dispatch('getExpensesList', this.createFilter());
        await this.$store.dispatch('finishPending');
      },

      createFilter() {
        const filter = {page: this.page};

        if (this.walletFilter && this.walletFilter.id) {
          filter.wallet = this.walletFilter;
        }

        if (this.periodFilter && this.periodFilter.begin) {
          filter.begin = this.periodFilter.begin;
        }

        if (this.periodFilter && this.periodFilter.end) {
          filter.end = this.periodFilter.end;
        }

        return filter;

      },

      editItem(item) {
        let id = item.id;
        this.$router.push({path: `expend/${id}`});
      },

      add() {
        this.$router.push({path: 'expend/new'});
      },

      showDelBtn() {
        this.showDel = !this.showDel;
      },

      showDeleteQuestion(item) {
        this.itemForDelete = item;
        this.showDeleteConfirmation = true;
      },

      closeDeleteConfirmation() {
        this.showDeleteConfirmation = false;
        this.itemForDelete = null;
      },

      deleteDoc(document) {

        const Del = Vue.extend(Delete);

        const DelComponent = new Del({
          propsData: {
            message: 'hello'
          }
        });

        const noti = this.$vs.notification({
          duration: 'none',
          content: DelComponent,
          onClick: () => {
            console.log('click from notification');
          }
        });


        // this.showDeleteConfirmation = false;
        //
        // this.$store.dispatch('deleteExpense', this.itemForDelete).then(res => {
        //   this.update();
        // });
      },

      pageChange(page) {
        this.page = page;
        this.update();
      },


      periodFilterOnChange(period) {
        this.periodFilter = period;
        this.update();
      },

      walletFilterOnChange(wallet) {
        console.log('wallet filter new value');
        console.dir(wallet);
        this.walletFilter = wallet;
        this.update();
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
