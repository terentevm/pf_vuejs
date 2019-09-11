<!--style source https://www.tutorialrepublic.com/codelab.php?topic=bootstrap&file=crud-data-table-for-database-with-modal-form-->
<template>
    <div class="table-wrapper">
        <div class="table-title" style="z-index: 2;">
            <v-layout row>
                <v-flex xs8 sm8 md10 lg10>
                    <h2>{{ title }}</h2>
                </v-flex>
                <v-flex xs4 sm4 md2 lg2>
                    <a class="btn btn-success" data-toggle="modal" @click="addNew()">
                        <i class="material-icons">&#xE147;</i> <span>New</span>
                    </a>

                </v-flex>

            </v-layout>
        </div>
        <v-progress-linear v-show="this.processing" :indeterminate="true" class="processing">
            <p>process</p>
        </v-progress-linear>
        <v-flex xs12 sm12 md12 lg12>
        <table class="table table-striped table-hover table-responsive table-fixed">
            <thead>
            <!--<tm-table-th :headers="headers" actions=true></tm-table-th>-->

            <tr>

                <th scope="col" class="col-xs-2 col-sm-2 col-lg-2">Дата</th>


                <th scope="col" class="col-xs-2 col-sm-4 col-lg-4">Кошелек</th>
                <th scope="col" class="col-xs-2 col-sm-4 col-lg-5">Сумма</th>

                <th scope="col" class="col-xs-1 col-sm-2 col-lg-1">Действия</th>

            </tr>

            </thead>
            <tbody>

                <template v-for="item in items">
                    <tm-table-tr
                            :headers="headers"
                            :item="item"
                            actions="true"
                            @delete="deleteClicked(item)"
                            @open="open(item)"
                    >

                    </tm-table-tr>
                </template>


            </tbody>
        </table>
        </v-flex>
        <tm-modal-del
                v-show="this.showDeleteConfirmation"
                :dialog="this.showDeleteConfirmation"
                @close="closeDeleteConfirmation()"
                @confirm="confirmDel()"
        ></tm-modal-del>

    </div>

</template>

<script>
    import TMDataTableTH from './TMDataTableTH'
    import TMDataTableRow from './TMDataTableRow'
    import TMTableModalDelete from './TMTableModalDelete'
    export default {
        name: "tm-table",
        props: {
            title: {
                type: String
            },
            headers: {
                type: Array,
                required: true
            },
            items: {
                type: Array,
                required: true
            },
            processing: {
                type: Boolean
            }
        },
        components: {
            'tm-table-th': TMDataTableTH,
            'tm-table-tr': TMDataTableRow,
            'tm-modal-del': TMTableModalDelete
        },
        data: () =>({
            showDeleteConfirmation: false,
            itemForDel: null

        }),
        methods:{
            addNew() {
                this.$emit('clickNew');
            },

            open(item) {
                this.$emit('open', item);
            },

            deleteClicked(item) {
                this.itemForDel= item;
                this.showDeleteConfirmation = true;

            },
            closeDeleteConfirmation() {
                this.showDeleteConfirmation = false;
                this.itemForDel = null;
            },

            confirmDel() {
                console.log('confirm');
                console.log(this.itemForDel);
                this.showDeleteConfirmation = false;
                this.$emit('delete-item', this.itemForDel);
            }
        }

    }
</script>

<style scoped>

    .table-fixed tbody {
        height: 300px;
        overflow-y: auto;
        width: 100%;
    }

    .table-fixed tbody {
        height: 300px;
        overflow-y: auto;
        width: 100%;
    }

    .table-fixed thead,
    .table-fixed tbody,
    .table-fixed tr,
    .table-fixed td,
    .table-fixed th {
        display: block;
        border-right: 1px solid black;
    }

    .table-fixed tbody td,
    .table-fixed tbody th,
    .table-fixed thead > tr > th {
        float: left;
        position: relative;

    &::after {
         content: '';
         clear: both;
         display: block;
     }
    }

    .table-wrapper {
        position: relative;
        background: #fff;
        margin-top: -30px;
        padding: 5px 5px;
        border-radius: 3px;
        box-shadow: 0 1px 1px rgba(0,0,0,.05);

    }
    .table-title {

        background: #435d7d;
        color: #fff;
        padding: 16px 30px;
        border-radius: 3px 3px 0 0;
        position: static;
        left: inherit;
        right: inherit;
        width: inherit;
    }

    .table-title h2 {
        margin: 5px 0 0;
        font-size: 24px;
    }

    .table-title .btn-group {
        float: right;
    }

    .table-title .btn {
        color: #fff;
        float: right;
        font-size: 13px;
        border: none;
        min-width: 50px;
        border-radius: 2px;
        border: none;
        outline: none !important;
        margin-left: 10px;
    }

    .table-title .btn i {
        float: left;
        font-size: 21px;
        margin-right: 5px;
    }

    .table-title .btn span {
        float: left;
        margin-top: 2px;
    }

    table.table tr th, table.table tr td {
        border-color: #e9e9e9;
        padding: 12px 15px;
        vertical-align: middle;
    }

    table.table-striped tbody tr:nth-of-type(odd) {
        background-color: #fcfcfc;
    }

    table.table-striped.table-hover tbody tr:hover {
        background: #f5f5f5;
        cursor: pointer;
    }

    table.table th i {
        font-size: 13px;
        margin: 0 5px;
        cursor: pointer;
    }

    table.table td:last-child i {
        opacity: 0.9;
        font-size: 22px;
        margin: 0 5px;
    }

    table.table td a {
        font-weight: bold;
        color: #566787;
        display: inline-block;
        text-decoration: none;
        outline: none !important;
    }

    table.table td a:hover {
        color: #2196F3;
    }

    table.table td a.edit {
        color: #FFC107;
    }

    table.table td a.delete {
        color: #F44336;
    }

    table.table td i {
        font-size: 19px;
    }

    table.table .avatar {
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 10px;
    }

    /* Custom checkbox */
    .custom-checkbox {
        position: relative;
    }

    .custom-checkbox input[type="checkbox"] {
        opacity: 0;
        position: absolute;
        margin: 5px 0 0 3px;
        z-index: 9;
    }

    .custom-checkbox label:before {
        width: 18px;
        height: 18px;
    }

    .custom-checkbox label:before {
        content: '';
        margin-right: 10px;
        display: inline-block;
        vertical-align: text-top;
        background: white;
        border: 1px solid #bbb;
        border-radius: 2px;
        box-sizing: border-box;
        z-index: 2;
    }

    .custom-checkbox input[type="checkbox"]:checked + label:after {
        content: '';
        position: absolute;
        left: 6px;
        top: 3px;
        width: 6px;
        height: 11px;
        border: solid #000;
        border-width: 0 3px 3px 0;
        transform: inherit;
        z-index: 3;
        transform: rotateZ(45deg);
    }

    .custom-checkbox input[type="checkbox"]:checked + label:before {
        border-color: #03A9F4;
        background: #03A9F4;
    }

    .custom-checkbox input[type="checkbox"]:checked + label:after {
        border-color: #fff;
    }

    .custom-checkbox input[type="checkbox"]:disabled + label:before {
        color: #b8b8b8;
        cursor: auto;
        box-shadow: none;
        background: #ddd;
    }
</style>