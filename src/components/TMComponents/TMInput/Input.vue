<template>
  <div class="InputAddOn">
    <span v-if="hasPrependIcon" class="InputAddOn-item"><i :class="prependIcon"></i></span>
    <slot v-bind="slotData">
      <input
        class="InputAddOn-field"
        :readonly="readOnly"
        v-bind="scope.search.attributes"
        v-on="listeners"
      >
    </slot>
    <button class="InputAddOn-item" v-if="clearable" @click="clear">
      <i class="fas fa-times"></i>
    </button>
    <button class="InputAddOn-item" @click="select">
      <i class="fas fa-ellipsis-h"></i>
    </button>
  </div>
</template>

<script>
  import myNum from '../../../helpers/MyNum';
  export default {
    name: 'Input',
    props: {
      id: {
        type: String,
        required: true
      },

      placeholder: {
        type: String,
        default: ''
      },

      value: {
        required: true
      },

      inputType: {
        type: String,
        default: 'text'
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
        default: true
      },

      textColor: {
        type: String,
        default: '#000000'
      },
      size: {
        type: String,
        required: false,
        default: 'md'
      },
      prependIcon: {
        type: String,
        required: false,
      }
    },
    data: () => ({
      showList: false,
      inputFocused: false,
      currentValue: '',
      styleObject: {
        color: '#000000'
      }
    }),
    computed: {
      scope() {
        return {
          search: {
            attributes: {
              'id': this.id,
              'placeholder': this.placeholder,
              'readonly': this.readOnly,
              'value': this.inputValue,
              'ref': 'search',
              'aria-label': 'Input value',
              'role': 'textbox',
              'type': this.inputType,
              'autocomplete': this.autocomplete,
              'autofocus': true
            }
          }
        }
      },
      listeners() {
        return {
          ...this.$listeners,
          'input': (e) => this.inputValue = e.target.value,
          'focus': this.onInputFocus,
          'blur': this.inputBlur
        };
      },
      slotData() {
        return {
          focused: this.inputFocused,
          ...this.listeners
        };
      },
      inputValue: {
        get() {
          return this.value;
        },

        set(value) {

          const newValue = this.inputType === 'number'
            ? myNum.round2(Number(value))
            : value;

          this.$emit('input', newValue);

        }
      },
      classHeight() {
        return this.size;
      },
      hasPrependIcon() {
        return this.prependIcon && typeof this.prependIcon === 'string';
      }

    },

    mounted() {
      this.inputValue = this.value;
      this.styleObject.color = this.textColor;

    },

    methods: {
      setInternalValue(value) {
        this.inputValue = value;
      },

      clear(event) {
        this.inputValue = this.inputType === 'number' ? 0 : '';
        this.$emit('clear', event);
      },

      select(event) {
        this.$emit('select', event);
      },

      onInputFocus(e) {
        this.inputFocused = true;
        this.$emit('focus', e);
      },

      inputBlur(e) {
        this.inputFocused = false;
        this.$emit('blur', e);
      }
    }
  }
</script>

<style scoped>
  .InputAddOn {
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
</style>