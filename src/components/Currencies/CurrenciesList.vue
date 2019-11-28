<template>
    <div class="row">
        <v-flex xs12 sm12 md12 lg12>
            <v-dialog
                v-if="dialog"
                v-model="dialog"
                max-width="500px"
                persistent
                :fullscreen="$vuetify.breakpoint.xsOnly"
            >
                <currency-element
                    :item="formData"
                    @cancel="dialog = false"
                    @stored="dialog = false; update()"
                ></currency-element>
            </v-dialog>
            <div class="table-wrapper">
                <ul class="list-group list-group-flush">
                    <li
                        class="list-group-item list-header"
                    >
                        <v-layout row ml-3>
                            <v-flex xs10 sm10 md10 lg11 class="cell">
                                <v-layout row>
                                    <v-flex xs6 sm6>
                                        <span>Name</span>
                                    </v-flex>
                                    <v-flex xs3 sm3>
                                        <span>Code</span>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <span>Char code</span>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs2 sm2 md2 lg1>
                                <div class="cell-actions justify-content-end">
                                    <span>Act.</span>
                                </div>
                            </v-flex>
                        </v-layout>
                    </li>
                    <li
                        v-for="item in items"
                        :key="item.id"
                        class="list-group-item list-item"
                        @click="edit(item)"
                    >
                        <v-layout row ml-3>
                            <v-flex xs10 sm10 md10 lg11 class="cell">
                                <v-layout row>
                                    <v-flex xs6 sm6>
                                        <span>{{ item.name }}</span>
                                    </v-flex>
                                    <v-flex xs3 sm3>
                                        <span>{{ item.code }}</span>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <span>{{ item.short_name }}</span>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs2 sm2 md2 lg1>
                                <div class="cell-actions justify-content-end">
                                    <a
                                        class="delete"
                                        data-toggle="modal"
                                        @click.stop.prevent="showDeleteConfirm(item)"
                                    >

                                        <v-icon color="#F44336">delete</v-icon>
                                    </a>
                                </div>
                            </v-flex>
                        </v-layout>
                    </li>
                </ul>
            </div>
        </v-flex>

        <tm-modal-del
            v-show="showDeleteConfirmation"
            :dialog="showDeleteConfirmation"
            :model-name="modelName"
            @close="closeDeleteConfirmation()"
            @confirm="deleteItem"
        ></tm-modal-del>
    </div>
</template>

<script>
    import ApiClass from '../../api/api_laravel';
    import currencyElement from './CurrencyElement';
    import {mapGetters} from 'vuex';
    import TMTableModalDelete from '../TMComponents/TMDataTable/TMTableModalDelete'

    const api = ApiClass();

    export default {
        components: {
            'currency-element': currencyElement,
            'tm-modal-del': TMTableModalDelete
        },
        data: () => ({
            title: 'Currencies',
            modelName: 'currency',
            showDeleteConfirmation: false,
            itemForDel: null,
            dialog: false,
            id: null,
            editItem: null,
            updating: false,
            processing: false,
            headers: [
                {text: 'id', value: 'id', visibility: 'd-none'},
                {text: 'Code', value: 'code', visibility: ''},
                {text: 'Name', value: 'name', visibility: ''},
                {
                    text: 'Short name',
                    value: 'short_name',
                    visibility: 'hidden-md-and-down',
                    sortable: false,
                    class: 'th_font'
                },
            ],

            editedIndex: -1,
            formData: {
                id: null,
                name: '',
                code: '',
                short_name: '',
            },
            msgSettings: {
                show: false,
                color: 'light-green darken-3',
                mode: 'vertical',
                timeout: 6000,
                msg: '',
            },
        }),
        computed: mapGetters({
            items: 'allCurrencies',
        }),

        created: function () {
            this.$store.commit('setupToolbarMenu', this.getUpMenu());
        },

        beforeMount: function () {
            this.$store.state.title = 'Currencies';
            this.$store.dispatch('getAllCurrencies');

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
                        },
                        {
                            title: 'Load rates',
                            icon: 'cloud_download',
                            action: () => {
                                this.$router.push({path: 'loadrates'});
                            },
                        },
                        {
                            title: 'add from classifier',
                            icon: 'cloud_download',
                            action: () => {
                                this.$router.push({path: 'loadcurrency'});
                            },
                        }
                    ]
                }

            },

            update() {
                if (this.updating === false) {
                    this.items = [];
                    this.updating = true;
                    this.$store.dispatch('getAllCurrencies');
                    this.updating = false;
                }
            },


            edit(item) {

                this.id = item.id;
                this.editedIndex = this.items.indexOf(item);
                this.formData = Object.assign({}, item);

                this.dialog = true;
            },

            add() {
                this.id = null;

                this.formData = {
                    id: null,
                    name: '',
                    code: '',
                    short_name: '',
                };

                this.dialog = true;
            },

            showDeleteConfirm(item) {
                this.itemForDel = item;
                this.showDeleteConfirmation = true;
            },

            closeDeleteConfirmation() {
                this.showDeleteConfirmation = false;
                this.itemForDel = null;
            },


            deleteItem() {
                this.showDeleteConfirmation = false;

                this.processing = true;

                api.delete('currencies', this.itemForDel.id)
                    .then(() => {
                        alert(`${this.itemForDel.name} was deleted!`);
                        this.$store.dispatch('getAllCurrencies');

                    })
                    .catch(() => {
                        alert(`${this.itemForDel.name} wasn't deleted!`);
                    })
                    .finally(() => {
                        this.itemForDel = null;
                        this.processing = false;
                    });
            }


        },
    };
</script>

<style scoped>


    li:nth-of-type(odd) {
        background-color: #fcfcfc;
    }

    li:first-child {
        background: #435d7d;
    }

    .list-header {

        background: #435d7d;
        color: #fff;
        font-family: 'Varela Round', sans-serif;
        font-size: 15px;
        font-weight: bold;

    }

    .list-item {
        color: rgb(86, 103, 135);;
        font-family: 'Varela Round', sans-serif;
        font-size: 15px;

    }

    .list-item:hover {
        cursor: pointer;
        background-color: rgb(245, 245, 245);

    }

    list-item:nth-of-type(odd) {
        background-color: #fcfcfc;
    }

    list-item:hover {
        background: #f5f5f5;
    }

    .cell-actions {
        display: flex;
        flex-direction: row;
        justify-items: center;
        max-width: 60px;
    }
</style>
