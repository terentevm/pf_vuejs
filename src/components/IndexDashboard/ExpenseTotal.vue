<template>
  <v-card class="mx-1 mt-2">
    <v-card-title>
      <div><span class="grey--text">Expences</span><br /></div>
    </v-card-title>

    <v-divider light></v-divider>

    <v-layout>
      <v-flex xs7>
        <v-card-title primary-title>
          <div>
            <div class="headline">{{ expensesRounded }} CZK</div>
          </div>
        </v-card-title>
      </v-flex>

      <v-flex xs5 d-flex justify-space-around>
        <img src="../../assets/graph_expenses.svg" height="64px" width="64px" />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Num from '../../helpers/Num';

export default {
  props: ['totalExpenses'],
  computed: {
    expensesRounded: function() {
      return Num.round2(this.totalExpenses);
    },
  },
};
</script>
