<template>
    <v-layout row>
        <v-dialog
            v-if="dialog"
            v-model="dialog"
            max-width="500"
            persistent
            :fullscreen="$vuetify.breakpoint.smAndDown"
        >
            <contact-element @close="dialog = false" @stored="contactOnStored"></contact-element>
        </v-dialog>

        <div class="table-wrapper">
            <tm-tree :items="contacts" @itemclick="openFormElement"></tm-tree>
        </div>
    </v-layout>
</template>

<script>
    import TMTree from '../TMComponents/TMList/TMTree';
    import ContactElement from './ContactElement';
    import {mapGetters} from 'vuex';

    export default {
        name: 'ContactsList',
        components: {
            'tm-tree': TMTree,
            'contact-element': ContactElement
        },

        data: () => ({
            dialog: false
        }),
        computed: {
            ...mapGetters({
                contacts: 'contacts'
            })
        },
        async beforeMount() {
            this.$store.state.title = 'Contacts';
            this.$store.commit('setupToolbarMenu', this.getUpMenu());
            await this.$store.dispatch('getContacts');
        },

        methods: {
            getUpMenu() {
                return {
                    mainAction: {
                        title: 'add',
                        icon: 'add',
                        action: () => {
                            this.add();
                        }
                    },
                    menu: [
                        {
                            title: 'update',
                            icon: 'update',
                            action: () => {
                                this.update();
                            }
                        }
                    ]
                };
            },

            add() {
                this.dialog = true;
            },

            contactOnStored() {
                this.dialog = false;
                this.update();
            },

            async update() {
                await this.$store.dispatch('getContacts');
            },

            openFormElement(contact) {
                this.$store.dispatch('editContact', contact).then(() => {
                    this.dialog = true;
                });
            }
        }
    };
</script>

<style scoped></style>
