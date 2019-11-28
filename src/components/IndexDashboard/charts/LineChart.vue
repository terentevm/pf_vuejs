<template>
    <canvas :id="id" height="350px"></canvas>
</template>

<script>

    import Chart from 'chart.js/dist/Chart.min.js';

    export default {
        name: 'LineChart',

        props: {
            id: {
                type: String,
                require: true
            },
            chartData: {
                type: Object,
                require: true
            },
            options: {
                type: Object
            }
        },
        data: () => ({
            canvas: null

        }),

        watch: {
            chartData: function () {
                this.renderChart(this.chartData, this.options);
            },
            options: function () {
                this.renderChart(this.chartData, this.options);
            }
        },

        mounted() {

            this.renderChart(this.chartData, this.options);


        },

        methods: {

            renderChart(data, options) {

                this.canvas = document.getElementById(this.id).getContext('2d');

                this.bar = new Chart(this.canvas, {
                    type: 'line',
                    data: data,
                    options: options
                });

            }

        }
    }
</script>
