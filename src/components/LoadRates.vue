<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm12 md12 lg12>
                <div class="table-wrapper">
                    <v-layout row mx-2>
                        <v-flex xs12 sm12 md12 lg12>
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
                                        prepend-icon="event"
                                        @blur="dateFrom = parseDate(dateFormatted)"
                                ></v-text-field>
                                <v-date-picker v-model="dateFrom" no-title
                                               @input="menu1 = false"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
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
                                        prepend-icon="event"
                                        @blur="dateTo = parseDate(dateFormatted)"
                                ></v-text-field>
                                <v-date-picker v-model="dateTo" no-title
                                               @input="menu1 = false"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-layout row mx-2>
                        <v-btn
                                color="appColor"
                                dark
                                block
                                @click="load"
                                :disabled="this.processing === true"
                        >Load rates
                        </v-btn>
                    </v-layout>

                    <v-progress-linear
                            v-show="processing"
                            :indeterminate="true">
                    </v-progress-linear>

                    <v-layout row mx-2>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-list two-line>
                                <template v-for="(item, index) in currencies">
                                    <v-list-tile :key="item.id" avatar ripple
                                                 @click="toggle(item)">
                                        <v-list-tile-content>
                                            <v-list-tile-title>{{ item.short_name }}
                                            </v-list-tile-title>
                                            <v-list-tile-sub-title>{{ item.name }}
                                            </v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-list-tile-action-text v-if="item.rate == null"
                                            >The rate isn't loaded
                                            </v-list-tile-action-text
                                            >
                                            <v-list-tile-action-text
                                                    v-if="item.rate !== null && item.mult == 1"
                                            >{{ item.rate }} {{mainCurrency.short_name}}
                                            </v-list-tile-action-text
                                            >
                                            <v-list-tile-action-text
                                                    v-if="item.rate !== null && item.mult > 1"
                                            >{{ item.rate }} {{mainCurrency.short_name}} for {{
                                                item.mult }}
                                                {{ item.short_name }}
                                            </v-list-tile-action-text
                                            >
                                            <v-list-tile-action>
                                                <v-checkbox :input-value="isSelected(item)" primary
                                                            hide-details></v-checkbox>
                                            </v-list-tile-action>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider v-if="index + 1 < currencies.length"
                                               :key="index"></v-divider>
                                </template>
                            </v-list>
                        </v-flex>
                    </v-layout>


                </div>
            </v-flex>

            <v-snackbar
                    v-model="info.showMsg"
                    :color="info.color"
                    :timeout="2000"
            >
                {{ info.message }}
                <v-btn
                        dark
                        flat
                        @click="info.showMsg = false"
                >
                    Close
                </v-btn>
            </v-snackbar>

        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ApiClass from '../api/api_laravel';

    const moment = require('moment');
    const api = new ApiClass();

    export default {
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
            date(val) {
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

            this.dateTo = moment().format('YYYY-MM-DD');
        },
        methods: {
            toggle(item) {
                let index = this.selected.findIndex(obj => obj.id == item.id);

                if (index == -1) {
                    this.selected.push(item);
                } else {
                    this.selected.splice(index, 1);
                }
            },

            isSelected(item) {
                let index = this.selected.findIndex(obj => obj.id == item.id);
                if (index == -1) {
                    return false;
                }
                return true;
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
                if (this.selected.length == 0 || this.dateFrom == null || this.dateTo == null) return;

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
                    .then(res => {
                        this.processing = false;
                        this.$store.dispatch('getAllCurrenciesWithRates');
                        this.showMessage(true, 'Rates was loaded successfully');
                    })
                    .catch(err => {
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
