<template>

      <v-card>
        <v-toolbar color="yellow darken-3" dark>
        
            <v-toolbar-title><h3 class="font-weight-thin">Balance</h3></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon>account_balance_wallet</v-icon>
            </v-btn>
        </v-toolbar>
        <v-progress-circular
      v-show="loading"
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
        <v-list>
        <v-list-tile
            v-for="item in items "
            :key="item.wallet_id"
            avatar
            @click=""
          >
            <v-list-tile-avatar>
              <v-icon class="amber white--text">credit_card</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.wallet }}</v-list-tile-title>
              
              <v-list-tile-sub-title>{{ item.currencyCharCode }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            
              <h3 class="font-weight-thin">{{ item.BalanceInReportCurrency }}</h3>
            

          </v-list-tile>
        </v-list>
      </v-card>

</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        
      }
    },

    computed: {

      ...mapGetters({
              items: 'balanceAll',
              loading: 'loading'
          })
    },

    beforeMount: function(){
      
      this.$store.dispatch('getBalanceAll');
   
      
    },
  }

</script>