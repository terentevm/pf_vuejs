<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <v-card>
            <v-toolbar color="#43425D" dark>
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

        <v-data-table
          :headers="headers"
          :items="items"
          :loading="updating"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="d-none">{{ props.item.id }}</td>
            <td @click="editItem(props.item)">{{ props.item.code }}</td>
            <td @click="editItem(props.item)">{{ props.item.name }}</td>
            <td @click="editItem(props.item)" class="hidden-md-and-down">
              {{ props.item.short_name }}
            </td>
          </template>
          <template slot="no-data"> </template>
        </v-data-table>
      </v-flex>

      <v-fab-transition>
        <v-btn fab fixed bottom right dark @click="add()" color="primary">
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>

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
</template>

<script>
import ModelClass from './Model';
const Model = new ModelClass();
import ApiClass from './Api';
const Api = new ApiClass();

import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    dialog: false,
    formTitle: 'New',
    offsetTop: 0,
    offset: 0,
    updating: false,
    headers: [
      { text: 'id', value: 'id', class: 'd-none' },
      { text: 'Code', value: 'code' },
      { text: 'Name', value: 'name' },
      { text: 'Short name', value: 'short_name', class: 'hidden-md-and-down', sortable: false },
    ],

    editedIndex: -1,
    editedItem: {
      id: null,
      name: '',
      code: '',
      short_name: '',
    },
    defaultItem: {
      id: null,
      name: '',
      code: '',
      short_name: '',
    },
    msgSettings: {
      show: false,
      color: 'light-green darken-3',
      mode: 'vertical',
      timeout: 6000,
      msg: '',
    },
  }),

  computed: mapGetters({
    items: 'allCurrencies',
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  beforeMount: function() {
    this.$store.state.title = 'Currencies';
    this.$store.dispatch('getAllCurrencies');
    this.$store.state.componentMenu = this.getUpMenu();
  },
  methods: {
    getUpMenu() {
      let menu = [];

      const action1 = {
        title: 'Update',
        icon: 'cached',
        action: () => {
          this.update();
        },
      };

      const action2 = {
        title: 'Load rates',
        icon: 'move_to_inbox',
        action: () => {
          this.$router.push({ path: 'loadrates' });
        },
      };
      const action3 = {
        title: 'Add from classifitator',
        icon: 'format_list_bulleted',
        action: () => {
          this.$router.push({ path: 'loadcurrency' });
        },
      };

      menu.push(action1);
      menu.push(action2);
      menu.push(action3);

      return menu;
    },

    update() {
      if (this.updating == false) {
        this.items = [];
        this.updating = true;
        this.$store.dispatch('getAllCurrencies');
        this.updating = false;
      }
    },

    sendData(item) {
      let isUpdate = false;

      if (item.id !== null) {
        isUpdate = true;
      }
      const param = {
        model: 'currency',
        isUpdate: isUpdate,
        data: item,
      };

      Api.save(param).then(success => {
        if (success === true) {
          this.showMsg(true);
          this.update();
          this.close();
          return true;
        } else {
          this.showMsg(false);
          return false;
        }
      });
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      (this.dialog = true), (this.formTitle = item.short_name);
    },
    add() {
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.formTitle = 'New';
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      let ok = this.sendData(this.editedItem);
      if (ok) {
        this.update();
        this.close();
      }
    },

    showMsg(success) {
      this.msgSettings.color = success ? 'light-green darken-3' : 'orange darken-4';
      this.msgSettings.msg = success ? 'Saved/Updated successfully!' : 'Error';
      this.msgSettings.show = true;
    },
  },
};
</script>

<style scoped>
.td_hidden {
  display: none;
}

.progress {
  text-align: center;
  margin: 1rem;
}

#create .speed-dial {
  position: absolute;
}

#create .btn--floating {
  position: relative;
}
</style>
