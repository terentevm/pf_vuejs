<template>
  <div>
    <div slot="header" class="row align-items-center">
      <div class="col">
        <h5 class="h3 mb-0">Select period</h5>
      </div>
    </div>
    <div class="card-body d-flex flex-column align-start">
      <vs-radio v-model="picked" val="1">
        Year
      </vs-radio>
      <vs-radio v-model="picked" val="2">
        Month
      </vs-radio>
      <vs-radio v-model="picked" val="3">
        Week
      </vs-radio>
      <vs-radio v-model="picked" val="4">
        Day
      </vs-radio>
      <vs-radio v-model="picked" val="5">
        Custom
      </vs-radio>
    </div>
    <base-input addon-left-icon="far fa-calendar-alt">
      <flat-picker
        slot-scope="{focus, blur}"
        @on-open="focus"
        @on-close="pickerOnChange"
        :disabled="picked !== '5'"
        :config="{allowInput: true, mode: 'range'}"
        class="form-control datepicker"
        v-model="range"
      />
    </base-input>
    <div class="selection-footer">
      <base-button type="default" @click="saveOnClick">Save changes</base-button>
      <base-button type="secondary" @click="closeOnClick">Close</base-button>
    </div>
  </div>
</template>

<script>
  import BaseInput from '../argon/src/components/BaseInput';
  import BaseButton from '../argon/src/components/BaseButton';
  import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';
  import FlatPicker from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import startOfMonth from 'date-fns/startOfMonth';
  import endOfMonth from 'date-fns/endOfMonth';
  import startOfWeek from 'date-fns/startOfWeek';
  import endOfWeek from 'date-fns/endOfWeek';
  import startOfYear from 'date-fns/startOfYear';
  import endOfYear from 'date-fns/endOfYear';
  import startOfDay from 'date-fns/startOfDay';
  import endOfDay from 'date-fns/endOfDay';
  import format from 'date-fns/format';
  import parse from 'date-fns/parse';
  
  export default {
    name: 'PeriodSelection',
    components: {
      BaseInput,
      BaseButton,
      FlatPicker
    },
    mixins: [DialogMixin],
    props: {
      startDay: {
        type: String,
        default: format(startOfMonth(new Date()), 'yyyy-MM-dd')
      },
      endDay: {
        type: String,
        default: format(endOfMonth(new Date()), 'yyyy-MM-dd')
      }
    },
    data() {
      return {
        picked: '5',
        begin: '',
        end: '',
        range: ["2016-10-10", "2016-10-20"],
      };
    },
    watch: {
      picked: function (val) {
        const now = new Date();
        const opt = {weekStartsOn: 1};

        switch (val) {
          case '1':
            this.begin = startOfYear(now);
            this.end = endOfYear(now);
            break;
          case '2':
            this.begin = startOfMonth(now);
            this.end = endOfMonth(now);
            break;
          case '3':

            this.begin = startOfWeek(now, opt);
            this.end = endOfWeek(now, opt);
            break;
          case '4':
            this.begin = startOfDay(now);
            this.end = endOfDay(now);
            break;
        }

        this.range = [this.begin, this.end];
      }
    },
    beforeMount() {

      this.begin = parse(this.startDay, 'yyyy-MM-dd', new Date());
      this.end = parse(this.endDay, 'yyyy-MM-dd', new Date());

      if (this.options.begin) {
        this.begin = parse(this.options.begin, 'yyyy-MM-dd', new Date());
      }

      if (this.options.end) {
        this.end = parse(this.options.end, 'yyyy-MM-dd', new Date());
      }

      this.range = [this.begin, this.end];
    },
    methods: {
      pickerOnChange(selectedDates) {
        [this.begin, this.end] = selectedDates;
      },

      closeOnClick() {
        this.cancel();
      },

      saveOnClick() {
        this.proceed({
          begin: format(this.begin, 'yyyy-MM-dd'),
          end: format(this.end, 'yyyy-MM-dd'),
        });
      }
    }
  }
</script>

<style scoped>
  .radio {
    display: flex;
    justify-content: start;
  }

  .vs-radio-content {
    justify-content: start;
  }
</style>