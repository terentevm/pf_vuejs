<template>

    <v-dialog max-width="550px" v-model="dialog" persistent class="form-dialog-bottom form-dialog"
              :fullscreen="$vuetify.breakpoint.smAndDown">
        <v-toolbar dense color="appColor" class="form-dialog-top" dark>
            <v-btn flat @click="close">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="saveRow(editRow)" :tabindex="4">Ok</v-btn>
        </v-toolbar>
        <v-card class="form-dialog-bottom">
            <v-card-text>

                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <v-autocomplete
                                label="Item"
                                :items="items"
                                v-model="editRow.item"
                                autocomplete="true"
                                cache-items
                                clearable
                                outline
                                single-line
                                item-text="name"
                                item-value="id"
                                return-object
                                :tabindex="1"
                        ></v-autocomplete>
                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <v-text-field
                                outline
                                type="number"
                                clearable
                                v-model.number.lazy="amount"
                                label="Amount"
                                :tabindex="2"
                        ></v-text-field>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <v-textarea
                                outline
                                v-model="editRow.comment"
                                label="Comment"
                                :tabindex="3"
                        >
                        </v-textarea>
                    </div>
                </div>

            </v-card-text>
        </v-card>
    </v-dialog>


</template>

<script>
    import VAutocomplete from 'vuetify/lib/components/VAutocomplete';
    import VTextrerea from 'vuetify/lib/components/VTextarea';
    import VTextField from 'vuetify/lib/components/VTextField';
    import myNum from '../../helpers/MyNum';

    export default {
        name: "AddRowFrom",
        props: {
            dialog: {
                type: Boolean,
                default: false
            },
            editRow: {
                type: Object
            },
            items: {
                type: Array,
                default: []
            }
        },
        data: () => ({
            fullscreen: false
        }),

        computed: {
            amount: {
                get() {
                    return this.editRow.sum;
                },

                set(value) {

                    this.editRow.sum = myNum.round2(Number(value));
                }
            }
        },

        components: {
            VAutocomplete,
            VTextrerea,
            VTextField
        },

        methods: {
            close() {
                this.$emit('close');
            },

            saveRow() {
                this.$emit('done', this.editRow)
            }
        }
    }
</script>

<style scoped>
    .form-dialog-top {
        border-radius: 10px 10px 0 0;
    }

    .form-dialog-bottom {
        border-radius: 0 0 10px 10px;
    }
</style>