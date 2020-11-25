<template>
  <div class="tm_date_wrapper">
    <tm-input id="input-date-controll" v-model="date" prepend-icon="far fa-calendar-alt">
      <flat-picker
        slot-scope="{focus, blur}"
        @on-open="focus"
        @on-close="dateOnChange"
        :config="{allowInput: true, mode: 'single', disableMobile: true}"
        class="InputAddOn-field datepicker"
        v-model="date"
      />
    </tm-input>
  </div>
</template>

<script>
  import FlatPicker from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import childComponents from '../TMSelect/childComponents';
  import parse from 'date-fns/parse';
  import addDays from 'date-fns/addDays';
  import format from 'date-fns/format';
  import subDays from 'date-fns/subDays';

  export default {
    name: 'TMDateControl',

    components: {
      FlatPicker,
    },
    props: {
      date: {
        type: [String, Array],
        required: true
      },
      label: {
        type: String,
        default: 'Date'
      },
      height: {
        type: Number,
        default: 50
      },
      clearable: {
        type: Boolean,
        default: true
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },

    data: () => ({
      dateSelection: false,
    }),
    computed: {
      childComponents() {
        return {
          ...childComponents
        };
      },
    },
    mounted() {
      console.log(this.date);
    },

    methods: {
      dateOnChange(newDate) {
        this.$emit('change', newDate);
      },

      addDay() {
        let current = parse(this.date, 'yyyy-MM-dd', new Date());
        this.$emit('change', format(addDays(current, 1), 'yyyy-MM-dd'));
      },

      subDay() {
        let current = parse(this.date, 'yyyy-MM-dd', new Date());
        this.$emit('change', format(subDays(current, 1), 'yyyy-MM-dd'));
      },

      clear() {
        this.$emit('change', '');
      }
    }
  }
</script>