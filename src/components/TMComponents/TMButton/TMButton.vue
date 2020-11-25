<template>
  <div>
    <button
      class="tm-button"
      :class="classes"
      @click="clickHandler"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'tm-button',
    props: {
      size: {
        type: String,
        required: false,
        default: 'sm',
        validator: function (value) {
          return ['sm', 'md', 'lg'].indexOf(value) !== -1;
        }
      },
      rounded:{
        type: Boolean,
        required: false,
        default: false
      },
      block:{
        type: Boolean,
        required: false,
        default: false
      },
      icon: {
        type: String,
        default: "",
        description: "Button icon"
      },
      color: {
        type: String,
        required: false,
        default: 'bg-default'
      }
    },
    computed: {
      classes() {
        let btnClasses = [
          { 'btn-block': this.block },
          { 'rounded': this.rounded },
          // { "btn-icon-only": this.iconOnly },
          // { [`text-${this.textColor}`]: this.textColor },
          { 'btn-icon': this.icon || this.$slots.icon },
          // this.type && !this.outline ? `btn-${this.type}` : "",
          // this.outline ? `btn-outline-${this.type}` : ""
        ];
        if (this.size) {
          btnClasses.push(this.size);
        }

        if (this.color) {
          btnClasses.push(this.color);
        }

        return btnClasses;
      }
    },
    methods: {
      clickHandler(event) {
        this.$emit('click', event)
      }
    }
  }
</script>

<style scoped lang="scss">
  $snow: #fff;
  $navy: #2c3e50;
  $red: #e74c3c;
  $chalk: #ecf0f1;
  $ocean: #3498db;
  $api: #2980b9;
  $coal: #4d4d4d;
  $drab: #3f4036;
  $teal: #8da681;
  $jason: #bf2806;
  $darkRed: #8c1d04;
  $green: #3e6a00;

  .tm-button {
    font-size: 1.2em;
    color: $snow;
    font-weight: 400;
    text-transform: uppercase;
    padding: 11px 20px 11px 20px;
    cursor: pointer;
    box-shadow: none;
    border-radius: 2px;
    outline: none;
    &:hover {

      box-shadow: 0 4px 5px 0 rgba(50, 50, 50, 0.75);
      border-radius: 2px;
    }
  }

  .rounded {
    border-radius: 5px;
  }

  .sm {
    font-size: 0.8em;
    padding: 7px 20px 7px 20px;
  }

  .md {
    font-size: 0.9em;
    padding: 10px 20px 10px 20px;
  }

  .lg {
    font-size: 1em;
    padding: 10px 20px 10px 20px;
  }

  .navy { background: $navy; }
  .red { background: $red; }
  .ocean { background: $ocean; }
  .api { background: $api; }
  .chalk { background: $chalk; color: $coal; }

  .drab { background: $drab; }
  .teal { background: $teal; }
  .jason { background: $jason; }
  .darkRed { background: $darkRed; }
  .green { background: $green; }
</style>