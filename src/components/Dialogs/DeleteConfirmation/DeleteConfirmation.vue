<template>
  <div class="custom-view-wrapper">
    <div class="card-body">
      <h5 class="card-title">Delete confirmation</h5>
      <p class="card-text">
        {{ messageBody }}
      </p>
      <div class="row d-flex flex-row justify-content-between">
        <a href="#" class="btn btn-primary" @click.stop="decline">Cancel</a>
        <a href="#" class="btn btn-danger" @click.stop="confirm">Confirm</a>
      </div>
    </div>
  </div>
</template>

<script>
  import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'; // Include mixin
  export default {
    mixins: [DialogMixin],
    methods: {
      decline(e) {
        e.preventDefault();
        this.cancel();
      },
      confirm(e) {
        e.preventDefault();
        this.proceed(); // included in DialogMixin
      }
    },
  };
</script>

<style scoped="">
  button {
    width: 100%;
    margin-bottom: 10px;
    float: none;
  }
</style>