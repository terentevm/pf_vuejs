<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm12 md12 lg12>
                <v-dialog v-model="dialog" max-width="350" persistent>
                    <v-card>
                        <v-toolbar color="appColor" dark>
                            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>shopping_basket</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12 d-none>
                                        <v-text-field
                                                label="id"
                                                v-model="formData.id"></v-text-field>
                                    </v-flex>

                                    <v-flex xs12 sm12 md12>
                                        <v-autocomplete
                                                label="Parent"
                                                :items="itemslist"
                                                v-model="formData.parent_id"
                                                :cache-items=true
                                                item-text="name"
                                                item-value="id"
                                                :clearable=true
                                        ></v-autocomplete>

                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field label="Name"
                                                      v-model="formData.name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-checkbox
                                                v-model="formData.active"
                                                color="primary"
                                                label="Active item"
                                        ></v-checkbox>

                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="blue darken-1" flat @click.native="close">Cancel
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-3" flat @click.native="save">Save</v-btn>
                        </v-card-actions>

                        <v-progress-linear :indeterminate="true"
                                           v-show="processing"></v-progress-linear>

                    </v-card>
                </v-dialog>

                <div class="table-wrapper">
                    <tm-tree
                            :items="items"
                            @itemclick="openFormElement"
                    ></tm-tree>
                </div>
            </v-flex>

        </v-layout>
    </v-container>

</template>

<script>

    import ApiClass from '../api/api_laravel';
    import {mapGetters} from 'vuex';
    import TMTree from './Reusable/TMList/TMTree'

    const api = new ApiClass();

    export default {
        data: () => ({
            headers: [{text: 'Name', value: 'name'}],

            dialog: false,
            formTitle: 'New',
            editedIndex: -1,

            processing: false,
            formData: {
                id: null,
                name: '',
                parent_id: null,
                active: true,
                comment: ''
            },

        }),
        components: {
            'tm-tree': TMTree
        },
        computed: {
            ...mapGetters({
                items: 'allIncomeItemsHierarchically',
                itemslist: 'allIncomeItems'
            }),
        },

        beforeMount: function () {
            this.$store.state.title = 'Income items';
            this.$store.dispatch('getAllIncomeItemsHierarchically');
            this.$store.commit('setupToolbarMenu', this.getUpMenu());
        },

        watch: {
            dialog(val) {
                val || this.close();
            },
        },

        methods: {
            getUpMenu() {
                return {
                    mainAction: {
                        title: 'add',
                        icon: 'add',
                        action: () => {
                            this.add();
                        },
                    },
                    menu: [
                        {
                            title: 'update',
                            icon: 'update',
                            action: () => {
                                this.update();
                            },
                        }
                    ]
                };
            },

            add() {
                this.formTitle = 'New';

                this.formData = {
                    id: null,
                    name: '',
                    parent_id: null,
                    active: true,
                    comment: ''
                };

                this.dialog = true;
            },

            update() {
                this.$store.dispatch('getAllIncomeItemsHierarchically');
            },

            openFormElement(item) {

                this.copyObject(this.formData, item);

                (this.dialog = true), (this.formTitle = item.name);
            },


            close() {
                this.dialog = false;
            },

            save() {

                this.processing = true;

                const res_promise = this.formData.id === null
                    ? api.store('itemsincome', this.formData)
                    : api.update('itemsincome', this.formData.id, this.formData);


                res_promise.then(res => {
                    this.close();
                    this.update();
                })
                    .catch(err => {
                        alert('Error!')
                    }).finally(() => {
                    this.processing = false;
                })
            },
        },
    };
</script>

<style scoped>

    .node {
        background-color: #00acc1;
    }
</style>