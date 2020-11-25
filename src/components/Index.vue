<template>
  <div class="container--fluid pt-0 px-1 px-md-3">
    <div class="row">
      <h6 class="text-default text-uppercase ls-1 mb-1">{{ periodText }}</h6>
    </div>
    <div class="row">
      <div class="col-lg-4">
        <tm-index-income-total
          :total-incomes="incomesTotal"
          :total-incomes-currency="incomesTotalCurrency"
        />
      </div>
      <div class="col-lg-4">
        <tm-index-expense-total
          :total-expenses="expensesTotal"
          :expense-currency="expensesTotalCurrency"
        />
      </div>
      <div class="col-lg-4">
        <tm-index-balance-total
          :total-balance="balanceTotal"
          :balance-currency="balanceTotalCurrency"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <tm-expenses-by-items :expenses="expensesDetails" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">

      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <balance-by-periods-chart
          :chart-data="balanceByPeriodsChartData"
          :currency-balance="balanceByPeriodsCurrency"
        />
      </div>
    </div>
    <div class="row py-1">
      <div class="col-md-4">
        <tm-index-balance-list :balance-all="0" />
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import BaseHeader from '../argon/src/components/BaseHeader';
  import BalanceTotal from './IndexDashboard/BalanceTotal.vue';
  import Card from '../argon/src/components/Card';
  import ExpenseTotal from './IndexDashboard/ExpenseTotal.vue';
  import IncomeTotal from './IndexDashboard/IncomeTotal.vue';
  import BalanceByWallets from './IndexDashboard/BalanceByWallets.vue';
  import BalanceByPeriods from './IndexDashboard/BalanceByPeriods';
  import ExpensesIncomesYear from './IndexDashboard/ExpensesIncomesYear';
  import ExpensesByItems from './IndexDashboard/ExpensesByItems';
  import PeriodsMixin from '../mixins/periods';
  import '../style/dashboard.scss';

  export default {
    components: {
      BaseHeader,
      Card,
      'balance-by-periods-chart': BalanceByPeriods,
      'expenses-incomes-year': ExpensesIncomesYear,
      'tm-index-balance-total': BalanceTotal,
      'tm-index-expense-total': ExpenseTotal,
      'tm-index-income-total': IncomeTotal,
      'tm-index-balance-list': BalanceByWallets,
      'tm-expenses-by-items' : ExpensesByItems
    },
    mixins: [PeriodsMixin],
    data: () => ({
      period:{}
    }),
    computed: {
      ...mapGetters([
        'balanceTotal',
        'balanceTotalCurrency',
        'balanceByPeriodsChartData',
        'balanceByPeriodsCurrency',
        'expensesTotal',
        'expensesTotalCurrency',
        'expensesDetails',
        'incomesTotal',
        'incomesTotalCurrency'
      ]),
      periodicity: {
        get() {
          return this.$store.state.settings.periodicity;
        }
      },
      periodText: {
        get() {
          if (!this.period) {
            return 'Dashboard period not set';
          }

          const {begin, end} = this.period;
          return `Dashboard period: ${begin} - ${end}`;
        }
      }
    },
    watch:{
      period: {
        async handler(period){
          if (period.begin && period.end) {
            await this.$store.dispatch('startPending');
            await this.$store.dispatch('getExpensesWithDetails', period);
            await this.$store.dispatch('getIncomesWithDetails', period);
            await this.$store.dispatch('finishPending');
          }
        },
        deep: true
      }
    },

    async beforeMount() {

      const periodicity = this.periodicity || 'year';

      this.period = this.formatPeriod(this.getPeriodByPeriodName(new Date(), periodicity));

      this.$store.state.title = 'Dashboard';
      this.$store.commit('setupToolbarMenu', []);
      this.$store.commit('setupToolbarMenu', this.getUpMenu());

      await this.$store.dispatch('startPending');
      await this.$store.dispatch('getBalance');
      await this.$store.dispatch('getExpensesWithDetails', this.period);
      await this.$store.dispatch('getIncomesWithDetails', this.period);
      await this.$store.dispatch('finishPending');
    },
    methods: {
      getUpMenu() {
        return {
          mainAction: {
            title: 'Set period',
            icon: 'far fa-calendar-alt',
            action: () => {
              this.showPeriodSelection();
            },
          },
          menu: [
            {
              title: 'Change currency',
              action: ()=>{
                console.dir('test action')
              }
            }
          ]
        };

      },
      showPeriodSelection() {
        this.$dialog
          .confirm('Please confirm to continue', {
            view: 'period-selection'
          })
          .then((result) => {
            this.period = result.data;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };
</script>

<style scoped>
  .form-wrapper {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .panel-top {
    /* padding: 10px; */
  }
</style>
