<template>

    <v-layout row>

        <v-dialog v-if="dialog" v-model="dialog" max-width="500" persistent
                  :fullscreen="$vuetify.breakpoint.smAndDown">
            <tm-item :item="formData" v-on:close="close"></tm-item>
        </v-dialog>

        <div class="table-wrapper">
            <tm-tree
                    :items="items"
                    @itemclick="openFormElement"
            ></tm-tree>
        </div>


    </v-layout>

</template>

<script>

    import ApiClass from '../../api/api_laravel';
    import {mapGetters} from 'vuex';
    import TMTree from '../TMComponents/TMList/TMTree';
    import ItemElement from './ItemElement';

    const api = new ApiClass();

    export default {
        data: () => ({
            headers: [{text: 'Name', value: 'name'}],
            dialog: false,
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
            'tm-tree': TMTree,
            'tm-item': ItemElement
        },
        computed: {
            ...mapGetters({
                items: 'allIncomeItemsHierarchically',
                itemslist: 'allIncomeItems'
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

                this.dialog = true;
            },


            close() {
                this.dialog = false;
                this.update();
            },


        },
    };
</script>