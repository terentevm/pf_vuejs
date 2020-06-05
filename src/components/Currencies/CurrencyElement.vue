<template>
    <div class="tm-dialog">

        <v-toolbar color="appColor" dark class="dialog-header">
            <v-toolbar-title>Currency: {{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <svg class="lang lang-select-dropdown-item-flag" width="30px" height="30px">
                <use :xlink:href="getSvgId(formData.short_name)" />
            </svg>
        </v-toolbar>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12 sm12 md12 d-none>
                        <v-text-field v-model="formData.id" label="id"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                        <vs-input
                            label-placeholder="Code (ISO)"
                            v-model="formData.code"
                        />
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                        <vs-input
                            label-placeholder="Char code"
                            v-model="formData.short_name"
                    />
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                        <div class="con-content">
                        <vs-input
                                label-placeholder="Title"
                                v-model="formData.name"
                        />
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <vs-button
                size="xl"
                transparent
                color="blue darken-1"
                @click="close()"
            >
                Cancel
            </vs-button>
            <v-spacer></v-spacer>
            <vs-button
                size="xl"
                transparent
                :disabled="processing === true"
                color="green darken-3"
                @click="store()"
            >
                Save
            </vs-button>
        </v-card-actions>
        <v-progress-linear v-show="processing === true" :indeterminate="true">
            <p>process</p>
        </v-progress-linear>
    </v-card>
    </div>
</template>

<script>
import ApiClass from '../../api/api_laravel';
const api = ApiClass();

import VTextField from 'vuetify/lib/components/VTextField';

export default {
    name: 'CurrencyElement',

    components: {
        VTextField
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        title: 'New',
        formData: {
            id: null,
            name: '',
            code: '',
            short_name: '',
        },
        defaultItem: {
            id: null,
            name: '',
            code: '',
            short_name: '',
        },
        processing: false
    }),

    created: function() {
        this.title = this.item === null ? 'New' : this.item.short_name;

        if (this.item) {
            this.formData = Object.assign({}, this.item);
        }
    },

    methods: {
        close() {
            this.$emit('cancel');
        },

        store() {

            this.processing = true;
            let promise = null;
            if (!this.formData.id) {
                console.log('saving...');
                promise = api.store('currencies', this.formData);
            } else {
                console.log('updating...');
                promise = api.update('currencies', this.formData.id, this.formData);
            }

            promise
                .then(() => {
                    this.processing = false;
                    this.$emit('stored');
                })
                .catch(err => {
                    console.dir(err);
                    this.processing = false;
                });
        },

        getSvgId(title) {
            return `#${title.toLowerCase()}`;
        },
    },
};
</script>

<style scoped>

    .tm-dialog {
        margin-left: -16px;
        margin-right: -16px;
        margin-top: -10px;
    }

    .dialog-header{
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
</style>
