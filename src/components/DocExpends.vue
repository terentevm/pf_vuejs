<template>
    <div v-scroll:#scroll-target="onScroll">
        <v-container class="scroll-y" id="scroll-target">
            <v-layout
                wrap
                v-scroll:#scroll-target="onScroll"
                style="height: 786px"           
            >
                <v-flex xs12 sm12 md12 lg12>
                    <v-btn color="primary" dark  to='/expend' class="mb-2">Add<v-icon dark right>add</v-icon></v-btn>
                    <v-data-table
                    :headers="headers"
                    :items="items"
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
                        <v-btn color="primary" @click="initialize">Reset</v-btn>
                    </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
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
    onScroll(e) {
        if (this.updating == true) {
            return;
        }
        
        this.offsetTop = e.target.scrollTop;
        let currOffset = e.target.scrollTop;
        let maxOffset = e.target.scrollTopMax;

        if (((currOffset / maxOffset) * 100) > 70 ) {
            this.offset += 20;
            this.updating = true;
            this.getDocs(this.offset);
        }
    }
  }
};
</script>