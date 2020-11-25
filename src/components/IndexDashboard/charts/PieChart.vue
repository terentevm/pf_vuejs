<template>
    <canvas :id="id" height="300px"></canvas>
</template>

<script>

    import Chart from 'chart.js/dist/Chart.min.js';

    export default {
        name: 'PieChart',

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
            },

        },
        data: () => ({
            bar: null,
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
                    type: 'pie',
                    data: data,
                    options: options
                });

            }

        }
    }
</script>
