<template>
    <stats-card
        title="Incomes"
        type="gradient-green"
        :sub-title="incomes"
        icon="fas fa-coins text-white"
        class="mb-3 mb-xl-0"
    >
    </stats-card>
</template>

<script>
  import StatsCard from '../../argon/src/components/StatsCard';

  import Mynum from '../../helpers/MyNum';

  export default {
    components: {
      StatsCard
    },
    props: ['totalIncomes', 'totalIncomesCurrency'],

    computed: {
      incomesRounded: function () {
        return Mynum.round2(this.totalIncomes);
      },
      incomes() {
        return `${this.incomesRounded } (${ this.totalIncomesCurrency.short_name })`;
      }
    }

  };
</script>

<style scoped>
    .bg-gradient-success {
        background: #56ab2f; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #a8e063, #56ab2f); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #a8e063, #56ab2f); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    }

    .card-stats .card-body {
        padding: 1rem 1.5rem;
    }
</style>
