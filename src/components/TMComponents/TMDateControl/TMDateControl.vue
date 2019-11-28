<template>
    <div class="tm_select_wrapper">
        <div class="tm_select_input_wrapper">
            <v-menu
                v-model="dateSelection"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="inherit"
                min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <input
                        slot="activator"
                        type="text"
                        :value="date"
                        aria-label="Date"
                        aria-describedby="document date"
                        class="date-input"
                        readonly
                        v-on="on"
                    >
                </template>
                <v-date-picker
                    header-color="appColor"
                    :value="date"
                    @change="dateOnChange"
                    @input="dateSelection = false"
                >
                </v-date-picker>
            </v-menu>
        </div>
        <div class="btn_wrapper">
            <button type="button" class="btn-move-date" @click="subDay">
                <i class="material-icons" style="fill: #394066">arrow_back_ios</i>
            </button>
            <button type="button" class="btn-move-date" @click="addDay">
                <i class="material-icons">arrow_forward_ios</i>
            </button>
        </div>
    </div>
</template>

<script>
    import {VDatePicker} from 'vuetify/lib/components/VDatePicker';

    import VMenu from 'vuetify/lib/components/VMenu';
    import parse from 'date-fns/parse';
    import addDays from 'date-fns/addDays';
    import format from 'date-fns/format';
    import subDays from 'date-fns/subDays';

    export default {
        name: 'TMDateControl',

        components: {
            VMenu,
            'v-date-picker': VDatePicker,
        },
        props: {
            date: {
                type: String,
                required: true
            },
            label: {
                type: String,
                default: 'Date'
            }
        },

        data: () => ({
            dateSelection: false,
        }),

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
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../style/variables";

    .tm_select_wrapper {
        position: relative;
        display: flex;
    }

    .tm_select_input_wrapper {
        display: flex;

        width: 100%;
        border: $tm_wrap_border;
        border-radius: 4px;
        padding-right: 5px;
    }



    .date-input {
        display: block;
        position: relative;
        flex: 1 1 auto;
        width: 1%;
        height: $tm_component_height;

        text-transform: lowercase;
        font-variant: small-caps;
        border-radius: 4px;
        line-height: 1.4;
        font-size: $tm_input_font-size;

        padding: 0 7px;

    }
    .btn_wrapper {
        display: flex;
    }
    .select_with_icon {
        display: flex;
        flex-direction: row;
        align-items: center;

    }

    .btn-move-date {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: $tm_component_height;
        width: 36px;
        border: $tm_wrap_border;
        border-radius: 4px;
        margin-left: 3px;
        margin-right: 3px;
        fill: #394066;
        line-height: 1.4;
    }

    .btn-move-date:hover {
        background: #b5d5fb;
    }
</style>