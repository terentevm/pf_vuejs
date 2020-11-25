<template>
  <div class="h-100">
    <card class="h-100" :header-classes="headerClasses" :footer-classes="footerClasses">
      <div slot="header" class="row align-items-center">
        <div class="col">
          <h4 class="text-default text-uppercase ls-1 mb-1">Item: {{ title }}</h4>
        </div>
        <v-progress-linear
          v-if="processing"
          buffer-value="0"
          color="#4193F2"
          indeterminate
          rounded
        />
      </div>
      <label for="cont_name">Name</label>
      <base-input
        id="cont_name"
        tabindex="1"
        placeholder="Contact name"
        v-model.lazy="name"
        class="text-default"
      />

      <label for="cont_phone">Phone number</label>
      <base-input
        id="cont_phone"
        tabindex="1"
        placeholder="Phone number"
        v-model.lazy="phone"
        class="text-default"
      />
      <label for="cont_email">Email</label>
      <base-input
        id="cont_email"
        tabindex="1"
        placeholder="Contact email"
        v-model.lazy="email"
        class="text-default"
      />
      <div slot="footer" class="row align-items-center">
        <div class="col">
        </div>
        <base-button type="secondary" @click="close">
          Cancel
        </base-button>
        <base-button type="success" @click="store()">
          Store
        </base-button>
      </div>
    </card>
  </div>
</template>

<script>
  import Card from '../../argon/src/components/Card';
  import BaseInput from '../../argon/src/components/BaseInput';
  import BaseButton from '../../argon/src/components/BaseButton';
  import VProgressLinear from 'vuetify/lib/components/VProgressLinear';
  import alert from '../Dialogs/Alert/Alert';
  export default {
    name: 'ContactElement',
    components: {
      Card,
      BaseInput,
      BaseButton,
      VProgressLinear
    },
    data: () => ({
      formTitle: 'New',
      processing: false,
      headerClasses: ['bg-transparent py-1'],
      footerClasses: ['py-1']
    }),
    computed: {
      title() {
        if (this.$store.state.contacts.contactFormData.id !== null) {
          return this.$store.state.contacts.contactFormData.name;
        } else {
          return 'new contact';
        }
      },

      name: {
        get() {
          return this.$store.state.contacts.contactFormData.name;
        },

        set(name) {
          this.$store.commit('setContactName', name);
        }
      },
      phone: {
        get() {
          return this.$store.state.contacts.contactFormData.phone;
        },

        set(phone) {
          this.$store.commit('setContactPhone', phone);
        }
      },
      email: {
        get() {
          return this.$store.state.contacts.contactFormData.email;
        },

        set(email) {
          this.$store.commit('setContactEmail', email);
        }
      }
    },

    beforeDestroy() {
      this.$store.commit('setContactFormData', {
        id: null,
        name: '',
        phone: '',
        email: ''
      });
    },

    methods: {
      close() {
        this.$emit('close');
      },

      async store() {
        this.processing = true;

        let success = true;
        let msg = `Item ${name} has been stored successfully!`;

        try {
          await this.$store.dispatch('storeContact');
        }
        catch (err) {

          success = false;

          let status = 'n/a';
          let errorText = 'Error';

          if (err instanceof Object && err.hasOwnProperty('status')) {
            status = err.status;
          }

          if (err instanceof Object && err.hasOwnProperty('data')) {
            if (err.data.hasOwnProperty('error')) {
              errorText = err.data.error;
            }

          }

          msg = `(${status}) ${errorText}`;
        }
        finally {
          this.processing = false;
        }

        this.$vs.notification({
          clickClose: true,
          content: alert({
            alertType: success === true ? 'success' : 'failure',
            msgHeader: 'Result!',
            msgBody: `${msg}`
          }),
        });

        if (success === true) {
          this.$emit('stored', true);
        }

      }
    }
  };
</script>

<style scoped></style>
