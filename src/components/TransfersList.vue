<template>
    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <v-data-table
            :headers = "headers"
            :items="items"
            :loading="updating"
            hide-actions
            v-model="selected"
            :select-all ="showSelect"
            class=" mytable"
            id="MyTable"
        >
        <template slot="items" slot-scope="props" >
            
            <td class='d-none' >{{ props.item.id }}</td> 
            <td style="padding: 0 5px;" > {{ props.item.dateShow }}</td>
                          
            <td style="padding: 0 5px;">
                <tr>{{ props.item.walletFromName }}</tr>
                <tr>{{ props.item.walletToName }}</tr>     
            </td>
 
            <td style="padding: 0 5px;">    
                <tr><v-icon color="red">remove</v-icon>{{ props.item.sumFrom }}</tr>
                <tr><v-icon color="green">add</v-icon>{{ props.item.sumTo }}</tr>           
            </td>
                
        </template>
        </v-data-table>

        <v-speed-dial
      
            fixed
            bottom
            right
            :direction='top'
            :transition='slide-y-reverse-transition'
        >
            <v-btn
                slot="activator"
                color="green darken-2"
                dark
                fab
                hover
                v-model="fab"
            >
                <v-icon>touch_app</v-icon>
                <v-icon>close</v-icon>
            </v-btn>
           
            <v-btn
                fab
                dark
                to='/expend'
                color="primary"
            >
                <v-icon>add</v-icon>
            </v-btn>
            <v-btn
                fab
                dark
                small
                color="warning"
                @click="update()"
            >
                <v-icon dark>cached</v-icon>
            </v-btn>

        </v-speed-dial>
    </div>
</template>

<script>

import ModelClass from "./Model";
const Model = new ModelClass();
var  moment = require("moment");
export default {
    data: () =>({
        headers: [
            { text: "id", value: "id", class: "d-none" },
            { text: "Date", value: "date", align:"left", class: "hdata"},
            { text: "Wallet", value: "wallet", align:"left", width: "50%"},  
            { text: "Sum", value: "sum" , align:"left", width: "30%"},
            
        ],
        selected: [],
        items: [],
        showSelect: false,
        offset: 0,
        updating: false
    }),

    beforeMount: function(){
        this.$store.state.title = "Transfers money";
    },

    created() {
        this.getDocs();
    },

    methods: {
        getDocs() {
            this.updating = true;

            Model.transfersIndex(this.offset).then(data =>{
                for (let elem of data) {
                    //elem.walletName = elem.Wallet.name;
                    elem.walletFromName = elem.WalletFrom.name;
                    elem.walletToName = elem.WalletTo.name;

                    let day = moment(elem.date);
                    elem.dateShow = day.format("DD-MM-YYYY");
                    this.items.push(elem);
                }

                this.updating = false;
            }).catch(e=>{
                this.updating = false;    
            })
        }, // end getDocs

        hello() {
            alert("Hello");
        }
    }
}
</script>

<style scoped>

</style>

    

