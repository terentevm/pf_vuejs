<template>
 <div >

    <v-container
      
    >
    <v-layout
       
     >
    <v-flex xs12 sm12 md12 lg12>

        <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New item<v-icon dark right>add</v-icon></v-btn>
      <v-card>

        <v-toolbar color="green darken-3" dark>
        
            <v-toolbar-title>Item: {{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon>shopping_basket</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 d-none>
                <v-text-field label="id" v-model="editedItem.id"></v-text-field>
              </v-flex>
              
              <v-flex xs12 sm12 md12>
              <v-select
          label="Parent"
          :items="items"
          v-model="editedItem.parent"
          item-text="name"
          item-value="id"
          autocomplete
        >
          
        </v-select> 
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

        <v-card>

        <v-list>
          <v-list-group
            v-model="item.active"
            v-for="item in items"
            v-if ="item.hasChild === true"
            :key="item.id"
            
            no-action
          >
            <v-list-tile slot="activator" >

            <v-list-tile-avatar>
                <v-btn icon class="mx-0" @click="editItem(item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
              </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           
            <v-list-tile v-for="subItem in item.items" :key="subItem.name" @click="">
              <v-list-tile-avatar>
                <v-btn icon class="mx-0" @click="editItem(subItem)">
                <v-icon color="teal">edit</v-icon>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>{{ subItem.action }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-divider></v-divider>
          <template v-for="(item, index) in items" v-if ="item.hasChild === false">
          <v-list-tile 
            v-model="item.active"
            :key="item.id"
            @click=""
            >
            
            
            <v-list-tile-avatar>
                <v-btn icon class="mx-0" @click="editItem(item)">
                <v-icon color="teal">edit</v-icon>
                </v-btn>
              </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.name"></v-list-tile-title>
            </v-list-tile-content>
           
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
          </template>
        </v-list>
      </v-card>

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
import axios from "axios";

export default {
    data: () =>({
        items: [],
        dialog: false,
        formTitle:'New',
        editedIndex: -1,
        editedItem: {
            id: null,
            name: '',
            parent_id: null,
            parent:null,
            notActive: ''
        },
        defaultItem: {
            id: null,
            name: '',
            parent_id: null,
            parent:null,
            notActive: ''
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
    
    created () {
            this.initialize()
        },
    
    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    methods: {
      
        
        initialize () {
       
            this.getItems(0); 
        
        },
        
        
        getItems(offset) {
            
            if (!sessionStorage.getItem('jwt')) {
                this.$router.push({ path: 'login' });
                return false;
            }

            let jwt = sessionStorage.getItem('jwt');
            let AUTH_TOKEN = " Bearer " + jwt;
            axios({
                    method: 'GET',
                    headers: { 
                        "Authorization": AUTH_TOKEN,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'text/json'
                        },
                
                    url: 'http://pf/app/expenditureitems/index'
                }).then(response => {
        
                for (let elem of response.data){
                        this.items.push(elem);
                }
                
                this.updating = false;
           
           
        })
        .catch(e=>{
            console.log(e);
            this.updating = false;
        });

      },
    
    editItem (item) {
       
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true,
        this.formTitle = item.name;
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
      
      /////////
    }
  }
</script>