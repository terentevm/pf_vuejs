<template>
    <div class="card" style="height: 100%">
        <div class="card-body">
            <h5 class="card-subtitle mb-2 text-muted">
                Set period
            </h5>
            <div class="col-xs-12">
                <div class="row mr-0">
                    <div class="col-4">
                        <v-radio-group v-model="periodId">
                            <v-radio
                                v-for="(current, index) in periods"
                                :key="index"
                                :label="current.title"
                                :value="current.id"
                                color="AppColor"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <div class="col-8">
                        <div v-if="period.manual === false" class="commands mt-3 px-1">
                            <div v-for="(command,index) in commands" :key="index" class="row">
                                <v-btn
                                    block
                                    round
                                    dark
                                    small
                                    color="appColor"
                                    class="mb-3"
                                    @click="command.method"
                                >
                                    {{ command.title }}
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mx-0">
                    <div class="commands mt-1">
                        <div class="row mx-0">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label
                                        for="'custom_begin'"
                                        class="tm-input-label"
                                    >Begin</label>
                                    <date-control
                                        :id="'custom_begin'"
                                        :date="periodCustom.dateBegin"
                                        :height="40"
                                        @change="beginOnChange"
                                    ></date-control>
                                </div>
                            </div>
                        </div>

                        <div class="row mx-0">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <label
                                        for="'custom_end'"
                                        class="tm-input-label"
                                    >End</label>
                                    <date-control
                                        :id="'custom_end'"
                                        :date="periodCustom.dateEnd"
                                        :height="40"
                                        @change="endOnChange"
                                    ></date-control>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row px-2 d-flex">
                <v-btn
                    id="'btn_period_cancel'"
                    @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                    id="'btn_period_apply'"
                    color="success"
                    @click="applyOnClick"
                >
                    Apply
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import {VRadioGroup, VRadio} from 'vuetify/lib/components/VRadioGroup';
    import VBtn from 'vuetify/lib/components/VBtn';
    import TMDateControl from '../TMDateControl/TMDateControl';
    import startOfMonth from 'date-fns/startOfMonth';
    import endOfMonth from 'date-fns/endOfMonth';
    import subMonths from 'date-fns/subMonths';
    import addMonths from 'date-fns/addMonths';
    import addWeeks from 'date-fns/addWeeks';
    import subWeeks from 'date-fns/subWeeks';
    import startOfWeek from 'date-fns/startOfWeek';
    import endOfWeek from 'date-fns/endOfWeek';
    import startOfYear from 'date-fns/startOfYear';
    import endOfYear from 'date-fns/endOfYear';
    import subYears from 'date-fns/subYears';
    import addYears from 'date-fns/addYears';
    import addDays from 'date-fns/addDays';
    import format from 'date-fns/format';
    import subDays from 'date-fns/subDays';

    export default {
        name: 'TMPeriodDialog',
        components: {
            VRadioGroup,
            VRadio,
            VBtn,
            'date-control': TMDateControl
        },
        props: {
            beginOfPeriod: {
                type: String,
                default: '0001-01-01'
            },
            endOfPeriod: {
                type: String,
                default: '0001-01-01'
            },

        },
        data: () => ({
            periodId: 'month',


            periodCustom: {
                dateBegin: '',
                dateEnd: ''
            }
        }),

        computed: {
            periods() {
                return [

                    {
                        id: 'day',
                        title: 'day',
                        manual: false,
                        commands: [
                            {
                                title: 'yesterday',
                                method: this.setDayPeriod.bind(this, 'yesterday')
                            },
                            {
                                title: 'today',
                                method: this.setDayPeriod.bind(this, 'today')
                            },
                            {
                                title: 'tomorrow',
                                method: this.setDayPeriod.bind(this, 'tomorrow')
                            },
                        ]
                    },
                    {
                        id: 'week',
                        title: 'week',
                        manual: false,
                        commands: [
                            {
                                title: 'last week',
                                method: this.setWeekPeriod.bind(this, 'last week')
                            },
                            {
                                title: 'this week',
                                method: this.setWeekPeriod.bind(this, 'this week')
                            },
                            {
                                title: 'next week',
                                method: this.setWeekPeriod.bind(this, 'next week')
                            },
                        ]
                    },
                    {
                        id: 'month',
                        title: 'month',
                        manual: false,
                        commands: [
                            {
                                title: 'last month',
                                method: this.setMonthPeriod.bind(this, 'last month')
                            },
                            {
                                title: 'this month',
                                method: this.setMonthPeriod.bind(this, 'this month')
                            },
                            {
                                title: 'next month',
                                method: this.setMonthPeriod.bind(this, 'next month')
                            },
                        ]
                    },

                    {
                        id: 'year',
                        title: 'year',
                        manual:
                        false,
                        commands:
                        [
                            {
                                title: 'last year',
                                method: this.setYearPeriod.bind(this, 'last year')
                            },
                            {
                                title: 'this year',
                                method: this.setYearPeriod.bind(this, 'this year')
                            },
                            {
                                title: 'next year',
                                method: this.setYearPeriod.bind(this, 'next year')
                            },
                        ]
                    },
                    {
                        id: 'custom',
                        title: 'custom period',
                        manual: true
                    }
                ]
            },

            period() {
                return this.periods.find(item => item.id === this.periodId);
            },

            commands() {
                let params = this.periods.find(item => item.id === this.periodId);

                return params === undefined || params.manual === true ? [] : params.commands;
            }
        },

        beforeMount() {
            this.setMonthPeriod('this month');
        },

        methods: {
            setDayPeriod(subPeriod) {
                let start;
                let end;
                switch (subPeriod) {
                    case 'yesterday':
                        start = subDays(new Date(), 1);
                        end = subDays(new Date(), 1);
                        break;
                    case 'today':
                        start = new Date();
                        end = new Date();
                        break;
                    case 'tomorrow':
                        start = addDays(new Date(), 1);
                        end = addDays(new Date(), 1);
                        break;
                }

                this.periodCustom.dateBegin = format(start, 'yyyy-MM-dd');
                this.periodCustom.dateEnd = format(end, 'yyyy-MM-dd');
            },

            setWeekPeriod(subPeriod) {
                let start;
                let end;
                const options = {weekStartsOn:1}; //first day - monday, last - sunday

                switch (subPeriod) {
                    case 'last week':
                        start = subWeeks(startOfWeek(new Date(), options), 1);
                        end = endOfWeek(start, options);
                        break;
                    case 'this week':
                        start = startOfWeek(new Date(), options);
                        end = endOfWeek(start, options);
                        break;
                    case 'next week':
                        start = addWeeks(startOfWeek(new Date(), options), 1);
                        end = endOfWeek(start, options);
                        break;
                }

                this.periodCustom.dateBegin = format(start, 'yyyy-MM-dd');
                this.periodCustom.dateEnd = format(end, 'yyyy-MM-dd');
            },

            setMonthPeriod(subPeriod) {

                let start;
                let end;
                switch (subPeriod) {
                    case 'this month':
                        start = startOfMonth(new Date());
                        end = endOfMonth(new Date());
                        break;
                    case 'last month':
                        start = subMonths(startOfMonth(new Date()), 1);
                        end = subDays(startOfMonth(new Date()), 1);
                        break;
                    case 'next month':
                        start = addMonths(startOfMonth(new Date()), 1);
                        end = endOfMonth(start);
                        break;
                }

                this.periodCustom.dateBegin = format(start, 'yyyy-MM-dd');
                this.periodCustom.dateEnd = format(end, 'yyyy-MM-dd');
            },

            setYearPeriod(subPeriod) {
                let start;
                let end;
                switch (subPeriod) {
                    case 'last year':
                        start = subYears(startOfYear(new Date()), 1);
                        end = endOfYear(start);
                        break;
                    case 'this year':
                        start = startOfYear(new Date());
                        end = endOfYear(new Date());
                        break;
                    case 'next year':
                        start = addYears(startOfYear(new Date()), 1);
                        end = endOfYear(start);
                        break;
                }

                this.periodCustom.dateBegin = format(start, 'yyyy-MM-dd');
                this.periodCustom.dateEnd = format(end, 'yyyy-MM-dd');
            },

            beginOnChange(date) {
                this.periodCustom.dateBegin = date;
            },

            endOnChange(date) {
                this.periodCustom.dateEnd = date;
            },

            close() {
                this.$emit('cancel');
            },

            applyOnClick() {
                this.$emit('apply', this.periodCustom);
            }
        }

    }
</script>

<style scoped>

</style>