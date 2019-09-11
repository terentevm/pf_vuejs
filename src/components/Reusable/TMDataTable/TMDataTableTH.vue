<script>
    export default {
        name: "TMDataTableTH",
        props:{
            headers:{
                type: Array
            },
            actions: {}

        },

        render: function (createElement) {

            let ths = [];


            for (let header of this.$props.headers) {


                let classList = ['col-3'];
                if (header.visibility && typeof header.visibility === 'string') {
                    classList.push(header.visibility)
                }

                let td = createElement(
                    'th',
                    {
                        class: header.classList,
                        attrs:{

                        },
                        style:"border-right: 1px solid black"

                    },
                    header.text,
                )

                ths.push(td)

            }
            let classList = ['col-2'];
            if (this.actions) {
                let td = createElement(
                    'th',
                    {
                        class: classList,
                        style:"border-right: 1px solid black",

                    },
                    "Actions",
                )

                ths.push(td)
            }

            return createElement('tr',
                {

                },
                ths
            );

        },

        methods: {

        }

    }
</script>

<style scoped>

    table.table tr th, table.table tr td {
        border-color: #e9e9e9;
        padding: 12px 15px;
        vertical-align: middle;
        color: #566787;
        font-family: 'Varela Round', sans-serif;

    }
    /*table.table tr th:first-child {*/
        /*width: 60px;*/
        /*border:1px solid #000;*/
    /*}*/
    /*table.table tr th:last-child {*/
        /*width: 100px;*/
    /*}*/
    table.table-striped tbody tr:nth-of-type(odd) {
        background-color: #fcfcfc;
    }
    table.table-striped.table-hover tbody tr:hover {
        background: #f5f5f5;
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
</style>