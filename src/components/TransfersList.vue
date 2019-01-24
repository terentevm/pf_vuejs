<template>
  <div class="col-12 col-sm-12 col-md-12 col-lg-12">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="updating"
      hide-actions
      class=" mytable"
      id="MyTable"
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td style="padding: 0 10px;" v-show="showSelect">
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
          <td class="d-none">{{ props.item.id }}</td>
          <td style="padding: 0 5px;" @click="editDoc(props.item)">{{ props.item.dateShow }}</td>

          <td style="padding: 0 5px;" @click="editDoc(props.item)">
            <tr>
              {{
                props.item.walletFromName
              }}
            </tr>
            <tr>
              {{
                props.item.walletToName
              }}
            </tr>
          </td>

          <td style="padding: 0 5px;" @click="editDoc(props.item)">
            <tr>
              <v-icon color="red">remove</v-icon
              >{{
                props.item.sumFrom
              }}
            </tr>
            <tr>
              <v-icon color="green">add</v-icon
              >{{
                props.item.sumTo
              }}
            </tr>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-btn outline color="success" :loading="updating" :disabled="updating" @click="addDocs"
        >more</v-btn
      >
    </div>

    <v-fab-transition>
      <v-btn fab fixed bottom right dark to="/transfer" color="primary">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import ModelClass from './Model';
const Model = new ModelClass();

import ApiClass from './Api';
const Api = new ApiClass();

var moment = require('moment');
export default {
  data: () => ({
    headers: [
      { text: 'id', value: 'id', class: 'd-none' },
      { text: 'Date', value: 'date', align: 'left', class: 'hdata' },
      { text: 'Wallet', value: 'wallet', align: 'left', width: '50%' },
      { text: 'Sum', value: 'sum', align: 'left', width: '30%' },
    ],
    selected: [],
    items: [],
    showSelect: false,
    offset: 0,
    updating: false,
  }),

  beforeMount: function() {
    this.$store.state.title = 'Transfers money';
    this.$store.state.componentMenu = this.getUpMenu();
  },

  created() {
    this.getDocs();
  },

  methods: {
    getUpMenu() {
      let menu = [];

      const action1 = {
        title: 'Update',
        icon: 'cached',
        action: () => {
          this.offset = 0;
          this.getDocs();
        },
      };

      const action2 = {
        title: 'Delete',
        icon: 'delete',
        action: () => {
          this.update();
        },
      };

      menu.push(action1);
      menu.push(action2);

      return menu;
    },
    getDocs() {
      this.updating = true;
      const settings = {
        model: 'expenditure',
        conditions: {
          limit: 50,
          offset: this.offset,
        },
      };
      Api.index({ model: 'transfer' }).then(data => {
        for (let elem of data) {
          elem.walletFromName = elem.WalletFrom.name;
          elem.walletToName = elem.WalletTo.name;

          let day = moment(elem.date);
          elem.dateShow = day.format('DD-MM-YYYY');
          this.items.push(elem);
        }

        this.updating = false;
      });
    }, // end getDocs

    update() {
      this.getDocs();
    },
    addDocs() {
      if (this.updating == true) {
        return;
      }

      this.offset += 20;
      this.updating = true;
      this.getDocs(this.offset);
    },

    addDoc() {
      this.$router.push({ path: `transfer` });
    },

    editDoc(item) {
      let id = item.id;
      this.$router.push({ path: `transfer/${id}` });
    },

    showDelBtn() {
      this.showSelect = !this.showSelect;
    },
    deleteItem(item) {
      let id = item.id;
      let url = `/transfer/delete?id=${id}`;
      Model.delete(url)
        .then(response => {
          const index = this.items.indexOf(item);
          this.items.splice(index, 1);
          alert('Deleted');
        })
        .catch(e => {
          alert('Not deleted!');
        });
    },
  },
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
