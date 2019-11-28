<template>
    <div class="row">
        <v-dialog
            v-if="showElementForm"
            v-model="showElementForm"
            max-width="500px"
            persistent
            :fullscreen="$vuetify.breakpoint.xsOnly"
        >
            <wallet-element
                :item="editedItem"
                @cancel="showElementForm = false"
                @stored="showElementForm = false; update()"
            ></wallet-element>
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
                                    <span>Currency</span>
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

                                <v-flex xs6 sm6>
                                    <span>{{ item.currency.short_name }}</span>
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
    import WalletElement from './WalletElement';
    import {mapGetters} from 'vuex';
    import ApiClass from '../../api/api_laravel';
    import TMTableModalDelete from '../TMComponents/TMDataTable/TMTableModalDelete'


    const api = new ApiClass();

    export default {
        components: {
            'wallet-element': WalletElement,
            'tm-modal-del': TMTableModalDelete
        },
        data: () => ({
            showElementForm: false,
            modelName: 'wallet',
            showDeleteConfirmation: false,
            itemForDel: null,
            dialogCB: false,
            formTitle: 'New',
            title: 'Wallets',
            processing: false,
            offsetTop: 0,
            offset: 0,
            updating: false,
            curr: null,
            headers: [
                {text: 'id', value: 'id', classList: ['d-none']},
                {text: 'Name', value: 'name', classList: ['lg5']},
                {text: 'Currency', value: 'currencyName', classList: ['lg5']},
            ],
            element_id: '',
            editedIndex: -1,
            editedItem: null,
            newItem: {
                id: null,
                name: '',
                currency_id: '',
                currency: null,
                is_creditcard: false,
                grace_period: 0,
                credit_limit: 0,
                currentBalance: 0,
                newBalance: 0,
            },
            msgSettings: {
                show: false,
                color: 'light-green darken-3',
                mode: 'vertical',
                timeout: 6000,
                msg: '',
            },
        }),
        computed: {
            ...mapGetters({
                items: 'allWalletsList',

            }),
        },

        watch: {
            dialog(val) {
                val || this.close();
            },
        },
        beforeMount: function () {
            this.$store.state.title = 'Wallets';
            this.$store.dispatch('getAllWalletsList');

            this.$store.commit('setupToolbarMenu', this.getUpMenu());
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

            update() {
                if (this.updating === false) {
                    this.updating = true;
                    this.$store.dispatch('getAllWalletsList');
                    this.updating = false;
                }
            },

            edit(item) {

                this.element_id = item.id;

                api.show('wallets', item.id, {withbalance: true})
                    .then(wallet => {
                        console.dir(wallet);
                        this.editedItem = Object.assign({}, wallet);
                        this.showElementForm = true;

                    })
                    .catch(err => {
                        console.dir(err);
                    });


            },

            add() {
                this.editedItem = Object.assign({}, this.newItem);
                this.showElementForm = true;
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

                api.delete('wallets', this.itemForDel.id)
                    .then(() => {
                        alert(`${this.itemForDel.name} was deleted!`);
                        this.$store.dispatch('getAllWalletsList');

                    })
                    .catch(() => {
                        alert(`${this.itemForDel.name} wasn't deleted!`);
                    })
                    .finally(() => {
                        this.itemForDel = null;
                        this.processing = false;
                    });
            },

            close() {
                this.dialog = false;
                this.formTitle = 'New';
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300);
            },

            save() {
                let ok = this.sendData(this.editedItem);
                if (ok) {
                    this.close();
                    this.items = [];
                    this.getItems(this.offset);
                }
            },
            showMsg(success) {
                this.msgSettings.color = success ? 'light-green darken-3' : 'orange darken-4';
                this.msgSettings.msg = success ? 'Saved/Updated successfully!' : 'Error';
                this.msgSettings.show = true;
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