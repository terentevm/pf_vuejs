<template>
    <div class="card" style="height: 100%">
        <div class="card-header appColor text-white">
            {{ title }}
        </div>
        <div class="card-body">
            <div class="row d-flex">
                <div class="col-xs-12">
                    <div class="d-flex flex-wrap">
                        <div class="form-group mx-1">
                            <label for="contact_name" class="tm-lable">Name:</label>
                            <tm-input
                                :id="'contact_name'"
                                v-model="name"
                                :placeholder="'Contact name'"
                                :input-type="'text'"
                                :clearable="true"
                            ></tm-input>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row d-flex">
                <div class="col-xs-12">
                    <div class="d-flex flex-wrap">
                        <div class="form-group mx-1">
                            <label for="'contact_phone'" class="tm-lable">Phone number:</label>
                            <tm-input
                                :id="'contact_phone'"
                                v-model="phone"
                                :placeholder="'Phone number'"
                                :input-type="'text'"
                                :clearable="true"
                            ></tm-input>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row d-flex">
                <div class="col-xs-12">
                    <div class="d-flex flex-wrap">
                        <div class="form-group mx-1">
                            <label for="contact_email" class="tm-lable">Email:</label>
                            <tm-input
                                :id="'contact_email'"
                                v-model="email"
                                :placeholder="'Email'"
                                :input-type="'email'"
                                :clearable="true"
                            ></tm-input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <v-progress-linear v-show="processing === true" :indeterminate="true" class="my-0"></v-progress-linear>
        <div class="card-footer text-muted">
            <div class="row d-flex justify-content-between">
                <v-btn color="blue darken-1" flat @click="close">
                    Cancel
                </v-btn>

                <v-btn :disabled="processing" color="green darken-3" flat @click="save">
                    Save
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import TMInput from '../TMComponents/TMInput/TMInput';

export default {
    name: 'ContactElement',
    components: {
        'tm-input': TMInput
    },
    data: () => ({
        formTitle: 'New',
        processing: false
    }),
    computed: {
        title() {
            if (this.$store.state.contacts.contactFormData.id !== null) {
                return this.$store.state.contacts.contactFormData.name;
            } else {
                return 'new contact';
            }
        },

        name: {
            get() {
                return this.$store.state.contacts.contactFormData.name;
            },

            set(name) {
                this.$store.commit('setContactName', name);
            }
        },
        phone: {
            get() {
                return this.$store.state.contacts.contactFormData.phone;
            },

            set(phone) {
                this.$store.commit('setContactPhone', phone);
            }
        },
        email: {
            get() {
                return this.$store.state.contacts.contactFormData.email;
            },

            set(email) {
                this.$store.commit('setContactEmail', email);
            }
        }
    },

    beforeDestroy() {
        this.$store.commit('setContactFormData', {
            id: null,
            name: '',
            phone: '',
            email: ''
        });
    },

    methods: {
        close() {
            this.$emit('close');
        },

        save() {
            this.processing = true;

            this.$store
                .dispatch('storeContact')
                .then(() => {
                    this.processing = false;
                    this.$emit('stored');
                })
                .catch(err => {
                    console.dir(err);
                    this.processing = false;
                });
        }
    }
};
</script>

<style scoped></style>
