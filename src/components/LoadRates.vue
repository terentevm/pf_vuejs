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
                <v-btn color="info" block :disabled="selected.length == 0 || processing" @click="load()">Load</v-btn>
            </div>     
        </div>
        <v-progress-linear v-show="processing" :indeterminate="true"></v-progress-linear>    
        <div class="row">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                <v-data-table
                    v-model="selected"
                    
                    :items="currencies"
                    select-all
                    item-key="name"
                    hide-headers
                    hide-actions
                >
                <template slot="items" slot-scope="props" >
                    <tr :active="props.selected" @click="props.selected = !props.selected">
                        <td>
                            <v-checkbox
                                :input-value="props.selected"
                                primary
                                hide-details
                            ></v-checkbox>
                        </td>
                        <td class='d-none'>{{ props.item.id }}</td>
                        <td> {{ props.item.name }}</td>
                        <td >{{ props.item.short_name }}</td>
                    </tr>
                </template>
                <template slot="no-data" >
            
                </template>
                </v-data-table>
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
            currencies: 'allCurrencies'
        }),
    },
    

    watch: {
        date (val) {
            this.dateFormatted = this.formatDate(this.date)
        }
    },
    beforeMount: function(){
        this.$store.state.title = "Load rates";
        this.$store.dispatch('getAllCurrencies');
        this.$store.state.componentMenu = [];

        let day = moment();
        this.dateTo = day.format("YYYY-MM-DD");
    },
    methods: {
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
        height: 10px;
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