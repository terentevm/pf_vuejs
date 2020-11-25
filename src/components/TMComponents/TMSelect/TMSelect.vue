<template>
  <div class="InputAddOn">
    <span v-if="hasPrependIcon" class="InputAddOn-item"><i :class="prependIcon"></i></span>
    <input
      v-bind="scope.search.attributes"
      class="InputAddOn-field"
      v-on="scope.search.events"
    >
    <span v-if="!hasPrependIcon && readOnly !== true" class="InputAddOn-item">
      <i v-if="showList === true" class="fas fa-chevron-up"></i>
      <i v-if="showList === false" class="fas fa-chevron-down"></i>
    </span>
    <button class="InputAddOn-item" v-if="clearable" @click="clear">
      <i class="fas fa-times"></i>
    </button>
    <button v-if="selectBtn && !readOnly" class="InputAddOn-item" @click="btnOpenOnClick">
      <i class="fas fa-ellipsis-h"></i>
    </button>

    <ul class="tm_select_dropdown" :class="{tm_select_dropdown_none: !showList}">
      <li
        v-for="item in filteredList"
        class="tm_select_dropdown_item"
        @click="chooseItem(item)"
      >
        <span v-if="typeof item === 'string'"
              class="tm_select_dropdown_item_title">{{ item }}</span>
        <span v-if="item instanceof Object"
              class="tm_select_dropdown_item_title">{{ item[title] }}</span>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'TMSelect',

    props: {
      id: {
        type: String,
        reqired: true
      },

      options: {
        type: Array,
        required: true,
        default: () => []
      },

      objects: {
        type: Boolean,
        default: true
      },

      title: {
        type: String,
        required: false,
        default: 'name'
      },

      placeholder: {
        type: String,
        default: ''
      },

      value: {
        required: false,
        type: [String, Object]
      },

      autocomplete: {
        type: Boolean,
        default: false
      },

      readOnly: {
        type: Boolean,
        default: false
      },

      clearable: {
        type: Boolean,
        default: false
      },
      selectBtn: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        required: false,
        default: 'md'
      },
      prependIcon: {
        type: String,
        required: false,
      },
      asyncSearch: {
        type: Boolean,
        reqired: false,
        default: false
      }
    },
    data: () => ({
      showList: false,
      search: '',
      currentValue: undefined,
      inputFocused: false,
    }),

    computed: {
      filteredList() {
        return this.options.filter(value => {

          if (value instanceof Object && value.hasOwnProperty(this.title)) {

            return typeof this.search === 'string'
              ? value[this.title].toLowerCase().indexOf(this.search.toLowerCase()) !== -1
              : true;


          }
          else {
            return typeof this.search === 'string'
              ? value.toString().toLowerCase().indexOf(this.search.toLowerCase()) !== -1
              : true;
          }


        });
      },
      scope() {
        return {
          search: {
            attributes: {
              'id': this.id,
              'placeholder': this.placeholder,
              'readonly': this.readOnly,
              'value': typeof this.search == 'string' ? this.search.trim() : this.search,
              'ref': 'search',
              'aria-label': 'Search for option',
              'role': 'combobox',
              'type': 'search',
              'autocomplete': 'off',
            },
            events: {
              'focus': this.onFocus,
              'blur': this.inputBlur,
              'input': this.onInput,
              'keydown': this.onSearchKeyDown,
              'keyup': this.onSearchKeyUp
            }
          }
        }
      },

      classHeight() {
        return this.size;
      },
      hasPrependIcon() {
        return this.prependIcon && typeof this.prependIcon === 'string';
      }
    },

    watch: {
      value(value) {
        this.setSearchFromValue(value);
        this.setCurrentValue(value);
      }
    },

    mounted() {
      document.addEventListener('click', this.closeMenu);

      this.setSearchFromValue(this.value);
      this.setCurrentValue(this.value);
    },

    beforeDestroy() {
      document.removeEventListener('click', this.closeMenu)
    },

    methods: {
      toogleList() {
        this.chooseItem(undefined, true);
      },

      onFocus() {
        if (this.readOnly === true) {
          return;
        }
        this.inputFocused = true;
        this.search = '';
        this.showList = true;
      },

      inputBlur() {
        this.inputFocused = false;
      },

      onInput(e) {
        this.search = e.target.value;

        this.$emit('input', this.search);
        this.showList = true;
      },

      onSearchKeyDown(e) {
        switch (e.keyCode) {
          case 8:
            e.preventDefault();
            return this.deleteHandler(e);

          case 9:
            //  tab
            return this.onTab();
        }
      },
      onSearchKeyUp(e) {
        switch (e.keyCode) {
          case 27:
            //  esc
            return this.onEscape(e);
          case 13:
            //  enter.prevent
            e.preventDefault();
            return this.onEnter();
        }
      },
      onTab() {
        if (this.showList === true) {
          this.chooseItem(undefined, true);
        }
      },

      onEscape(e) {
        e.stopPropagation();
        if (this.showList === true) {
          this.chooseItem(undefined, true);
        }

      },

      onEnter() {

        if (this.showList === true) {

          if (this.filteredList.length === 1) {
            this.chooseItem(this.filteredList[0], false);
          }

        }

      },

      setSearchFromValue(value) {
        if (value instanceof Object && value.hasOwnProperty(this.title)) {
          this.search = value[this.title];
        }
        else {

          this.search = value;
        }

      },

      setCurrentValue(value) {
        this.currentValue = value;
      },

      chooseItem(item, clickOutside = false) {

        if (item === undefined || clickOutside === true) {

          if (this.currentValue) {
            item = typeof this.currentValue === 'string'
              ? this.currentValue
              : Object.assign({}, {...this.currentValue});
          }
        }

        this.setSearchFromValue(item);
        this.setCurrentValue(item);

        this.$emit('input', item);

        this.showList = false;
      },

      closeMenu(e) {

        if (!this.$el.contains(e.target)) {
          if (this.showList) {
            this.chooseItem(undefined, true);
          }

        }

      },

      clear() {

        if (this.readOnly === true) {
          return;
        }

        this.search = '';

        if (this.showList === true) this.showList = false;

        this.$emit('input', null);
      },

      deleteHandler(e) {
        e.stopPropagation();

        if (typeof this.search === 'string' && this.search.length > 0) {
          this.search = this.search.slice(0, -1);
        }

      },

      btnOpenOnClick() {
        this.$emit('open');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../style/variables";

  .InputAddOn {
    position: relative;
    display: flex;
    background: white;
    width: 100%;
  }

  .InputAddOn-field {
    flex: 1;
  }

  .InputAddOn-field:not(:first-child) {
    border-left: 0;
  }

  .InputAddOn-field:not(:last-child) {
    border-right: 0;
  }

  .InputAddOn-item {
    background-color: rgba(147, 128, 108, 0.1);
    color: #666666;
    font: inherit;
    font-weight: normal;

  }

  .InputAddOn-field,
  .InputAddOn-item {
    border: 1px solid rgba(147, 128, 108, 0.25);
    padding: 0.5em 0.75em;
  }

  .InputAddOn-field:first-child,
  .InputAddOn-item:first-child {
    border-radius: 2px 0 0 2px;
  }

  .InputAddOn-field:last-child,
  .InputAddOn-item:last-child {
    border-radius: 0 2px 2px 0;
  }

  .focused {
    -webkit-box-shadow: none;
    border: $tm_wrap_border_focused;
    border-radius: 4px;
    outline: none !important;
  }

  .tm_select_input:focus {
    outline: none !important;
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }

  .tm_select_dropdown {
    display: block;
    position: absolute;
    left: 0;
    top: calc(100% + 0.20rem);
    z-index: 1;
    border-radius: 4px;
    width: 100%;
    min-width: 10rem;
    max-height: 350px;
    overflow-y: auto;
    background: #FFFFFF;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .tm_select_dropdown_item:first-child {
    margin-top: 0.25rem;
  }

  .tm_select_dropdown_item {
    display: flex;
    margin: 0 0.25rem;
    border-radius: 4px;
    align-items: center;
    cursor: pointer;
    height: 50px;
  }

  .tm_select_dropdown_item:hover {
    background-color: #F0F0F0;
  }

  .tm_select_dropdown_item_title {
    font-size: $tm_input_font-size;
    margin-left: 10px;
  }

  .tm_select_dropdown_none {
    display: none;
  }

  .sm {
    height: 30px;
  }

  .md {
    height: 40px;
  }

  .lg {
    height: 50px;
  }

</style>
