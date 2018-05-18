<template>
    
    <v-flex xs12 sm12 md12 lg12>  
            <v-card flat>
            <v-card-text> 
            <div class="row myinputRow">
             
                <div class="col-8 col-sm-8 col-md-8 col-lg-8">

                
                    <v-dialog
                        ref="dialog"
                        persistent
                        v-model="modal"
                        lazy
                        full-width
                        width="290px"
                        :return-value.sync="date"
                    >
                        <v-text-field
                        slot="activator"
                        label="Date"
                        v-model="date"
                       
                        prepend-icon="event"
                        readonly
                        ></v-text-field>
                        <v-date-picker v-model="date" scrollable color="green darken-3">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        
                        <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>
               
                </div>
                
                <div class="col-4 col-sm-4 col-md-4 col-lg-4">
                    <v-btn icon class="mx-0" @click="subDay()">
                        <v-icon color="green darken-3">remove_circle_outline</v-icon>
                    </v-btn>  
                    <v-btn icon class="mx-0" @click="addDay()">
                        <v-icon color="green darken-3">add_circle_outline</v-icon>
                    </v-btn> 
                </div>

            </div>  
              
            <div class="row myinputRow">
                
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                        <v-select
                            :items="wallets"
                            v-model="wallet"
                            auto
                        
                            label="Wallet"
                            single-line
                            item-text="name"
                            item-value="id"
                            return-object
                        ></v-select>
                    </div>
                  
            </div>
            </v-card-text> 
            </v-card>   
            
            
            <div class="row">   
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                
                <v-tabs v-model="active"
                    color="green darken-3"
                    dark
                    slider-color="yellow"
                >
                <v-tab :key="1">Edit expend</v-tab>
                <v-tab :key="2">All rows</v-tab>
                
                <v-tab-item :key="1">
                    <v-card flat>
                   
                    
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                        
                        <div class="row myinputRow">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12"> 
                            <v-text-field 
                                label="Sum" 
                                v-model="editRow.sum"
                                class="text-right"
                                clearable
                                type="number"
                                prepend-icon="functions"

                            ></v-text-field>
                        </div>
                        </div>
                        
                        <div class="row myinputRow">
                            
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                                <v-select
                                    label="Item"
                                    prepend-icon="add_shopping_cart"
                                    :items="items"
                                    v-model="editRow.item"
                                    autocomplete
                                    cache-items
                                    clearable
                                    
                                    auto
                                    single-line
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                >
                                </v-select>
                            </div>    
                        
                        </div>
                        <div class="row mySmallRow">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                                <v-btn block outline small  @click="openFormItems()">Show all items</v-btn>
                            </div> 
                        </div>

                        <div class="row myinputRow">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12"> 
                                <v-text-field 
                                    label="Comment" 
                                    v-model="editRow.comment"
                                    class="text-right"
                                    clearable
                                    type="text" 
                                    prepend-icon="insert_comment"
                                ></v-text-field>
                            </div> 
                        </div> 

                    </div>
                    
                    <div class="row myDevider"></div>    
                  
                    <v-toolbar dense height=40>
                        <v-btn icon class="mx-2" @click="addRow()">
                            <v-icon large  color="green darken-3">add</v-icon>
                        </v-btn> 
                        <v-btn icon class="mx-2" :disabled="this.currentRow == 0" @click="prevRow()">
                            <v-icon large  color="green darken-3">arrow_back</v-icon>
                        </v-btn> 
                        <v-btn icon class="mx-2" :disabled="this.currentRow == this.rows.length - 1" @click="nextRow()">
                            <v-icon large  color="green darken-3">arrow_forward</v-icon>
                        </v-btn>

                        <v-btn icon class="mx-2" @click="delRow()">
                            <v-icon large color="green darken-3">delete</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <span>row {{ currentRow + 1 }} of {{ rows.length }}</span>     
                    </v-toolbar>
                    </v-card>
                </v-tab-item>

                <v-tab-item :key="2">
                    <v-card flat>
                    
                    <v-data-table
                        :headers="headers"
                        :items="rows"
                        hide-actions
                        class="elevation-1"
                    >
                    <template slot="items" slot-scope="props" >
                    <td class='d-none'>{{ props.item.item }}</td>
                    <td v-if="props.item.item !== null">{{ props.item.item.name }}</td>
                    <td v-if="props.item.item == null">empty</td>
                    <td >{{ props.item.sum }}</td>
    
                    </template>
                    </v-data-table>
                    </v-card>
                </v-tab-item>

                </v-tabs>
                </div>
                
            </div>
        
        
        <v-card-actions>
          
          <v-btn :disabled="sending" color="blue darken-1" flat to='/expends'>Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-progress-circular v-show="sending" indeterminate :width="3" color="green"></v-progress-circular>
          <v-spacer></v-spacer>
          <v-btn :disabled="sending" color="green darken-3" flat @click="save">Save</v-btn>
        </v-card-actions>
   

        <v-dialog v-model="dialog" max-width="500px">
        <v-card>

            <v-toolbar color="green darken-3" dark>
            
                <v-toolbar-title>Choose item</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                <v-icon>add_shopping_cart</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-list>
                    <template v-for="(item, index) in items">
                    <v-list-tile 
                        v-model="item.active"
                        :key="item.id"
                        @click="chooseItem(item)"
                    >
                
                    <v-list-tile-avatar>
                        
                        <v-icon color="teal">beenhere</v-icon>
                        
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.name"></v-list-tile-title>
                    </v-list-tile-content>
            
                    </v-list-tile>
                    <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
                    </template>
                </v-list>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat to='/expends'>Cancel</v-btn>
             <v-progress-circular indeterminate :width="3" color="green"></v-progress-circular>
            </v-card-actions>
        </v-card>
        </v-dialog>

    </v-flex>


    
</template>

<script>
import ModelClass from "./Model";
const Model = new ModelClass();

export default {
   props: ['docId'],
    data: () => ({
        id: null,
        date: null,
        wallet: null,
toggle_multiple: [0, 1],
        headers: [
        
        { text: 'item', value: 'item'},
        { text: 'Sum', value: 'sum'},
      ],
        rows: [],
        items: [],
        countRows: 0,
        currentRow: 0,
        editRow: {
            item: null,
            sum : 0,
            comment: ''
        },
        
        wallets: [],
        menu: false,
        modal: false,
        active: null,
        dialog: false,
        sending: false
    })
    ,
    beforeMount() {
        this.$store.state.title = "Expense";
        this.id = this.docId;
        if (this.id == null) {
            let moment = require("moment");
            let day = moment();
    
            this.date = day.format("YYYY-MM-DD");

            this.rows.push({
                item: null,
                sum : 0,
                comment: ''
            });

            this.editRow =  this.rows[this.rows.length - 1]; 
            this.currentRow = 0;    
        }
        else {
            this.getData(this.id);
        }
    }
    ,
    created () {
        this.initialize();
        //this.editRow = this.rows[this.rows.lenght - 1]; 
        
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
     methods: {
        initialize () {      
            this.getItems();
            this.getWallets() ; 
        },
        
        addRow() {
            this.rows.push({
                item: null,
                sum : 0,
                comment: ''
            });

            this.editRow =  this.rows[this.rows.length - 1];
            this.currentRow  = this.rows.length - 1;  
        }
        ,

        prevRow() {
            
            if (this.currentRow == 0) {
                return;
            }

            let newNum = --this.currentRow;
            this.currentRow = (newNum >= 0) ? newNum : 0;
            this.editRow =  this.rows[newNum]; 
        }
        ,
        nextRow() {
            let newNum = ++this.currentRow;
            this.currentRow = (newNum >= this.rows.length-1) ? this.rows.length-1 : newNum;
            this.editRow =  this.rows[newNum]; 
        }
        ,
        delRow() {
            delete this.rows.splice(this.currentRow, 1);

            if (this.rows.length > 0) {
                this.currentRow = 0;
                this.editRow =  this.rows[this.currentRow]; 
            }
            else {
                this.rows.push({
                    item: null,
                    sum : 0,
                    comment: ''
                });

            this.editRow =  this.rows[this.rows.length - 1]; 
            this.currentRow = 0;    
            }
            
        }
        ,
        addDay() {
            
            let moment = require("moment");
            let day = moment(this.date);
            day.add(1,"days");
            this.date = day.format("YYYY-MM-DD");
            
        }
        ,
        subDay(){
            let moment = require("moment");
            let day = moment(this.date);
            day.add(-1,"days");
            this.date = day.format("YYYY-MM-DD");
        }
        ,
        openFormItems(){
            this.dialog = true;
        }
        ,
        chooseItem(item){
            //console.log(JSON.stringify(item));
            this.editRow.item = item;
            this.dialog = false;
        }
        ,
        close () {
        
            this.dialog = false
      
            setTimeout(() => {
          
            }, 300)
        },

        getData(id) {
            
            Model.getExpend(this.id)
            .then(data => {
               
                let moment = require("moment");
                let day = moment(data.date);
                this.date = day.format("YYYY-MM-DD");
               
                this.wallet = data.wallet_id;
               // this.items = response.data;
               let temp_rows = [];
               for (let line of data.rows.storage)  {
                   let lineObj ={
                       item: this.getItem(line.item_id),
                       sum: line.sum
                   }

                   temp_rows.push(lineObj);
               }
                console.log(data.rows.storage);
                this.rows = temp_rows;
               })
            .catch(e=>{
            console.log(e);
            });
        }
        ,
        getItems() {
            
            if (this.items.length > 0) {
                return true;
            }

            if (!sessionStorage.getItem('jwt')) {
                this.$router.push({ path: 'login' });
                return false;
            }

           Model.getExpenditureItems().then(data => {
                
                this.items = data;
               
        })
        .catch(e=>{
            console.log(e);
        });
        },

        getItem(id) {
            for (let item of this.items) {
                if(item.id == id) {
                    return item;
                }
            }
        },

        getWallets() {
            Model.getWallets(0).then(data=>{
                this.wallets = data;
            })
        },

        save() {
            this.sending = true;
            
            let rows = this.getRowsUpload();
            let doc = {
                id: this.id,
                date: this.date,
                wallet_id: this.wallet.id,
                rows: rows 
            };

           
            Model.saveExpend(doc).then(res=>{
               this.$router.push({ path: '/expends' });
             })
             .catch(e=>{
                this.sending = false;
            });
        },

        getRowsUpload() {
            let arr_rows = [];
            for (let row of this.rows) {
               if (row.item === null) {
                   continue;
               }
               arr_rows.push({
                   item_id: row.item.id,
                   sum: row.sum,
                   comment: row.comment
               }); 
            }

            return arr_rows;
        }
    }
}
</script>

<style scoped>
    .line {
        margin: 0px;
    }

    .myinput {
        height: 40px;
        margin: 0 auto;
    }

    .myinputRow {
        height: 8%;
    }
    
    .mySmallRow {
        height: 6%;
    }

    .myDevider {
        height: 10px;
    }
</style>
