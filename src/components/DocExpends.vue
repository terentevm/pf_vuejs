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
        <td class='d-none'>{{ props.item.id }}</td>
                        
        <td ><v-icon color="red">remove</v-icon> {{ props.item.date }}</td>
                        
        <td >{{ props.item.walletName }}</td>
        <td >{{ props.item.sum }}</td>
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
    
    <div class="text-xs-center pt-2">
      <v-btn outline  color="success" :loading="updating" :disabled="updating" @click="addDocs">load</v-btn>
    </div>
    
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
</v-flex>

</template>

<script>
import ModelClass from "./Model";
const Model = new ModelClass();

export default {
  data: () => ({
    items: [],
    offsetTop: 0,
    offset: 0,
    updating: false,
    headers: [
      { text: "id", value: "id", class: "d-none" },
      { text: "Date", value: "date", class: "xs4 sm4 md4" },
      { text: "Wallet", value: "wallet" },
      { text: "Sum", value: "sum" }
    ]
  }),

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

    getDocs() {
      if (!sessionStorage.getItem("jwt")) {
        this.$router.push({ path: "login" });
        return false;
      }

        Model.getExpends(this.offset)
        .then(data => {
          for (let elem of data) {
            elem.walletName = elem.Wallet.name;
            this.items.push(elem);
          }

          this.updating = false;
        })
        .catch(e => {
          console.log(e);
          this.updating = false;
        });
    },
    editItem (item) {
      
       let id = item.id
       this.$router.push({ path: `expend/${ id }`}); 
    },
    addDoc() {
        this.$router.push({ path: `expend`}); 
    },
    
    addDocs() {
        
        if (this.updating == true) {
            return;
        }
        
        this.offset += 20;
        this.updating = true;
        this.getDocs(this.offset);
        
    }
  }
};
</script>

<style scoped>
 
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