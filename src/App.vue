<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer"
      class="side-menu"
      v-if="this.$store.state.auth"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="item.heading" 
            class="side-menu"  
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>

          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="side-menu">
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click=""
              :to="child.link"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon large  color="#A3A0FB">{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="side-menu">
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          
          <v-list-tile v-else @click="" :key="item.text" :to="item.link">
            <v-list-tile-action>
              <v-icon color="#A3A0FB">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
             
              
              <v-list-tile-title class="side-menu">
                {{ item.text }}
              </v-list-tile-title>
              
             
              
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      color="#43425D"
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      fixed
      height=58
    >

      <v-toolbar-title fixed style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer" ></v-toolbar-side-icon>
        <span>{{ title }}</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      
      <v-menu bottom left transition="scale-transition" v-show = "componentMenu.length !== 0">
            <v-btn slot="activator" icon dark>
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in componentMenu" :key="i" @click="item.action()">
                <v-list-tile-action>
                <v-icon medium  color="#A3A0FB">{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="../src/assets/logo_var2.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
     

      <v-content>
        <v-container fluid>
        
          <router-view></router-view>
          
        </v-container>
      </v-content>
  
    
  </v-app>
</template>

<script>
  export default {
    
    data: () => ({
      dialog: false,
      drawer: true,
      showMenu: false,
      items: [
        { icon: 'home', text: "Home", link: '/index'},

        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'References',
          model: true,
          children: [
            { icon: 'euro_symbol', text: 'Currencies', link:'/currencies' },
            { icon: 'account_balance_wallet', text: 'Wallets' , link:'/wallets'},
            { icon: 'local_atm', text: 'Income items', link: '/itemsincome' },
            { icon: 'shopping_basket', text: 'Expenditure items' , link: '/itemsexpenditure'},
          ]
        },

        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Transactions',
          model: true,
          children: [
            { icon: 'remove', text: 'Expenses', link: '/expends' },
            { icon: 'add', text: 'Incomes', link: '/incomes'  },
            { icon: 'compare_arrows', text: 'Transfers', link: '/transfers'},
            
          ]
        },

    
        { icon: 'settings', text: 'Settings' ,link: "/newsettings"},
        { icon: 'exit_to_app', text: 'Log out', link: '/login'},
        
      ]
    }),

    mounted: function(){
      
      this.$store.state.auth = (sessionStorage.getItem("jwt") === null) ? false : true;
      
    },
    computed: {
      title() {
        return this.$store.state.title == undefined ? "Personal finanses" : this.$store.state.title;
      },
      componentMenu() {
        return this.$store.state.componentMenu;
      }
    }
  ,
    props: {
      source: String
    },
    methods:{
      logout(){
        console.log("Log out...");
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 90vh;
    padding: 0px;
    padding-right: 0px;
    padding-left: 0px;
    margin-right: auto;
    margin-left: auto;
    
  }

  .side-menu {
    background-color: #43425D;
    color: white;
  }
  
</style>