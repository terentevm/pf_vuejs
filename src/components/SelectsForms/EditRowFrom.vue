<template>
    <v-layout row justify-center>

        <v-dialog max-width="550px" v-model="dialog" persistant class="form-dialog-bottom form-dialog" :fullscreen="$vuetify.breakpoint.smAndDown">
            <v-system-bar window color="appColor" class="form-dialog-top">
                <v-toolbar-title>
                    <span class="title" style="color:white;">New row</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>
                <a @click="close">
                    <v-icon color="white" right>close</v-icon>
                </a>
            </v-system-bar>
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
                                        v-model="editRow.sum"
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

                <v-card-actions class="form-dialog-bottom">
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="saveRow(editRow)">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-layout>
</template>

<script>
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