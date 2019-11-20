<template>

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
                <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>

                <v-btn :disabled="this.processing" color="green darken-3" flat @click.native="save">
                    Save
                </v-btn>
            </div>

        </div>
    </div>

</template>

<script>
    import ApiClass from '../../api/api_laravel';
    import TMInput from '../TMComponents/TMInput/TMInput';
    import TMCheckbox from '../TMComponents/TMCheckbox';
    import {mapGetters} from 'vuex';

    const api = new ApiClass();

    export default {
        name: "ItemElement",
        props: {
            item: {
                type: Object,
                required: true,
            },

        },
        data: () => ({

            formTitle: 'New',
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
        },
        computed: {
            ...mapGetters({
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

        created() {

            this.formData = Object.assign({}, this.item);
            console.dir(this.item);
            console.dir(this.formData);
            this.title = this.item.id ? this.item.name : 'new';

        },

        methods: {

            close() {
                this.$emit('close');
            },

            save() {

                this.processing = true;

                const res_promise = this.formData.id === null
                    ? api.store('itemsincome', this.formData)
                    : api.update('itemsincome', this.formData.id, this.formData);


                res_promise.then(res => {
                    this.close();
                })
                    .catch(err => {
                        alert('Error!')
                    }).finally(() => {
                    this.processing = false;
                })
            },
        }
    }
</script>

<style scoped>

</style>