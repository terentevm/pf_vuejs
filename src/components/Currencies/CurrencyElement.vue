<template>
    <v-card>
        <v-toolbar color="appColor" dark>
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
                        <v-text-field v-model="formData.code" label="Code (ISO)"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                        <v-text-field
                            v-model="formData.short_name"
                            label="Char code"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                        <v-text-field v-model="formData.name" label="Name"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-btn color="blue darken-1" flat @click="close()">
                Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn :disabled="processing === true" color="green darken-3" flat @click="store()">
                Save
            </v-btn>
        </v-card-actions>
        <v-progress-linear v-show="processing === true" :indeterminate="true">
            <p>process</p>
        </v-progress-linear>
    </v-card>
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

<style scoped></style>
