<template>
    <div class="container-fluid px-0">
        <div class="row">
            <div class="col-xs-12 col-sm-4">
                <tm-index-balance-total
                    :total-balance="this.balanceTotal"
                    :balance-currency="this.balanceTotalCurrency"
                ></tm-index-balance-total>
            </div>

            <div class="col-xs-12 col-sm-4">
                <tm-index-expense-total
                    :total-expenses="this.expensesTotal"
                    :expense-currency="this.expensesTotalCurrency"
                ></tm-index-expense-total>
            </div>

            <div class="col-xs-12 col-sm-4">
                <tm-index-income-total
                    :total-incomes="this.incomesTotal"
                    :total-incomes-currency="incomesTotalCurrency"
                ></tm-index-income-total>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12 col-sm-4">
                <tm-index-balance-list :balance-all="0"></tm-index-balance-list>
            </div>

            <div class="col-xs-12 col-sm-8">
                <div class="row">
                    <div class="container py-0 mt-1">
                        <balance-by-periods-chart
                            :chart-data="balanceByPeriodsChartData"
                            :currency-balance="balanceByPeriodsCurrency"
                        >
                        </balance-by-periods-chart>
                    </div>
                </div>

                <div class="row">
                    <div class="container py-0 mt-1">
                        <expenses-incomes-year></expenses-incomes-year>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import BalanceTotal from './IndexDashboard/BalanceTotal.vue';
    import ExpenseTotal from './IndexDashboard/ExpenseTotal.vue';
    import IncomeTotal from './IndexDashboard/IncomeTotal.vue';
    import BalanceByWallets from './IndexDashboard/BalanceByWallets.vue';
    import BalanceByPeriods from './IndexDashboard/BalanceByPeriods';
    import ExpensesIncomesYear from './IndexDashboard/ExpensesIncomesYear';

    export default {
        components: {
            'balance-by-periods-chart': BalanceByPeriods,
            'expenses-incomes-year': ExpensesIncomesYear,
            'tm-index-balance-total': BalanceTotal,
            'tm-index-expense-total': ExpenseTotal,
            'tm-index-income-total': IncomeTotal,
            'tm-index-balance-list': BalanceByWallets
        },
        computed: {
            ...mapGetters([
                'balanceTotal',
                'balanceTotalCurrency',
                'balanceByPeriodsChartData',
                'balanceByPeriodsCurrency',
                'expensesTotal',
                'expensesTotalCurrency',
                'incomesTotal',
                'incomesTotalCurrency'
            ]),
        },

        beforeMount() {
            this.$store.state.title = 'Dashboard';
            this.$store.commit('setupToolbarMenu', {});
            this.$store.dispatch('getBalance');
            this.$store.dispatch('getExpensesWithDetails');
            this.$store.dispatch('getIncomesWithDetails');
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
