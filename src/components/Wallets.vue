<template>



    <v-container
      
      id="scroll-target"
    >

    <v-layout
        wrap   
      >
    <v-flex xs12 sm12 md12 lg12>
    <v-dialog persistent v-model="dialog" max-width="500px">
      
      <v-card>
      

        <v-toolbar color="green darken-3" dark>
        
            <v-toolbar-title>Wallet: {{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon>account_balance_wallet</v-icon>
            </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container grid-list-md>
            
              <v-flex xs12 sm12 md12 d-none>
                <v-text-field label="id" v-model="editedItem.id"></v-text-field>
              </v-flex>

              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <v-text-field label="Name" v-model="editedItem.name" row-height=15></v-text-field>
                </div>
              </div>

              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <v-select
                    :items="currencies"
                    v-model="editedItem.Currency"
                    max-height=15
                    auto                    
                    label="Currency"
                    single-line
                    item-text="name"
                    item-value="id"
                    return-object
                  ></v-select>  
                </div>
              </div>
              
              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <v-checkbox
                    :label="`Is credit card`"
                    v-model="editedItem.is_creditcard"         
                    true-value=1
                    false-value=0
                  ></v-checkbox>
                </div>
              </div>

              <div class="row" >
                <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                  <v-text-field label="Credit limit"  v-model="editedItem.credit_limit" row-height=15 v-show="editedItem.is_creditcard == 1"></v-text-field>
                </div>

                <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                  <v-text-field label="Grace period" v-model="editedItem.grace_period" row-height=15 v-show="editedItem.is_creditcard == 1"></v-text-field>
                </div>

              </div>
              
                
              <p class="title text-xs-left  balancePositive" v-if="editedItem.currentBalance >= 0 && editedItem.id != null"><span>Balance: <v-btn flat @click="openChangeBalance()"><span class="title text-xs-left  balancePositive" >{{ editedItem.currentBalance }}</span> <v-icon right green darken-3>edit</v-icon></v-btn></span></p>
              <p class="title text-sm-left balanceNegative" v-if="editedItem.currentBalance < 0 && editedItem.id != null"><span>Balance: <v-btn flat @click="openChangeBalance()"><span class="title text-xs-left  balanceNegative" >{{ editedItem.currentBalance }}</span> <v-icon right green darken-3>edit</v-icon></v-btn></span></p>

              
          </v-container>
        </v-card-text>
        <v-card-actions>
          
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-3" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog persistent v-model="dialogCB" max-width="500px"> <!-- Change balance -->
      <v-card>
        <v-card-text>
        
          <v-text-field autofocus label="New balance" value="editedItem.newBalance" v-model="editedItem.newBalance" type="number" row-height=15></v-text-field>        
       
        </v-card-text>
        

        <v-card-actions>
          <v-btn flat color="success" @click="changeBalance()">Change</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click.native="dialogCB = false">Cancel</v-btn>
        </v-card-actions> 
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
      :loading="updating"
    >
      <template slot="items" slot-scope="props" >
        <td @click="editItem(props.item)" class='d-none'>{{ props.item.id }}</td>
        <td @click="editItem(props.item)" >{{ props.item.name }}</td>
        <td @click="editItem(props.item)" >{{ props.item.currencyName }}</td>
    
      </template>
      <template slot="no-data" >
        <div class="progress">
         
        </div>
                            
        </template>
    </v-data-table>
    </v-flex>
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
    
    <v-snackbar
      :timeout="msgSettings.timeout"
      :color="msgSettings.color"
      :multi-line="msgSettings.mode === 'multi-line'"
      :vertical="msgSettings.mode === 'vertical'"
      v-model="msgSettings.show"
    >
      {{ msgSettings.msg }}
      <v-btn dark flat @click.native="msgSettings.show = false">Close</v-btn>
    </v-snackbar>

    </v-layout>
    </v-container>

</template>

<script>

import ApiClass from "./Api";
const Api = new ApiClass();
import { mapGetters, mapActions } from 'vuex'
export default {
    data: () => ({
      dialog: false,
      dialogCB: false,
      formTitle:'New',
      offsetTop: 0,
      offset: 0,
      updating: false,
      curr: null,
      headers: [
        { text: 'id', value: 'id' , class: 'd-none'},
        { text: 'Name', value: 'name'},
        { text: 'Currency', value: 'currency'},
      ],

      editedIndex: -1,
      editedItem: {
        id: null,
        name: '',
        currency_id: '',
        is_creditcard: false,
        grace_period:0,
        credit_limit:0,
        currentBalance: 0,
        newBalance: 0
      },
      defaultItem: {
        id: null,
        name: '',
        currency_id: '',
        is_creditcard: false,
        grace_period:0,
        credit_limit:0,
        currentBalance: 0,
        newBalance: 0
      },
      msgSettings: {
        show: false,
        color: "light-green darken-3",
        mode: 'vertical',
        timeout: 6000,
        msg: ''
      }
    }),

    computed: {
      balance: function() {
        this.editedItem.currentBalance;
      },
      ...mapGetters({
              items: 'allWalletsList',
              currencies: 'allCurrencies'
          })
    } ,
    

    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    beforeMount: function(){
      this.$store.state.title = "Wallets";
      this.$store.dispatch('getAllWalletsList');
      this.$store.dispatch('getAllCurrencies');
      this.$store.state.componentMenu = this.getUpMenu(); 
    },


    methods: {

      getUpMenu() {
        let menu = [];

        const action1 = {
          title: "Update",
          icon: "cached",
          action: ()=>{
            this.update();
          }
        }

        menu.push(action1);
       
        
        return menu;

      },

      update() {
        if (this.updating == false) {  
          this.updating = true;
          this.$store.dispatch('getAllWalletsList');
          this.updating = false;
        }
      },


      sendData(item) {
        item.currency_id = item.Currency.id;

        let update = false;
        if (item.id !== null) {
          update = true;
        }
        
        const param = {
          model: "wallets",
          isUpdate: update,
          data: item
        };

        Api.save(param).then(success => {
          if (success === true) {
            this.showMsg(true);
            this.update();
            this.close();
            return true; 
          }
          else {
            this.showMsg(false);
            return false;
          }
        });

      }
      ,
      editItem (item) {
       
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true,
        this.formTitle = item.name;
        this.checkBalance(this.editedItem.id);
      },
      
      openChangeBalance() {
        this.editedItem.newBalance = this.editedItem.currentBalance
        this.dialogCB = true;
      },

      changeBalance() {
        if (this.editedItem.newBalance === this.editedItem.currentBalance) {
          this.dialogCB = false;
          return; 
        }

        let diff = this.editedItem.newBalance - this.editedItem.currentBalance;
        let moment = require("moment");
        let day = moment();
    
        const data = {
          date: day.format("YYYY-MM-DD"),
          wallet_id: this.editedItem.id,
          sumExpend: diff < 0 ? diff * -1 : 0,
          sumIncome: diff > 0 ? diff : 0,
          newBalance: Number(this.editedItem.newBalance)
        };

        const param = {
          model: "changebalance",
          data: data
        }

        Api.save(param).then(success => {
          if (success === true) {   
            this.checkBalance(this.editedItem.id); 
            this.dialogCB = false; 
          }
        });
      },

      checkBalance(id) {
        
        const param = {
          url: "/wallets/balance",
          conditions: {id: id}
        }

        Api.index(param).then(result => {
          this.$set(this.editedItem, 'currentBalance', result.balance);
         
        });

      },

      add(){
        this.dialog = true;
      },

      deleteItem (item) {
        const index = this.items.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1)
      },

      close () {
        
        this.dialog = false
        this.formTitle ='New';
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {

       
        let ok = this.sendData(this.editedItem);
        if (ok) {
          this.close();
          this.items= [];
          this.getItems(this.offset);
        }
        
      },
      showMsg(success) {
       
        this.msgSettings.color = success ? "light-green darken-3" : "orange darken-4";
        this.msgSettings.msg = success ? "Saved/Updated successfully!" : "Error";
        this.msgSettings.show = true; 
      }
      ,
      onScroll (e) {
        this.offsetTop = e.target.scrollTop;
        let currOffset = e.target.scrollTop;
        let maxOffset = e.target.scrollTopMax;

        if (((currOffset / maxOffset) * 100) > 70 ) {
            this.offset += 50;
            this.getItems(this.offset);
        }

      }
    }
  }
</script>

<style scoped>
  .td_hidden {
    display: none;
  }
  .progress {
    text-align: center;
    margin: 1rem;
  }

  .balancePositive {
    color: darkgreen
  }

  .balanceNegative {
    color:darkred
  }

  #create .speed-dial {
    position: absolute;
  }

  #create .btn--floating {
    position: relative;
  }  

</style>
