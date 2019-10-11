<template>
    <v-card class="mx-1 mt-2">
        <v-card-title>
            <div><span class="grey--text">Balance </span><br/></div>
        </v-card-title>

        <v-divider light></v-divider>

        <v-layout row>
            <v-flex xs12>
                <ul class="list">
                    <li v-for="item in balanceAll">
                        <div class="list-row">

                            <div class="list-column-content">
                                <div class="list-row-content">
                                    <span>{{ item.wallet_name }}</span>
                                </div>
                                <div class="list-row-content content-second">
                                    <span>{{ item.currency_char_code }}</span>
                                </div>
                            </div>

                            <div class="list-column-sum">
                                <div class="list-row-sum">
                                    <span>{{ item.reportBalance }}</span>
                                </div>

                                <div class="list-row-sum content-second">
                                    <span>{{ item.balance }}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>

    export default {

        computed: {
            balanceAll: {
                get() {
                    return this.$store.state.dashboard.balanceByWallets.filter(item => {
                        return Number(item.balance) != 0
                    });
                }
            }
        },


    };
</script>

<style scoped>
    .list {
        list-style: none;
    }

    .list-row {
        display: flex;
        flex-direction: row;
        flex-grow: 5;
        justify-content: flex-start;
        height: 50px;
        margin-top: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;

    }

    .list-row:hover {
        background-color: rgb(240, 240, 240);
    }

    .list-column-content {
        display: flex;
        flex-direction: column;
        flex-grow: 3;

    }

    .list-row-content {
        display: flex;
        flex-direction: row;
        align-items: center;

        flex-grow: 3;

        font-family: 'Roboto';
        font-weight: 400;
        font-size: 1rem;
        color: #43425d;
    }

    .list-column-sum {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .list-row-sum {
        display: flex;
        flex-direction: row;
        /* flex-grow: 1; */
        justify-content: right;
        align-items: center;
        margin-right: 20px;
        font-family: 'Roboto';
        font-weight: 400;
        font-size: 1rem;
        color: #43425d;
    }

    .content-second {
        font-size: 1rem;
        color: darkgrey;
    }
</style>
