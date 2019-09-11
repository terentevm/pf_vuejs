<template>
    <v-dialog v-model="dialog" persistent max-width="400">

            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h4 class="modal-title">Delete {{ this.modelName }}</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>

                    <div class="modal-body">
                        <p>Are you sure you want to delete these Records?</p>
                    </div>
                    <div class="modal-footer">
                        <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel" @click="$emit('close')">
                        <input type="button" class="btn btn-danger" value="Delete" @click="$emit('confirm')">
                    </div>

                </form>
            </div>

    </v-dialog>

</template>

<script>
    export default {
        name: "TMTableModalDelete",
        props:['dialog', 'processing', 'modelName']
    }
</script>

<style scoped>
    /* Modal styles */
    .modal .modal-dialog {
        max-width: 400px;
        color: #566787;
        font-family: 'Varela Round', sans-serif;
    }
    .modal .modal-header, .modal .modal-body, .modal .modal-footer {
        padding: 20px 30px;
    }
    .modal .modal-content {
        border-radius: 3px;
    }
    .modal .modal-footer {
        background: #ecf0f1;
        border-radius: 0 0 3px 3px;
    }
    .modal-title {
         display: inline-block;
         color: #566787;
         font-family: 'Varela Round', sans-serif;
         font-size: 18px;
         font-weight: 500;
    }
    .modal-body {
        display: inline-block;
        color: #566787;
        font-family: 'Varela Round', sans-serif;
        font-size: 13px;

    }

    .modal-footer {
        border-top-color: rgb(229, 229, 229);
        background-color: rgb(236, 240, 241);
    }
    .modal .form-control {
        border-radius: 2px;
        box-shadow: none;
        border-color: #dddddd;
    }
    .modal textarea.form-control {
        resize: vertical;
    }
    .modal .btn {
        border-radius: 2px;
        min-width: 100px;
    }
    .modal form label {
        font-weight: normal;
        color: #566787;
        font-family: 'Varela Round', sans-serif;
    }

    .processing {
        margin-top: 0px;
        mapgin-bottom: 0px;
    }
</style>