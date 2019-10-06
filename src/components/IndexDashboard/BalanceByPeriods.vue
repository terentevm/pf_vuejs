<template>
    <v-hover>
        <v-card id="card-balance-by-periods" slot-scope="{ hover }" class=" mt-2 mx-1">
            <v-layout row>
                <v-flex xs12 sm12 md12 lg12>
                    <div class="balance-chart">
                        <bar-chart
                                v-if="loaded"
                                v-bind:chart-data="chartData"
                                v-bind:options="options"
                                v-bind:chart-height="chartHeight"
                                v-bind:parent-name="'card-balance-by-periods'"
                        >

                        </bar-chart>
                    </div>
                </v-flex>

            </v-layout>


        </v-card>
    </v-hover>
</template>

<script>

    import BarChart from './charts/BarChart';

    export default {
        name: "BalanceByPeriods",
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
                responsive: false,

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
            title: 'Balance by periods'
        }),

        components: {
            'bar-chart': BarChart
        },

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

    .balance-chart {
        height: 300px;

    }

</style>