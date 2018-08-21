<template>

      <v-card>
        <v-toolbar color="yellow darken-3" dark>
        
            <v-toolbar-title><h3 class="font-weight-thin">Balance</h3></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon>account_balance_wallet</v-icon>
            </v-btn>
        </v-toolbar>
        <v-list>
        <v-list-tile
            v-for="item in items "
            :key="item.title"
            avatar
            @click=""
          >
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              
              <v-list-tile-sub-title>{{ item.currency }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            
              <h3 class="font-weight-thin">{{ item.balance }}</h3>
            

          </v-list-tile>
        </v-list>
      </v-card>

</template>

<script>

  export default {
    data () {
      return {
        items: [
          { icon: 'credit_card', iconClass: 'amber white--text', title: 'Свободные деньги',  balance: '80000', currency: "CZK" },
          { icon: 'credit_card', iconClass: 'amber white--text', title: 'Кредитная карта',    balance: '-25000',  currency: "RUB" },
          { icon: 'credit_card', iconClass: 'amber white--text', title: 'Накопительный счет', balance: '278000' , currency: "EUR" },
          { icon: 'credit_card', iconClass: 'amber white--text', title: 'Накопительный счет', balance: '278000' , currency: "EUR" }
        ],

      }
    }
  }

</script>