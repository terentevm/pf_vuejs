<template>
    <v-layout row justify-center>

        <v-dialog max-width="550px" v-model="dialog" persistant class="form-dialog-bottom form-dialog" :fullscreen="$vuetify.breakpoint.smAndDown">
            <v-toolbar dense color="appColor" class="form-dialog-top" dark>
                <v-btn flat @click="close">Close</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat @click="saveRow(editRow)">Ok</v-btn>
            </v-toolbar>
            <v-card class="form-dialog-bottom">
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout row>
                            <v-flex xs12 sm6 md6 lg6>
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
                                ></v-autocomplete>
                            </v-flex>
                            <v-flex xs12 sm6 md6 lg6>
                                <v-text-field
                                        outline
                                        type="number"
                                        clearable
                                        v-model.number.lazy="amount"
                                        label="Amount"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12>
                                <v-textarea outline v-model="editRow.comment"
                                            label="Comment"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-layout>
</template>

<script>

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