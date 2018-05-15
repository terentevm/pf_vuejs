<template>
    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <v-data-table
            :headers="headers"
            :items="items"
            :loading="updating"
            hide-actions
            class="elevation-1"
        >
            <template slot="items" slot-scope="props" >
                <td class='d-none'>{{ props.item.id }}</td>               
                <td ><v-icon color="red">remove</v-icon> {{ props.item.date }}</td>             
                
                <td>
                    <tr>
                        <td >{{ props.item.walletFromName }}</td>
                        <td >{{ props.item.sumFrom }}</td>
                    </tr>
                    <tr>
                       <td >{{ props.item.walletToName }}</td>
                       <td >{{ props.item.sumTo }}</td> 
                    </tr>
                </td>
                             
                <td class="justify-center layout px-0 ">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                        <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="pink">delete</v-icon>
                    </v-btn>
                </td>
            </template>
    
            <template slot="no-data">
                            
            </template>
        </v-data-table>
    </div>
</template>

<script>

import ModelClass from "./Model";
const Model = new ModelClass();

export default {
    data: () =>({
        headers: [
            { text: "id", value: "id", class: "d-none" },
            { text: "Date", value: "date", class: "xs4 sm4 md4" },
            { text: "Wallet", value: "wallet" },  
            { text: "sum", value: "sum" },
            
        ],
        items: [],
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
                    this.items.push(elem);
                }

                this.updating = false;
            }).catch(e=>{
                this.updating = false;    
            })
        }
    }
}
</script>
