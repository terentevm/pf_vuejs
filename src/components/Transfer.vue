<template>

<div class ="col-12 col-sm-12 col-md-12 col-lg-12">
    
    <div class="row">
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
    <div class="row">
        <div class ="col-12 col-sm-12 col-md-12 col-lg-12">
            <span class="grey--text">From</span>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <v-select
                label="From"
                prepend-icon="account_balance_wallet"
                :items="wallets"
                v-model="WalletFrom"
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

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <v-text-field 
                label="Sum" 
                v-model="sumFrom"
                class="text-right"
                clearable
                type="number"
                prepend-icon="functions"
            ></v-text-field>
        </div>

    </div>
    <v-divider ></v-divider>
    <div class="row">
        <div class ="col-12 col-sm-12 col-md-12 col-lg-12">
            <span class="grey--text">To</span>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <v-select
                label="To"
                prepend-icon="account_balance_wallet"
                :items="wallets"
                v-model="WalletTo"
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

        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <v-text-field 
                label="Sum" 
                v-model="sumTo"
                class="text-right"
                clearable
                type="number"
                prepend-icon="functions"
            ></v-text-field>
        </div>

    </div>
    <v-card-actions>
    <v-btn :disabled="processing" color="blue darken-1" flat to='/transfers'>Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="processing" color="green darken-3" flat @click="save">Save</v-btn>
    </v-card-actions>
    <v-progress-linear v-show="processing" :indeterminate="true"></v-progress-linear>
    <v-alert :value="true" color="error" v-show="showError" dismissible>
        {{msgError}}
    </v-alert>
</div>
       
</template>

<script>
var moment = require("moment");
import { mapGetters, mapActions } from 'vuex'

import ModelClass from "./Model";
const Model = new ModelClass();

import ApiClass from "./Api";
const Api = new ApiClass();

export default {
    props: ['docId'],
    data:() => ({
        id: null,
        date: null,
        WalletFrom: null,
        WalletTo: null,

        wallet_id_from: null,
        wallet_id_to: null,
        sumFrom: 0,
        sumTo: 0,
        processing: false,
        showError: false,
        msgError: ''
    }),
    computed: mapGetters({
        wallets: 'allWallets'
    }),

    created: ()=>{
          
    },

    beforeMount: function() {
        this.$store.dispatch('getAllWallets')  
        this.$store.state.title = "Transfer money";
        this.id = this.docId;
        
        if (this.id == null) { //new doc
            let day = moment();
            this.date = day.format("YYYY-MM-DD");
        }
        else {
            this.processing = true;
            const param ={
                model: "transfer",
                conditions: {id: this.id}
            }

            Api.show(param).then(obj => {
                let day = moment();
                this.date = day.format(obj.date);
                this.WalletFrom = obj.wallet_id_from;
                this.WalletTo = obj.wallet_id_to;
                this.sumFrom = obj.sumFrom;
                this.sumTo = obj.sumTo;
                this.processing = false;    
            });
            
        }
        
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    methods: {
        addDay() {
                 
            let day = moment(this.date);
            day.add(1,"days");
            this.date = day.format("YYYY-MM-DD");
            
        }
        ,
        subDay(){
          
            let day = moment(this.date);
            day.add(-1,"days");
            this.date = day.format("YYYY-MM-DD");
        },

        save() {
            let updateMode = false;
            if (this.id !== null) {
                updateMode = true;
            }

            const elem = {
                id: this.id,
                date: this.date,
                wallet_id_from: this.WalletFrom === null ? null : this.WalletFrom.id, 
                wallet_id_to: this.WalletTo === null ? null : this.WalletTo.id,
                sumFrom: this.sumFrom,
                sumTo: this.sumTo 
            }
            this.processing = true;

            Model.saveTransfer(elem, updateMode).then(()=>{
                this.showError = false;
                this.$router.push({ path: '/transfers' });
            }).catch(()=>{
                this.processing = false;
                this.msgError = "Error. Document hasn't been saved!"
                this.showError = true;
            })
        }
    }
}
</script>
