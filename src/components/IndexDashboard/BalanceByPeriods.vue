<template>
    <div class="card mt-1" style="min-height: 300px">
        <bar-chart
            v-if="loaded"
            :id="'canvas_balance_by_months'"
            :chart-data="chartData"
            :options="options"
        >
        </bar-chart>
    </div>
</template>

<script>

    import BarChart from './charts/BarChart';

    export default {
        name: 'BalanceByPeriods',

        components: {
            'bar-chart': BarChart
        },
        props: {
            chartData: {
                type: Object,
                require: true
            }
        },
        data: () => ({
            currencyBalance: null,
            loaded: false,
            options: {
                responsive: true,
                maintainAspectRatio: false,

                legend: {
                    display: false,
                    labels: {
                        fontColor: 'rgb(255, 99, 132)'
                    }
                },
                title: {
                    display: true,
                    text: ''
                }
            },
            chartHeight: 300,
            title: 'Balance by months'
        }),

        async beforeMount() {

            await this.$store.dispatch('getBalanceByPeriods');

            this.currencyBalance = this.$store.state.dashboard.balanceByPeriodsCurrency;
            this.options.title.text = `Balance by month (${this.currencyBalance.short_name})`;
            this.loaded = true;

        }
    }

</script>

<style scoped>
    .dash-card-header-title {
        color: rgb(86, 103, 135);;
        font-family: 'Varela Round', sans-serif;
        font-size: 25px;
        height: 50px;
    }


</style>