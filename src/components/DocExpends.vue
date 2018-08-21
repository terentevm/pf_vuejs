<template>

  <v-flex xs12 sm12 md12 lg12>
        
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="updating"
      hide-actions
      class="elevation-1"
    >

      <template slot="items" slot-scope="props" >
        <td style="padding: 0 10px;" v-show = "showDel">
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
        <td class='d-none'>{{ props.item.id }}</td>
                        
        <td style="padding: 0 10px;" @click="editItem(props.item)"><v-icon color="red">remove</v-icon> {{ props.item.dateShow }}</td>
                        
        <td style="padding: 0 5px;" @click="editItem(props.item)">{{ props.item.walletName }}</td>
        <td style="padding: 0 5px;" @click="editItem(props.item)">{{ props.item.sum }}</td>

      </template>
    
      <template slot="no-data">
                        
      </template>
    
    </v-data-table>
    
    <div class="text-xs-center pt-2">
      <v-btn outline  color="success" :loading="updating" :disabled="updating" @click="addDocs">more</v-btn>
    </div>
    
    <v-fab-transition>
      <v-btn
        fab
        fixed
        bottom
        right
        dark
        @click="add()"
        color="primary"
      >
      <v-icon>add</v-icon>
      </v-btn>
      
    </v-fab-transition>

</v-flex>

</template>

<script>
import ModelClass from "./Model";
const Model = new ModelClass();

import ApiClass from "./Api";
const Api = new ApiClass();


var  moment = require("moment");
export default {
  data: () => ({
    items: [],
    offsetTop: 0,
    offset: 0,
    updating: false,
    showDel: false,
    headers: [
      { text: "id", value: "id", class: "d-none" },
      { text: "Date", value: "date", class: "xs4 sm4 md4" },
      { text: "Wallet", value: "wallet" },
      { text: "Sum", value: "sum" }
    ]
  }),
  
  beforeMount: function(){
    this.$store.state.title = "Expenses";
    this.$store.state.componentMenu = this.getUpMenu(); 
  },
  
  created() {
    this.initialize();
  },

  methods: {
    initialize() {
    var scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    //console.log( 'Высота с учетом прокрутки: ' + scrollHeight );
     this.updating = true;
     this.getDocs();
    },

    getUpMenu() {
      let menu = [];

      const action1 = {
        title: "Update",
        icon: "cached",
        action: ()=>{
          this.offset = 0;
          this.getDocs();
        }
      };

      const action2 = {
        title: "Delete",
        icon: "delete",
        action: ()=>{
          this.showDelBtn();
        }
      };

      menu.push(action1);
      menu.push(action2); 
        
      return menu;

    },

    getDocs() {
      if (!sessionStorage.getItem("jwt")) {
        this.$router.push({ path: "login" });
        return false;
      }
      
      const settings = {
        model: "expenditure",
        conditions: {
          limit: 50,
          offset: this.offset
        }
      };

      this.updating = true;

      Api.index(settings).then(data => {
        for (let elem of data) {
            
            if (elem.Wallet == null) {
              console.log(JSON.stringify(elem));
              continue;
            }
            elem.walletName = elem.Wallet.name;
            let day = moment(elem.date);
            elem.dateShow = day.format("DD-MM-YYYY");         
            this.items.push(elem);
        }

        this.updating = false;
      });

    },
    
    editItem (item) {
      
       let id = item.id
       this.$router.push({ path: `expend/${ id }`}); 
    },

    add() {
        this.$router.push({ path: `expend`}); 
    },
    
    addDocs() {
        
        if (this.updating == true) {
            return;
        }
        
        this.offset += 50;
        this.updating = true;
        this.getDocs(this.offset);
        
    },
    showDelBtn() {
      this.showDel = !this.showDel;
    }
    ,
    deleteItem(item) {
      alert("Action doesn't support yet");
    }
  }
};
</script>

<style scoped>
 thead {
   position: fixed;
   z-index: 2;
 }
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>