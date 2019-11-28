<template>
    <div class="card mt-1" style="min-height: 300px">
        <line-chart
            v-if="loaded"
            :id="'canvas_expenses_incomes_year'"
            :chart-data="chartData"
            :options="options"
            :chart-height="chartHeight"
            :parent-name="'card-balance-by-periods'"
        >
        </line-chart>
    </div>
</template>

<script>

    import LineChart from './charts/LineChart';

    export default {
        name: 'BalanceByPeriods',

        components: {
            'line-chart': LineChart
        },
        data: () => ({
            currencyBalance: null,
            chartData: null,
            loaded: false,
            options: {
                responsive: true,
                maintainAspectRatio: false,

                legend: {
                    display: true,
                    labels: {

                    }
                },
                title: {
                    display: true,
                    text: ''
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },

            },
            chartHeight: 300,
            title: 'Expenses & Incomes by the year'
        }),

        async beforeMount() {

            await this.$store.dispatch('getExpensesIncomesByYear');

            this.currencyBalance = this.$store.state.dashboard.expensesIncomeByYearCurrency;
            this.chartData = this.$store.state.dashboard.expIncChartData;
            this.options.title.text = `Expenses & Incomes by the year (${this.currencyBalance.short_name})`;
            this.loaded = true;

        }
    }

</script>