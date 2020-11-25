<template>
    <div class="row d-flex flex-row justify-content-between mx-0">
        <div class="d-flex flex-row justify-start">
            <vs-button
                circle
                icon
                style="max-width: 100px"
                @click="addOnClick()"
            >
                <i class='bx bx-message-square-add'></i>
                Add
            </vs-button>

            <vs-button
                v-if="showDel === true"
                icon
                danger
                style="max-width: 100px"
                @click="delOnClick()"
            >
                <i class='bx bx-x-circle'></i>
                Delete
            </vs-button>
        </div>
        <div class="total d-flex justify-content-end align-center">
            <slot></slot>
        </div>

    </div>
</template>

<script>
  import VSButton from 'vuesax/dist/vsButton';
  export default {
    name: "TableActionPanel",
    components: {
      'vs-button':VSButton,
    },
    props: {
      showDel: {
        type: Boolean,
        default: false
      }
    },
    methods:{
      addOnClick() {
        this.$emit('AddNewRow');
      },
      delOnClick() {
        this.$emit('DeleteRows');
      }
    }
  }
</script>

<style scoped>

</style>