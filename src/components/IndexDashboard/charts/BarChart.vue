<template>
    <canvas :id="id" height="300px"></canvas>
</template>

<script>

    import Chart from 'chart.js/dist/Chart.min.js';

    export default {
        name: 'BarChart',

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
            chart: null,
            canvas: null

        }),

        watch: {
            chartData: {
              handler(newVal, oldVal){
                console.dir(this.chart);
                console.dir(newVal);
                console.dir(oldVal);
                this.chart.data.datasets = [...newVal.datasets];
                this.chart.data.labels = [...newVal.labels];

                this.chart.update();
              },
              deep: true
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

                this.chart = new Chart(this.canvas, {
                    type: 'bar',
                    data: data,
                    options: options
                });

            }

        }
    }
</script>
