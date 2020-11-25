<template>
  <stats-card
    title="Expenses"
    type="gradient-red"
    :sub-title="expense"
    icon="fas fa-coins text-white"
    class="mb-3 mb-xl-0"
  />
</template>

<script>
  import StatsCard from '../../argon/src/components/StatsCard';
  import Mynum from '../../helpers/MyNum';

  export default {
    components: {
      StatsCard
    },
    props: ['totalExpenses', 'expenseCurrency'],
    computed: {
      expensesRounded: function () {
        return Mynum.round2(this.totalExpenses);
      },
      expense() {
        return `${this.expensesRounded } (${ this.expenseCurrency.short_name })`;
      }
    },
  };
</script>
