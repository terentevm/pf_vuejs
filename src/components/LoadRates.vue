<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="table-wrapper">
          <div class="row mx-2">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <v-menu
                :close-on-content-click="true"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="dateFrom"
                  label="Begin date"
                  persistent-hint
                  prepend-icon="far fa-calendar-alt"
                  @blur="dateFrom = parseDate(dateFormatted)"
                />
                <v-date-picker
                  v-model="dateFrom"
                  no-title
                  @input="menu1 = false"
                />
              </v-menu>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <v-menu
                :close-on-content-click="true"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="dateTo"
                  label="End date"
                  persistent-hint
                  prepend-icon="far fa-calendar-alt"
                  @blur="dateTo = parseDate(dateFormatted)"
                />
                <v-date-picker
                  v-model="dateTo"
                  no-title
                  @input="menu1 = false"
                />
              </v-menu>
            </div>
          </div>
          <div class="row mx-2">
            <base-button
              type="default"
              block
              :disabled="processing === true"
              @click="load"
            >
              Load rates
            </base-button>
          </div>

          <v-progress-linear
            v-show="processing"
            :indeterminate="true"
          />

          <div class="row mx-2">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <v-list two-line>
                <template v-for="(item) in currencies">
                  <v-list-item
                    :key="item.id"
                    @click="toggle(item)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.short_name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.name }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-action-text
                        v-if="item.rate == null"
                      >
                        The rate isn't loaded
                      </v-list-item-action-text>
                      <v-list-item-action-text
                        v-if="item.rate !== null && item.mult === 1"
                      >
                        {{ item.rate }} {{ mainCurrency.short_name }}
                      </v-list-item-action-text>
                      <v-list-item-action-text
                        v-if="item.rate !== null && item.mult > 1"
                      >
                        {{ item.rate }} {{ mainCurrency.short_name }} for {{ item.mult }} {{ item.short_name }}
                      </v-list-item-action-text>
                      <v-list-item-action>
                        <v-checkbox
                          :input-value="isSelected(item)"
                          primary
                          hide-details
                        />
                      </v-list-item-action>
                    </v-list-item-content>
                  </v-list-item>

                </template>
              </v-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {VDatePicker} from 'vuetify/lib/components/VDatePicker';
  import {
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    VListItemContent,
    VListItemAction,
    VListItemActionText
  } from 'vuetify/lib/components/VList';
  import VMenu from 'vuetify/lib/components/VMenu';
  import VTextField from 'vuetify/lib/components/VTextField';
  import VProgressLinear from 'vuetify/lib/components/VProgressLinear';
  import VCheckbox from 'vuetify/lib/components/VCheckbox'
  import BaseButton from '../argon/src/components/BaseButton';
  import {mapGetters} from 'vuex';
  import ApiClass from '../api/api_laravel';
  import {format} from '../helpers/date';

  const api = new ApiClass();

  export default {
    components: {
      VDatePicker,
      VMenu,
      VTextField,
      VList,
      VListItem,
      VListItemTitle,
      VListItemSubtitle,
      VListItemContent,
      VListItemAction,
      VListItemActionText,
      VProgressLinear,
      VCheckbox,
      BaseButton
    },
    data: () => ({
      dateFrom: null,
      dateTo: null,
      dateFormatted: null,
      selected: [],
      processing: false,
      info: {
        showMsg: false,
        color: 'success',
        message: ''
      }

    }),
    computed: {
      computedDateFrom() {
        return this.formatDate(this.dateFrom);
      },
      ...mapGetters({
        currencies: 'allCurrenciesWithRates',
        mainCurrency: 'sysCurrency'
      }),
    },

    watch: {
      date() {
        this.dateFormatted = this.formatDate(this.date);
      },
    },
    beforeMount: function () {
      this.$store.state.title = 'Load rates';
      this.$store.commit('setupToolbarMenu', {
        mainAction: {
          title: 'close',
          icon: 'reply',
          action: () => {
            this.$router.push({path: '/currencies'});
          }
        }
      });
      this.$store.dispatch('getSettings');
      this.$store.dispatch('getAllCurrenciesWithRates');

      this.dateTo = format(new Date());
    },
    methods: {
      toggle(item) {
        let index = this.selected.findIndex(obj => obj.id === item.id);

        if (index === -1) {
          this.selected.push(item);
        } else {
          this.selected.splice(index, 1);
        }
      },

      isSelected(item) {
        let index = this.selected.findIndex(obj => obj.id === item.id);

        return index === -1 ? false : true;
      },

      formatDate(date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${year}-${month}-${day}`;
      },

      parseDate(date) {
        if (!date) return null;

        const [month, day, year] = date.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      },

      load() {
        if (this.selected.length === 0 || this.dateFrom == null || this.dateTo == null) return;

        let currencies = [];

        this.selected.forEach(item => {
          currencies.push(item.id);
        });

        this.processing = true;

        api.post(
          '/api/tools/loadrates',
          {
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            currencies: currencies,
          }
        )
          .then(() => {
            this.processing = false;
            this.$store.dispatch('getAllCurrenciesWithRates');
            this.showMessage(true, 'Rates was loaded successfully');
          })
          .catch(() => {
            this.processing = false;
            this.showMessage(true, 'Error occurred! Try again!');
          });


      },

      showMessage(success, message) {
        this.info.color = success === true ? 'success' : 'error';
        this.info.message = message;
        this.info.showMsg = true;
      }
    },
  };
</script>

<style scoped>
  .line {
    margin: 0px;
  }

  .groupheader {
    height: 20px;
    vertical-align: middle;
    color: #546e7a;
  }

  .myinput {
    height: 40px;
    margin: 0 auto;
  }

  .myinputRow {
    height: 50px;
  }

  .mySmallRow {
    height: 6%;
  }

  .myDevider {
    height: 10px;
  }
</style>
