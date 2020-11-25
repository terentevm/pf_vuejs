<template>
  <div class="row mx-0 mt-2">
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      attach=".wrapper"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :max-width="'400px'"
    >
      <item-form v-if="dialog" :item="formData" :items-list="itemslist" @close="closeDialog"/>
    </v-dialog>

    <div class="table-wrapper">
      <tm-tree
        :items="items"
        @itemclick="openFormElement"
        @addsub="add"
        @delete="deleteItem"
      />
    </div>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex';
  import ItemElementForm from './ElementForm';
  import TMTree from '../TMComponents/TMList/TMTree'
  import VDialog from 'vuetify/lib/components/VDialog';
  import alert from '../Dialogs/Alert/Alert';

  export default {
    components: {
      'item-form': ItemElementForm,
      'tm-tree': TMTree,
      VDialog
    },
    data: () => ({
      headers: [{text: 'Name', value: 'name'}],

      dialog: false,
      formTitle: 'New',
      editedIndex: -1,

      processing: false,
      formData: {
        id: null,
        name: '',
        parent_id: null,
        active: true,
        comment: ''
      },

    }),
    computed: {
      ...mapGetters({
        items: 'allIncomeItemsHierarchically',
        itemslist: 'allIncomeItems'
      }),
    },

    beforeMount: function () {
      this.$store.state.title = 'Income items';
      this.update();
      this.$store.commit('setupToolbarMenu', this.getUpMenu());
    },

    methods: {
      getUpMenu() {
        return {
          mainAction: {
            title: 'add',
            icon: 'add',
            action: () => {
              this.add();
            },
          },
          menu: [
            {
              title: 'update',
              icon: 'update',
              action: () => {
                this.update();
              },
            }
          ]
        }

      },

      add(parent) {

        const parentId = parent === undefined ? null : parent.id;

        this.formData = {
          id: null,
          name: '',
          parent_id: parentId,
          active: true,
          comment: ''
        };

        this.dialog = true;
      },

      update() {
        this.$store.dispatch('getAllIncomeItemsHierarchically');
      },

      openFormElement(item) {

        this.copyObject(this.formData, item);
        this.dialog = true;
      },


      closeDialog(stored) {
        this.dialog = false;

        this.formData = {
          id: null,
          name: '',
          parent_id: null,
          active: true,
          comment: ''
        };

        if (stored === true) {
          this.update();
        }
      },

      async deleteItem(item) {

        try {
          await this.$dialog.confirm(`Do you want to delete ${item.name}?`, {
            view: 'delete-confirmation', // can be set globally too
            html: true,
            animation: 'fade',
            backdropClose: true
          });
        }
        catch (e) {
          return;
        }

        await this.$store.dispatch('startPending');
        const success = await this.$store.dispatch('deleteIncomeItem', item);
        await this.$store.dispatch('finishPending');

        const msg = success === true
          ? `${item.name} has been deleted`
          : `${item.name} hasn't been deleted`;

        this.$vs.notification({
          clickClose: true,
          content: alert({
            alertType: success === true ? 'success' : 'failure',
            msgHeader: 'Result!',
            msgBody: `${msg}`
          }),
        });

        if (success === true) {
          this.update();
        }
      },
    },
  };
</script>