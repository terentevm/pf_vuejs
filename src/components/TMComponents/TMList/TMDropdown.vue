<template>
    <div class="dropdown">
        <i class='bx bx-dots-vertical-rounded bx-sm dropbtn'
           :style="{color: colorApp}"
           v-on:click.stop="toogleMenu"
        ></i>
        <div v-if="showMenu === true" class="dropdown-content" @click="toggleMenu">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: "TMDropdown",
    data: () => ({
      showMenu: false
    }),
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
    }
  }
</script>

<style scoped>
    /* Style The Dropdown Button */
    .dropbtn {
        cursor: pointer;
        margin-left: 15px;
    }

    /* The container <div> - needed to position the dropdown content */
    .dropdown {
        position: relative;
        display: inline-block;
        margin-left: 15px;
    }

    /* Dropdown Content (Hidden by Default) */
    .dropdown-content {
        display: block;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        right: 0;
    }

    /* Links inside the dropdown */


</style>