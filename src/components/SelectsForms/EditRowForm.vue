<template>
  <modal :show.sync="dialog">
    <template slot="header">
      <h5 class="modal-title" id="exampleModalLabel">Select item</h5>
    </template>
    <div>
      <div class="row">
        <div class="col">
          <tm-select
            v-model="editRow.item"
            :value="editRow.item"
            :objects="true"
            :options="items"
          />
        </div>
        <div class="col">
          <tm-input
            :id="'sel-item-sum'"
            :input-type="'number'"
            :value="editRow.sum"
            v-model.number="editRow.sum"
          />
        </div>
      </div>
      <textarea
        class="form-control"
        v-model="editRow.comment"
        id="comment"
        rows="3"
        placeholder="Comment ..."/>
    </div>
    <template slot="footer">
      <tm-button type="secondary" @click="$emit('close')">Close</tm-button>
      <tm-button type="primary" @click="saveRow">Save changes</tm-button>
    </template>
  </modal>
</template>

<script>
  import Modal from '../../argon/src/components/Modal';
  import TMButton from '../TMComponents/TMButton/TMButton';

  export default {
    name: 'AddRowFrom',

    components: {
      Modal,
      'tm-button': TMButton
    },
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      editRow: {
        type: Object
      },
      items: {
        type: Array,
        // eslint-disable-next-line vue/require-valid-default-prop
        default: []
      }
    },
    data: () => ({
      fullscreen: false
    }),

    methods: {
      close() {
        this.$emit('close');
      },

      saveRow() {
        this.$emit('done', this.editRow)
      }
    }
  }
</script>

<style scoped>
  .con-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .con-footer .vs-button {
    margin: 0px;
  }

  .con-footer .vs-button .vs-button__content {
    padding: 10px 30px;
    font-size: 30px;
  }

  .con-footer .vs-button ~ .vs-button {
    margin-left: 10px;
  }

  .not-margin {
    margin: 0px;
    font-weight: normal;
    padding: 10px;
    padding-bottom: 0px;
  }

  .con-content {
    width: 100%;
  }

  .con-content p {
    font-size: 0.8rem;
    padding: 0px 10px;
  }

  .con-content .vs-checkbox-label {
    font-size: 0.8rem;
  }

  .con-content .vs-input-parent {
    width: 100%;
  }

  .con-content .vs-input-content {
    margin: 10px 0px;
    width: calc(100%);
  }

  .con-content .vs-input-content .vs-input {
    width: 100%;
  }

  .footer-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: calc(100%);
  }

  .footer-dialog .new {
    margin: 0px;
    margin-top: 20px;
    padding: 0px;
    font-size: 0.7rem;
  }

  .footer-dialog .new a {
    color: rgba(var(--vs-primary), 1) !important;
    margin-left: 6px;
  }

  .footer-dialog .new a:hover {
    text-decoration: underline;
  }

  .footer-dialog .vs-button {
    margin: 0px;
  }
</style>