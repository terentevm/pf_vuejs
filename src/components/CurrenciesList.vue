<template>

  <div v-scroll:#scroll-target="onScroll">
  <v-layout column justify-center align-center>
      <v-subheader>Offset Top</v-subheader>
      {{ offsetTop }}
    </v-layout>
    <v-container

class="scroll-y"
      id="scroll-target"
    >

    <v-layout
        wrap
        align-center
        justify-center
        v-scroll:#scroll-target="onScroll"
        style="height: 1000px"
     
      >
    <v-flex xs12 sm12 md12 lg12>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Dessert name" v-model="editedItem.name"></v-text-field>
              </v-flex>
              <v-flex xs112 sm6 md4>
                <v-text-field label="Calories" v-model="editedItem.calories" class="hidden-md-and-down"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Fat (g)" v-model="editedItem.fat"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Carbs (g)" v-model="editedItem.carbs"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Protein (g)" v-model="editedItem.protein"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
      
    >
      <template slot="items" slot-scope="props" >
        <td>{{ props.item.ind }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.sum }}</td>

        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    </v-flex>
    </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

  export default {
    data: () => ({
      dialog: false,
      offsetTop: 0,
      offset: 0,
      headers: [
        { text: 'Index', value: 'ind' },
        { text: 'Name', value: 'name' },
        { text: 'Sum', value: 'sum' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        ind: 0,
        name: '',
        sum: 0
      },
      defaultItem: {
        ind: 0,
        name: '',
        sum: 0
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
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

      getItems(offset) {
        axios({
            method: 'GET',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/json'
                },
           
            url: 'http://localhost:8080/endless/index.php?offset=' + this.offset
        }).then(response => {
           
           for (let elem of response.data){
                this.items.push(elem);
           }
           
           
           
        })
        .catch(e=>{
            console.log(e);
            
        });
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.items.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          this.items.push(this.editedItem)
        }
        this.close()
      },

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