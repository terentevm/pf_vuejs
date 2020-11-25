<template>
  <div class="row mx-0" @click="titleClickHandler">
    <div v-if="isGroup === true" class="list-elem">
      <div class="list-elem-info">
        <i
          v-if="item.collapsed === true"
          class="far fa-folder fa-lg"
          :style="{color: colorApp}"
          @click="iconClickHandler"
        ></i>
        <i
          v-if="item.collapsed === false"
          class="far fa-folder-open fa-lg"
          :style="{color: colorApp}"
          @click="iconClickHandler"
        ></i>
        <span class="list_item_title" @click="titleClickHandler"><b>{{ title }}</b></span>
      </div>
      <div class="list-elem-actions" @click.stop="">
        <base-dropdown
          :icon="'fas fa-ellipsis-v'"
          :hide-arrow="true"
          :position="'right'"
        >
          <li
            class="dropdown-item"
            @click="addSubHandler(item)"
          >
            <span class="align-middle">
              <i class="fas fa-level-down-alt"></i>
              <span class="ml-2">Add subitem</span>
            </span>
          </li>
          <li class="dropdown-item" @click="deleteHandler(item)">
            <span class="align-middle">
              <i class="far fa-trash-alt"></i>
              <span class="ml-2">Delete</span>
            </span>
          </li>
        </base-dropdown>
      </div>
    </div>
    <div v-if="isGroup === false" class="list-elem">
      <div class="list-elem-info">
        <span
          class="list_item_title"
          :class="{ not_active: !item.active }"
          @click="titleClickHandler"
        >{{ title }}</span>
      </div>
      <div class="list-elem-actions" @click.stop="">
        <base-dropdown
          :icon="'fas fa-ellipsis-v'"
          :hide-arrow="true"
          :position="'right'"
        >
          <li
            class="dropdown-item"
            @click="addSubHandler(item)"
          >
            <span class="align-middle">
              <i class="fas fa-level-down-alt"></i>
              <span class="ml-2">Add subitem</span>
            </span>
          </li>
          <li class="dropdown-item" @click="deleteHandler(item)">
            <span class="align-middle">
              <i class="far fa-trash-alt"></i>
              <span class="ml-2">Delete</span>
            </span>
          </li>
        </base-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  import BaseDropdown from '../../../argon/src/components/BaseDropdown';
  export default {
    name: 'TMListElement',
    props: {
      title: {
        type: String,
        default: ''
      },
      isGroup: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        required: true
      }
    },
    components: {
      BaseDropdown,
    },
    data: () => ({
      colorApp: ''
    }),
    beforeMount: function () {
      this.colorApp = this.$vuetify.theme.appColor;
    },
    methods: {
      iconClickHandler(e) {
        e.stopPropagation();
        this.item.collapsed = !this.item.collapsed;
      },

      titleClickHandler(e) {
        e.stopPropagation();
        this.$emit('itemclick', this.item);
      },

      deleteHandler(item) {
        this.$emit('delete', item);
      },

      addSubHandler(item) {
        this.$emit('addsub', item);
      }
    }
  }
</script>

<style scoped>
  .list-elem {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  }

  .list-elem:hover {
    cursor: pointer;
    background-color: rgb(245, 245, 245);
  }

  .list_item_title {
    margin-left: 10px;
  }

  .list-elem-info {
    flex-grow: 1;
  }

  .not_active {
    color: #78909c;
    text-decoration: line-through;
  }

</style>