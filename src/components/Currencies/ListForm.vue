<template>
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 px-0">
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      attach=".wrapper"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :max-width="'400px'"
    >
      <currency-element v-if="dialog" :item="formData" @close="closeDialog"/>
    </v-dialog>
    <div class="table-responsive-sm px-0">
      <table class="table table-flush table-hover thead-light">
        <thead>
          <tr class="table-head-line thead-bg text-white">
            <th>Title</th>
            <th>Code</th>
            <th class="d-none d-md-block">ISO</th>
            <th class="text-right">Act.</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="align-items-center border-top-1 clickable table-row"
            @click="edit(item)"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.code }}</td>
            <td class="d-none d-md-block">{{ item.short_name }}</td>
            <td>
              <a
                slot="title"
                class="nav-link nav-link-icon text-right"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                @click.stop="delItem(item)"
              >
                <i class="far fa-trash-alt fa-lg"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

  import currencyElement from './ElementForm';
  import {mapGetters} from 'vuex';
  import VDialog from 'vuetify/lib/components/VDialog';
  import BaseTable from '../../argon/src/components/BaseTable';
  import alert from '../Dialogs/Alert/Alert';
  import '../../style/tables.scss';

  export default {
    components: {
      VDialog,
      BaseTable,
      'currency-element': currencyElement,
    },
    data: () => ({
      title: 'Currencies',
      modelName: 'currency',
      showDeleteConfirmation: false,
      itemForDel: null,
      dialog: false,
      id: null,
      editItem: null,
      updating: false,
      processing: false,
      headers: [
        {text: 'id', value: 'id', visibility: 'd-none'},
        {text: 'Code', value: 'code', visibility: ''},
        {text: 'Name', value: 'name', visibility: ''},
        {
          text: 'Short name',
          value: 'short_name',
          visibility: 'hidden-md-and-down',
          sortable: false,
          class: 'th_font'
        },
      ],

      editedIndex: -1,
      formData: {
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

    created: function () {
      this.$store.commit('setupToolbarMenu', this.getUpMenu());
    },

    async beforeMount() {
      this.$store.state.title = 'Currencies';
      await this.update();

    },
    methods: {
      getUpMenu() {
        return {
          mainAction: {
            title: 'Add',
            icon: 'fas fa-plus-circle',
            action: () => {
              this.add();
            },
          },
          menu: [
            {
              title: 'Update',
              icon: 'fas fa-sync',
              action: () => {
                this.update();
              },
            },
            {
              title: 'Load rates',
              icon: 'fas fa-download',
              action: () => {
                this.$router.push({path: 'loadrates'});
              },
            },
            {
              title: 'Add from classifier',
              icon: 'far fa-list-alt',
              action: () => {
                this.$router.push({path: 'loadcurrency'});
              },
            }
          ]
        }

      },

      async update() {
        await this.$store.dispatch('startPending');
        await this.$store.dispatch('getAllCurrencies');
        await this.$store.dispatch('finishPending');
      },


      edit(item) {
        this.id = item.id;
        this.editedIndex = this.items.indexOf(item);
        this.formData = Object.assign({}, item);

        this.dialog = true;
      },

      add() {
        this.id = null;

        this.formData = {
          id: null,
          name: '',
          code: '',
          short_name: '',
        };

        this.dialog = true;
      },

      closeDialog(stored) {
        this.dialog = false;
        this.formData = {
          id: null,
          name: '',
          code: '',
          short_name: '',
        };

        if (stored === true) {
          this.update();
        }
      },

      async delItem(item) {
        try {
          await this.$dialog.confirm(`Do you want to delete ${item.name}?`, {
            view: 'delete-confirmation', // can be set globally too
            html: true,
            animation: 'fade',
            backdropClose: true
          });
        }
        catch(e) {
          return;
        }

        await this.$store.dispatch('startPending');
        const success = await this.$store.dispatch('deleteCurrency', item);
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

      showDeleteConfirm(item) {
        this.itemForDel = item;
        this.showDeleteConfirmation = true;
      },
    },
  };
</script>
