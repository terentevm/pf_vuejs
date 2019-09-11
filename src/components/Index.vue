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
                            v-bind:totalIncomes="this.incomeTotal"></tm-index-income-total>
                </v-flex>
            </v-layout>
        </div>

        <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md4>
                <tm-index-balance-list v-bind:balanceAll="this.balanceAll"></tm-index-balance-list>
            </v-flex>

            <v-flex d-flex xs12 sm6 md4>
                <tm-index-expenses-list v-bind:expenses="this.expenses"></tm-index-expenses-list>
            </v-flex>

            <v-flex d-flex xs12 sm6 md4>
                <tm-index-incomes-list v-bind:incomes="this.incomes"></tm-index-incomes-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    import {mapGetters, mapActions} from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'balanceTotal',
                'balanceTotalCurrency',
                'expensesTotal',
                'expensesTotalCurrency',
            ]),
        },

        beforeMount: async function () {
            this.$store.state.title = 'Dashboard';
            const params = this.getParams();

            await this.$store.dispatch('getBalance');
            await this.$store.dispatch('getExpensesWithDetails');
            await this.$store.dispatch('getIncomesWithDetails');
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
