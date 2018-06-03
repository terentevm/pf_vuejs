<template>
    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
    
        <div class="row groupheader">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                <p class="caption " >Load rates in period</p>
            </div> 
        </div>     
        <div class="row myinputRow">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                <v-menu
                    ref="menu1"
                    :close-on-content-click="false"
                    v-model="menu1"
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
                <v-date-picker v-model="dateFrom" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
            </div>
        </div>
        <div class="row myinputRow">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                <v-menu
                    ref="menu1"
                    :close-on-content-click="false"
                    v-model="menu1"
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
                <v-date-picker v-model="dateTo" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
            </div>
        </div>
        <div class="row myDevider"></div>
        <div class="row">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                <v-btn color="info" block :disabled="processing" @click="load()">Load</v-btn>
            </div>     
        </div>
        <v-progress-linear v-show="processing" :indeterminate="true"></v-progress-linear>    
        <div class="row">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                <v-list two-line>
                    <template v-for="(item, index) in currencies">
                        <v-list-tile
                            :key="item.short_name"
                            avatar
                            ripple
                            @click="toggle(item)"
                        >
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.short_name }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ item.name }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-list-tile-action-text v-if="item.rate == null">The rate isn't loaded</v-list-tile-action-text>
                                <v-list-tile-action-text v-if="item.rate !== null && item.mult == 1">{{ item.rate }} CZK</v-list-tile-action-text>
                                <v-list-tile-action-text v-if="item.rate !== null && item.mult > 1">{{ item.rate }} CZK for {{ item.mult }} {{ item.short_name }}</v-list-tile-action-text>
                                <v-list-tile-action>
                                    <v-checkbox
                                        :input-value=" isSelected(item)"
                                        primary
                                        hide-details
                                    ></v-checkbox>
                                </v-list-tile-action>
                            </v-list-tile-action>    
                        </v-list-tile>
                        <v-divider v-if="index + 1 < currencies.length" :key="index"></v-divider>
                    </template>
                </v-list>
            </div>
        </div>

    </div>
    
    
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
var moment = require("moment");
import ApiClass from "./Api";
const Api = new ApiClass();

export default {
    data: () => ({
        dateFrom: null,
        dateTo: null,
        dateFormatted: null,
        selected: [],
        processing: false
    }),

    computed: {
        
        computedDateFrom () {
            return this.formatDate(this.dateFrom)
        },
        ...mapGetters({
            currencies: 'allCurrenciesWithRates'
        }),
    },
    

    watch: {
        date (val) {
            this.dateFormatted = this.formatDate(this.date)
        }
    },
    beforeMount: function(){
        this.$store.state.title = "Load rates";
        this.$store.dispatch('getAllCurrenciesWithRates');
        this.$store.state.componentMenu = [];

        let day = moment();
        this.dateTo = day.format("YYYY-MM-DD");
    },
    methods: {
        toggle (item) {
            
            let index = this.selected.findIndex(obj => obj.id == item.id);

            if (index == -1) {
                this.selected.push(item)    
            }
            else {
                this.selected.splice(index , 1);
            }
            

        },

        isSelected(item) {
            let index = this.selected.findIndex(obj => obj.id == item.id);
            if (index == -1) {
                return false;
            }
            return true;
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${year}-${month}-${day}`
        },
        
        parseDate (date) {
            if (!date) return null

            const [month, day, year] = date.split('-')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },

        load() {

            this.processing = true;
            
            if (this.dateFrom == null || this.dateTo == null) {
                this.processing = false;
                return;
            }

            let currencies = [];
            for (let item of this.selected) {
                currencies.push(item.id);
            }

            const params = {
                url: "/currency/load",
                data: {
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo,
                    currencies: currencies
                }
            };

            Api.save(params).then(success =>{
                this.$store.dispatch('getAllCurrenciesWithRates');
                this.processing = false;    
            });
            
        }
    }
}

</script>

<style scoped>
    .line {
        margin: 0px;
    }

    .groupheader {
        height: 20px;
        vertical-align: middle;
        color: #546E7A 
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