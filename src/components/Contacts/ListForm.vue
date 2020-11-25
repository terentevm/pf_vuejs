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
      <contact-element v-if="dialog" @close="dialog = false" @stored="contactOnStored"/>
    </v-dialog>
    <div class="table-responsive-sm px-0">
      <table class="table table-flush table-hover">
        <thead>
          <tr class="table-head-line text-white thead-bg">
            <th>Name</th>
            <th class="text-right">Act.</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in contacts"
            :key="item.id"
            class="align-items-center border-top-1 clickable"
            @click="edit(item)"
          >
            <td>{{ item.name }}</td>
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
  import VDialog from 'vuetify/lib/components/VDialog';
  import ContactElement from './ElementForm';
  import {mapGetters} from 'vuex';
  import alert from '../Dialogs/Alert/Alert';

  export default {
    name: 'ContactsList',
    components: {
      VDialog,
      'contact-element': ContactElement
    },

    data: () => ({
      dialog: false
    }),
    computed: {
      ...mapGetters({
        contacts: 'contacts'
      })
    },
    async beforeMount() {
      this.$store.state.title = 'Contacts';
      this.$store.commit('setupToolbarMenu', this.getUpMenu());
      await this.$store.dispatch('getContacts');
    },

    methods: {
      getUpMenu() {
        return {
          mainAction: {
            title: 'add',
            icon: 'add',
            action: () => {
              this.add();
            }
          },
          menu: [
            {
              title: 'update',
              icon: 'update',
              action: () => {
                this.update();
              }
            }
          ]
        };
      },

      add() {
        this.dialog = true;
      },

      contactOnStored() {
        this.dialog = false;
        this.update();
      },

      async update() {
        await this.$store.dispatch('startPending');
        await this.$store.dispatch('getContacts');
        await this.$store.dispatch('finishPending');
      },

      edit(contact) {
        this.$store.dispatch('editContact', contact).then(() => {
          this.dialog = true;
        });
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
        const success = await this.$store.dispatch('deleteContact', item);
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
    }
  };
</script>
