<template>
    <v-card class="mx-1">
        <v-card-title class="dash-card-header-title">
            Expenses
        </v-card-title>

        <v-divider light></v-divider>

        <v-layout>
            <v-flex xs7>
                <v-card-title>
                    <div>
                        <div class="headline">{{ expensesRounded }}</div>
                        <div class="grey--text">{{ expenseCurrency.short_name }}</div>
                    </div>
                </v-card-title>
            </v-flex>

            <v-flex xs5 d-flex justify-space-around>
                <img src="../../assets/graph_expenses.svg" height="64px" width="64px"/>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>

    import Mynum from '../../helpers/MyNum';

    export default {
        props: ['totalExpenses', 'expenseCurrency'],
        computed: {
            expensesRounded: function () {
                return Mynum.round2(this.totalExpenses);
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
