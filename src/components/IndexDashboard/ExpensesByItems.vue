<template>
  <card>
    <div slot="header" class="row align-items-center">
      <div class="col">
        <h6 class="text-default text-uppercase ls-1 mb-1">Expenses by items</h6>
      </div>
      <base-dropdown>
        <base-button slot="title" size="sm" type="default" class="dropdown-toggle">
          {{ datasetLenghtTitle }}
        </base-button>
        <a class="dropdown-item" href="#" @click.prevent = "changeDatasetLenght(-1)">ALL</a>
        <a class="dropdown-item" href="#" @click.prevent = "changeDatasetLenght(5)">Top 5</a>
        <a class="dropdown-item" href="#" @click.prevent = "changeDatasetLenght(10)">Top 10</a>
        <a class="dropdown-item" href="#" @click.prevent = "changeDatasetLenght(15)">Top 15</a>
        <a class="dropdown-item" href="#" @click.prevent = "changeDatasetLenght(20)">Top 20</a>
      </base-dropdown>
    </div>
    <chart
      v-if="expenses.length > 0"
      :id="'canvas-expenses-by-items'"
      :chart-data="chartData"
      :options="options"
    />
  </card>
</template>

<script>
  import Card from '../../argon/src/components/Card';
  import BaseButton from '../../argon/src/components/BaseButton';
  import BaseDropdown from '../../argon/src/components/BaseDropdown';
  import Chart from './charts/BarChart'
  export default {
    name: 'ExpensesByItems',
    components:{
      Card,
      BaseButton,
      BaseDropdown,
      'chart': Chart
    },
    props: {
      expenses: {
        type: Array,
        require: true
      }
    },
    data: () => ({
      loaded: false,
      datasetLenghtTitle: 'ALL',
      expensesAll: [],
      renderCount: -1,
      options: {
        responsive: true,
        maintainAspectRatio: false,

        legend: {
          display: false,
          position:'right',
          labels: {
            fontColor: 'rgb(255, 99, 132)'
          }
        },
        title: {
          display: true,
          text: ''
        }
      },
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Expenses by items',
            backgroundColor: '#2fc418',
            data: []
          }
        ]
      },
      chartHeight: 300,
      title: 'Balance by months'
    }),
    watch: {
      expenses: function (newVal) {

        this.expensesAll = [...newVal];
        this.buildChartData(this.getDataset());
      },
      renderCount: function () {
        this.buildChartData(this.getDataset());
      }
    },
    beforeMount() {
      this.buildChartData(this.expenses);
    },
    methods: {
      getDataset() {
        return this.renderCount === -1
          ? this.expensesSorted(this.expensesAll, 'desc')
          : this.expensesSorted(this.expensesAll, 'desc').slice(0, this.renderCount);
      },

      changeDatasetLenght(lenght) {
        this.datasetLenghtTitle = lenght === -1 ? 'ALL' : `TOP ${lenght}`;
        this.renderCount = lenght;
      },

      sortAsc(a, b) {
        if (Number(a.sum_converted) > Number(b.sum_converted)) {
          return 1;
        }
        if (Number(a.sum_converted) < Number(b.sum_converted)) {
          return -1;
        }
        return 0;
      },
      sortDesc(a, b) {
        if (Number(a.sum_converted) < Number(b.sum_converted)) {
          return 1;
        }
        if (Number(a.sum_converted) > Number(b.sum_converted)) {
          return -1;
        }

        return 0;
      },
      expensesSorted(expenses, dest='asc') {
        const sortFunc = dest === 'asc' ? this.sortAsc : this.sortDesc;
        return [...expenses].sort(sortFunc);
      },
      buildChartData(expenses) {

        const labels = [];
        const data = [];
        const coloR = [];

        const dynamicColors = function() {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          return `rgb(${r}, ${g}, ${b})`;
        };

        expenses.forEach(expense => {
          labels.push(expense.item_name);
          data.push(Number(expense.sum_converted));
          coloR.push(dynamicColors());
        });

        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Expenses by items',
              data: data,
              backgroundColor: coloR
            }
          ]
        };
      }
    }
  }
</script>

<style scoped>

</style>