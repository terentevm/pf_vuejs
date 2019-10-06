<template>
    <v-layout row>
        <v-flex xs12 sm12 lg12>
            <v-card>
                <v-card-text>
                    <v-layout row>
                        <v-flex xs12 sm12 lg12>
                            <v-text-field
                                    v-model="search"
                                    label="search"
                                    outline


                            >
                            </v-text-field>
                        </v-flex>

                    </v-layout>
                </v-card-text>


                <v-list
                        subheader
                        two-line
                >

                    <v-list-tile
                            v-for="(item, key) in filteredList"
                            v-bind:key="item.id"
                            @click="item.selected = !item.selected">
                        <v-list-tile-action>
                            <v-checkbox :input-value="item.selected"></v-checkbox>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ item.short_name }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        data: () => ({
            search: '',
            process: false,
            loader: null,
        }),

        computed: {
            ...mapGetters({
                currencies: 'classifier',
            }),
            filteredList() {
                return this.$store.state.currencies.classifier.filter(currency => {
                    console.dir(this.$store.state.currencies.all);

                    let existed = this.$store.state.currencies.all.find(item => {
                        return item.short_name == currency.short_name;
                    });

                    return !existed && currency.name.toLowerCase().includes(this.search.toLowerCase())
                });
            }
        },

        beforeMount: function () {
            this.$store.state.title = 'Currencies (classifier)';
            this.$store.dispatch('getCurrencyClassifier');
            this.$store.commit('setupToolbarMenu', this.getUpMenu());
        },

        methods: {
            getUpMenu() {
                return {
                    mainAction: {
                        title: 'Save',
                        icon: 'done',
                        action: () => {
                            this.save();
                        },
                    },
                    menu: [
                        {
                            title: 'close',
                            icon: 'reply',
                            action: () => {
                                this.cancel();
                            }
                        }
                    ]
                };
            },

            save() {
                let selected = this.currencies.filter(item => {
                    return item.selected === true;
                });

                let promises = [];

                for (let currency of selected) {
                    promises.push(this.$store.dispatch('storeCurrency', currency));
                }

                Promise.all(promises).then(values => {
                    console.dir(values);
                    this.cancel();
                });
            },

            cancel() {
                this.$router.push({path: '/currencies'});
            }

        },

        watch: {
            loader() {
                const l = this.loader;
                this[l] = !this[l];

                setTimeout(() => (this[l] = false), 3000);

                this.loader = null;
            },
        },
    };
</script>

<style>
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }

    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
