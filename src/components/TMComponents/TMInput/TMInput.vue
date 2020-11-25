<template>
  <div class="tm_input_wrapper" :class="{focused: inputFocused === true}">
    <input
      class="tm_input"
      v-bind="scope.search.attributes"
      :style="styleObject"
      v-on="scope.search.events"
    >
    <div v-if="clearable && !readOnly" class="tm_input_btn_wrapper" :class="classHeight">
      <button class="tm_input_btn" type="button" @click="clear">
        <component :is="childComponents.Clear" class="tm_icon"></component>
      </button>
    </div>
  </div>
</template>

<script>
  import childComponents from '../TMSelect/childComponents';
  import myNum from '../../../helpers/MyNum';

  export default {
    name: 'TMInput',
    components: {...childComponents},
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
      childComponents() {
        return {
          ...childComponents
        };
      },
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

            },

            events: {
              'input': (e) => this.inputValue = e.target.value,
              'focus': this.onInputFocus,
              'blur': this.inputBlur
            }
          }
        }
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
      }

    },

    mounted() {
      this.inputValue = this.value;
      this.styleObject.color = this.textColor;

      const input = document.getElementById(this.id);
      input.focus();
    },

    methods: {
      setInternalValue(value) {
        this.inputValue = value;
      },

      clear() {
        this.inputValue = this.inputType === 'number' ? 0 : '';
        this.$emit('clear');
      },
      onInputFocus() {

        this.inputFocused = true;
        this.$emit('focus');
      },

      inputBlur() {
        this.inputFocused = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../style/variables";

  .tm_input_wrapper {
    display: flex;

    width: 100%;
    border: $tm_wrap_border;
    border-radius: 4px;
    padding-right: 5px;
    background-color: white;
  }

  .focused {
    -webkit-box-shadow: none;
    border: $tm_wrap_border_focused;
    border-radius: 4px;
    outline: none !important;
  }

  .tm_input {
    flex-grow: 1;
    margin: 0;
    padding-left: 10px;
    font-size: $tm_input_font-size;
    outline: none !important;
  }

  .tm_input:focus {
    outline: none;
  }

  .tm_input_btn_wrapper {
    margin: 0;
    padding: 0;
  }

  .tm_input_btn {
    width: 30px;
    height: 100%;
    outline: none;
  }

  .tm_icon {
    fill: $tm_icon_color;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
  }

  .tm_icon:hover {
    fill: $tm_icon_hover_color;
  }
</style>