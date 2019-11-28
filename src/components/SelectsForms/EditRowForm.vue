<template>
    <v-dialog
        v-model="dialog"
        max-width="550px"
        persistent
        class="form-dialog-bottom form-dialog"
        :fullscreen="$vuetify.breakpoint.smAndDown"
    >
        <v-toolbar dense color="appColor" class="form-dialog-top" dark>
            <v-btn flat @click="close">
                Close
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn flat :tabindex="4" @click="saveRow(editRow)">
                Ok
            </v-btn>
        </v-toolbar>
        <v-card class="form-dialog-bottom">
            <v-card-text>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <v-autocomplete
                            v-model="editRow.item"
                            label="Item"
                            :items="items"
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
                            v-model.number.lazy="amount"
                            outline
                            type="number"
                            clearable
                            label="Amount"
                            :tabindex="2"
                        ></v-text-field>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <v-textarea
                            v-model="editRow.comment"
                            outline
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
    import VTextarea from 'vuetify/lib/components/VTextarea';
    import VTextField from 'vuetify/lib/components/VTextField';
    import myNum from '../../helpers/MyNum';

    export default {
        name: 'AddRowFrom',

        components: {
            VAutocomplete,
            VTextarea,
            VTextField
        },
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
                // eslint-disable-next-line vue/require-valid-default-prop
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