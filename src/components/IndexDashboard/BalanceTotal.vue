<template>
  <v-hover>
    <v-card slot-scope="{ hover }" class="mx-1 mt-2">
      <v-card-title>
        <div><span class="grey--text">Balance</span><br /></div>
      </v-card-title>
      <v-divider light></v-divider>
      <v-layout>
        <v-flex xs7>
          <v-card-title primary-title>
            <div>
              <div class="headline">{{ balanceRounded }} CZK</div>
            </div>
          </v-card-title>
        </v-flex>

        <v-flex xs5 d-flex justify-space-around>
          <img src="../../assets/balance.svg" height="64px" width="64px" />
        </v-flex>
      </v-layout>
    </v-card>
  </v-hover>
</template>

import { mapGetters, mapActions } from 'vuex';
import Num from '../../helpers/Num';
export default {
  props: ['totalBalance'],

  computed: {
    balanceRounded: function() {
      return Num.round2(this.totalBalance);
    },
  },
};
</script>
