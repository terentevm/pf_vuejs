<template>

  <div v-scroll:#scroll-target="onScroll">

    <v-container
      class="scroll-y"
      id="scroll-target"
    >

    <v-layout
        wrap
        
        v-scroll:#scroll-target="onScroll"
        style="height: 1000px"
     
      >
    <v-flex xs12 sm12 md12 lg12>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New currency<v-icon dark right>add</v-icon></v-btn>
      <v-card>

        <v-toolbar color="green darken-3" dark>
        
            <v-toolbar-title>Currency: {{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon>euro_symbol</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 d-none>
                <v-text-field label="id" v-model="editedItem.id"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Code (ISO)" v-model="editedItem.code"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Char code" v-model="editedItem.short_name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Name" v-model="editedItem.name"></v-text-field>
              </v-flex>
              
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-3" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn color="warning" dark :disabled="updating" class="mb-2" @click="update()">Update<v-icon dark right>cached</v-icon></v-btn>

    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
      
    >
      <template slot="items" slot-scope="props" >
        <td class='d-none'>{{ props.item.id }}</td>
        <td >{{ props.item.code }}</td>
        <td >{{ props.item.name }}</td>
        <td class= 'hidden-md-and-down'>{{ props.item.short_name }}</td>

        <td class="justify-center layout px-0 ">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data" >
        <div class="progress">
          <v-progress-circular indeterminate :size="70" :width="2" color="green"></v-progress-circular>
        </div>
        
      </template>
    </v-data-table>
    </v-flex>
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
  </div>
</template>

<script>

import ModelClass from "./Model";
const Model = new ModelClass();

  export default {
    data: () => ({
      dialog: false,
      formTitle:'New',
      offsetTop: 0,
      offset: 0,
      updating: false,
      headers: [
        { text: 'id', value: 'id' , class: 'd-none'},
        { text: 'Code', value: 'code'},
        { text: 'Name', value: 'name'},
        { text: 'Short name', value: 'short_name', class:"hidden-md-and-down", sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        name: '',
        code: '',
        short_name: ''
      },
      defaultItem: {
        id: null,
        name: '',
        code: '',
        short_name: ''
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
    
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      

      initialize () {
       
        this.getItems(0); 
        
      },
     
     update() {
        if (this.updating == false) {
         this.items = [];
         this.updating = true;
          this.getItems(0);
          
        }
      },
      getItems(offset) {
       
       if (!sessionStorage.getItem('jwt')) {
         this.$router.push({ path: 'login' });
         return false;
       }


       Model.getCurrencies(offset).then(response => {
  
           for (let elem of response){
                this.items.push(elem);
           }
           
           this.updating = false;
           
           
        })
        .catch(e=>{
            
            this.updating = false;
        });

      },
      sendData(item) {

        let isUpdate = false;
        
        if (item.id !== null) {
          isUpdate = true;
        }

       Model.saveCurrency(item, isUpdate).then(response => {
           this.showMsg(true);
           
          this.items= [];
           this.getItems(this.offset);
           this.close();
           return true; 
           
        })
        .catch(e=>{
            this.showMsg(false);
            console.log(e);
            return false;
        });  
      }
      ,
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true,
        this.formTitle = item.short_name;
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
    
    

</style>
