<template>
  <nav class="form-toolbar">
    <v-btn color="green darken-2" dark @click="clickSave" small :loading="processing"
      ><v-icon left>check_circle</v-icon>Save
      <span slot="loader" class="custom-loader">
        <v-icon dark>cached</v-icon>
      </span>
    </v-btn>

    <v-btn color="#43425D" small dark @click="clickCancel"
      ><v-icon dark left>cancel</v-icon>Cancel</v-btn
    >
  </nav>
</template>

<style lang="scss" scoped>
.form-toolbar {
  display: flex;
  width: 100%;
  color: white;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<script>
export default {
  props: ['processing'],
  methods: {
    clickSave() {
      if (this.processing === false) {
        setTimeout(() => {
          this.$emit('tm-save-form');
        }, 200);
      }
    },

    clickCancel() {
      this.$emit('tm-cancel-form');
    },
  },
};
</script>
