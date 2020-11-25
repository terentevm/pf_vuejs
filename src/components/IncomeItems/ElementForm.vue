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
      <label for="curr_iso">Title</label>
      <base-input id="curr_title" tabindex="1" placeholder="Title" v-model="formData.name"
                  class="text-default"/>
      <div class="form-group">
        <label for="parent_select">Parent</label>
        <tm-select
          id="parent_select"
          v-model="parent"
          :options="itemsList"
          :title="'name'"
          :clearable="true"
          :select-btn="false"
          :placeholder="'Select parent'"
        />
      </div>
      <div class="form-group">
        <label for="curr_iso">Comment</label>
        <textarea
          v-model="formData.comment"
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="Comment here ..."
        >
        </textarea>
      </div>
      <div class="form-group">
        <base-checkbox v-model="formData.active" :checked="formData.active">Active</base-checkbox>
      </div>
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
  import TMSelect from '../TMComponents/TMSelect/TMSelect';
  import BaseCheckbox from '../../argon/src/components/BaseCheckbox';
  import alert from '../Dialogs/Alert/Alert';

  export default {
    name: 'ElementForm',
    components: {
      Card,
      BaseInput,
      BaseButton,
      VProgressLinear,
      BaseCheckbox,
      'tm-select': TMSelect,
    },
    props: {
      item: {
        type: Object,
        required: true,
      },
      itemsList: {
        type: Array,
        required: true,
      }
    },
    data: () => ({
      headers: [{text: 'Name', value: 'name'}],
      dialog: false,
      title: 'New',
      editedIndex: -1,
      processing: false,
      formData: {
        id: null,
        name: '',
        parent_id: null,
        active: true,
        comment: ''
      },
      headerClasses: ['bg-transparent py-1'],
      footerClasses: ['py-1']
    }),
    computed: {
      parent: {
        get() {
          if (this.formData.parent_id) {
            let parent = this.itemsList.find(item => {
              return item.id === this.formData.parent_id;
            });

            return parent !== undefined ? parent : null;
          }

          return null;
        },

        set(parent) {

          if (parent instanceof Object && parent.hasOwnProperty('id')) {
            this.formData.parent_id = parent.id;
          }
          else {
            this.formData.parent_id = null;
          }

        }
      }
    },
    created: function () {
      this.title = this.item === null ? 'New' : this.item.name;

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
        let msg = `Item ${this.formData.name} has been stored successfully!`;

        try {
          await this.$store.dispatch('storeIncomeItem', this.formData);
        }
        catch (err) {
          console.error(err);
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
          this.$emit('close', true);
        }

      }
    }
  }
</script>