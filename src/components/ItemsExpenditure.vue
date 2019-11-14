<template>

    <div class="row">

        <v-dialog v-model="dialog" max-width="500" persistent
                  :fullscreen="$vuetify.breakpoint.smAndDown">

            <div class="card" style="height: 100%">
                <div class="card-header appColor text-white">
                    {{ formTitle }}
                </div>

                <div class="card-body">
                    <div class="row d-flex">
                        <div class="col-xs-12">
                            <div class="d-flex">
                                <div class="form-group mx-1">
                                    <label for="parent_select" class="tm-lable">Parent:</label>

                                    <tm-select
                                            id="parent_select"
                                            v-model="parent"
                                            :options="itemslist"
                                            :title="'name'"
                                            :clearable="true"
                                            :select-btn="false"
                                            :placeholder="'Select parent'"
                                    ></tm-select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row d-flex">
                        <div class="col-xs-12">
                            <div class="d-flex flex-wrap">
                                <div class="form-group mx-1">
                                    <label for="item_income_title" class="tm-lable">Title:</label>
                                    <tm-input
                                            v-model="formData.name"
                                            :placeholder="'Title'"
                                            :id="'item_income_title'"
                                            :input-type="'text'"
                                            :clearable="true"
                                    ></tm-input>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="row">

                        <div class="form-group mx-1">
                            <div class="d-flex justify-start">
                                <tm-checkbox v-model="formData.active"></tm-checkbox>
                                <p class="tm-lable ml-2">The item is active</p>
                            </div>


                        </div>

                    </div>

                </div>
                <v-progress-linear v-show="this.processing" :indeterminate="true" class="my-0">
                </v-progress-linear>
                <div class="card-footer text-muted">
                    <div class="row d-flex justify-content-between">
                        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>

                        <v-btn color="green darken-3" flat @click.native="save">Save</v-btn>
                    </div>

                </div>
            </div>
        </v-dialog>

        <div class="table-wrapper">
            <tm-tree
                    :items="items"
                    @itemclick="openFormElement"
            ></tm-tree>
        </div>


    </div>

</template>

<script>

    import ApiClass from '../api/api_laravel';
    import {mapGetters} from 'vuex';
    import TMTree from './TMComponents/TMList/TMTree'
    import TMInput from './TMComponents/TMInput/TMInput';
    import TMCheckbox from './TMComponents/TMCheckbox';
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
            'tm-input': TMInput,
            'tm-checkbox': TMCheckbox,
            'tm-tree': TMTree
        },
        computed: {
            ...mapGetters({
                items: 'allExpenseItemsHierarchically',
                itemslist: 'allExpenseItems'
            }),
            parent: {
                get() {

                    if (this.formData.parent_id) {
                        let parent = this.itemslist.find(item => {
                            return item.id === this.formData.parent_id;
                        });

                        return parent != undefined ? parent : null;
                    }

                    return null;
                },

                set(parent) {

                    if (parent instanceof Object && parent.hasOwnProperty('id')) {
                        this.formData.parent_id = parent.id;
                    }
                    else {
                        this.formData.parent_id = null;
                    }

                }
            }
        },

        beforeMount: function () {
            this.$store.state.title = 'Expenditure items';
            this.$store.dispatch('getAllExpenseItemsHierarchically');
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
                }

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
                this.$store.dispatch('getAllExpenseItemsHierarchically');
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
                    ? api.store('itemsexpense', this.formData)
                    : api.update('itemsexpense', this.formData.id, this.formData);


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