<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex xs12 sm12 md12 lg12>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-toolbar color="#43425D" dark>
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
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

          <v-card class="pt-3">
            <v-progress-linear :indeterminate="true" v-show="updating"></v-progress-linear>
            <v-list dense>
              <v-list-group
                v-model="item.active"
                v-for="item in items"
                v-if="item.hasChild === true"
                :key="item.id"
                no-action
              >
                <v-list-tile slot="activator">
                  <v-list-tile-avatar tile :size="16">
                    <v-btn icon class="mx-0" @click="editItem(item)">
                      <img src="@/assets/list_group.png" alt="" />
                    </v-btn>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile
                  v-for="subItem in item.items"
                  :key="subItem.name"
                  @click="editItem(subItem)"
                >
                  <v-list-tile-avatar tile :size="16">
                    <img src="@/assets/list_element.png" alt="" />
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
              <template v-for="(item, index) in items" v-if="item.hasChild === false">
                <v-list-tile v-model="item.active" :key="item.id" @click="editItem(item)">
                  <v-list-tile-avatar tile :size="16">
                    <img src="@/assets/list_element.png" alt="" height="16px" width="16px" />
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
  </div>
</template>

<script>
import ModelClass from './Model';

const Model = new ModelClass();
import ApiClass from './Api';
const Api = new ApiClass();
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    headers: [{ text: 'Name', value: 'name' }],

    dialog: false,
    formTitle: 'New',
    editedIndex: -1,
    updating: false,
    processing: false,
    editedItem: {
      id: null,
      name: '',
      parentid: null,
      parent: null,
      notActive: '',
    },
    defaultItem: {
      id: null,
      name: '',
      parentid: null,
      parent: null,
      notActive: '',
    },
    msgSettings: {
      show: false,
      color: 'light-green darken-3',
      mode: 'vertical',
      timeout: 6000,
      msg: '',
    },
  }),

  computed: {
    ...mapGetters({
      items: 'allExpenseItemsHierarchically',
    }),
  },

  beforeMount: function() {
    this.$store.state.title = 'Expenditure items';
    this.$store.dispatch('getAllExpenseItemsHierarchically');
    this.$store.state.componentMenu = this.getUpMenu();
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
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

      menu.push(action1);

      return menu;
    },

    add() {
      this.dialog = true;
    },

    update() {
      this.$store.dispatch('getAllExpenseItemsHierarchically');
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      (this.dialog = true), (this.formTitle = item.name);
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
      let isUpdate = false;

      if (this.editedItem.id !== null) {
        isUpdate = true;
      }

      if (this.editedItem.parent !== null) {
        this.editedItem.parentid = this.editedItem.parent;
      }

      this.processing = true;

      Api.save({ isUpdate: isUpdate, model: 'expenditureitems', data: this.editedItem }).then(
        success => {
          this.processing = false;
          this.showMsg(success);
          this.close();
          this.items = [];
          this.$store.dispatch('getAllExpenseItemsHierarchically');
        },
      );
    },

    showMsg(success) {
      this.msgSettings.color = success ? 'light-green darken-3' : 'orange darken-4';
      this.msgSettings.msg = success ? 'Saved/Updated successfully!' : 'Error';
      this.msgSettings.show = true;
    },
  },
};
</script>
