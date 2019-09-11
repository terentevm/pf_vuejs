<script>
    export default {
        name: "TMDataTableRow",
        props:{
            checkBox: {
                type: Boolean
            },
            headers:{
                type: Array
            },
            item: {
                type:Object
            },
            actions: {}
        },

        render: function (createElement) {

            let tds = [];

            for (let header of this.$props.headers) {


                let classList = ['lg3'];
                if (header.visibility && typeof header.visibility === 'string') {
                    classList.push(header.visibility)
                }

                let td = createElement(
                    'td',
                    {
                        attrs:{

                        },
                        class: header.classList,
                        style:"border-right: 1px solid black",
                        on: {
                            click: this.emitOpen
                        }

                    },
                    this.item[header.value],
                )

                tds.push(td)

            }

            if (this.actions) {

                let a = createElement(
                    'a',
                    {
                        class:"delete",
                        attrs: {
                            'data-togle':"modal"
                        },
                        on: {
                            click: this.emitDelete
                        },


                    },
                    [
                        createElement(
                            'i',
                            {
                                class:"material-icons",
                                attrs: {
                                    'data-togle': 'tooltip',
                                    title: 'Delete'
                                }

                            },
                            "delete"
                        )
                    ]
                );

                let td = createElement(
                    'td',
                    {
                        style:"width: 79px;border-right: 1px solid black",
                        class: "col-xs-1 col-sm-2 col-lg-1"
                    },
                    [a]

                );

                tds.push(td);
            }

            return createElement('tr',
                {},
                tds
            );

        },

        methods: {
            emitDelete(){
                this.$emit('delete');
            },

            emitOpen(){
                this.$emit('open');
            }
        }

    }
</script>

<style scoped>

    table.table-striped tbody tr:nth-of-type(odd) {
        background-color: #fcfcfc;
    }

    table.table-striped.table-hover tbody tr:hover {
        background: #f5f5f5;
    }
    table.table tr th, table.table tr td {
        border-color: #e9e9e9;
        padding: 12px 15px;
        vertical-align: middle;
        color: #566787;
        font-family: 'Varela Round', sans-serif;
    }
    table.table td:last-child i {
        opacity: 0.9;
        font-size: 22px;
        margin: 0 5px;
    }
    /*table.table tr th:first-child {*/
        /*width: 60px;*/
    /*}*/
    /*table.table tr th:last-child {*/
        /*width: 100px;*/
    /*}*/

    table.table td a {
        font-weight: bold;
        color: #566787;
        display: inline-block;
        text-decoration: none;
        outline: none !important;
    }
    table.table td a.delete {
        color: #F44336;
    }
    table.table td i {
        font-size: 19px;
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
</style>