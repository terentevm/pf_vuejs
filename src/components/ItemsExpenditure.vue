<template>
 <div >

    <v-container
      
    >
    <v-layout
       
     >
    <v-flex xs12 sm12 md12 lg12>

      <v-dialog v-model="dialog" max-width="500px">
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
        <v-progress-linear :indeterminate="true" v-show="processing"></v-progress-linear>
      </v-card>
    </v-dialog>


    <v-card class ="pt-3">
        <v-progress-linear :indeterminate="true" v-show="updating"></v-progress-linear>
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
           
            <v-list-tile v-for="subItem in item.items" :key="subItem.name" @click="editItem(subItem)">
              <v-list-tile-avatar>
                 <v-btn icon class="mx-1" @click="editItem(subItem)">
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
            @click="editItem(item)"
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
        @click="add()"
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
import ApiClass from "./Api";
const Api = new ApiClass();

export default {
    data: () =>({
        headers: [{ text: 'Name', value: 'name'}],
        items: [],
        dialog: false,
        formTitle:'New',
        editedIndex: -1,
        updating: false,
        processing: false,
        editedItem: {
            id: null,
            name: '',
            parentid: null,
            parent:null,
            notActive: ''
        },
        defaultItem: {
            id: null,
            name: '',
            parentid: null,
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
    beforeMount: function(){
      this.$store.state.title = "Expenditure items";
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
        
        add(){
          this.dialog = true;
        },
        
        update() {
          this.getItems(0);
        },

        getItems(offset) {
            
            if (!sessionStorage.getItem('jwt')) {
                this.$router.push({ path: 'login' });
                return false;
            }

            if (offset == 0) {
              this.items = [];
            }

            
            this.updating = true;
            Api.index({model: "expenditureitems"}).then(data => {
              
              for (let elem of data){
                this.items.push(elem);
              }
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

        let isUpdate = false;
        
        if (this.editedItem.id !== null) {
          isUpdate = true;
        }

        if (this.editedItem.parent !== null) {
          this.editedItem.parentid = this.editedItem.parent 
        }

        this.processing = true;
        Model.saveExpenditureItems(this.editedItem, isUpdate).then((resp)=>{
          this.showMsg(true);
          this.processing =  false;
          this.close();
          this.items= [];
          this.getItems(this.offset);
        }).catch((e)=>{
          this.processing = false;
          this.showMsg(false);
        });
        
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