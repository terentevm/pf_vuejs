<template>
    <v-card class="mx-1">
        <v-card-title class="dash-card-header-title">
            Incomes
    </v-card-title>

    <v-divider light></v-divider>

    <v-layout>
      <v-flex xs7>
          <v-card-title>
          <div>
              <div class="headline">{{ incomesRounded }}</div>
              <div class="grey--text">{{ totalIncomesCurrency.short_name }}</div>
          </div>
        </v-card-title>
      </v-flex>

      <v-flex xs5 d-flex justify-space-around>
        <img src="../../assets/graph_income.svg" height="64px" width="64px" />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
    import Mynum from '../../helpers/MyNum';

    export default {
        props: ['totalIncomes', 'totalIncomesCurrency'],

  computed: {
    incomesRounded: function() {
        return Mynum.round2(this.totalIncomes);
    },
  },
};
</script>
