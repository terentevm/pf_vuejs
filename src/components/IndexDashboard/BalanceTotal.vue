<template>
  <stats-card
    title="Balance"
    type="gradient-blue"
    :sub-title="balance"
    icon="fas fa-coins text-white"
    class="mb-3 mb-xl-0"
  />
</template>

<script>
  import StatsCard from '../../argon/src/components/StatsCard';
  import MyNum from '../../helpers/MyNum';

  export default {
    components: {
      StatsCard
    },
    props: {
      totalBalance: {
        type: Number,
        default: 0
      },
      // eslint-disable-next-line vue/require-default-prop
      balanceCurrency: {
        type: Object
      }
    },

    computed: {
      balanceRounded: function () {
        return MyNum.round2(this.totalBalance);
      },

      balance() {
        return `${this.balanceRounded } (${ this.balanceCurrency.short_name })`;
      }
    },
  };
</script>
