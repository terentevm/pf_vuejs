<script>
    import {Bar} from 'vue-chartjs/src/BaseCharts';
    import mixins from 'vue-chartjs/src/mixins/index';
    const {reactiveProp} = mixins;

    export default {
        name: "BarChart",
        mixins: [reactiveProp],
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
        extends: Bar,
        mounted() {
            let chart = document.getElementById('bar-chart');
            let card = document.getElementById(this.parentName);

            if (card != undefined) {
                chart.width = card.clientWidth - 10;
            }

            console.dir(card);

            console.log(`chart width is ${chart.width}`);
            chart.height = this.chartHeight;


            this.renderChart(this.chartData, this.options);


        }
    }
</script>

<style scoped>

</style>