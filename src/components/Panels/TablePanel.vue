<template>
  <div class="row mx-0">
    <div class="mx-1"><tm-button :color="'bg-green'" @click="$emit('new')"><i class="fas fa-plus-circle"></i></tm-button></div>
    <div class="mx-1"><tm-button :color="'bg-api'" @click="$emit('copy')"><i class="far fa-clone"></i></tm-button></div>
    <div class="mx-1"><tm-button :color="'bg-danger'" @click="$emit('del')"><i class="far fa-trash-alt"></i></tm-button></div>
  </div>
</template>

<script>
  import TMButton from '../TMComponents/TMButton/TMButton';
  export default {
    name: 'TablePanel',
    components: {
      'tm-button': TMButton
    }
  }
</script>

<style scoped>

</style>