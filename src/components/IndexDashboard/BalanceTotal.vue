<template>
    <v-hover>
        <v-card slot-scope="{ hover }" class="mx-1">
            <v-card-title
                    class="dash-card-header-title"

            >
                Balance
            </v-card-title>
            <v-divider light></v-divider>

            <v-layout>
                <v-flex xs7>
                    <v-card-title >
                        <div>
                            <div class="headline">{{ balanceRounded }}</div>
                            <div class="grey--text">{{ balanceCurrency.short_name }}</div>
                        </div>
                    </v-card-title>
                </v-flex>

                <v-flex xs5 d-flex justify-space-around>
                    <img src="../../assets/balance.svg" height="64px" width="64px"/>
                </v-flex>
            </v-layout>


        </v-card>
    </v-hover>
</template>

<script>

    import MyNum from '../../helpers/MyNum';

    export default {
        props: ['totalBalance', 'balanceCurrency'],

        computed: {
            balanceRounded: function () {
                return MyNum.round2(this.totalBalance);
            },
        },
    };
</script>

<style>
    .dash-card-header-title {
        color: rgb(86, 103, 135);;
        font-family: 'Varela Round', sans-serif;
        font-size: 25px;
        height: 50px;
    }
</style>
