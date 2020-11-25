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
      <wallet-element v-if="dialog" :item="formData" @close="close"/>
    </v-dialog>
    <div class="table-responsive-sm px-0">
      <table class="table table-flush table-hover">
        <thead>
          <tr class="table-head-line thead-bg text-white">
            <th>Title</th>
            <th>Currency</th>
            <th class="text-right">Act.</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="align-items-center border-top-1 clickable"
            @click="edit(item)"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.currency.short_name }}</td>
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
  import WalletElement from './ElementForm';
  import VDialog from 'vuetify/lib/components/VDialog';
  import {mapGetters} from 'vuex';
  import ApiClass from '../../api/api_laravel';
  import alert from '../Dialogs/Alert/Alert';

  const api = new ApiClass();

  export default {
    components: {
      'wallet-element': WalletElement,
      VDialog
    },
    data: () => ({
      dialog: false,
      modelName: 'wallet',
      showDeleteConfirmation: false,
      itemForDel: null,
      dialogCB: false,
      formTitle: 'New',
      title: 'Wallets',
      processing: false,
      offsetTop: 0,
      offset: 0,
      updating: false,
      curr: null,
      headers: [
        {text: 'id', value: 'id', classList: ['d-none']},
        {text: 'Name', value: 'name', classList: ['lg5']},
        {text: 'Currency', value: 'currencyName', classList: ['lg5']},
      ],
      element_id: '',
      editedIndex: -1,
      formData: {
        id: null,
        name: '',
        currency_id: '',
        currency: null,
        is_creditcard: false,
        grace_period: 0,
        credit_limit: 0,
        currentBalance: 0,
        newBalance: 0,
        block_currency: false
      },
      formDataNew: {
        id: null,
        name: '',
        currency_id: '',
        currency: null,
        is_creditcard: false,
        grace_period: 0,
        credit_limit: 0,
        currentBalance: 0,
        newBalance: 0,
        block_currency: false
      },
    }),
    computed: {
      ...mapGetters({
        items: 'allWalletsList',

      }),
    },

    beforeMount: function () {
      this.$store.state.title = 'Wallets';
      this.$store.dispatch('getAllWalletsList');

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
        };
      },

      update() {
        if (this.updating === false) {
          this.updating = true;
          this.$store.dispatch('getAllWalletsList');
          this.updating = false;
        }
      },

      edit(item) {

        this.element_id = item.id;

        api.show('wallets', item.id, {withbalance: true})
          .then(wallet => {

            this.formData = Object.assign({}, wallet);
            this.dialog = true;

          })
          .catch(err => {
            console.dir(err);
          });


      },

      add() {
        this.formData = Object.assign({}, this.formDataNew);
        this.dialog = true;
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
        const success = await this.$store.dispatch('deleteWallet', item);
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
          this.close();
          this.items = [];
          this.getItems(this.offset);
        }
      },
      showMsg(success) {
        this.msgSettings.color = success ? 'light-green darken-3' : 'orange darken-4';
        this.msgSettings.msg = success ? 'Saved/Updated successfully!' : 'Error';
        this.msgSettings.show = true;
      }
    },
  };
</script>
<style scoped>

  li:nth-of-type(odd) {
    background-color: #fcfcfc;
  }

  li:first-child {
    background: #435d7d;
  }

  .list-header {
    background: #435d7d;
    color: #fff;
    font-family: 'Varela Round', sans-serif;
    font-size: 15px;
    font-weight: bold;

  }

  .list-item {
    color: rgb(86, 103, 135);;
    font-family: 'Varela Round', sans-serif;
    font-size: 15px;

  }

  .list-item:hover {
    cursor: pointer;
    background-color: rgb(245, 245, 245);

  }

  list-item:nth-of-type(odd) {
    background-color: #fcfcfc;
  }

  list-item:hover {
    background: #f5f5f5;
  }

  .cell-actions {
    display: flex;
    flex-direction: row;
    justify-items: center;
    max-width: 60px;
  }
</style>