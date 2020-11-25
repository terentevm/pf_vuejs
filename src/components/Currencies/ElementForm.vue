<template>
  <div class="h-100">
    <card class="h-100" :header-classes="headerClasses" :footer-classes="footerClasses">
      <div slot="header" class="row align-items-center">
        <div class="col">
          <h4 class="text-default text-uppercase ls-1 mb-1">Currency: {{ title }}</h4>
        </div>
        <svg class="lang lang-select-dropdown-item-flag" width="30px" height="30px">
          <use :xlink:href="getSvgId(formData.short_name)"/>
        </svg>
        <v-progress-linear
          v-if="processing"
          buffer-value="0"
          color="#4193F2"
          indeterminate
          rounded
        />
      </div>
      <label for="curr_iso">Title</label>
      <base-input id="curr_title" placeholder="Title" v-model="formData.name" class="text-default"/>
      <label for="curr_iso">Code (ISO)</label>
      <base-input id="curr_iso" placeholder="Code (ISO)" v-model="formData.code" class="text-default"/>
      <label for="curr_iso">Char code</label>
      <base-input id="curr_char_code" placeholder="Char code" v-model="formData.short_name" class="text-default"/>

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

  export default {
    name: 'CurrencyElement',
    components: {
      Card,
      BaseInput,
      BaseButton,
      VProgressLinear
    },
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      title: 'New',
      formData: {
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
      processing: false,
      headerClasses: ['bg-transparent py-1'],
      footerClasses: ['py-1']
    }),

    created: function () {
      this.title = this.item === null ? 'New' : this.item.short_name;

      if (this.item) {
        this.formData = Object.assign({}, this.item);
      }
    },

    methods: {
      close() {
        this.$emit('close');
      },

      async store() {

        this.processing = true;

        let success = true;
        let msg = `Currency ${this.formData.name} has been stored successfully!`;

        try {
          await this.$store.dispatch('storeCurrency', this.formData);
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

        this.processing = false;

        this.$vs.notification({
          sticky: true,
          progress: 'auto',
          color: success === true ? 'success' : 'danger',
          position: 'top-center',
          title: 'Store status',
          text: msg
        });

        if (success === true) {
          this.$emit('close', true);
        }
      },

      getSvgId(title) {
        return `#${title.toLowerCase()}`;
      },
    },
  };
</script>

<style scoped>

  .tm-dialog {
    margin-left: -16px;
    margin-right: -16px;
    margin-top: -10px;
  }

  .dialog-header {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
</style>
