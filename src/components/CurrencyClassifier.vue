<template>
    <form>
        <div class="form-group">
            <input
                id="searchCountryFilter"
                v-model="search"
                type="search"
                class="form-control"
                aria-describedby="search"
                placeholder="enter country name or char code"
                autofocus
            >
            <small v-if="selected > 0" id="tagCount" class="form-text text-muted">
                Selected: <span>{{ selected }}</span>
            </small>
        </div>

        <v-list
            subheader
            two-line
        >
            <v-list-tile
                v-for="(item, key) in filteredList"
                :key="key"
                @click="item.selected = !item.selected"
            >
                <v-list-tile-avatar tile>
                    <svg
                        class="lang lang-select-dropdown-item-flag"
                        width="48px"
                        height="48px"
                    >
                        <use :xlink:href="getSvgId(item.short_name)" />
                    </svg>
                </v-list-tile-avatar>


                <v-list-tile-content>
                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ item.short_name }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                    <v-checkbox :input-value="item.selected"></v-checkbox>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
    </form>
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

                    let existed = this.$store.state.currencies.all.find(item => {
                        return item.short_name === currency.short_name;
                    });

                    return !existed
                        && (currency.name.toLowerCase().includes(this.search.toLowerCase())
                            || currency.short_name.toLowerCase().includes(this.search.toLowerCase()))
                });
            },

            selected() {
                let total = 0;

                return this.currencies.reduce((total, item) => {
                    if (item.selected === true) total++;
                    return total;
                }, total);


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

            getSvgId(title) {
                return `#${title.toLowerCase()}`;
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
    };
</script>

<style>
    .form-input-search {
        font-family: "Roboto", sans-serif;

        border: 0;

        box-sizing: border-box;
        font-size: 15px;
        border: thin solid #CFD8DC;
        border-radius: 4px;
    }

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
