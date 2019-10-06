<template>
    <v-container fluid grid-list-sm>
        <div class="panel-top">
            <v-layout row wrap>
                <v-flex d-flex xs12 sm6 md4>
                    <tm-index-balance-total
                            v-bind:totalBalance="this.balanceTotal"
                            v-bind:balanceCurrency="this.balanceTotalCurrency"
                    ></tm-index-balance-total>
                </v-flex>

                <v-flex d-flex xs12 sm6 md4>
                    <tm-index-expense-total
                            v-bind:totalExpenses="this.expensesTotal"
                            v-bind:expenseCurrency="this.expensesTotalCurrency"
                    ></tm-index-expense-total>
                </v-flex>

                <v-flex d-flex xs12 sm6 md4>
                    <tm-index-income-total
                            v-bind:totalIncomes="this.incomesTotal"
                            v-bind:total-incomes-currency="this.incomesTotalCurrency"
                    ></tm-index-income-total>
                </v-flex>
            </v-layout>
        </div>

        <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md4 lg4>
                <tm-index-balance-list v-bind:balanceAll="0"></tm-index-balance-list>
            </v-flex>

            <v-flex d-flex xs12 sm6 md8 lg8>
                <balance-by-periods-chart
                        v-bind:chart-data="this.balanceByPeriodsChartData"
                        v-bind:currency-balance="this.balanceByPeriodsCurrency"
                >

                </balance-by-periods-chart>
            </v-flex>


        </v-layout>
    </v-container>
</template>

<script>

    import {mapGetters} from 'vuex';
    import BalanceByPeriods from './IndexDashboard/BalanceByPeriods';

    export default {
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
        components: {
            'balance-by-periods-chart': BalanceByPeriods
        },
        beforeMount: async function () {
            this.$store.state.title = 'Dashboard';
            this.$store.commit('setupToolbarMenu', {});
            const params = this.getParams();

            this.$store.dispatch('getBalance');

            this.$store.dispatch('getExpensesWithDetails');
            this.$store.dispatch('getIncomesWithDetails');
        },

        methods: {
            getParams() {
                return {
                    beginDate: '2018-09-01',
                    endDate: '2018-09-30',
                };
            },
        },
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
