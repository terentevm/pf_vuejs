<template>

    <div class="tm_select_wrapper">
        <div class="tm_select_input_wrapper">
            <v-menu
                    :close-on-content-click="false"
                    v-model="dateSelection"
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
    import moment from 'moment';

    export default {
        name: "TMDateControl",
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

        components: {
            VMenu,
            'v-date-picker': VDatePicker,
        },

        methods: {
            dateOnChange(newDate) {
                this.$emit('change', newDate);
            },

            addDay() {
                this.$emit('change', moment(this.date).add(1, 'day').format('YYYY-MM-DD'));
            },

            subDay() {
                this.$emit('change', moment(this.date).subtract(1, 'day').format('YYYY-MM-DD'));
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
        flex-grow: 1;
        height: $tm_component_height;
        min-width: 100%;
        /*border: 1px solid #566787;*/
        /*background: #dfe5fb;*/
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