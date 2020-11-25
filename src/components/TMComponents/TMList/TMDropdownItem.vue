<template>
    <a
        href="#"
        class="drop-item"
        @click="clickHandler"
    >
        <slot></slot>
    </a>
</template>

<script>
  export default {
    name: "TMDropdownItem",
    methods: {
      clickHandler(){
        console.log('123');
        console.dir(this.$parent);
        this.$emit('click')
      }
    }

  }
</script>

<style scoped>
    .drop-item{
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: flex;
        align-items: center;
        vertical-align: middle;
    }

    /* Change color of dropdown links on hover */
    .drop-item:hover {background-color: #f1f1f1}
</style>