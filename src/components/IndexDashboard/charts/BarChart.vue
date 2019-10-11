<template>
    <div id="chart-bar">
        <canvas v-bind:id="canvasId" v-bind:width="width" height="300">
        </canvas>
    </div>
</template>
<script>

    import Chart from 'chart.js/dist/Chart.min.js';

    export default {
        name: "BarChart",

        props: {
            chartData: {
                type: Object,
                require: true
            },
            options: {
                type: Object
            },
            chartHeight: {
                type: Number
            },
            parentName: {
                type: String
            },
        },
        data: () => ({
            canvasId: 'canvas_barchart',
            bar: null,

        }),

        watch: {
            chartData: function (val) {
                this.renderChart(this.chartData, this.options);
            },
            options: function (val) {
                this.renderChart(this.chartData, this.options);
            }
        },
        computed: {
            width: {
                get() {
                    let parent_card = document.getElementById(this.parentName);

                    if (parent_card instanceof HTMLElement) {

                        return parent_card.clientWidth - 10;
                    }

                    return 500;
                }
            }
        },
        mounted() {

            this.renderChart(this.chartData, this.options);

        },

        methods: {

            renderChart(data, options) {

                let canvas = document.getElementById(this.canvasId);

                Chart.defaults.global.responsive = true;

                this.bar = new Chart(canvas, {
                    type: 'bar',
                    data: data,
                    options: options
                });
            }

        }
    }
</script>

<style scoped>
    .bar_chart {
        height: inherit;

    }
</style>